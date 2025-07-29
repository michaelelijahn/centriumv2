import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';

const IndonesianCompanyForm = () => {
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
            title: "Company Documents",
            description: "document upload"
        },
        {
            title: "Power of Attorney Details",
            description: "Basic information"
        },
        {
            title: "Power of Attorney Documents",
            description: "document upload"
        },
        {
            title: "Read Statements",
            description: "Review all required documents"
        },
        {
            title: "Review & Submit",
            description: "Final review"
        }
    ];

    // Placeholder document requirements - user will provide actual requirements later
    const documentRequirements = [
        {
            category: "Personal Documents",
            documents: [
                "Bank Account Report / Credit Card Bill",
                "Telephone / Electricity Bill",
                "Photo Selfie",
                "Identity Card/Driving License/Passport"
            ]
        },
        {
            category: "Company Documents",
            documents: [
                "Scan of Company's Articles of Association",
                "Certificate of Incorporation",
                "Financial Statements / Description of Business Activities",
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
                return <CompanyDocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} />;
            case 4:
                return <PowerOfAttorneyStep data={stepData} onChange={updateFormData} />;
            case 5:
                return <PersonalDocumentUploadStep data={stepData} onChange={updateFormData} />;
            case 6:
                return <ReadStatementsStep data={stepData} onChange={updateFormData} />;
            case 7:
                return <ReviewStep allData={formData} />;
            default:
                return <RequirementsStep requirements={documentRequirements} />;
        }
    };

    const handleStepChange = (step, data) => {
        console.log(`Moving to step ${step}`, data);
    };

    const handleSubmit = (data) => {
        console.log('Submitting Indonesian Company KYC:', data);
        alert('Indonesian Company KYC submitted successfully!');
    };

    return (
        <MultiStepFormWrapper
            accountType="Indonesian Company"
            steps={steps}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
        >
            {renderStep}
        </MultiStepFormWrapper>
    );
};

// Step Components (reusing similar structure)
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
                    <Card className="border-0 shadow-sm h-100" style={{ minHeight: '180px', maxHeight: '300px' }}>
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
                <li>All documents must be in Indonesian or English</li>
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
    const [bankAccounts, setBankAccounts] = useState(data.bankAccounts || [{ bankName: '', branch: '', accountNo: '', accountHolderName: '', bankTelephoneNo: '', bankTelephoneCountryCode: '', bankAccountType: '' }]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const addBankAccount = () => {
        const newAccounts = [...bankAccounts, { bankName: '', branch: '', accountNo: '', accountHolderName: '', bankTelephoneNo: '', bankTelephoneCountryCode: '', bankAccountType: '' }];
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
        newAccounts[index] = { ...newAccounts[index], [field]: value };
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Company Information</h4>
                <p className="text-muted fs-5">Please provide your complete company details</p>
            </div>

            <Form>
                {/* Company Basic Information */}
                <h5 className="text-primary mb-3">Basic Company Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Nama Calon Nasabah Non-Orang Perseorangan (Nama Perusahaan) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company registration number"
                                value={data.companyName || ''}
                                onChange={(e) => onChange({ ...data, companyName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>No. Izin Usaha <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company license number"
                                value={data.businessLicenseNo || ''}
                                onChange={(e) => onChange({ ...data, businessLicenseNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Badan Usaha / Kegiatan <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter nature of business"
                                value={data.businessEntity || ''}
                                onChange={(e) => onChange({ ...data, businessEntity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>NPWP Perusahaan <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter tax identification number"
                                value={data.companyNPWP || ''}
                                onChange={(e) => onChange({ ...data, companyNPWP: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Company Address */}
                <h5 className="text-primary mb-3 mt-4">Alamat Perusahaan (Company Address)</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Alamat Perusahaan (Company Address) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter street name"
                                value={data.streetName || ''}
                                onChange={(e) => onChange({ ...data, streetName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Kota (City) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label>Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postal code"
                                value={data.postalCode || ''}
                                onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Company Establishment Information */}
                <h5 className="text-primary mb-3 mt-4">Company Establishment Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tempat Pendirian Perusahaan <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label>Tanggal Pendirian Perusahaan <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.establishmentDate || ''}
                                onChange={(e) => onChange({ ...data, establishmentDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Bentuk Hukum <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.legalForm || ''}
                                onChange={(e) => onChange({ ...data, legalForm: e.target.value })}
                                required
                            >
                                <option value="">Select legal form</option>
                                <option value="PT">PT (Perseroan Terbatas)</option>
                                <option value="CV">CV (Commanditaire Vennootschap)</option>
                                <option value="FIRMA">Firma</option>
                                <option value="KOPERASI">Koperasi</option>
                                <option value="YAYASAN">Yayasan</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>No. Telepon Kantor (Office Telephone No.) <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.officeTelephoneCountryCode || ''}
                                        onChange={(e) => onChange({ ...data, officeTelephoneCountryCode: e.target.value })}
                                        required
                                    >
                                        <option value="">Code</option>
                                        <option value="+62">+62 (ID)</option>
                                        <option value="+65">+65 (SG)</option>
                                        <option value="+60">+60 (MY)</option>
                                        <option value="+1">+1 (US/CA)</option>
                                        <option value="+44">+44 (UK)</option>
                                        <option value="+61">+61 (AU)</option>
                                        <option value="+91">+91 (IN)</option>
                                    </Form.Select>
                                </Col>
                                <Col md={8}>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter office telephone number"
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
                <h5 className="text-primary mb-3 mt-4">Beneficial Owner Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Nama Beneficial Owner <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>No. KTP / SIM / Paspor Beneficial Owner <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter ID/Passport number"
                                value={data.beneficialOwnerIdNo || ''}
                                onChange={(e) => onChange({ ...data, beneficialOwnerIdNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Transaction Information */}
                <h5 className="text-primary mb-3 mt-4">Transaction Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Sumber Dana <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.sourceOfFunds || ''}
                                onChange={(e) => onChange({ ...data, sourceOfFunds: e.target.value })}
                                required
                            >
                                <option value="">Select source of funds</option>
                                <option value="BUSINESS_PROFIT">Business Profit</option>
                                <option value="INVESTMENT">Investment</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="LOAN">Loan</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Maksud dan Tujuan Pembukaan Rekening Transaksi yang akan Dilakukan Calon Nasabah <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.accountPurpose || ''}
                                onChange={(e) => onChange({ ...data, accountPurpose: e.target.value })}
                                required
                            >
                                <option value="">Select account purpose</option>
                                <option value="HEDGING">Hedging</option>
                                <option value="SPECULATION">Speculation</option>
                                <option value="INVESTMENT">Investment</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Authorization Information */}
                <h5 className="text-primary mb-3 mt-4">Authorization Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Nama Penerima Kuasa yang Menjalankan Transaksi <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter authorized person name"
                                value={data.authorizedPersonName || ''}
                                onChange={(e) => onChange({ ...data, authorizedPersonName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Pihak yang berwenang melakukan Pendebetan <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter authorized debit person"
                                value={data.authorizedDebitPerson || ''}
                                onChange={(e) => onChange({ ...data, authorizedDebitPerson: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Bank Account Information */}
                <h5 className="text-primary mb-3 mt-4">Bank Account Information</h5>
                {bankAccounts.map((account, index) => (
                    <Card key={index} className="mb-3 border-0 shadow-sm">
                        <Card.Header className="bg-light border-0 py-2 d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 text-primary">Bank Account {index + 1}</h6>
                            {bankAccounts.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeBankAccount(index)}
                                >
                                    <i className="mdi mdi-delete me-1"></i>
                                    Remove
                                </button>
                            )}
                        </Card.Header>
                        <Card.Body>
                                                            <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Bank <span className="text-danger">*</span></Form.Label>
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
                                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Cabang <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter branch name"
                                                value={account.branch}
                                                onChange={(e) => updateBankAccount(index, 'branch', e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. Rekening <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter account number"
                                                value={account.accountNo}
                                                onChange={(e) => updateBankAccount(index, 'accountNo', e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Account Holder Name <span className="text-danger">*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter account holder name"
                                                value={account.accountHolderName}
                                                onChange={(e) => updateBankAccount(index, 'accountHolderName', e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Bank Telephone No. <span className="text-danger">*</span></Form.Label>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Select
                                                        value={account.bankTelephoneCountryCode || ''}
                                                        onChange={(e) => updateBankAccount(index, 'bankTelephoneCountryCode', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Code</option>
                                                        <option value="+62">+62 (ID)</option>
                                                        <option value="+65">+65 (SG)</option>
                                                        <option value="+60">+60 (MY)</option>
                                                        <option value="+1">+1 (US/CA)</option>
                                                        <option value="+44">+44 (UK)</option>
                                                        <option value="+61">+61 (AU)</option>
                                                        <option value="+91">+91 (IN)</option>
                                                    </Form.Select>
                                                </Col>
                                                <Col md={8}>
                                                    <Form.Control
                                                        type="tel"
                                                        placeholder="Enter bank telephone number"
                                                        value={account.bankTelephoneNo}
                                                        onChange={(e) => updateBankAccount(index, 'bankTelephoneNo', e.target.value)}
                                                        required
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Jenis Rekening Bank (Bank Account Type) <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                value={account.bankAccountType}
                                                onChange={(e) => updateBankAccount(index, 'bankAccountType', e.target.value)}
                                                required
                                            >
                                                <option value="">Select account type</option>
                                                <option value="GIRO">Giro</option>
                                                <option value="TABUNGAN">Tabungan (Savings)</option>
                                                <option value="LAINNYA">Lainnya (Others)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                        </Card.Body>
                    </Card>
                ))}

                <div className="text-center mb-3">
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

const CompanyDocumentUploadStep = ({ data = {}, onChange, requirements }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Company Documents Upload</h4>
                <p className="text-muted fs-5">Upload all required company documents for Indonesian Company</p>
            </div>

            <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">Required Company Documents</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Scan Anggaran Dasar Perusahaan (Scan Company's Articles of Association) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, articlesOfAssociationFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Scan Nomor Izin Usaha (Scan Certificate of Incorporation) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, certificateOfIncorporationFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Laporan Keuangan / Deskripsi Kegiatan Usaha (Financial Statements / Description of Business Activities) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, financialStatementsFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Struktur Manajemen (Management Structure) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, managementStructureFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Struktur Kepemilikan (Ownership Structure) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, ownershipStructureFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Spesimen Tanda Tangan Pihak Yang Melaksanakan Transaksi (Board of Resolution) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, boardOfResolutionFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Surat Kuasa (Power of Attorney) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, powerOfAttorneyFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>
                </Card.Body>
            </Card>
        </div>
    );
};

const PowerOfAttorneyStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Data Penerima Kuasa</h4>
                <p className="text-muted fs-5">Power of Attorney Data</p>
            </div>

            <Form>
                {/* Yang mengisi formulir di bawah ini */}
                <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0 py-2">
                        <h6 className="mb-0 text-primary">Yang mengisi formulir di bawah ini:</h6>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Lengkap <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter full name"
                                        value={data.formFillerName || ''}
                                        onChange={(e) => onChange({ ...data, formFillerName: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Tempat Lahir <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter place of birth"
                                        value={data.formFillerPlaceOfBirth || ''}
                                        onChange={(e) => onChange({ ...data, formFillerPlaceOfBirth: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Tanggal Lahir <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={data.formFillerDateOfBirth || ''}
                                        onChange={(e) => onChange({ ...data, formFillerDateOfBirth: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. KTP / SIM / Paspor <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter ID/Passport number"
                                        value={data.formFillerIdNo || ''}
                                        onChange={(e) => onChange({ ...data, formFillerIdNo: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Alamat <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        placeholder="Enter complete address"
                                        value={data.formFillerAddress || ''}
                                        onChange={(e) => onChange({ ...data, formFillerAddress: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kota <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter city"
                                        value={data.formFillerCity || ''}
                                        onChange={(e) => onChange({ ...data, formFillerCity: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kode Pos <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter postal code"
                                        value={data.formFillerPostalCode || ''}
                                        onChange={(e) => onChange({ ...data, formFillerPostalCode: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. Akun Demo <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter demo account number"
                                value={data.formFillerDemoAccount || ''}
                                onChange={(e) => onChange({ ...data, formFillerDemoAccount: e.target.value })}
                                required
                            />
                        </Form.Group>

                        {/* Simulation Statement */}
                        <Card className="mt-4 border-primary">
                            <Card.Body className="p-3">
                                <p className="mb-3 text-dark">
                                    Dengan mengisi kolom, "YA" dibawah ini saya menyatakan bahwa saya telah melakukan simulasi bertransaksi di 
                                    bidang Perdagangan Berjangka Komoditi pada PT. GENESIS GEMILANG FUTURES, dan telah memahami tata cara 
                                    bertransaksi di bidang Perdagangan Berjangka komoditi.
                                </p>
                                <p className="mb-3 text-dark">
                                    Demikian Pernyataan ini dibuat dengan sebenarnya dalam keadaan sadar, sehat jasmani dan rohani serta tanpa 
                                    paksaan apapun dari pihak manapun.
                                </p>
                                
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Pernyataan Menerima / Tidak</Form.Label>
                                    <div className="d-flex gap-4 mt-2">
                                        <Form.Check
                                            type="radio"
                                            name="statementAcceptance"
                                            id="accept-statement"
                                            label="Ya"
                                            value="ya"
                                            checked={data.statementAcceptance === 'ya'}
                                            onChange={(e) => onChange({ ...data, statementAcceptance: e.target.value })}
                                            required
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="statementAcceptance"
                                            id="decline-statement"
                                            label="Tidak"
                                            value="tidak"
                                            checked={data.statementAcceptance === 'tidak'}
                                            onChange={(e) => onChange({ ...data, statementAcceptance: e.target.value })}
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-0">
                                    <Form.Label>Menerima Pada Tanggal</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={data.acceptanceDate || ''}
                                        onChange={(e) => onChange({ ...data, acceptanceDate: e.target.value })}
                                        className="mt-2"
                                        style={{ maxWidth: '200px' }}
                                        required
                                    />
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Card.Body>
                </Card>

                {/* PENERIMA KUASA (NON ORANG PERSEORANGAN) */}
                <h5 className="text-primary mb-3 mt-4">PENERIMA KUASA (NON ORANG PERSEORANGAN)</h5>
                <h6 className="text-secondary mb-3">EMPLOYMENT DATA OF AUTHORIZE PERSON</h6>
                
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Lengkap <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                value={data.fullName || ''}
                                onChange={(e) => onChange({ ...data, fullName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Tempat Lahir <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Tanggal Lahir <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. KTP / SIM / Paspor <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter ID/Passport number"
                                value={data.idPassportNo || ''}
                                onChange={(e) => onChange({ ...data, idPassportNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. NPWP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter NPWP number"
                                value={data.npwpNo || ''}
                                onChange={(e) => onChange({ ...data, npwpNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Jenis Kelamin <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.gender || ''}
                                onChange={(e) => onChange({ ...data, gender: e.target.value })}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="LAKI_LAKI">Laki-laki (Male)</option>
                                <option value="PEREMPUAN">Perempuan (Female)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Ibu Kandung <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter mother's name"
                                value={data.motherName || ''}
                                onChange={(e) => onChange({ ...data, motherName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Status Perkawinan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.maritalStatus || ''}
                                onChange={(e) => onChange({ ...data, maritalStatus: e.target.value })}
                                required
                            >
                                <option value="">Select marital status</option>
                                <option value="BELUM_KAWIN">Belum Kawin (Single)</option>
                                <option value="KAWIN">Kawin (Married)</option>
                                <option value="CERAI">Cerai (Divorced)</option>
                                <option value="JANDA_DUDA">Janda/Duda (Widow/Widower)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kewarganegaraan <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter nationality"
                                value={data.nationality || ''}
                                onChange={(e) => onChange({ ...data, nationality: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Address Information */}
                <h6 className="text-primary mb-3 mt-4">Alamat (Address)</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Jalan (Street Address) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kota (City) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter city"
                                value={data.addressCity || ''}
                                onChange={(e) => onChange({ ...data, addressCity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter postal code"
                                value={data.addressPostalCode || ''}
                                onChange={(e) => onChange({ ...data, addressPostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Contact Information */}
                <h6 className="text-primary mb-3 mt-4">Contact Information</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>No. Telepon Rumah (Home Telephone No.) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter home telephone number"
                                value={data.homeTelephoneNo || ''}
                                onChange={(e) => onChange({ ...data, homeTelephoneNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>No. Handphone (Handphone No.) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter handphone number"
                                value={data.handphoneNo || ''}
                                onChange={(e) => onChange({ ...data, handphoneNo: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. Faksimili Rumah</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter home fax number (optional)"
                                value={data.homeFaxNo || ''}
                                onChange={(e) => onChange({ ...data, homeFaxNo: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={data.personalEmail || ''}
                                onChange={(e) => onChange({ ...data, personalEmail: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Status and Purpose Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Status Kepemilikan Rumah (Home Ownership Status) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.homeOwnershipStatus || ''}
                                onChange={(e) => onChange({ ...data, homeOwnershipStatus: e.target.value })}
                                required
                            >
                                <option value="">Select home ownership status</option>
                                <option value="PRIBADI">Pribadi (Personal)</option>
                                <option value="KELUARGA">Keluarga (Family)</option>
                                <option value="SEWA_KONTRAK">Sewa/Kontrak (Lease/Contract)</option>
                                <option value="LAINNYA">Lainnya (Others)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Tujuan Pembukaan Rekening (Purpose of Account Opening) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.accountOpeningPurpose || ''}
                                onChange={(e) => onChange({ ...data, accountOpeningPurpose: e.target.value })}
                                required
                            >
                                <option value="">Select purpose</option>
                                <option value="LINDUNG_NILAI">Lindung Nilai (Hedging)</option>
                                <option value="KEUNTUNGAN">Keuntungan (Gains)</option>
                                <option value="SPEKULASI">Spekulasi (Speculation)</option>
                                <option value="LAINNYA">Lainnya (Others)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Experience Questions */}
                <h6 className="text-primary mb-3 mt-4">Experience Information</h6>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pengalaman Investasi (Investment Experience) <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Ya, Bidang (Yes, in)"
                                    name="investmentExperience"
                                    value="YA_BIDANG"
                                    checked={data.investmentExperience === 'YA_BIDANG'}
                                    onChange={(e) => onChange({ ...data, investmentExperience: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (None)"
                                    name="investmentExperience"
                                    value="TIDAK"
                                    checked={data.investmentExperience === 'TIDAK'}
                                    onChange={(e) => onChange({ ...data, investmentExperience: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Pengalaman Transaksi Perdagangan Berjangka (Futures Trading Transaction Experience) <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Ya (Yes)"
                                    name="futuresTradingExperience"
                                    value="YA"
                                    checked={data.futuresTradingExperience === 'YA'}
                                    onChange={(e) => onChange({ ...data, futuresTradingExperience: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (No)"
                                    name="futuresTradingExperience"
                                    value="TIDAK"
                                    checked={data.futuresTradingExperience === 'TIDAK'}
                                    onChange={(e) => onChange({ ...data, futuresTradingExperience: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Apakah Anda memiliki anggota keluarga yang bekerja di BAPPEBTI/Bursa/Berjangka/Kliring Berjangka? (Do you have any family working in BAPPEBTI / Bursa Berjangka / Kliring Berjangka?) <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Ya (Yes)"
                                    name="familyInBappebti"
                                    value="YA"
                                    checked={data.familyInBappebti === 'YA'}
                                    onChange={(e) => onChange({ ...data, familyInBappebti: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (No)"
                                    name="familyInBappebti"
                                    value="TIDAK"
                                    checked={data.familyInBappebti === 'TIDAK'}
                                    onChange={(e) => onChange({ ...data, familyInBappebti: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label>Apakah Anda telah dinyatakan pailit oleh Pengadilan? (Have you been declared bankrupt by the Court?) <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Ya (Yes)"
                                    name="declaredBankrupt"
                                    value="YA"
                                    checked={data.declaredBankrupt === 'YA'}
                                    onChange={(e) => onChange({ ...data, declaredBankrupt: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (No)"
                                    name="declaredBankrupt"
                                    value="TIDAK"
                                    checked={data.declaredBankrupt === 'TIDAK'}
                                    onChange={(e) => onChange({ ...data, declaredBankrupt: e.target.value })}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {/* EMERGENCY CONTACT PERSON */}
                <h5 className="text-primary mb-3 mt-5">PIHAK YANG DIHUBUNGI DALAM KEADAAN DARURAT</h5>
                <h6 className="text-secondary mb-3">EMERGENCY CONTACT PERSON</h6>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Lengkap <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter emergency contact full name"
                                value={data.emergencyContactName || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. Handphone (Handphone No.) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter emergency contact handphone"
                                value={data.emergencyContactHandphone || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactHandphone: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <h6 className="text-primary mb-3">Alamat (Address)</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Jalan (Street Name) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kota (City) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter emergency contact postal code"
                                value={data.emergencyContactPostalCode || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactPostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Hubungan dengan anda (Relationship) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactRelationship: e.target.value })}
                                required
                            >
                                <option value="">Select relationship</option>
                                <option value="PASANGAN">Pasangan (Spouse)</option>
                                <option value="KELUARGA">Keluarga (Family)</option>
                                <option value="ANAK">Anak (Child)</option>
                                <option value="LAINNYA">Lainnya (Others)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* DATA PEKERJAAN PENERIMA KUASA */}
                <h5 className="text-primary mb-3 mt-5">DATA PEKERJAAN PENERIMA KUASA (NON ORANG PERSEORANGAN)</h5>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Pekerjaan Penerima Kuasa (Job of Power of Attorney) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jobOfPowerOfAttorney || ''}
                                onChange={(e) => onChange({ ...data, jobOfPowerOfAttorney: e.target.value })}
                                required
                            >
                                <option value="">Select job</option>
                                <option value="SWASTA">Swasta (Private Employee)</option>
                                <option value="WIRASWASTA">Wiraswasta (Entrepreneur)</option>
                                <option value="IBU_RT">Ibu RT (Housewife)</option>
                                <option value="PROFESIONAL">Profesional</option>
                                <option value="ASN">ASN (Civil Servant)</option>
                                <option value="MAHASISWA">Mahasiswa (Student)</option>
                                <option value="LAINNYA">Lainnya (Others)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Nama Perusahaan Tempat Bekerja <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company name"
                                value={data.employmentCompanyName || ''}
                                onChange={(e) => onChange({ ...data, employmentCompanyName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Bidang Usaha <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter business field"
                                value={data.businessField || ''}
                                onChange={(e) => onChange({ ...data, businessField: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Jabatan (Position) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter position"
                                value={data.employmentPosition || ''}
                                onChange={(e) => onChange({ ...data, employmentPosition: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Lama Bekerja (Length of Work) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. 3 years, 2 months"
                                value={data.lengthOfWork || ''}
                                onChange={(e) => onChange({ ...data, lengthOfWork: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kantor Sebelumnya (Previous Company)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter previous company (optional)"
                                value={data.previousCompany || ''}
                                onChange={(e) => onChange({ ...data, previousCompany: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Office Address */}
                <h6 className="text-primary mb-3 mt-4">Alamat Kantor (Office Address)</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nama Jalan (Street Address) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter office street address"
                                value={data.officeStreetAddress || ''}
                                onChange={(e) => onChange({ ...data, officeStreetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Kota (City) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter office city"
                                value={data.officeCity || ''}
                                onChange={(e) => onChange({ ...data, officeCity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter office postal code"
                                value={data.officePostalCode || ''}
                                onChange={(e) => onChange({ ...data, officePostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '48px', display: 'flex', alignItems: 'end' }}>No. Telepon Kantor (Office Telephone No.) <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.officePhoneCountryCode || ''}
                                        onChange={(e) => onChange({ ...data, officePhoneCountryCode: e.target.value })}
                                        required
                                    >
                                        <option value="">Code</option>
                                        <option value="+62">+62 (ID)</option>
                                        <option value="+65">+65 (SG)</option>
                                        <option value="+60">+60 (MY)</option>
                                        <option value="+1">+1 (US/CA)</option>
                                        <option value="+44">+44 (UK)</option>
                                        <option value="+61">+61 (AU)</option>
                                        <option value="+91">+91 (IN)</option>
                                    </Form.Select>
                                </Col>
                                <Col md={8}>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter office phone number"
                                        value={data.officePhoneNo || ''}
                                        onChange={(e) => onChange({ ...data, officePhoneNo: e.target.value })}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>No. Faksimili (Optional)</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter office fax number (optional)"
                                value={data.officeFaxNo || ''}
                                onChange={(e) => onChange({ ...data, officeFaxNo: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* DAFTAR KEKAYAAN PENERIMA KUASA */}
                <h5 className="text-primary mb-3 mt-5">DAFTAR KEKAYAAN PENERIMA KUASA (NON ORANG PERSEORANGAN)</h5>
                <h6 className="text-secondary mb-3">LIST OF POWER OF ATTORNEY ASSETS</h6>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Penghasilan Pertahun (Annual Income) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.annualIncome || ''}
                                onChange={(e) => onChange({ ...data, annualIncome: e.target.value })}
                                required
                            >
                                <option value="">Select annual income</option>
                                <option value="100_250_JUTA">Antara 100 - 250 juta rupiah (Between 100 - 250 million rupiah)</option>
                                <option value="250_500_JUTA">Antara 250 - 500 juta rupiah (Between 250 - 500 million rupiah)</option>
                                <option value="ABOVE_500_JUTA">Di atas 500 juta rupiah (Above 500 million rupiah)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Lokasi rumah <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter house location"
                                value={data.houseLocation || ''}
                                onChange={(e) => onChange({ ...data, houseLocation: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Nilai NJOP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter NJOP value"
                                value={data.njopValue || ''}
                                onChange={(e) => onChange({ ...data, njopValue: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Bank Deposit <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter bank deposit amount"
                                value={data.bankDeposit || ''}
                                onChange={(e) => onChange({ ...data, bankDeposit: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Jumlah <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter total amount"
                                value={data.totalAmount || ''}
                                onChange={(e) => onChange({ ...data, totalAmount: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label style={{ minHeight: '24px', display: 'flex', alignItems: 'end' }}>Lainnya</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter other assets (optional)"
                                value={data.otherAssets || ''}
                                onChange={(e) => onChange({ ...data, otherAssets: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>


            </Form>
        </div>
    );
};

const PersonalDocumentUploadStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Personal Documents Upload</h4>
                <p className="text-muted fs-5">Upload all required personal documents for Power of Attorney</p>
            </div>

            <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">Required Personal Documents</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Rekening Koran / Tagihan Kartu Kredit (Current Account / Credit Card Statement) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, currentAccountFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Rekening Listrik / Telepon (Electricity / Phone Account) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, electricityPhoneAccountFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Foto Terkini (Photo Selfie) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, photoSelfiePersonalFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>KTP / SIM / Paspor (Identity No. / SIM / Passport) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, identityPassportPersonalFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>NPWP (Tax Identification No.) <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                            onChange={(e) => onChange({ ...data, npwpPersonalFile: e.target.files[0] })}
                            required 
                        />
                        <Form.Text className="text-muted">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
                    </Form.Group>
                </Card.Body>
            </Card>
        </div>
    );
};

const ReadStatementsStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // All required fields for validation
    const allRequiredFields = [
        'statementRead', 'statementUnderstanding', 'tradingExperience', 'brokerCompany',
        'experienceStatementRead', 'experienceUnderstanding',
        'applicationStatementRead', 'applicationUnderstanding',
        'mandateStatementRead', 'baktiArbitration', 'mandateUnderstanding',
        'tradingRulesRead', 'tradingRulesUnderstanding',
        'personalAccessPasswordRead', 'personalAccessPasswordUnderstanding'
    ];

    const isFieldMissing = (field) => !data[field];
    const hasValidationErrors = allRequiredFields.some(isFieldMissing);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Read Statements</h4>
                <p className="text-muted fs-5">Please review all required documents and provide confirmations</p>
            </div>

            {/* 1. Statement Of Having Simulation */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">1. Pernyataan Simulasi (Statement Of Having Simulation)</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Check
                        type="checkbox"
                        id="statement-read-check"
                        label="Baca Pernyataan Simulasi (Read)"
                        checked={data.statementRead || false}
                        onChange={(e) => onChange({ ...data, statementRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.statementRead && (
                        <div className="mb-3">
                            <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-company/Statement Of Having Simulation 240705.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                >
                                    <a href="/documents/kyc/indonesian-company/Statement Of Having Simulation 240705.pdf" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            </div>
                        </div>
                    )}

                    <Form.Check
                        type="checkbox"
                        id="statement-understanding"
                        checked={data.statementUnderstanding || false}
                        onChange={(e) => onChange({ ...data, statementUnderstanding: e.target.checked })}
                        required
                        label={
                            <>
                                Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                <a href="https://drive.google.com/file/d/1PGDTqhBAmi6Cz7eAbBKHQOSdKtpj9Paa/view" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                    Statement Of Having Simulation
                                </a>. <span className="text-danger">*</span>
                            </>
                        }
                        className="mb-3"
                    />

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-dark mb-2">Pengalaman Transaksi Perdagangan Berjangka <span className="text-danger">*</span></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check type="radio" name="tradingExperience" label="Ya (Yes)" value="ya" checked={data.tradingExperience === 'ya'} onChange={(e) => onChange({ ...data, tradingExperience: e.target.value })} required />
                            <Form.Check type="radio" name="tradingExperience" label="Tidak (No)" value="tidak" checked={data.tradingExperience === 'tidak'} onChange={(e) => onChange({ ...data, tradingExperience: e.target.value })} required />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-0">
                        <Form.Label className="fw-bold text-dark mb-2">Sebutkan Perusahaan Pialang <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="text" placeholder="Enter broker company name" value={data.brokerCompany || ''} onChange={(e) => onChange({ ...data, brokerCompany: e.target.value })} required />
                        <Form.Text className="text-muted">Broker Company</Form.Text>
                    </Form.Group>
                </Card.Body>
            </Card>

            {/* 2. Statement Of Having Experience */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">2. Pernyataan Pengalaman Transaksi (Statement Of Having Experience)</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Check
                        type="checkbox"
                        id="experience-statement-read-check"
                        label="Baca Pernyataan Pengalaman Melaksanakan Transaksi (Read)"
                        checked={data.experienceStatementRead || false}
                        onChange={(e) => onChange({ ...data, experienceStatementRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.experienceStatementRead && (
                        <div className="mb-3">
                            <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-company/Statement Of Having Experience 240705.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                >
                                    <a href="/documents/kyc/indonesian-company/Statement Of Having Experience 240705.pdf" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            </div>
                        </div>
                    )}

                    <Form.Check
                        type="checkbox"
                        id="experience-understanding"
                        checked={data.experienceUnderstanding || false}
                        onChange={(e) => onChange({ ...data, experienceUnderstanding: e.target.checked })}
                        required
                        label={
                            <>
                                Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                <a href="https://drive.google.com/file/d/1JvadBhz7u1hxHfd450AxNGfJgrAIltqK/view" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                    Statement Of Having Experience
                                </a>. <span className="text-danger">*</span>
                            </>
                        }
                    />
                </Card.Body>
            </Card>

            {/* 3. Account Opening Application */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">3. Aplikasi Pembukaan Rekening Transaksi (Account Opening Application)</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Check
                        type="checkbox"
                        id="application-statement-read-check"
                        label="Baca Pernyataan Aplikasi Pembukaan Rekening (Read)"
                        checked={data.applicationStatementRead || false}
                        onChange={(e) => onChange({ ...data, applicationStatementRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.applicationStatementRead && (
                        <div className="mb-3">
                            <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-company/Account Opening Application 240705.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                >
                                    <a href="/documents/kyc/indonesian-company/Account Opening Application 240705.pdf" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            </div>
                        </div>
                    )}

                    <Form.Check
                        type="checkbox"
                        id="application-understanding"
                        checked={data.applicationUnderstanding || false}
                        onChange={(e) => onChange({ ...data, applicationUnderstanding: e.target.checked })}
                        required
                        label={
                            <>
                                Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                <a href="https://drive.google.com/file/d/1EObNX-81BtgNtHoMOudHnLVW7H_taJBD/view" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                    Account Opening Application
                                </a>. <span className="text-danger">*</span>
                            </>
                        }
                    />
                </Card.Body>
            </Card>

            {/* 4. Mandate Agreement */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">4. Perjanjian Pemberian Amanat (Mandate Agreement)</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Check
                        type="checkbox"
                        id="mandate-statement-read-check"
                        label="Baca Perjanjian Pemberian Amanat (Read)"
                        checked={data.mandateStatementRead || false}
                        onChange={(e) => onChange({ ...data, mandateStatementRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.mandateStatementRead && (
                        <div className="mb-3">
                            <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-company/Mandate Agreement 240705.668b9a6b4b5142.20229176.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                >
                                    <a href="/documents/kyc/indonesian-company/Mandate Agreement 240705.668b9a6b4b5142.20229176.pdf" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            </div>
                        </div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold text-dark mb-2">Penyelesaian Perselisihan Melalui <span className="text-danger">*</span></Form.Label>
                        <Form.Check
                            type="checkbox"
                            id="bakti-arbitration"
                            label="Badan Arbitrase Perdagangan Berjangka Komoditi (BAKTI)"
                            checked={data.baktiArbitration || false}
                            onChange={(e) => onChange({ ...data, baktiArbitration: e.target.checked })}
                            required
                        />
                    </Form.Group>

                    <Form.Check
                        type="checkbox"
                        id="mandate-understanding"
                        checked={data.mandateUnderstanding || false}
                        onChange={(e) => onChange({ ...data, mandateUnderstanding: e.target.checked })}
                        required
                        label={
                            <>
                                Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                <a href="https://drive.google.com/file/d/17yKUIb_4AApa0bss2yS4BrfAFe0MSmB-/view" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                    Mandate Agreement
                                </a>. <span className="text-danger">*</span>
                            </>
                        }
                    />
                </Card.Body>
            </Card>

            {/* 5. Trading Rules */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">5. Peraturan Transaksi (Trading Rules)</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Check
                        type="checkbox"
                        id="trading-rules-read-check"
                        label="Baca Peraturan Transaksi (Read)"
                        checked={data.tradingRulesRead || false}
                        onChange={(e) => onChange({ ...data, tradingRulesRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.tradingRulesRead && (
                        <div className="mb-3">
                            <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-company/Trading Rules 240705.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                >
                                    <a href="/documents/kyc/indonesian-company/Trading Rules 240705.pdf" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            </div>
                        </div>
                    )}

                    <Form.Check
                        type="checkbox"
                        id="trading-rules-understanding"
                        checked={data.tradingRulesUnderstanding || false}
                        onChange={(e) => onChange({ ...data, tradingRulesUnderstanding: e.target.checked })}
                        required
                        label={
                            <>
                                Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                <a href="https://drive.google.com/file/d/1w9niLJCybNKHUfIkeNMy7wiiN1mu9gmK/view" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                    Trading Rules
                                </a>. <span className="text-danger">*</span>
                            </>
                        }
                    />
                </Card.Body>
            </Card>

            {/* 6. Personal Access Password */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">6. Kode Akses Transaksi Nasabah (Personal Access Password)</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Check
                        type="checkbox"
                        id="personal-access-password-read-check"
                        label="Baca Kode Akses Transaksi Nasabah (Read)"
                        checked={data.personalAccessPasswordRead || false}
                        onChange={(e) => onChange({ ...data, personalAccessPasswordRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.personalAccessPasswordRead && (
                        <div className="mb-3">
                            <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-company/Personal Access Password 240705.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                >
                                    <a href="/documents/kyc/indonesian-company/Personal Access Password 240705.pdf" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            </div>
                        </div>
                    )}

                    <Form.Check
                        type="checkbox"
                        id="personal-access-password-understanding"
                        checked={data.personalAccessPasswordUnderstanding || false}
                        onChange={(e) => onChange({ ...data, personalAccessPasswordUnderstanding: e.target.checked })}
                        required
                        label={
                            <>
                                Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                <a href="https://drive.google.com/file/d/1qebq2F6LPVQvDDxpukU7rY-uXlH4iIoU/view" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                    Personal Access Password
                                </a>. <span className="text-danger">*</span>
                            </>
                        }
                    />
                </Card.Body>
            </Card>

            {/* Validation Alert */}
            {hasValidationErrors && (
                <Alert variant="warning" className="mt-3">
                    <i className="mdi mdi-alert-outline me-2"></i>
                    Please complete all required fields before proceeding:
                    <ul className="mb-0 mt-2">
                        {isFieldMissing('statementRead') && <li>Read Statement Of Having Simulation</li>}
                        {isFieldMissing('statementUnderstanding') && <li>Confirm understanding of Statement Of Having Simulation</li>}
                        {isFieldMissing('tradingExperience') && <li>Select your trading experience</li>}
                        {isFieldMissing('brokerCompany') && <li>Enter broker company name</li>}
                        {isFieldMissing('experienceStatementRead') && <li>Read Statement Of Having Experience</li>}
                        {isFieldMissing('experienceUnderstanding') && <li>Confirm understanding of Statement Of Having Experience</li>}
                        {isFieldMissing('applicationStatementRead') && <li>Read Account Opening Application</li>}
                        {isFieldMissing('applicationUnderstanding') && <li>Confirm understanding of Account Opening Application</li>}
                        {isFieldMissing('mandateStatementRead') && <li>Read Mandate Agreement</li>}
                        {isFieldMissing('baktiArbitration') && <li>Select dispute resolution method (BAKTI)</li>}
                        {isFieldMissing('mandateUnderstanding') && <li>Confirm understanding of Mandate Agreement</li>}
                        {isFieldMissing('tradingRulesRead') && <li>Read Trading Rules</li>}
                        {isFieldMissing('tradingRulesUnderstanding') && <li>Confirm understanding of Trading Rules</li>}
                        {isFieldMissing('personalAccessPasswordRead') && <li>Read Personal Access Password</li>}
                        {isFieldMissing('personalAccessPasswordUnderstanding') && <li>Confirm understanding of Personal Access Password</li>}
                    </ul>
                </Alert>
            )}
        </div>
    );
};










const ReviewStep = ({ allData }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Review & Submit</h4>
                <p className="text-muted fs-5">Please review your information before submitting</p>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <h6 className="text-primary mb-3">Application Details</h6>
                    <Row>
                        <Col md={6}>
                            <p><strong>Account Type:</strong> Indonesian Company</p>
                            <p><strong>Status:</strong> Ready for submission</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Steps Completed:</strong> 7/7</p>
                            <p><strong>Documents Uploaded:</strong> Ready</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default IndonesianCompanyForm; 