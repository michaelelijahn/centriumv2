const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/upload');

// Test route
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Support API is working'
    });
});

// Customer-specific ticket operations
router.get('/tickets', authenticateToken, supportController.getTickets);
router.post('/make-enquiry', authenticateToken, upload.array('files', 5), supportController.makeEnquiry);
router.get('/tickets/:ticket_id', authenticateToken, supportController.getTicketById);
router.post('/tickets/:ticket_id/comment', authenticateToken, supportController.addTicketComment);

// Attachment handling (customer access to their attachments)
router.get('/attachment/url/:s3Key', authenticateToken, supportController.getAttachmentUrl);
router.get('/attachment/stream/:s3Key', authenticateToken, supportController.streamAttachment);

module.exports = router;