import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup, Button } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { useNotificationContext } from '../../../common/context/useNotificationContext';
import AuthService from '../../../common/api/auth';

const RegulatedCompanyForm = () => {
    const [formData, setFormData] = useState({});
    const { showNotification } = useNotificationContext();

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
            title: "Authorize Person Document Upload",
            description: "Required documents"
        },
        {
            title: "Document Agreements",
            description: "Terms and conditions"
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
                "Beneficial Owner Passport"
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
                return <PassportUploadStep data={stepData} onChange={updateFormData} />;
            case 6:
                return <DocumentAgreementsStep data={stepData} onChange={updateFormData} onSubmit={handleSubmit} allData={allFormData} />;
            default:
                return <RequirementsStep requirements={documentRequirements} />;
        }
    };

    // Validation functions for each step
    const validateStep = (stepIndex, stepData, allData) => {
        switch (stepIndex) {
            case 0: // Requirements step - always valid (just informational)
                return { isValid: true, errors: [] };
            
            case 1: // Company Email Registration step
                return validateEmailStep(stepData);
            
            case 2: // Company Details step
                return validateCompanyDetailsStep(stepData);
            
            case 3: // Document Upload step
                return validateDocumentUploadStep(stepData);
            
            case 4: // Authorize Person step
                return validateAuthorizePersonStep(stepData);
            
            case 5: // Passport Upload step
                return validatePassportUploadStep(stepData);
            
            case 6: // Document Agreements step
                return validateDocumentAgreementsStep(stepData);
            
            default:
                return { isValid: true, errors: [] };
        }
    };

    const validateEmailStep = (data) => {
        const errors = [];
        
        if (!data.email?.trim()) {
            errors.push('Company email address is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.demoAccountNo?.trim()) {
            errors.push('Demo account selection is required');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateCompanyDetailsStep = (data) => {
        const errors = [];
        const requiredFields = [
            { field: 'companyRegistrationName', label: 'Company Registration Name' },
            { field: 'companyLicenseNo', label: 'Company License Number' },
            { field: 'natureOfBusiness', label: 'Nature of Business' },
            { field: 'companyLegalForm', label: 'Company Legal Form' },
            { field: 'streetAddress', label: 'Street Address' },
            { field: 'city', label: 'City' },
            { field: 'postalCode', label: 'Postal/Zip Code' },
            { field: 'country', label: 'Country' },
            { field: 'placeOfEstablishment', label: 'Place of Establishment' },
            { field: 'dateOfEstablishment', label: 'Date of Establishment' },
            { field: 'countryCode', label: 'Country Code' },
            { field: 'officeTelephoneNo', label: 'Office Telephone Number' },
            { field: 'beneficialOwnerName', label: 'Beneficial Owner Name' },
            { field: 'beneficialOwnerPassportNo', label: 'Beneficial Owner Passport Number' },
            { field: 'sourceOfFunds', label: 'Source of Funds' },
            { field: 'tradingAccountPurpose', label: 'Trading Account Purpose' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });

        console.log('CompanyDetailsStep - data:', data);
        
        // Check conditional fields
        if (data.companyLegalForm === 'OTHER' && !data.companyLegalFormOther?.trim()) {
            errors.push('Please specify the other legal form');
        }
        
        if (data.country === 'OTHER' && !data.countryOther?.trim()) {
            errors.push('Please specify the other country');
        }
        
        if (data.sourceOfFunds === 'OTHER' && !data.sourceOfFundsOther?.trim()) {
            errors.push('Please specify the other source of funds');
        }
        
        if (data.tradingAccountPurpose === 'OTHER' && !data.tradingAccountPurposeOther?.trim()) {
            errors.push('Please specify the other trading account purpose');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDocumentUploadStep = (data) => {
        const errors = [];
        
        // Check if documents are uploaded
        if (!data.documentsUploaded) {
            errors.push('Please upload all required company documents before proceeding');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateAuthorizePersonStep = (data) => {
        const errors = [];
        const requiredFields = [
            { field: 'authorizePersonTitle', label: 'Authorize Person Title' },
            { field: 'authorizePersonFullName', label: 'Authorize Person Full Name' },
            { field: 'authorizePersonPlaceOfBirth', label: 'Place of Birth' },
            { field: 'authorizePersonDateOfBirth', label: 'Date of Birth' },
            { field: 'authorizePersonPassportId', label: 'Passport ID Number' },
            { field: 'authorizePersonEmail', label: 'Email' },
            { field: 'authorizePersonGender', label: 'Gender' },
            { field: 'authorizePersonMaritalStatus', label: 'Marital Status' },
            { field: 'authorizePersonCitizen', label: 'Citizenship' },
            { field: 'authorizePersonCountryCode', label: 'Country Code' },
            { field: 'authorizePersonPhoneNumber', label: 'Phone Number' },
            { field: 'authorizePersonStreetAddress', label: 'Street Address' },
            { field: 'authorizePersonCity', label: 'City' },
            { field: 'authorizePersonPostalCode', label: 'Postal Code' },
            { field: 'authorizePersonCountry', label: 'Country' },
            { field: 'authorizePersonInvestmentExperience', label: 'Investment Experience' },
            { field: 'authorizePersonFamilyInBappebti', label: 'Family in BAPPEBTI' },
            { field: 'authorizePersonDeclaredBankrupt', label: 'Bankruptcy Declaration' },
            { field: 'authorizePersonCompanyName', label: 'Company Name' },
            { field: 'authorizePersonBusinessNature', label: 'Nature of Business' },
            { field: 'authorizePersonJobPosition', label: 'Job Position' },
            { field: 'authorizePersonOfficeAddress', label: 'Office Address' },
            { field: 'authorizePersonOfficeCity', label: 'Office City' },
            { field: 'authorizePersonOfficePostalCode', label: 'Office Postal Code' },
            { field: 'authorizePersonOfficeCountry', label: 'Office Country' }
        ];

        console.log('AuthorizePersonStep - data:', data);
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });
        
        // Check conditional fields
        if (data.authorizePersonCitizen === 'OTHER' && !data.authorizePersonCitizenOther?.trim()) {
            errors.push('Please specify other citizenship');
        }
        
        if (data.authorizePersonCountry === 'OTHER' && !data.authorizePersonCountryOther?.trim()) {
            errors.push('Please specify other country');
        }
        
        if (data.authorizePersonOfficeCountry === 'OTHER' && !data.authorizePersonOfficeCountryOther?.trim()) {
            errors.push('Please specify other office country');
        }
        
        if (data.authorizePersonInvestmentExperience === 'YES' && !data.authorizePersonInvestmentExperienceDetails?.trim()) {
            errors.push('Please provide details about investment experience');
        }
        
        // Validate email format
        if (data.authorizePersonEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.authorizePersonEmail)) {
            errors.push('Please enter a valid email address for Authorize Person');
        }
        
        // Validate bank accounts
        if (!data.bankAccounts || data.bankAccounts.length === 0) {
            errors.push('At least one bank account is required');
        } else {
            data.bankAccounts.forEach((account, index) => {
                const bankRequiredFields = [
                    { field: 'bankName', label: `Bank ${index + 1} - Bank Name` },
                    { field: 'accountName', label: `Bank ${index + 1} - Account Name` },
                    { field: 'bankAddress', label: `Bank ${index + 1} - Bank Address` },
                    { field: 'bankCity', label: `Bank ${index + 1} - Bank City` },
                    { field: 'bankCountry', label: `Bank ${index + 1} - Bank Country` },
                    { field: 'swiftCode', label: `Bank ${index + 1} - SWIFT Code` },
                    { field: 'accountNo', label: `Bank ${index + 1} - Account Number` }
                ];
                
                bankRequiredFields.forEach(({ field, label }) => {
                    if (!account[field]?.trim()) {
                        errors.push(`${label} is required`);
                    }
                });
                
                if (account.bankCountry === 'OTHER' && !account.bankCountryOther?.trim()) {
                    errors.push(`Bank ${index + 1} - Please specify other country`);
                }
            });
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validatePassportUploadStep = (data) => {
        const errors = [];
        
        // Check if passport documents are uploaded
        if (!data.passportDocumentsUploaded) {
            errors.push('Please upload all required passport documents before proceeding');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDocumentAgreementsStep = (data) => {
        const errors = [];
        
        const requiredAgreements = [
            'companyProfile',
            'statementSimulation',
            'statementExperience',
            'disclosureStatement',
            'accountOpeningApplication',
            'riskDisclosure',
            'mandateAgreement',
            'tradingRules',
            'personalAccessPassword'
        ];
        
        const agreementLabels = {
            companyProfile: 'Company Profile',
            statementSimulation: 'Statement of Having Simulation',
            statementExperience: 'Statement of Having Experience',
            disclosureStatement: 'Disclosure Statement',
            accountOpeningApplication: 'Account Opening Application',
            riskDisclosure: 'Risk Disclosure',
            mandateAgreement: 'Mandate Agreement',
            tradingRules: 'Trading Rules',
            personalAccessPassword: 'Personal Access Password'
        };
        
        requiredAgreements.forEach(agreement => {
            if (!data[agreement]) {
                errors.push(`Please agree to ${agreementLabels[agreement]}`);
            }
        });
        
        return { isValid: errors.length === 0, errors };
    };

    const handleStepValidation = (stepIndex, stepData, allData) => {
        const validation = validateStep(stepIndex, stepData, allData);
        
        if (!validation.isValid) {
            // Show notification with all validation errors
            const errorMessage = validation.errors.length === 1 
                ? validation.errors[0]
                : `Please fix the following issues: ${validation.errors.join(', ')}`;
                
            showNotification({
                title: 'Validation Error',
                message: errorMessage,
                type: 'error'
            });
        }
        
        return validation.isValid;
    };

    const handleStepChange = (step, data) => {
        console.log(`Moving to step ${step}`, data);
    };

    const handleSubmit = async (data) => {
        console.log('Submitting Regulated Company KYC (raw data):', data);
        
        try {
            // Flatten the nested step data structure
            const flattenedData = {};
            Object.keys(data).forEach(stepKey => {
                if (stepKey.startsWith('step_') && typeof data[stepKey] === 'object') {
                    Object.assign(flattenedData, data[stepKey]);
                }
            });
            
            console.log('Flattened form data:', flattenedData);
            
            // Create FormData object to handle both form data and file uploads
            const formData = new FormData();
            
            // Add all form fields to FormData
            Object.keys(flattenedData).forEach(key => {
                if (key === 'uploadedDocuments' && typeof flattenedData[key] === 'object') {
                    // Handle uploaded company documents
                    Object.keys(flattenedData[key]).forEach(docType => {
                        const files = flattenedData[key][docType];
                        if (Array.isArray(files) && files.length > 0) {
                            files.forEach((file, index) => {
                                formData.append(`${docType}_${index}`, file);
                            });
                        }
                    });
                } else if (typeof flattenedData[key] === 'object' && flattenedData[key] !== null && !(flattenedData[key] instanceof File)) {
                    // Convert objects to JSON string (except File objects)
                    formData.append(key, JSON.stringify(flattenedData[key]));
                } else if (flattenedData[key] !== null && flattenedData[key] !== undefined) {
                    // Add primitive values directly
                    formData.append(key, flattenedData[key]);
                }
            });
            
            const response = await AuthService.submitRegulatedCompanyKYC(formData);
            
            if (response.success) {
                showNotification({
                    title: 'Success',
                    message: `Regulated Company KYC submitted successfully! Application Reference: ${response.data.applicationReference}`,
                    type: 'success'
                });
                
                // Optionally, redirect to a success page or clear the form
                setFormData({});
            } else {
                throw new Error(response.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Regulated Company KYC Submission Error:', error);
            showNotification({
                title: 'Submission Failed',
                message: error.message || 'An error occurred while submitting your Regulated Company KYC application. Please try again.',
                type: 'error'
            });
        }
    };

    return (
        <MultiStepFormWrapper
            accountType="Regulated Company"
            steps={steps}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
            onStepValidation={handleStepValidation}
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
                            <Form.Label className="text-muted">Register Company Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter company email address"
                                value={email}
                                onChange={(e) => handleEmailChange('email', e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Select Demo Account No.</Form.Label>
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
                            <Form.Label className="text-muted">Company Registration Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company registration name"
                                value={data.companyRegistrationName || ''}
                                onChange={(e) => onChange({ ...data, companyRegistrationName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Company License Number <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company license number"
                                value={data.companyLicenseNo || ''}
                                onChange={(e) => onChange({ ...data, companyLicenseNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Nature of Business <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Company Legal Form <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.companyLegalForm || ''}
                                onChange={(e) => onChange({ ...data, companyLegalForm: e.target.value })}
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
                            {data.companyLegalForm === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other legal form"
                                    value={data.companyLegalFormOther || ''}
                                    onChange={(e) => onChange({ ...data, companyLegalFormOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Company Address Details */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Street Address <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Postal / Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postal/zip code"
                                value={data.postalCode || ''}
                                onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.country || ''}
                                onChange={(e) => onChange({ ...data, country: e.target.value })}
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
                            {data.country === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other country"
                                    value={data.countryOther || ''}
                                    onChange={(e) => onChange({ ...data, countryOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Company Establishment Details */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Place of Establishment <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Date of Establishment <span className="text-danger">*</span></Form.Label>
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
                    <Form.Label className="text-muted">Office Telephone No <span className="text-danger">*</span></Form.Label>
                    <Row>
                        <Col md={4}>
                            <Form.Select
                                value={data.countryCode || ''}
                                onChange={(e) => onChange({ ...data, countryCode: e.target.value })}
                                required
                            >
                                <option value="">Code</option>
                                <option value="+1">+1 (US/CA)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+65">+65 (SG)</option>
                                <option value="+60">+60 (MY)</option>
                                <option value="+61">+61 (AU)</option>
                                <option value="+49">+49 (DE)</option>
                                <option value="+33">+33 (FR)</option>
                                <option value="+81">+81 (JP)</option>
                                <option value="+86">+86 (CN)</option>
                                <option value="+62">+62 (ID)</option>
                                <option value="+91">+91 (IN)</option>
                            </Form.Select>
                        </Col>
                        <Col md={8}>
                            <Form.Control
                                type="tel"
                                placeholder="Enter telephone number"
                                value={data.officeTelephoneNo || ''}
                                onChange={(e) => onChange({ ...data, officeTelephoneNo: e.target.value })}
                                required
                            />
                        </Col>
                    </Row>
                </Form.Group>

                {/* Beneficial Owner Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Beneficial Owner Name <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Beneficial Owner Passport No <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter beneficial owner passport number"
                                value={data.beneficialOwnerPassportNo || ''}
                                onChange={(e) => onChange({ ...data, beneficialOwnerPassportNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Trading Account Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Source of Funds <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.sourceOfFunds || ''}
                                onChange={(e) => onChange({ ...data, sourceOfFunds: e.target.value })}
                                required
                            >
                                <option value="">Select source of funds</option>
                                <option value="BUSINESS_INCOME">Business Income</option>
                                <option value="CLIENT_FUNDS">Client Funds</option>
                                <option value="INVESTMENT_INCOME">Investment Income</option>
                                <option value="INHERITANCE">Inheritance</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="LOAN">Loan</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.sourceOfFunds === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other source of funds"
                                    value={data.sourceOfFundsOther || ''}
                                    onChange={(e) => onChange({ ...data, sourceOfFundsOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Opening Trading Account Purpose <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.tradingAccountPurpose || ''}
                                onChange={(e) => onChange({ ...data, tradingAccountPurpose: e.target.value })}
                                required
                            >
                                <option value="">Select trading account purpose</option>
                                <option value="HEDGING">Hedging</option>
                                <option value="SPECULATION">Speculation</option>
                                <option value="ARBITRAGE">Arbitrage</option>
                                <option value="INVESTMENT">Investment</option>
                                <option value="CLIENT_TRADING">Client Trading</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.tradingAccountPurpose === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other trading account purpose"
                                    value={data.tradingAccountPurposeOther || ''}
                                    onChange={(e) => onChange({ ...data, tradingAccountPurposeOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label className="text-muted">Demo Account Number</Form.Label>
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

    // Check if all required documents are uploaded on component mount
    useEffect(() => {
        const requiredDocuments = [
            'Certificate of Incorporation',
            'Board of Resolution', 
            'Bank Statement',
            'Address Proof',
            'Management Structure',
            'Ownership Structure',
            'Beneficial Owner Passport'
        ];
        
        const allDocsUploaded = requiredDocuments.every(doc => {
            return Object.keys(uploadedDocuments).some(key => 
                key.includes(doc) && uploadedDocuments[key] && uploadedDocuments[key].length > 0
            );
        });
        
        // Update the parent component with current status
        if (data.documentsUploaded !== allDocsUploaded) {
            onChange({ 
                ...data, 
                uploadedDocuments: uploadedDocuments,
                documentsUploaded: allDocsUploaded
            });
        }
    }, []); // Only run on mount

    const handleFileUpload = (documentName, files) => {
        const updatedDocs = {
            ...uploadedDocuments,
            [documentName]: files
        };
        setUploadedDocuments(updatedDocs);
        
        // Check if all required documents are uploaded
        const requiredDocuments = [
            'Certificate of Incorporation',
            'Board of Resolution', 
            'Bank Statement',
            'Address Proof',
            'Management Structure',
            'Ownership Structure',
            'Beneficial Owner Passport'
        ];
        
        // Check if all required documents are uploaded by looking for document keys that contain the document name
        const allDocsUploaded = requiredDocuments.every(doc => {
            return Object.keys(updatedDocs).some(key => 
                key.includes(doc) && updatedDocs[key] && updatedDocs[key].length > 0
            );
        });
        
        onChange({ 
            ...data, 
            uploadedDocuments: updatedDocs,
            documentsUploaded: allDocsUploaded
        });
    };

    const removeDocument = (documentName) => {
        const updatedDocs = { ...uploadedDocuments };
        delete updatedDocs[documentName];
        setUploadedDocuments(updatedDocs);
        
        // Re-check if all required documents are still uploaded after removal
        const requiredDocuments = [
            'Certificate of Incorporation',
            'Board of Resolution', 
            'Bank Statement',
            'Address Proof',
            'Management Structure',
            'Ownership Structure',
            'Beneficial Owner Passport'
        ];
        
        const allDocsUploaded = requiredDocuments.every(doc => {
            return Object.keys(updatedDocs).some(key => 
                key.includes(doc) && updatedDocs[key] && updatedDocs[key].length > 0
            );
        });
        
        onChange({ 
            ...data, 
            uploadedDocuments: updatedDocs,
            documentsUploaded: allDocsUploaded
        });
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

            {requirements.map((category, categoryIndex) => 
                category.documents.map((doc, docIndex) => {
                    const documentKey = `${categoryIndex}-${docIndex}-${doc}`;
                    const hasUploaded = uploadedDocuments[documentKey] && uploadedDocuments[documentKey].length > 0;
                    
                    return (
                        <Card key={documentKey} className="mb-4 border-0 shadow-sm">
                            <Card.Header className="bg-light border-0 py-2">
                                <h6 className="mb-0 text-primary">{doc}</h6>
                            </Card.Header>
                            <Card.Body>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">{doc} <span className="text-danger">*</span></Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        accept=".pdf,.jpg,.jpeg,.png" 
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleFileUpload(documentKey, [file]);
                                            }
                                        }}
                                        required 
                                    />
                                    <Form.Text className="text-muted">
                                        Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                                    </Form.Text>
                                    {hasUploaded && (
                                        <Form.Text className="text-success">
                                            File selected: {uploadedDocuments[documentKey][0]?.name || 'Document uploaded'}
                                        </Form.Text>
                                    )}
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    );
                })
            )}

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
    const [bankAccounts, setBankAccounts] = useState(data.bankAccounts || [{ bankName: '', bankAddress: '', bankCity: '', bankPostalCode: '', bankCountry: '', bankCountryOther: '', swiftCode: '', accountNo: '', accountName: '' }]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const addBankAccount = () => {
        const newAccounts = [...bankAccounts, { bankName: '', bankAddress: '', bankCity: '', bankPostalCode: '', bankCountry: '', bankCountryOther: '', swiftCode: '', accountNo: '', accountName: '' }];
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
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Title <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Full Name <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={data.authorizePersonEmail || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonEmail: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Place of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter place of birth"
                                value={data.authorizePersonPlaceOfBirth || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonPlaceOfBirth: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Date of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.authorizePersonDateOfBirth || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonDateOfBirth: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Passport ID No <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter passport ID number"
                                value={data.authorizePersonPassportId || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonPassportId: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Citizen <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonCitizen || ''}
                                onChange={(e) => onChange({ ...data, authorizePersonCitizen: e.target.value })}
                                required
                            >
                                <option value="">Select citizenship</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="SG">Singapore</option>
                                <option value="MY">Malaysia</option>
                                <option value="AU">Australia</option>
                                <option value="CA">Canada</option>
                                <option value="ID">Indonesia</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.authorizePersonCitizen === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other citizenship"
                                    value={data.authorizePersonCitizenOther || ''}
                                    onChange={(e) => onChange({ ...data, authorizePersonCitizenOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Gender <span className="text-danger">*</span></Form.Label>
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
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Marital Status <span className="text-danger">*</span></Form.Label>
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
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Phone Number <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={3}>
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
                                <Col md={9}>
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
                            <Form.Label className="text-muted">Street Address <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Postal / Zip Code <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Country <span className="text-danger">*</span></Form.Label>
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
                            {data.authorizePersonCountry === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other country"
                                    value={data.authorizePersonCountryOther || ''}
                                    onChange={(e) => onChange({ ...data, authorizePersonCountryOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Yes/No Questions */}
                <h5 className="text-primary mb-3 mt-4">Background Information</h5>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Do you have investment experience? <span className="text-danger">*</span></Form.Label>
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
                        {data.authorizePersonInvestmentExperience === 'YES' && (
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted">Please describe your investment experience <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Please describe your investment experience in detail..."
                                    value={data.authorizePersonInvestmentExperienceDetails || ''}
                                    onChange={(e) => onChange({ ...data, authorizePersonInvestmentExperienceDetails: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        )}
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Do you have any family who working in BAPPEBTI / Bursa Berjangka / Kliring Berjangka? <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Have you declared bankrupt by the Court? <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Authorize Person Company Name <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Nature of Business <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Job / Position <span className="text-danger">*</span></Form.Label>
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
                <h6 className="text-primary mb-3">Authorize Person Office Address</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Street Address <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Postal / Zip Code <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Authorize Person Country <span className="text-danger">*</span></Form.Label>
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
                            {data.authorizePersonOfficeCountry === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other office country"
                                    value={data.authorizePersonOfficeCountryOther || ''}
                                    onChange={(e) => onChange({ ...data, authorizePersonOfficeCountryOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>


                {/* Bank Accounts */}
                <h5 className="text-primary mb-3 mt-4">Bank Accounts Deposit And Withdrawal</h5>
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
                                        <Form.Label className="text-muted">Bank Name <span className="text-danger">*</span></Form.Label>
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
                                        <Form.Label className="text-muted">Account Name <span className="text-danger">*</span></Form.Label>
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
                                        <Form.Label className="text-muted">Bank Address (Street) <span className="text-danger">*</span></Form.Label>
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
                                        <Form.Label className="text-muted">Bank City <span className="text-danger">*</span></Form.Label>
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
                                        <Form.Label className="text-muted">Bank Country <span className="text-danger">*</span></Form.Label>
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
                                        {account.bankCountry === 'OTHER' && (
                                            <Form.Control
                                                type="text"
                                                placeholder="Please specify other country"
                                                value={account.bankCountryOther || ''}
                                                onChange={(e) => updateBankAccount(index, 'bankCountryOther', e.target.value)}
                                                className="mt-2"
                                                required
                                            />
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">SWIFT Code <span className="text-danger">*</span></Form.Label>
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
                                        <Form.Label className="text-muted">IBAN / Account No <span className="text-danger">*</span></Form.Label>
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

const PassportUploadStep = ({ data = {}, onChange }) => {
    const [passportFile, setPassportFile] = useState(data.passportFile || null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFileUpload = (files) => {
        if (files && files.length > 0) {
            const file = files[0];
            setPassportFile(file);
            onChange({ 
                ...data, 
                passportFile: file,
                passportDocumentsUploaded: true
            });
        }
    };

    const removeFile = () => {
        setPassportFile(null);
        onChange({ 
            ...data, 
            passportFile: null,
            passportDocumentsUploaded: false
        });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Passport Document Upload</h4>
                <p className="text-muted fs-5">Please upload the authorize person's passport document</p>
            </div>

            <Alert variant="info" className="mb-4">
                <h6 className="mb-2">
                    <i className="mdi mdi-information me-2"></i>
                    Upload Requirements
                </h6>
                <ul className="mb-0 small">
                    <li>Document must be clear and legible</li>
                    <li>Maximum file size: 10MB</li>
                    <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                    <li>All passport information must be visible</li>
                </ul>
            </Alert>

            <Card className="border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">Authorize Person Passport</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted">Authorize Person Passport <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    handleFileUpload([file]);
                                }
                            }}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                        {passportFile && (
                            <Form.Text className="text-success">
                                File selected: {passportFile.name}
                            </Form.Text>
                        )}
                    </Form.Group>
                </Card.Body>
            </Card>

            <Alert variant="warning" className="mt-4">
                <h6 className="mb-2">
                    <i className="mdi mdi-alert me-2"></i>
                    Important Notes
                </h6>
                <ul className="mb-0 small">
                    <li>This document is mandatory for authorize person verification</li>
                    <li>The passport must belong to the authorize person specified in the previous step</li>
                    <li>Document will be verified against the authorize person information provided</li>
                    <li>Ensure all text and details are clearly visible in the uploaded document</li>
                </ul>
            </Alert>
        </div>
    );
};

const DocumentAgreementsStep = ({ data = {}, onChange, onSubmit, allData }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleCheckboxChange = (fieldName, checked) => {
        onChange({ ...data, [fieldName]: checked });
    };

    const handleSubmit = () => {
        // Check if all required agreements are checked
        const requiredAgreements = agreements.filter(agreement => agreement.required);
        const uncheckedAgreements = requiredAgreements.filter(agreement => !data[agreement.field]);
        
        if (uncheckedAgreements.length > 0) {
            alert('Please agree to all required documents before submitting.');
            return;
        }

        // Submit the form with all data
        onSubmit(allData);
    };

    const areAllRequiredAgreementsChecked = () => {
        const requiredAgreements = agreements.filter(agreement => agreement.required);
        return requiredAgreements.every(agreement => data[agreement.field]);
    };

    const agreements = [
        {
            field: 'companyProfile',
            text: 'I have read and understood the ',
            linkText: 'company profile',
            additionalText: ' of PT. Genesis Gemilang Futures.',
            url: 'https://drive.google.com/file/d/1_29Uaed83l9pSudtzJO8oqWh5sD49A77/view',
            required: true
        },
        {
            field: 'statementSimulation',
            text: 'I have read, understood and agreed to the ',
            linkText: 'statement of having simulation',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/1UlhVYACvANdTruDqe7ZUpUjDkqDheIwB/view',
            required: true
        },
        {
            field: 'statementExperience',
            text: 'I have read, understood and agreed to the ',
            linkText: 'statement of having experience',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/1DScf7jYgnbUzeK6QfP7eaNlm0hp6wX4E/view',
            required: true
        },
        {
            field: 'disclosureStatement',
            text: 'I have read, understood and agreed to the ',
            linkText: 'disclosure statement',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/1dfTD9xjnoz3-blO2bxprhhS1prXHDIKG/view',
            required: true
        },
        {
            field: 'accountOpeningApplication',
            text: 'I have read, understood and agreed to the ',
            linkText: 'account opening application',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/1bxOc9ZtkWymJU_b7PGfKoehl-fAj1g7W/view',
            required: true
        },
        {
            field: 'riskDisclosure',
            text: 'I have read, understood and agreed to the ',
            linkText: 'risk disclosure',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/1A4cJO0K3ZKV3aZWL6AzzELi42t0CIrIB/view',
            required: true
        },
        {
            field: 'mandateAgreement',
            text: 'I have read, understood and agreed to the ',
            linkText: 'mandate agreement',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/1o5PmpjMO_vVK55YDeHDJ6QzyNSCRL4MK/view',
            required: true
        },
        {
            field: 'tradingRules',
            text: 'I have read, understood and agreed to the ',
            linkText: 'trading rules',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/16kBaWNpbEI7SnKR9le4sOsOBmc9967vn/view',
            required: true
        },
        {
            field: 'personalAccessPassword',
            text: 'I have read, understood and agreed to the ',
            linkText: 'personal access password',
            additionalText: '.',
            url: 'https://drive.google.com/file/d/1JVpkMMDikDrYE-R63BXR4ZnkrvLNVZjS/view',
            required: true
        }
    ];

    return (
        <div>
            <div className="text-center">
                <h4 className="text-primary mb-3">Document Agreements</h4>
                <p className="text-muted fs-5">It's almost done! Time to tick the Document Agreements</p>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                    {agreements.map((agreement, index) => (
                        <div key={agreement.field} className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id={agreement.field}
                                checked={data[agreement.field] || false}
                                onChange={(e) => handleCheckboxChange(agreement.field, e.target.checked)}
                                label={
                                    <span>
                                        {agreement.text}
                                        <a 
                                            href={agreement.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-primary text-decoration-underline"
                                        >
                                            {agreement.linkText}
                                        </a>
                                        {agreement.additionalText}
                                        {agreement.required && <span className="text-danger ms-1">*</span>}
                                    </span>
                                }
                                className="agreement-checkbox"
                            />
                        </div>
                    ))}
                </Card.Body>
            </Card>

            <Alert variant="info" className="mt-4">
                <h6 className="mb-2">
                    <i className="mdi mdi-information me-2"></i>
                    Important Notice
                </h6>
                <p className="mb-0 small">
                    All agreements marked with <span className="text-danger">*</span> are mandatory and must be accepted 
                    before proceeding to the final review. Please ensure you have read and understood each document 
                    thoroughly before agreeing to the terms and conditions.
                </p>
            </Alert>

            <Alert variant="warning" className="mt-3">
                <h6 className="mb-2">
                    <i className="mdi mdi-alert me-2"></i>
                    Legal Compliance
                </h6>
                <p className="mb-0 small">
                    By checking these boxes, you acknowledge that you have read, understood, and agree to be bound by 
                    the terms and conditions outlined in each respective document. These agreements are legally binding 
                    and form part of your account opening process.
                </p>
            </Alert>
        </div>
    );
};


export default RegulatedCompanyForm; 