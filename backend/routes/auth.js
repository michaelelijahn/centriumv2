const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    logout,            
    requestPasswordReset, 
    verifyCode, 
    resetPassword, 
    refreshToken 
} = require('../controllers/authController');
const authenticateToken = require('../middleware/authenticateToken');
const { 
    validateLogin,
    validateRegister,
    validatePasswordReset,
    validateVerifyCode,
    validateNewPassword
} = require('../middleware/validation');
const { 
    authLimiter,
    registrationLimiter,
    passwordResetLimiter
} = require('../middleware/rateLimiting');

// router.use(authLimiter);

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/request-reset-password', requestPasswordReset);
router.post('/verify-code', verifyCode);
router.post('/reset-password', resetPassword);
router.post('/logout', authenticateToken, logout);

module.exports = router;