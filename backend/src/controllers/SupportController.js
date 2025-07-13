class SupportController {
    constructor() {
        // Initialize service cache
        this._ticketService = null;
        this._container = null;
    }

    get container() {
        if (!this._container) {
            this._container = require('../container');
        }
        return this._container;
    }

    get ticketService() {
        if (!this._ticketService) {
            try {
                if (!this.container.has('ticketService')) {
                    throw new Error('TicketService not available in container');
                }
                this._ticketService = this.container.get('ticketService');
            } catch (error) {
                console.error('Failed to get ticketService:', error.message);
                throw new Error(`Service initialization failed: ${error.message}`);
            }
        }
        return this._ticketService;
    }

    async makeEnquiry(req, res, next) {
        try {
            const { subject, description } = req.body;
            const userId = req.user?.userId;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const files = req.files || [];
            const ticket = await this.ticketService.createTicket(userId, subject, description, files);

            res.json({
                success: true,
                data: {
                    ticket_id: ticket.id,
                    attachments: ticket.attachments || [],
                    message: 'Enquiry submitted successfully'
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getTickets(req, res, next) {
        try {
            const userId = req.user?.userId;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                status: req.query.status,
                sortBy: req.query.sort_by || 'created_at',
                sortOrder: req.query.sort_order || 'desc'
            };

            const tickets = await this.ticketService.getUserTickets(userId, options);

            const formattedTickets = tickets.map(ticket => ({
                id: ticket.id,
                subject: ticket.subject,
                description: ticket.description,
                issued_at: new Date(ticket.createdAt).toISOString().split('T')[0],
                status: ticket.status
            }));

            res.json({
                success: true,
                data: formattedTickets
            });
        } catch (error) {
            next(error);
        }
    }

    async getTicketById(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const ticketId = req.params.ticket_id;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const ticket = await this.ticketService.getTicketById(ticketId, userId, userRole);

            const formattedTicket = {
                id: ticket.id,
                subject: ticket.subject,
                description: ticket.description,
                status: ticket.status,
                assigned_to: ticket.assignedTo,
                issued_at: new Date(ticket.createdAt).toISOString().split('T')[0],
                created_at: new Date(ticket.createdAt).toISOString().split('T')[0],
                resolution_time: ticket.resolutionTime,
                user_id: ticket.userId,
                responses: ticket.comments?.map(comment => ({
                    id: comment.id,
                    message: comment.comment,
                    user: comment.user,
                    date: new Date(comment.createdAt).toISOString().split('T')[0]
                })) || [],
                attachments: ticket.attachments?.map(attachment => ({
                    id: attachment.id,
                    file_name: attachment.fileName,
                    content_type: attachment.contentType,
                    s3_key: attachment.s3Key
                })) || []
            };

            // Add customer information when viewed by admin
            if (userRole === 'admin' && ticket.customer) {
                formattedTicket.customer = ticket.customer;
            }

            res.json({
                success: true,
                data: formattedTicket
            });
        } catch (error) {
            if (error.message === 'Ticket not found' || error.message.includes('permission')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    async addTicketComment(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const ticketId = req.params.ticket_id;
            const { comment } = req.body;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const newComment = await this.ticketService.addComment(ticketId, userId, userRole, comment);

            res.json({
                success: true,
                data: newComment
            });
        } catch (error) {
            if (error.message === 'Ticket not found' || error.message.includes('permission')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            
            if (error.message.includes('empty') || error.message.includes('closed')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(error);
        }
    }

    async getAttachmentUrl(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const s3Key = req.params.s3Key;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const result = await this.ticketService.getAttachmentUrl(s3Key, userId, userRole);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            if (error.message.includes('not found') || error.message.includes('permission')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    async streamAttachment(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const s3Key = req.params.s3Key;
            
            if (!userId) {
                return res.status(400).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const result = await this.ticketService.streamAttachment(s3Key, userId, userRole);

            res.setHeader('Content-Disposition', `inline; filename="${result.fileName}"`);
            res.setHeader('Content-Type', result.contentType);

            result.stream.pipe(res);

            result.stream.on('error', (error) => {
                next(error);
            });
        } catch (error) {
            if (error.message.includes('not found') || error.message.includes('permission')) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    async getAllTickets(req, res, next) {
        try {
            const options = {
                page: Math.max(1, parseInt(req.query.page) || 1),
                limit: Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)),
                status: req.query.status,
                search: req.query.search,
                userId: req.query.user_id,
                sortBy: req.query.sort_by || 'created_at',
                sortOrder: req.query.sort_order || 'desc',
                dateFrom: req.query.date_from,
                dateTo: req.query.date_to
            };

            const result = await this.ticketService.getAllTickets(options);

            const formattedTickets = result.tickets.map(ticket => ({
                id: ticket.id,
                user_id: ticket.userId,
                subject: ticket.subject,
                description: ticket.description,
                status: ticket.status,
                assigned_to: ticket.assignedTo,
                created_at: new Date(ticket.createdAt).toISOString().split('T')[0],
                updated_at: new Date(ticket.updatedAt).toISOString().split('T')[0],
                resolution_time: ticket.resolutionTime,
                customer: ticket.customer
            }));

            const stats = await this.ticketService.getTicketStatistics();

            res.json({
                success: true,
                data: {
                    tickets: formattedTickets,
                    pagination: result.pagination,
                    stats: {
                        total: stats.total,
                        open: stats.open,
                        in_progress: stats.in_progress,
                        resolved: stats.resolved,
                        closed: stats.closed
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async updateTicketStatus(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const ticketId = req.params.ticket_id;
            const { status } = req.body;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const updatedTicket = await this.ticketService.updateTicketStatus(ticketId, status, userId, userRole);

            res.json({
                success: true,
                data: {
                    ticket_id: updatedTicket.id,
                    status: updatedTicket.status,
                    message: 'Ticket status updated successfully'
                }
            });
        } catch (error) {
            if (error.message === 'Ticket not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            
            if (error.message.includes('administrator') || error.message.includes('Invalid status')) {
                return res.status(403).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(error);
        }
    }

    async deleteTicket(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const ticketId = req.params.ticket_id;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            await this.ticketService.deleteTicket(ticketId, userId, userRole);

            res.json({
                success: true,
                message: 'Ticket deleted successfully'
            });
        } catch (error) {
            if (error.message === 'Ticket not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            
            if (error.message.includes('administrator')) {
                return res.status(403).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(error);
        }
    }

    async assignTicket(req, res, next) {
        try {
            const userId = req.user?.userId;
            const userRole = req.user?.role;
            const ticketId = req.params.ticket_id;
            const { assigned_to } = req.body;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: 'User authentication required'
                });
            }

            const updatedTicket = await this.ticketService.assignTicket(ticketId, assigned_to, userId, userRole);

            res.json({
                success: true,
                data: {
                    ticket_id: updatedTicket.id,
                    assigned_to: updatedTicket.assignedTo,
                    message: 'Ticket assigned successfully'
                }
            });
        } catch (error) {
            if (error.message === 'Ticket not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            
            if (error.message.includes('administrator') || error.message.includes('admin users')) {
                return res.status(403).json({
                    success: false,
                    message: error.message
                });
            }
            
            next(error);
        }
    }
}

module.exports = new SupportController(); 