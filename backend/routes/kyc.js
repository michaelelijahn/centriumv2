const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    submitForeignCompanyKYC,
    submitForeignPersonKYC,
    submitIndonesianCompanyKYC,
    submitIndonesianPersonKYC,
    submitRegulatedCompanyKYC,
    getKYCApplicationStatus,
    getUserKYCApplications
} = require('../controllers/kycController');
const authenticateToken = require('../middleware/authenticateToken');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit (as per frontend requirement)
    }
});

// Test route to check authentication
router.get('/test-auth', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Authentication working',
        user: req.user
    });
});

// Routes
router.post('/foreign-company/submit', 
    authenticateToken, 
    upload.any(), // Accept any fields (both files and text)
    submitForeignCompanyKYC
);

router.post('/foreign-person/submit', 
    authenticateToken, 
    upload.any(), // Accept any fields (both files and text)
    submitForeignPersonKYC
);

router.post('/indonesian-company/submit', 
    authenticateToken, 
    upload.any(), // Accept any fields (both files and text)
    submitIndonesianCompanyKYC
);

router.post('/indonesian-person/submit', 
    authenticateToken, 
    upload.any(), // Accept any fields (both files and text)
    submitIndonesianPersonKYC
);

router.post('/regulated-company/submit', 
    authenticateToken, 
    upload.any(), // Accept any fields (both files and text)
    submitRegulatedCompanyKYC
);

// Test endpoint removed - using secure authentication

router.get('/applications', 
    authenticateToken, 
    getUserKYCApplications
);

router.get('/application/:applicationId', 
    authenticateToken, 
    getKYCApplicationStatus
);

module.exports = router;
