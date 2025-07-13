class AdminController {
    constructor() {
        // Initialize service cache
        this._userService = null;
        this._ticketService = null;
        this._container = null;
    }

    get container() {
        if (!this._container) {
            this._container = require('../container');
        }
        return this._container;
    }

    get userService() {
        if (!this._userService) {
            try {
                if (!this.container.has('userService')) {
                    throw new Error('UserService not available in container');
                }
                this._userService = this.container.get('userService');
            } catch (error) {
                console.error('Failed to get userService:', error.message);
                throw new Error(`Service initialization failed: ${error.message}`);
            }
        }
        return this._userService;
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

    async getAllUsers(req, res, next) {
        try {
            const options = {
                page: Math.max(1, parseInt(req.query.page) || 1),
                limit: Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)),
                role: req.query.role,
                status: req.query.status,
                search: req.query.search,
                sortBy: req.query.sort_by || 'created_at',
                sortOrder: req.query.sort_order || 'desc',
                dateFrom: req.query.date_from,
                dateTo: req.query.date_to
            };

            const result = await this.userService.getAllUsers(options);

            const formattedUsers = result.users.map(user => ({
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                email_verified: user.emailVerified,
                created_at: new Date(user.createdAt).toISOString().split('T')[0],
                updated_at: new Date(user.updatedAt).toISOString().split('T')[0],
                last_login_at: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().split('T')[0] : null
            }));

            const stats = await this.userService.getUserStatistics();

            res.json({
                success: true,
                data: {
                    users: formattedUsers,
                    pagination: result.pagination,
                    stats: {
                        total: stats.total,
                        admins: stats.admins,
                        customers: stats.customers,
                        active: stats.active,
                        inactive: stats.inactive,
                        suspended: stats.suspended
                    }
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserById(req, res, next) {
        try {
            console.log(req.params);
            const userId = req.params.user_id;
            console.log("userId: ", userId);
            const user = await this.userService.getUserById(userId);

            const formattedUser = {
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                email_verified: user.emailVerified,
                created_at: new Date(user.createdAt).toISOString().split('T')[0],
                updated_at: new Date(user.updatedAt).toISOString().split('T')[0],
                last_login_at: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().split('T')[0] : null
            };

            res.json({
                success: true,
                data: formattedUser
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    async createUser(req, res, next) {
        try {
            const requestingUserId = req.user?.userId;
            const requestingUserRole = req.user?.role;

            if (requestingUserRole !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Only administrators can create users'
                });
            }

            const userData = {
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role || 'customer',
                password: req.body.password
            };

            const user = await this.userService.createUser(userData);

            const formattedUser = {
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                email_verified: user.emailVerified,
                created_at: new Date(user.createdAt).toISOString().split('T')[0]
            };

            res.status(201).json({
                success: true,
                data: formattedUser,
                message: 'User created successfully'
            });
        } catch (error) {
            if (error.message.includes('Email already exists') || 
                error.message.includes('required') ||
                error.message.includes('characters') ||
                error.message.includes('format')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }

    async updateUser(req, res, next) {
        try {
            const userId = req.params.user_id;
            const requestingUserId = req.user?.userId;
            const requestingUserRole = req.user?.role;

            const updateData = {
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
                status: req.body.status
            };

            // Remove undefined fields
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined) {
                    delete updateData[key];
                }
            });

            const user = await this.userService.updateUser(
                userId, 
                updateData, 
                requestingUserId, 
                requestingUserRole
            );

            const formattedUser = {
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                email_verified: user.emailVerified,
                created_at: new Date(user.createdAt).toISOString().split('T')[0],
                updated_at: new Date(user.updatedAt).toISOString().split('T')[0],
                last_login_at: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().split('T')[0] : null
            };

            res.json({
                success: true,
                data: formattedUser,
                message: 'User updated successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('permission') ||
                error.message.includes('Email already exists') ||
                error.message.includes('required') ||
                error.message.includes('characters') ||
                error.message.includes('Invalid')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const userId = req.params.user_id;
            const requestingUserId = req.user?.userId;
            const requestingUserRole = req.user?.role;

            await this.userService.deleteUser(userId, requestingUserId, requestingUserRole);

            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('administrator') || 
                error.message.includes('cannot delete')) {
                return res.status(403).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    async toggleUserStatus(req, res, next) {
        try {
            const userId = req.params.user_id;
            const requestingUserId = req.user?.userId;
            const requestingUserRole = req.user?.role;

            const user = await this.userService.toggleUserStatus(userId, requestingUserId, requestingUserRole);

            res.json({
                success: true,
                data: {
                    user_id: user.id,
                    status: user.status
                },
                message: `User ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('administrator') || 
                error.message.includes('cannot change')) {
                return res.status(403).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    async promoteToAdmin(req, res, next) {
        try {
            const userId = req.params.user_id;
            const requestingUserId = req.user?.userId;
            const requestingUserRole = req.user?.role;

            const user = await this.userService.promoteToAdmin(userId, requestingUserId, requestingUserRole);

            res.json({
                success: true,
                data: {
                    user_id: user.id,
                    role: user.role
                },
                message: 'User promoted to administrator successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('administrator') || 
                error.message.includes('already an administrator')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    async demoteFromAdmin(req, res, next) {
        try {
            const userId = req.params.user_id;
            const requestingUserId = req.user?.userId;
            const requestingUserRole = req.user?.role;

            const user = await this.userService.demoteFromAdmin(userId, requestingUserId, requestingUserRole);

            res.json({
                success: true,
                data: {
                    user_id: user.id,
                    role: user.role
                },
                message: 'User demoted from administrator successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('administrator') || 
                error.message.includes('cannot demote') ||
                error.message.includes('not an administrator')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const userId = req.params.user_id;
            const requestingUserRole = req.user?.role;
            const { new_password } = req.body;

            await this.userService.resetPassword(userId, new_password, requestingUserRole);

            res.json({
                success: true,
                message: 'Password reset successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('administrator') || 
                error.message.includes('characters')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    async verifyEmail(req, res, next) {
        try {
            const userId = req.params.user_id;
            const requestingUserId = req.user?.userId;
            const requestingUserRole = req.user?.role;

            const user = await this.userService.verifyEmail(userId, requestingUserId, requestingUserRole);

            res.json({
                success: true,
                data: {
                    user_id: user.id,
                    email_verified: user.emailVerified
                },
                message: 'Email verified successfully'
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message.includes('verify your own') || 
                error.message.includes('already verified')) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            next(error);
        }
    }

    async searchUsers(req, res, next) {
        try {
            const searchQuery = req.query.q || req.query.search;
            const options = {
                page: Math.max(1, parseInt(req.query.page) || 1),
                limit: Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)),
                role: req.query.role,
                status: req.query.status,
                sortBy: req.query.sort_by || 'created_at',
                sortOrder: req.query.sort_order || 'desc'
            };

            const result = await this.userService.searchUsers(searchQuery, options);

            const formattedUsers = result.users.map(user => ({
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                email_verified: user.emailVerified,
                created_at: new Date(user.createdAt).toISOString().split('T')[0],
                updated_at: new Date(user.updatedAt).toISOString().split('T')[0],
                last_login_at: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().split('T')[0] : null
            }));

            res.json({
                success: true,
                data: {
                    users: formattedUsers,
                    pagination: result.pagination,
                    search_query: searchQuery
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getUsersByRole(req, res, next) {
        try {
            const role = req.params.role;
            const options = {
                page: Math.max(1, parseInt(req.query.page) || 1),
                limit: Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)),
                sortBy: req.query.sort_by || 'created_at',
                sortOrder: req.query.sort_order || 'desc'
            };

            const result = await this.userService.getUsersByRole(role, options);

            const formattedUsers = result.users.map(user => ({
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                email_verified: user.emailVerified,
                created_at: new Date(user.createdAt).toISOString().split('T')[0],
                updated_at: new Date(user.updatedAt).toISOString().split('T')[0],
                last_login_at: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().split('T')[0] : null
            }));

            res.json({
                success: true,
                data: {
                    users: formattedUsers,
                    pagination: result.pagination,
                    role: role
                }
            });
        } catch (error) {
            next(error);
        }
    }

    async getAdminUsers(req, res, next) {
        try {
            const options = {
                limit: parseInt(req.query.limit) || 50,
                offset: parseInt(req.query.offset) || 0
            };

            const adminUsers = await this.userService.getAdminUsers(options);

            const formattedUsers = adminUsers.map(user => ({
                id: user.id,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                phone: user.phone,
                status: user.status,
                email_verified: user.emailVerified,
                created_at: new Date(user.createdAt).toISOString().split('T')[0],
                last_login_at: user.lastLoginAt ? new Date(user.lastLoginAt).toISOString().split('T')[0] : null
            }));

            res.json({
                success: true,
                data: formattedUsers
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserTickets(req, res, next) {
        try {
            const userId = req.params.user_id;

            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                status: req.query.status,
                sortBy: req.query.sort_by || 'created_at',
                sortOrder: req.query.sort_order || 'desc'
            };

            // Verify user exists first
            await this.userService.getUserById(userId);

            const tickets = await this.ticketService.getUserTickets(userId, options);

            const formattedTickets = tickets.map(ticket => ({
                id: ticket.id,
                subject: ticket.subject,
                description: ticket.description,
                status: ticket.status,
                assigned_to: ticket.assignedTo,
                created_at: new Date(ticket.createdAt).toISOString().split('T')[0],
                updated_at: new Date(ticket.updatedAt).toISOString().split('T')[0],
                resolution_time: ticket.resolutionTime
            }));

            res.json({
                success: true,
                data: formattedTickets
            });
        } catch (error) {
            if (error.message === 'User not found') {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
            next(error);
        }
    }
}

module.exports = new AdminController(); 