import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';

const ForeignCompanyForm = () => {
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

    const documentRequirements = [
        {
            category: "Company Documents",
            documents: [
                "Certificate of Incorporation",
                "Board of Resolution",
                "Address Proof"
            ]
        },
        {
            category: "Financial Documents",
            documents: [
                "Bank Statement"
            ]
        },
        {
            category: "Personal Documents",
            documents: [
                "Beneficial Owner Passport"
            ]
        },
        {
            category: "Company Structure",
            documents: [
                "Management Structure",
                "Ownership Structure"
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
                return <AuthorizePersonStep data={stepData} onChange={updateFormData} />;
            case 5:
                return <ReviewStep allData={formData} onChange={updateFormData} />;
            default:
                return <RequirementsStep requirements={documentRequirements} />;
        }
    };

    const handleStepChange = (step, data) => {
        console.log(`Moving to step ${step}`, data);
        // Auto-populate demo account from email step to company details step
        if (step === 2 && data.demoAccountNo) {
            setFormData(prevData => ({
                ...prevData,
                ...data,
                demoAccountNo: data.demoAccountNo
            }));
        }
    };

    const handleSubmit = (data) => {
        console.log('Submitting Foreign Company KYC:', data);
        // Here you would submit to your API
        alert('Foreign Company KYC submitted successfully!');
    };

    return (
        <MultiStepFormWrapper
            accountType="Foreign Company"
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

        <Alert variant="info" className="mt-4">
            <h6 className="mb-2">
                <i className="mdi mdi-information me-2"></i>
                Important Notes
            </h6>
            <ul className="mb-0 small">
                {/* <li>All documents must be in English or officially translated</li> */}
                <li>Documents should be clear, legible scans or photos</li>
                <li>Maximum file size: 10MB per document</li>
                <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
            </ul>
        </Alert>
        </div>
    );
};

const EmailRegistrationStep = ({ data = {}, onChange }) => {
    const [email, setEmail] = useState(data.email || '');
    const [demoAccountNo, setDemoAccountNo] = useState(data.demoAccountNo || '');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Company Information</h4>
                <p className="text-muted fs-5">Please provide your complete company details</p>
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
                                value={data.companyRegistrationName || ''}
                                onChange={(e) => onChange({ ...data, companyRegistrationName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Company License No <span className="text-danger">*</span></Form.Label>
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
                                value={data.companyLegalForm || ''}
                                onChange={(e) => onChange({ ...data, companyLegalForm: e.target.value })}
                                required
                            >
                                <option value="">Select legal form</option>
                                <option value="LIMITED_LIABILITY_COMPANY">Limited Liability Company</option>
                                <option value="CORPORATION">Corporation</option>
                                <option value="PARTNERSHIP">Partnership</option>
                                <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
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
                                value={data.postalCode || ''}
                                onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
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

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Office Telephone No <span className="text-danger">*</span></Form.Label>
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
                    </Col>
                </Row>

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
                            <Form.Label>Source of Funds <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.sourceOfFunds || ''}
                                onChange={(e) => onChange({ ...data, sourceOfFunds: e.target.value })}
                                required
                            >
                                <option value="">Select source of funds</option>
                                <option value="BUSINESS_INCOME">Business Income</option>
                                <option value="INVESTMENT_INCOME">Investment Income</option>
                                <option value="INHERITANCE">Inheritance</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="LOAN">Loan</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Opening Trading Account Purpose <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.tradingAccountPurpose || ''}
                                onChange={(e) => onChange({ ...data, tradingAccountPurpose: e.target.value })}
                                required
                            >
                                <option value="">Select purpose</option>
                                <option value="HEDGING">Hedging</option>
                                <option value="SPECULATION">Speculation</option>
                                <option value="ARBITRAGE">Arbitrage</option>
                                <option value="INVESTMENT">Investment</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
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

const DocumentUploadStep = ({ data = {}, onChange, requirements }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Document Upload</h4>
                <p className="text-muted fs-5">Upload all required documents</p>
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

const ReviewStep = ({ allData, onChange }) => {
    const [agreements, setAgreements] = useState({
        companyProfile: false,
        statementSimulation: false,
        statementExperience: false,
        disclosureStatement: false,
        accountOpening: false,
        riskDisclosure: false,
        mandateAgreement: false,
        tradingRules: false,
        personalAccessPassword: false
    });

    const handleAgreementChange = (field, value) => {
        setAgreements(prev => ({ ...prev, [field]: value }));
    };

    const allAgreementsChecked = Object.values(agreements).every(Boolean);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Review & Submit</h4>
                <p className="text-muted fs-5">Please review your information before submitting</p>
            </div>

            <Alert variant="info">
                <h6 className="mb-2">Application Summary</h6>
                <p className="mb-0">
                    Please review all the information you've provided. 
                    {/* Once submitted, 
                    your application will be processed within 2-3 business days. */}
                </p>
            </Alert>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Body>
                    <h6 className="text-primary mb-3">Application Details</h6>
                    <Row>
                        <Col md={6}>
                            <p><strong>Account Type:</strong> Foreign Company</p>
                            <p><strong>Status:</strong> Ready for submission</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Steps Completed:</strong> 5/5</p>
                            <p><strong>Documents Uploaded:</strong> Ready</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Terms and Conditions */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0 py-3">
                    <h5 className="mb-0 text-primary">Terms and Conditions Agreement</h5>
                </Card.Header>
                <Card.Body className="p-4">
                    <p className="text-muted mb-4">Please read and agree to all the following documents before submitting your application:</p>
                    
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="companyProfile"
                                checked={agreements.companyProfile}
                                onChange={(e) => handleAgreementChange('companyProfile', e.target.checked)}
                                label={
                                    <span>
                                        I have read and understood the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1_29Uaed83l9pSudtzJO8oqWh5sD49A77/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            company profile
                                        </a>{' '}
                                        of PT. Genesis Gemilang Futures. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="statementSimulation"
                                checked={agreements.statementSimulation}
                                onChange={(e) => handleAgreementChange('statementSimulation', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1UlhVYACvANdTruDqe7ZUpUjDkqDheIwB/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            statement of having simulation
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="statementExperience"
                                checked={agreements.statementExperience}
                                onChange={(e) => handleAgreementChange('statementExperience', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1DScf7jYgnbUzeK6QfP7eaNlm0hp6wX4E/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            statement of having experience
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="disclosureStatement"
                                checked={agreements.disclosureStatement}
                                onChange={(e) => handleAgreementChange('disclosureStatement', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1dfTD9xjnoz3-blO2bxprhhS1prXHDIKG/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            disclosure statement
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="accountOpening"
                                checked={agreements.accountOpening}
                                onChange={(e) => handleAgreementChange('accountOpening', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1bxOc9ZtkWymJU_b7PGfKoehl-fAj1g7W/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            account opening application
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="riskDisclosure"
                                checked={agreements.riskDisclosure}
                                onChange={(e) => handleAgreementChange('riskDisclosure', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1A4cJO0K3ZKV3aZWL6AzzELi42t0CIrIB/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            risk disclosure
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="mandateAgreement"
                                checked={agreements.mandateAgreement}
                                onChange={(e) => handleAgreementChange('mandateAgreement', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1o5PmpjMO_vVK55YDeHDJ6QzyNSCRL4MK/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            mandate agreement
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="tradingRules"
                                checked={agreements.tradingRules}
                                onChange={(e) => handleAgreementChange('tradingRules', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/16kBaWNpbEI7SnKR9le4sOsOBmc9967vn/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            trading rules
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="personalAccessPassword"
                                checked={agreements.personalAccessPassword}
                                onChange={(e) => handleAgreementChange('personalAccessPassword', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1JVpkMMDikDrYE-R63BXR4ZnkrvLNVZjS/view" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-decoration-underline"
                                        >
                                            personal access password
                                        </a>. <span className="text-danger">*</span>
                                    </span>
                                }
                                required
                            />
                        </Form.Group>
                    </Form>

                    {!allAgreementsChecked && (
                        <Alert variant="warning" className="mt-3">
                            <small>
                                <i className="mdi mdi-alert me-2"></i>
                                Please read and agree to all terms and conditions before submitting your application.
                            </small>
                        </Alert>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default ForeignCompanyForm; 