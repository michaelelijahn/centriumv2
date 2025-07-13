const Ticket = require('../models/Ticket');

class TicketService {
    constructor(ticketRepository, fileUploadService, userRepository) {
        this.ticketRepository = ticketRepository;
        this.fileUploadService = fileUploadService;
        this.userRepository = userRepository;
    }

    async createTicket(userId, subject, description, files = []) {
        // Create and validate the ticket using domain model
        const ticket = Ticket.create(userId, subject, description);
        
        // Verify user exists and is active
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        if (!user.isActive()) {
            throw new Error('User account is not active');
        }

        // Create the ticket in database
        const createdTicket = await this.ticketRepository.create({
            userId: ticket.userId,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status
        });

        // Handle file attachments if provided
        const attachments = [];
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    const uploadResult = await this.fileUploadService.uploadFile(
                        file,
                        userId,
                        createdTicket.id
                    );

                    const attachment = await this.ticketRepository.addAttachment(
                        createdTicket.id,
                        {
                            s3Key: uploadResult.key,
                            contentType: uploadResult.contentType,
                            fileName: uploadResult.originalName
                        }
                    );

                    attachments.push(attachment);
                } catch (uploadError) {
                    // Log the error but don't fail the entire operation
                    console.error('Failed to upload attachment:', uploadError);
                    throw new Error(`Failed to upload file: ${file.originalname}`);
                }
            }
        }

        // Return the complete ticket with attachments
        createdTicket.attachments = attachments;
        return createdTicket;
    }

    async getTicketById(ticketId, userId, userRole) {
        const ticket = await this.ticketRepository.findByIdWithDetails(ticketId, userRole);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Check access permissions
        if (!ticket.canBeAccessedBy(userId, userRole)) {
            throw new Error('You do not have permission to view this ticket');
        }

        return ticket;
    }

    async getUserTickets(userId, options = {}) {
        // Validate user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return this.ticketRepository.findByUserId(userId, options);
    }

    async getAllTickets(options = {}) {
        const tickets = await this.ticketRepository.findAll(options);
        const totalCount = await this.ticketRepository.countAll(options);
        
        return {
            tickets,
            totalCount,
            pagination: {
                page: options.page || 1,
                limit: options.limit || 10,
                totalPages: Math.ceil(totalCount / (options.limit || 10))
            }
        };
    }

    async addComment(ticketId, userId, userRole, comment) {
        // Get the ticket first
        const ticket = await this.ticketRepository.findById(ticketId);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Check permissions
        if (!ticket.canBeUpdatedBy(userId, userRole)) {
            throw new Error('You do not have permission to comment on this ticket');
        }

        // Use domain model business logic for comment validation
        try {
            ticket.addComment(userId, comment);
        } catch (error) {
            throw error; // Re-throw validation errors
        }

        // If ticket status changed due to comment (resolved -> in_progress)
        if (ticket.status === 'in_progress') {
            await this.ticketRepository.update(ticketId, { status: 'in_progress' });
        }

        // Add comment to database
        const newComment = await this.ticketRepository.addComment(ticketId, userId, comment);

        // Format response based on user role
        let displayName = 'You';
        if (userRole === 'admin' && ticket.userId !== userId) {
            displayName = 'Support Agent';
        }

        return {
            id: newComment.id,
            message: newComment.comment,
            user: displayName,
            date: new Date(newComment.createdAt).toISOString().split('T')[0]
        };
    }

    async updateTicketStatus(ticketId, newStatus, userId, userRole) {
        // Only admins can update ticket status
        if (userRole !== 'admin') {
            throw new Error('Only administrators can update ticket status');
        }

        const ticket = await this.ticketRepository.findById(ticketId);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Use domain model validation
        try {
            ticket.updateStatus(newStatus);
        } catch (error) {
            throw error; // Re-throw validation errors
        }

        // Update in database
        const updateData = {
            status: ticket.status,
            resolutionTime: ticket.resolutionTime
        };

        return this.ticketRepository.update(ticketId, updateData);
    }

    async getTicketStatistics() {
        return this.ticketRepository.getStatistics();
    }

    async getAttachmentUrl(s3Key, userId, userRole) {
        // Find the attachment and verify access
        const attachment = await this.ticketRepository.findAttachmentByS3Key(
            s3Key, 
            userRole === 'admin' ? null : userId
        );

        if (!attachment) {
            throw new Error('Attachment not found or you do not have permission to access it');
        }

        // Generate signed URL
        const signedUrl = await this.fileUploadService.getSignedUrl(s3Key);

        return {
            url: signedUrl,
            fileName: attachment.fileName,
            contentType: attachment.contentType
        };
    }

    async streamAttachment(s3Key, userId, userRole) {
        // Find the attachment and verify access
        const attachment = await this.ticketRepository.findAttachmentByS3Key(
            s3Key, 
            userRole === 'admin' ? null : userId
        );

        if (!attachment) {
            throw new Error('Attachment not found or you do not have permission to access it');
        }

        // Get stream from file service
        const stream = await this.fileUploadService.getFileStream(s3Key);

        return {
            stream,
            fileName: attachment.fileName,
            contentType: attachment.contentType
        };
    }

    async assignTicket(ticketId, assignedToUserId, assigningUserId, userRole) {
        // Only admins can assign tickets
        if (userRole !== 'admin') {
            throw new Error('Only administrators can assign tickets');
        }

        const ticket = await this.ticketRepository.findById(ticketId);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Verify assigned user exists and is admin
        if (assignedToUserId) {
            const assignedUser = await this.userRepository.findById(assignedToUserId);
            if (!assignedUser || !assignedUser.isAdmin()) {
                throw new Error('Can only assign tickets to admin users');
            }
        }

        return this.ticketRepository.update(ticketId, {
            assignedTo: assignedToUserId
        });
    }

    async deleteTicket(ticketId, userId, userRole) {
        // Only admins can delete tickets
        if (userRole !== 'admin') {
            throw new Error('Only administrators can delete tickets');
        }

        const ticket = await this.ticketRepository.findById(ticketId);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        // Delete all associated files from S3
        if (ticket.attachments && ticket.attachments.length > 0) {
            for (const attachment of ticket.attachments) {
                try {
                    await this.fileUploadService.deleteFile(attachment.s3Key);
                } catch (error) {
                    console.error('Failed to delete S3 file:', attachment.s3Key, error);
                    // Continue with deletion even if S3 cleanup fails
                }
            }
        }

        return this.ticketRepository.delete(ticketId);
    }

    async searchTickets(searchQuery, options = {}) {
        if (!searchQuery || searchQuery.trim().length === 0) {
            return this.getAllTickets(options);
        }

        const searchOptions = {
            ...options,
            search: searchQuery.trim()
        };

        return this.getAllTickets(searchOptions);
    }

    async getTicketsByStatus(status, options = {}) {
        const statusOptions = {
            ...options,
            status
        };

        return this.getAllTickets(statusOptions);
    }

    async getTicketsInDateRange(startDate, endDate, options = {}) {
        const dateOptions = {
            ...options,
            dateFrom: startDate,
            dateTo: endDate
        };

        return this.getAllTickets(dateOptions);
    }

    // Business logic for ticket escalation
    async escalateTicket(ticketId, userId, userRole) {
        if (userRole !== 'admin') {
            throw new Error('Only administrators can escalate tickets');
        }

        const ticket = await this.ticketRepository.findById(ticketId);
        
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        if (ticket.status === 'closed') {
            throw new Error('Cannot escalate a closed ticket');
        }

        // Business logic: escalated tickets go to in_progress status
        return this.updateTicketStatus(ticketId, 'in_progress', userId, userRole);
    }

    // Get ticket metrics for reporting
    async getTicketMetrics(options = {}) {
        const { dateFrom, dateTo } = options;
        
        const baseStats = await this.getTicketStatistics();
        
        // Add time-based filtering if dates provided
        if (dateFrom || dateTo) {
            const filteredTickets = await this.ticketRepository.findAll({
                dateFrom,
                dateTo,
                limit: 1000 // Get all for calculations
            });

            const timeBasedStats = {
                total: filteredTickets.length,
                open: filteredTickets.filter(t => t.status === 'open').length,
                in_progress: filteredTickets.filter(t => t.status === 'in_progress').length,
                resolved: filteredTickets.filter(t => t.status === 'resolved').length,
                closed: filteredTickets.filter(t => t.status === 'closed').length
            };

            return {
                overall: baseStats,
                filtered: timeBasedStats,
                dateRange: { dateFrom, dateTo }
            };
        }

        return {
            overall: baseStats
        };
    }
}

module.exports = TicketService; 