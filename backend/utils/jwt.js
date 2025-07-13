const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
    const now = new Date();
    
    const accessExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const refreshExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const accessToken = jwt.sign(
        { 
            userId: user.user_id,
            email: user.email,
            role: user.role 
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
    );
    
    const refreshToken = jwt.sign(
        { 
            userId: user.user_id
        }, 
        process.env.JWT_REFRESH_SECRET, 
        { expiresIn: '7d' }
    );
    
    return {
        accessToken,         
        refreshToken,
        accessExpiresAt,
        refreshExpiresAt
    };
};

const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid access token');
    }
};

const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken };