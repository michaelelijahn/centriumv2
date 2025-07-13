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

router.use(authLimiter);

router.post('/register', registrationLimiter, validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/request-reset-password', passwordResetLimiter, validatePasswordReset, requestPasswordReset);
router.post('/verify-code', validateVerifyCode, verifyCode);
router.post('/reset-password', validateNewPassword, resetPassword);
router.post('/logout', authenticateToken, logout);

module.exports = router;