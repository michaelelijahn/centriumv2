const pool = require('../config/db');

class Container {
    constructor() {
        this.services = new Map();
        this.initialized = true;
    }

    async healthCheck() {
        try {
            // Test database connection
            const connection = await pool.getConnection();
            await connection.ping();
            connection.release();

            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                services: {
                    database: 'connected',
                    application: 'running'
                }
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message,
                services: {
                    database: 'disconnected',
                    application: 'running'
                }
            };
        }
    }

    getAvailable() {
        return {
            routes: ['auth', 'bank', 'support', 'tickets', 'trades'],
            middleware: ['authenticateToken', 'adminAuth', 'rateLimiting', 'validation'],
            controllers: ['admin', 'support', 'trading', 'auth', 'bank'],
            status: 'initialized'
        };
    }

    async shutdown() {
        try {
            // Close database connections
            if (pool && pool.end) {
                await pool.end();
            }
            console.log('Container shutdown completed successfully');
        } catch (error) {
            console.error('Error during container shutdown:', error);
            throw error;
        }
    }
}

// Export singleton instance
module.exports = new Container(); 