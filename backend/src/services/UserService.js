const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userData) {
        // Create and validate user using domain model
        const user = User.create(userData);
        
        // Check if email already exists
        const existingUser = await this.userRepository.findByEmail(user.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Hash password if provided
        if (userData.password) {
            if (userData.password.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            
            // Create user in database
            const createdUser = await this.userRepository.create({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                emailVerified: user.emailVerified
            });

            // Update password separately
            await this.userRepository.updatePassword(createdUser.id, hashedPassword);
            
            return createdUser;
        } else {
            throw new Error('Password is required');
        }
    }

    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getUserByEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new Error('Valid email is required');
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async getAllUsers(options = {}) {
        const users = await this.userRepository.findAll(options);
        const totalCount = await this.userRepository.countAll(options);
        
        return {
            users,
            totalCount,
            pagination: {
                page: options.page || 1,
                limit: options.limit || 10,
                totalPages: Math.ceil(totalCount / (options.limit || 10))
            }
        };
    }

    async updateUser(id, updateData, requestingUserId, requestingUserRole) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        // Authorization checks
        const canUpdateAnyUser = requestingUserRole === 'admin';
        const canUpdateOwnProfile = requestingUserId === id;

        if (!canUpdateAnyUser && !canUpdateOwnProfile) {
            throw new Error('You do not have permission to update this user');
        }

        // Admins can update any field, users can only update their own profile fields
        let allowedFields = [];
        if (canUpdateAnyUser) {
            allowedFields = ['firstName', 'lastName', 'email', 'phone', 'role', 'status'];
        } else {
            allowedFields = ['firstName', 'lastName', 'phone']; // Users can't change email/role/status
        }

        const filteredUpdateData = {};
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                filteredUpdateData[field] = updateData[field];
            }
        }

        // Validate update data using domain model
        try {
            user.updateProfile(filteredUpdateData);
            
            if (filteredUpdateData.role && canUpdateAnyUser) {
                user.updateRole(filteredUpdateData.role);
            }
            
            if (filteredUpdateData.status && canUpdateAnyUser) {
                user.updateStatus(filteredUpdateData.status);
            }
        } catch (error) {
            throw error; // Re-throw validation errors
        }

        // Check for email conflicts if email is being updated
        if (filteredUpdateData.email) {
            const emailExists = await this.userRepository.emailExists(filteredUpdateData.email, id);
            if (emailExists) {
                throw new Error('Email already exists');
            }
        }

        return this.userRepository.update(id, filteredUpdateData);
    }

    async changePassword(userId, currentPassword, newPassword, requestingUserId, requestingUserRole) {
        const user = await this.userRepository.findByEmailWithPassword(
            (await this.userRepository.findById(userId)).email
        );
        
        if (!user) {
            throw new Error('User not found');
        }

        // Authorization check
        const canChangeAnyPassword = requestingUserRole === 'admin';
        const canChangeOwnPassword = requestingUserId === userId;

        if (!canChangeAnyPassword && !canChangeOwnPassword) {
            throw new Error('You do not have permission to change this password');
        }

        // For non-admin users, verify current password
        if (!canChangeAnyPassword) {
            if (!currentPassword) {
                throw new Error('Current password is required');
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                throw new Error('Current password is incorrect');
            }
        }

        // Validate new password
        if (!newPassword || newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
        }

        if (newPassword.length > 100) {
            throw new Error('Password is too long');
        }

        // Hash new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        return this.userRepository.updatePassword(userId, hashedPassword);
    }

    async authenticateUser(email, password) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (!user.isActive()) {
            throw new Error('Account is inactive');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Record login time
        await this.userRepository.recordLogin(user.id);

        // Return user without password
        delete user.password;
        return user;
    }

    async getUserStatistics() {
        return this.userRepository.getStatistics();
    }

    async searchUsers(searchQuery, options = {}) {
        if (!searchQuery || searchQuery.trim().length === 0) {
            return this.getAllUsers(options);
        }

        const searchOptions = {
            ...options,
            search: searchQuery.trim()
        };

        return this.getAllUsers(searchOptions);
    }

    async getUsersByRole(role, options = {}) {
        const roleOptions = {
            ...options,
            role
        };

        return this.getAllUsers(roleOptions);
    }

    async getUsersByStatus(status, options = {}) {
        const statusOptions = {
            ...options,
            status
        };

        return this.getAllUsers(statusOptions);
    }

    async deleteUser(userId, requestingUserId, requestingUserRole) {
        if (requestingUserRole !== 'admin') {
            throw new Error('Only administrators can delete users');
        }

        if (userId === requestingUserId) {
            throw new Error('You cannot delete your own account');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        return this.userRepository.delete(userId);
    }

    async toggleUserStatus(userId, requestingUserId, requestingUserRole) {
        if (requestingUserRole !== 'admin') {
            throw new Error('Only administrators can change user status');
        }

        if (userId === requestingUserId) {
            throw new Error('You cannot change your own status');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        
        return this.userRepository.update(userId, { status: newStatus });
    }

    async promoteToAdmin(userId, requestingUserId, requestingUserRole) {
        if (requestingUserRole !== 'admin') {
            throw new Error('Only administrators can promote users');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.role === 'admin') {
            throw new Error('User is already an administrator');
        }

        return this.userRepository.update(userId, { role: 'admin' });
    }

    async demoteFromAdmin(userId, requestingUserId, requestingUserRole) {
        if (requestingUserRole !== 'admin') {
            throw new Error('Only administrators can demote users');
        }

        if (userId === requestingUserId) {
            throw new Error('You cannot demote yourself');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.role !== 'admin') {
            throw new Error('User is not an administrator');
        }

        return this.userRepository.update(userId, { role: 'customer' });
    }

    async verifyEmail(userId, requestingUserId, requestingUserRole) {
        // Users can verify their own email, admins can verify any email
        if (requestingUserRole !== 'admin' && requestingUserId !== userId) {
            throw new Error('You can only verify your own email');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.emailVerified) {
            throw new Error('Email is already verified');
        }

        return this.userRepository.update(userId, { emailVerified: true });
    }

    async getAdminUsers(options = {}) {
        return this.userRepository.findByRole('admin', options);
    }

    async resetPassword(userId, newPassword, requestingUserRole) {
        if (requestingUserRole !== 'admin') {
            throw new Error('Only administrators can reset passwords');
        }

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (!newPassword || newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
        }

        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        return this.userRepository.updatePassword(userId, hashedPassword);
    }
}

module.exports = UserService; 