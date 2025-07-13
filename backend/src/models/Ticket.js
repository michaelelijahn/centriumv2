class Ticket {
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.subject = data.subject;
        this.description = data.description;
        this.status = data.status;
        this.assignedTo = data.assignedTo;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.resolutionTime = data.resolutionTime;
        this.attachments = data.attachments || [];
        this.comments = data.comments || [];
        this.customer = data.customer || null;
    }

    static create(userId, subject, description) {
        // Validation
        Ticket.validateSubject(subject);
        Ticket.validateDescription(description);
        
        return new Ticket({
            userId,
            subject: subject.trim(),
            description: description.trim(),
            status: 'open',
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    static validateSubject(subject) {
        if (!subject || typeof subject !== 'string') {
            throw new Error('Subject is required');
        }
        
        const trimmed = subject.trim();
        if (trimmed.length < 5) {
            throw new Error('Subject must be at least 5 characters');
        }
        
        if (trimmed.length > 200) {
            throw new Error('Subject must be less than 200 characters');
        }
    }

    static validateDescription(description) {
        if (!description || typeof description !== 'string') {
            throw new Error('Description is required');
        }
        
        const trimmed = description.trim();
        if (trimmed.length < 10) {
            throw new Error('Description must be at least 10 characters');
        }
        
        if (trimmed.length > 2000) {
            throw new Error('Description must be less than 2000 characters');
        }
    }

    updateStatus(newStatus) {
        const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error(`Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(', ')}`);
        }

        this.status = newStatus;
        this.updatedAt = new Date();
        
        if (newStatus === 'resolved' || newStatus === 'closed') {
            this.resolutionTime = new Date();
        }
    }

    addComment(userId, comment) {
        if (!comment || comment.trim().length === 0) {
            throw new Error('Comment cannot be empty');
        }

        if (this.status === 'closed') {
            throw new Error('Cannot add comments to a closed ticket');
        }

        // If ticket was resolved and someone adds a comment, move it back to in_progress
        if (this.status === 'resolved') {
            this.status = 'in_progress';
            this.updatedAt = new Date();
        }

        const newComment = {
            userId,
            comment: comment.trim(),
            createdAt: new Date()
        };

        this.comments.push(newComment);
        return newComment;
    }

    canBeAccessedBy(userId, userRole) {
        return userRole === 'admin' || this.userId === userId;
    }

    canBeUpdatedBy(userId, userRole) {
        return userRole === 'admin' || this.userId === userId;
    }

    addAttachment(attachment) {
        if (!attachment || !attachment.fileName || !attachment.s3Key) {
            throw new Error('Invalid attachment data');
        }

        this.attachments.push({
            id: attachment.id,
            fileName: attachment.fileName,
            s3Key: attachment.s3Key,
            contentType: attachment.contentType,
            createdAt: new Date()
        });
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            subject: this.subject,
            description: this.description,
            status: this.status,
            assignedTo: this.assignedTo,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            resolutionTime: this.resolutionTime,
            attachments: this.attachments,
            comments: this.comments,
            customer: this.customer
        };
    }
}

module.exports = Ticket; 