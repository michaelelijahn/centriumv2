const pool = require('../config/db');

const getAllUsers = async (req, res, next) => {
    let connection;
    try {
        const { 
            search = '', 
            page = 1, 
            limit = 20, 
            sort_by = 'created_at', 
            sort_order = 'desc',
            statistics = false 
        } = req.query;
        
        // Ensure valid integers for pagination
        const validPage = Math.max(1, parseInt(page) || 1);
        const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 20));
        const offset = (validPage - 1) * validLimit;
        
        connection = await pool.getConnection();
        
        if (statistics) {
            const [totalCountResult] = await connection.execute(
                'SELECT COUNT(*) as total FROM users'
            );
            
            const [statusCounts] = await connection.execute(
                `SELECT status, COUNT(*) as count 
                 FROM users 
                 GROUP BY status`
            );
            
            const [roleCounts] = await connection.execute(
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
            
            if (validLimit === 1) {
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
        
        let query = `
            SELECT user_id, first_name, last_name, email, role, phone, created_at, status
            FROM users
            WHERE 1=1
        `;
        
        const queryParams = [];
        
        if (search) {
            query += ` AND (
                first_name LIKE ? OR 
                last_name LIKE ? OR
                email LIKE ? OR 
                user_id LIKE ?
            )`;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        const validSortColumns = ['user_id', 'first_name', 'email', 'role', 'created_at', 'status'];
        const sortColumn = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
        const sortDir = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        
        // Use string interpolation for LIMIT to avoid MAMP MySQL compatibility issues
        query += ` ORDER BY ${sortColumn} ${sortDir} LIMIT ${offset}, ${validLimit}`;
        
        const [userRows] = await connection.execute(query, queryParams);
        
        let countQuery = `
            SELECT COUNT(*) as total 
            FROM users
            WHERE 1=1
        `;
        
        const countParams = [];
        
        if (search) {
            countQuery += ` AND (
                first_name LIKE ? OR 
                last_name LIKE ? OR
                email LIKE ? OR 
                user_id LIKE ?
            )`;
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }
        
        const [countResult] = await connection.execute(countQuery, countParams);
        const totalUsers = countResult[0].total;
        
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
                    page: validPage,
                    limit: validLimit,
                    pages: Math.ceil(totalUsers / validLimit)
                }
        };
        
        if (statistics) {
            const [statusCounts] = await connection.execute(
                `SELECT status, COUNT(*) as count 
                 FROM users 
                 GROUP BY status`
            );
            
            const [roleCounts] = await connection.execute(
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
        
        const [userRows] = await connection.execute(
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
        
        const [ticketCountRows] = await connection.execute(
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
        
        // Ensure valid integers for pagination
        const validPage = Math.max(1, parseInt(page) || 1);
        const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 10));
        const offset = (validPage - 1) * validLimit;
        
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
        
        // Use string interpolation for LIMIT to avoid MAMP MySQL compatibility issues
        query += ` ORDER BY created_at DESC LIMIT ${offset}, ${validLimit}`;
        
        const [ticketRows] = await connection.execute(query, queryParams);
        
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
        
        const [countResult] = await connection.execute(countQuery, countParams);
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
                    page: validPage,
                    limit: validLimit,
                    pages: Math.ceil(totalTickets / validLimit)
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
        const { first_name, last_name, email, phone, status } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        
        connection = await pool.getConnection();
        
        const [userRows] = await connection.execute(
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
        
        if (first_name !== undefined) {
            updateFields.push(`first_name = ?`);
            updateParams.push(first_name);
        }
        
        if (last_name !== undefined) {
            updateFields.push(`last_name = ?`);
            updateParams.push(last_name);
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
        
        await connection.execute(updateQuery, updateParams);
        
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