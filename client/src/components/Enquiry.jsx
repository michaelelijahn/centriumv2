import { useState } from 'react';
import { Row, Col, Card, FormLabel } from 'react-bootstrap';
import { Form, TextInput, TextAreaInput, FileUploader } from '@/components';
import { useTranslation } from 'react-i18next';

const Enquiry = () => {
    const { t } = useTranslation();
    const [showSuccess, setShowSuccess] = useState(false);
    const [enquiryForm, setEnquiryForm] = useState({
        subject: "",
        description: "",
        files: []
    });

    const handleFileUpload = (files) => {
        setEnquiryForm(prev => ({
            ...prev,
            files: files
        }));
    };

    const handleSubmit = (formValues) => {
        console.log("Form Values received:", formValues);
        
        // Update enquiryForm with the formValues
        setEnquiryForm(prev => ({
            ...prev,
            subject: formValues.subject || '',
            description: formValues.description || '',
        }));
    
        // Basic validation using formValues
        if (!formValues.subject?.trim()) {
            alert('Please enter a subject');
            return;
        }
        if (!formValues.description?.trim()) {
            alert('Please enter a description');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('subject', formValues.subject);
            formData.append('description', formValues.description);
            
            if (enquiryForm.files && enquiryForm.files.length > 0) {
                enquiryForm.files.forEach((file, index) => {
                    formData.append(`file${index}`, file);
                });
            }
    
            // Log the FormData contents
            for (let pair of formData.entries()) {
                console.log("pair : ", pair);
                console.log(pair[0] + ': ' + pair[1]);
            }
    
            // Show success message and reset form
            setShowSuccess(true);
            setEnquiryForm({
                subject: "",
                description: "",
                files: []
            });
    
            // Hide success message after 5 seconds
            setTimeout(() => {
                setShowSuccess(false);
            }, 5000);
    
        } catch (error) {
            console.error('Error submitting enquiry:', error);
            alert('Failed to submit enquiry. Please try again.');
        }
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col md={8} lg={7} xl={6}>
                    {showSuccess && (
                        <div className="alert alert-success text-center mb-4">
                            Your enquiry has been submitted successfully! We will get back to you soon.
                        </div>
                    )}

                    <Form onSubmit={handleSubmit}
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
                            <button type="submit" className="btn btn-success btn-md mt-2">
                                <i className="mdi mdi-email-outline me-1"></i> Submit Enquiry
                            </button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default Enquiry;