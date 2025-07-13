import React from 'react';

const TicketAttachments = ({ attachments, attachmentUrls }) => {
    if (!attachments || attachments.length === 0) {
        return null;
    }

    const getFileIcon = (contentType) => {
        if (contentType.startsWith('image/')) return 'mdi-file-image';
        if (contentType.startsWith('application/pdf')) return 'mdi-file-pdf';
        if (contentType.includes('spreadsheet') || contentType.includes('excel')) return 'mdi-file-excel';
        if (contentType.includes('document') || contentType.includes('word')) return 'mdi-file-word';
        return 'mdi-file-document-outline';
    };

    return (
        <div className="mt-4 mb-4">
            <h5>Attachments</h5>
            <div className="row">
                {attachments.map(attachment => (
                    <div key={attachment.id} className="col-md-4 col-sm-6 mb-3">
                        <div className="p-3 border rounded text-center">
                            {attachment.content_type.startsWith('image/') && attachmentUrls[attachment.id] ? (
                                <a 
                                    href={attachmentUrls[attachment.id]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <img 
                                        src={attachmentUrls[attachment.id]} 
                                        alt={attachment.file_name}
                                        className="img-fluid mb-2"
                                        style={{ maxHeight: '120px' }}
                                    />
                                </a>
                            ) : (
                                <a 
                                    href={attachmentUrls[attachment.id]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-decoration-none"
                                >
                                    <i className={`mdi ${getFileIcon(attachment.content_type)} text-primary`} style={{ fontSize: '48px' }}></i>
                                </a>
                            )}
                            <p className="small mb-0 mt-2 text-truncate">
                                <a 
                                    href={attachmentUrls[attachment.id]} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    title={attachment.file_name}
                                >
                                    {attachment.file_name}
                                </a>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketAttachments;