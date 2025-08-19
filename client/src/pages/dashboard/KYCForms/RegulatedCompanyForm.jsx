import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup, Button } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { FileUploader } from '../../../components/FileUploader/FileUploader';

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
            title: "Authorize Person",
            description: "Authorized person details"
        },
        {
            title: "Review & Submit",
            description: "Final review"
        }
    ];

    // Required documents for regulated company KYC
    const documentRequirements = [
        {
            category: "Company Registration Documents",
            documents: [
                "Certificate of Incorporation",
                "Board of Resolution"
            ]
        },
        {
            category: "Financial Documents",
            documents: [
                "Bank Statement",
                "Address Proof"
            ]
        },
        {
            category: "Ownership & Management Documents",
            documents: [
                "Management Structure",
                "Ownership Structure",
                "Beneficial Owner Passport",
                "Authorize Person Passport"
            ]
        }
    ];

    const renderStep = ({ currentStep, formData: stepData, updateFormData, allFormData }) => {
        switch (currentStep) {
            case 0:
                return <RequirementsStep requirements={documentRequirements} />;
            case 1:
                return <EmailRegistrationStep data={stepData} onChange={updateFormData} />;
            case 2:
                return <CompanyDetailsStep data={stepData} onChange={updateFormData} demoAccountNo={allFormData.step_1?.demoAccountNo} />;
            case 3:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} />;
            case 4:
                return <AuthorizePersonStep data={stepData} onChange={updateFormData} />;
            case 5:
                return <ReviewStep allData={allFormData} />;
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
const RequirementsStep = ({ requirements }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Document Requirements</h4>
                <p className="text-muted fs-5">Please ensure you have all the following documents ready before proceeding</p>
            </div>

            <Row>
                {requirements.map((category, index) => (
                    <Col md={6} key={index} className="mb-4">
                        <Card className="border-0 shadow-sm h-100" style={{ minHeight: '280px', maxHeight: '320px' }}>
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

            <Alert variant="info" className="mt-4">
                <h6 className="mb-2">
                    <i className="mdi mdi-information me-2"></i>
                    Important Notes
                </h6>
                <ul className="mb-0 small">
                    <li>Documents should be clear, legible scans or photos</li>
                    <li>Maximum file size: 10MB per document</li>
                    <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                </ul>
            </Alert>

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
};

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

const CompanyDetailsStep = ({ data = {}, onChange, demoAccountNo }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Company Information</h4>
                <p className="text-muted fs-5">Please provide your complete regulated company details</p>
            </div>

            <Form>
                {/* Company Basic Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company Registration Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company registration name"
                                value={data.companyName || ''}
                                onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company License Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company license number"
                                value={data.licenseNumber || ''}
                                onChange={(e) => onChange({ ...data, licenseNumber: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nature of Business <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter nature of business"
                                value={data.natureOfBusiness || ''}
                                onChange={(e) => onChange({ ...data, natureOfBusiness: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company Legal Form <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.legalForm || ''}
                                onChange={(e) => onChange({ ...data, legalForm: e.target.value })}
                                required
                            >
                                <option value="">Select legal form</option>
                                <option value="PT">PT (Perseroan Terbatas)</option>
                                <option value="LLC">LLC (Limited Liability Company)</option>
                                <option value="PLC">PLC (Public Limited Company)</option>
                                <option value="CORP">Corporation</option>
                                <option value="LTD">Limited Company</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Company Address Details */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter street address"
                                value={data.streetAddress || ''}
                                onChange={(e) => onChange({ ...data, streetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter city"
                                value={data.city || ''}
                                onChange={(e) => onChange({ ...data, city: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                <Form.Group className="mb-3">
                            <Form.Label>Postal / Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postal/zip code"
                                value={data.zipCode || ''}
                                onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.country || ''}
                                onChange={(e) => onChange({ ...data, country: e.target.value })}
                                required
                            >
                                <option value="">Select country</option>
                                <option value="ID">Indonesia</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="SG">Singapore</option>
                                <option value="MY">Malaysia</option>
                                <option value="AU">Australia</option>
                                <option value="CA">Canada</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Company Establishment Details */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Place of Establishment <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter place of establishment"
                                value={data.placeOfEstablishment || ''}
                                onChange={(e) => onChange({ ...data, placeOfEstablishment: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Establishment <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.dateOfEstablishment || ''}
                                onChange={(e) => onChange({ ...data, dateOfEstablishment: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Office Telephone Number <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        type="tel"
                        placeholder="Enter office phone number with country code"
                        value={data.officePhone || ''}
                        onChange={(e) => onChange({ ...data, officePhone: e.target.value })}
                        required
                    />
                </Form.Group>

                {/* Beneficial Owner Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Beneficial Owner Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter beneficial owner name"
                                value={data.beneficialOwnerName || ''}
                                onChange={(e) => onChange({ ...data, beneficialOwnerName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Beneficial Owner Passport No <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter beneficial owner passport number"
                                value={data.beneficialOwnerPassport || ''}
                                onChange={(e) => onChange({ ...data, beneficialOwnerPassport: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Trading Account Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Source of Funds <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.sourceOfFunds || ''}
                                onChange={(e) => onChange({ ...data, sourceOfFunds: e.target.value })}
                                required
                            >
                                <option value="">Select source of funds</option>
                                <option value="BUSINESS_INCOME">Business Income</option>
                                <option value="INVESTMENT_INCOME">Investment Income</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="INHERITANCE">Inheritance</option>
                                <option value="LOAN">Loan</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Opening Trading Account Purpose <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                        as="textarea"
                                rows={2}
                                placeholder="Please explain the purpose of opening this trading account"
                                value={data.accountPurpose || ''}
                                onChange={(e) => onChange({ ...data, accountPurpose: e.target.value })}
                        required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Demo Account Number</Form.Label>
                    <Form.Control
                        type="text"
                        value={demoAccountNo || 'Not selected'}
                        disabled
                        className="bg-light"
                    />
                </Form.Group>
            </Form>
        </div>
    );
};

const DocumentUploadStep = ({ data = {}, onChange, requirements }) => {
    const [uploadedDocuments, setUploadedDocuments] = useState(data.uploadedDocuments || {});

    const handleFileUpload = (documentName, files) => {
        const updatedDocs = {
            ...uploadedDocuments,
            [documentName]: files
        };
        setUploadedDocuments(updatedDocs);
        onChange({ ...data, uploadedDocuments: updatedDocs });
    };

    const removeDocument = (documentName) => {
        const updatedDocs = { ...uploadedDocuments };
        delete updatedDocs[documentName];
        setUploadedDocuments(updatedDocs);
        onChange({ ...data, uploadedDocuments: updatedDocs });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Document Upload</h4>
                <p className="text-muted fs-5">Upload all required documents for regulated company verification</p>
            </div>

            <Alert variant="info" className="mb-4">
                <h6 className="mb-2">
                    <i className="mdi mdi-information me-2"></i>
                    Upload Requirements
                </h6>
                <ul className="mb-0 small">
                    <li>Maximum file size: 10MB per document</li>
                    <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                    <li>All documents must be clear and legible</li>
                    <li>Ensure all required information is visible</li>
                </ul>
            </Alert>

            {requirements.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">
                            <i className="mdi mdi-folder-outline me-2"></i>
                            {category.category}
                        </h6>
                    </Card.Header>
                    <Card.Body>
                        {category.documents.map((doc, docIndex) => {
                            const documentKey = `${categoryIndex}-${docIndex}-${doc}`;
                            const hasUploaded = uploadedDocuments[documentKey] && uploadedDocuments[documentKey].length > 0;
                            
                            return (
                                <div key={docIndex} className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h6 className="mb-0">
                                            {doc} <span className="text-danger">*</span>
                                        </h6>
                                        {hasUploaded && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => removeDocument(documentKey)}
                                            >
                                                <i className="mdi mdi-delete me-1"></i>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    
                                    {!hasUploaded ? (
                                        <FileUploader
                                            showPreview={true}
                                            onFileUpload={(files) => handleFileUpload(documentKey, files)}
                                        />
                                    ) : (
                                        <Alert variant="success" className="mb-0">
                                            <i className="mdi mdi-check-circle me-2"></i>
                                            Document uploaded successfully ({uploadedDocuments[documentKey].length} file{uploadedDocuments[documentKey].length > 1 ? 's' : ''})
                                        </Alert>
                                    )}
                                </div>
                            );
                        })}
                    </Card.Body>
                </Card>
            ))}

            <Alert variant="warning" className="mt-4">
                <h6 className="mb-2">
                    <i className="mdi mdi-alert me-2"></i>
                    Important Notes
                </h6>
                <ul className="mb-0 small">
                    <li>All documents are mandatory for regulated entity verification</li>
                    <li>Documents will be reviewed by our compliance team</li>
                    <li>Additional documents may be requested during the review process</li>
                    <li>Processing time may take 5-10 business days for regulatory verification</li>
                </ul>
            </Alert>
        </div>
    );
};

const AuthorizePersonStep = ({ data = {}, onChange }) => {
    const [bankAccounts, setBankAccounts] = useState(data.bankAccounts || [{ bankName: '', bankAddress: '', bankCity: '', bankPostalCode: '', bankCountry: '', swiftCode: '', accountNo: '', accountName: '' }]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const addBankAccount = () => {
        const newAccounts = [...bankAccounts, { bankName: '', bankAddress: '', bankCity: '', bankPostalCode: '', bankCountry: '', swiftCode: '', accountNo: '', accountName: '' }];
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
    };

    const removeBankAccount = (index) => {
        const newAccounts = bankAccounts.filter((_, i) => i !== index);
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
    };

    const updateBankAccount = (index, field, value) => {
        const newAccounts = [...bankAccounts];
        newAccounts[index][field] = value;
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Authorize Person Information</h4>
                <p className="text-muted fs-5">Please provide complete authorize person details</p>
            </div>

            <Form>
                {/* Authorize Person Title */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Authorize Person Title <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonTitle || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonTitle: e.target.value })}
                                required
                            >
                                <option value="">Select title</option>
                                <option value="MR">Mr.</option>
                                <option value="MRS">Mrs.</option>
                                <option value="MS">Ms.</option>
                                <option value="DR">Dr.</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                value={data.authorizePersonFullName || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonFullName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Place of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter place of birth"
                                value={data.authorizePersonPlaceOfBirth || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonPlaceOfBirth: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.authorizePersonDateOfBirth || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonDateOfBirth: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Passport ID No <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter passport ID number"
                                value={data.authorizePersonPassportId || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonPassportId: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={data.authorizePersonEmail || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonEmail: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonGender || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonGender: e.target.value })}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Marital Status <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonMaritalStatus || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonMaritalStatus: e.target.value })}
                                required
                            >
                                <option value="">Select marital status</option>
                                <option value="SINGLE">Single</option>
                                <option value="MARRIED">Married</option>
                                <option value="DIVORCED">Divorced</option>
                                <option value="WIDOWED">Widowed</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Citizen <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter citizenship"
                                value={data.authorizePersonCitizen || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonCitizen: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.authorizePersonCountryCode || ''}
                                        onChange={(e) => onChange({ ...data, authorizePersonCountryCode: e.target.value })}
                                        required
                                    >
                                        <option value="">Code</option>
                                        <option value="+1">+1 (US/CA)</option>
                                        <option value="+44">+44 (UK)</option>
                                        <option value="+65">+65 (SG)</option>
                                        <option value="+60">+60 (MY)</option>
                                        <option value="+61">+61 (AU)</option>
                                        <option value="+62">+62 (ID)</option>
                                        <option value="+91">+91 (IN)</option>
                                    </Form.Select>
                                </Col>
                                <Col md={8}>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={data.authorizePersonPhoneNumber || ''}
                                        onChange={(e) => onChange({ ...data, authorizePersonPhoneNumber: e.target.value })}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Address Information */}
                <h5 className="text-primary mb-3 mt-4">Address Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter street address"
                                value={data.authorizePersonStreetAddress || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonStreetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter city"
                                value={data.authorizePersonCity || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonCity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Postal / Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postal/zip code"
                                value={data.authorizePersonPostalCode || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonPostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonCountry || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonCountry: e.target.value })}
                                required
                            >
                                <option value="">Select country</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="SG">Singapore</option>
                                <option value="MY">Malaysia</option>
                                <option value="AU">Australia</option>
                                <option value="CA">Canada</option>
                                <option value="ID">Indonesia</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Yes/No Questions */}
                <h5 className="text-primary mb-3 mt-4">Background Information</h5>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Do you have investment experience? <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="investmentExperience"
                                    value="YES"
                                    checked={data.authorizePersonInvestmentExperience === 'YES'}
                                    onChange={(e) => onChange({ ...data, authorizePersonInvestmentExperience: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="investmentExperience"
                                    value="NO"
                                    checked={data.authorizePersonInvestmentExperience === 'NO'}
                                    onChange={(e) => onChange({ ...data, authorizePersonInvestmentExperience: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Do you have any family who working in BAPPEBTI / Bursa Berjangka / Kliring Berjangka? <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="familyInBappebti"
                                    value="YES"
                                    checked={data.authorizePersonFamilyInBappebti === 'YES'}
                                    onChange={(e) => onChange({ ...data, authorizePersonFamilyInBappebti: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="familyInBappebti"
                                    value="NO"
                                    checked={data.authorizePersonFamilyInBappebti === 'NO'}
                                    onChange={(e) => onChange({ ...data, authorizePersonFamilyInBappebti: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Have you declared bankrupt by the Court? <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="declaredBankrupt"
                                    value="YES"
                                    checked={data.authorizePersonDeclaredBankrupt === 'YES'}
                                    onChange={(e) => onChange({ ...data, authorizePersonDeclaredBankrupt: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="declaredBankrupt"
                                    value="NO"
                                    checked={data.authorizePersonDeclaredBankrupt === 'NO'}
                                    onChange={(e) => onChange({ ...data, authorizePersonDeclaredBankrupt: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Employment Data */}
                <h5 className="text-primary mb-3 mt-4">Employment Data</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company name"
                                value={data.authorizePersonCompanyName || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonCompanyName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nature of Business <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter nature of business"
                                value={data.authorizePersonBusinessNature || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonBusinessNature: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Job / Position <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter job/position"
                                value={data.authorizePersonJobPosition || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonJobPosition: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Office Address */}
                <h6 className="text-primary mb-3">Office Address</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter office street address"
                                value={data.authorizePersonOfficeAddress || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonOfficeAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter office city"
                                value={data.authorizePersonOfficeCity || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonOfficeCity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Postal / Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter office postal/zip code"
                                value={data.authorizePersonOfficePostalCode || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonOfficePostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonOfficeCountry || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonOfficeCountry: e.target.value })}
                                required
                            >
                                <option value="">Select country</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="SG">Singapore</option>
                                <option value="MY">Malaysia</option>
                                <option value="AU">Australia</option>
                                <option value="CA">Canada</option>
                                <option value="ID">Indonesia</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Document Upload */}
                <h5 className="text-primary mb-3 mt-4">Upload Documents</h5>
                <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0 py-2">
                        <h6 className="mb-0 text-primary">Authorize Person Passport</h6>
                    </Card.Header>
                    <Card.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Authorize Person Passport <span className="text-danger">*</span></Form.Label>
                            <Form.Control type="file" accept=".pdf,.jpg,.jpeg,.png" required />
                                <Form.Text className="text-muted">
                                    Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                                </Form.Text>
                            </Form.Group>
                    </Card.Body>
                </Card>

                {/* Bank Accounts */}
                <h5 className="text-primary mb-3 mt-4">Bank Accounts</h5>
                {bankAccounts.map((account, index) => (
                    <Card key={index} className="mb-3 border-0 shadow-sm">
                        <Card.Header className="bg-light border-0 py-2 d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 text-primary">Bank Account {index + 1}</h6>
                            {bankAccounts.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeBankAccount(index)}
                                >
                                    Remove
                                </button>
                            )}
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bank Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter bank name"
                                            value={account.bankName}
                                            onChange={(e) => updateBankAccount(index, 'bankName', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Account Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter account holder name"
                                            value={account.accountName}
                                            onChange={(e) => updateBankAccount(index, 'accountName', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bank Address (Street) <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter bank street address"
                                            value={account.bankAddress}
                                            onChange={(e) => updateBankAccount(index, 'bankAddress', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bank City <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter bank city"
                                            value={account.bankCity}
                                            onChange={(e) => updateBankAccount(index, 'bankCity', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Bank Country <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={account.bankCountry}
                                            onChange={(e) => updateBankAccount(index, 'bankCountry', e.target.value)}
                                            required
                                        >
                                            <option value="">Select country</option>
                                            <option value="US">United States</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="SG">Singapore</option>
                                            <option value="MY">Malaysia</option>
                                            <option value="AU">Australia</option>
                                            <option value="CA">Canada</option>
                                            <option value="ID">Indonesia</option>
                                            <option value="OTHER">Other</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>SWIFT Code <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter SWIFT code"
                                            value={account.swiftCode}
                                            onChange={(e) => updateBankAccount(index, 'swiftCode', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>IBAN / Account No <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter IBAN/Account number"
                                            value={account.accountNo}
                                            onChange={(e) => updateBankAccount(index, 'accountNo', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                    </Card.Body>
                </Card>
            ))}

                <div className="text-center mb-4">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={addBankAccount}
                    >
                        <i className="mdi mdi-plus me-2"></i>
                        Add Another Bank Account
                    </button>
                </div>
            </Form>
        </div>
    );
};

const ReviewStep = ({ allData }) => {
    const step3Data = allData.step_3 || {};
    const uploadedDocuments = step3Data.uploadedDocuments || {};
    const totalDocuments = 8; // Total required documents
    const uploadedCount = Object.keys(uploadedDocuments).length;

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Review & Submit</h4>
                <p className="text-muted fs-5">Please review your information before submitting</p>
            </div>

            <Alert variant="info" className="mb-4">
                <h6 className="mb-2">
                    <i className="mdi mdi-information me-2"></i>
                    Regulatory Review Process
                </h6>
                <p className="mb-0">
                    Your application will undergo enhanced due diligence. Processing may take 
                    5-10 business days for regulatory verification and compliance checks.
                </p>
            </Alert>

            {/* Company Information */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">
                        <i className="mdi mdi-domain me-2"></i>
                        Company Information
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Company Name:</strong> {allData.step_2?.companyName || 'Not provided'}</p>
                            <p><strong>License Number:</strong> {allData.step_2?.licenseNumber || 'Not provided'}</p>
                            <p><strong>Nature of Business:</strong> {allData.step_2?.natureOfBusiness || 'Not provided'}</p>
                            <p><strong>Legal Form:</strong> {allData.step_2?.legalForm || 'Not provided'}</p>
                            <p><strong>Street Address:</strong> {allData.step_2?.streetAddress || 'Not provided'}</p>
                            <p><strong>City:</strong> {allData.step_2?.city || 'Not provided'}</p>
                            <p><strong>Zip Code:</strong> {allData.step_2?.zipCode || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Country:</strong> {allData.step_2?.country || 'Not provided'}</p>
                            <p><strong>Place of Establishment:</strong> {allData.step_2?.placeOfEstablishment || 'Not provided'}</p>
                            <p><strong>Date of Establishment:</strong> {allData.step_2?.dateOfEstablishment || 'Not provided'}</p>
                            <p><strong>Office Phone:</strong> {allData.step_2?.officePhone || 'Not provided'}</p>
                            <p><strong>Beneficial Owner:</strong> {allData.step_2?.beneficialOwnerName || 'Not provided'}</p>
                            <p><strong>Owner Passport:</strong> {allData.step_2?.beneficialOwnerPassport || 'Not provided'}</p>
                            <p><strong>Source of Funds:</strong> {allData.step_2?.sourceOfFunds || 'Not provided'}</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <p><strong>Account Purpose:</strong> {allData.step_2?.accountPurpose || 'Not provided'}</p>
                            <p><strong>Company Email:</strong> {allData.step_1?.email || 'Not provided'}</p>
                            <p><strong>Demo Account:</strong> {allData.step_1?.demoAccountNo || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Authorize Person Information */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">
                        <i className="mdi mdi-account-tie me-2"></i>
                        Authorize Person Information
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Full Name:</strong> {allData.step_4?.authorizePersonFullName || 'Not provided'}</p>
                            <p><strong>Passport ID:</strong> {allData.step_4?.authorizePersonPassportId || 'Not provided'}</p>
                            <p><strong>Email:</strong> {allData.step_4?.authorizePersonEmail || 'Not provided'}</p>
                            <p><strong>Citizenship:</strong> {allData.step_4?.authorizePersonCitizen || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Date of Birth:</strong> {allData.step_4?.authorizePersonDateOfBirth || 'Not provided'}</p>
                            <p><strong>Place of Birth:</strong> {allData.step_4?.authorizePersonPlaceOfBirth || 'Not provided'}</p>
                            <p><strong>Job Position:</strong> {allData.step_4?.authorizePersonJobPosition || 'Not provided'}</p>
                            <p><strong>Company Name:</strong> {allData.step_4?.authorizePersonCompanyName || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Document Upload Summary */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">
                        <i className="mdi mdi-file-document-multiple me-2"></i>
                        Document Upload Status
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Documents Uploaded:</strong> {uploadedCount} of {totalDocuments}</p>
                            <p><strong>Upload Status:</strong> 
                                {uploadedCount === totalDocuments ? (
                                    <span className="text-success ms-2">
                                        <i className="mdi mdi-check-circle me-1"></i>
                                        Complete
                                    </span>
                                ) : (
                                    <span className="text-warning ms-2">
                                        <i className="mdi mdi-alert-circle me-1"></i>
                                        Incomplete ({totalDocuments - uploadedCount} missing)
                                    </span>
                                )}
                            </p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Account Type:</strong> Regulated Company</p>
                            <p><strong>Application Status:</strong> 
                                {uploadedCount === totalDocuments ? (
                                    <span className="text-success ms-2">Ready for submission</span>
                                ) : (
                                    <span className="text-warning ms-2">Pending document upload</span>
                                )}
                            </p>
                        </Col>
                    </Row>

                    {uploadedCount < totalDocuments && (
                        <Alert variant="warning" className="mt-3 mb-0">
                            <small>
                                <i className="mdi mdi-alert me-1"></i>
                                Please ensure all {totalDocuments} required documents are uploaded before submitting your application.
                            </small>
                        </Alert>
                    )}
                </Card.Body>
            </Card>

            {/* Required Documents List */}
            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">
                        <i className="mdi mdi-file-check me-2"></i>
                        Required Documents Checklist
                    </h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <h6 className="text-muted mb-2">Company Registration Documents</h6>
                            <ul className="list-unstyled">
                                <li><i className="mdi mdi-check text-success me-2"></i>Certificate of Incorporation</li>
                                <li><i className="mdi mdi-check text-success me-2"></i>Board of Resolution</li>
                            </ul>
                            
                            <h6 className="text-muted mb-2 mt-3">Financial Documents</h6>
                            <ul className="list-unstyled">
                                <li><i className="mdi mdi-check text-success me-2"></i>Bank Statement</li>
                                <li><i className="mdi mdi-check text-success me-2"></i>Address Proof</li>
                            </ul>
                        </Col>
                        <Col md={6}>
                            <h6 className="text-muted mb-2">Ownership & Management Documents</h6>
                            <ul className="list-unstyled">
                                <li><i className="mdi mdi-check text-success me-2"></i>Management Structure</li>
                                <li><i className="mdi mdi-check text-success me-2"></i>Ownership Structure</li>
                                <li><i className="mdi mdi-check text-success me-2"></i>Beneficial Owner Passport</li>
                                <li><i className="mdi mdi-check text-success me-2"></i>Authorize Person Passport</li>
                            </ul>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default RegulatedCompanyForm; 