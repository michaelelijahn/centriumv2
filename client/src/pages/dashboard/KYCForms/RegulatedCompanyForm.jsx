import React, { useState } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';

const RegulatedCompanyForm = () => {
    const [formData, setFormData] = useState({});

    const steps = [
        {
            title: "Requirements",
            description: "Document checklist"
        },
        {
            title: "Company Email",
            description: "Email registration"
        },
        {
            title: "Company Details",
            description: "Basic information"
        },
        {
            title: "Document Upload",
            description: "Required documents"
        },
        {
            title: "Review & Submit",
            description: "Final review"
        }
    ];

    // Placeholder document requirements - user will provide actual requirements later
    const documentRequirements = [
        {
            category: "Regulatory Licenses",
            documents: [
                "Financial Services License",
                "Banking License (if applicable)",
                "Investment Management License"
            ]
        },
        {
            category: "Company Registration",
            documents: [
                "Certificate of Incorporation",
                "Articles of Association",
                "Company Registration Certificate"
            ]
        },
        {
            category: "Financial Documents",
            documents: [
                "Audited Financial Statements (Last 2 years)",
                "Regulatory Capital Requirements",
                "Risk Management Framework"
            ]
        },
        {
            category: "Compliance Documentation",
            documents: [
                "AML/KYC Policies",
                "Compliance Manual",
                "Risk Assessment Report"
            ]
        }
    ];

    const renderStep = ({ currentStep, formData: stepData, updateFormData }) => {
        switch (currentStep) {
            case 0:
                return <RequirementsStep requirements={documentRequirements} />;
            case 1:
                return <EmailRegistrationStep data={stepData} onChange={updateFormData} />;
            case 2:
                return <CompanyDetailsStep data={stepData} onChange={updateFormData} />;
            case 3:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} />;
            case 4:
                return <ReviewStep allData={formData} />;
            default:
                return <RequirementsStep requirements={documentRequirements} />;
        }
    };

    const handleStepChange = (step, data) => {
        console.log(`Moving to step ${step}`, data);
    };

    const handleSubmit = (data) => {
        console.log('Submitting Regulated Company KYC:', data);
        alert('Regulated Company KYC submitted successfully!');
    };

    return (
        <MultiStepFormWrapper
            accountType="Regulated Company"
            steps={steps}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
        >
            {renderStep}
        </MultiStepFormWrapper>
    );
};

// Step Components
const RequirementsStep = ({ requirements }) => (
    <div>
        <div className="text-center mb-4">
            <h4 className="text-primary mb-3">Document Requirements</h4>
            <p className="text-muted fs-5">Please ensure you have all the following documents ready before proceeding</p>
        </div>

        <Row>
            {requirements.map((category, index) => (
                <Col md={6} key={index} className="mb-4">
                    <Card className="border-0 shadow-sm h-100" style={{ minHeight: '180px', maxHeight: '210px' }}>
                        <Card.Header className="bg-light border-0 py-2">
                            <h5 className="mb-0 text-primary">
                                <i className="mdi mdi-folder-outline me-2"></i>
                                {category.category}
                            </h5>
                        </Card.Header>
                        <Card.Body className="p-2 d-flex flex-column">
                            <ListGroup variant="flush" className="flex-grow-1">
                                {category.documents.map((doc, docIndex) => (
                                    <ListGroup.Item key={docIndex} className="px-0 py-2 border-0">
                                        <i className="mdi mdi-file-document-outline text-muted me-2"></i>
                                        <span className="text-muted">{doc}</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>

        <Alert variant="warning" className="mt-4">
            <h6 className="mb-2">
                <i className="mdi mdi-alert me-2"></i>
                Regulatory Requirements
            </h6>
            <ul className="mb-0 small">
                <li>All regulatory licenses must be current and valid</li>
                <li>Enhanced due diligence may be required</li>
                <li>Additional documentation may be requested during review</li>
                <li>Processing time may be extended for regulatory verification</li>
            </ul>
        </Alert>
    </div>
);

const EmailRegistrationStep = ({ data = {}, onChange }) => {
    const [email, setEmail] = useState(data.email || '');
    const [demoAccountNo, setDemoAccountNo] = useState(data.demoAccountNo || '');

    const handleEmailChange = (field, value) => {
        const newData = { ...data, [field]: value };
        if (field === 'email') setEmail(value);
        if (field === 'demoAccountNo') setDemoAccountNo(value);
        onChange(newData);
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Company Email Registration</h4>
                <p className="text-muted fs-5">Please provide your official company email address</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Register Company Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter company email address"
                                value={email}
                                onChange={(e) => handleEmailChange('email', e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Select Demo Account No.</Form.Label>
                            <Form.Select
                                value={demoAccountNo}
                                onChange={(e) => handleEmailChange('demoAccountNo', e.target.value)}
                                required
                            >
                                <option value="">Select...</option>
                                <option value="DEMO001">DEMO001 - Demo Account 1</option>
                                <option value="DEMO002">DEMO002 - Demo Account 2</option>
                                <option value="DEMO003">DEMO003 - Demo Account 3</option>
                                <option value="DEMO004">DEMO004 - Demo Account 4</option>
                                <option value="DEMO005">DEMO005 - Demo Account 5</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

const CompanyDetailsStep = ({ data = {}, onChange }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Company Information</h4>
                <p className="text-muted fs-5">Please provide your regulated entity details</p>
            </div>

            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company Name *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter regulated entity name"
                                value={data.companyName || ''}
                                onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Registration Number *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter registration number"
                                value={data.registrationNumber || ''}
                                onChange={(e) => onChange({ ...data, registrationNumber: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Primary Regulator *</Form.Label>
                            <Form.Select
                                value={data.regulator || ''}
                                onChange={(e) => onChange({ ...data, regulator: e.target.value })}
                                required
                            >
                                <option value="">Select primary regulator</option>
                                <option value="OJK">OJK (Indonesia)</option>
                                <option value="SEC">SEC (USA)</option>
                                <option value="FCA">FCA (UK)</option>
                                <option value="MAS">MAS (Singapore)</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>License Number *</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter license number"
                                value={data.licenseNumber || ''}
                                onChange={(e) => onChange({ ...data, licenseNumber: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Registered Office Address *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter complete registered office address"
                        value={data.address || ''}
                        onChange={(e) => onChange({ ...data, address: e.target.value })}
                        required
                    />
                </Form.Group>
            </Form>
        </div>
    );
};

const DocumentUploadStep = ({ data = {}, onChange, requirements }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Document Upload</h4>
                <p className="text-muted fs-5">Upload all required regulatory documents</p>
            </div>

            {requirements.map((category, index) => (
                <Card key={index} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">{category.category}</h6>
                    </Card.Header>
                    <Card.Body>
                        {category.documents.map((doc, docIndex) => (
                            <Form.Group key={docIndex} className="mb-3">
                                <Form.Label>{doc} *</Form.Label>
                                <Form.Control type="file" accept=".pdf,.jpg,.jpeg,.png" />
                                <Form.Text className="text-muted">
                                    Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                                </Form.Text>
                            </Form.Group>
                        ))}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

const ReviewStep = ({ allData }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Review & Submit</h4>
                <p className="text-muted fs-5">Please review your information before submitting</p>
            </div>

            <Alert variant="info">
                <h6 className="mb-2">Regulatory Review Process</h6>
                <p className="mb-0">
                    Your application will undergo enhanced due diligence. Processing may take 
                    5-10 business days for regulatory verification and compliance checks.
                </p>
            </Alert>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <h6 className="text-primary mb-3">Application Details</h6>
                    <Row>
                        <Col md={6}>
                            <p><strong>Account Type:</strong> Regulated Company</p>
                            <p><strong>Status:</strong> Ready for submission</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Steps Completed:</strong> 4/4</p>
                            <p><strong>Documents Uploaded:</strong> Ready</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RegulatedCompanyForm; 