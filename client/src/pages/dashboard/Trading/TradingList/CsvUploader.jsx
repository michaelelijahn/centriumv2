import React, { useRef } from 'react';
import { Button, Spinner, Form } from 'react-bootstrap';

const CsvUploader = ({ onUpload, uploading }) => {
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onUpload(file);
            fileInputRef.current.value = '';
        }
    };

    return (
        <Form className="d-flex align-items-center gap-2">
            <Form.Control
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={uploading}
                style={{ maxWidth: 250 }}
            />
            <Button
                variant="primary"
                disabled={uploading}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                type="button"
            >
                {uploading ? (
                    <><Spinner as="span" size="sm" animation="border" className="me-1" />Uploading...</>
                ) : (
                    <><i className="mdi mdi-upload me-1"></i>Upload CSV</>
                )}
            </Button>
        </Form>
    );
};

export default CsvUploader; 