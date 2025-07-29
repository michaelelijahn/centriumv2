import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';

const ForeignPersonForm = () => {
    const [formData, setFormData] = useState({});

    const steps = [
        {
            title: "Requirements",
            description: "Document checklist"
        },
        {
            title: "Personal Email",
            description: "Email registration"
        },
        {
            title: "Personal Details",
            description: "Complete information"
        },
        {
            title: "Upload Documents",
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
            category: "Required Documents",
            documents: [
                "Bank Account Statement / Credit Card Bill",
                "Telephone / Electricity Bill",
                "Photo Selfie",
                "Passport"
            ]
        }
    ];

    const renderStep = ({ currentStep, formData: stepData, updateFormData }) => {
        switch (currentStep) {
            case 0:
                return <RequirementsStep requirements={documentRequirements} />;
            case 1:
                return <PersonalEmailRegistrationStep data={stepData} onChange={updateFormData} />;
            case 2:
                return <PersonalDetailsStep data={stepData} onChange={updateFormData} />;
            case 3:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} />;
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
        console.log('Submitting Foreign Person KYC:', data);
        alert('Foreign Person KYC submitted successfully!');
    };

    return (
        <MultiStepFormWrapper
            accountType="Foreign Person"
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
                    <Card className="border-0 shadow-sm h-100" style={{ minHeight: '180px', maxHeight: '250px' }}>
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

const PersonalEmailRegistrationStep = ({ data = {}, onChange }) => {
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
                <h4 className="text-primary mb-3">Personal Email Registration</h4>
                <p className="text-muted fs-5">Please provide your personal email address</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Register Personal Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter personal email address"
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

const PersonalDetailsStep = ({ data = {}, onChange }) => {
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
                <h4 className="text-primary mb-3">Personal Information</h4>
                <p className="text-muted fs-5">Please provide your complete personal details</p>
            </div>

            <Form>
                {/* Basic Personal Information */}
                <h5 className="text-primary mb-3">Personal Details</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={data.fullName || ''}
                                onChange={(e) => onChange({ ...data, fullName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Place of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter place of birth"
                                value={data.placeOfBirth || ''}
                                onChange={(e) => onChange({ ...data, placeOfBirth: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.dateOfBirth || ''}
                                onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Passport ID No. <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter passport ID number"
                                value={data.passportIdNo || ''}
                                onChange={(e) => onChange({ ...data, passportIdNo: e.target.value })}
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
                                value={data.gender || ''}
                                onChange={(e) => onChange({ ...data, gender: e.target.value })}
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
                                value={data.maritalStatus || ''}
                                onChange={(e) => onChange({ ...data, maritalStatus: e.target.value })}
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

                {/* Conditional Spouse Name Field */}
                {data.maritalStatus === 'MARRIED' && (
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Spouse Name <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter spouse name"
                                    value={data.spouseName || ''}
                                    onChange={(e) => onChange({ ...data, spouseName: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Citizen <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter citizenship"
                                value={data.citizen || ''}
                                onChange={(e) => onChange({ ...data, citizen: e.target.value })}
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
                                        <option value="+62">+62 (ID)</option>
                                        <option value="+91">+91 (IN)</option>
                                    </Form.Select>
                                </Col>
                                <Col md={8}>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={data.phoneNumber || ''}
                                        onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Address Information */}
                <h6 className="text-primary mb-3">Address Information</h6>
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
                            <Form.Label>Postal / ZIP Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postal/ZIP code"
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
                                <option value="ID">Indonesia</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Account and Experience Information */}
                <h5 className="text-primary mb-3 mt-4">Account Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Account Opening Purpose <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.accountOpeningPurpose || ''}
                                onChange={(e) => onChange({ ...data, accountOpeningPurpose: e.target.value })}
                                required
                            >
                                <option value="">Select purpose</option>
                                <option value="HEDGING">Hedging</option>
                                <option value="GAIN">Gain</option>
                                <option value="SPECULATION">Speculation</option>
                                <option value="OTHERS">Others</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Yes/No Questions */}
                <h6 className="text-primary mb-3">Background Information</h6>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Investment Experience <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="investmentExperience"
                                    value="YES"
                                    checked={data.investmentExperience === 'YES'}
                                    onChange={(e) => onChange({ ...data, investmentExperience: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="investmentExperience"
                                    value="NO"
                                    checked={data.investmentExperience === 'NO'}
                                    onChange={(e) => onChange({ ...data, investmentExperience: e.target.value })}
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
                                    checked={data.familyInBappebti === 'YES'}
                                    onChange={(e) => onChange({ ...data, familyInBappebti: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="familyInBappebti"
                                    value="NO"
                                    checked={data.familyInBappebti === 'NO'}
                                    onChange={(e) => onChange({ ...data, familyInBappebti: e.target.value })}
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
                                    checked={data.declaredBankrupt === 'YES'}
                                    onChange={(e) => onChange({ ...data, declaredBankrupt: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="declaredBankrupt"
                                    value="NO"
                                    checked={data.declaredBankrupt === 'NO'}
                                    onChange={(e) => onChange({ ...data, declaredBankrupt: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Emergency Contact */}
                <h5 className="text-primary mb-3 mt-4">Emergency Contact Person</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name of Emergency Contact <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter emergency contact name"
                                value={data.emergencyContactName || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Relationship <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactRelationship: e.target.value })}
                                required
                            >
                                <option value="">Select relationship</option>
                                <option value="SPOUSE">Spouse</option>
                                <option value="FAMILY">Family</option>
                                <option value="CHILD">Child</option>
                                <option value="OTHERS">Others</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <h6 className="text-primary mb-3">Emergency Contact Address</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter emergency contact street address"
                                value={data.emergencyContactStreetAddress || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactStreetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter emergency contact city"
                                value={data.emergencyContactCity || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactCity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Postal / ZIP Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter emergency contact postal/ZIP code"
                                value={data.emergencyContactPostalCode || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactPostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactCountry || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactCountry: e.target.value })}
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

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.emergencyContactCountryCode || ''}
                                        onChange={(e) => onChange({ ...data, emergencyContactCountryCode: e.target.value })}
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
                                        placeholder="Enter emergency contact phone number"
                                        value={data.emergencyContactPhoneNumber || ''}
                                        onChange={(e) => onChange({ ...data, emergencyContactPhoneNumber: e.target.value })}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Employment Status */}
                <h5 className="text-primary mb-3 mt-4">Employment Status</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Employment Status <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.employmentStatus || ''}
                                onChange={(e) => onChange({ ...data, employmentStatus: e.target.value })}
                                required
                            >
                                <option value="">Select employment status</option>
                                <option value="WORK">Work</option>
                                <option value="ENTREPRENEUR">Entrepreneur</option>
                                <option value="RETIRED">Retired</option>
                                <option value="STUDENT">Student</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Conditional Employment Details */}
                {(data.employmentStatus === 'WORK' || data.employmentStatus === 'ENTREPRENEUR') && (
                    <>
                        <h6 className="text-primary mb-3">Employment Details</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Company Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                        placeholder="Enter company name"
                                        value={data.employmentCompanyName || ''}
                                        onChange={(e) => onChange({ ...data, employmentCompanyName: e.target.value })}
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
                                        value={data.employmentNatureOfBusiness || ''}
                                        onChange={(e) => onChange({ ...data, employmentNatureOfBusiness: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                        <Row>
                            <Col md={6}>
                <Form.Group className="mb-3">
                                    <Form.Label>Position <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                                        type="text"
                                        placeholder="Enter your position"
                                        value={data.employmentPosition || ''}
                                        onChange={(e) => onChange({ ...data, employmentPosition: e.target.value })}
                        required
                    />
                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Length of Work <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g. 2 years, 6 months"
                                        value={data.employmentLengthOfWork || ''}
                                        onChange={(e) => onChange({ ...data, employmentLengthOfWork: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Previous Company</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter previous company (optional)"
                                        value={data.employmentPreviousCompany || ''}
                                        onChange={(e) => onChange({ ...data, employmentPreviousCompany: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Office Phone Number <span className="text-danger">*</span></Form.Label>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Select
                                                value={data.employmentOfficeCountryCode || ''}
                                                onChange={(e) => onChange({ ...data, employmentOfficeCountryCode: e.target.value })}
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
                                                placeholder="Enter office phone number"
                                                value={data.employmentOfficePhoneNumber || ''}
                                                onChange={(e) => onChange({ ...data, employmentOfficePhoneNumber: e.target.value })}
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <h6 className="text-primary mb-3">Office Address</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Address <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter office address"
                                        value={data.employmentOfficeAddress || ''}
                                        onChange={(e) => onChange({ ...data, employmentOfficeAddress: e.target.value })}
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
                                        value={data.employmentOfficeCity || ''}
                                        onChange={(e) => onChange({ ...data, employmentOfficeCity: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Postal / ZIP Code <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter office postal/ZIP code"
                                        value={data.employmentOfficePostalCode || ''}
                                        onChange={(e) => onChange({ ...data, employmentOfficePostalCode: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Country <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={data.employmentOfficeCountry || ''}
                                        onChange={(e) => onChange({ ...data, employmentOfficeCountry: e.target.value })}
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
                    </>
                )}

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



const DocumentUploadStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Upload Documents</h4>
                <p className="text-muted fs-5">Please upload the required documents</p>
            </div>

            <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">Required Documents</h6>
                    </Card.Header>
                    <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Bank Account Statement / Credit Card Bill <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, bankStatementFile: e.target.files[0] })}
                            required 
                        />
                                <Form.Text className="text-muted">
                                    Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                                </Form.Text>
                            </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Telephone / Electricity Bill <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, telephoneElectricityBillFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Photo Selfie <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, photoSelfieFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Passport <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, passportFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Personal Tax Document</Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf" 
                            onChange={(e) => onChange({ ...data, personalTaxDocumentFile: e.target.files[0] })}
                        />
                        <Form.Text className="text-muted">
                            Optional - Max 10MB. Accepted format: PDF only
                        </Form.Text>
                    </Form.Group>
                    </Card.Body>
                </Card>
        </div>
    );
};

const ReviewStep = ({ allData, onChange }) => {
    const [agreements, setAgreements] = useState({
        companyProfile: false,
        statementSimulation: false,
        statementExperience: false,
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
                            <p><strong>Account Type:</strong> Foreign Person</p>
                            <p><strong>Status:</strong> Ready for submission</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Steps Completed:</strong> 4/4</p>
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
                                            href="https://drive.google.com/file/d/1HeIYSnt2j1GsWckrkoRo40kh5_Y_BCVY/view" 
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
                                            href="https://drive.google.com/file/d/1SL4WEzRnUNR3uGkwXKo8X17UNo-UJiG6/view" 
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
                                            href="https://drive.google.com/file/d/12MVWUxguyt2El8UOd1UCH6nG-Y9FKdIC/view" 
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
                                id="accountOpening"
                                checked={agreements.accountOpening}
                                onChange={(e) => handleAgreementChange('accountOpening', e.target.checked)}
                                label={
                                    <span>
                                        I have read, understood and agreed to the{' '}
                                        <a 
                                            href="https://drive.google.com/file/d/1SCB1N4Knnou1aELdphobbRVlidUoD7m2/view" 
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
                                            href="https://drive.google.com/file/d/16bXQ-tGmWTU7jfIeACQe3zgF69XJAv3r/view" 
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
                                            href="https://drive.google.com/file/d/1C1jz5_-ZMG_yWHHUW9Z9brzNy7sMHwfA/view" 
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
                                            href="https://drive.google.com/file/d/1HOABLBHfN3qVy-RtBXuSNGzqHbsTe2Bk/view" 
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
                                            href="https://drive.google.com/file/d/1etnTr_bAODhysXoS03sTUzvEPMNK6eZ1/view" 
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

export default ForeignPersonForm; 