const pool = require('../config/db');
const s3 = require('../config/s3');

const getAllTickets = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const { 
            page = 1, 
            limit = 10, 
            status, 
            search,
            sort_by = 'created_at',
            sort_order = 'desc'
        } = req.query;
        
        // Ensure valid integers for pagination
        const validPage = Math.max(1, parseInt(page) || 1);
        const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
        const offset = (validPage - 1) * validLimit;
        
        let query = `
            SELECT t.ticket_id, t.subject, t.description, t.status, t.created_at,
                  u.user_id, u.first_name, u.last_name, u.email
            FROM tickets t
            JOIN users u ON t.user_id = u.user_id
            WHERE 1=1
        `;
        
        const queryParams = [];
        
        if (status) {
            query += ` AND t.status = ?`;
            queryParams.push(status);
        }
        
        if (search) {
            query += ` AND (
                t.subject LIKE ? OR
                t.description LIKE ? OR
                u.first_name LIKE ? OR
                u.last_name LIKE ? OR
                u.email LIKE ?
            )`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        const validSortColumns = ['ticket_id', 'subject', 'status', 'created_at'];
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
        const sortDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        // Use string interpolation for LIMIT to avoid MAMP MySQL compatibility issues
        // This is safe because we validate these are integers
        query += ` ORDER BY t.` + sortColumn + ` ` + sortDir + ` LIMIT ${offset}, ${validLimit}`;
        
        const [tickets] = await connection.execute(query, queryParams);
        
        let countQuery = `
            SELECT COUNT(*) as total
            FROM tickets t
            JOIN users u ON t.user_id = u.user_id
            WHERE 1=1
        `;
        
        const countParams = [];
        
        if (status) {
            countQuery += ` AND t.status = ?`;
            countParams.push(status);
        }
        
        if (search) {
            countQuery += ` AND (
                t.subject LIKE ? OR
                t.description LIKE ? OR
                u.first_name LIKE ? OR
                u.last_name LIKE ? OR
                u.email LIKE ?
            )`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        const [countResult] = await connection.execute(countQuery, countParams);
        const totalTickets = countResult[0].total;
        
        const [statusCounts] = await connection.execute(
            `SELECT status, COUNT(*) as count FROM tickets GROUP BY status`
        );
        
        const statistics = {
            total: totalTickets,
            open: 0,
            in_progress: 0,
            resolved: 0,
            closed: 0
        };
        
        statusCounts.forEach(row => {
            if (statistics[row.status] !== undefined) {
                statistics[row.status] = row.count;
            }
        });
        
        const formattedTickets = tickets.map(ticket => ({
            id: ticket.ticket_id,
            subject: ticket.subject,
            status: ticket.status,
            created_at: new Date(ticket.created_at).toISOString().split('T')[0],
            customer: {
                id: ticket.user_id,
                name: `${ticket.first_name} ${ticket.last_name}`.trim(),
                email: ticket.email
            }
        }));
        
        res.json({
            success: true,
            data: {
                tickets: formattedTickets,
                pagination: {
                    total: totalTickets,
                    page: validPage,
                    limit: validLimit,
                    pages: Math.ceil(totalTickets / validLimit)
                },
                statistics
            }
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getTicketById = async (req, res, next) => {
    let connection;
    try {
        const ticket_id = req.params.ticket_id;
        
        if (!ticket_id) {
            return res.status(400).json({
                success: false,
                message: 'Ticket ID is required'
            });
        }
        
        connection = await pool.getConnection();
        
        const [ticketRows] = await connection.execute(
            `SELECT t.ticket_id, t.user_id, t.subject, t.description, t.status, 
                    t.assigned_to, t.created_at, t.resolution_time,
                    u.first_name, u.last_name, u.email
             FROM tickets t
             JOIN users u ON t.user_id = u.user_id
             WHERE t.ticket_id = ?`,
            [ticket_id]
        );
        
        if (ticketRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }
        
        const [commentRows] = await connection.execute(
            `SELECT tc.comment_id, tc.comment, tc.created_at, tc.user_id,
                    CASE 
                        WHEN u.role = 'admin' THEN 'Support Agent'
                        ELSE CONCAT(u.first_name, ' ', COALESCE(u.last_name, ''))
                    END as user_name
             FROM ticket_comments tc
             JOIN users u ON tc.user_id = u.user_id
             WHERE tc.ticket_id = ?
             ORDER BY tc.created_at ASC`,
            [ticket_id]
        );
        
        const [attachmentRows] = await connection.execute(
            `SELECT attachment_id, s3_key, file_name, content_type
             FROM ticket_attachments
             WHERE ticket_id = ?`,
            [ticket_id]
        );
        
        const ticket = {
            id: ticketRows[0].ticket_id,
            subject: ticketRows[0].subject,
            description: ticketRows[0].description,
            status: ticketRows[0].status,
            assigned_to: ticketRows[0].assigned_to,
            created_at: new Date(ticketRows[0].created_at).toISOString().split('T')[0],
            resolution_time: ticketRows[0].resolution_time,
            customer: {
                id: ticketRows[0].user_id,
                name: `${ticketRows[0].first_name} ${ticketRows[0].last_name || ''}`.trim(),
                email: ticketRows[0].email
            },
            responses: commentRows.map(comment => ({
                id: comment.comment_id,
                message: comment.comment,
                user: comment.user_name,
                date: new Date(comment.created_at).toISOString().split('T')[0]
            })),
            attachments: attachmentRows.map(attachment => ({
                id: attachment.attachment_id,
                file_name: attachment.file_name,
                content_type: attachment.content_type,
                s3_key: attachment.s3_key
            }))
        };
        
        res.json({
            success: true,
            data: ticket
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const addTicketComment = async (req, res, next) => {
    let connection;
    try {
        const user_id = req.user?.userId;
        const ticket_id = req.params.ticket_id;
        const { comment } = req.body;
        
        // Validation
        if (!user_id) {
            return res.status(401).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        if (!ticket_id) {
            return res.status(400).json({
                success: false,
                message: 'Ticket ID is required'
            });
        }
        
        if (!comment || comment.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot be empty'
            });
        }
        
        connection = await pool.getConnection();
        
        // Check if ticket exists
        const [ticketRows] = await connection.execute(
            `SELECT ticket_id, status FROM tickets WHERE ticket_id = ?`,
            [ticket_id]
        );
        
        if (ticketRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }
        
        if (ticketRows[0].status === 'closed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot add comments to a closed ticket'
            });
        }
        
        const [commentResult] = await connection.execute(
            `INSERT INTO ticket_comments (ticket_id, user_id, comment)
             VALUES (?, ?, ?)`,
            [ticket_id, user_id, comment.trim()]
        );
        
        // Update ticket status if it was resolved
        if (ticketRows[0].status === 'resolved') {
            await connection.execute(
                `UPDATE tickets SET status = 'in_progress' WHERE ticket_id = ?`,
                [ticket_id]
            );
        }
        
        const [newComment] = await connection.execute(
            `SELECT comment_id, comment, created_at
             FROM ticket_comments
             WHERE comment_id = ?`,
            [commentResult.insertId]
        );
        
        res.json({
            success: true,
            data: {
                id: newComment[0].comment_id,
                message: newComment[0].comment,
                user: 'Support Agent',
                date: new Date(newComment[0].created_at).toISOString().split('T')[0]
            }
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const updateTicketStatus = async (req, res, next) => {
    let connection;
    try {
        const ticket_id = req.params.ticket_id;
        const { status } = req.body;
        
        // Validation
        if (!ticket_id) {
            return res.status(400).json({
                success: false,
                message: 'Ticket ID is required'
            });
        }
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }
        
        const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value. Must be one of: ' + validStatuses.join(', ')
            });
        }
        
        connection = await pool.getConnection();
        
        const [ticketRows] = await connection.execute(
            `SELECT ticket_id FROM tickets WHERE ticket_id = ?`,
            [ticket_id]
        );
        
        if (ticketRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }
        
        await connection.execute(
            `UPDATE tickets SET status = ? WHERE ticket_id = ?`,
            [status, ticket_id]
        );
        
        if (status === 'resolved') {
            await connection.execute(
                `UPDATE tickets SET resolution_time = NOW() WHERE ticket_id = ?`,
                [ticket_id]
            );
        }
        
        res.json({
            success: true,
            message: `Ticket status updated to ${status}`
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

module.exports = {
    getAllTickets,
    getTicketById,
    addTicketComment,
    updateTicketStatus
}; 