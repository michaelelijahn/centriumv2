// In middleware/errorHandler.js
const fs = require('fs');
const path = require('path');

module.exports = (err, req, res, next) => {
    // Log the error for server-side debugging
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    // Create a log file
    const logDir = path.join(__dirname, '../logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, 'error.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${req.method} ${req.url}\nError: ${err.message}\nStack: ${err.stack}\n\n`;
    
    fs.appendFile(logFile, logMessage, (fsErr) => {
        if (fsErr) console.error('Failed to write to log file:', fsErr);
    });
    
    // Send a proper error response
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'An unexpected error occurred',
        code: err.code || 'SERVER_ERROR'
    });
};