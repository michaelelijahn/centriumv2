const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const authenticateToken = require('../middleware/authenticateToken');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');

// Apply essential middleware
router.use(authenticateToken, adminAuth);

// Test route
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Trade API is working'
    });
});

// Trade routes
router.get('/', tradeController.getTrades);
router.get('/filter-options', tradeController.getTradeFilterOptions);
router.get('/:tradeId', tradeController.getTradeById);
router.post('/upload-csv', upload.single('file'), tradeController.uploadTradesCsv);

module.exports = router;