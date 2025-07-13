const User = require('../models/User');

class UserRepository {
    constructor(database) {
        this.db = database;
    }

    async create(userData) {
        const connection = await this.db.getConnection();
        try {
            const [result] = await connection.execute(
                'INSERT INTO users (first_name, last_name, email, phone, role, status, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
                [
                    userData.firstName,
                    userData.lastName,
                    userData.email,
                    userData.phone,
                    userData.role,
                    userData.status,
                    userData.emailVerified
                ]
            );

            return this.findById(result.insertId, connection);
        } finally {
            connection.release();
        }
    }

    async findById(id, connection = null) {
        const conn = connection || await this.db.getConnection();
        try {
            const [rows] = await conn.execute(
                `SELECT user_id as id, first_name as firstName, last_name as lastName, 
                        email, phone, role, status, email_verified as emailVerified, 
                        created_at as createdAt, updated_at as updatedAt, 
                        last_login_at as lastLoginAt
                 FROM users 
                 WHERE user_id = ?`,
                [id]
            );

            if (rows.length === 0) {
                return null;
            }

            return new User(rows[0]);
        } finally {
            if (!connection) conn.release();
        }
    }

    async findByEmail(email) {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT user_id as id, first_name as firstName, last_name as lastName, 
                        email, phone, role, status, email_verified as emailVerified, 
                        created_at as createdAt, updated_at as updatedAt, 
                        last_login_at as lastLoginAt
                 FROM users 
                 WHERE email = ?`,
                [email.toLowerCase()]
            );

            if (rows.length === 0) {
                return null;
            }

            return new User(rows[0]);
        } finally {
            connection.release();
        }
    }

    async findAll(options = {}) {
        const { 
            page = 1, 
            limit = 10, 
            role, 
            status, 
            search, 
            sortBy = 'created_at', 
            sortOrder = 'desc',
            dateFrom,
            dateTo
        } = options;
        
        const offset = (page - 1) * limit;
        let whereConditions = [];
        let params = [];

        if (role) {
            whereConditions.push('role = ?');
            params.push(role);
        }

        if (status) {
            whereConditions.push('status = ?');
            params.push(status);
        }

        if (search) {
            whereConditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR user_id = ?)');
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, search);
        }

        if (dateFrom) {
            whereConditions.push('DATE(created_at) >= ?');
            params.push(dateFrom);
        }

        if (dateTo) {
            whereConditions.push('DATE(created_at) <= ?');
            params.push(dateTo);
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        // Validate sort parameters
        const validSortColumns = ['created_at', 'updated_at', 'first_name', 'last_name', 'email', 'role', 'status'];
        const validSortOrders = ['asc', 'desc'];
        
        const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
        const safeSortOrder = validSortOrders.includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';

        const query = `
            SELECT user_id as id, first_name as firstName, last_name as lastName, 
                   email, phone, role, status, email_verified as emailVerified, 
                   created_at as createdAt, updated_at as updatedAt, 
                   last_login_at as lastLoginAt
            FROM users
            ${whereClause}
            ORDER BY ${safeSortBy} ${safeSortOrder.toUpperCase()}
            LIMIT ? OFFSET ?`;

        params.push(limit, offset);

        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(query, params);
            return rows.map(row => new User(row));
        } finally {
            connection.release();
        }
    }

    async countAll(options = {}) {
        const { role, status, search, dateFrom, dateTo } = options;
        let whereConditions = [];
        let params = [];

        if (role) {
            whereConditions.push('role = ?');
            params.push(role);
        }

        if (status) {
            whereConditions.push('status = ?');
            params.push(status);
        }

        if (search) {
            whereConditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR user_id = ?)');
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, search);
        }

        if (dateFrom) {
            whereConditions.push('DATE(created_at) >= ?');
            params.push(dateFrom);
        }

        if (dateTo) {
            whereConditions.push('DATE(created_at) <= ?');
            params.push(dateTo);
        }

        const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

        const query = `SELECT COUNT(*) as total FROM users ${whereClause}`;

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
                    SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admins,
                    SUM(CASE WHEN role = 'customer' THEN 1 ELSE 0 END) as customers,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                    SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive,
                    SUM(CASE WHEN status = 'suspended' THEN 1 ELSE 0 END) as suspended
                FROM users
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

            if (updateData.firstName !== undefined) {
                setParts.push('first_name = ?');
                params.push(updateData.firstName);
            }

            if (updateData.lastName !== undefined) {
                setParts.push('last_name = ?');
                params.push(updateData.lastName);
            }

            if (updateData.email !== undefined) {
                setParts.push('email = ?');
                params.push(updateData.email);
            }

            if (updateData.phone !== undefined) {
                setParts.push('phone = ?');
                params.push(updateData.phone);
            }

            if (updateData.role !== undefined) {
                setParts.push('role = ?');
                params.push(updateData.role);
            }

            if (updateData.status !== undefined) {
                setParts.push('status = ?');
                params.push(updateData.status);
            }

            if (updateData.emailVerified !== undefined) {
                setParts.push('email_verified = ?');
                params.push(updateData.emailVerified);
            }

            if (updateData.lastLoginAt !== undefined) {
                setParts.push('last_login_at = ?');
                params.push(updateData.lastLoginAt);
            }

            setParts.push('updated_at = NOW()');
            params.push(id);

            const query = `UPDATE users SET ${setParts.join(', ')} WHERE user_id = ?`;
            await connection.execute(query, params);

            return this.findById(id, connection);
        } finally {
            connection.release();
        }
    }

    async updatePassword(id, hashedPassword) {
        const connection = await this.db.getConnection();
        try {
            await connection.execute(
                'UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?',
                [hashedPassword, id]
            );
            return true;
        } finally {
            connection.release();
        }
    }

    async findByEmailWithPassword(email) {
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT user_id as id, first_name as firstName, last_name as lastName, 
                        email, phone, role, status, email_verified as emailVerified, 
                        password, created_at as createdAt, updated_at as updatedAt, 
                        last_login_at as lastLoginAt
                 FROM users 
                 WHERE email = ?`,
                [email.toLowerCase()]
            );

            if (rows.length === 0) {
                return null;
            }

            const userData = rows[0];
            const user = new User(userData);
            // Add password property for authentication (not included in User model)
            user.password = userData.password;
            return user;
        } finally {
            connection.release();
        }
    }

    async recordLogin(id) {
        const connection = await this.db.getConnection();
        try {
            await connection.execute(
                'UPDATE users SET last_login_at = NOW() WHERE user_id = ?',
                [id]
            );
        } finally {
            connection.release();
        }
    }

    async delete(id) {
        const connection = await this.db.getConnection();
        try {
            await connection.beginTransaction();

            // Check if user has tickets or other related data
            const [ticketCount] = await connection.execute(
                'SELECT COUNT(*) as count FROM tickets WHERE user_id = ?',
                [id]
            );

            if (ticketCount[0].count > 0) {
                // Don't delete users with tickets, just deactivate
                await connection.execute(
                    'UPDATE users SET status = "inactive", updated_at = NOW() WHERE user_id = ?',
                    [id]
                );
            } else {
                // Safe to delete user with no related data
                await connection.execute('DELETE FROM users WHERE user_id = ?', [id]);
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async emailExists(email, excludeUserId = null) {
        const connection = await this.db.getConnection();
        try {
            let query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
            let params = [email.toLowerCase()];

            if (excludeUserId) {
                query += ' AND user_id != ?';
                params.push(excludeUserId);
            }

            const [rows] = await connection.execute(query, params);
            return rows[0].count > 0;
        } finally {
            connection.release();
        }
    }

    async findByRole(role, options = {}) {
        const { limit = 10, offset = 0 } = options;
        
        const connection = await this.db.getConnection();
        try {
            const [rows] = await connection.execute(
                `SELECT user_id as id, first_name as firstName, last_name as lastName, 
                        email, phone, role, status, email_verified as emailVerified, 
                        created_at as createdAt, updated_at as updatedAt, 
                        last_login_at as lastLoginAt
                 FROM users 
                 WHERE role = ? AND status = 'active'
                 ORDER BY first_name, last_name
                 LIMIT ? OFFSET ?`,
                [role, limit, offset]
            );

            return rows.map(row => new User(row));
        } finally {
            connection.release();
        }
    }
}

module.exports = UserRepository; 