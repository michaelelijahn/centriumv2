const pool = require('../config/db');
const { 
    validateUserAccess,
    getFilteredUsersQuery,
    sanitizeUserData
} = require('../middleware/dbAuthorization');

const getAllUsers = async (req, res, next) => {
    let connection;
    try {
        const { 
            search = '', 
            page = 1, 
            limit = 10, 
            sort_by = 'created_at', 
            sort_order = 'desc',
            status = '',
            role = '',
            date_from = '',
            date_to = '',
            statistics = false 
        } = req.query;
        
        // Input validation and sanitization
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const offset = (pageNum - 1) * limitNum;
        const searchTerm = search ? search.toString().trim() : '';
        
        connection = await pool.getConnection();
        
        // Handle statistics request first
        if (statistics === true || statistics === 'true') {
            const [totalCountResult] = await connection.query(
                'SELECT COUNT(*) as total FROM users'
            );
            
            const [statusCounts] = await connection.query(
                `SELECT status, COUNT(*) as count 
                 FROM users 
                 GROUP BY status`
            );
            
            const [roleCounts] = await connection.query(
                `SELECT role, COUNT(*) as count 
                 FROM users 
                 GROUP BY role`
            );
            
            const stats = {
                total: totalCountResult[0].total,
                active: 0,
                inactive: 0,
                admin: 0
            };
            
            statusCounts.forEach(row => {
                if (row.status === 'active') {
                    stats.active = row.count;
                } else if (row.status === 'inactive') {
                    stats.inactive = row.count;
                }
            });
            
            roleCounts.forEach(row => {
                if (row.role === 'admin') {
                    stats.admin = row.count;
                }
            });
            
            // If only statistics requested, return early
            if (limitNum === 1) {
                return res.json({
                    success: true,
                    data: {
                        users: [],
                        pagination: {
                            total: stats.total,
                            page: 1,
                            limit: 1,
                            pages: 1
                        },
                        statistics: stats
                    }
                });
            }
        }
        
        // Build main query with dynamic WHERE conditions
        let whereConditions = [];
        let queryParams = [];
        
        if (searchTerm) {
            whereConditions.push(`(
                first_name LIKE ? OR 
                last_name LIKE ? OR
                email LIKE ? OR 
                CAST(user_id AS CHAR) LIKE ?
            )`);
            const searchPattern = `%${searchTerm}%`;
            queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }
        
        if (status) {
            whereConditions.push(`status = ?`);
            queryParams.push(status.toString());
        }
        
        if (role) {
            whereConditions.push(`role = ?`);
            queryParams.push(role.toString());
        }
        
        if (date_from) {
            whereConditions.push(`DATE(created_at) >= ?`);
            queryParams.push(date_from.toString());
        }
        
        if (date_to) {
            whereConditions.push(`DATE(created_at) <= ?`);
            queryParams.push(date_to.toString());
        }
        
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        
        // Validate sort parameters
        const validSortColumns = ['user_id', 'first_name', 'last_name', 'email', 'role', 'created_at', 'status'];
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
        const sortDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        // Main query
        const mainQuery = `
            SELECT user_id, first_name, last_name, email, role, phone, created_at, status
            FROM users
            ${whereClause}
            ORDER BY ${sortColumn} ${sortDir}
            LIMIT ? OFFSET ?
        `;
        
        const mainQueryParams = [...queryParams, limitNum, offset];
        const [userRows] = await connection.query(mainQuery, mainQueryParams);
        
        // Count query (same WHERE conditions but no LIMIT/OFFSET)
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM users
            ${whereClause}
        `;
        
        const [countResult] = await connection.query(countQuery, queryParams);
        const totalUsers = countResult[0].total;
        
        // Format user data
        const users = userRows.map(user => ({
            id: user.user_id,
            name: `${user.first_name} ${user.last_name || ''}`.trim(),
            email: user.email,
            role: user.role,
            phone: user.phone,
            created_at: new Date(user.created_at).toISOString().split('T')[0],
            status: user.status
        }));
        
        let responseData = {
            users,
            pagination: {
                total: totalUsers,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(totalUsers / limitNum)
            }
        };
        
        // Add statistics if requested
        if (statistics === true || statistics === 'true') {
            const [statusCounts] = await connection.query(
                `SELECT status, COUNT(*) as count 
                 FROM users 
                 GROUP BY status`
            );
            
            const [roleCounts] = await connection.query(
                `SELECT role, COUNT(*) as count 
                 FROM users 
                 GROUP BY role`
            );
            
            const stats = {
                total: totalUsers,
                active: 0,
                inactive: 0,
                admin: 0
            };
            
            statusCounts.forEach(row => {
                if (row.status === 'active') {
                    stats.active = row.count;
                } else if (row.status === 'inactive') {
                    stats.inactive = row.count;
                }
            });
            
            roleCounts.forEach(row => {
                if (row.role === 'admin') {
                    stats.admin = row.count;
                }
            });
            
            responseData.statistics = stats;
        }
        
        res.json({
            success: true,
            data: responseData
        });
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getUserById = async (req, res, next) => {
    let connection;
    try {
        const userId = req.params.user_id;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        connection = await pool.getConnection();
        
        const [userRows] = await connection.query(
            `SELECT user_id, first_name, last_name, email, role, phone, created_at, status
             FROM users
             WHERE user_id = ?`,
            [userId]
        );
        
        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const [ticketCountRows] = await connection.query(
            `SELECT status, COUNT(*) as count
             FROM tickets
             WHERE user_id = ?
             GROUP BY status`,
            [userId]
        );
        
        const ticketCounts = {
            total: 0,
            open: 0,
            in_progress: 0,
            resolved: 0,
            closed: 0
        };
        
        ticketCountRows.forEach(row => {
            ticketCounts[row.status] = row.count;
            ticketCounts.total += row.count;
        });
        
        const user = {
            id: userRows[0].user_id,
            name: `${userRows[0].first_name} ${userRows[0].last_name || ''}`.trim(),
            email: userRows[0].email,
            role: userRows[0].role,
            phone: userRows[0].phone,
            address: null,
            created_at: new Date(userRows[0].created_at).toISOString().split('T')[0],
            status: userRows[0].status,
            tickets: ticketCounts
        };
        
        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

const getUserTickets = async (req, res, next) => {
    let connection;
    try {
        const userId = req.params.user_id;
        const { status, page = 1, limit = 10 } = req.query;
        
        const offset = (page - 1) * limit;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        connection = await pool.getConnection();
        
        let query = `
            SELECT ticket_id, subject, description, status, created_at
            FROM tickets
            WHERE user_id = ?
        `;
        
        const queryParams = [userId];
        
        if (status) {
            query += ` AND status = ?`;
            queryParams.push(status);
        }
        
        query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));
        
        const [ticketRows] = await connection.query(query, queryParams);
        
        let countQuery = `
            SELECT COUNT(*) as total
            FROM tickets
            WHERE user_id = ?
        `;
        
        const countParams = [userId];
        
        if (status) {
            countQuery += ` AND status = ?`;
            countParams.push(status);
        }
        
        const [countResult] = await connection.query(countQuery, countParams);
        const totalTickets = countResult[0].total;
        
        const tickets = ticketRows.map(ticket => ({
            id: ticket.ticket_id,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            created_at: new Date(ticket.created_at).toISOString().split('T')[0]
        }));
        
        res.json({
            success: true,
            data: {
                tickets,
                pagination: {
                    total: totalTickets,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(totalTickets / limit)
                }
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

const updateUser = async (req, res, next) => {
    let connection;
    try {
        const userId = req.params.user_id;
        const { name, email, phone, status } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        connection = await pool.getConnection();
        
        const [userRows] = await connection.query(
            `SELECT user_id FROM users WHERE user_id = ?`,
            [userId]
        );
        
        if (userRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        let updateQuery = `UPDATE users SET `;
        const updateParams = [];
        const updateFields = [];
        
        if (name !== undefined) {
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            updateFields.push(`first_name = ?`, `last_name = ?`);
            updateParams.push(firstName, lastName);
        }
        
        if (email !== undefined) {
            updateFields.push(`email = ?`);
            updateParams.push(email);
        }
        
        if (phone !== undefined) {
            updateFields.push(`phone = ?`);
            updateParams.push(phone);
        }
        

        
        if (status !== undefined) {
            updateFields.push(`status = ?`);
            updateParams.push(status);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update provided'
            });
        }
        
        updateQuery += updateFields.join(', ');
        updateQuery += ` WHERE user_id = ?`;
        updateParams.push(userId);
        
        await connection.query(updateQuery, updateParams);
        
        res.json({
            success: true,
            message: 'User updated successfully'
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
    getAllUsers,
    getUserById,
    getUserTickets,
    updateUser
};