const Ticket = require('../models/Ticket');

class TicketRepository {
    constructor(database) {
        this.db = database;
    }

    async create(ticketData) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.execute(
                'INSERT INTO tickets (user_id, subject, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [ticketData.userId, ticketData.subject, ticketData.description, ticketData.status]
            );

            const ticketId = result.insertId;
            const ticket = await this.findById(ticketId, connection);
            
            await connection.commit();
            return ticket;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findById(id, connection = null) {
        const conn = connection || await this.db.getConnection();
        try {
            const [rows] = await conn.execute(
                `SELECT t.ticket_id as id, t.user_id as userId, t.subject, t.description, 
                        t.status, t.assigned_to as assignedTo, t.created_at as createdAt, 
                        t.updated_at as updatedAt, t.resolution_time as resolutionTime
                 FROM tickets t 
                 WHERE t.ticket_id = ?`,
                [id]
            );

            if (rows.length === 0) {
                return null;
            }

            const ticketData = rows[0];
            return new Ticket(ticketData);
        } finally {
            if (!connection) conn.release();
        }
    }

    async findByIdWithDetails(id, userRole = null) {
        const connection = await this.db.getConnection();
        try {
            // Get ticket with customer info for admin view
            let ticketQuery, ticketParams;
            if (userRole === 'admin') {
                ticketQuery = `
                    SELECT t.ticket_id as id, t.user_id as userId, t.subject, t.description, 
                           t.status, t.assigned_to as assignedTo, t.created_at as createdAt, 
                           t.updated_at as updatedAt, t.resolution_time as resolutionTime,
                           u.first_name, u.last_name, u.email, u.phone
                    FROM tickets t
                    LEFT JOIN users u ON t.user_id = u.user_id
                    WHERE t.ticket_id = ?`;
                ticketParams = [id];
            } else {
                ticketQuery = `
                    SELECT t.ticket_id as id, t.user_id as userId, t.subject, t.description, 
                           t.status, t.assigned_to as assignedTo, t.created_at as createdAt, 
                           t.updated_at as updatedAt, t.resolution_time as resolutionTime
                    FROM tickets t 
                    WHERE t.ticket_id = ?`;
                ticketParams = [id];
            }

            const [ticketRows] = await connection.execute(ticketQuery, ticketParams);
            
            if (ticketRows.length === 0) {
                return null;
            }

            const ticketData = ticketRows[0];
            const ticket = new Ticket(ticketData);

            // Add customer info for admin view
            if (userRole === 'admin' && ticketData.first_name) {
                ticket.customer = {
                    id: ticketData.userId,
                    name: `${ticketData.first_name} ${ticketData.last_name || ''}`.trim(),
                    email: ticketData.email,
                    phone: ticketData.phone
                };
            }

            // Get comments
            const comments = await this.findCommentsByTicketId(id, ticketData.userId, userRole, connection);
            ticket.comments = comments;

            // Get attachments
            const attachments = await this.findAttachmentsByTicketId(id, connection);
            ticket.attachments = attachments;

            return ticket;
        } finally {
            connection.release();
        }
    }

    async findByUserId(userId, options = {}) {
        const { page = 1, limit = 10, status, sortBy = 'created_at', sortOrder = 'desc' } = options;
        const offset = (page - 1) * limit;
        
        let query = `
            SELECT t.ticket_id as id, t.user_id as userId, t.subject, t.description, 
                   t.status, t.assigned_to as assignedTo, t.created_at as createdAt, 
                   t.updated_at as updatedAt, t.resolution_time as resolutionTime
            FROM tickets t 
            WHERE t.user_id = ?`;
        
        let params = [userId];

        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }

        // Validate sort parameters
        const validSortColumns = ['created_at', 'updated_at', 'status', 'subject'];
        const validSortOrders = ['asc', 'desc'];
        
        const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const safeSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';

        query += ` ORDER BY t.${safeSortBy} ${safeSortOrder.toUpperCase()} LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(query, params);
            return rows.map(row => new Ticket(row));
        } finally {
            connection.release();
        }
    }

    async findAll(options = {}) {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            search, 
            userId, 
            sortBy = 'created_at', 
            sortOrder = 'desc',
            dateFrom,
            dateTo
        } = options;
        
        const offset = (page - 1) * limit;
        let whereConditions = [];
        let params = [];

        if (status) {
            whereConditions.push('t.status = ?');
            params.push(status);
        }

        if (userId) {
            whereConditions.push('t.user_id = ?');
            params.push(userId);
        }

        if (search) {
            whereConditions.push('(t.subject LIKE ? OR t.description LIKE ? OR t.ticket_id = ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)');
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, search, searchTerm, searchTerm, searchTerm);
        }

        if (dateFrom) {
            whereConditions.push('DATE(t.created_at) >= ?');
            params.push(dateFrom);
        }

        if (dateTo) {
            whereConditions.push('DATE(t.created_at) <= ?');
            params.push(dateTo);
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        // Validate sort parameters
        const validSortColumns = ['created_at', 'updated_at', 'status', 'subject', 'ticket_id'];
        const validSortOrders = ['asc', 'desc'];
        
        const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const safeSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';

        const query = `
            SELECT t.ticket_id as id, t.user_id as userId, t.subject, t.description, 
                   t.status, t.assigned_to as assignedTo, t.created_at as createdAt, 
                   t.updated_at as updatedAt, t.resolution_time as resolutionTime,
                   u.first_name, u.last_name, u.email, u.phone
            FROM tickets t
            LEFT JOIN users u ON t.user_id = u.user_id
            ${whereClause}
            ORDER BY t.${safeSortBy} ${safeSortOrder.toUpperCase()}
            LIMIT ? OFFSET ?`;

        params.push(limit, offset);

        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(query, params);
            return rows.map(row => {
                const ticket = new Ticket(row);
                if (row.first_name) {
                    ticket.customer = {
                        id: row.userId,
                        name: `${row.first_name} ${row.last_name || ''}`.trim(),
                        email: row.email,
                        phone: row.phone
                    };
                }
                return ticket;
            });
        } finally {
            connection.release();
        }
    }

    async countAll(options = {}) {
        const { status, search, userId, dateFrom, dateTo } = options;
        let whereConditions = [];
        let params = [];

        if (status) {
            whereConditions.push('t.status = ?');
            params.push(status);
        }

        if (userId) {
            whereConditions.push('t.user_id = ?');
            params.push(userId);
        }

        if (search) {
            whereConditions.push('(t.subject LIKE ? OR t.description LIKE ? OR t.ticket_id = ? OR u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)');
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, search, searchTerm, searchTerm, searchTerm);
        }

        if (dateFrom) {
            whereConditions.push('DATE(t.created_at) >= ?');
            params.push(dateFrom);
        }

        if (dateTo) {
            whereConditions.push('DATE(t.created_at) <= ?');
            params.push(dateTo);
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        const query = `
            SELECT COUNT(*) as total 
            FROM tickets t
            LEFT JOIN users u ON t.user_id = u.user_id
            ${whereClause}`;

        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(query, params);
            return rows[0].total;
        } finally {
            connection.release();
        }
    }

    async getStatistics() {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(`
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
                    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
                    SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
                    SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed
                FROM tickets
            `);
            return rows[0];
        } finally {
            connection.release();
        }
    }

    async update(id, updateData) {
        const connection = await this.db.getConnection();
        try {
            const setParts = [];
            const params = [];

            if (updateData.subject !== undefined) {
                setParts.push('subject = ?');
                params.push(updateData.subject);
            }

            if (updateData.description !== undefined) {
                setParts.push('description = ?');
                params.push(updateData.description);
            }

            if (updateData.status !== undefined) {
                setParts.push('status = ?');
                params.push(updateData.status);
            }

            if (updateData.assignedTo !== undefined) {
                setParts.push('assigned_to = ?');
                params.push(updateData.assignedTo);
            }

            if (updateData.resolutionTime !== undefined) {
                setParts.push('resolution_time = ?');
                params.push(updateData.resolutionTime);
            }

            setParts.push('updated_at = NOW()');
            params.push(id);

            const query = `UPDATE tickets SET ${setParts.join(', ')} WHERE ticket_id = ?`;
            await connection.execute(query, params);

            return this.findById(id, connection);
        } finally {
            connection.release();
        }
    }

    async addComment(ticketId, userId, comment) {
        const connection = await this.db.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO ticket_comments (ticket_id, user_id, comment, created_at) VALUES (?, ?, ?, NOW())',
                [ticketId, userId, comment]
            );

            const [commentRow] = await connection.execute(
                'SELECT comment_id as id, comment, user_id as userId, created_at as createdAt FROM ticket_comments WHERE comment_id = ?',
                [result.insertId]
            );

            return commentRow[0];
        } finally {
            connection.release();
        }
    }

    async findCommentsByTicketId(ticketId, ticketUserId, userRole, connection = null) {
        const conn = connection || await this.db.getConnection();
        try {
            let commentQuery, commentParams;
            
            if (userRole === 'admin') {
                commentQuery = `
                    SELECT tc.comment_id as id, tc.comment, tc.created_at as createdAt, tc.user_id as userId,
                           CASE 
                               WHEN u.role = 'admin' THEN 'Support Agent'
                               ELSE CONCAT(u.first_name, ' ', COALESCE(u.last_name, ''))
                           END as user
                    FROM ticket_comments tc
                    LEFT JOIN users u ON tc.user_id = u.user_id
                    WHERE tc.ticket_id = ?
                    ORDER BY tc.created_at ASC`;
                commentParams = [ticketId];
            } else {
                commentQuery = `
                    SELECT tc.comment_id as id, tc.comment, tc.created_at as createdAt,
                           CASE 
                               WHEN tc.user_id = ? THEN 'You' 
                               ELSE 'Support Agent' 
                           END as user
                    FROM ticket_comments tc
                    WHERE tc.ticket_id = ?
                    ORDER BY tc.created_at ASC`;
                commentParams = [ticketUserId, ticketId];
            }

            const [rows] = await conn.execute(commentQuery, commentParams);
            return rows;
        } finally {
            if (!connection) conn.release();
        }
    }

    async addAttachment(ticketId, attachmentData) {
        const connection = await this.db.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO ticket_attachments (ticket_id, s3_key, content_type, file_name, created_at) VALUES (?, ?, ?, ?, NOW())',
                [ticketId, attachmentData.s3Key, attachmentData.contentType, attachmentData.fileName]
            );

            return {
                id: result.insertId,
                fileName: attachmentData.fileName,
                s3Key: attachmentData.s3Key,
                contentType: attachmentData.contentType
            };
        } finally {
            connection.release();
        }
    }

    async findAttachmentsByTicketId(ticketId, connection = null) {
        const conn = connection || await this.db.getConnection();
        try {
            const [rows] = await conn.execute(
                'SELECT attachment_id as id, s3_key as s3Key, file_name as fileName, content_type as contentType FROM ticket_attachments WHERE ticket_id = ?',
                [ticketId]
            );
            return rows;
        } finally {
            if (!connection) conn.release();
        }
    }

    async findAttachmentByS3Key(s3Key, userId = null) {
        const connection = await this.db.getConnection();
        try {
            let query, params;
            
            if (userId) {
                // For regular users, ensure they can only access their own ticket attachments
                query = `
                    SELECT ta.attachment_id as id, ta.ticket_id as ticketId, ta.file_name as fileName, 
                           ta.content_type as contentType, ta.s3_key as s3Key
                    FROM ticket_attachments ta
                    JOIN tickets t ON ta.ticket_id = t.ticket_id
                    WHERE ta.s3_key = ? AND t.user_id = ?`;
                params = [s3Key, userId];
            } else {
                // For admin users, can access any attachment
                query = `
                    SELECT ta.attachment_id as id, ta.ticket_id as ticketId, ta.file_name as fileName, 
                           ta.content_type as contentType, ta.s3_key as s3Key
                    FROM ticket_attachments ta
                    WHERE ta.s3_key = ?`;
                params = [s3Key];
            }

            const [rows] = await connection.execute(query, params);
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    async delete(id) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();

            // Delete attachments first
            await connection.execute('DELETE FROM ticket_attachments WHERE ticket_id = ?', [id]);
            
            // Delete comments
            await connection.execute('DELETE FROM ticket_comments WHERE ticket_id = ?', [id]);
            
            // Delete ticket
            const [result] = await connection.execute('DELETE FROM tickets WHERE ticket_id = ?', [id]);
            
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = TicketRepository; 