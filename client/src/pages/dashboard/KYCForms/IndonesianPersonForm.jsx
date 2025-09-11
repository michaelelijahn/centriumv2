import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { useNotificationContext } from '../../../common/context/useNotificationContext';
import AuthService from '../../../common/api/auth';

const IndonesianPersonForm = () => {
    const [formData, setFormData] = useState({});
    const { showNotification } = useNotificationContext();

    // Steps for actual rendering logic
    const steps = [
        {
            title: "Requirements",
            description: "Document checklist"
        },
        {
            title: "Account Information",
            description: "Email and demo account setup"
        },
        {
            title: "Data Pribadi",
            description: "Personal information"
        },
        {
            title: "Emergency Contact",
            description: "Emergency contact details"
        },
        {
            title: "Data Pekerjaan",
            description: "Employment information"
        },
        {
            title: "Daftar Kekayaan",
            description: "Wealth information"
        },
        {
            title: "Rekening Bank",
            description: "Bank account details"
        },
        {
            title: "Document Upload",
            description: "Required documents"
        },
        {
            title: "Declaration",
            description: "Company profile acknowledgment"
        },
        {
            title: "Trading Simulation",
            description: "Trading simulation declaration"
        },
        {
            title: "Disclosure Statement",
            description: "Risk disclosure acknowledgment"
        },
        {
            title: "Risk Disclosure Document",
            description: "Detailed risk disclosure document"
        },
        {
            title: "Additional Disclosure Statement",
            description: "Additional disclosure acknowledgment"
        },
        {
            title: "Electronic Agreement",
            description: "Electronic power of attorney agreement"
        },
        {
            title: "Trading Rules",
            description: "PALN trading rules acknowledgment"
        },
        {
            title: "Fund Declaration",
            description: "Personal fund ownership declaration"
        },
        {
            title: "Access Code Responsibility",
            description: "Personal access password responsibility statement"
        },
        {
            title: "Process Verification",
            description: "Electronic customer acceptance process verification"
        }
    ];

    // Steps for progress display (Declaration and Trading Simulation combined)
    const progressSteps = [
        {
            title: "Requirements",
            description: "Document checklist"
        },
        {
            title: "Account Information",
            description: "Email and demo account setup"
        },
        {
            title: "Data Pribadi",
            description: "Personal information"
        },
        {
            title: "Emergency Contact",
            description: "Emergency contact details"
        },
        {
            title: "Data Pekerjaan",
            description: "Employment information"
        },
        {
            title: "Daftar Kekayaan",
            description: "Wealth information"
        },
        {
            title: "Rekening Bank",
            description: "Bank account details"
        },
        {
            title: "Document Upload",
            description: "Required documents"
        },
        {
            title: "Declaration",
            description: "Company profile acknowledgment and trading simulation"
        },
        {
            title: "Review & Submit",
            description: "Final review"
        }
    ];

    // Document requirements for Indonesian Person registration
    const documentRequirements = [
        {
            category: "Dokumen yang dilampirkan",
            documents: [
                "Rekening Koran / Tagihan Kartu Kredit",
                "Rekening Listrik / Telepon", 
                "Foto Terkini",
                "Identify No. (KTP)",
                "NPWP"
            ]
        }
    ];

    const renderStep = ({ currentStep, formData: stepData, updateFormData, allFormData = {} }) => {
        // Flatten all form data from all steps into a single object
        const flattenedData = Object.values(allFormData).reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});

        switch (currentStep) {
            case 0:
                return <RequirementsStep requirements={documentRequirements} />;
            case 1:
                return <AccountInformationStep data={stepData} onChange={updateFormData} />;
            case 2:
                return <DataPribadiStep data={stepData} onChange={updateFormData} />;
            case 3:
                return <EmergencyContactStep data={stepData} onChange={updateFormData} />;
            case 4:
                return <DataPekerjaanStep data={stepData} onChange={updateFormData} />;
            case 5:
                return <DaftarKekayaanStep data={stepData} onChange={updateFormData} />;
            case 6:
                return <RekeningBankStep data={stepData} onChange={updateFormData} />;
            case 7:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} />;
            case 8:
                return <DeclarationStep data={stepData} onChange={updateFormData} />;
            case 9:
                return <TradingSimulationDeclaration data={stepData} onChange={updateFormData} allData={allFormData} />;
            case 10:
                return <DisclosureStatementStep data={stepData} onChange={updateFormData} />;
            case 11:
                return <RiskDisclosureDocumentStep data={stepData} onChange={updateFormData} />; 
            case 12:
                return <AdditionalDisclosureStatementStep data={stepData} onChange={updateFormData} />;
            case 13:
                return <ElectronicAgreementStep data={stepData} onChange={updateFormData} />;
            case 14:
                return <TradingRulesStep data={stepData} onChange={updateFormData} />;
            case 15:
                return <NewFundDeclarationStep data={stepData} onChange={updateFormData} allData={allFormData} />;
            case 16:
                return <AccessCodeResponsibilityStep data={stepData} onChange={updateFormData} allData={allFormData} />;
            case 17:
                return <FundDeclarationStep data={stepData} onChange={updateFormData} allData={allFormData} />;
            case 18:
                return <ProcessVerificationStep data={stepData} onChange={updateFormData} allData={allFormData} />;
            default:
                return <RequirementsStep requirements={documentRequirements} />;
        }
    };

    // Validation functions for each step
    const validateStep = (stepIndex, stepData, allData) => {
        switch (stepIndex) {
            case 0: // Requirements step - always valid (just informational)
                return { isValid: true, errors: [] };
            
            case 1: // Account Information step
                return validateAccountInformationStep(stepData);
            
            case 2: // Data Pribadi step
                return validateDataPribadiStep(stepData);
            
            case 3: // Emergency Contact step
                return validateEmergencyContactStep(stepData);
            
            case 4: // Data Pekerjaan step
                return validateDataPekerjaanStep(stepData);
            
            case 5: // Daftar Kekayaan step
                return validateDaftarKekayaanStep(stepData);
            
            case 6: // Rekening Bank step
                return validateRekeningBankStep(stepData);
            
            case 7: // Document Upload step
                return validateDocumentUploadStep(stepData);
            
            case 8: // Declaration step
                return validateDeclarationStep(stepData);
            
            case 9: // Trading Simulation step
                return validateTradingSimulationStep(stepData);
            
            case 10: // Disclosure Statement step
                return validateDisclosureStatementStep(stepData);
            
            case 11: // Risk Disclosure Document step
                return validateRiskDisclosureDocumentStep(stepData);
            
            case 12: // Additional Disclosure Statement step
                return validateAdditionalDisclosureStep(stepData);
            
            case 13: // Electronic Agreement step
                return validateElectronicAgreementStep(stepData);
            
            case 14: // Trading Rules step
                return validateTradingRulesStep(stepData);
            
            case 15: // New Fund Declaration step  
                return validateNewFundDeclarationStep(stepData);
            
            case 16: // Access Code Responsibility step
                return validateAccessCodeResponsibilityStep(stepData);
            
            case 17: // Fund Declaration step
                return validateFundDeclarationStep(stepData);
            
            case 18: // Process Verification step
                return validateProcessVerificationStep(stepData);
            
            default:
                return { isValid: true, errors: [] };
        }
    };

    const validateAccountInformationStep = (data) => {
        const errors = [];
        
        if (!data.email?.trim()) {
            errors.push('Email address is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.demoAccountNo?.trim()) {
            errors.push('Demo account selection is required');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDataPribadiStep = (data) => {
        const errors = [];
        const requiredFields = [
            { field: 'namaLengkap', label: 'Nama Lengkap' },
            { field: 'tempatLahir', label: 'Tempat Lahir' },
            { field: 'tanggalLahir', label: 'Tanggal Lahir' },
            { field: 'noKTP', label: 'No. KTP' },
            { field: 'noNPWP', label: 'No. NPWP' },
            { field: 'jenisKelamin', label: 'Jenis Kelamin' },
            { field: 'namaIbuKandung', label: 'Nama Ibu Kandung' },
            { field: 'statusPerkawinan', label: 'Status Perkawinan' },
            { field: 'streetAddress', label: 'Street Address' },
            { field: 'city', label: 'City' },
            { field: 'postalCode', label: 'Postal Code' },
            { field: 'noHandphone', label: 'No. Handphone' },
            { field: 'statusKepemilikanRumah', label: 'Status Kepemilikan Rumah' },
            { field: 'tujuanPembukaanRekening', label: 'Tujuan Pembukaan Rekening' },
            { field: 'pengalamanInvestasi', label: 'Pengalaman Investasi' },
            { field: 'anggotaKeluargaBAPPEBTI', label: 'Anggota Keluarga BAPPEBTI' },
            { field: 'pernahPailit', label: 'Pernah Pailit' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });
        
        // Check conditional fields
        if (data.statusPerkawinan === 'Married' && !data.namaIstriSuami?.trim()) {
            errors.push('Nama Istri/Suami is required when married');
        }
        
        if (data.statusKepemilikanRumah === 'Lainnya' && !data.statusKepemilikanRumahOther?.trim()) {
            errors.push('Please specify other home ownership status');
        }
        
        if (data.tujuanPembukaanRekening === 'Lainnya' && !data.tujuanPembukaanRekeningOther?.trim()) {
            errors.push('Please specify other account opening purpose');
        }
        
        if (data.pengalamanInvestasi === 'Ya, di bidang' && !data.pengalamanInvestasiBidang?.trim()) {
            errors.push('Please provide details about your investment experience');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateEmergencyContactStep = (data) => {
        const errors = [];
        const requiredFields = [
            { field: 'emergencyContactName', label: 'Emergency Contact Name' },
            { field: 'emergencyContactPhone', label: 'Emergency Contact Phone' },
            { field: 'emergencyContactStreetAddress', label: 'Emergency Contact Street Address' },
            { field: 'emergencyContactCity', label: 'Emergency Contact City' },
            { field: 'emergencyContactPostalCode', label: 'Emergency Contact Postal Code' },
            { field: 'emergencyContactRelationship', label: 'Emergency Contact Relationship' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });
        
        // Check conditional fields
        if (data.emergencyContactRelationship === 'Lainnya' && !data.emergencyContactRelationshipOther?.trim()) {
            errors.push('Please specify other relationship');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDataPekerjaanStep = (data) => {
        const errors = [];
        
        // Check for jenisPekerjaan (employment type in Indonesian form)
        if (!data.jenisPekerjaan?.trim()) {
            errors.push('Jenis Pekerjaan is required');
        }
        
        // If "Lainnya" (Other) is selected, check if other field is filled
        if (data.jenisPekerjaan === 'Lainnya' && !data.jenisPekerjaanOther?.trim()) {
            errors.push('Please specify other employment type');
        }
        
        // If employment type requires company details, validate those fields
        if (data.jenisPekerjaan === 'Swasta' || data.jenisPekerjaan === 'Wiraswasta' || 
            data.jenisPekerjaan === 'Profesional' || data.jenisPekerjaan === 'ASN') {
            
            const employmentFields = [
                { field: 'namaPerusahaan', label: 'Nama Perusahaan' },
                { field: 'bidangUsaha', label: 'Bidang Usaha' },
                { field: 'jabatan', label: 'Jabatan' },
                { field: 'lamaBekerja', label: 'Lama Bekerja' },
                { field: 'kantorSebelumnya', label: 'Kantor Sebelumnya' },
                { field: 'alamatKantor', label: 'Alamat Kantor' },
                { field: 'kotaKantor', label: 'Kota Kantor' },
                { field: 'postalCodeKantor', label: 'Postal Code Kantor' },
                { field: 'noTeleponKantor', label: 'No. Telepon Kantor' }
            ];
            
            employmentFields.forEach(({ field, label }) => {
                if (!data[field]?.trim()) {
                    errors.push(`${label} is required`);
                }
            });
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDaftarKekayaanStep = (data) => {
        const errors = [];
        
        // Only check required field: penghasilanPertahun (annual income)
        if (!data.penghasilanPertahun?.trim()) {
            errors.push('Penghasilan Pertahun is required');
        }
        
        // Other fields (lokasiRumah, nilaiNJOP, bankDeposit, jumlah, lainnya) are optional
        
        return { isValid: errors.length === 0, errors };
    };

    const validateRekeningBankStep = (data) => {
        const errors = [];
        
        if (!data.bankAccounts || data.bankAccounts.length === 0) {
            errors.push('At least one bank account is required');
        } else {
            data.bankAccounts.forEach((account, index) => {
                const bankRequiredFields = [
                    { field: 'namaBank', label: `Bank ${index + 1} - Nama Bank` },
                    { field: 'cabang', label: `Bank ${index + 1} - Cabang` },
                    { field: 'noRekening', label: `Bank ${index + 1} - No. Rekening` },
                    { field: 'namaPemilikRekening', label: `Bank ${index + 1} - Nama Pemilik Rekening` },
                    { field: 'bankAccountType', label: `Bank ${index + 1} - Jenis Rekening Bank` }
                ];
                
                bankRequiredFields.forEach(({ field, label }) => {
                    if (!account[field]?.trim()) {
                        errors.push(`${label} is required`);
                    }
                });
                
                // If "LAINNYA" (Other) is selected for bank account type, check the other field
                if (account.bankAccountType === 'LAINNYA' && !account.bankAccountTypeOther?.trim()) {
                    errors.push(`Bank ${index + 1} - Please specify other account type`);
                }
            });
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDocumentUploadStep = (data) => {
        const errors = [];
        
        // List of required documents for Indonesian Person
        const requiredDocuments = [
            "Rekening Koran / Tagihan Kartu Kredit",
            "Rekening Listrik / Telepon", 
            "Foto Terkini",
            "Identify No. (KTP)",
            "NPWP"
        ];
        
        // Check if uploadedFiles exists
        if (!data.uploadedFiles) {
            errors.push('Please upload all required documents before proceeding');
            return { isValid: false, errors };
        }
        
        // Check each required document
        const missingDocuments = [];
        requiredDocuments.forEach(docName => {
            if (!data.uploadedFiles[docName] || !data.uploadedFiles[docName].name) {
                missingDocuments.push(docName);
            }
        });
        
        if (missingDocuments.length > 0) {
            errors.push(`Missing required documents: ${missingDocuments.join(', ')}`);
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDeclarationStep = (data) => {
        const errors = [];
        
        // Check if the declaration radio button is set to "ya" (Yes)
        if (!data.declaration) {
            errors.push('Please acknowledge the company profile agreement by selecting "Ya"');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateTradingSimulationStep = (data) => {
        const errors = [];
        
        // Check if the trading simulation radio button is set to "ya" (Yes)
        if (!data.tradingSimulation) {
            errors.push('Please acknowledge the trading simulation agreement by selecting "Ya"');
        }
        
        // Check if trading experience is selected
        if (!data.tradingExperience) {
            errors.push('Trading experience information is required');
        }
        
        // If has experience, validate additional fields
        if (data.tradingExperience === 'ya') {
            if (!data.brokerCompany?.trim()) {
                errors.push('Previous broker company name is required');
            }
            if (!data.demoAccountNumber?.trim()) {
                errors.push('Previous demo account number is required');
            }
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDisclosureStatementStep = (data) => {
        const errors = [];
        
        // Check if the disclosure statement radio button is set to "ya" (Yes)
        if (!data.disclosureStatement) {
            errors.push('Please acknowledge the disclosure statement by selecting "Ya"');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateRiskDisclosureDocumentStep = (data) => {
        const errors = [];

        const requiredRiskStatements = [
            'point1', 'point2', 'point3', 'point4', 'point5',
            'point6', 'point7', 'point8', 'point9', 'point10',
            'point11', 'point12', 'point13', 'point14'
        ];
        
        requiredRiskStatements.forEach((statement, index) => {
            if (!data[statement]) {
                errors.push(`Please acknowledge risk statement ${index + 1}`);
            }
        });
        
        return { isValid: errors.length === 0, errors };
    };

    const validateAdditionalDisclosureStep = (data) => {
        const errors = [];
        
        if (!data.additionalDisclosureStatement) {
            errors.push('Please acknowledge the additional disclosure statement');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateElectronicAgreementStep = (data) => {
        const errors = [];
        
        if (!data.electronicAgreement) {
            errors.push('Please acknowledge the electronic power of attorney agreement');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateTradingRulesStep = (data) => {
        const errors = [];
        
        if (!data.tradingRulesAcceptance) {
            errors.push('Please acknowledge the PALN trading rules');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateNewFundDeclarationStep = (data) => {
        const errors = [];
        
        if (data.newFundDeclarationAcceptance !== 'yes') {
            errors.push('Please acknowledge the personal fund ownership declaration by selecting "Ya"');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateFundDeclarationStep = (data) => {
        const errors = [];
        
        if (data.fundDeclarationAcceptance !== 'yes') {
            errors.push('Please acknowledge the fund declaration by selecting "Ya"');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateAccessCodeResponsibilityStep = (data) => {
        const errors = [];
        
        if (!data.accessCodeResponsibilityAcceptance) {
            errors.push('Please acknowledge the personal access password responsibility statement');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateProcessVerificationStep = (data) => {
        const errors = [];
        
        if (!data.processVerificationAgreement) {
            errors.push('Please acknowledge the electronic customer acceptance process verification');
        }
        
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

    const handleSubmit = async (allFormData) => {
        try {
            console.log('Submitting Indonesian Person KYC:', allFormData);
            
            // Show loading notification
            showNotification({
                title: 'Processing',
                message: 'Submitting your KYC application...',
                type: 'info'
            });
            
            // Flatten all form data from all steps
            const flattenedData = Object.values(allFormData).reduce((acc, curr) => {
                return { ...acc, ...curr };
            }, {});
            
            console.log('Flattened data before submission:', flattenedData);
            
            // Create FormData object to handle file uploads
            const formData = new FormData();
            
            // Add all form fields to FormData
            Object.keys(flattenedData).forEach(key => {
                const value = flattenedData[key];
                
                // Handle file uploads
                if (key === 'uploadedFiles' && value) {
                    Object.keys(value).forEach(fileName => {
                        const fileData = value[fileName];
                        if (fileData && fileData.file instanceof File) {
                            formData.append('files', fileData.file);
                            formData.append(`fileMetadata_${fileName}`, JSON.stringify({
                                documentType: fileName,
                                originalName: fileData.name
                            }));
                        }
                    });
                } else if (value !== null && value !== undefined && value !== '') {
                    // Handle array data (like bank accounts)
                    if (Array.isArray(value)) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });
            
            // Log FormData contents for debugging
            for (let [key, value] of formData.entries()) {
                console.log(`FormData: ${key}:`, value);
            }
            
            // Submit using AuthService (same pattern as other forms)
            const response = await AuthService.submitIndonesianPersonKYC(formData);
            
            if (response.success) {
                showNotification({
                    title: 'Success',
                    message: `Indonesian Person KYC submitted successfully! Application Reference: ${response.data.applicationReference || response.data.applicationId}`,
                    type: 'success'
                });
                
                console.log('Submission successful:', response);
                
                // Optionally clear the form
                setFormData({});
            } else {
                throw new Error(response.message || 'Submission failed');
            }
            
        } catch (error) {
            console.error('Error submitting Indonesian Person KYC:', error);
            
            showNotification({
                title: 'Submission Failed',
                message: error.message || 'An error occurred while submitting your Indonesian Person KYC application. Please try again.',
                type: 'error'
            });
        }
    };

    // Function to map current step to progress step
    const getProgressStep = (currentStep) => {
        if (currentStep >= 8 && currentStep <= 10) {
            return 8; // Declaration (8), Trading Simulation (9), and Disclosure Statement (10) show as Declaration in progress
        } else if (currentStep >= 11) {
            return 9; // Review & Submit step shows as step 9 in progress (0-indexed)
        }
        return currentStep;
    };

    return (
        <MultiStepFormWrapper
            accountType="Indonesian Person"
            steps={progressSteps}
            actualSteps={steps}
            getProgressStep={getProgressStep}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
            onStepValidation={handleStepValidation}
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

        <Row className="justify-content-center">
            {requirements.map((category, index) => (
                <Col md={8} lg={6} key={index} className="mb-4">
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

const AccountInformationStep = ({ data = {}, onChange }) => {
    const [email, setEmail] = useState(data.email || '');
    const [demoAccountNo, setDemoAccountNo] = useState(data.demoAccountNo || '');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        if (field === 'email') setEmail(value);
        if (field === 'demoAccountNo') setDemoAccountNo(value);
        onChange(newData);
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Account Information</h4>
                <p className="text-muted fs-5">Please provide your email address and select a demo account</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Email Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Select Demo Account No. <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={demoAccountNo}
                                onChange={(e) => handleChange('demoAccountNo', e.target.value)}
                                required
                            >
                                <option value="">Select demo account...</option>
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

const DataPribadiStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Data Pribadi</h4>
                <p className="text-muted fs-5">Please provide your personal information</p>
            </div>

                    <Form>
                {/* Basic Personal Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Nama Lengkap <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={data.namaLengkap || ''}
                                onChange={(e) => onChange({ ...data, namaLengkap: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Tempat Lahir <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Place of birth"
                                value={data.tempatLahir || ''}
                                onChange={(e) => onChange({ ...data, tempatLahir: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Tanggal Lahir <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.tanggalLahir || ''}
                                onChange={(e) => onChange({ ...data, tanggalLahir: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. KTP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your KTP number"
                                value={data.noKTP || ''}
                                onChange={(e) => onChange({ ...data, noKTP: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. NPWP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your NPWP number"
                                value={data.noNPWP || ''}
                                onChange={(e) => onChange({ ...data, noNPWP: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Jenis Kelamin <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jenisKelamin || ''}
                                onChange={(e) => onChange({ ...data, jenisKelamin: e.target.value })}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Nama Ibu Kandung <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Mother's full name"
                                value={data.namaIbuKandung || ''}
                                onChange={(e) => onChange({ ...data, namaIbuKandung: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Status Perkawinan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.statusPerkawinan || ''}
                                onChange={(e) => onChange({ ...data, statusPerkawinan: e.target.value })}
                                required
                            >
                                <option value="">Select Marital Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Conditional Spouse Name Field */}
                {data.statusPerkawinan === 'Married' && (
                    <Row>
                        <Col md={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted">Nama Istri / Suami <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Spouse's full name"
                                    value={data.namaIstriSuami || ''}
                                    onChange={(e) => onChange({ ...data, namaIstriSuami: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                )}

                {/* Address Information */}
                <Row>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Street address"
                                value={data.streetAddress || ''}
                                onChange={(e) => onChange({ ...data, streetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={data.city || ''}
                                onChange={(e) => onChange({ ...data, city: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Postal/Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Postal code"
                                value={data.postalCode || ''}
                                onChange={(e) => onChange({ ...data, postalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Contact Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. Telephone Rumah (Optional)</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Home phone number"
                                value={data.noTelephoneRumah || ''}
                                onChange={(e) => onChange({ ...data, noTelephoneRumah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. Handphone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Mobile phone number"
                                value={data.noHandphone || ''}
                                onChange={(e) => onChange({ ...data, noHandphone: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. Faksimili Rumah (Optional)</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Home fax number"
                                value={data.noFaksimiliRumah || ''}
                                onChange={(e) => onChange({ ...data, noFaksimiliRumah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Status Kepemilikan Rumah <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.statusKepemilikanRumah || ''}
                                onChange={(e) => onChange({ ...data, statusKepemilikanRumah: e.target.value })}
                                required
                            >
                                <option value="">Select House Ownership Status</option>
                                <option value="Pribadi">Pribadi</option>
                                <option value="Keluarga">Keluarga</option>
                                <option value="Sewa/Kontrak">Sewa/Kontrak</option>
                                <option value="Lainnya">Lainnya</option>
                            </Form.Select>
                            {data.statusKepemilikanRumah === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan status kepemilikan rumah lainnya"
                                    value={data.statusKepemilikanRumahOther || ''}
                                    onChange={(e) => onChange({ ...data, statusKepemilikanRumahOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Additional Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Tujuan Pembukaan Rekening <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.tujuanPembukaanRekening || ''}
                                onChange={(e) => onChange({ ...data, tujuanPembukaanRekening: e.target.value })}
                                required
                            >
                                <option value="">Select Account Purpose</option>
                                <option value="Lindung Nilai">Lindung Nilai</option>
                                <option value="Keuntungan">Keuntungan</option>
                                <option value="Spekulasi">Spekulasi</option>
                                <option value="Lainnya">Lainnya</option>
                            </Form.Select>
                            {data.tujuanPembukaanRekening === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan tujuan pembukaan rekening lainnya"
                                    value={data.tujuanPembukaanRekeningOther || ''}
                                    onChange={(e) => onChange({ ...data, tujuanPembukaanRekeningOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Pengalaman Investasi <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.pengalamanInvestasi || ''}
                                onChange={(e) => onChange({ ...data, pengalamanInvestasi: e.target.value })}
                                required
                            >
                                <option value="">Select Investment Experience</option>
                                <option value="Yes">Yes</option>
                                <option value="None">None</option>
                            </Form.Select>
                            {data.pengalamanInvestasi === 'Yes' && (
                                <div className="mt-2">
                                    <Form.Label className="text-muted">Pengalaman Investasi Bidang <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Explain Investment Experience"
                                        value={data.pengalamanInvestasiBidang || ''}
                                        onChange={(e) => onChange({ ...data, pengalamanInvestasiBidang: e.target.value })}
                                        required
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Compliance Questions */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Apakah Anda memiliki anggota keluarga yang bekerja di BAPPEBTI / Bursa Berjangka / Kliring Berjangka? <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.anggotaKeluargaBAPPEBTI || ''}
                                onChange={(e) => onChange({ ...data, anggotaKeluargaBAPPEBTI: e.target.value })}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                            {data.anggotaKeluargaBAPPEBTI === 'Yes' && (
                                <div className="mt-2">
                                    <small className="text-danger">Anda tidak dapat melanjutkan jika pilih Ya (Yes)</small>
                                </div>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '48px' }}>Apakah Anda telah dinyatakan pailit oleh Pengadilan? <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.pernahPailit || ''}
                                onChange={(e) => onChange({ ...data, pernahPailit: e.target.value })}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                            {data.pernahPailit === 'Yes' && (
                                <div className="mt-2">
                                    <small className="text-danger">Anda tidak dapat melanjutkan jika pilih Ya (Yes)</small>
                                </div>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const EmergencyContactStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Pihak yang dihubungi dalam keadaan darurat</h4>
                <p className="text-muted fs-5">Emergency contact information</p>
            </div>

            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Nama Lengkap <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Emergency contact full name"
                                value={data.emergencyContactName || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactName: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. Handphone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Emergency contact phone number"
                                value={data.emergencyContactPhone || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactPhone: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Emergency contact street address"
                                value={data.emergencyContactStreetAddress || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactStreetAddress: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={data.emergencyContactCity || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactCity: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Postal/Zip Code <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Postal code"
                                value={data.emergencyContactPostalCode || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactPostalCode: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Hubungan dengan Anda <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => onChange({ ...data, emergencyContactRelationship: e.target.value })}
                                required
                            >
                                <option value="">Select Relationship</option>
                                <option value="Pasangan">Pasangan (Spouse)</option>
                                <option value="Keluarga">Keluarga (Family)</option>
                                <option value="Anak">Anak (Child)</option>
                                <option value="Lainnya">Lainnya (Other)</option>
                            </Form.Select>
                            {data.emergencyContactRelationship === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan hubungan lainnya"
                                    value={data.emergencyContactRelationshipOther || ''}
                                    onChange={(e) => onChange({ ...data, emergencyContactRelationshipOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const DataPekerjaanStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Data Pekerjaan</h4>
                <p className="text-muted fs-5">Employment information</p>
            </div>

            <Form>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Jenis Pekerjaan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jenisPekerjaan || ''}
                                onChange={(e) => onChange({ ...data, jenisPekerjaan: e.target.value })}
                                required
                            >
                                <option value="">Select Employment Type</option>
                                <option value="Swasta">Swasta (Private Employee)</option>
                                <option value="Wiraswasta">Wiraswasta (Entrepreneur)</option>
                                <option value="Ibu RT">Ibu RT (Housewife)</option>
                                <option value="Profesional">Profesional</option>
                                <option value="ASN">ASN (Civil Servant)</option>
                                <option value="Mahasiswa">Mahasiswa (Student)</option>
                                <option value="Lainnya">Lainnya (Other)</option>
                            </Form.Select>
                            {data.jenisPekerjaan === 'Lainnya' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Sebutkan jenis pekerjaan lainnya"
                                    value={data.jenisPekerjaanOther || ''}
                                    onChange={(e) => onChange({ ...data, jenisPekerjaanOther: e.target.value })}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Employment Details - Show for specific job types */}
                {(data.jenisPekerjaan === 'Swasta' || data.jenisPekerjaan === 'Wiraswasta' || data.jenisPekerjaan === 'Profesional' || data.jenisPekerjaan === 'ASN') && (
                    <>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Nama Perusahaan <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Company Name"
                                        value={data.namaPerusahaan || ''}
                                        onChange={(e) => onChange({ ...data, namaPerusahaan: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Bidang Usaha <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nature of Business"
                                        value={data.bidangUsaha || ''}
                                        onChange={(e) => onChange({ ...data, bidangUsaha: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Jabatan <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Position"
                                        value={data.jabatan || ''}
                                        onChange={(e) => onChange({ ...data, jabatan: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Lama Bekerja <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Length of Work"
                                        value={data.lamaBekerja || ''}
                                        onChange={(e) => onChange({ ...data, lamaBekerja: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Kantor Sebelumnya <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Previous Company"
                                        value={data.kantorSebelumnya || ''}
                                        onChange={(e) => onChange({ ...data, kantorSebelumnya: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Office Address */}
                        <Row>
                            <Col md={8}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Alamat (Address) <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Office street address"
                                        value={data.alamatKantor || ''}
                                        onChange={(e) => onChange({ ...data, alamatKantor: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="City"
                                        value={data.kotaKantor || ''}
                                        onChange={(e) => onChange({ ...data, kotaKantor: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Postal/Zip Code <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Postal code"
                                        value={data.postalCodeKantor || ''}
                                        onChange={(e) => onChange({ ...data, postalCodeKantor: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Office Contact */}
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">No. Telepon Kantor <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Office Phone No"
                                        value={data.noTeleponKantor || ''}
                                        onChange={(e) => onChange({ ...data, noTeleponKantor: e.target.value })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">No. Faksimili Kantor (Optional)</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Office Fax No"
                                        value={data.noFaksimiliKantor || ''}
                                        onChange={(e) => onChange({ ...data, noFaksimiliKantor: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                )}
                    </Form>
        </div>
    );
};

const DaftarKekayaanStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Daftar Kekayaan</h4>
                <p className="text-muted fs-5">Wealth and asset information</p>
            </div>

            <Form>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Penghasilan Pertahun <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.penghasilanPertahun || ''}
                                onChange={(e) => onChange({ ...data, penghasilanPertahun: e.target.value })}
                                required
                            >
                                <option value="">Select Annual Income</option>
                                <option value="Antara 100 - 250 juta rupiah">Antara 100 - 250 juta rupiah (Between 100 - 250 million rupiah)</option>
                                <option value="Antara 250 - 500 juta rupiah">Antara 250 - 500 juta rupiah (Between 250 - 500 million rupiah)</option>
                                <option value="Di atas 500 juta rupiah">Di atas 500 juta rupiah (Above 500 million rupiah)</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Lokasi Rumah</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Home location"
                                value={data.lokasiRumah || ''}
                                onChange={(e) => onChange({ ...data, lokasiRumah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Nilai NJOP</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Sales Value of Taxable Object"
                                value={data.nilaiNJOP || ''}
                                onChange={(e) => onChange({ ...data, nilaiNJOP: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Bank Deposit</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Deposit Bank"
                                value={data.bankDeposit || ''}
                                onChange={(e) => onChange({ ...data, bankDeposit: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Jumlah</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Total amount"
                                value={data.jumlah || ''}
                                onChange={(e) => onChange({ ...data, jumlah: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Lainnya</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Other assets"
                                value={data.lainnya || ''}
                                onChange={(e) => onChange({ ...data, lainnya: e.target.value })}
                            />
                        </Form.Group>
                </Col>
            </Row>
            </Form>
        </div>
    );
};

const RekeningBankStep = ({ data = {}, onChange }) => {
    const [bankAccounts, setBankAccounts] = useState(data.bankAccounts || [{ 
        namaBank: '', 
        cabang: '', 
        noRekening: '', 
        namaPemilikRekening: '', 
        noTeleponBank: '', 
        bankAccountType: '',
        bankAccountTypeOther: ''
    }]);

    // Debug: Log current bank accounts state
    console.log('Current bank accounts:', bankAccounts);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const addBankAccount = () => {
        const newAccounts = [...bankAccounts, { 
            namaBank: '', 
            cabang: '', 
            noRekening: '', 
            namaPemilikRekening: '', 
            noTeleponBank: '', 
            bankAccountType: '',
            bankAccountTypeOther: ''
        }];
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
    };

    const removeBankAccount = (index) => {
        const newAccounts = bankAccounts.filter((_, i) => i !== index);
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
    };

    const updateBankAccount = (index, field, value) => {
        console.log(`Updating bank account ${index}, field: ${field}, value: ${value}`);
        const newAccounts = [...bankAccounts];
        newAccounts[index] = { ...newAccounts[index], [field]: value };
        console.log('Updated accounts:', newAccounts);
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Rekening Bank Nasabah</h4>
                <p className="text-muted fs-5">Bank account for margin deposits and withdrawals</p>
            </div>

            <Form>
                {bankAccounts.map((account, index) => (
                    <Card key={`bank-account-${index}`} className="mb-3 border-0 shadow-sm">
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
                                        <Form.Label className="text-muted">Nama Bank <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Bank name"
                                            value={account.namaBank || ''}
                                            onChange={(e) => updateBankAccount(index, 'namaBank', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Cabang <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Bank branch"
                                            value={account.cabang || ''}
                                            onChange={(e) => updateBankAccount(index, 'cabang', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">No. Rekening <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="IBAN / Account number"
                                            value={account.noRekening || ''}
                                            onChange={(e) => updateBankAccount(index, 'noRekening', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Nama Pemilik Rekening <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Account name"
                                            value={account.namaPemilikRekening || ''}
                                            onChange={(e) => updateBankAccount(index, 'namaPemilikRekening', e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">No. Telepon Bank</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            placeholder="Bank phone number"
                                            value={account.noTeleponBank || ''}
                                            onChange={(e) => updateBankAccount(index, 'noTeleponBank', e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Jenis Rekening Bank <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={account.bankAccountType || ''}
                                            onChange={(e) => {
                                                console.log('Bank account type changed:', e.target.value);
                                                const newValue = e.target.value;
                                                
                                                // Update both fields in a single operation to avoid state conflicts
                                                const newAccounts = [...bankAccounts];
                                                newAccounts[index] = { 
                                                    ...newAccounts[index], 
                                                    bankAccountType: newValue,
                                                    bankAccountTypeOther: newValue !== 'LAINNYA' ? '' : newAccounts[index].bankAccountTypeOther
                                                };
                                                setBankAccounts(newAccounts);
                                                onChange({ ...data, bankAccounts: newAccounts });
                                            }}
                                            required
                                        >
                                            <option value="">Select Account Type</option>
                                            <option value="GIRO">Giro</option>
                                            <option value="TABUNGAN">Tabungan</option>
                                            <option value="LAINNYA">Lainnya</option>
                                        </Form.Select>
                                        {account.bankAccountType === 'LAINNYA' && (
                                            <Form.Control
                                                type="text"
                                                placeholder="Sebutkan jenis rekening bank lainnya"
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

const DeclarationStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return <CompanyProfileDeclaration data={data} onChange={onChange} />;
};

const CompanyProfileDeclaration = ({ data = {}, onChange }) => {
    return (
        <div>
            <div className="text-center mb-4">
                <h5 className="text-primary mb-3">Please Read All The Documents Below and Apply Tick Mark</h5>
            </div>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">PROFIL PERUSAHAAN PIALANG BERJANGKA</h5>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-3">
                        <Col md={3}><strong>Nama Perusahaan</strong></Col>
                        <Col md={9}>: PT. GENESIS GEMILANG FUTURES</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={3}><strong>Alamat</strong></Col>
                        <Col md={9}>: SOHO CAPITAL OFFICE BUILDING<br/>
                        Lantai 16 Unit 1608-09, JL Letjen S. Parman Kav. 28, Kelurahan Tanjung Duren Selatan,<br/>
                        Kecamatan Grogol Petamburan, Jakarta Barat, DKI Jakarta, Indonesia, Kode Pos 11470</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={3}><strong>No. Telepon Perusahaan</strong></Col>
                        <Col md={9}>: (+62)21-50100572</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={3}><strong>E-Mail</strong></Col>
                        <Col md={9}>: support@genesis.co.id</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={3}><strong>Website</strong></Col>
                        <Col md={9}>: www.genesis.co.id</Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">SUSUNAN PENGURUS PERUSAHAAN</h6>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-2">
                        <Col md={3}><strong>Komisaris Utama</strong></Col>
                        <Col md={9}>: Sandhy Frily</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>Komisaris</strong></Col>
                        <Col md={9}>: Ivan Hartono</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>Komisaris</strong></Col>
                        <Col md={9}>: Angeline Hartono</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>Direktur Utama</strong></Col>
                        <Col md={9}>: Mohamad Hapid S. Sos</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>Direktur Operasional</strong></Col>
                        <Col md={9}>: Martinus Pattileuw</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>Direktur Kepatuhan</strong></Col>
                        <Col md={9}>: Ridwan Hamid</Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">SUSUNAN PEMEGANG SAHAM</h6>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-2">
                        <Col md={6}><strong>PT Ventech Centurion Asia</strong></Col>
                        <Col md={6}>: (96%)</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col md={6}><strong>Sandhy Frily</strong></Col>
                        <Col md={6}>: (4%)</Col>
                    </Row>
                    
                    <Row className="mb-2">
                        <Col md={6}><strong>Nomor Izin Usaha dari Bappebti</strong></Col>
                        <Col md={6}>: 02/BAPPEBTI/SI/11/2022</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={6}><strong>Nomor Keanggotaan Bursa Berjangka</strong></Col>
                        <Col md={6}>: SPAB/180/BBJ/06/2022</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={6}><strong>Nomor Keanggotaan Lembaga Kliring Berjangka</strong></Col>
                        <Col md={6}>: 10/AK-KBI/VII/2022</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={6}><strong>Nomor Persetujuan Pialang Berjangka PALN</strong></Col>
                        <Col md={6}>: 01/BAPPEBTI/KP/09/2023</Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">KONTRAK BERJANGKA YANG DIPERDAGANGKAN</h6>
                </Card.Header>
                <Card.Body>
                    <ul className="mb-0">
                        <li>Multilateral Contract JFX (Jakarta Futures Exchange)</li>
                        <li>PALN SGX FX (Singapore Exchange)</li>
                    </ul>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">BIAYA SECARA RINCI YANG DIBEBANKAN KEPADA NASABAH</h6>
                </Card.Header>
                <Card.Body>
                    <ul className="mb-0">
                        <li>Komisi Multilateral (Rp 1.500 - Rp 150.000)</li>
                        <li>Komisi PALN (USD $5 ↔)</li>
                    </ul>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">NOMOR TELEPON ATAU ALAMAT E-MAIL JIKA TERJADI KELUHAN</h6>
                </Card.Header>
                <Card.Body>
                    <ul className="mb-0">
                        <li>E-Mail : pengaduan@genesis.co.id</li>
                        <li>No. Telepon : (+62)21-50217216</li>
                    </ul>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">SARANA PENYELESAIAN PERSELISIHAN YANG DIPERGUNAKAN APABILA TERJADI PERSELISIHAN</h6>
                </Card.Header>
                <Card.Body>
                    <ul className="mb-0">
                        <li>Secara musyawarah untuk mencapai mufakat antara Para Pihak;</li>
                        <li>Memanfaatkan sarana penyelesaian perselisihan yang tersedia di Bursa Berjangka Jakarta (JFX);</li>
                        <li>Badan Arbitrase Perdagangan Berjangka Komoditi (BAKTI) atau Pengadilan Negeri Jakarta barat;</li>
                    </ul>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">NAMA-NAMA WAKIL PIALANG BERJANGKA YANG BEKERJA DI PERUSAHAAN PIALANG BERJANGKA</h6>
                </Card.Header>
                <Card.Body>
                    <div className="row">
                        <div className="col-6">• Helmy Tirta</div>
                        <div className="col-6">Nomor: 295/UPTP/SI/11/2022</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Kusnadi</div>
                        <div className="col-6">Nomor: 0366/UPTP/SI/5/2023</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Ardian Saputra</div>
                        <div className="col-6">Nomor: 0666/UPTP/SI/8/2023</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Valentinus Alfons Santoso</div>
                        <div className="col-6">Nomor: 773/UPTP/SI/11/2023</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Adhiyaka Silmi</div>
                        <div className="col-6">Nomor: 215/UPTP/SI/10/2024</div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">NAMA-NAMA WAKIL PIALANG BERJANGKA YANG SECARA KHUSUS DITUNJUK OLEH PIALANG BERJANGKA UNTUK MELAKUKAN VERIFIKASI DALAM RANGKA PENERIMAAN NASABAH ELEKTRONIK (ON-LINE)</h6>
                </Card.Header>
                <Card.Body>
                    <div className="row">
                        <div className="col-6">• Helmy Tirta</div>
                        <div className="col-6">Nomor: 295/UPTP/SI/11/2022</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Kusnadi</div>
                        <div className="col-6">Nomor: 0366/UPTP/SI/5/2023</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Ardian Saputra</div>
                        <div className="col-6">Nomor: 0666/UPTP/SI/8/2023</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Valentinus Alfons Santoso</div>
                        <div className="col-6">Nomor: 773/UPTP/SI/11/2023</div>
                    </div>
                    <div className="row">
                        <div className="col-6">• Adhiyaka Silmi</div>
                        <div className="col-6">Nomor: 215/UPTP/SI/10/2024</div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">NOMOR REKENING TERPISAH (SEGREGATED ACCOUNT) PERUSAHAAN PIALANG BERJANGKA</h6>
                </Card.Header>
                <Card.Body>
                    <Row className="mb-2">
                        <Col md={3}><strong>• BANK</strong></Col>
                        <Col md={9}>: PT. BANK CIMB NIAGA, TBK</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>• SWIFT CODE</strong></Col>
                        <Col md={9}>: BNIAIDJA</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>• BANK ADDRESS</strong></Col>
                        <Col md={9}>: JL. JEND. SUDIRMAN, 58, NIAGA TOWER, FLOOR 10, JAKARTA, INDONESIA</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>• USD Account</strong></Col>
                        <Col md={9}>: 808777776540 (USD)</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>• BANK</strong></Col>
                        <Col md={9}>: BANK CIMB NIAGA KANTOR CABANG JAKARTA CIDENG</Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={3}><strong>• No. Rekening</strong></Col>
                        <Col md={9}>: 808877779500 (IDR)</Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">PERNYATAAN TELAH MEMBACA PROFIL PERUSAHAAN PIALANG BERJANGKA</h5>
                </Card.Header>
                <Card.Body>
                    <p className="mb-3">
                        Dengan mengisi kolom "YA" di bawah ini, saya menyatakan bahwa saya telah membaca dan menerima informasi 
                        PROFIL PERUSAHAAN PIALANG BERJANGKA, mengerti dan memahami isinya.
                    </p>
                    
                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check
                                type="radio"
                                id="declaration-ya"
                                name="declaration"
                                label="Ya"
                                value="ya"
                                checked={data.declaration === 'ya'}
                                onChange={(e) => onChange({ ...data, declaration: e.target.value })}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="declaration-tidak"
                                name="declaration"
                                label="Tidak"
                                value="tidak"
                                checked={data.declaration === 'tidak'}
                                onChange={(e) => onChange({ ...data, declaration: e.target.value })}
                                required
                            />
                        </div>
                        {data.declaration === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Pada Tanggal:</strong></Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={data.declarationDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                            onChange={(e) => onChange({ ...data, declarationDate: e.target.value })}
                            required
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
        </div>
    );
};

const TradingSimulationDeclaration = ({ data = {}, onChange, allData = {} }) => {
    // Flatten all form data from all steps into a single object
    const flattenedData = Object.values(allData).reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">PERNYATAAN TELAH MELAKUKAN SIMULASI PERDAGANGAN BERJANGKA KOMODITI</h5>
                </Card.Header>
                <Card.Body>
                    <p className="mb-3"><strong>Yang mengisi formulir di bawah ini:</strong></p>
                    
                    <Row className="mb-3">
                        <Col md={4}><strong>Nama Lengkap</strong></Col>
                        <Col md={8}>: {flattenedData.namaLengkap || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                        <Col md={4}><strong>Tempat Lahir & Tgl. Lahir</strong></Col>
                        <Col md={8}>: {flattenedData.tempatLahir || 'Not provided'}, {flattenedData.tanggalLahir || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                        <Col md={4}><strong>Alamat</strong></Col>
                        <Col md={8}>: {`${flattenedData.streetAddress || ''}, ${flattenedData.city || ''}, ${flattenedData.postalCode || ''}`.trim() || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                        <Col md={4}><strong>Kota & Kode Pos</strong></Col>
                        <Col md={8}>: {`${flattenedData.city || ''}, ${flattenedData.postalCode || ''}`.trim() || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                        <Col md={4}><strong>No. KTP</strong></Col>
                        <Col md={8}>: {flattenedData.noKTP || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-4">
                        <Col md={4}><strong>No. Akun Demo</strong></Col>
                        <Col md={8}>: {flattenedData.demoAccountNo || 'Not selected'}</Col>
                    </Row>
                    
                    <div className="mb-4">
                        <p>
                            Dengan mengisi kolom "YA" dibawah ini, saya menyatakan bahwa saya telah melakukan simulasi bertransaksi di 
                            bidang Perdagangan Berjangka Komoditi pada PT. GENESIS GEMILANG FUTURES, dan telah memahami tentang 
                            tata cara bertransaksi di bidang Perdagangan Berjangka komoditi.
                        </p>
                        
                        <p>
                            Demikian Pernyataan ini dibuat dengan sebenarnya dalam keadaan sadar, sehat jasmani dan rohani serta tanpa 
                            paksaan apapun dari pihak manapun.
                        </p>
                    </div>
                    
                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check
                                type="radio"
                                id="trading-simulation-ya"
                                name="tradingSimulation"
                                label="Ya"
                                value="ya"
                                checked={data.tradingSimulation === 'ya'}
                                onChange={(e) => onChange({ ...data, tradingSimulation: e.target.value })}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="trading-simulation-tidak"
                                name="tradingSimulation"
                                label="Tidak"
                                value="tidak"
                                checked={data.tradingSimulation === 'tidak'}
                                onChange={(e) => onChange({ ...data, tradingSimulation: e.target.value })}
                                required
                            />
                        </div>
                        {data.tradingSimulation === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Menerima Pada Tanggal:</strong></Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={data.tradingSimulationDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                            onChange={(e) => onChange({ ...data, tradingSimulationDate: e.target.value })}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pengalaman Transaksi Perdagangan Berjangka <span className="text-danger">*</span></strong></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check
                                type="radio"
                                id="trading-experience-ya"
                                name="tradingExperience"
                                label="Ya"
                                value="ya"
                                checked={data.tradingExperience === 'ya'}
                                onChange={(e) => onChange({ ...data, tradingExperience: e.target.value })}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="trading-experience-tidak"
                                name="tradingExperience"
                                label="Tidak"
                                value="tidak"
                                checked={data.tradingExperience === 'tidak'}
                                onChange={(e) => onChange({ ...data, tradingExperience: e.target.value })}
                                required
                            />
                        </div>
                    </Form.Group>

                    {data.tradingExperience === 'ya' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted"><strong>Sebutkan Perusahaan Pialang <span className="text-danger">*</span></strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Broker Company Name"
                                    value={data.brokerCompany || ''}
                                    onChange={(e) => onChange({ ...data, brokerCompany: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted"><strong>No Demo Akun (Pengalaman Transaksi) <span className="text-danger">*</span></strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Demo Account Number"
                                    value={data.demoAccountNumber || ''}
                                    onChange={(e) => onChange({ ...data, demoAccountNumber: e.target.value })}
                                    required
                                />
                            </Form.Group>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

const DisclosureStatementStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">PERNYATAAN PENGUNGKAPAN</h5>
                    <h6 className="mb-0 text-secondary text-center">(DISCLOSURE STATEMENT)</h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <ol className="list-unstyled">
                            <li className="mb-3">
                                <strong>1.</strong> Perdagangan Berjangka <strong>Berisiko SANGAT TINGGI</strong> tidak cocok untuk semua orang. Pastikan bahwa Anda <strong>SEPENUHNYA MEMAHAMI RISIKO</strong> ini sebelum melakukan perdagangan.
                            </li>
                            <li className="mb-3">
                                <strong>2.</strong> Perdagangan Berjangka merupakan produk keuangan dengan leverage dan dapat menyebabkan <strong>KERUGIAN ANDA MELEBIHI</strong> setoran awal Anda. Anda harus siap apabila <strong>SELURUH DANA ANDA</strong> Habis.
                            </li>
                            <li className="mb-3">
                                <strong>3.</strong> <strong>TIDAK ADA</strong> pendapatan <strong>TETAP (FIXED INCOME)</strong> dalam Perdagangan Berjangka.
                            </li>
                            <li className="mb-3">
                                <strong>4.</strong> Apabila Anda <strong>PEMULA</strong> kami sarankan untuk mempelajari mekanisme transaksinya, <strong>PERDAGANGAN BERJANGKA</strong> membutuhkan pengetahuan dan pemahaman khusus.
                            </li>
                            <li className="mb-3">
                                <strong>5.</strong> <strong>ANDA HARUS MELAKUKAN TRANSAKSI SENDIRI</strong>, segala risiko yang akan timbul akibat transaksi sepenuhnya akan menjadi tanggung jawab Saudara.
                            </li>
                            <li className="mb-3">
                                <strong>6.</strong> <strong>User id</strong> dan <strong>password</strong> bersifat <strong>PRIBADI DAN RAHASIA</strong>, anda bertanggung jawab atas penggunaannya, <strong>JANGAN SERAHKAN</strong> ke pihak lain terutama Wakil Pialang Berjangka dan pegawai Pialang Berjangka.
                            </li>
                            <li className="mb-3">
                                <strong>7.</strong> <strong>ANDA</strong> berhak menerima <strong>LAPORAN ATAS TRANSAKSI</strong> yang anda lakukan. Waktu anda <strong>2 X 24 JAM UNTUK MEMBERIKAN SANGGAHAN</strong>. Untuk transaksi yang telah Selesai <strong>(DONE/SETTLE) DAPAT ANDA CEK</strong> melalui sistem informasi transaksi nasabah yang berfungsi untuk memastikan transaksi anda telah terdaftar di Lembaga Kliring Berjangka.
                            </li>
                        </ol>
                    </div>

                    <div className="border-top pt-4">
                        <p className="text-center mb-4">
                            <strong>SECARA DETAIL BACA DOKUMEN PEMBERITAHUAN ADANYA RISIKO DAN DOKUMEN PERJANJIAN PEMBERIAN AMANAT</strong>
                        </p>
                        <p className="text-center mb-4">
                            Untuk mempelajari lebih lanjut mengenai Perdagangan Berjangka dapat anda mengunjungi situs{' '}
                            <a href="https://www.bappebti.go.id" target="_blank" rel="noopener noreferrer" className="text-primary">
                                www.bappebti.go.id
                            </a>
                        </p>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check
                                type="radio"
                                id="disclosure-ya"
                                name="disclosureStatement"
                                label="Ya"
                                value="ya"
                                checked={data.disclosureStatement === 'ya'}
                                onChange={(e) => onChange({ ...data, disclosureStatement: e.target.value })}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="disclosure-tidak"
                                name="disclosureStatement"
                                label="Tidak"
                                value="tidak"
                                checked={data.disclosureStatement === 'tidak'}
                                onChange={(e) => onChange({ ...data, disclosureStatement: e.target.value })}
                                required
                            />
                        </div>
                        {data.disclosureStatement === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Pada Tanggal:</strong></Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={data.disclosureDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                            onChange={(e) => onChange({ ...data, disclosureDate: e.target.value })}
                            required
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
        </div>
    );
};

const DocumentUploadStep = ({ data = {}, onChange, requirements }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFileChange = (docName, file) => {
        const uploadedFiles = data.uploadedFiles || {};
        uploadedFiles[docName] = {
            name: file ? file.name : null,
            size: file ? file.size : null,
            type: file ? file.type : null,
            lastModified: file ? file.lastModified : null
        };
        onChange({ ...data, uploadedFiles });
    };

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
                                <Form.Label className="text-muted">{doc} <span className="text-danger">*</span></Form.Label>
                                <Form.Control 
                                    type="file" 
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(doc, e.target.files[0])}
                                />
                                <Form.Text className="text-muted">
                                    Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                                </Form.Text>
                                {data.uploadedFiles && data.uploadedFiles[doc] && data.uploadedFiles[doc].name && (
                                    <div className="mt-2">
                                        <small className="text-success">
                                            ✓ Uploaded: {data.uploadedFiles[doc].name}
                                        </small>
                                    </div>
                                )}
                            </Form.Group>
                        ))}
                    </Card.Body>
                </Card>
            ))}
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

            {/* Account Information Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Account Information</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Email:</strong> {allData.email || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Demo Account:</strong> {allData.demoAccountNo || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Data Pribadi Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Data Pribadi</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Nama Lengkap:</strong> {allData.namaLengkap || 'Not provided'}</p>
                            <p><strong>Tempat Lahir:</strong> {allData.tempatLahir || 'Not provided'}</p>
                            <p><strong>Tanggal Lahir:</strong> {allData.tanggalLahir || 'Not provided'}</p>
                            <p><strong>No. KTP:</strong> {allData.noKTP || 'Not provided'}</p>
                            <p><strong>No. NPWP:</strong> {allData.noNPWP || 'Not provided'}</p>
                            <p><strong>Jenis Kelamin:</strong> {allData.jenisKelamin || 'Not provided'}</p>
                            <p><strong>Status Perkawinan:</strong> {allData.statusPerkawinan || 'Not provided'}</p>
                            {allData.statusPerkawinan === 'Married' && allData.namaIstriSuami && (
                                <p><strong>Nama Istri / Suami:</strong> {allData.namaIstriSuami}</p>
                            )}
                        </Col>
                        <Col md={6}>
                            <p><strong>Nama Ibu Kandung:</strong> {allData.namaIbuKandung || 'Not provided'}</p>
                            <p><strong>No. Handphone:</strong> {allData.noHandphone || 'Not provided'}</p>
                            <p><strong>Alamat:</strong> {`${allData.streetAddress || ''}, ${allData.city || ''}, ${allData.postalCode || ''}`.trim() || 'Not provided'}</p>
                            <p><strong>Status Kepemilikan Rumah:</strong> {allData.statusKepemilikanRumah || 'Not provided'}</p>
                            <p><strong>Tujuan Pembukaan Rekening:</strong> {allData.tujuanPembukaanRekening || 'Not provided'}</p>
                            <p><strong>Pengalaman Investasi:</strong> {allData.pengalamanInvestasi || 'Not provided'}</p>
                            {allData.pengalamanInvestasiBidang && (
                                <p><strong>Pengalaman Investasi Bidang:</strong> {allData.pengalamanInvestasiBidang}</p>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Emergency Contact Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Emergency Contact</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Nama Lengkap:</strong> {allData.emergencyContactName || 'Not provided'}</p>
                            <p><strong>No. Handphone:</strong> {allData.emergencyContactPhone || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Alamat:</strong> {`${allData.emergencyContactStreetAddress || ''}, ${allData.emergencyContactCity || ''}, ${allData.emergencyContactPostalCode || ''}`.trim() || 'Not provided'}</p>
                            <p><strong>Hubungan:</strong> {allData.emergencyContactRelationship || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Employment Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Data Pekerjaan</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Jenis Pekerjaan:</strong> {allData.jenisPekerjaan || 'Not provided'}</p>
                            {allData.namaPerusahaan && (
                                <p><strong>Nama Perusahaan:</strong> {allData.namaPerusahaan}</p>
                            )}
                            {allData.bidangUsaha && (
                                <p><strong>Bidang Usaha:</strong> {allData.bidangUsaha}</p>
                            )}
                            {allData.jabatan && (
                                <p><strong>Jabatan:</strong> {allData.jabatan}</p>
                            )}
                            {allData.lamaBekerja && (
                                <p><strong>Lama Bekerja:</strong> {allData.lamaBekerja}</p>
                            )}
                        </Col>
                        <Col md={6}>
                            {allData.kantorSebelumnya && (
                                <p><strong>Kantor Sebelumnya:</strong> {allData.kantorSebelumnya}</p>
                            )}
                            {allData.alamatKantor && (
                                <p><strong>Alamat Kantor:</strong> {`${allData.alamatKantor || ''}, ${allData.kotaKantor || ''}, ${allData.postalCodeKantor || ''}`.trim()}</p>
                            )}
                            {allData.noTeleponKantor && (
                                <p><strong>No. Telepon Kantor:</strong> {allData.noTeleponKantor}</p>
                            )}
                            {allData.noFaksimiliKantor && (
                                <p><strong>No. Faksimili Kantor:</strong> {allData.noFaksimiliKantor}</p>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Wealth Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Daftar Kekayaan</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Penghasilan Pertahun:</strong> {allData.penghasilanPertahun || 'Not provided'}</p>
                            <p><strong>Lokasi Rumah:</strong> {allData.lokasiRumah || 'Not provided'}</p>
                            <p><strong>Nilai NJOP:</strong> {allData.nilaiNJOP || 'Not provided'}</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Bank Deposit:</strong> {allData.bankDeposit || 'Not provided'}</p>
                            <p><strong>Jumlah:</strong> {allData.jumlah || 'Not provided'}</p>
                            <p><strong>Lainnya:</strong> {allData.lainnya || 'Not provided'}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Bank Account Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Rekening Bank</h6>
                </Card.Header>
                <Card.Body>
                    {allData.bankAccounts && allData.bankAccounts.length > 0 ? (
                        allData.bankAccounts.map((account, index) => (
                            <div key={index} className={index > 0 ? 'mt-4 pt-3 border-top' : ''}>
                                <h6 className="text-primary mb-3">Bank Account {index + 1}</h6>
                                <Row>
                                    <Col md={6}>
                                        <p><strong>Nama Bank:</strong> {account.namaBank || 'Not provided'}</p>
                                        <p><strong>Cabang:</strong> {account.cabang || 'Not provided'}</p>
                                        <p><strong>No. Rekening:</strong> {account.noRekening || 'Not provided'}</p>
                                    </Col>
                                    <Col md={6}>
                                        <p><strong>Nama Pemilik Rekening:</strong> {account.namaPemilikRekening || 'Not provided'}</p>
                                        <p><strong>Jenis Rekening:</strong> {account.bankAccountType || 'Not provided'}</p>
                                        {account.noTeleponBank && (
                                            <p><strong>No. Telepon Bank:</strong> {account.noTeleponBank}</p>
                                        )}
                                    </Col>
                                </Row>
                            </div>
                        ))
                    ) : (
                        <p>No bank accounts provided</p>
                    )}
                </Card.Body>
            </Card>

            {/* Declaration Summary */}
            <Card className="border-0 shadow-sm mb-3">
                <Card.Header className="bg-light">
                    <h6 className="mb-0 text-primary">Declaration</h6>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><strong>Company Profile Declaration:</strong> {allData.declaration === 'ya' ? 'Accepted' : allData.declaration === 'tidak' ? 'Rejected' : 'Not provided'}</p>
                            {allData.declarationDate && (
                                <p><strong>Declaration Date:</strong> {new Date(allData.declarationDate).toLocaleString()}</p>
                            )}
                        </Col>
                        <Col md={6}>
                            <p><strong>Trading Simulation Declaration:</strong> {allData.tradingSimulation === 'ya' ? 'Accepted' : allData.tradingSimulation === 'tidak' ? 'Rejected' : 'Not provided'}</p>
                            {allData.tradingSimulationDate && (
                                <p><strong>Trading Simulation Date:</strong> {new Date(allData.tradingSimulationDate).toLocaleString()}</p>
                            )}
                            {allData.tradingExperience && (
                                <p><strong>Trading Experience:</strong> {allData.tradingExperience === 'ya' ? 'Yes' : 'No'}</p>
                            )}
                            {allData.tradingExperience === 'ya' && allData.brokerCompany && (
                                <p><strong>Broker Company:</strong> {allData.brokerCompany}</p>
                            )}
                            {allData.tradingExperience === 'ya' && allData.demoAccountNumber && (
                                <p><strong>Demo Account Number:</strong> {allData.demoAccountNumber}</p>
                            )}
                        </Col>
                    </Row>
                    
                    <Row>
                        <Col md={12}>
                            <p><strong>Disclosure Statement:</strong> {allData.disclosureStatement === 'ya' ? 'Accepted' : allData.disclosureStatement === 'tidak' ? 'Rejected' : 'Not provided'}</p>
                            {allData.disclosureDate && (
                                <p><strong>Disclosure Date:</strong> {new Date(allData.disclosureDate).toLocaleString()}</p>
                            )}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Application Status */}
            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <h6 className="text-primary mb-3">Application Status</h6>
                    <Row>
                        <Col md={6}>
                            <p><strong>Account Type:</strong> Indonesian Person</p>
                            <p><strong>Status:</strong> Ready for submission</p>
                        </Col>
                        <Col md={6}>
                            <p><strong>Steps Completed:</strong> 11/11</p>
                            <p><strong>Documents:</strong> Ready for upload</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

const RiskDisclosureDocumentStep = ({ data = {}, onChange }) => {
    const handleCheckboxChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    const riskDisclosurePoints = [
        {
            id: 'point1',
            text: '<strong>Perdagangan Kontrak Berjangka belum tentu layak bagi semua investor. Anda dapat menderita kerugian dalam jumlah besar dan dalam jangka waktu singkat.</strong> Jumlah kerugian uang dimungkinkan dapat melebihi jumlah uang yang pertama kali Anda setor (Margin awal) ke Pialang Berjangka Anda. Anda mungkin menderita kerugian seluruh Margin dan Margin tambahan yang ditempatkan pada Pialang Berjangka untuk mempertahankan posisi Kontrak Berjangka Anda. Hal ini disebabkan Perdagangan Berjangka sangat dipengaruhi oleh mekanisme leverage, dimana dengan jumlah investasi dalam bentuk yang relatif kecil dapat digunakan untuk membuka posisi dengan aset yang bernilai jauh lebih tinggi. Apabila Anda tidak siap dengan risiko seperti ini, sebaiknya Anda tidak melakukan perdagangan Kontrak Berjangka.'
        },
        {
            id: 'point2', 
            text: '<strong>Perdagangan Kontrak Berjangka mempunyai risiko dan mempunyai kemungkinan kerugian yang tidak terbatas yang jauh lebih besar dari jumlah uang yang disetor (Margin) ke Pialang Berjangka.</strong> Kontrak Berjangka sama dengan produk keuangan lainnya yang mempunyai risiko tinggi, Anda sebaiknya tidak menaruh risiko terhadap dana yang Anda tidak siap untuk menderita rugi, seperti tabungan pensiun, dana kesehatan atau dana untuk keadaan darurat, dana yang disediakan untuk pendidikan atau kepemilikan rumah, dana yang diperoleh dari pinjaman pendidikan atau gadai, atau dana yang digunakan untuk memenuhi kebutuhan sehari-hari.'
        },
        {
            id: 'point3',
            text: '<strong>Berhati-hatilah terhadap pernyataan bahwa Anda pasti mendapatkan keuntungan besar dari perdagangan Kontrak Berjangka.</strong> Meskipun perdagangan Kontrak Berjangka dapat memberikan keuntungan yang besar dan cepat, namun hal tersebut tidak pasti, bahkan dapat menimbulkan kerugian yang besar dan cepat juga. Seperti produk keuangan lainnya, tidak ada yang dinamakan "pasti untung".'
        },
        {
            id: 'point4',
            text: '<strong>Disebabkan adanya mekanisme leverage dan sifat dari transaksi Kontrak Berjangka, Anda dapat merasakan dampak bahwa Anda menderita kerugian dalam waktu cepat.</strong> Keuntungan maupun kerugian dalam transaksi Kontrak Berjangka akan langsung dikredit atau didebet ke rekening Anda, paling lambat secara harian. Apabila pergerakan di pasar terhadap Kontrak Berjangka menurunkan nilai posisi Anda dalam Kontrak Berjangka, Anda diwajibkan untuk menambah dana untuk pemenuhan kewajiban Margin ke Pialang Berjangka. Apabila rekening Anda berada dibawah minimum Margin yang telah ditetapkan Lembaga Kliring Berjangka atau Pialang Berjangka, maka posisi Anda dapat dilikuidasi pada saat rugi, dan Anda wajib menyelesaikan defisit (jika ada) dalam rekening Anda.'
        },
        {
            id: 'point5',
            text: '<strong>Pada saat pasar dalam keadaan tertentu, Anda mungkin akan sulit atau tidak mungkin melikuidasi posisi.</strong> Pada umumnya Anda harus melakukan transaksi offset jika ingin melikuidasi posisi dalam Kontrak Berjangka. Apabila Anda tidak dapat melikuidasi posisi Kontrak Berjangka, Anda tidak dapat merealisasikan keuntungan pada nilai posisi tersebut atau mencegah kerugian yang lebih tinggi. Kemungkinan tidak dapat melikuidasi dapat terjadi, antara lain: jika perdagangan berhenti dikarenakan aktivitas perdagangan yang tidak lazim pada Kontrak Berjangka atau subjek Kontrak Berjangka, terjadi kerusakan sistem pada Bursa Berjangka atau Pialang Berjangka, atau posisi Anda berada dalam pasar yang tidak likuid. Bahkan apabila Anda dapat melikuidasi posisi tersebut, Anda mungkin terpaksa melakukannya pada harga yang menimbulkan kerugian besar.'
        },
        {
            id: 'point6',
            text: '<strong>Pada saat pasar dalam keadaan tertentu, Anda mungkin akan sulit atau tidak mungkin mengelola risiko atas posisi terbuka Kontrak Berjangka dengan cara membuka posisi dengan nilai yang sama namun dengan posisi yang berlawanan dalam kontrak bulan yang berbeda, dalam pasar yang berbeda atau dalam "subjek Kontrak Berjangka" yang berbeda.</strong> Kemungkinan untuk tidak dapat mengambil posisi dalam rangka membatasi risiko yang timbul, contohnya: jika perdagangan dihentikan pada pasar yang berbeda disebabkan aktivitas perdagangan yang tidak lazim pada Kontrak Berjangka atau "subjek Kontrak Berjangka".'
        },
        {
            id: 'point7',
            text: '<strong>Anda dapat diwajibkan untuk menyelesaikan Kontrak Berjangka dengan penyerahan fisik dari "subjek Kontrak Berjangka"</strong> Jika Anda mempertahankan posisi penyelesaian fisik dalam Kontrak Berjangka sampai hari terakhir perdagangan berdasarkan tanggal jatuh tempo Kontrak Berjangka, Anda akan diwajibkan menyerahkan atau menerima penyerahan "subjek Kontrak Berjangka" yang dapat mengakibatkan adanya penambahan biaya. Pengertian penyelesaian dapat berbeda untuk suatu Kontrak Berjangka dengan Kontrak Berjangka lainnya atau suatu Bursa Berjangka dengan Bursa Berjangka lainnya. Anda harus melihat secara teliti mengenai penyelesaian dan kondisi penyerahan sebelum membeli atau menjual Kontrak Berjangka.'
        },
        {
            id: 'point8',
            text: '<strong>Anda dapat menderita kerugian yang disebabkan kegagalan sistem informasi. Sebagaimana yang terjadi pada setiap transaksi keuangan, Anda dapat menderita kerugian jika amanat untuk melaksanakan transaksi Kontrak Berjangka tidak dapat dilakukan karena kegagalan sistem informasi di Bursa Berjangka, penyelenggara maupun sistem informasi di Pialang Berjangka yang mengelola posisi Anda.</strong> Kerugian Anda akan semakin besar jika Pialang Berjangka yang mengelola posisi Anda tidak memiliki sistem informasi cadangan atau prosedur yang layak.'
        },
        {
            id: 'point9',
            text: '<strong>Semua Kontrak Berjangka mempunyai risiko, dan tidak ada strategi berdagang yang dapat menjamin untuk menghilangkan risiko tersebut.</strong> Strategi dengan menggunakan kombinasi posisi seperti spread, dapat sama berisiko seperti posisi long atau short. Melakukan Perdagangan Berjangka memerlukan pengetahuan mengenai Kontrak Berjangka dan pasar berjangka.'
        },
        {
            id: 'point10',
            text: '<strong>Strategi perdagangan harian dalam Kontrak Berjangka dan produk lainnya memiliki risiko khusus.</strong> Seperti pada produk keuangan lainnya, pihak yang ingin membeli atau menjual Kontrak Berjangka yang sama dalam satu hari untuk mendapat keuntungan dari perubahan harga pada hari tersebut ("day traders") akan memiliki beberapa risiko tertentu antara lain jumlah komisi yang besar, risiko terkena efek pengungkit ("exposure to leverage"), dan persaingan dengan pedagang profesional. Anda harus mengerti risiko tersebut dan memiliki pengalaman yang memadai sebelum melakukan perdagangan harian ("day trading").'
        },
        {
            id: 'point11',
            text: '<strong>Menetapkan amanat bersyarat, seperti Kontrak Berjangka dilikuidasi pada keadaan tertentu untuk membatasi rugi (stop loss), mungkin tidak akan dapat membatasi kerugian Anda sampai jumlah tertentu saja.</strong> Amanat bersyarat tersebut mungkin tidak dapat dilaksanakan karena terjadi kondisi pasar yang tidak memungkinkan melikuidasi Kontrak Berjangka.'
        },
        {
            id: 'point12',
            text: '<strong>Anda harus membaca dengan seksama dan memahami Perjanjian Pemberian Amanat</strong> dengan Pialang Berjangka Anda sebelum melakukan transaksi Kontrak Berjangka.'
        },
        {
            id: 'point13',
            text: '<strong>Pernyataan singkat ini tidak dapat memuat secara rinci seluruh risiko atau aspek penting lainnya tentang Perdagangan Berjangka.</strong> Oleh karena itu Anda harus mempelajari kegiatan Perdagangan Berjangka secara cermat sebelum memutuskan melakukan transaksi.'
        },
        {
            id: 'point14',
            text: '<strong>Dokumen Pemberitahuan Adanya Risiko (Risk Disclosure) ini dibuat dan ditandatangani dalam Bahasa Indonesia.</strong>'
        }
    ];

    // Check if all points are acknowledged
    const allPointsAcknowledged = riskDisclosurePoints.every(point => data[point.id] === true);
    const finalAcceptance = data.finalAcceptance === true;

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">
                        DOKUMEN PEMBERITAHUAN ADANYA RISIKO YANG HARUS DISAMPAIKAN OLEH PIALANG BERJANGKA
                    </h5>
                    <h6 className="mb-0 text-secondary text-center">
                        UNTUK TRANSAKSI KONTRAK BERJANGKA
                    </h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <p>
                            Dokumen Pemberitahuan Adanya Risiko ini disampaikan kepada Anda sesuai dengan Pasal 50 ayat (2) Undang-
                            Undang Nomor 32 Tahun 1997 tentang Perdagangan Berjangka Komoditi sebagaimana diubah dengan Undang-
                            Undang Nomor 10 Tahun 2011 tentang Perubahan Undang-Undang Nomor 32 Tahun 1997 tentang Perdagangan 
                            Berjangka Komoditi.
                        </p>
                        <p>
                            Maksud dokumen ini adalah memberitahukan bahwa kemungkinan kerugian atau keuntungan dalam
                            perdagangan Kontrak Berjangka bisa mencapai jumlah yang sangat besar. Oleh karena itu, Anda harus benar-
                            benar dalam memutuskan untuk melakukan transaksi, sebelum memulai transaksi Anda mencatatkan:
                        </p>
                    </div>

                    {riskDisclosurePoints.map((point, index) => (
                        <div key={point.id} className="mb-4 border-bottom pb-3">
                            <div className="mb-3">
                                <p className="mb-2">
                                    <strong>{index + 1}.</strong> <span dangerouslySetInnerHTML={{ __html: point.text }} />
                                </p>
                            </div>
                            <div className="mb-2">
                                <Form.Label className="text-muted mb-1"><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></Form.Label>
                                <Form.Check
                                    type="checkbox"
                                    id={`${point.id}-checkbox`}
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data[point.id] || false}
                                    onChange={(e) => handleCheckboxChange(point.id, e.target.checked)}
                                    required
                                />
                            </div>
                        </div>
                    ))}

                    <div className="border-top pt-4 mt-4">
                        <div className="text-center mb-4">
                            <h5 className="text-primary">PERNYATAAN MENERIMA PEMBERITAHUAN ADANYA RISIKO</h5>
                        </div>
                        
                        <div className="mb-4">
                            <p>
                                Dengan mengisi kolom "YA" di bawah, saya menyatakan bahwa saya telah menerima
                                "DOKUMEN PEMBERITAHUAN ADANYA RISIKO" mengerti dan menyetujui isinya.
                            </p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Pernyataan Menerima / Tidak (Statement to Accept / Not) <span className="text-danger">*</span></strong></Form.Label>
                            <div className="d-flex gap-4">
                                <Form.Check
                                    type="radio"
                                    id="final-acceptance-ya"
                                    name="finalAcceptance"
                                    label="Ya (Yes)"
                                    value="ya"
                                    checked={data.finalAcceptance === 'ya'}
                                    onChange={(e) => onChange({ ...data, finalAcceptance: e.target.value })}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    id="final-acceptance-tidak"
                                    name="finalAcceptance"
                                    label="Tidak (No)"
                                    value="tidak"
                                    checked={data.finalAcceptance === 'tidak'}
                                    onChange={(e) => onChange({ ...data, finalAcceptance: e.target.value })}
                                    required
                                />
                            </div>
                            {data.finalAcceptance === 'tidak' && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Menerima Pada Tanggal:</strong></Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.riskDisclosureDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                                onChange={(e) => onChange({ ...data, riskDisclosureDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const AccountApplicationSummaryStep = ({ data = {}, onChange, allData = {} }) => {
    // Flatten all form data from all steps into a single object
    const flattenedData = Object.values(allData).reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">
                        APLIKASI PEMBUKAAN REKENING TRANSAKSI SECARA ELEKTRONIK ONLINE
                    </h5>
                </Card.Header>
                <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="mb-4">
                        <p><strong>Kode Nasabah:</strong> {flattenedData.kodeNasabah || 'Will be assigned upon approval'}</p>
                    </div>

                    {/* DATA PRIBADI */}
                    <div className="mb-5">
                        <h5 className="text-center mb-4 border-bottom pb-2"><strong>DATA PRIBADI</strong></h5>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Nama Lengkap</strong></Col>
                            <Col md={8}>: {flattenedData.namaLengkap || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Tempat, Tanggal Lahir</strong></Col>
                            <Col md={8}>: {flattenedData.tempatLahir || ''}, {flattenedData.tanggalLahir || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. KTP</strong></Col>
                            <Col md={8}>: {flattenedData.noKTP || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. NPWP</strong></Col>
                            <Col md={8}>: {flattenedData.noNPWP || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Jenis Kelamin</strong></Col>
                            <Col md={8}>: {flattenedData.jenisKelamin || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Nama Ibu Kandung</strong></Col>
                            <Col md={8}>: {flattenedData.namaIbuKandung || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Status Perkawinan</strong></Col>
                            <Col md={8}>: {flattenedData.statusPerkawinan || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Nama Istri/Suami</strong></Col>
                            <Col md={8}>: {flattenedData.namaIstriSuami || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Alamat Rumah</strong></Col>
                            <Col md={8}>: {flattenedData.streetAddress || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. Telepon Rumah</strong></Col>
                            <Col md={8}>: {flattenedData.noTelephoneRumah || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. Handphone</strong></Col>
                            <Col md={8}>: {flattenedData.noHandphone || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. Faksimili Rumah</strong></Col>
                            <Col md={8}>: {flattenedData.noFaksimiliRumah || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>E-mail</strong></Col>
                            <Col md={8}>: {flattenedData.email || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Status Kepemilikan Rumah</strong></Col>
                            <Col md={8}>: {flattenedData.statusKepemilikanRumah || ''}{flattenedData.statusKepemilikanRumahOther ? ` - ${flattenedData.statusKepemilikanRumahOther}` : ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Tujuan Pembukaan Rekening</strong></Col>
                            <Col md={8}>: {flattenedData.tujuanPembukaanRekening || ''}{flattenedData.tujuanPembukaanRekeningOther ? ` - ${flattenedData.tujuanPembukaanRekeningOther}` : ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Pengalaman Investasi</strong></Col>
                            <Col md={8}>: {flattenedData.pengalamanInvestasi || ''}{flattenedData.pengalamanInvestasiBidang ? ` - ${flattenedData.pengalamanInvestasiBidang}` : ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Apakah Anda memiliki anggota keluarga yang bekerja di BAPPEBTI/Bursa Berjangka/Kliring Berjangka?</strong></Col>
                            <Col md={8}>: {flattenedData.anggotaKeluargaBAPPEBTI || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Apakah Anda telah dinyatakan pailit oleh Pengadilan?</strong></Col>
                            <Col md={8}>: {flattenedData.pernahPailit || ''}</Col>
                        </Row>
                    </div>

                    {/* PIHAK YANG DIHUBUNGI DALAM KEADAAN DARURAT */}
                    <div className="mb-5">
                        <h5 className="text-center mb-4 border-bottom pb-2"><strong>PIHAK YANG DIHUBUNGI DALAM KEADAAN DARURAT</strong></h5>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Nama Lengkap</strong></Col>
                            <Col md={8}>: {flattenedData.emergencyContactName || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Alamat</strong></Col>
                            <Col md={8}>: {flattenedData.emergencyContactStreetAddress || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Kota & Kode Pos</strong></Col>
                            <Col md={8}>: {flattenedData.emergencyContactCity || ''}, {flattenedData.emergencyContactPostalCode || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. Handphone</strong></Col>
                            <Col md={8}>: {flattenedData.emergencyContactPhone || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Hubungan</strong></Col>
                            <Col md={8}>: {flattenedData.emergencyContactRelationship || ''}{flattenedData.emergencyContactRelationshipOther ? ` - ${flattenedData.emergencyContactRelationshipOther}` : ''}</Col>
                        </Row>
                    </div>

                    {/* DATA PEKERJAAN */}
                    <div className="mb-5">
                        <h5 className="text-center mb-4 border-bottom pb-2"><strong>DATA PEKERJAAN</strong></h5>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Pekerjaan</strong></Col>
                            <Col md={8}>: {flattenedData.jenisPekerjaan || ''}{flattenedData.jenisPekerjaanOther ? ` - ${flattenedData.jenisPekerjaanOther}` : ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Nama Perusahaan</strong></Col>
                            <Col md={8}>: {flattenedData.namaPerusahaan || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Bidang Usaha</strong></Col>
                            <Col md={8}>: {flattenedData.bidangUsaha || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Jabatan</strong></Col>
                            <Col md={8}>: {flattenedData.jabatan || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Lama Bekerja</strong></Col>
                            <Col md={8}>: {flattenedData.lamaBekerja || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Kantor Sebelumnya</strong></Col>
                            <Col md={8}>: {flattenedData.kantorSebelumnya || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Alamat Kantor</strong></Col>
                            <Col md={8}>: {flattenedData.alamatKantor || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Kota & Kode Pos</strong></Col>
                            <Col md={8}>: {flattenedData.kotaKantor || ''}, {flattenedData.postalCodeKantor || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. Telepon Kantor</strong></Col>
                            <Col md={8}>: {flattenedData.noTeleponKantor || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>No. Faksimili</strong></Col>
                            <Col md={8}>: {flattenedData.noFaksimiliKantor || ''}</Col>
                        </Row>
                    </div>

                    {/* DAFTAR KEKAYAAN */}
                    <div className="mb-5">
                        <h5 className="text-center mb-4 border-bottom pb-2"><strong>DAFTAR KEKAYAAN</strong></h5>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Penghasilan Pertahun</strong></Col>
                            <Col md={8}>: {flattenedData.penghasilanPertahun || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Lokasi Rumah</strong></Col>
                            <Col md={8}>: {flattenedData.lokasiRumah || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Nilai (NJOP)</strong></Col>
                            <Col md={8}>: {flattenedData.nilaiNJOP || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Deposit Bank</strong></Col>
                            <Col md={8}>: {flattenedData.depositBank || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Jumlah</strong></Col>
                            <Col md={8}>: {flattenedData.totalKekayaan || ''}</Col>
                        </Row>
                        
                        <Row className="mb-2">
                            <Col md={4}><strong>Lainnya</strong></Col>
                            <Col md={8}>: {flattenedData.lainnya || ''}</Col>
                        </Row>
                    </div>

                    {/* REKENING BANK NASABAH */}
                    <div className="mb-5">
                        <h5 className="text-center mb-4 border-bottom pb-2"><strong>REKENING BANK NASABAH UNTUK PENYETORAN DAN PENARIKAN MARGIN</strong></h5>
                        
                        {flattenedData.bankAccounts && flattenedData.bankAccounts.length > 0 ? (
                            flattenedData.bankAccounts.map((account, index) => (
                                <div key={index} className={`mb-4 ${index > 0 ? 'border-top pt-3' : ''}`}>
                                    <h6><strong>Bank {index + 1}</strong></h6>
                                    <Row className="mb-2">
                                        <Col md={4}><strong>Nama Bank</strong></Col>
                                        <Col md={8}>: {account.namaBank || ''}</Col>
                                    </Row>
                                    
                                    <Row className="mb-2">
                                        <Col md={4}><strong>Cabang</strong></Col>
                                        <Col md={8}>: {account.cabang || ''}</Col>
                                    </Row>
                                    
                                    <Row className="mb-2">
                                        <Col md={4}><strong>No. Rekening</strong></Col>
                                        <Col md={8}>: {account.noRekening || ''}</Col>
                                    </Row>
                                    
                                    <Row className="mb-2">
                                        <Col md={4}><strong>Nama Pemilik Rekening</strong></Col>
                                        <Col md={8}>: {account.namaPemilikRekening || ''}</Col>
                                    </Row>
                                    
                                    <Row className="mb-2">
                                        <Col md={4}><strong>No. Telepon Bank</strong></Col>
                                        <Col md={8}>: {account.noTeleponBank || ''}</Col>
                                    </Row>
                                    
                                    <Row className="mb-2">
                                        <Col md={4}><strong>Jenis Rekening Bank</strong></Col>
                                        <Col md={8}>: {account.jenisRekeningBank || ''}</Col>
                                    </Row>
                                </div>
                            ))
                        ) : (
                            <div className="mb-4">
                                <p>No bank accounts provided</p>
                            </div>
                        )}
                    </div>

                    {/* DOKUMEN YANG DILAMPIRKAN */}
                    <div className="mb-5">
                        <h5 className="text-center mb-4 border-bottom pb-2"><strong>DOKUMEN YANG DILAMPIRKAN</strong></h5>
                        
                        {flattenedData.uploadedFiles ? (
                            Object.entries(flattenedData.uploadedFiles).map(([docType, fileInfo], index) => (
                                <Row key={index} className="mb-2">
                                    <Col md={6}><strong>{docType}</strong></Col>
                                    <Col md={6}>: <strong>Hasil Scan/Photo (Lampirkan) : {fileInfo.name || fileInfo}</strong></Col>
                                </Row>
                            ))
                        ) : (
                            // Show required documents from documentRequirements
                            <>
                                <Row className="mb-2">
                                    <Col md={6}><strong>Rekening Koran / Tagihan Kartu Kredit</strong></Col>
                                    <Col md={6}>: <strong>Status: {flattenedData.rekeningKoran ? 'Uploaded' : 'Pending Upload'}</strong></Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={6}><strong>Rekening Listrik/Telepon</strong></Col>
                                    <Col md={6}>: <strong>Status: {flattenedData.rekeningListrik ? 'Uploaded' : 'Pending Upload'}</strong></Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={6}><strong>Foto Terkini</strong></Col>
                                    <Col md={6}>: <strong>Status: {flattenedData.fotoTerkini ? 'Uploaded' : 'Pending Upload'}</strong></Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={6}><strong>KTP</strong></Col>
                                    <Col md={6}>: <strong>Status: {flattenedData.ktp ? 'Uploaded' : 'Pending Upload'}</strong></Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={6}><strong>NPWP</strong></Col>
                                    <Col md={6}>: <strong>Status: {flattenedData.npwp ? 'Uploaded' : 'Pending Upload'}</strong></Col>
                                </Row>
                            </>
                        )}
                    </div>

                    {/* PERNYATAAN KEBENARAN DAN TANGGUNG JAWAB */}
                    <div className="border-top pt-4">
                        <h5 className="text-center mb-4"><strong>PERNYATAAN KEBENARAN DAN TANGGUNG JAWAB</strong></h5>
                        
                        <div className="mb-4">
                            <p>
                                Dengan mengisi kolom "YA" di bawah ini, saya menyatakan bahwa semua informasi dan semua dokumen yang saya
                                lampirkan dalam <strong>APLIKASI PEMBUKAAN REKENING TRANSAKSI SECARA ELEKTRONIK ONLINE</strong> adalah benar
                                dan tepat, Saya akan bertanggung jawab apabila dikemudian hari terjadi sesuatu hal sehubungan dengan
                                ketidakbenaran data yang saya berikan.
                            </p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Pernyataan Kebenaran dan Tanggung Jawab <span className="text-danger">*</span></strong></Form.Label>
                            <div className="d-flex gap-4">
                                <Form.Check
                                    type="radio"
                                    id="application-summary-ya"
                                    name="applicationSummary"
                                    label="Ya"
                                    value="ya"
                                    checked={data.applicationSummary === 'ya'}
                                    onChange={(e) => onChange({ ...data, applicationSummary: e.target.value })}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    id="application-summary-tidak"
                                    name="applicationSummary"
                                    label="Tidak"
                                    value="tidak"
                                    checked={data.applicationSummary === 'tidak'}
                                    onChange={(e) => onChange({ ...data, applicationSummary: e.target.value })}
                                    required
                                />
                            </div>
                            {data.applicationSummary === 'tidak' && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Menyatakan Pada Tanggal:</strong></Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.applicationSummaryDate || '2025-04-09T20:12:56'}
                                onChange={(e) => onChange({ ...data, applicationSummaryDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const AdditionalDisclosureStatementStep = ({ data = {}, onChange }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">PERNYATAAN PENGUNGKAPAN</h5>
                    <h6 className="mb-0 text-secondary text-center">(DISCLOSURE STATEMENT)</h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <ol className="list-unstyled">
                            <li className="mb-3">
                                <strong>1.</strong> Perdagangan Berjangka <strong>Berisiko SANGAT TINGGI</strong> tidak cocok untuk semua orang. Pastikan bahwa Anda <strong>SEPENUHNYA MEMAHAMI RISIKO</strong> ini sebelum melakukan perdagangan.
                            </li>
                            <li className="mb-3">
                                <strong>2.</strong> Perdagangan Berjangka merupakan produk keuangan dengan leverage dan dapat menyebabkan <strong>KERUGIAN ANDA MELEBIHI</strong> setoran awal Anda. Anda harus siap apabila <strong>SELURUH DANA ANDA</strong> Habis.
                            </li>
                            <li className="mb-3">
                                <strong>3.</strong> <strong>TIDAK ADA</strong> pendapatan <strong>TETAP (FIXED INCOME)</strong> dalam Perdagangan Berjangka.
                            </li>
                            <li className="mb-3">
                                <strong>4.</strong> Apabila Anda <strong>PEMULA</strong> kami sarankan untuk mempelajari mekanisme transaksinya, <strong>PERDAGANGAN BERJANGKA</strong> membutuhkan pengetahuan dan pemahaman khusus.
                            </li>
                            <li className="mb-3">
                                <strong>5.</strong> <strong>ANDA HARUS MELAKUKAN TRANSAKSI SENDIRI</strong>, segala risiko yang akan timbul akibat transaksi sepenuhnya akan menjadi tanggung jawab Saudara.
                            </li>
                            <li className="mb-3">
                                <strong>6.</strong> <strong>User id</strong> dan <strong>password</strong> bersifat <strong>PRIBADI DAN RAHASIA</strong>, anda bertanggung jawab atas penggunaannya, <strong>JANGAN SERAHKAN</strong> ke pihak lain terutama Wakil Pialang Berjangka dan pegawai Pialang Berjangka.
                            </li>
                            <li className="mb-3">
                                <strong>7.</strong> <strong>ANDA</strong> berhak menerima <strong>LAPORAN ATAS TRANSAKSI</strong> yang anda lakukan. Waktu anda <strong>2 X 24 JAM UNTUK MEMBERIKAN SANGGAHAN</strong>. Untuk transaksi yang telah Selesai <strong>(DONE/SETTLE) DAPAT ANDA CEK</strong> melalui sistem informasi transaksi nasabah yang berfungsi untuk memastikan transaksi anda telah terdaftar di Lembaga Kliring Berjangka.
                            </li>
                        </ol>
                    </div>

                    <div className="border-top pt-4">
                        <p className="text-center mb-4">
                            <strong>SECARA DETAIL BACA DOKUMEN PEMBERITAHUAN ADANYA RISIKO DAN DOKUMEN PERJANJIAN PEMBERIAN AMANAT</strong>
                        </p>
                        <p className="text-center mb-4">
                            Untuk mempelajari lebih lanjut mengenai Perdagangan Berjangka dapat anda mengunjungi situs{' '}
                            <a href="https://www.bappebti.go.id" target="_blank" rel="noopener noreferrer" className="text-primary">
                                www.bappebti.go.id
                            </a>
                        </p>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check
                                type="radio"
                                id="additional-disclosure-ya"
                                name="additionalDisclosureStatement"
                                label="Ya"
                                value="ya"
                                checked={data.additionalDisclosureStatement === 'ya'}
                                onChange={(e) => onChange({ ...data, additionalDisclosureStatement: e.target.value })}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="additional-disclosure-tidak"
                                name="additionalDisclosureStatement"
                                label="Tidak"
                                value="tidak"
                                checked={data.additionalDisclosureStatement === 'tidak'}
                                onChange={(e) => onChange({ ...data, additionalDisclosureStatement: e.target.value })}
                                required
                            />
                        </div>
                        {data.additionalDisclosureStatement === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Pada Tanggal:</strong></Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={data.additionalDisclosureDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                            onChange={(e) => onChange({ ...data, additionalDisclosureDate: e.target.value })}
                            required
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
        </div>
    );
};

const ElectronicAgreementStep = ({ data = {}, onChange }) => {
    // Function to generate current date in Indonesian format
    const getCurrentIndonesianDate = () => {
        const now = new Date();
        
        const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        
        const dayName = dayNames[now.getDay()];
        const date = now.getDate().toString().padStart(2, '0');
        const month = monthNames[now.getMonth()];
        const year = now.getFullYear();
        
        return `${dayName}, tanggal ${date}, bulan ${month}, tahun ${year}`;
    };

    // CSS styles for field alignment
    const fieldStyles = {
        fieldRow: {
            display: 'flex',
            marginBottom: '8px',
            alignItems: 'flex-start'
        },
        fieldLabel: {
            width: '200px',
            flexShrink: 0,
            fontWeight: 'bold'
        },
        fieldContent: {
            flex: 1,
            paddingLeft: '10px'
        },
        multiLineContent: {
            paddingLeft: '210px',
            marginTop: '0px'
        }
    };

    return (
        <div>
            <Card className="border-0 shadow-sm mb-2">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">
                        PERJANJIAN PEMBERIAN AMANAT SECARA ELEKTRONIK ONLINE
                    </h5>
                    <h6 className="mb-0 text-secondary text-center">
                        UNTUK TRANSAKSI KONTRAK BERJANGKA
                    </h6>
                </Card.Header>
                <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="text-center mb-4">
                        <h6 className="text-primary"><strong>PERHATIAN !</strong></h6>
                        <p><strong>PERJANJIAN INI MERUPAKAN KONTRAK HUKUM.</strong></p>
                        <p><strong>HARAP DIBACA DENGAN SEKSAMA.</strong></p>
                    </div>

                    <div className="mb-4">
                        <p>Pada hari ini {getCurrentIndonesianDate()}, kami yang mengisi perjanjian di bawah ini:</p>
                        
                        <div className="mb-3">
                            <p><strong>1. Nama</strong> : mmmmm</p>
                            <p style={{ marginLeft: '17px' }}><strong>Pekerjaan/Jabatan</strong> : Mahasiswa (Students)</p>
                            <p style={{ marginLeft: '17px' }}><strong>Alamat</strong> : 28 Barker Street, Kingsford, Sydney, 2017</p>
                        </div>
                        
                        <p>Dalam hal ini bertindak untuk dan atas nama sendiri yang selanjutnya disebut Nasabah.</p>
                        
                        <div className="mb-3">
                            <p><strong>2. Nama</strong> : Petugas Wakil Pialang Berjangka yang ditunjuk memverifikasi</p>
                            <p style={{ marginLeft: '17px' }}><strong>Pekerjaan/Jabatan</strong> : (Petugas Wakil Pialang Berjangka yang ditunjuk memverifikasi)</p>
                            <p style={{ marginLeft: '17px' }}><strong>Alamat</strong> : Soho Capital Office Building Lt.16, Unit 1608-09, Jl. Letjen S. Parman Kav. 28, Kel. Tanjung Duren Selatan, Kec. Grogol Petamburan, Jakarta, Indonesia Kode Pos: 11470</p>
                        </div>
                        
                        <p>Dalam hal ini bertindak untuk dan atas nama PT GENESIS GEMILANG FUTURES yang selanjutnya disebut Pialang Berjangka.</p>
                        
                        <p>Nasabah dan Pialang Berjangka secara bersama-sama selanjutnya disebut Para Pihak.</p>
                        
                        <p>Para Pihak sepakat untuk mengadakan Perjanjian Pemberian Amanat untuk melakukan transaksi penjualan maupun pembelian Kontrak Berjangka dengan ketentuan sebagai berikut:</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>1. Margin dan Pembayaran Lainnya</strong></h6>
                        <p>(1) Nasabah menempatkan sejumlah dana (Margin) ke Rekening Terpisah (Segregated Account) Pialang Berjangka sebagai Margin awal dan wajib mempertahankannya sebagaimana ditetapkan.</p>
                        <p>(2) Membayar biaya-biaya yang diperlukan untuk transaksi yaitu biaya transaksi, pajak, komisi, dan biaya pelayanan, biaya bunga sesuai tingkat yang berlaku, dan biaya lainnya yang dapat dipertanggungjawabkan berkaitan dengan transaksi sesuai amanat Nasabah, maupun biaya rekening Nasabah.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>2. Pelaksanaan Amanat</strong></h6>
                        <p>(1) Setiap amanat yang disampaikan oleh Nasabah atau kuasanya yang ditunjuk secara tertulis oleh Nasabah, dianggap sah apabila diterima oleh Pialang Berjangka sesuai dengan ketentuan yang berlaku, dapat berupa amanat tertulis yang ditandatangani oleh Nasabah atau kuasanya, amanat telepon yang direkam, dan/atau amanat transaksi elektronik lainnya.</p>
                        <p>(2) Setiap amanat Nasabah yang diterima dapat langsung dilaksanakan sepanjang nilai Margin yang tersedia pada rekeningnya mencukupi dan eksekusinya tergantung pada kondisi dan sistem transaksi yang berlaku yang mungkin dapat menimbulkan perbedaan waktu terhadap proses pelaksanaan amanat tersebut. Nasabah harus mengetahui posisi Margin dan posisi terbuka sebelum memberikan amanat untuk transaksi berikutnya.</p>
                        <p>(3) Amanat Nasabah hanya dapat dibatalkan dan/atau diperbaiki apabila transaksi atas amanat tersebut belum terjadi. Pialang Berjangka tidak bertanggung jawab atas kerugian yang timbul akibat tidak terlaksananya pembatalan dan/atau perbaikan sepanjan bukan karena kelalaian Pialang Berjangka.</p>
                        <p>(4) Pialang Berjangka berhak menolak amanat Nasabah apabila harga yang ditawarkan atau diminta tidak wajar.</p>
                        <p>(5) Nasabah bertanggung jawab atas keamanan dan penggunaan username dan password dalam transaksi Perdagangan Berjangka, oleh karenanya Nasabah dilarang memberitahukan, menyerahkan, atau meminjamkan username dan password kepada pihak lain, termasuk kepada pegawai Pialang Berjangka.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>3. Antisipasi Penyerahan Barang</strong></h6>
                        <p>(1) Untuk kontrak-kontrak tertentu penyelesaian transaksi dapat dilakukan dengan penyerahan atau penerimaan barang (delivery) apabila kontrak jatuh tempo. Nasabah menyadari bahwa penyerahan atau penerimaan barang mengandung risiko yang lebih besar daripada melikuidasi posisi dengan offset. Penyerahan fisik barang memiliki konsekuensi kebutuhan dana yang lebih besar serta tambahan biaya pengelolaan barang.</p>
                        <p>(2) Pialang Berjangka tidak bertanggung jawab atas klasifikasi mutu (grade), kualitas atau tingkat toleransi atas komoditi yang diserahkan atau akan diserahkan.</p>
                        <p>(3) Pelaksanaan penyerahan atau penerimaan barang tersebut akan diatur dan dijamin oleh Lembaga Kliring Berjangka.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>4. Kewajiban Memelihara Margin</strong></h6>
                        <p>(1) Nasabah wajib memelihara / memenuhi tingkat Margin yang harus tersedia di rekening pada Pialang Berjangka sesuai dengan jumlah yang telah ditetapkan baik diminta ataupun tidak oleh Pialang Berjangka.</p>
                        <p>(2) Apabila jumlah Margin memerlukan penambahan maka Pialang Berjangka wajib Memberitahukan dan memintakan kepada Nasabah untuk menambah Margin segera.</p>
                        <p>(3) Apabila jumlah Margin memerlukan tambahan (Call Margin) maka Nasabah wajib melakukan penyerahan Call Margin selambat-lambatnya sebelum dimulai hari perdagangan berikutnya. Kewajiban Nasabah sehubungan dengan penyerahan Call Margin tidak terbatas pada jumlah Margin awal.</p>
                        <p>(4) Pialang Berjangka tidak berkewajiban melaksanakan amanat untuk melakukan transaksi yang baru dari Nasabah sebelum Call Margin dipenuhi.</p>
                        <p>(5) Untuk memenuhi kewajiban Call Margin dan keuangan lainnya dari Nasabah, Pialang Berjangka dapat mencairkan dana Nasabah yang ada di Pialang Berjangka.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>5. Hak Pialang Berjangka Melikuidasi Posisi Nasabah</strong></h6>
                        <p>Nasabah bertanggung jawab memantau / mengetahui posisi terbukanya secara terus-menerus dan memenuhi kewajibannya. Apabila dalam jangka waktu tertentu dana pada rekening Nasabah kurang dari yang dipersyaratkan, Pialang Berjangka dapat menutup posisi terbuka Nasabah secara keseluruhan atau sebagian, membatasi transaksi, atau tindakan lain untuk melindungi diri dalam pemenuhan Margin tersebut dengan terlebih dahulu memberitahu atau tanpa memberitahu Nasabah dan Pialang Berjangka tidak bertanggung jawab atas kerugian yang timbul akibat Tindakan tersebut.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>6. Pengadaan Kerugian Tidak Menyerahkan Barang</strong></h6>
                        <p>Apabila Nasabah tidak mampu menyerahkan komoditi atas Kontrak Berjangka yang jatuh tempo, Nasabah berkewajiban untuk membeli komoditi tersebut di pasar untuk penyerahan tersebut. Apabila Nasabah wajib membayar secepatnya semua kerugian dan premi yang telah dibayarkan oleh Pialang Berjangka atas tindakan "tersebut. Apabila Pialang Berjangka harus menerima penyerahan komoditi atau surat berharga maka Nasabah bertanggung jawab atas penuntutan nilai dari komoditi atau surat berharga tersebut.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>7. Pengadaan Kerugian Tidak Adanya Penutupan Posisi</strong></h6>
                        <p>Apabila Nasabah tidak mampu melakukan penutupan atas transaksi yang jatuh tempo, Pialang Berjangka dapat melakukan penutupan atas transaksi di Bursa. Nasabah wajib membayar biaya-biaya, termasuk biaya kerugian dan premi yang telah dibayarkan oleh Pialang Berjangka, dan apabila Nasabah lalai untukmembayar biaya-biaya tersebut, Pialang Berjangka berhak untuk mengambil pembayaran dari dana Nasabah.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>8. Pialang Berjangka Dapat Membatasi Posisi</strong></h6>
                        <p>Nasabah mengakui hak Pialang Berjangka untuk membatasi posisi terbuka Kontrak Berjangka Nasabah dan Nasabah tidak melakukan transaksi melebihi batas yang telah ditetapkan tersebut.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>9. Tidak Ada Jaminan atas Informasi atau Rekomendasi</strong></h6>
                        <p>Nasabah mengakui bahwa:</p>
                        <p>(1) Informasi dan rekomendasi yang diberikan oleh Pialang Berjangka kepada Nasabah tidak selalu Lengkap dan perlu diverifikasi.</p>
                        <p>(2) Pialang Berjangka tidak menjamin bahwa informasi dan rekomendasi yang diberikan merupakan informasi yang akurat dan lengkap.</p>
                        <p>(3) Informasi dan rekomendasi yang diberikan oleh Wakil Pialang Berjangka yang satu dengan yang lain mungkin berbeda karena perbedaan analisis fundamental atau teknikal. Nasabah menyadari bahwa ada kemungkinan Pialang Berjangka dan pihak terafiliasinya memiliki posisi di pasar dan memberikan rekomendasi tidak konsisten kepada Nasabah.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>10. Pembatasan Tanggung Jawab Pialang Berjangka</strong></h6>
                        <p>(1) Pialang Berjangka tidak bertanggung jawab untuk memberikan penilaian kepada Nasabah mengenai iklim, pasar, keadaan politik dan ekonomi nasional dan internasional, nilai kontrak berjangka, kolateral, atau memberikan nasihat mengenai keadaan pasar. Pialang Berjangka hanya memberikan pelayanan untuk melakukan transaksi secara jujur serta memberikan Laporan atas transaksi tersebut.</p>
                        <p>(2) Perdagangan sewaktu-waktu dapat dihentikan oleh pihak yang memiliki otoritas (Bappebti/Bursa Berjangka) tanpa pemberitahuan terlebih dahulu kepada Nasabah. Atas posisi terbuka yang masih dimiliki oleh Nasabah pada saat perdagangan tersebut dihentikan, maka akan diselesaikan (likuidasi) berdasarkan pada peraturan/ketentuan yang dikeluarkan dan ditetapkan oleh pihak otoritas tersebut, dan semua kerugian serta biaya yang timbul sebagai akibat dihentikannya transaksi oleh pihak otoritas perdagangan tersebut, menjadi beban dan tanggung jawab Nasabah sepenuhnya.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>11. Transaksi Harus Mematuhi Peraturan Yang Berlaku</strong></h6>
                        <p>Semua transaksi baik yang dilakukan sendiri oleh Nasabah maupun melalui Pialang Berjangka wajib mematuhi peraturan perundang-undangan di bidang Perdagangan Berjangka, kebiasaan dan interpretasi resmi yang ditetapkan oleh Bappebti atau Bursa Berjangka.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>12. Pialang Berjangka tidak Bertanggung jawab atas Kegagalan Komunikasi</strong></h6>
                        <p>Pialang Berjangka tidak bertanggung jawab atas keterlambatan atau tidak tepat waktunya pengiriman amanat atau informasi lainnya yang disebabkan oleh kerusakan fasilitas komunikasi atau sebab lain diluar kontrol Pialang Berjangka.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>13. Konfirmasi</strong></h6>
                        <p>(1) Konfirmasi dari Nasabah dapat berupa surat, telex, media lain, secara tertulis ataupun rekaman suara.</p>
                        <p>(2) Pialang Berjangka berkewajiban menyampaikan konfirmasi transaksi, laporan rekening, permintaan Call Margin, dan pemberitahuan lainnya kepada Nasabah secara akurat, benar dan secepatnya pada alamat Nasabah sesuai dengan yang tertera dalam rekening Nasabah. Apabila dalam jangka waktu 2 x 24 jam setelah amanat jual atau beli disampaikan, tetapi Nasabah belum menerima konfirmasi tertulis, Nasabah segera memberitahukan hal tersebut kepada Pialang Berjangka melalui telepon dan disusul dengan pemberitahuan tertulis.</p>
                        <p>(3) Jika dalam waktu 2 x 24 jam sejak tanggal penerimaan konfirmasi tertulis tersebut tidak ada sanggahan dari Nasabah maka konfirmasi Pialang Berjangka dianggap benar dan sah.</p>
                        <p>(4) Kekeliruan atas konfirmasi yang diterbitkan Pialang Berjangka akan diperbaiki oleh Pialang Berjangka sesuai keadaan yang sebenarnya dan demi hukum konfirmasi yang lama batal.</p>
                        <p>(5) Nasabah tidak bertanggung jawab atas transaksi yang dilaksanakan atas rekeningnya apabila konfirmasi tersebut tidak disampaikan secara benar dan akurat.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>14. Kebenaran Informasi Nasabah</strong></h6>
                        <p>Nasabah memberikan informasi yang benar dan akurat mengenai data Nasabah yang diminta oleh Pialang Berjangka dan akan memberitahukan paling lambat dalam waktu 3 (tiga) hari kerja setelah terjadi perubahan, termasuk perubahan kemampuan keuangannya untuk terus melaksanakan transaksi.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>15. Komisi Transaksi</strong></h6>
                        <p>Nasabah mengetahui dan menyetujui bahwa Pialang Berjangka berhak untuk memungut komisi atas transaksi yang telah dilaksanakan, dalam jumlah sebagaimana akan ditetapkan dari waktu ke waktu oleh Pialang Berjangka. Perubahan beban (fees) dan biaya lainnya harus disetujui secara tertulis oleh Para Pihak.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>16. Pemberian Kuasa</strong></h6>
                        <p>(1) Nasabah memberikan kuasa kepada Pialang Berjangka untuk menghubungi bank, Lembaga keuangan, Pialang Berjangka lain, atau institusi lain yang terkait untuk memperoleh keterangan atau verifikasi mengenai informasi yang diterima dari Nasabah. Nasabah mengerti bahwa penelitian mengenai data hutang pribadi dan bisnis dapat dilakukan oleh Pialang Berjangka apabila diperlukan. Nasabah diberikan kesempatan untuk memberitahukan secara tertulis dalam jangka waktu yang telah disepakati untuk melengkapi persyaratan yang diperlukan.</p>
                        <p>(2) Nasabah dapat juga memberikan kuasa kepada pihak lain (bukan Pengurus Pialang Berjangka bukan Wakil Pialang Berjangka yang menanda-tangani perjanjian ini dan bukan pegawai Pialang Berjangka yang jabatannya satu tingkat di bawah Direksi) yang ditunjuk oleh Nasabah untuk menjalankan hak-hak yang timbul atas rekening, termasuk memberikan instruksi kepada Pialang Berjangka atas rekening yang dimiliki Nasabah, berdasarkan surat kuasa dalam bentuk dan isi yang tidak bertentangan dengan ketentuan Peraturan Perundang-undangan. </p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>17. Pemindahan Dana</strong></h6>
                        <p>Pialang Berjangka dapat setiap saat mengalihkan dana dari satu rekening ke rekening lainnya berkaitan dengan kegiatan transaksi yang dilakukan Nasabah seperti pembayaran komisi, pembayaran biaya transaksi, kliring, dan keterlambatan dalam memenuhi kewajibannya, tanpa terlebih dahulu memberitahukan kepada Nasabah. Transfer yang telah dilakukan akan segera diberitahukan secara tertulis kepada Nasabah.</p>
                    </div>

                    <div className="mb-2">
                        <h6><strong>18. Pemberitahuan</strong></h6>
                        <p>(1) Semua komunikasi, uang, surat berharga, dan kekayaan lainnya harus dikirimkan langsung ke alamat Nasabah seperti tertera dalam rekeningnya atau alamat lain yang ditetapkan/diberitahukan secara tertulis oleh Nasabah.</p>
                        <p>(2) Semua uang, harus disetor atau ditransfer langsung oleh Nasabah ke Rekening Terpisah (Segregated Account) Pialang Berjangka:</p>
                        <div className="ms-4">
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>a. Nama :</span>
                                <span style={fieldStyles.fieldContent}>PT GENESIS GEMILANG FUTURES</span>
                            </div>
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>b. Alamat :</span>
                                <span style={fieldStyles.fieldContent}>SOHO CAPITAL OFFICE BUILDING</span>
                            </div>
                            <div style={fieldStyles.multiLineContent}>
                                Lantai 16 Unit 1608-09, Jalan Letnan Jenderal S.<br />
                                Parman Kavling 28,<br />
                                Kelurahan Tanjung Duren Selatan, Kecamatan<br />
                                Grogol Petamburan, Jakarta Barat, Kode Pos 11470,<br />
                                Indonesia
                            </div>
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>c. Bank :</span>
                                <span style={fieldStyles.fieldContent}>Bank CIMB NIAGA Kantor Cabang Jakarta Cideng</span>
                            </div>
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>d. No. Rekening Terpisah :</span>
                                <span style={fieldStyles.fieldContent}>808777699500 (IDR)</span>
                            </div>
                            <div style={fieldStyles.multiLineContent}>
                                808777776540 (USD)
                            </div>
                        </div>
                        <p>dan dianggap sudah diterima oleh Pialang Berjangka apabila sudah ada tanda terima bukti setor atau transfer dari pegawai Pialang Berjangka.</p>
                    </div>

                    <div className="mb-4">
                        <p>(3) Semua surat berharga, kekayaan lainnya, atau komunikasi harus dikirim kepada Pialang Berjangka:</p>
                        <div className="ms-4">
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>a. Nama :</span>
                                <span style={fieldStyles.fieldContent}>PT GENESIS GEMILANG FUTURES</span>
                            </div>
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>b. Alamat :</span>
                                <span style={fieldStyles.fieldContent}>SOHO CAPITAL OFFICE BUILDING</span>
                            </div>
                            <div style={fieldStyles.multiLineContent}>
                                Lantai 16 Unit 1608-09, Jalan Letnan Jenderal S.<br />
                                Parman Kavling 28,<br />
                                Kelurahan Tanjung Duren Selatan, Kecamatan<br />
                                Grogol Petamburan, Jakarta Barat, Kode Pos 11470,<br />
                                Indonesia
                            </div>
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>c. Telepon :</span>
                                <span style={fieldStyles.fieldContent}>(+62)21-50100572</span>
                            </div>
                            <div style={fieldStyles.fieldRow}>
                                <span style={fieldStyles.fieldLabel}>d. E-Mail :</span>
                                <span style={fieldStyles.fieldContent}>support@genesis.co.id</span>
                            </div>
                        </div>
                        <p>dan dianggap sudah diterima oleh Pialang Berjangka apabila sudah ada tanda bukti penerimaan dari pegawai Pialang Berjangka.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>19. Dokumen Pemberitahuan Adanya Risiko</strong></h6>
                        <p>Nasabah mengaku menerima dan mengerti Dokumen Pemberitahuan Adanya Risiko.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>20. Jangka Waktu Perjanjian dan Pengakhiran</strong></h6>
                        <p>(1) Perjanjian ini mulai berlaku terhitung sejak tanggal ditandatanganinya sampai disampaikannya pemberitahuan pengakhiran tertulis dari Nasabah atau Pialang Berjangka.</p>
                        <p>(2) Nasabah dapat mengakhiri Perjanjian ini hanya jika Nasabah sudah tidak lagi memiliki posisi terbuka dan tidak ada kewajiban Nasabah yang diemban oleh atau terhutang kepada Pialang Berjangka.</p>
                        <p>(3) Pengakhiran tidak membebaskan salah satu Pihak dari tanggung jawab atau kewajiban yang terjadi sebelum pemberitahuan tersebut.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>21. Berakhirnya Perjanjian</strong></h6>
                        <p>Perjanjian dapat berakhir dalam hal Nasabah:</p>
                        <p>(1) Dinyatakan pailit, memiliki hutang yang sangat besar, dalam proses peradilan, menjadi hilang ingatan, mengundurkan diri atau meninggal;</p>
                        <p>(2) Tidak dapat memenuhi atau mematuhi perjanjian ini dan/atau melakukan pelanggaran terhadapnya;</p>
                        <p>(3) Berkaitan dengan ayat (1) dan ayat (2) tersebut diatas, Pialang Berjangka dapat:</p>
                        <p style={{marginLeft: '30px'}}>(i) Meneruskan atau menutup posisi Nasabah tersebut setelah mempertimbangkannya secara cermat dan jujur; dan</p>
                        <p style={{marginLeft: '30px'}}>(ii) Menolak perintah dari Nasabah atau kuasanya.</p>
                        <p>(4) Pengakhiran Perjanjian sebagaimana dimaksud dengan angka (1) dan (2) tersebut diatas tidak melepaskan kewajiban dari Para pihak yang berhubungan dengan penerimaan atau kewajiban pembayaran atau pertanggungjawaban kewajiban lainnya yang timbul dari perjanjian.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>22. Force Majeur</strong></h6>
                        <p>Tidak ada satupun pihak di dalam Perjanjian dapat diminta pertanggungjawabannya untuk suatu keterlambatan atau terhalangnya memenuhi kewajiban berdasarkan Perjanjian yang diakibatkan oleh suatu sebab yang berada di luar kemampuannya atau kekuasaannya (force majeur), sepanjang pemberitahuan tertulis mengenai sebab itu disampaikannya kepada pihak lain dalam Perjanjian dalam waktu tidak lebih dari 24  dua puluh empat) jam sejak timbulnya sebab itu. Yang dimaksud dengan Force Majeure dalam Perjanjian adalah peristiwa kebakaran, bencana alam (seperti gempa bumi, banjir, angin topan, petir), pemogokan umum, huru hara, peperangan, perubahan terhadap peraturan perundangundangan yang berlaku dan kondisi di bidang ekonomi, keuangan dan Perdagangan Berjangka, pembatasan yang dilakukan oleh otoritas Perdagangan Berjangka dan Bursa Berjangka serta terganggunya sistem perdagangan, kliring dan penyelesaian transaksi Kontrak Berjangka di mana transaksi dilaksanakan yang secara langsung mempengaruhi pelaksanaan pekerjaan berdasarkan perjanjian.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>23. Perubahan atas lain dalam Perjanjian Pemberian Amanat</strong></h6>
                        <p>Perubahan atas isian dalam Perjanjian ini hanya dapat dilakukan atas persetujuan Para Pihak, atau Pialang Berjangka telah memberitahukan secara tertulis perubahan yang diinginkan, dan Nasabah tetap memberikan perintah untuk transaksi dengan tanpa memberikan tanggapan secara tertulis atas usul perubahan tersebut. Tindakan Nasabah tersebut dianggap setuju atas usul perubahan tersebut.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>24. Penyelesaian Perselisihan</strong></h6>
                        <p>(1) Semua perselisihan dan perbedaan pendapat yang timbul dalam pelaksanaan Perjanjian ini wajib diselesaikan terlebih dahulu secara musyawarah untuk mencapai mufakat antara Para Pihak.</p>
                        <p>(2) Apabila perselisihan dan perbedaan pendapat yang timbul tidak dapat diselesaikan secara musyawarah untuk mencapai mufakat, Para Pihak wajib memanfaatkan sarana penyelesaian Perselisihan yang tersedia di Bursa Berjangka.</p>
                        <p>(3) Apabila perselisihan dan perbedaan pendapat yang timbul tidak dapat diselesaikan melalui cara sebagaimana dimaksud pada angka (1) dan angka (2), maka Para Pihak sepakat untuk menyelesaikan perselisihan melalui:</p>
                        
                        <div className="border p-3 bg-light mb-3">
                            <p className="text-danger mb-2"><strong>Penyelesaian Perselisihan Melalui :</strong></p>
                            <Form.Check
                                type="checkbox"
                                id="dispute-bappebti"
                                label="Badan Arbitrase Perdagangan Berjangka Komoditi (BAKTI)"
                                checked={data.disputeResolutionBappebti || false}
                                onChange={(e) => onChange({ ...data, disputeResolutionBappebti: e.target.checked })}
                            />
                            <Form.Check
                                type="checkbox"
                                id="dispute-jakarta"
                                label="Pengadilan Negeri Jakarta Barat"
                                checked={data.disputeResolutionJakarta || false}
                                onChange={(e) => onChange({ ...data, disputeResolutionJakarta: e.target.checked })}
                            />
                            <p className="mt-2">(4) Kantor atau kantor cabang Pialang Berjangka terdekat dengan domisili Nasabah tempat
                            penyelesaian dalam hal terjadi perselisihan.</p>
                            <p><strong>Daftar Kantor</strong></p>
                            <p>Kantor Pusat</p>
                            <p>PT Genesis Gemilang Futures</p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h6><strong>25. Bahasa</strong></h6>
                        <p>Perjanjian ini dibuat dalam Bahasa Indonesia.</p>
                        <p>Demikian Perjanjian Pemberian Amanat ini dibuat oleh Para Pihak dalam keadaan sadar, sehat jasmani rohani dan tanpa unsur paksaan dari pihak manapun.</p>
                    </div>

                    <div className="border-top pt-4">
                        <div className="text-center mb-4">
                            <p><em>"Saya telah membaca, mengerti dan setuju terhadap semua ketentuan yang tercantum dalam perjanjian ini"</em></p>
                            <p>Dengan mengisi kolom "YA" di bawah ini, saya menyatakan bahwa saya telah menerima</p>
                            <p><strong>"PERJANJIAN PEMBERIAN AMANAT TRANSAKSI KONTRAK BERJANGKA"</strong></p>
                            <p>Mengerti dan menyetujui isinya.</p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></Form.Label>
                            <div className="d-flex gap-4">
                                <Form.Check
                                    type="radio"
                                    id="electronic-agreement-ya"
                                    name="electronicAgreement"
                                    label="Ya"
                                    value="ya"
                                    checked={data.electronicAgreement === 'ya'}
                                    onChange={(e) => onChange({ ...data, electronicAgreement: e.target.value })}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    id="electronic-agreement-tidak"
                                    name="electronicAgreement"
                                    label="Tidak"
                                    value="tidak"
                                    checked={data.electronicAgreement === 'tidak'}
                                    onChange={(e) => onChange({ ...data, electronicAgreement: e.target.value })}
                                    required
                                />
                            </div>
                            {data.electronicAgreement === 'tidak' && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Menerima Pada Tanggal:</strong></Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.electronicAgreementDate || '2025-08-30T16:15'}
                                onChange={(e) => onChange({ ...data, electronicAgreementDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const TradingRulesStep = ({ data = {}, onChange }) => {
    const handleCheckboxChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    return (
        <div>
            <Card className="border-0 shadow-sm mb-2">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">
                        PERATURAN TRANSAKSI
                    </h5>
                    <h6 className="mb-0 text-secondary text-center">
                        PT GENESIS GEMILANG FUTURES
                    </h6>
                    <p className="mb-0 text-center mt-2">
                        PERATURAN TRANSAKSI (TRADING RULES) KONTRAK BERJANGKA PENYALURAN AMANAT<br />
                        NASABAH KE BURSA BERJANGKA LUAR NEGERI (PALN)
                    </p>
                </Card.Header>
                <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="mb-4">
                        <h6><strong>I. KETENTUAN UMUM</strong></h6>
                        <p><strong>1. Pialang Penyaluran Amanat ke Bursa Berjangka Luar Negeri (PALN)</strong> bertindak sebagai Pialang PALN merupakan Pialang Luar Negeri yang menjadi Anggota Singapore Exchange (SGX) dan terdaftar resmi pada Monetary Authority of Singapore ("MAS").</p>
                        <p><strong>2. Tempat pelaksanaan (Venue Execution)</strong> untuk kontrak yang diperdagangkan pada Layanan ini, Pialang PALN adalah satu-satunya tempat bertransaksi. Pialang PALN akan menghubungkan atas semua posisi Nasabah dengan penyedia likuiditas eksternal, di mana penyedia likuiditas tersebut menggunakan Singapore Exchange (SGX) untuk mengeksekusi instrumen yang mendasarinya. Semua kontrak didukung penuh oleh instrumen dasar yang sesuai.</p>
                        <p><strong>3. Produk </strong>yang ditawarkan pada Layanan ini akan berupa kontrak yang terdaftar dan diperdagangkan di Singapore Exchange (SGX).</p>
                        <p><strong>4. Transaksi </strong>dilakukan melalui sistem elektronik (secara Online) yaitu dengan Sistem Transaksi PALN yang disediakan oleh Jakarta Futures Exchange (JFX).</p>
                        <p><strong>5. Day Trading </strong>Adalah transaksi jual dan beli yang dilakukan pada hari yang sama, sehingga tidak ada posisi terbuka baru pada rekening Nasabah ketika Perdagangan Pasar ditutup. Hal ini juga dikenal sebagai Intraday Trading.</p>
                        <p><strong>6. Overnight </strong>Trading Adalah salah satu metode transaksi yang terjadi/dilakukan lebih dari satu hari yang sama, membiarkan posisi terbuka (open position) walaupun Pasar Perdagangan Berjangka telah ditutup.</p>
                        <p><strong>7. Likuidasi </strong>Adalah tindakan yang dilakukan untuk menutup atau menghapus posisi terbuka dengan cara melakukan transaksi sejumlah posisi yang sama pada posisi yang berlawanan dengan posisi yang dimiliki semula.</p>
                        <p><strong>8. Posisi Terbuka (Open Position) </strong>Adalah posisi beli (long) atau posisi jual (short) yang belum dilikuidasi.</p>
                        <p><strong>9. Saldo Awal (Deposit Margin) </strong>Adalah sejumlah dana minimum yang telah disetor oleh nasabah ke Rekening Bank terpisah (Segregated Account) Perusahaan Pialang Berjangka dan Komoditi PT Genesis Gemilang Futures pada saat pembukaan awal akun rekening nasabah.</p>
                        <p><strong>10. Kewajiban Margin (Margin Requirement) </strong>Adalah sejumlah dana yang ditempatkan oleh nasabah kepada Lembaga Kliring Berjangka melalui Perusahaan Pialang Berjangka dan komoditi, guna untuk menjamin pelaksanaan transaksi Kontrak Berjangka.</p>
                        <p><strong>11. Penarikan Dana (Withdrawal) </strong>Pengajuan penarikan dana akan diproses pada hari yang sama, jika diterima sebelum pukul 11:00 WIB, kecuali hari libur nasional/perbankan. Untuk pengajuan penarikan dana setelah pukul 11:00 WIB, akan diproses pada hari kerja berikutnya, kecuali hari libur nasional/perbankan. Jika dalam proses penarikan dana terdapat biaya bank, maka biaya bank tersebut akan dibebankan kepada Nasabah.</p>
                        <p><strong>12. Harga Penyelesaian (Settlement Price) </strong>Adalah harga yang ditentukan oleh Singapore Exchange (SGX) sebagai harga resmi pada akhir hari perdagangan sesuai dengan spesifikasi kontrak masing-masing.</p>
                        <p><strong>13. Spread </strong>Adalah selisih dalam poin antara harga Jual (bid) dan harga Beli (Ask).</p>
                        <p><strong>14. Poin (point) </strong>Adalah satuan terkecil antara suatu harga dengan harga sebelumnya yang dapat dinyatakan dalam satuan angka penuh atau satuan angka sekian desimal dibelakang koma tergantung pada kebiasaan masing-masing kontrak. Dalam perdagangan kontrak antar valuta (forex) ini biasa disebut sebagai satu "PIP".</p>
                        <p><strong>15. Equity </strong>Adalah jumlah keseluruhan dana nasabah yang dimiliki dan tercatat pada akun nasabah setelah diperhitungkan dengan jumlah keuntungan/kerugian selama melakukan transaksi berjangka dan Komoditi.</p>
                        <p><strong>16. Keadaan Hectic Market </strong>Adalah keadaan ketika pasar dalam kondisi yang tidak normal atau tidak menentu. Pada situasi ini spread akan didasarkan pada kondisi pergerakan harga sebagaimana quotasi yang disampaikan oleh system PALN.</p>
                        <p><strong>17. Kesalahan Kuotasi (Wrong Quote) </strong>Adalah suatu keadaan dimana harga jual (bid) atau harga beli (ask) yang ditampilkan Sistem Transaksi PALN tidak mencerminkan harga jual (bid) atau harga beli (ask) /keadaan pasar yang sebenarnya.</p>
                        <p><strong>18. Market Order </strong>Adalah amanat dari nasabah untuk mengambil harga jual (bid) atau harga beli (ask) yang pada saat itu dimana harganya berada pada harga terbaik dengan harga yang diminta.</p>
                        <p><strong>19. Limit Order </strong>Adalah amanat dari Nasabah untuk mengambil harga jual (bid) atau harga beli (ask) pada saat mencapai suatu harga tertentu. Biasanya digunakan untuk membuka posisi atau melikuidasi.</p>
                        <p><strong>20. Stop Order </strong>Adalah amanat dari nasabah untuk mengambil harga beli (bid) atau harga jual (Ask) kalau sudah mencapai suatu harga tertentu biasanya digunakan untuk menutup posisi agar tidak menderita rugi lebih besar lagi.</p>
                        <p><strong>21. Locking </strong>Adalah pembukaan posisi baru yang berlawanan dengan posisi sebelumnya tanpa bermaksud untuk melikuidasi posisi.</p>
                        <p><strong>22. Laba/Rugi Yang Belum Terealisasi (Floating Profit/Loss) </strong>Adalah keuntungan atau kerugian yang belum terealisasi pada posisi terbuka. Keuntungan dan kerugian yang belum terealisasi ini meningkat atau berkurang sesuai dengan situasi pasar dan akan direalisasi ketika posisi terbuka ini ditutup. Keuntungan dan kerugian yang belum terealisasi untuk posisi terbuka dihitung berdasarkan pada harga jual (bid) dan beli (ask).</p>
                        <p><strong>23. Komisi (Commission) </strong>Adalah sejumlah dana yang dikenakan kepada Nasabah untuk setiap lot transaksi.</p>
                        <p><strong>24. Biaya Bunga dan Beban Keuangan Lainnya (Swap) </strong>Adalah biaya yang dikenakan kepada nasabah terhadap setiap posisi terbuka dari kontrak yang diperdagangkan, sehingga dapat mempengaruhi Equity nasabah dan dapat berubah dari waktu ke waktu. Interest/Swap diperhitungkan setiap hari selama posisi terbuka, kecuali pada hari Rabu dimana akan diperhitungkan 3 (tiga) hari sekaligus.</p>
                        <p><strong>25. Margin Call </strong>akan dilakukan jika terjadi floating loss pada posisi transaksi nasabah yang masih terbuka/open pada saat berlangsungnya jam perdagangan, berada pada kondisi range 70% terhadap current balance/equity yang ada (berdasarkan harga bid dan ask). Pemberitahuan perihal margin call disampaikan melalui sistem PALN dan email nasabah yang terdaftar.</p>
                        <p><strong>26. Auto Cut Equity </strong>Apabila equity Nasabah turun mencapai 30% atau kurang dari Margin Requirement per lot, maka :</p>
                        <p style={{ marginLeft: '20px' }}><strong>a.</strong> Secara otomatis sistem akan melikuidasi sebagian atau seluruh posisi Nasabah tanpa perlu mendapat persetujuan dari Nasabah terlebih dahulu.</p>
                        <p style={{ marginLeft: '20px' }}><strong>b.</strong> Penentuan angka auto-cut adalah berdasarkan harga bid dan ask yang ada di sistem Sistem PALN.</p>
                        <p style={{ marginLeft: '20px' }}><strong>c.</strong> PT Genesis Gemilang Futures tidak bertanggung jawab akibat kerugian yang dialami nasabah.</p>
                        <p style={{ marginLeft: '20px' }}><strong>d.</strong> Apabila terjadi kekurangan margin maupun over loss maka semua kerugian yang timbul akan menjadi tanggung jawab nasabah.</p>
                        <p style={{ marginLeft: '20px' }}><strong>e.</strong> Nasabah wajib melunasi kekurangan margin maupun over loss.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>II. MEKANISME TRANSAKSI ELEKTRONIK</strong></h6>
                        <p><strong>1.</strong> Nasabah memperoleh User ID (Login) dan Password dari Sistem Aplikasi PALN. Nasabah wajib melakukan penggantian Master Password awal yang diterima sebelum mulai melakukan transaksinya dan demi menjaga keamanan dalam ber-transaksi maka kepada nasabah juga dianjurkan untuk secara berkala melakukan pembaruan / penggantian password tanpa harus memberitahukan kepada pihak Perusahaan PT Genesis Gemilang Futures.</p>
                        <p><strong>2.</strong> Penyampaian order dilaksanakan secara online melalui sistem PALN.</p>
                        <p><strong>3.</strong> Sistem PALN adalah sebuat platform Trading on-line. Kegagalan atas perangkat keras (hardware) atau perangkat lunak (software) dan/atau terganggunya koneksi jaringan internet dapat mengakibatkan terjadinya kemungkinan nasabah akan mengalami risiko yang berkaitan dengan sistem tersebut. Apabila dikarenakan kondisi tersebut dan amanat nasabah tidak dapat diteruskan, nasabah segera menghubungi via email, telepon, kepada tim Info@granjaya.io atau support@genesis.co.id.</p>
                        <p><strong>4.</strong> Platform sistem memiliki kemampuan untuk secara otomatis menolak terhadap amanat nasabah apabila kewajiban margin yang timbul dari posisi baru tersebut melebihi dana nasabah.</p>
                        <p><strong>5.</strong> Amanat didasarkan pada harga jual (bid) dan harga beli (ask) yang diberikan secara on-line melalui platform Sistem PALN dan dapat dimonitor oleh nasabah secara langsung.</p>
                        <p><strong>6.</strong> Amanat jual dan beli yang sudah matched di dalam sistem diperlakukan sebagai transaksi jual dan beli dan tidak dapat dibatalkan.</p>
                        <p><strong>7.</strong> Jenis-jenis amanat nasabah yang dapat dilayani oleh sistem sekurang-kurangnya:</p>
                        <p style={{ marginLeft: '20px' }}><strong>a.</strong> Market Order</p>
                        <p style={{ marginLeft: '20px' }}><strong>b.</strong> Stop (Stop/Loss) Order</p>
                        <p style={{ marginLeft: '20px' }}><strong>c.</strong> Limit (Take/Profit) Order</p>
                        <p><strong>8.</strong> Order dengan batas harga Limit (Take/Profit) Order dan Stop (Stop/Loss) Order dilaksanakan dengan ketentuan sebagai berikut:</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>III. LAPORAN HARIAN NASABAH</strong></h6>
                        <p><strong>a)</strong> Nasabah dapat mengakses Laporan Keuangan secara langsung, melalui Sistem PALN secara online, Apabila nasabah menyatakan tidak menerima informasi laporan tentang aktivitas transaksi dan/atau informasi perkembangan dana nasabah (Statement), maka nasabah dapat segera menghubungi PT Genesis Gemilang Futures, melalui informasi sebagai berikut di bawah ini;</p>
                        <p style={{ marginLeft: '20px' }}>E-mail : support@genesis.co.id Telp : 021-50217217</p>
                        <p><strong>b)</strong> Nasabah harus mereview dan melaporkan dengan segera jika ditemukan ketidaksesuaian yang terdapat pada laporan yang diterbitkan oleh PT. Genesis Gemilang Futures.</p>
                        <p><strong>c)</strong> Segala pelaporan dalam Sistem tersebut akan dianggap telah disetujui apabila PT. Genesis Gemilang Futures tidak menerima pemberitahuan melalui telepon dan disusul dengan pemberitahuan tertulis selambat-lambatnya 2 (dua) hari kerja dari tanggal Laporan Keuangan nasabah tersebut.</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>IV. PERSELISIHAN</strong></h6>
                        <p>Nasabah dan Perusahaan PT Genesis Gemilang Futures dalam hal ini sepakat bahwa apabila timbul perselisihan, maka terkait kebutuhan proses pembuktian adalah di dasarkan pada seluruh fakta data historis transaksi, laporan dan data pendukung lainnya yang ada Perusahaan PT Genesis Gemilang Futures antara lain:</p>
                        <p><strong>a)</strong> Pembuktian atas fakta-fakta, di mana fakta-fakta tersebut dapat dilihat antara lain di dalam histori transaksi dan data-data pendukung lainnya.</p>
                        <p><strong>b)</strong> Mengacu pada data-data terakhir yang tercatat di PT. Genesis Gemilang Futures dan sesuai dengan ketentuan - ketentuan yang ada di dalam Trading Rules.</p>
                        <p><strong>c)</strong> Jika ada pengaduan atau keluhan, nasabah dapat mengisi Formulir Pengaduan Nasabah dan mengajukan kepada Bagian Compliance PT. Genesis Gemilang Futures dengan alamat email pengaduan@genesis.co.id dan bisa melalui pengaduan online yang disediakan Bappebti https://pengaduan.bappebti.go.id</p>
                    </div>

                    <div className="mb-4">
                        <h6><strong>V. PENDAFTARAN AMANAT TRANSAKSI</strong></h6>
                        <p>Seluruh amanat nasabah yang diterima oleh Perusahaan PT Genesis Gemilang Futures sesuai dengan ketentuan dan prosedur PALN selanjutnya akan terdaftar pada Jakarta Futures Exchange (JFX) dan secara otomatis sistem PALN akan meneruskannya dengan mendaftarkan Amanat nasabah ke Kliring Berjangka Indonesia (KBI) dan akan dapat dilihat (monitor) melalui aplikasi SITNA oleh nasabah.</p>
                    </div>

                    <div className="mb-4">
                        <div className="text-center mb-3">
                            <h6><strong>DAFTAR KONTRAK YANG DIPERDAGANGKAN PALN SGX FX (Singapore Exchange)</strong></h6>
                            <h6><strong>PERATURAN TRANSAKSI (TRADING RULES) KONTRAK BERJANGKA PENYALURAN AMANAT NASABAH KE BURSA BERJANGKA LUAR NEGERI (PALN)</strong></h6>
                        </div>
                        
                        {/* PDF Viewer */}
                        <div className="mb-4">
                            <div className="pdf-container" style={{ height: '600px', border: '1px solid #dee2e6', borderRadius: '0.375rem' }}>
                                <iframe
                                    src="/documents/kyc/indonesian-person/Trading Rules PALN Equivalent.6780c13224fec7.70609845.pdf"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 'none', borderRadius: '0.375rem' }}
                                    title="Trading Rules PALN Equivalent Document"
                                >
                                    <p>Your browser does not support PDFs. <a href="/documents/kyc/indonesian-person/Trading Rules PALN Equivalent.6780c13224fec7.70609845.pdf" target="_blank" rel="noopener noreferrer">Download the PDF</a>.</p>
                                </iframe>
                            </div>
                            <div className="text-center mt-2">
                                <a 
                                    href="/documents/kyc/indonesian-person/Trading Rules PALN Equivalent.6780c13224fec7.70609845.pdf" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary btn-sm"
                                >
                                    <i className="fas fa-external-link-alt me-1"></i>
                                    Open PDF in New Window
                                </a>
                            </div>
                        </div>

                        <p className="text-center">
                            Dengan mengisi kolom "YA" di bawah ini, saya menyatakan bahwa saya telah membaca tentang 
                            <strong> PERATURAN PERDAGANGAN (TRADING RULES)</strong>, mengerti dan menerima ketentuan dalam bertransaksi
                        </p>
                        
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Pernyataan Menerima / Tidak <span className="text-danger">*</span></Form.Label>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    id="tradingRulesAccept"
                                    name="tradingRulesAcceptance"
                                    label="Ya"
                                    checked={data.tradingRulesAcceptance === 'yes'}
                                    onChange={(e) => handleCheckboxChange('tradingRulesAcceptance', 'yes')}
                                />
                                <Form.Check
                                    type="radio"
                                    id="tradingRulesReject"
                                    name="tradingRulesAcceptance"
                                    label="Tidak"
                                    checked={data.tradingRulesAcceptance === 'no'}
                                    onChange={(e) => handleCheckboxChange('tradingRulesAcceptance', 'no')}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Menerima Pada Tanggal:</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.tradingRulesAcceptanceDate || new Date().toISOString().slice(0, 16)}
                                onChange={(e) => handleCheckboxChange('tradingRulesAcceptanceDate', e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const NewFundDeclarationStep = ({ data = {}, onChange, allData = {} }) => {
    const handleInputChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    // Flatten all form data from all steps into a single object
    const flattenedData = Object.values(allData).reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});

    // Auto-populate fields from previous steps
    const fullName = flattenedData.namaLengkap || '';
    const placeOfBirth = flattenedData.tempatLahir || '';
    const dateOfBirth = flattenedData.tanggalLahir || '';
    const homeAddress = flattenedData.streetAddress || flattenedData.alamat || '';
    const city = flattenedData.city || '';
    const postalCode = flattenedData.postalCode || '';
    const idNumber = flattenedData.noKTP || flattenedData.ktpNumber || '';

    // Format the place and date of birth
    const placeAndDateOfBirth = `${placeOfBirth}, ${dateOfBirth}`.replace(/^, |, $/, '');
    // Format city and postal code
    const cityAndPostalCode = `${city}, ${postalCode}`.replace(/^, |, $/, '');

    return (
        <div>
            <Card className="border-0 shadow-sm mb-2">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary text-center">
                        PERNYATAAN BAHWA DANA YANG DIGUNAKAN SEBAGAI MARGIN MERUPAKAN
                    </h6>
                    <h6 className="mb-0 text-primary text-center">
                        DANA MILIK NASABAH SENDIRI
                    </h6>
                </Card.Header>
                <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="mb-4">
                        <p><strong>Yang mengisi formulir di bawah ini:</strong></p>
                        
                        <div className="mb-3">
                            <p><strong>Nama Lengkap</strong> : {fullName}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Tempat Lahir & Tgl. Lahir</strong> : {placeAndDateOfBirth}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Alamat Rumah</strong> : {homeAddress}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Kota & Kode Pos</strong> : {cityAndPostalCode}</p>
                        </div>
                        
                        <div className="mb-4">
                            <p><strong>No. KTP / SIM / Paspor</strong> : {idNumber}</p>
                        </div>

                        <div className="mb-4">
                            <p>
                                Dengan mengisi kolom "YA" di bawah ini, Bersama ini saya menyatakan bahwa dana yang saya gunakan untuk 
                                bertransaksi di PT Genesis Gemilang Futures adalah milik saya pribadi dan bukan dana pihak lain, serta tidak 
                                diperoleh dari hasil kejahatan, penipuan, penggelapan, tindak pidana korupsi, tindak pidana narkotika, tindak 
                                pidana di bidang kehutanan, hasil pencucian uang, dan perbuatan melawan hukum lainnya serta tidak dimaksudkan 
                                untuk melakukan pencucian uang dan/atau pendanaan terorisme.
                            </p>
                            
                            <p>
                                Demikian surat pernyataan ini saya buat dalam keadaan sadar, sehat jasmani dan rohani serta tanpa paksaan 
                                dari pihak manapun.
                            </p>
                            
                            <p>
                                Demikian Pernyataan ini dibuat dengan sebenarnya dalam keadaan sadar, sehat jasmani dan rohani serta 
                                tanpa paksaan apapun dari pihak manapun.
                            </p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Pernyataan Menerima / Tidak <span className="text-danger">*</span></Form.Label>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    id="newFundDeclarationAccept"
                                    name="newFundDeclarationAcceptance"
                                    label="Ya"
                                    checked={data.newFundDeclarationAcceptance === 'yes'}
                                    onChange={(e) => handleInputChange('newFundDeclarationAcceptance', 'yes')}
                                />
                                <Form.Check
                                    type="radio"
                                    id="newFundDeclarationReject"
                                    name="newFundDeclarationAcceptance"
                                    label="Tidak"
                                    checked={data.newFundDeclarationAcceptance === 'no'}
                                    onChange={(e) => handleInputChange('newFundDeclarationAcceptance', 'no')}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Pernyataan Pada Tanggal:</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.newFundDeclarationDate || new Date().toISOString().slice(0, 16)}
                                onChange={(e) => handleInputChange('newFundDeclarationDate', e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const AccessCodeResponsibilityStep = ({ data = {}, onChange, allData = {} }) => {
    const handleInputChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    // Flatten all form data from all steps into a single object
    const flattenedData = Object.values(allData).reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});

    // Auto-populate fields from previous steps
    const fullName = flattenedData.namaLengkap || '';
    const placeOfBirth = flattenedData.tempatLahir || '';
    const dateOfBirth = flattenedData.tanggalLahir || '';
    const homeAddress = flattenedData.streetAddress || flattenedData.alamat || '';
    const city = flattenedData.city || '';
    const postalCode = flattenedData.postalCode || '';
    const idNumber = flattenedData.noKTP || flattenedData.ktpNumber || '';

    // Format the place and date of birth
    const placeAndDateOfBirth = `${placeOfBirth}, ${dateOfBirth}`.replace(/^, |, $/, '');
    // Format city and postal code
    const cityAndPostalCode = `${city}, ${postalCode}`.replace(/^, |, $/, '');

    return (
        <div>
            <Card className="border-0 shadow-sm mb-2">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary text-center">
                        PERNYATAAN BERTANGGUNG JAWAB ATAS
                    </h6>
                    <h6 className="mb-0 text-primary text-center">
                        KODE AKSES TRANSAKSI NASABAH
                    </h6>
                </Card.Header>
                <Card.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="mb-4">
                        <p><strong>Yang mengisi formulir di bawah ini:</strong></p>
                        
                        <div className="mb-3">
                            <p><strong>Nama Lengkap</strong> : {fullName}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Tempat Lahir & Tgl. Lahir</strong> : {placeAndDateOfBirth}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Alamat Rumah</strong> : {homeAddress}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Kota & Kode Pos</strong> : {cityAndPostalCode}</p>
                        </div>
                        
                        <div className="mb-4">
                            <p><strong>No. KTP / SIM / Paspor*</strong> : {idNumber}</p>
                        </div>

                        <div className="mb-4">
                            <p>
                                Dengan mengisi kolom "Ya" dibawah ini saya menyatakan bahwa saya bertanggungjawab sepenuhnya 
                                terhadap kode akses transaksi Nasabah (Personal Access Password) dan tidak menyerahkan kode 
                                akses transaksi nasabah (Personal Access Password) ke pihak lain, terutama kepada pegawai 
                                Pialang Berjangka atau pihak yang memiliki kepentingan dengan Pialang berjangka.
                            </p>
                        </div>

                        <div className="border p-3 bg-warning bg-opacity-10 mb-4">
                            <h6 className="text-center mb-3"><strong>Peringatan!</strong></h6>
                            <p className="text-center mb-0">
                                Pialang Berjangka, Wakil Pialang Berjangka, pegawai Pialang Berjangka atau pihak Yang memiliki 
                                kepentingan dengan pialang berjangka dilarang menerima Kode Akses Transaksi Nasabah 
                                (Personal Access Password)
                            </p>
                        </div>

                        <div className="mb-4">
                            <p>
                                Demikian pernyataan ini dibuat dengan sebenarnya dalam keadaan sadar, sehat jasmani dan rohani 
                                serta tanpa paksaan apapun dari pihak manapun.
                            </p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Pernyataan Menerima / Tidak <span className="text-danger">*</span></Form.Label>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    id="accessCodeResponsibilityAccept"
                                    name="accessCodeResponsibilityAcceptance"
                                    label="Ya"
                                    checked={data.accessCodeResponsibilityAcceptance === 'yes'}
                                    onChange={(e) => handleInputChange('accessCodeResponsibilityAcceptance', 'yes')}
                                />
                                <Form.Check
                                    type="radio"
                                    id="accessCodeResponsibilityReject"
                                    name="accessCodeResponsibilityAcceptance"
                                    label="Tidak"
                                    checked={data.accessCodeResponsibilityAcceptance === 'no'}
                                    onChange={(e) => handleInputChange('accessCodeResponsibilityAcceptance', 'no')}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Pernyataan Pada Tanggal:</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.accessCodeResponsibilityDate || new Date().toISOString().slice(0, 16)}
                                onChange={(e) => handleInputChange('accessCodeResponsibilityDate', e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const FundDeclarationStep = ({ data = {}, onChange, allData = {} }) => {
    const handleInputChange = (field, value) => {
        onChange({ ...data, [field]: value });
    };

    // Flatten all form data from all steps into a single object
    const flattenedData = Object.values(allData).reduce((acc, curr) => {
        return { ...acc, ...curr };
    }, {});

    // Auto-populate fields from previous steps
    const fullName = flattenedData.namaLengkap || '';
    const placeAndDateOfBirth = `${flattenedData.tempatLahir || ''}, ${flattenedData.tanggalLahir || ''}`.replace(/^, |, $/, '');
    const homeAddress = flattenedData.streetAddress || flattenedData.alamat || '';
    const cityAndPostalCode = `${flattenedData.city || ''}, ${flattenedData.postalCode || ''}`.replace(/^, |, $/, '');
    const idNumber = flattenedData.noKTP || flattenedData.ktpNumber || '';

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary text-center">
                        PERNYATAAN BAHWA DANA YANG DIGUNAKAN SEBAGAI MARGIN MERUPAKAN
                    </h6>
                    <h6 className="mb-0 text-primary text-center">
                        DANA MILIK NASABAH SENDIRI
                    </h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <p>Yang mengisi formulir di bawah ini:</p>
                        
                        <div className="mb-3">
                            <p><strong>Nama Lengkap</strong> : {fullName}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Tempat Lahir & Tgl. Lahir</strong> : {placeAndDateOfBirth}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Alamat Rumah</strong> : {homeAddress}</p>
                        </div>
                        
                        <div className="mb-3">
                            <p><strong>Kota & Kode Pos</strong> : {cityAndPostalCode}</p>
                        </div>
                        
                        <div className="mb-4">
                            <p><strong>No. KTP / SIM / Paspor</strong> : {idNumber}</p>
                        </div>

                        <div className="mb-4">
                            <p>
                                Dengan mengisi kolom "YA" di bawah ini, Bersama ini saya menyatakan bahwa dana yang saya gunakan 
                                sebagaimana dimaksud di PT Genesis Gemilang Futures adalah milik saya pribadi dan bukan dari pihak lain, serta 
                                tidak berasal dari hasil kejahatan, pencucian, pengelabuhan, tindak pidana korupsi, tindak pidana narkotika, 
                                tindak pidana terorisme, serta 
                                demikian pula untuk melakukan pencucian uang dengan pendanaan tersebut.
                            </p>
                            
                            <p>
                                Demikian surat pernyataan ini saya buat dalam keadaan sadar, sehat jasmani dan rohani serta tanpa paksaan 
                                dari pihak manapun.
                            </p>
                            
                            <p>
                                Demikian Pernyataan ini dibuat dengan sebenarnya dalam keadaan sadar, sehat jasmani dan rohani serta 
                                tanpa paksaan apapun dari pihak manapun.
                            </p>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Pernyataan Menerima / Tidak <span className="text-danger">*</span></Form.Label>
                            <div className="d-flex gap-3">
                                <Form.Check
                                    type="radio"
                                    id="fundDeclarationAccept"
                                    name="fundDeclarationAcceptance"
                                    label="Ya"
                                    checked={data.fundDeclarationAcceptance === 'yes'}
                                    onChange={(e) => handleInputChange('fundDeclarationAcceptance', 'yes')}
                                />
                                <Form.Check
                                    type="radio"
                                    id="fundDeclarationReject"
                                    name="fundDeclarationAcceptance"
                                    label="Tidak"
                                    checked={data.fundDeclarationAcceptance === 'no'}
                                    onChange={(e) => handleInputChange('fundDeclarationAcceptance', 'no')}
                                />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted fw-bold">Pernyataan Pada Tanggal:</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.fundDeclarationDate || new Date().toISOString().slice(0, 16)}
                                onChange={(e) => handleInputChange('fundDeclarationDate', e.target.value)}
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const PersonalInformationSummaryStep = ({ data = {}, onChange, allData = {} }) => {
    // Flatten nested data
    const flattenedData = Object.keys(allData).reduce((acc, key) => {
        if (typeof allData[key] === 'object' && allData[key] !== null) {
            return { ...acc, ...allData[key] };
        }
        return { ...acc, [key]: allData[key] };
    }, {});

    // Auto-populate fields from previous steps
    const fullName = flattenedData.namaLengkap || '';
    const placeOfBirth = flattenedData.tempatLahir || '';
    const dateOfBirth = flattenedData.tanggalLahir || '';
    const homeAddress = flattenedData.streetAddress || flattenedData.alamat || '';
    const city = flattenedData.city || '';
    const postalCode = flattenedData.postalCode || '';
    const idNumber = flattenedData.noKTP || flattenedData.ktpNumber || '';

    // Format date of birth for display (convert from YYYY-MM-DD to DD-MM-YYYY)
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formattedDateOfBirth = formatDisplayDate(dateOfBirth);

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary text-center">
                        PERNYATAAN BERTANGGUNG JAWAB ATAS
                    </h6>
                    <h6 className="mb-0 text-primary text-center">
                        KODE AKSES TRANSAKSI NASABAH
                    </h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <p>Yang mengisi formulir di bawah ini:</p>
                        
                        <div className="mb-3">
                            <Row>
                                <Col md={3}><strong>Nama Lengkap</strong></Col>
                                <Col md={1}>:</Col>
                                <Col md={8}>{fullName}</Col>
                            </Row>
                        </div>
                        
                        <div className="mb-3">
                            <Row>
                                <Col md={3}><strong>Tempat Lahir & Tgl. Lahir</strong></Col>
                                <Col md={1}>:</Col>
                                <Col md={8}>{placeOfBirth}{placeOfBirth && formattedDateOfBirth ? ', ' : ''}{formattedDateOfBirth}</Col>
                            </Row>
                        </div>
                        
                        <div className="mb-3">
                            <Row>
                                <Col md={3}><strong>Alamat Rumah</strong></Col>
                                <Col md={1}>:</Col>
                                <Col md={8}>{homeAddress}</Col>
                            </Row>
                        </div>
                        
                        <div className="mb-3">
                            <Row>
                                <Col md={3}><strong>Kota & Kode Pos</strong></Col>
                                <Col md={1}>:</Col>
                                <Col md={8}>{city}{city && postalCode ? ', ' : ''}{postalCode}</Col>
                            </Row>
                        </div>
                        
                        <div className="mb-4">
                            <Row>
                                <Col md={3}><strong>No. KTP / SIM / Paspor<span className="text-danger">*</span></strong></Col>
                                <Col md={1}>:</Col>
                                <Col md={8}>{idNumber}</Col>
                            </Row>
                        </div>

                        <div className="mb-4">
                            <p>
                                Dengan mengisi kolom "Ya" dibawah ini saya menyatakan bahwa saya bertanggungjawab sepenuhnya terhadap kode 
                                akses transaksi Nasabah (Personal Access Password) dan tidak menyerahkan kode akses transaksi nasabah 
                                (Personal Access Password) ke pihak lain, terutama kepada pegawai Pialang Berjangka atau pihak yang memiliki 
                                kepentingan dengan Pialang Berjangka.
                            </p>
                        </div>

                        <div className="border p-3 bg-light mb-4">
                            <div className="text-center mb-3">
                                <strong>Peringatan!</strong>
                            </div>
                            <p className="mb-0">
                                Pialang Berjangka, Wakil Pialang Berjangka, pegawai Pialang Berjangka atau pihak Yang memiliki kepentingan 
                                dengan pialang berjangka dilarang menerima Kode Akses Transaksi Nasabah (Personal Access Password)
                            </p>
                        </div>

                        <div className="mb-4">
                            <p>
                                Demikian pernyataan ini dibuat dengan sebenarnya dalam keadaan sadar, sehat jasmani dan rohani serta tanpa 
                                paksaan apapun dari pihak manapun.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h6><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></h6>
                            <Row className="mt-3">
                                <Col md={3}>
                                    <Form.Check
                                        type="radio"
                                        name="acceptanceStatement"
                                        id="acceptanceYes"
                                        label="Ya"
                                        checked={data.acceptanceStatement === 'yes'}
                                        onChange={(e) => onChange({ ...data, acceptanceStatement: 'yes' })}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Check
                                        type="radio"
                                        name="acceptanceStatement"
                                        id="acceptanceNo"
                                        label="Tidak"
                                        checked={data.acceptanceStatement === 'no'}
                                        onChange={(e) => onChange({ ...data, acceptanceStatement: 'no' })}
                                    />
                                </Col>
                            </Row>
                        </div>

                                               <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Pernyataan Pada Tanggal:</strong></Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.statementDateTime || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                                onChange={(e) => onChange({ ...data, statementDateTime: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const ProcessVerificationStep = ({ data = {}, onChange, allData = {} }) => {
    // List of processes with their completion status - all defaulted to completed
    const processes = [
        {
            id: 1,
            title: "PROFIL PERUSAHAAN PIALANG BERJANGKA",
            isCompleted: true
        },
        {
            id: 2,
            title: "PERNYATAAN TELAH MELAKUKAN SIMULASI PERDAGANGAN BERJANGKA ATAU PERNYATAAN TELAH BERPENGALAMAN DALAM MELAKSANAKAN TRANSAKSI PERDAGANGAN BERJANGKA",
            isCompleted: true
        },
        {
            id: 3,
            title: "PERNYATAAN PENGUNGKAPAN (DISCLOSURE STATEMENT)",
            isCompleted: true
        },
        {
            id: 4,
            title: "APLIKASI PEMBUKAAN REKENING TRANSAKSI",
            isCompleted: true
        },
        {
            id: 5,
            title: "PERNYATAAN PENGUNGKAPAN (DISCLOSURE STATEMENT)",
            isCompleted: true
        },
        {
            id: 6,
            title: "DOKUMEN PEMBERITAHUAN ADANYA RESIKO",
            isCompleted: true
        },
        {
            id: 7,
            title: "PERNYATAAN PENGUNGKAPAN (DISCLOSURE STATEMENT)",
            isCompleted: true
        },
        {
            id: 8,
            title: "PERJANJIAN PEMBERIAN AMANAT",
            isCompleted: true
        },
        {
            id: 9,
            title: "DAFTAR KONTRAK BERJANGKA, KONTRAK DERIVATIF DAN KONTRAK DERIVATIF LAINNYA BESERTA PERATURAN PERDAGANGAN (TRADING RULES)",
            isCompleted: true
        },
        {
            id: 10,
            title: "PERNYATAAN BAHWA DANA YANG DIGUNAKAN SEBAGAI MARGIN MERUPAKAN DANA MILIK NASABAH SENDIRI",
            isCompleted: true
        },
        {
            id: 11,
            title: "PERNYATAAN BERTANGGUNG JAWAB KODE AKSES TRANSAKSI NASABAH (Personal Access Password)",
            isCompleted: true
        }
    ];

    const handleProcessToggle = (processId) => {
        const updatedProcesses = { ...data.processVerification };
        updatedProcesses[processId] = !updatedProcesses[processId];
        onChange({ ...data, processVerification: updatedProcesses });
    };

    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary text-center">
                        VERIFIKASI KELENGKAPAN PROSES PENERIMAAN NASABAH SECARA
                    </h6>
                    <h6 className="mb-0 text-primary text-center">
                        ELEKTRONIK ONLINE
                    </h6>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: '5%', textAlign: 'center' }}>NO</th>
                                    <th style={{ width: '75%', textAlign: 'center' }}>PROSES</th>
                                    <th style={{ width: '20%', textAlign: 'center' }}>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processes.map((process) => (
                                    <tr key={process.id}>
                                        <td className="text-center align-middle">{process.id}</td>
                                        <td className="align-middle">{process.title}</td>
                                        <td className="text-center align-middle">
                                            <div className="form-check d-flex justify-content-center">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    checked={process.isCompleted}
                                                    disabled={true}
                                                    style={{ 
                                                        width: '20px', 
                                                        height: '20px',
                                                        backgroundColor: process.isCompleted ? '#28a745' : '#ffffff',
                                                        borderColor: '#28a745'
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4">
                        <p className="mb-3">
                            Dengan mengisi kolom "YA" di bawah ini, saya menyatakan bahwa saya telah membaca dan memahami seluruh isi 
                            dokumen yang diserahkan dalam Formulir Nomor 1 sampai dengan Formulir Nomor 11.
                        </p>
                        
                        <p className="mb-4">
                            Demikian Pernyataan ini dibuat dengan sebenarnya dalam keadaan sadar, sehat jasmani dan rohani serta tanpa 
                            paksaan apapun dari pihak manapun.
                        </p>

                        <div className="mb-4">
                            <h6><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></h6>
                            <Row className="mt-3">
                                <Col md={3}>
                                    <Form.Check
                                        type="radio"
                                        name="verificationAcceptance"
                                        id="verificationYes"
                                        label="Ya"
                                        checked={data.verificationAcceptance === 'yes'}
                                        onChange={(e) => onChange({ ...data, verificationAcceptance: 'yes' })}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Check
                                        type="radio"
                                        name="verificationAcceptance"
                                        id="verificationNo"
                                        label="Tidak"
                                        checked={data.verificationAcceptance === 'no'}
                                        onChange={(e) => onChange({ ...data, verificationAcceptance: 'no' })}
                                    />
                                </Col>
                            </Row>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Pernyataan Pada Tanggal:</strong></Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.verificationDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                                onChange={(e) => onChange({ ...data, verificationDate: e.target.value })}
                                required
                            />
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

const RiskDisclosureAcknowledgmentStep = ({ data = {}, onChange }) => {
    return (
        <div>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-light border-0">
                    <h5 className="mb-0 text-primary text-center">PERNYATAAN PENGUNGKAPAN</h5>
                    <h6 className="mb-0 text-secondary text-center">(DISCLOSURE STATEMENT)</h6>
                </Card.Header>
                <Card.Body>
                    <div className="mb-4">
                        <ol className="list-unstyled">
                            <li className="mb-3">
                                <strong>1.</strong> Perdagangan Berjangka <strong>Berisiko SANGAT TINGGI</strong> tidak cocok untuk semua orang. Pastikan bahwa Anda <strong>SEPENUHNYA MEMAHAMI RISIKO</strong> ini sebelum melakukan perdagangan.
                            </li>
                            <li className="mb-3">
                                <strong>2.</strong> Perdagangan Berjangka merupakan produk keuangan dengan leverage dan dapat menyebabkan <strong>KERUGIAN ANDA MELEBIHI</strong> setoran awal Anda. Anda harus siap apabila <strong>SELURUH DANA ANDA</strong> Habis.
                            </li>
                            <li className="mb-3">
                                <strong>3.</strong> <strong>TIDAK ADA</strong> pendapatan <strong>TETAP (FIXED INCOME)</strong> dalam Perdagangan Berjangka.
                            </li>
                            <li className="mb-3">
                                <strong>4.</strong> Apabila Anda <strong>PEMULA</strong> kami sarankan untuk mempelajari mekanisme transaksinya, <strong>PERDAGANGAN BERJANGKA</strong> membutuhkan pengetahuan dan pemahaman khusus.
                            </li>
                            <li className="mb-3">
                                <strong>5.</strong> <strong>ANDA HARUS MELAKUKAN TRANSAKSI SENDIRI</strong>, segala risiko yang akan timbul akibat transaksi sepenuhnya akan menjadi tanggung jawab Saudara.
                            </li>
                            <li className="mb-3">
                                <strong>6.</strong> <strong>User id</strong> dan <strong>password</strong> bersifat <strong>PRIBADI DAN RAHASIA</strong>, anda bertanggung jawab atas penggunaannya, <strong>JANGAN SERAHKAN</strong> ke pihak lain terutama Wakil Pialang Berjangka dan pegawai Pialang Berjangka.
                            </li>
                            <li className="mb-3">
                                <strong>7.</strong> <strong>ANDA</strong> berhak menerima <strong>LAPORAN ATAS TRANSAKSI</strong> yang anda lakukan. Waktu anda <strong>2 X 24 JAM UNTUK MEMBERIKAN SANGGAHAN</strong>. Untuk transaksi yang telah Selesai <strong>(DONE/SETTLE) DAPAT ANDA CEK</strong> melalui sistem informasi transaksi nasabah yang berfungsi untuk memastikan transaksi anda telah terdaftar di Lembaga Kliring Berjangka.
                            </li>
                        </ol>
                    </div>

                    <div className="border-top pt-4">
                        <p className="text-center mb-4">
                            <strong>SECARA DETAIL BACA DOKUMEN PEMBERITAHUAN ADANYA RISIKO DAN DOKUMEN PERJANJIAN PEMBERIAN AMANAT</strong>
                        </p>
                        <p className="text-center mb-4">
                            Untuk mempelajari lebih lanjut mengenai Perdagangan Berjangka dapat anda mengunjungi situs{' '}
                            <a href="https://www.bappebti.go.id" target="_blank" rel="noopener noreferrer" className="text-primary">
                                www.bappebti.go.id
                            </a>
                        </p>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Menerima / Tidak <span className="text-danger">*</span></strong></Form.Label>
                        <div className="d-flex gap-4">
                            <Form.Check
                                type="radio"
                                id="risk-disclosure-acknowledgment-ya"
                                name="riskDisclosureAcknowledgment"
                                label="Ya"
                                value="ya"
                                checked={data.riskDisclosureAcknowledgment === 'ya'}
                                onChange={(e) => onChange({ ...data, riskDisclosureAcknowledgment: e.target.value })}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="risk-disclosure-acknowledgment-tidak"
                                name="riskDisclosureAcknowledgment"
                                label="Tidak"
                                value="tidak"
                                checked={data.riskDisclosureAcknowledgment === 'tidak'}
                                onChange={(e) => onChange({ ...data, riskDisclosureAcknowledgment: e.target.value })}
                                required
                            />
                        </div>
                        {data.riskDisclosureAcknowledgment === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="text-muted"><strong>Pernyataan Pada Tanggal:</strong></Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={data.riskDisclosureAcknowledgmentDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                            onChange={(e) => onChange({ ...data, riskDisclosureAcknowledgmentDate: e.target.value })}
                            required
                        />
                    </Form.Group>
                </Card.Body>
            </Card>
        </div>
    );
};

export default IndonesianPersonForm; 