const pool = require('../config/db');

const validateTicketAccess = async (ticketId, userId, userRole) => {
    const connection = await pool.getConnection();
    try {
        let query, params;
        
        if (userRole === 'admin') {
            query = 'SELECT ticket_id, user_id FROM tickets WHERE ticket_id = ?';
            params = [ticketId];
        } else {
            query = 'SELECT ticket_id, user_id FROM tickets WHERE ticket_id = ? AND user_id = ?';
            params = [ticketId, userId];
        }
        
        const [rows] = await connection.query(query, params);
        return rows.length > 0 ? rows[0] : null;
    } finally {
        connection.release();
    }
};

const validateUserAccess = async (targetUserId, currentUserId, userRole) => {
    if (userRole === 'admin') {
        return true;
    }
    
    return parseInt(targetUserId) === parseInt(currentUserId);
};

const getFilteredTicketsQuery = (userRole, userId, filters = {}) => {
    let baseQuery = `
        SELECT t.ticket_id, t.subject, t.description, t.status, t.created_at,
               u.user_id, u.first_name, u.last_name, u.email
        FROM tickets t
        JOIN users u ON t.user_id = u.user_id
    `;
    
    const conditions = [];
    const params = [];
    
    if (userRole !== 'admin') {
        conditions.push('t.user_id = ?');
        params.push(userId);
    }
    
    if (filters.status) {
        conditions.push('t.status = ?');
        params.push(filters.status);
    }
    
    if (filters.search) {
        conditions.push(`(
            t.subject LIKE ? OR 
            t.description LIKE ? OR 
            u.first_name LIKE ? OR 
            u.email LIKE ?
        )`);
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const sortColumn = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'desc';
    baseQuery += ` ORDER BY t.${sortColumn} ${sortOrder}`;
    
    if (filters.limit && filters.offset !== undefined) {
        baseQuery += ' LIMIT ? OFFSET ?';
        params.push(parseInt(filters.limit), parseInt(filters.offset));
    }
    
    return { query: baseQuery, params };
};

const getFilteredUsersQuery = (userRole, filters = {}) => {
    if (userRole !== 'admin') {
        throw new Error('Only administrators can access user data');
    }
    
    let baseQuery = `
        SELECT user_id, first_name, last_name, email, role, phone, 
               address, created_at, status
        FROM users
    `;
    
    const conditions = [];
    const params = [];
    
    if (filters.search) {
        conditions.push(`(
            first_name LIKE ? OR 
            last_name LIKE ? OR 
            email LIKE ?
        )`);
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (filters.role) {
        conditions.push('role = ?');
        params.push(filters.role);
    }
    
    if (filters.status) {
        conditions.push('status = ?');
        params.push(filters.status);
    }
    
    if (conditions.length > 0) {
        baseQuery += ' WHERE ' + conditions.join(' AND ');
    }
    
    const validSortColumns = ['created_at', 'email', 'first_name', 'last_name', 'status', 'role'];
    const sortColumn = validSortColumns.includes(filters.sort_by) ? filters.sort_by : 'created_at';
    const sortOrder = filters.sort_order === 'asc' ? 'ASC' : 'DESC';
    baseQuery += ` ORDER BY ${sortColumn} ${sortOrder}`;
    
    if (filters.limit && filters.offset !== undefined) {
        baseQuery += ' LIMIT ? OFFSET ?';
        params.push(parseInt(filters.limit), parseInt(filters.offset));
    }
    
    return { query: baseQuery, params };
};

const validateTicketCommentAccess = async (ticketId, userId, userRole) => {
    const ticketData = await validateTicketAccess(ticketId, userId, userRole);
    if (!ticketData) {
        throw new Error('Ticket not found or access denied');
    }
    
    return ticketData;
};

const validateAttachmentAccess = async (s3Key, userId, userRole) => {
    const connection = await pool.getConnection();
    try {
        let query, params;
        
        if (userRole === 'admin') {
            query = `
                SELECT ta.attachment_id, ta.ticket_id, ta.file_name, ta.content_type 
                FROM ticket_attachments ta
                WHERE ta.s3_key = ?
            `;
            params = [s3Key];
        } else {
            query = `
                SELECT ta.attachment_id, ta.ticket_id, ta.file_name, ta.content_type 
                FROM ticket_attachments ta
                JOIN tickets t ON ta.ticket_id = t.ticket_id
                WHERE ta.s3_key = ? AND t.user_id = ?
            `;
            params = [s3Key, userId];
        }
        
        const [rows] = await connection.query(query, params);
        return rows.length > 0 ? rows[0] : null;
    } finally {
        connection.release();
    }
};

const sanitizeUserData = (userData, viewerRole, viewerUserId) => {
    if (!userData) return null;
    
    if (viewerRole === 'admin') {
        return userData;
    }
    
    if (parseInt(userData.user_id) === parseInt(viewerUserId)) {
        return userData;
    }
    
    return {
        user_id: userData.user_id,
        first_name: userData.first_name,
        email: userData.email
    };
};

module.exports = {
    validateTicketAccess,
    validateUserAccess,
    getFilteredTicketsQuery,
    getFilteredUsersQuery,
    validateTicketCommentAccess,
    validateAttachmentAccess,
    sanitizeUserData
}; 