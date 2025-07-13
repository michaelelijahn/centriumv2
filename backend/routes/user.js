const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');
const adminAuth = require('../middleware/adminAuth');

// Apply essential middleware
router.use(authenticateToken, adminAuth);

// Test route
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'User API is working'
    });
});

// User routes
router.get('/', userController.getAllUsers);
router.get('/:user_id', userController.getUserById);
router.get('/:user_id/tickets', userController.getUserTickets);
router.patch('/:user_id', userController.updateUser);

module.exports = router;
