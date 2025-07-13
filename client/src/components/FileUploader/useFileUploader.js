import { useState } from 'react';

export default function useFileUploader(showPreview = true) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    
    const handleAcceptedFiles = (files, callback) => {
        const allFiles = [...files];

        if (showPreview) {
            allFiles.forEach(file => {
                Object.assign(file, {
                    preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
                    formattedSize: formatBytes(file.size)
                });
            });

            setSelectedFiles(prev => [...prev, ...allFiles]);
        }

        if (callback) callback(allFiles);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const removeFile = (file, callback) => {
        const newFiles = [...selectedFiles];
        const index = newFiles.indexOf(file);
        if (index !== -1) {
            newFiles.splice(index, 1);
            setSelectedFiles(newFiles);
            
            if (callback) callback(newFiles);
        }
    };

    return {
        selectedFiles,
        handleAcceptedFiles,
        removeFile
    };
}