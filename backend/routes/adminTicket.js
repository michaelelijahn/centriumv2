const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authenticateToken = require('../middleware/authenticateToken');
const adminAuth = require('../middleware/adminAuth');

// Apply essential middleware
router.use(authenticateToken, adminAuth);

// Test route
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Admin Ticket API is working'
    });
});

// Admin ticket routes
router.get('/', ticketController.getAllTickets);
router.get('/:ticket_id', ticketController.getTicketById);
router.post('/:ticket_id/comment', ticketController.addTicketComment);
router.post('/:ticket_id/status', ticketController.updateTicketStatus);

module.exports = router;