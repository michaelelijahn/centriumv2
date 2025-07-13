const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes.',
        code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many requests from this IP, please try again after 15 minutes.',
            code: 'RATE_LIMIT_EXCEEDED'
        });
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: 'error',
        message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
        code: 'AUTH_RATE_LIMIT_EXCEEDED'
    },
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
            code: 'AUTH_RATE_LIMIT_EXCEEDED'
        });
    }
});

const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        status: 'error',
        message: 'Too many admin requests from this IP, please try again after 15 minutes.',
        code: 'ADMIN_RATE_LIMIT_EXCEEDED'
    },
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many admin requests from this IP, please try again after 15 minutes.',
            code: 'ADMIN_RATE_LIMIT_EXCEEDED'
        });
    }
});

const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: {
        status: 'error',
        message: 'Too many file uploads from this IP, please try again after 1 hour.',
        code: 'UPLOAD_RATE_LIMIT_EXCEEDED'
    },
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many file uploads from this IP, please try again after 1 hour.',
            code: 'UPLOAD_RATE_LIMIT_EXCEEDED'
        });
    }
});

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        status: 'error',
        message: 'Too many password reset attempts from this IP, please try again after 1 hour.',
        code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED'
    },
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many password reset attempts from this IP, please try again after 1 hour.',
            code: 'PASSWORD_RESET_RATE_LIMIT_EXCEEDED'
        });
    }
});

const registrationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        status: 'error',
        message: 'Too many registration attempts from this IP, please try again after 1 hour.',
        code: 'REGISTRATION_RATE_LIMIT_EXCEEDED'
    },
    handler: (req, res) => {
        res.status(429).json({
            status: 'error',
            message: 'Too many registration attempts from this IP, please try again after 1 hour.',
            code: 'REGISTRATION_RATE_LIMIT_EXCEEDED'
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    adminLimiter,
    uploadLimiter,
    passwordResetLimiter,
    registrationLimiter
}; 