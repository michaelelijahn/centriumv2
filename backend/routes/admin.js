const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const supportController = require('../controllers/supportController');
const tradingController = require('../controllers/tradingController');
const authenticateToken = require('../middleware/authenticateToken');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const { 
    validateUserSearch,
    validateUserId,
    validateTicketId,
    validateTicketComment,
    validateTicketStatusUpdate,
    validateTradeSearch,
    validateTradeId,
    validateFileUpload
} = require('../middleware/validation');
const { adminLimiter, uploadLimiter } = require('../middleware/rateLimiting');

router.use(adminLimiter);
router.use(authenticateToken, adminAuth);

router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Admin API is working'
    });
});

// Fix: Bind context to preserve 'this' when methods are called as callbacks
router.get('/users', validateUserSearch, adminController.getAllUsers.bind(adminController));
router.get('/users/:user_id', validateUserId, adminController.getUserById.bind(adminController));
router.get('/users/:user_id/tickets', validateUserId, adminController.getUserTickets.bind(adminController));
router.patch('/users/:user_id', validateUserId, adminController.updateUser.bind(adminController));

router.get('/tickets', validateUserSearch, supportController.getAllTickets.bind(supportController));
router.get('/tickets/:ticket_id', validateTicketId, supportController.getTicketById.bind(supportController));
router.post('/tickets/:ticket_id/status', validateTicketStatusUpdate, supportController.updateTicketStatus.bind(supportController));
router.post('/tickets/:ticket_id/comment', validateTicketId, validateTicketComment, supportController.addTicketComment.bind(supportController));

router.get('/trading', validateTradeSearch, tradingController.getTrades);
router.get('/trading/:trade_id', validateTradeId, tradingController.getTradeById);
router.post('/trading/upload', uploadLimiter, upload.single('file'), validateFileUpload, tradingController.uploadTradesCsv);
router.get('/trading/filter-options', tradingController.getTradeFilterOptions);

module.exports = router;