const s3 = require('../config/s3');
const { v4: uuidv4 } = require('uuid');

/**
 * Uploads a file to Amazon S3
 * @param {Buffer} buffer - The file content
 * @param {string} fileName - Original filename
 * @param {string} fileType - MIME type of the file
 * @param {number|string} userId - User ID
 * @param {number|string} ticketId - Ticket ID
 * @returns {Promise<Object>} Upload result with key, originalName and contentType
 */
const uploadToS3 = async (buffer, fileName, fileType, userId, ticketId) => {
    if (!process.env.S3_BUCKET_NAME) {
        throw new Error('S3_BUCKET_NAME environment variable is not set');
    }
    
    try {
        // Generate a unique file key
        const fileExtension = fileName.split('.').pop() || '';
        const uniqueFileName = `${uuidv4()}${fileExtension ? '.' + fileExtension : ''}`;
        const key = `tickets/${userId}/${ticketId}/${uniqueFileName}`;
        
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: fileType || 'application/octet-stream'
        };
        
        const uploadResult = await s3.upload(params).promise();
        
        return {
            key: uploadResult.Key,
            originalName: fileName,
            contentType: fileType
        };
    } catch (error) {
        throw error;
    }
};

module.exports = { uploadToS3 };