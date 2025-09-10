const s3 = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

/**
 * Uploads a file to Amazon S3
 * @param {Buffer} buffer - The file content
 * @param {string} fileName - Original filename or file path
 * @param {string} fileType - MIME type of the file
 * @param {number|string} userId - User ID (for tickets)
 * @param {number|string} ticketId - Ticket ID (for tickets)
 * @returns {Promise<Object>} Upload result with key, originalName and contentType
 */
const uploadToS3 = async (buffer, fileName, fileType, userId = null, ticketId = null) => {
    if (!process.env.S3_BUCKET_NAME) {
        throw new Error('S3_BUCKET_NAME environment variable is not set');
    }
    
    try {
        let key;
        let originalName;
        
        // If userId and ticketId are provided, use ticket format (backward compatibility)
        if (userId && ticketId) {
            const fileExtension = fileName.split('.').pop() || '';
            const uniqueFileName = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`;
            key = `tickets/${userId}/${ticketId}/${uniqueFileName}`;
            originalName = fileName;
        } else {
            // Use fileName as the full path (for KYC documents)
            key = fileName;
            originalName = fileName.split('/').pop(); // Extract just the filename from path
        }
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: fileType || 'application/octet-stream'
        };
        
        const uploadResult = await s3.upload(params).promise();
        
        return {
            key: uploadResult.Key,
            originalName: originalName,
            contentType: fileType,
            Location: uploadResult.Location
        };
    } catch (error) {
        throw error;
    }
};

module.exports = { uploadToS3 };