const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authenticateToken = require('../middleware/authenticateToken');
const upload = require('../middleware/upload');
const { 
    validateTicketCreation,
    validateTicketComment,
    validateTicketId
} = require('../middleware/validation');
const { uploadLimiter } = require('../middleware/rateLimiting');

// Fix: Bind context to preserve 'this' when methods are called as callbacks
router.post('/make-enquiry', authenticateToken, uploadLimiter, upload.array('files', 5), validateTicketCreation, supportController.makeEnquiry.bind(supportController));
router.get('/tickets', authenticateToken, supportController.getTickets.bind(supportController));
router.get('/tickets/:ticket_id', authenticateToken, validateTicketId, supportController.getTicketById.bind(supportController));
router.post('/tickets/:ticket_id/comment', authenticateToken, validateTicketId, validateTicketComment, supportController.addTicketComment.bind(supportController));

router.get('/attachment/url/:s3Key', authenticateToken, supportController.getAttachmentUrl.bind(supportController));
router.get('/attachment/stream/:s3Key', authenticateToken, supportController.streamAttachment.bind(supportController));

module.exports = router;