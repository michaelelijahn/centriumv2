class User {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phone = data.phone;
        this.role = data.role;
        this.status = data.status;
        this.emailVerified = data.emailVerified;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.lastLoginAt = data.lastLoginAt;
    }

    static create(userData) {
        // Validation
        User.validateEmail(userData.email);
        User.validateName(userData.firstName, 'First name');
        User.validateName(userData.lastName, 'Last name');
        
        if (userData.phone) {
            User.validatePhone(userData.phone);
        }

        return new User({
            firstName: userData.firstName.trim(),
            lastName: userData.lastName.trim(),
            email: userData.email.trim().toLowerCase(),
            phone: userData.phone?.trim(),
            role: userData.role || 'customer',
            status: 'active',
            emailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    static validateEmail(email) {
        if (!email || typeof email !== 'string') {
            throw new Error('Email is required');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw new Error('Invalid email format');
        }
    }

    static validateName(name, fieldName) {
        if (!name || typeof name !== 'string') {
            throw new Error(`${fieldName} is required`);
        }

        const trimmed = name.trim();
        if (trimmed.length < 2) {
            throw new Error(`${fieldName} must be at least 2 characters`);
        }

        if (trimmed.length > 50) {
            throw new Error(`${fieldName} must be less than 50 characters`);
        }

        // Only letters and spaces allowed
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(trimmed)) {
            throw new Error(`${fieldName} can only contain letters and spaces`);
        }
    }

    static validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return; // Phone is optional
        }

        const cleaned = phone.replace(/[^\d]/g, '');
        if (cleaned.length < 10 || cleaned.length > 15) {
            throw new Error('Phone number must be between 10 and 15 digits');
        }
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }

    updateProfile(updateData) {
        if (updateData.firstName) {
            User.validateName(updateData.firstName, 'First name');
            this.firstName = updateData.firstName.trim();
        }

        if (updateData.lastName) {
            User.validateName(updateData.lastName, 'Last name');
            this.lastName = updateData.lastName.trim();
        }

        if (updateData.email) {
            User.validateEmail(updateData.email);
            this.email = updateData.email.trim().toLowerCase();
            this.emailVerified = false; // Reset verification if email changes
        }

        if (updateData.phone !== undefined) {
            if (updateData.phone) {
                User.validatePhone(updateData.phone);
                this.phone = updateData.phone.trim();
            } else {
                this.phone = null;
            }
        }

        this.updatedAt = new Date();
    }

    updateRole(newRole) {
        const validRoles = ['admin', 'customer'];
        if (!validRoles.includes(newRole)) {
            throw new Error(`Invalid role: ${newRole}. Valid roles are: ${validRoles.join(', ')}`);
        }

        this.role = newRole;
        this.updatedAt = new Date();
    }

    updateStatus(newStatus) {
        const validStatuses = ['active', 'inactive', 'suspended'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(', ')}`);
        }

        this.status = newStatus;
        this.updatedAt = new Date();
    }

    verifyEmail() {
        this.emailVerified = true;
        this.updatedAt = new Date();
    }

    recordLogin() {
        this.lastLoginAt = new Date();
    }

    isAdmin() {
        return this.role === 'admin';
    }

    isActive() {
        return this.status === 'active';
    }

    canAccessTicket(ticketUserId) {
        return this.isAdmin() || this.id === ticketUserId;
    }

    toJSON(includePrivate = false) {
        const publicData = {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            role: this.role,
            status: this.status,
            createdAt: this.createdAt
        };

        if (includePrivate) {
            return {
                ...publicData,
                phone: this.phone,
                emailVerified: this.emailVerified,
                updatedAt: this.updatedAt,
                lastLoginAt: this.lastLoginAt
            };
        }

        return publicData;
    }
}

module.exports = User; 