import { useState, useEffect } from 'react';
import { Row, Col, Card, FormLabel } from 'react-bootstrap';
import { Form, TextInput, TextAreaInput } from '@/components';
import { FileUploader } from '@/components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useCreateEnquiry from './useCreateEnquiry';
import { useNotificationContext } from '@/common';

const CreateEnquiry = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showNotification } = useNotificationContext();
    const { loading, createEnquiry } = useCreateEnquiry();
    const [showSuccess, setShowSuccess] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        return () => {
            setFiles([]);
        };
    }, []);

    const handleFileUpload = (uploadedFiles) => {
        setFiles(uploadedFiles);
    };

    const handleCancel = () => {
        setFiles([]);
        navigate('/apps/support');
    };

    const handleSubmit = async (formValues) => {
        if (!formValues.subject?.trim()) {
            showNotification({
                message: 'Please enter a subject',
                type: 'error'
            });
            return;
        }
        
        if (!formValues.description?.trim()) {
            showNotification({
                message: 'Please enter a description',
                type: 'error'
            });
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('subject', formValues.subject);
            formData.append('description', formValues.description);

            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }

            await createEnquiry(formData);
    
            setShowSuccess(true);
            setFiles([]);
            
            setTimeout(() => {
                setShowSuccess(false);
                navigate('/apps/support');
            }, 2000);
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            showNotification({
                message: error.message || 'Failed to submit enquiry',
                type: 'error'
            });
        }
    };

    return (
        <>
            <Row className="justify-content-center mt-4">
                <Col md={8} lg={7} xl={6}>
                    {showSuccess ? (
                        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
                            <div className="alert alert-success text-center" style={{ maxWidth: '500px' }}>
                                Your enquiry has been submitted successfully! We will get back to you soon.
                            </div>
                        </div>
                    ) : (
                        <Form
                            onSubmit={(values) => handleSubmit(values)}
                            defaultValues={{
                                subject: '',
                                description: ''
                            }}
                        >
                            <div className="text-center mb-4">
                                <h3>Make an Enquiry</h3>
                            </div>

                            <Row className="mb-2">
                                <Col>
                                    <TextInput
                                        label={t('Subject')}
                                        type="text"
                                        name="subject"
                                        placeholder={t('E.g., Unable to access email')}
                                        containerClass="mb-0"
                                    />
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col>
                                    <TextAreaInput
                                        label={t('Description')}
                                        type="text"
                                        name="description"
                                        placeholder={t('Please describe your issue in detail. Include any error messages, when the problem started, and steps to reproduce the issue.')}
                                        containerClass="mb-0"
                                        rows={8}
                                    />
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col>
                                    <FormLabel>Attachment (optional)</FormLabel>
                                    <Card>
                                        <Card.Body>
                                            <FileUploader 
                                                showPreview={true}
                                                onFileUpload={handleFileUpload}
                                            />
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <div className="text-center mb-5">
                                <button 
                                    type="button" 
                                    className="btn btn-danger btn-md mt-2 me-2"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-success btn-md mt-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span><i className="mdi mdi-loading mdi-spin me-1"></i> Submitting...</span>
                                    ) : (
                                        <>
                                            <i className="mdi mdi-email-outline me-1"></i> Submit Enquiry
                                        </>
                                    )}
                                </button>
                            </div>
                        </Form>
                    )}
                </Col>
            </Row>
        </>
    );
};

export default CreateEnquiry;