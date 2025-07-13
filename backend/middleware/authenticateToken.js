const { verifyAccessToken } = require('../utils/jwt');
const pool = require('../config/db');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Access token is required'
            });
        }

        const decoded = verifyAccessToken(token);
        
        const connection = await pool.getConnection();
        try {
            const [tokens] = await connection.execute(
                'SELECT * FROM user_tokens WHERE access_token = ? AND access_expires_at > NOW()',
                [token]
            );

            if (tokens.length === 0) {
                throw new Error('Invalid or expired token');
            }

            req.user = decoded;

            next();
        } finally {
            connection.release();
        }
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authenticateToken;