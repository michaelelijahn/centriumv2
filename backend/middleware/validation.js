const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .trim(),
    body('ip_address')
        .optional()
        .isIP()
        .withMessage('Invalid IP address format'),
    body('device_info')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Device info too long')
        .trim()
        .escape(),
    handleValidationErrors
];

const validateRegister = [
    body('first_name')
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces')
        .trim()
        .escape(),
    body('last_name')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces')
        .trim()
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),
    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Please provide a valid phone number'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('salt')
        .optional()
        .isLength({ min: 10, max: 100 })
        .withMessage('Salt must be between 10 and 100 characters'),
    handleValidationErrors
];

const validatePasswordReset = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .trim(),
    handleValidationErrors
];

const validateVerifyCode = [
    body('token')
        .isLength({ min: 32, max: 64 })
        .withMessage('Invalid token format')
        .matches(/^[a-f0-9]+$/)
        .withMessage('Token must be hexadecimal'),
    body('code')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification code must be 6 digits')
        .isNumeric()
        .withMessage('Verification code must be numeric'),
    handleValidationErrors
];

const validateNewPassword = [
    body('token')
        .isLength({ min: 32, max: 64 })
        .withMessage('Invalid token format')
        .matches(/^[a-f0-9]+$/)
        .withMessage('Token must be hexadecimal'),
    body('code')
        .isLength({ min: 6, max: 6 })
        .withMessage('Verification code must be 6 digits')
        .isNumeric()
        .withMessage('Verification code must be numeric'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    handleValidationErrors
];

const validateTicketCreation = [
    body('subject')
        .isLength({ min: 5, max: 200 })
        .withMessage('Subject must be between 5 and 200 characters')
        .trim()
        .escape(),
    body('description')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters')
        .trim()
        .escape(),
    handleValidationErrors
];

const validateTicketComment = [
    body('comment')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters')
        .trim()
        .escape(),
    handleValidationErrors
];

const validateTicketStatusUpdate = [
    param('ticket_id')
        .isInt({ min: 1 })
        .withMessage('Invalid ticket ID'),
    body('status')
        .isIn(['open', 'in_progress', 'resolved', 'closed'])
        .withMessage('Invalid status value'),
    handleValidationErrors
];

const validateUserSearch = [
    query('search')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Search term too long')
        .trim()
        .escape(),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('sort_by')
        .optional()
        .isIn(['created_at', 'email', 'name', 'status', 'role'])
        .withMessage('Invalid sort field'),
    query('sort_order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),
    handleValidationErrors
];

const validateUserId = [
    param('user_id')
        .isInt({ min: 1 })
        .withMessage('Invalid user ID'),
    handleValidationErrors
];

const validateTicketId = [
    param('ticket_id')
        .isInt({ min: 1 })
        .withMessage('Invalid ticket ID'),
    handleValidationErrors
];

const validateTradeSearch = [
    query('search')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Search term too long')
        .trim()
        .escape(),
    query('side')
        .optional()
        .isIn(['buy', 'sell'])
        .withMessage('Side must be buy or sell'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    handleValidationErrors
];

const validateTradeId = [
    param('tradeId')
        .isLength({ min: 1, max: 50 })
        .withMessage('Invalid trade ID format')
        .trim(),
    handleValidationErrors
];

const validateFileUpload = (req, res, next) => {
    if (!req.file && (!req.files || req.files.length === 0)) {
        return res.status(400).json({
            status: 'error',
            message: 'No file uploaded'
        });
    }
    
    const files = req.files || [req.file];
    for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
            return res.status(400).json({
                status: 'error',
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'
            });
        }
    }
    
    next();
};

module.exports = {
    handleValidationErrors,
    validateLogin,
    validateRegister,
    validatePasswordReset,
    validateVerifyCode,
    validateNewPassword,
    validateTicketCreation,
    validateTicketComment,
    validateTicketStatusUpdate,
    validateUserSearch,
    validateUserId,
    validateTicketId,
    validateTradeSearch,
    validateTradeId,
    validateFileUpload
}; 