const pool = require('../config/db');

// Repositories
const TicketRepository = require('./repositories/TicketRepository');
const UserRepository = require('./repositories/UserRepository');

// Services
const TicketService = require('./services/TicketService');
const UserService = require('./services/UserService');
const FileUploadService = require('./services/FileUploadService');

class DIContainer {
    constructor() {
        this.services = new Map();
        this.repositories = new Map();
        this._initialize();
    }

    _initialize() {
        // Initialize repositories
        this.repositories.set('ticketRepository', new TicketRepository(pool));
        this.repositories.set('userRepository', new UserRepository(pool));

        // Initialize services with their dependencies
        this.services.set('fileUploadService', new FileUploadService());
        
        this.services.set('userService', new UserService(
            this.repositories.get('userRepository')
        ));

        this.services.set('ticketService', new TicketService(
            this.repositories.get('ticketRepository'),
            this.services.get('fileUploadService'),
            this.repositories.get('userRepository')
        ));
    }

    // Get service instance
    get(serviceName) {
        if (this.services.has(serviceName)) {
            return this.services.get(serviceName);
        }

        if (this.repositories.has(serviceName)) {
            return this.repositories.get(serviceName);
        }

        throw new Error(`Service or repository '${serviceName}' not found`);
    }

    // Check if service exists
    has(serviceName) {
        return this.services.has(serviceName) || this.repositories.has(serviceName);
    }

    // Register a new service (for testing or custom services)
    register(name, instance) {
        this.services.set(name, instance);
    }

    // Get all available services/repositories
    getAvailable() {
        return {
            services: Array.from(this.services.keys()),
            repositories: Array.from(this.repositories.keys())
        };
    }

    // Health check - verify all dependencies are properly wired
    async healthCheck() {
        const health = {
            status: 'healthy',
            services: {},
            repositories: {},
            errors: []
        };

        try {
            // Check database connection
            const connection = await pool.getConnection();
            connection.release();
            health.database = 'connected';
        } catch (error) {
            health.status = 'unhealthy';
            health.database = 'disconnected';
            health.errors.push(`Database: ${error.message}`);
        }

        // Check services
        for (const [name, service] of this.services) {
            try {
                // Basic service check - ensure it's an object with methods
                if (typeof service === 'object' && service !== null) {
                    health.services[name] = 'available';
                } else {
                    health.services[name] = 'invalid';
                    health.errors.push(`Service ${name} is not properly initialized`);
                }
            } catch (error) {
                health.status = 'unhealthy';
                health.services[name] = 'error';
                health.errors.push(`Service ${name}: ${error.message}`);
            }
        }

        // Check repositories
        for (const [name, repo] of this.repositories) {
            try {
                if (typeof repo === 'object' && repo !== null && repo.db) {
                    health.repositories[name] = 'available';
                } else {
                    health.repositories[name] = 'invalid';
                    health.errors.push(`Repository ${name} is not properly initialized`);
                }
            } catch (error) {
                health.status = 'unhealthy';
                health.repositories[name] = 'error';
                health.errors.push(`Repository ${name}: ${error.message}`);
            }
        }

        return health;
    }

    // Graceful shutdown
    async shutdown() {
        try {
            // Close database connections
            if (pool && pool.end) {
                await pool.end();
            }
            
            // Clear all services and repositories
            this.services.clear();
            this.repositories.clear();
            
            console.log('DI Container shut down gracefully');
        } catch (error) {
            console.error('Error during DI Container shutdown:', error);
            throw error;
        }
    }
}

// Export singleton instance
const container = new DIContainer();

module.exports = container; 