const pool = require('../config/db');
const s3 = require('../config/s3');
const { uploadToS3 } = require('../utils/s3Upload');
const { 
    validateTicketAccess,
    validateAttachmentAccess,
    getFilteredTicketsQuery
} = require('../middleware/dbAuthorization');

const makeEnquiry = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const { subject, description } = req.body;
        const user_id = req.user?.userId;
        
        const safeSubject = subject?.trim() || null;
        const safeDescription = description?.trim() || null;
        const safeUserId = user_id || null;
        
        if (!safeSubject || !safeDescription || !safeUserId) {
            throw new Error(`Missing required fields: ${[
                !safeSubject && 'subject',
                !safeDescription && 'description',
                !safeUserId && 'user_id'
            ].filter(Boolean).join(', ')}`);
        }
        
        await connection.beginTransaction();
        
        const [ticketResult] = await connection.query(
            `INSERT INTO tickets (user_id, subject, description, status) 
             VALUES (?, ?, ?, ?)`,
            [safeUserId, safeSubject, safeDescription, 'open']
        );
        
        const ticketId = ticketResult.insertId;
        
        const attachments = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    
                    const s3Result = await uploadToS3(
                        file.buffer, 
                        file.originalname,
                        file.mimetype,
                        safeUserId,
                        ticketId
                    );
                    
                    const s3Key = s3Result.key || null;
                    const contentType = s3Result.contentType || file.mimetype || null;
                    const fileName = s3Result.originalName || file.originalname || null;
                    
                    const [attachmentResult] = await connection.query(
                        'INSERT INTO ticket_attachments (ticket_id, s3_key, content_type, file_name) VALUES (?, ?, ?, ?)',
                        [
                            ticketId, 
                            s3Key,
                            contentType,
                            fileName
                        ]
                    );
                    
                    attachments.push({
                        id: attachmentResult.insertId,
                        file_name: fileName
                    });
                } catch (err) {
                    throw err;
                }
            }
        }
        
        await connection.commit();
        
        res.json({
            success: true,
            data: {
                ticket_id: ticketId,
                attachments,
                message: 'Enquiry submitted successfully'
            }
        });
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getTickets = async (req, res, next) => {
    let connection;
    try {
        const user_id = req.user?.userId;
        if (!user_id) {
            throw new Error('User ID is required but not provided');
        }
        
        connection = await pool.getConnection();
        
        const [ticketRows] = await connection.query(
            `SELECT ticket_id, subject, description, status, created_at
             FROM tickets
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [user_id]
        );
        
        const tickets = ticketRows.map(ticket => ({
            id: ticket.ticket_id,
            subject: ticket.subject,
            description: ticket.description,
            issued_at: new Date(ticket.created_at).toISOString().split('T')[0],
            status: ticket.status
        }));
        
        res.json({
            success: true,
            data: tickets
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
        const user_id = req.user?.userId;
        const user_role = req.user?.role;
        const ticket_id = req.params.ticket_id;
        
        if (!user_id) {
            throw new Error('User ID is required but not provided');
        }
        
        if (!ticket_id) {
            throw new Error('Ticket ID is required but not provided');
        }
        
        connection = await pool.getConnection();
        
        // Admin users can view any ticket, regular users can only view their own
        let query, queryParams;
        if (user_role === 'admin') {
            query = `SELECT t.ticket_id, t.user_id, t.subject, t.description, t.status, t.assigned_to, t.created_at, t.resolution_time,
                            u.first_name, u.last_name, u.email, u.phone
                     FROM tickets t
                     LEFT JOIN users u ON t.user_id = u.user_id
                     WHERE t.ticket_id = ?`;
            queryParams = [ticket_id];
        } else {
            query = `SELECT ticket_id, user_id, subject, description, status, assigned_to, created_at, resolution_time
                     FROM tickets
                     WHERE ticket_id = ? AND user_id = ?`;
            queryParams = [ticket_id, user_id];
        }
        
        const [ticketRows] = await connection.query(query, queryParams);
        
        if (ticketRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found or you do not have permission to view it'
            });
        }
        
        // Get comments with proper user identification for admin vs customer view
        let commentQuery, commentParams;
        if (user_role === 'admin') {
            commentQuery = `SELECT tc.comment_id, tc.comment, tc.created_at, tc.user_id,
                                  CASE 
                                      WHEN u.role = 'admin' THEN 'Support Agent'
                                      ELSE CONCAT(u.first_name, ' ', COALESCE(u.last_name, ''))
                                  END as user
                           FROM ticket_comments tc
                           LEFT JOIN users u ON tc.user_id = u.user_id
                           WHERE tc.ticket_id = ?
                           ORDER BY tc.created_at ASC`;
            commentParams = [ticket_id];
        } else {
            commentQuery = `SELECT tc.comment_id, tc.comment, tc.created_at, 
                                  CASE 
                                      WHEN tc.user_id = ? THEN 'You' 
                                      ELSE 'Support Agent' 
                                  END as user
                           FROM ticket_comments tc
                           WHERE tc.ticket_id = ?
                           ORDER BY tc.created_at ASC`;
            commentParams = [user_id, ticket_id];
        }
        
        const [commentRows] = await connection.query(commentQuery, commentParams);
        
        // Get attachments (admins can see any ticket's attachments)
        const [attachmentRows] = await connection.query(
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
            issued_at: new Date(ticketRows[0].created_at).toISOString().split('T')[0],
            created_at: new Date(ticketRows[0].created_at).toISOString().split('T')[0],
            resolution_time: ticketRows[0].resolution_time,
            user_id: ticketRows[0].user_id,
            responses: commentRows.map(comment => ({
                id: comment.comment_id,
                message: comment.comment,
                user: comment.user,
                date: new Date(comment.created_at).toISOString().split('T')[0]
            })),
            attachments: attachmentRows.map(attachment => ({
                id: attachment.attachment_id,
                file_name: attachment.file_name,
                content_type: attachment.content_type,
                s3_key: attachment.s3_key
            }))
        };

        // Add customer information when viewed by admin
        if (user_role === 'admin' && ticketRows[0].first_name) {
            ticket.customer = {
                id: ticketRows[0].user_id,
                name: `${ticketRows[0].first_name} ${ticketRows[0].last_name || ''}`.trim(),
                email: ticketRows[0].email,
                phone: ticketRows[0].phone
            };
        }
        
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

const getAttachmentUrl = async (req, res, next) => {
    let connection;
    try {
        const user_id = req.user?.userId;
        const s3Key = req.params.s3Key;
        
        if (!user_id) {
            throw new Error('User ID is required but not provided');
        }
        
        if (!s3Key) {
            throw new Error('S3 key is required but not provided');
        }
        
        connection = await pool.getConnection();
        
        const [attachmentRows] = await connection.query(
            `SELECT ta.attachment_id, ta.ticket_id, ta.file_name, ta.content_type 
             FROM ticket_attachments ta
             JOIN tickets t ON ta.ticket_id = t.ticket_id
             WHERE ta.s3_key = ? AND t.user_id = ?`,
            [s3Key, user_id]
        );
        
        if (attachmentRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found or you do not have permission to access it'
            });
        }
        
        const url = s3.getSignedUrl('getObject', {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Expires: 300
        });
        
        res.json({
            success: true,
            data: {
                url,
                file_name: attachmentRows[0].file_name,
                content_type: attachmentRows[0].content_type
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

const streamAttachment = async (req, res, next) => {
    let connection;
    try {
        const user_id = req.user?.userId;
        const s3Key = req.params.s3Key;
        
        if (!user_id || !s3Key) {
            return res.status(400).json({
                success: false,
                message: 'User ID and S3 key are required'
            });
        }
        
        connection = await pool.getConnection();
        
        const [attachmentRows] = await connection.query(
            `SELECT ta.attachment_id, ta.file_name, ta.content_type 
             FROM ticket_attachments ta
             JOIN tickets t ON ta.ticket_id = t.ticket_id
             WHERE ta.s3_key = ? AND t.user_id = ?`,
            [s3Key, user_id]
        );
        
        if (attachmentRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found or you do not have permission to access it'
            });
        }
        
        res.setHeader('Content-Disposition', `inline; filename="${attachmentRows[0].file_name}"`);
        res.setHeader('Content-Type', attachmentRows[0].content_type);
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key
        };
        
        const s3Stream = s3.getObject(params).createReadStream();
        s3Stream.pipe(res);
        
        s3Stream.on('error', (error) => {
            next(error);
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
        const userRole = req.user?.role;
        
        if (!user_id) {
            throw new Error('User ID is required but not provided');
        }
        
        if (!ticket_id) {
            throw new Error('Ticket ID is required but not provided');
        }
        
        if (!comment || comment.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Comment cannot be empty'
            });
        }
        
        connection = await pool.getConnection();
        
        let ticketQuery = '';
        let ticketParams = [];
        
        if (userRole === 'admin') {
            ticketQuery = `SELECT ticket_id, status, user_id FROM tickets WHERE ticket_id = ?`;
            ticketParams = [ticket_id];
        } else {
            ticketQuery = `SELECT ticket_id, status FROM tickets WHERE ticket_id = ? AND user_id = ?`;
            ticketParams = [ticket_id, user_id];
        }
        
        const [ticketRows] = await connection.query(ticketQuery, ticketParams);
        
        if (ticketRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found or you do not have permission to comment on it'
            });
        }
        
        if (ticketRows[0].status === 'closed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot add comments to a closed ticket'
            });
        }
        
        const [commentResult] = await connection.query(
            `INSERT INTO ticket_comments (ticket_id, user_id, comment)
             VALUES (?, ?, ?)`,
            [ticket_id, user_id, comment.trim()]
        );
        
        if (ticketRows[0].status === 'resolved') {
            await connection.query(
                `UPDATE tickets SET status = 'in_progress' WHERE ticket_id = ?`,
                [ticket_id]
            );
        }
        
        const [newComment] = await connection.query(
            `SELECT comment_id, comment, created_at
             FROM ticket_comments
             WHERE comment_id = ?`,
            [commentResult.insertId]
        );
        
        let displayName = 'You';
        if (userRole === 'admin') {
            if (ticketRows[0].user_id === user_id) {
                displayName = 'You';
            } else {
                displayName = 'Support Agent';
            }
        }
        
        res.json({
            success: true,
            data: {
                id: newComment[0].comment_id,
                message: newComment[0].comment,
                user: displayName,
                date: new Date(newComment[0].created_at).toISOString().split('T')[0]
            }
        });
    } catch (error) {
        console.error('Error adding ticket comment:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getAllTickets = async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const { 
            page = 1, 
            limit = 10, 
            status = '', 
            search = '',
            user_id = '',
            sort_by = 'created_at',
            sort_order = 'desc',
            date_from = '',
            date_to = ''
        } = req.query;
        
        // Input validation and sanitization
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const offset = (pageNum - 1) * limitNum;
        const searchTerm = search ? search.toString().trim() : '';
        
        // Build WHERE conditions dynamically
        let whereConditions = [];
        let queryParams = [];
        
        if (status) {
            whereConditions.push(`t.status = ?`);
            queryParams.push(status.toString());
        }
        
        if (searchTerm) {
            whereConditions.push(`(
                t.subject LIKE ? OR
                t.description LIKE ? OR
                u.first_name LIKE ? OR
                u.last_name LIKE ? OR
                u.email LIKE ? OR
                CAST(t.ticket_id AS CHAR) LIKE ?
            )`);
            const searchPattern = `%${searchTerm}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }
        
        if (user_id) {
            whereConditions.push(`t.user_id = ?`);
            queryParams.push(parseInt(user_id));
        }
        
        if (date_from) {
            whereConditions.push(`DATE(t.created_at) >= ?`);
            queryParams.push(date_from.toString());
        }
        
        if (date_to) {
            whereConditions.push(`DATE(t.created_at) <= ?`);
            queryParams.push(date_to.toString());
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Validate sort parameters
        const validSortColumns = ['ticket_id', 'subject', 'status', 'created_at', 'user_id'];
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
        const sortDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        // Main query
        const mainQuery = `
            SELECT t.ticket_id, t.subject, t.status, t.created_at,
                   u.user_id, u.first_name, u.last_name, u.email
            FROM tickets t
            JOIN users u ON t.user_id = u.user_id
            ${whereClause}
            ORDER BY t.${sortColumn} ${sortDir}
            LIMIT ? OFFSET ?
        `;
        
        const mainQueryParams = [...queryParams, limitNum, offset];
        const [tickets] = await connection.query(mainQuery, mainQueryParams);
        
        // Count query (same WHERE conditions but no LIMIT/OFFSET/JOIN optimization)
        const countQuery = `
            SELECT COUNT(*) as total
            FROM tickets t
            JOIN users u ON t.user_id = u.user_id
            ${whereClause}
        `;
        
        const [countResult] = await connection.query(countQuery, queryParams);
        const totalTickets = countResult[0].total;
        
        // Get statistics
        const [statusCounts] = await connection.query(
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
            if (statistics.hasOwnProperty(row.status)) {
                statistics[row.status] = row.count;
            }
        });
        
        // Format ticket data
        const formattedTickets = tickets.map(ticket => ({
            id: ticket.ticket_id,
            subject: ticket.subject,
            status: ticket.status,
            created_at: new Date(ticket.created_at).toISOString().split('T')[0],
            customer: {
                id: ticket.user_id,
                name: `${ticket.first_name} ${ticket.last_name || ''}`.trim(),
                email: ticket.email
            }
        }));
        
        res.json({
            success: true,
            data: {
                tickets: formattedTickets,
                pagination: {
                    total: totalTickets,
                    page: pageNum,
                    limit: limitNum,
                    pages: Math.ceil(totalTickets / limitNum)
                },
                statistics
            }
        });
    } catch (error) {
        console.error('Error in getAllTickets:', error);
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
        
        const [ticketRows] = await connection.query(
            `SELECT ticket_id FROM tickets WHERE ticket_id = ?`,
            [ticket_id]
        );
        
        if (ticketRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }
        
        await connection.query(
            `UPDATE tickets SET status = ? WHERE ticket_id = ?`,
            [status, ticket_id]
        );
        
        if (status === 'resolved') {
            await connection.query(
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
    makeEnquiry, 
    getTickets, 
    getTicketById, 
    getAttachmentUrl, 
    streamAttachment, 
    addTicketComment,
    getAllTickets,
    updateTicketStatus
};