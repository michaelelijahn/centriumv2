const pool = require('../config/db');
const s3 = require('../config/s3');
const { uploadToS3 } = require('../utils/s3Upload');

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
        
        const [ticketResult] = await connection.execute(
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
                    
                    const [attachmentResult] = await connection.execute(
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
        
        const [ticketRows] = await connection.execute(
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
        const ticket_id = req.params.ticket_id;
        
        if (!user_id) {
            throw new Error('User ID is required but not provided');
        }
        
        if (!ticket_id) {
            throw new Error('Ticket ID is required but not provided');
        }
        
        connection = await pool.getConnection();
        
        const [ticketRows] = await connection.execute(
            `SELECT ticket_id, user_id, subject, description, status, assigned_to, created_at, resolution_time
             FROM tickets
             WHERE ticket_id = ? AND user_id = ?`,
            [ticket_id, user_id]
        );
        
        if (ticketRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found or you do not have permission to view it'
            });
        }
        
        const [commentRows] = await connection.execute(
            `SELECT tc.comment_id, tc.comment, tc.created_at, 
                    CASE 
                        WHEN tc.user_id = ? THEN 'You' 
                        ELSE 'Support Agent' 
                    END as user
             FROM ticket_comments tc
             WHERE tc.ticket_id = ?
             ORDER BY tc.created_at ASC`,
            [user_id, ticket_id]
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
            issued_at: new Date(ticketRows[0].created_at).toISOString().split('T')[0],
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
        
        const [attachmentRows] = await connection.execute(
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
        
        const [attachmentRows] = await connection.execute(
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
        
        // Check if customer owns this ticket
        const [ticketRows] = await connection.execute(
            `SELECT ticket_id, status FROM tickets WHERE ticket_id = ? AND user_id = ?`,
            [ticket_id, user_id]
        );
        
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
                user: 'You',
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

module.exports = { 
    makeEnquiry, 
    getTickets, 
    getTicketById, 
    getAttachmentUrl, 
    streamAttachment, 
    addTicketComment
};