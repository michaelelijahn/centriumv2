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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Nama Calon Nasabah Non-Orang Perseorangan (Nama Perusahaan) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>No. Izin Usaha <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Badan Usaha / Kegiatan <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">NPWP Perusahaan <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Alamat Perusahaan (Company Address) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Kota (City) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Tempat Pendirian Perusahaan <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Tanggal Pendirian Perusahaan <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Bentuk Hukum <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.legalForm || ''}
                                onChange={(e) => onChange({ ...data, legalForm: e.target.value, ...(e.target.value !== 'OTHER' && { legalFormOther: '' }) })}
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
                            {data.legalForm === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify the legal form"
                                    value={data.legalFormOther || ''}
                                    onChange={(e) => onChange({ ...data, legalFormOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. Telepon Kantor (Office Telephone No.) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Nama Beneficial Owner <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>No. KTP / SIM / Paspor Beneficial Owner <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Sumber Dana <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.sourceOfFunds || ''}
                                onChange={(e) => onChange({ ...data, sourceOfFunds: e.target.value, ...(e.target.value !== 'OTHER' && { sourceOfFundsOther: '' }) })}
                                required
                            >
                                <option value="">Select source of funds</option>
                                <option value="BUSINESS_PROFIT">Business Profit</option>
                                <option value="INVESTMENT">Investment</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="LOAN">Loan</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.sourceOfFunds === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify the source of funds"
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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Maksud dan Tujuan Pembukaan Rekening Transaksi yang akan Dilakukan Calon Nasabah <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.accountPurpose || ''}
                                onChange={(e) => onChange({ ...data, accountPurpose: e.target.value, ...(e.target.value !== 'OTHER' && { accountPurposeOther: '' }) })}
                                required
                            >
                                <option value="">Select account purpose</option>
                                <option value="HEDGING">Hedging</option>
                                <option value="SPECULATION">Speculation</option>
                                <option value="INVESTMENT">Investment</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.accountPurpose === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify the account purpose"
                                    value={data.accountPurposeOther || ''}
                                    onChange={(e) => onChange({ ...data, accountPurposeOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Authorization Information */}
                <h5 className="text-primary mb-3 mt-4">Authorization Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Nama Penerima Kuasa yang Menjalankan Transaksi <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Pihak yang berwenang melakukan Pendebetan <span className="text-danger">*</span></Form.Label>
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
                                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Bank <span className="text-danger">*</span></Form.Label>
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
                                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Cabang <span className="text-danger">*</span></Form.Label>
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
                                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Rekening <span className="text-danger">*</span></Form.Label>
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
                                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Account Holder Name <span className="text-danger">*</span></Form.Label>
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
                                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Bank Telephone No. <span className="text-danger">*</span></Form.Label>
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
                                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Jenis Rekening Bank (Bank Account Type) <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                value={account.bankAccountType}
                                                onChange={(e) => {
                                                    updateBankAccount(index, 'bankAccountType', e.target.value);
                                                    if (e.target.value !== 'LAINNYA') {
                                                        updateBankAccount(index, 'bankAccountTypeOther', '');
                                                    }
                                                }}
                                                required
                                            >
                                                <option value="">Select account type</option>
                                                <option value="GIRO">Giro</option>
                                                <option value="TABUNGAN">Tabungan (Savings)</option>
                                                <option value="LAINNYA">Lainnya (Others)</option>
                                            </Form.Select>
                                            {account.bankAccountType === 'LAINNYA' && (
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Please specify the bank account type"
                                                    value={account.bankAccountTypeOther || ''}
                                                    onChange={(e) => updateBankAccount(index, 'bankAccountTypeOther', e.target.value)}
                                                    className="mt-2"
                                                    required
                                                />
                                            )}
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
                        <Form.Label className="text-muted">Scan Anggaran Dasar Perusahaan (Scan Company's Articles of Association) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Scan Nomor Izin Usaha (Scan Certificate of Incorporation) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Laporan Keuangan / Deskripsi Kegiatan Usaha (Financial Statements / Description of Business Activities) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Struktur Manajemen (Management Structure) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Struktur Kepemilikan (Ownership Structure) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Spesimen Tanda Tangan Pihak Yang Melaksanakan Transaksi (Board of Resolution) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Surat Kuasa (Power of Attorney) <span className="text-danger">*</span></Form.Label>
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

                {/* PENERIMA KUASA (NON ORANG PERSEORANGAN) */}
                <h5 className="text-primary mb-3 mt-4">PENERIMA KUASA (NON ORANG PERSEORANGAN)</h5>
                <h6 className="text-secondary mb-3">EMPLOYMENT DATA OF AUTHORIZE PERSON</h6>
                
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Lengkap <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Tempat Lahir <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Tanggal Lahir <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. KTP / SIM / Paspor <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. NPWP <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Jenis Kelamin <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Ibu Kandung <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Status Perkawinan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.maritalStatus || ''}
                                onChange={(e) => onChange({ ...data, maritalStatus: e.target.value })}
                                required
                            >
                                <option value="">Select marital status</option>
                                <option value="BELUM_KAWIN">Lajang (Single)</option>
                                <option value="KAWIN">Kawin (Married)</option>
                                <option value="CERAI">Janda (Widow)</option>
                                <option value="JANDA_DUDA">Duda (Widower)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kewarganegaraan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.nationality || ''}
                                onChange={(e) => onChange({ ...data, nationality: e.target.value })}
                                required
                            >
                                <option value="">Select nationality</option>
                                <option value="US">United States</option>
                                <option value="UK">United Kingdom</option>
                                <option value="SG">Singapore</option>
                                <option value="MY">Malaysia</option>
                                <option value="AU">Australia</option>
                                <option value="CA">Canada</option>
                                <option value="ID">Indonesia</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.nationality === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other nationality"
                                    value={data.nationalityOther || ''}
                                    onChange={(e) => onChange({ ...data, nationalityOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Address Information */}
                <h6 className="text-primary mb-3 mt-4">Alamat (Address)</h6>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Jalan (Street Address) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kota (City) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Telepon Rumah (Home Telephone No.) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Handphone (Handphone No.) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Faksimili Rumah</Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Email <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Status Kepemilikan Rumah (Home Ownership Status) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.homeOwnershipStatus || ''}
                                onChange={(e) => onChange({ ...data, homeOwnershipStatus: e.target.value, ...(e.target.value !== 'LAINNYA' && { homeOwnershipStatusOther: '' }) })}
                                required
                            >
                                <option value="">Select home ownership status</option>
                                <option value="PRIBADI">Pribadi (Personal)</option>
                                <option value="KELUARGA">Keluarga (Family)</option>
                                <option value="SEWA_KONTRAK">Sewa/Kontrak (Lease/Contract)</option>
                                <option value="LAINNYA">Lainnya (Others)</option>
                            </Form.Select>
                            {data.homeOwnershipStatus === 'LAINNYA' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify the home ownership status"
                                    value={data.homeOwnershipStatusOther || ''}
                                    onChange={(e) => onChange({ ...data, homeOwnershipStatusOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Tujuan Pembukaan Rekening (Purpose of Account Opening) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.accountOpeningPurpose || ''}
                                onChange={(e) => onChange({ ...data, accountOpeningPurpose: e.target.value, ...(e.target.value !== 'LAINNYA' && { accountOpeningPurposeOther: '' }) })}
                                required
                            >
                                <option value="">Select purpose</option>
                                <option value="LINDUNG_NILAI">Lindung Nilai (Hedging)</option>
                                <option value="KEUNTUNGAN">Keuntungan (Gains)</option>
                                <option value="SPEKULASI">Spekulasi (Speculation)</option>
                                <option value="LAINNYA">Lainnya (Others)</option>
                            </Form.Select>
                            {data.accountOpeningPurpose === 'LAINNYA' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify the purpose of account opening"
                                    value={data.accountOpeningPurposeOther || ''}
                                    onChange={(e) => onChange({ ...data, accountOpeningPurposeOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Experience Questions */}
                <h6 className="text-primary mb-3 mt-4">Experience Information</h6>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Pengalaman Investasi (Investment Experience) <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Ya, Bidang (Yes, in)"
                                    name="investmentExperience"
                                    value="YA_BIDANG"
                                    checked={data.investmentExperience === 'YA_BIDANG'}
                                    onChange={(e) => onChange({ ...data, investmentExperience: e.target.value, ...(e.target.value !== 'YA_BIDANG' && { investmentExperienceExplanation: '' }) })}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (None)"
                                    name="investmentExperience"
                                    value="TIDAK"
                                    checked={data.investmentExperience === 'TIDAK'}
                                    onChange={(e) => onChange({ ...data, investmentExperience: e.target.value, ...(e.target.value !== 'YA_BIDANG' && { investmentExperienceExplanation: '' }) })}
                                />
                            </div>
                            {data.investmentExperience === 'YA_BIDANG' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Explain investment experience"
                                    value={data.investmentExperienceExplanation || ''}
                                    onChange={(e) => onChange({ ...data, investmentExperienceExplanation: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Pengalaman Transaksi Perdagangan Berjangka (Futures Trading Transaction Experience) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Apakah Anda memiliki anggota keluarga yang bekerja di BAPPEBTI/Bursa/Berjangka/Kliring Berjangka? (Do you have any family working in BAPPEBTI / Bursa Berjangka / Kliring Berjangka?) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted">Apakah Anda telah dinyatakan pailit oleh Pengadilan? (Have you been declared bankrupt by the Court?) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Lengkap <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Handphone (Handphone No.) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Jalan (Street Name) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kota (City) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Hubungan dengan anda (Relationship) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactRelationship: e.target.value, ...(e.target.value !== 'LAINNYA' && { emergencyContactRelationshipOther: '' }) })}
                                required
                            >
                                <option value="">Select relationship</option>
                                <option value="PASANGAN">Pasangan (Spouse)</option>
                                <option value="KELUARGA">Keluarga (Family)</option>
                                <option value="ANAK">Anak (Child)</option>
                                <option value="LAINNYA">Lainnya (Others)</option>
                            </Form.Select>
                            {data.emergencyContactRelationship === 'LAINNYA' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify the relationship"
                                    value={data.emergencyContactRelationshipOther || ''}
                                    onChange={(e) => onChange({ ...data, emergencyContactRelationshipOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* DATA PEKERJAAN PENERIMA KUASA */}
                <h5 className="text-primary mb-3 mt-5">DATA PEKERJAAN PENERIMA KUASA (NON ORANG PERSEORANGAN)</h5>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Pekerjaan Penerima Kuasa (Job of Power of Attorney) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jobOfPowerOfAttorney || ''}
                                onChange={(e) => onChange({ 
                                    ...data, 
                                    jobOfPowerOfAttorney: e.target.value, 
                                    ...(e.target.value !== 'LAINNYA' && { jobOfPowerOfAttorneyOther: '' }),
                                    // Clear employment fields if job type doesn't require them
                                    ...(!['SWASTA', 'WIRASWASTA', 'ASN'].includes(e.target.value) && {
                                        employmentCompanyName: '',
                                        businessField: '',
                                        employmentPosition: '',
                                        lengthOfWork: '',
                                        previousCompany: ''
                                    })
                                })}
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
                            {data.jobOfPowerOfAttorney === 'LAINNYA' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify the job of power of attorney"
                                    value={data.jobOfPowerOfAttorneyOther || ''}
                                    onChange={(e) => onChange({ ...data, jobOfPowerOfAttorneyOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Show employment details only for specific job types */}
                {['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney) && (
                    <>
                        <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Perusahaan Tempat Bekerja <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Bidang Usaha <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter business field"
                                value={data.businessField || ''}
                                onChange={(e) => onChange({ ...data, businessField: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                        </Row>

                        <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Jabatan (Position) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter position"
                                value={data.employmentPosition || ''}
                                onChange={(e) => onChange({ ...data, employmentPosition: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Lama Bekerja (Length of Work) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="e.g. 3 years, 2 months"
                                value={data.lengthOfWork || ''}
                                onChange={(e) => onChange({ ...data, lengthOfWork: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                        </Row>

                        <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kantor Sebelumnya (Previous Company) <span className="text-danger">*</span></Form.Label>
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
                        <h6 className="text-primary mt-4">Alamat Kantor (Office Address)</h6>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Jalan (Street Address) <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kota (City) <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kode Pos (Postal / Zip Code) <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Telepon Kantor (Office Telephone No.) <span className="text-danger">*</span></Form.Label>
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
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Faksimili (Optional)</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter office fax number (optional)"
                                        value={data.officeFaxNo || ''}
                                        onChange={(e) => onChange({ ...data, officeFaxNo: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                )}

                {/* DAFTAR KEKAYAAN PENERIMA KUASA */}
                <h5 className="text-primary mb-3 mt-5">DAFTAR KEKAYAAN PENERIMA KUASA (NON ORANG PERSEORANGAN)</h5>
                <h6 className="text-secondary mb-3">LIST OF POWER OF ATTORNEY ASSETS</h6>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Penghasilan Pertahun (Annual Income) <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Lokasi rumah <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nilai NJOP <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Bank Deposit <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Jumlah <span className="text-danger">*</span></Form.Label>
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Lainnya</Form.Label>
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
                        <Form.Label className="text-muted">Rekening Koran / Tagihan Kartu Kredit (Current Account / Credit Card Statement) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Rekening Listrik / Telepon (Electricity / Phone Account) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">Foto Terkini (Photo Selfie) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">KTP / SIM / Paspor (Identity No. / SIM / Passport) <span className="text-danger">*</span></Form.Label>
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
                        <Form.Label className="text-muted">NPWP (Tax Identification No.) <span className="text-danger">*</span></Form.Label>
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
    const baseRequiredFields = [
        'companyProfileRead', 'companyProfileUnderstanding',
        'statementRead', 'statementUnderstanding', 'tradingExperience',
        'experienceStatementRead', 'experienceUnderstanding',
        'applicationStatementRead', 'applicationUnderstanding',
        'riskDisclosureRead', 'riskDisclosureUnderstanding',
        'mandateStatementRead', 'baktiArbitration', 'mandateUnderstanding',
        'tradingRulesRead', 'tradingRulesUnderstanding',
        'personalAccessPasswordRead', 'personalAccessPasswordUnderstanding'
    ];

    // Add conditional fields based on trading experience
    const conditionalFields = data.tradingExperience === 'ya' ? ['brokerCompany', 'demoAccountNumber'] : [];
    
    // Add individual risk statement fields (only required when risk disclosure is read)
    const riskStatementFields = data.riskDisclosureRead ? [
        'riskStatement1', 'riskStatement2', 'riskStatement3', 'riskStatement4', 'riskStatement5',
        'riskStatement6', 'riskStatement7', 'riskStatement8', 'riskStatement9', 'riskStatement10',
        'riskStatement11', 'riskStatement12', 'riskStatement13', 'riskStatement14'
    ] : [];
    
    const allRequiredFields = [...baseRequiredFields, ...conditionalFields, ...riskStatementFields];

    const isFieldMissing = (field) => !data[field];
    const hasValidationErrors = allRequiredFields.some(isFieldMissing);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Read Statements</h4>
                <p className="text-muted fs-5">Please review all required documents and provide confirmations</p>
            </div>

            {/* 1. Company Profile */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">1. Profil Perusahaan PT.Genesis Gemilang Futures</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Check
                        type="checkbox"
                        id="company-profile-read-check"
                        label="Baca Profil Perusahaan PT. Genesis Gemilang Futures"
                        checked={data.companyProfileRead || false}
                        onChange={(e) => onChange({ ...data, companyProfileRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.companyProfileRead && (
                        <div className="mb-3">
                            <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-company/Company Profile 240705.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none' }}
                                >
                                    <a href="/documents/kyc/indonesian-company/Company Profile 240705.pdf" target="_blank" rel="noopener noreferrer">
                                        Download PDF
                                    </a>
                                </iframe>
                            </div>
                        </div>
                    )}

                    <Form.Check
                        type="checkbox"
                        id="company-profile-understanding"
                        checked={data.companyProfileUnderstanding || false}
                        onChange={(e) => onChange({ ...data, companyProfileUnderstanding: e.target.checked })}
                        required
                        label={
                            <>
                                Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                <a href="https://drive.google.com/file/d/your-company-profile-link" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                    COMPANY PROFILE PT. Genesis Gemilang Futures
                                </a>. <span className="text-danger">*</span>
                            </>
                        }
                    />
                </Card.Body>
            </Card>

            {/* 2. Statement Of Having Simulation */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">2. Pernyataan Simulasi (Statement Of Having Simulation)</h6>
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
                        <Form.Label className="text-muted fw-bold mb-2">Pengalaman Transaksi Perdagangan Berjangka <span className="text-danger">*</span></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check 
                                type="radio" 
                                name="tradingExperience" 
                                label="Ya (Yes)" 
                                value="ya" 
                                checked={data.tradingExperience === 'ya'} 
                                onChange={(e) => onChange({ 
                                    ...data, 
                                    tradingExperience: e.target.value,
                                    ...(e.target.value !== 'ya' && { brokerCompany: '', demoAccountNumber: '' })
                                })} 
                                required 
                            />
                            <Form.Check 
                                type="radio" 
                                name="tradingExperience" 
                                label="Tidak (No)" 
                                value="tidak" 
                                checked={data.tradingExperience === 'tidak'} 
                                onChange={(e) => onChange({ 
                                    ...data, 
                                    tradingExperience: e.target.value,
                                    ...(e.target.value !== 'ya' && { brokerCompany: '', demoAccountNumber: '' })
                                })} 
                                required 
                            />
                        </div>
                    </Form.Group>

                    {data.tradingExperience === 'ya' && (
                        <>
                            <Form.Group className="mb-3">
                        <Form.Label className="text-muted fw-bold mb-2">Sebutkan Perusahaan Pialang <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter broker company name" 
                                    value={data.brokerCompany || ''} 
                                    onChange={(e) => onChange({ ...data, brokerCompany: e.target.value })} 
                                    required 
                                />
                        <Form.Text className="text-muted">Broker Company</Form.Text>
                    </Form.Group>

                            <Form.Group className="mb-0">
                                <Form.Label className="text-muted fw-bold mb-2">No Demo Akun (Pengalaman Transaksi) <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter demo account number" 
                                    value={data.demoAccountNumber || ''} 
                                    onChange={(e) => onChange({ ...data, demoAccountNumber: e.target.value })} 
                                    required 
                                />
                                <Form.Text className="text-muted">Demo Account Number</Form.Text>
                            </Form.Group>
                        </>
                    )}
                </Card.Body>
            </Card>

            {/* 3. Statement Of Having Experience */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">3. Pernyataan Pengalaman Transaksi (Statement Of Having Experience)</h6>
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

            {/* 4. Account Opening Application */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">4. Aplikasi Pembukaan Rekening Transaksi (Account Opening Application)</h6>
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

            {/* 5. Risk Disclosure */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">5. Pemberitahuan Adanya Risiko (Risk Disclosure)</h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <p className="text-dark mb-3">
                            Dokumen Pemberitahuan Adanya Risiko ini disampaikan kepada Anda sesuai dengan Pasal 50 ayat (2) Undang-Undang Nomor 32 Tahun 1997 tentang Perdagangan Berjangka Komoditi sebagaimana diubah dengan Undang-Undang Nomor 10 Tahun 2011 tentang Perubahan Undang-Undang Nomor 32 Tahun 1997 tentang Perdagangan Berjangka Komoditi.
                        </p>
                        <p className="text-dark mb-3">
                            Maksud dokumen ini adalah memberitahukan bahwa kemungkinan kerugian atau keuntungan dalam perdagangan Kontrak Berjangka bisa mencapai jumlah yang sangat besar. Oleh karena itu, Anda harus berhati-hati dalam memutuskan untuk melakukan transaksi, apakah kondisi keuangan Anda mencukupi.
                        </p>
                    </div>

                    <Form.Check
                        type="checkbox"
                        id="risk-disclosure-read-check"
                        label="Baca Pemberitahuan Adanya Risiko (Read Risk Disclosure)"
                        checked={data.riskDisclosureRead || false}
                        onChange={(e) => onChange({ ...data, riskDisclosureRead: e.target.checked })}
                        className="fs-6 fw-bold mb-3"
                        required
                    />

                    {data.riskDisclosureRead && (
                        <div className="mb-4 border rounded p-4 bg-light">
                            <div className="mb-4">
                                <p className="fw-bold mb-3">1. Perdagangan Kontrak Berjangka belum tentu layak bagi semua investor. Anda dapat menderita kerugian dalam jumlah besar dan dalam jangka waktu singkat.</p>
                                <p className="mb-3">Jumlah kerugian uang dimungkinkan dapat melebihi jumlah uang yang pertama kali Anda setor (Margin awal) ke Pialang Berjangka Anda. Anda mungkin menderita kerugian seluruh Margin dan Margin tambahan yang ditempatkan pada Pialang Berjangka untuk mempertahankan posisi Kontrak Berjangka Anda. Hal ini disebabkan Perdagangan Berjangka sangat dipengaruhi oleh mekanisme leverage, dimana dengan jumlah investasi dalam bentuk yang relatif kecil dapat digunakan untuk membuka posisi dengan aset yang bernilai jauh lebih tinggi. Apabila Anda tidak siap dengan risiko seperti ini, sebaiknya Anda tidak melakukan perdagangan Kontrak Berjangka.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-1"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement1 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement1: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">2. Perdagangan Kontrak Berjangka mempunyai risiko dan mempunyai kemungkinan kerugian yang tidak terbatas yang jauh lebih besar dari jumlah uang yang disetor (Margin) ke Pialang Berjangka.</p>
                                <p className="mb-3">Kontrak Berjangka sama dengan produk keuangan lainnya yang mempunyai risiko tinggi, Anda sebaiknya tidak menaruh risiko terhadap dana yang Anda tidak siap untuk menderita rugi, seperti tabungan pensiun, dana kesehatan atau dana untuk keadaan darurat, dana yang disediakan untuk pendidikan atau kepemilikan rumah, dana yang diperoleh dari pinjaman pendidikan atau gadai, atau dana yang digunakan untuk memenuhi kebutuhan sehari-hari.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-2"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement2 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement2: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">3. Berhati-hatilah terhadap pernyataan bahwa Anda pasti mendapatkan keuntungan besar dari perdagangan Kontrak Berjangka.</p>
                                <p className="mb-3">Meskipun perdagangan Kontrak Berjangka dapat memberikan keuntungan yang besar dan cepat, namun hal tersebut tidak pasti, bahkan dapat menimbulkan kerugian yang besar dan cepat juga. Seperti produk keuangan lainnya, tidak ada yang dinamakan "pasti untung".</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-3"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement3 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement3: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">4. Disebabkan adanya mekanisme leverage dan sifat dari transaksi Kontrak Berjangka, Anda dapat merasakan dampak bahwa Anda menderita kerugian dalam waktu cepat.</p>
                                <p className="mb-3">Keuntungan maupun kerugian dalam transaksi Kontrak Berjangka akan langsung dikredit atau didebet ke rekening Anda, paling lambat secara harian. Apabila pergerakan di pasar terhadap Kontrak Berjangka menurunkan nilai posisi Anda dalam Kontrak Berjangka, Anda diwajibkan untuk menambah dana untuk pemenuhan kewajiban Margin ke Pialang Berjangka. Apabila rekening Anda berada dibawah minimum Margin yang telah ditetapkan Lembaga Kliring Berjangka atau Pialang Berjangka, maka posisi Anda dapat dilikuidasi pada saat rugi, dan Anda wajib menyelesaikan defisit (jika ada) dalam rekening Anda.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-4"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement4 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement4: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">5. Pada saat pasar dalam keadaan tertentu, Anda mungkin akan sulit atau tidak mungkin melikuidasi posisi.</p>
                                <p className="mb-3">Pada umumnya Anda harus melakukan transaksi offset jika ingin melikuidasi posisi dalam Kontrak Berjangka. Apabila Anda tidak dapat melikuidasi posisi Kontrak Berjangka, Anda tidak dapat merealisasikan keuntungan pada nilai posisi tersebut atau mencegah kerugian yang lebih tinggi. Kemungkinan tidak dapat melikuidasi dapat terjadi, antara lain: jika perdagangan dihentikan dikarenakan aktivitas perdagangan yang tidak lazim pada Kontrak Berjangka atau subjek Kontrak Berjangka, terjadi kerusakan sistem pada Bursa Berjangka atau Pialang Berjangka, atau posisi Anda berada dalam pasar yang tidak likuid. Bahkan apabila Anda dapat melikuidasi posisi tersebut, Anda mungkin terpaksa melakukannya pada harga yang menimbulkan kerugian besar.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-5"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement5 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement5: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">6. Pada saat pasar dalam keadaan tertentu, Anda mungkin akan sulit atau tidak mungkin mengelola risiko atas posisi terbuka Kontrak Berjangka dengan cara membuka posisi dengan nilai yang sama namun dengan posisi yang berlawanan dalam kontrak bulan yang berbeda, dalam pasar yang berbeda atau dalam "subjek Kontrak Berjangka" yang berbeda.</p>
                                <p className="mb-3">Kemungkinan untuk tidak dapat mengambil posisi dalam rangka membatasi risiko yang timbul, contohnya: jika perdagangan dihentikan pada pasar yang berbeda disebabkan aktivitas perdagangan yang tidak lazim pada Kontrak Berjangka atau "subjek Kontrak Berjangka".</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-6"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement6 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement6: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">7. Anda dapat diwajibkan untuk menyelesaikan Kontrak Berjangka dengan penyerahan fisik dari "subjek Kontrak Berjangka".</p>
                                <p className="mb-3">Jika Anda mempertahankan posisi penyerahan fisik dalam Kontrak Berjangka sampai hari terakhir perdagangan berdasarkan tanggal jatuh tempo Kontrak Berjangka, Anda akan diwajibkan menyerahkan atau menerima penyerahan "subjek Kontrak Berjangka" yang dapat mengakibatkan adanya penambahan biaya. Pengertian penyerahan dapat berbeda untuk suatu Kontrak Berjangka dengan Kontrak Berjangka lainnya atau suatu Bursa Berjangka dengan Bursa Berjangka lainnya. Anda harus melihat secara teliti mengenai penyerahan dan kondisi penyerahan sebelum membeli atau menjual Kontrak Berjangka.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-7"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement7 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement7: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">8. Anda dapat menderita kerugian yang disebabkan kegagalan sistem informasi.</p>
                                <p className="mb-3">Sebagaimana yang terjadi pada setiap transaksi keuangan, Anda dapat menderita kerugian jika amanat untuk melaksanakan transaksi Kontrak Berjangka tidak dapat dilakukan karena kegagalan sistem informasi di Bursa Berjangka, penyelenggara maupun sistem informasi di Pialang Berjangka yang mengelola posisi Anda. Kerugian Anda akan semakin besar jika Pialang Berjangka yang mengelola posisi Anda tidak memiliki sistem informasi cadangan atau prosedur yang layak.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-8"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement8 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement8: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">9. Semua Kontrak Berjangka mempunyai risiko, dan tidak ada strategi berdagang yang dapat menjamin untuk menghilangkan risiko tersebut.</p>
                                <p className="mb-3">Strategi dengan menggunakan kombinasi posisi seperti spread, dapat sama berisiko seperti posisi long atau short. Melakukan Perdagangan Berjangka memerlukan pengetahuan mengenai Kontrak Berjangka dan pasar berjangka.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-9"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement9 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement9: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">10. Strategi perdagangan harian dalam Kontrak Berjangka dan produk lainnya memiliki risiko khusus.</p>
                                <p className="mb-3">Seperti pada produk keuangan lainnya, pihak yang ingin membeli atau menjual Kontrak Berjangka yang sama dalam satu hari untuk mendapat keuntungan dari perubahan harga pada hari tersebut ("day traders") akan memiliki beberapa risiko tertentu antara lain jumlah komisi yang besar, risiko terkena efek pengungkit ("exposure to leverage"), dan persaingan dengan pedagang profesional. Anda harus mengerti risiko tersebut dan memiliki pengalaman yang memadai sebelum melakukan perdagangan harian ("day trading").</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-10"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement10 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement10: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">11. Menetapkan amanat bersyarat, seperti Kontrak Berjangka dilikuidasi pada keadaan tertentu untuk membatasi rugi (stop loss), mungkin tidak akan dapat membatasi kerugian Anda sampai jumlah tertentu saja.</p>
                                <p className="mb-3">Amanat bersyarat tersebut mungkin tidak dapat dilaksanakan karena terjadi kondisi pasar yang tidak memungkinkan melikuidasi Kontrak Berjangka.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-11"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement11 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement11: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">12. Anda harus membaca dengan seksama dan memahami Perjanjian Pemberian Amanat dengan Pialang Berjangka Anda sebelum melakukan transaksi Kontrak Berjangka.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-12"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement12 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement12: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">13. Pernyataan singkat ini tidak dapat memuat secara rinci seluruh risiko atau aspek penting lainnya tentang Perdagangan Berjangka.</p>
                                <p className="mb-3">Oleh karena itu Anda harus mempelajari kegiatan Perdagangan Berjangka secara cermat sebelum memutuskan melakukan transaksi.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-13"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement13 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement13: e.target.checked })}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <p className="fw-bold mb-3">14. Dokumen Pemberitahuan Adanya Risiko (Risk Disclosure) ini dibuat dan ditandatangani dalam Bahasa Indonesia.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-14"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement14 || false}
                                    onChange={(e) => onChange({ ...data, riskStatement14: e.target.checked })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="border rounded p-3 bg-light mb-3">
                        <h6 className="text-center fw-bold mb-3">PERNYATAAN MENERIMA PEMBERITAHUAN ADANYA RISIKO</h6>
                        <p className="text-center mb-3">
                            Dengan mengisi kolom "YA" di bawah, saya menyatakan bahwa saya telah menerima "DOKUMEN PEMBERITAHUAN ADANYA RISIKO" mengerti dan menyetujui isinya.
                        </p>
                        <Form.Check
                            type="checkbox"
                            id="risk-disclosure-understanding"
                            checked={data.riskDisclosureUnderstanding || false}
                            onChange={(e) => onChange({ ...data, riskDisclosureUnderstanding: e.target.checked })}
                            required
                            label={
                                <>
                                    Ya, Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                    <a href="/documents/kyc/indonesian-company/Risk Disclosure 240705.pdf" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                        Risk Disclosure
                                    </a>.<span className="text-danger">*</span>
                                </>
                            }
                            className="text-center"
                        />
                    </div>
                </Card.Body>
            </Card>

            {/* 6. Mandate Agreement */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">6. Perjanjian Pemberian Amanat (Mandate Agreement)</h6>
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
                        <Form.Label className="text-muted fw-bold mb-2">Penyelesaian Perselisihan Melalui <span className="text-danger">*</span></Form.Label>
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

            {/* 7. Trading Rules */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">7. Peraturan Transaksi (Trading Rules)</h6>
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

            {/* 8. Personal Access Password */}
            <Card className="border-primary mb-4">
                <Card.Header className="bg-light border-0 py-2">
                    <h6 className="mb-0 text-primary">8. Kode Akses Transaksi Nasabah (Personal Access Password)</h6>
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
                        {isFieldMissing('companyProfileRead') && <li>Read Company Profile PT. Genesis Gemilang Futures</li>}
                        {isFieldMissing('companyProfileUnderstanding') && <li>Confirm understanding of Company Profile PT. Genesis Gemilang Futures</li>}
                        {isFieldMissing('statementRead') && <li>Read Statement Of Having Simulation</li>}
                        {isFieldMissing('statementUnderstanding') && <li>Confirm understanding of Statement Of Having Simulation</li>}
                        {isFieldMissing('tradingExperience') && <li>Select your trading experience</li>}
                        {isFieldMissing('brokerCompany') && data.tradingExperience === 'ya' && <li>Enter broker company name</li>}
                        {isFieldMissing('demoAccountNumber') && data.tradingExperience === 'ya' && <li>Enter demo account number</li>}
                        {isFieldMissing('experienceStatementRead') && <li>Read Statement Of Having Experience</li>}
                        {isFieldMissing('experienceUnderstanding') && <li>Confirm understanding of Statement Of Having Experience</li>}
                        {isFieldMissing('applicationStatementRead') && <li>Read Account Opening Application</li>}
                        {isFieldMissing('applicationUnderstanding') && <li>Confirm understanding of Account Opening Application</li>}
                        {isFieldMissing('riskDisclosureRead') && <li>Read Risk Disclosure</li>}
                        {isFieldMissing('riskDisclosureUnderstanding') && <li>Confirm understanding of Risk Disclosure</li>}
                        {data.riskDisclosureRead && [1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(num => 
                            isFieldMissing(`riskStatement${num}`) && <li key={num}>Accept Risk Statement {num}</li>
                        ).filter(Boolean)}
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