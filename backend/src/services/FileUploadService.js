const s3 = require('../../config/s3');

class FileUploadService {
    constructor() {
        this.s3 = s3;
        this.bucketName = process.env.S3_BUCKET_NAME;
    }

    async uploadFile(file, userId, ticketId = null) {
        try {
            // Validate file
            this.validateFile(file);

            // Generate unique S3 key
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 15);
            const fileExtension = this.getFileExtension(file.originalname);
            
            let s3Key;
            if (ticketId) {
                s3Key = `tickets/${ticketId}/${userId}/${timestamp}-${randomString}${fileExtension}`;
            } else {
                s3Key = `uploads/${userId}/${timestamp}-${randomString}${fileExtension}`;
            }

            // Upload to S3
            const uploadParams = {
                Bucket: this.bucketName,
                Key: s3Key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: `attachment; filename="${file.originalname}"`,
                Metadata: {
                    'original-name': file.originalname,
                    'user-id': userId.toString(),
                    'upload-date': new Date().toISOString()
                }
            };

            if (ticketId) {
                uploadParams.Metadata['ticket-id'] = ticketId.toString();
            }

            const result = await this.s3.upload(uploadParams).promise();

            return {
                key: s3Key,
                url: result.Location,
                originalName: file.originalname,
                contentType: file.mimetype,
                size: file.size
            };
        } catch (error) {
            console.error('File upload failed:', error);
            throw new Error(`File upload failed: ${error.message}`);
        }
    }

    async getSignedUrl(s3Key, expiresIn = 300) {
        try {
            const url = this.s3.getSignedUrl('getObject', {
                Bucket: this.bucketName,
                Key: s3Key,
                Expires: expiresIn // 5 minutes default
            });

            return url;
        } catch (error) {
            console.error('Failed to generate signed URL:', error);
            throw new Error('Failed to generate download URL');
        }
    }

    async getFileStream(s3Key) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: s3Key
            };

            return this.s3.getObject(params).createReadStream();
        } catch (error) {
            console.error('Failed to get file stream:', error);
            throw new Error('Failed to retrieve file');
        }
    }

    async deleteFile(s3Key) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: s3Key
            };

            await this.s3.deleteObject(params).promise();
            return true;
        } catch (error) {
            console.error('Failed to delete file:', error);
            throw new Error('Failed to delete file');
        }
    }

    async getFileMetadata(s3Key) {
        try {
            const params = {
                Bucket: this.bucketName,
                Key: s3Key
            };

            const result = await this.s3.headObject(params).promise();
            
            return {
                size: result.ContentLength,
                contentType: result.ContentType,
                lastModified: result.LastModified,
                metadata: result.Metadata
            };
        } catch (error) {
            console.error('Failed to get file metadata:', error);
            throw new Error('Failed to get file information');
        }
    }

    validateFile(file) {
        if (!file) {
            throw new Error('No file provided');
        }

        if (!file.buffer || file.buffer.length === 0) {
            throw new Error('File is empty');
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            throw new Error('File size exceeds 5MB limit');
        }

        // Validate file type
        const allowedTypes = [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error('File type not allowed. Allowed types: JPEG, PNG, GIF, PDF, TXT, DOC, DOCX');
        }

        // Validate filename
        if (!file.originalname || file.originalname.trim().length === 0) {
            throw new Error('Invalid filename');
        }

        // Check for potentially dangerous file extensions
        const dangerousExtensions = ['.exe', '.bat', '.sh', '.cmd', '.scr', '.jar'];
        const filename = file.originalname.toLowerCase();
        
        for (const ext of dangerousExtensions) {
            if (filename.endsWith(ext)) {
                throw new Error('File type not allowed for security reasons');
            }
        }
    }

    getFileExtension(filename) {
        if (!filename || typeof filename !== 'string') {
            return '';
        }

        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
            return '';
        }

        return filename.substring(lastDotIndex);
    }

    // Helper method to validate multiple files
    validateFiles(files, maxFiles = 5) {
        if (!files || !Array.isArray(files)) {
            return; // No files is OK
        }

        if (files.length > maxFiles) {
            throw new Error(`Too many files. Maximum ${maxFiles} files allowed`);
        }

        // Validate total size across all files
        const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
        const maxTotalSize = 25 * 1024 * 1024; // 25MB total
        
        if (totalSize > maxTotalSize) {
            throw new Error('Total file size exceeds 25MB limit');
        }

        // Validate each file
        files.forEach((file, index) => {
            try {
                this.validateFile(file);
            } catch (error) {
                throw new Error(`File ${index + 1}: ${error.message}`);
            }
        });
    }

    // Get file info without downloading
    async checkFileExists(s3Key) {
        try {
            await this.getFileMetadata(s3Key);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Batch delete files
    async deleteFiles(s3Keys) {
        if (!s3Keys || !Array.isArray(s3Keys) || s3Keys.length === 0) {
            return { deleted: [], failed: [] };
        }

        const results = {
            deleted: [],
            failed: []
        };

        for (const key of s3Keys) {
            try {
                await this.deleteFile(key);
                results.deleted.push(key);
            } catch (error) {
                results.failed.push({ key, error: error.message });
            }
        }

        return results;
    }
}

module.exports = FileUploadService; 