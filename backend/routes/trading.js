const express = require('express');
const router = express.Router();
const tradingController = require('../controllers/tradingController');
const authenticateToken = require('../middleware/authenticateToken');
const adminAuth = require('../middleware/adminAuth');
const multer = require('multer');
const { 
    validateTradeSearch,
    validateTradeId,
    validateFileUpload
} = require('../middleware/validation');
const { adminLimiter, uploadLimiter } = require('../middleware/rateLimiting');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
    }
});

router.use(adminLimiter);
router.use(authenticateToken, adminAuth);

// GET routes (no JSON parsing needed)
router.get('/filter-options', tradingController.getTradeFilterOptions);
router.get('/trades', adminLimiter, validateTradeSearch, tradingController.getTrades);
router.get('/trades/:tradeId', validateTradeId, tradingController.getTradeById);

// POST routes with specific middleware
router.post('/cleanup-headers', express.json(), adminLimiter, tradingController.cleanupHeaderRows);
router.post('/upload-csv', uploadLimiter, upload.single('file'), tradingController.uploadTradesCsv);

module.exports = router;