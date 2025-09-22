import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { useNotificationContext } from '../../../common/context/useNotificationContext';
import AuthService from '../../../common/api/auth';

const IndonesianPersonForm = () => {
    const [formData, setFormData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const { showNotification } = useNotificationContext();
    const navigate = useNavigate();

    // Function to clear specific field errors
    const clearFieldError = (fieldName) => {
        if (fieldErrors[fieldName]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    // Function to set specific field errors
    const setFieldError = (fieldName) => {
        setFieldErrors(prev => ({
            ...prev,
            [fieldName]: true
        }));
    };

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

    const documentRequirements = [
        {
            category: "Dokumen yang dilampirkan",
            documents: [
                "Rekening Koran / Tagihan Kartu Kredit ",
                "Rekening Listrik / Telepon ", 
                "Foto Terkini ",
                "Identify No. (KTP) ",
                "NPWP "
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
                return <AccountInformationStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 2:
                return <DataPribadiStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} setFieldError={setFieldError} />;
            case 3:
                return <EmergencyContactStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} setFieldError={setFieldError} />;
            case 4:
                return <DataPekerjaanStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} setFieldError={setFieldError} />;
            case 5:
                return <DaftarKekayaanStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} setFieldError={setFieldError} />;
            case 6:
                return <RekeningBankStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} setFieldError={setFieldError} />;
            case 7:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 8:
                return <DeclarationStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 9:
                return <TradingSimulationDeclaration data={stepData} onChange={updateFormData} allData={allFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 10:
                return <DisclosureStatementStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 11:
                return <RiskDisclosureDocumentStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />; 
            case 12:
                return <AdditionalDisclosureStatementStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 13:
                return <ElectronicAgreementStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 14:
                return <TradingRulesStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 15:
                return <NewFundDeclarationStep data={stepData} onChange={updateFormData} allData={allFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 16:
                return <AccessCodeResponsibilityStep data={stepData} onChange={updateFormData} allData={allFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 17:
                return <FundDeclarationStep data={stepData} onChange={updateFormData} allData={allFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 18:
                return <ProcessVerificationStep data={stepData} onChange={updateFormData} allData={allFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
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
        
        // Validate age (must be at least 21 years old)
        if (data.tanggalLahir) {
            const birthDate = new Date(data.tanggalLahir);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ? age - 1
                : age;
                
            if (actualAge < 21) {
                errors.push('Minimum 21 years old is required');
            }
        }
        
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
        
        if (data.pengalamanInvestasi === 'Yes' && !data.pengalamanInvestasiBidang?.trim()) {
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
        
        const requiredFields = [
            { field: 'penghasilanPertahun', label: 'Penghasilan Pertahun' },
            { field: 'lokasiRumah', label: 'Lokasi Rumah' },
            { field: 'nilaiNJOP', label: 'Nilai NJOP' },
            { field: 'bankDeposit', label: 'Bank Deposit' },
            { field: 'jumlah', label: 'Jumlah' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });
        
        // lainnya is optional - no validation needed
        
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
                    { field: 'noTeleponBank', label: `Bank ${index + 1} - No. Telepon Bank` },
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
        
        // Get document requirements and check each one
        documentRequirements.forEach((category, categoryIndex) => {
            if (!category.optional) {
                category.documents.forEach((doc, docIndex) => {
                    const docKey = `${categoryIndex}_${docIndex}`;
                    const hasFile = data.uploadedFiles && data.uploadedFiles[docKey] && data.uploadedFiles[docKey].name;
                    
                    if (!hasFile) {
                        errors.push(`Missing required document: ${doc}`);
                    }
                });
            }
        });
        
        return { isValid: errors.length === 0, errors };
    };

    const validateDeclarationStep = (data) => {
        const errors = [];
        
        // Check if the declaration radio button is selected
        if (!data.declaration) {
            errors.push('Please acknowledge the company profile agreement by selecting "Ya"');
        } else if (data.declaration === 'tidak') {
            errors.push('You must select "Ya" to continue');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateTradingSimulationStep = (data) => {
        const errors = [];
        
        // Check if the trading simulation radio button is set to "ya" (Yes)
        if (!data.tradingSimulation) {
            errors.push('Please acknowledge the trading simulation agreement by selecting "Ya"');
        } else if (data.tradingSimulation === 'tidak') {
            errors.push('You must select "Ya" to continue for trading simulation');
        }
        
        // Check if trading experience is selected
        if (!data.tradingExperience) {
            errors.push('Trading experience information is required');
        }
        // Note: Trading experience can be "tidak" - users are not required to have previous experience
        
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
        } else if (data.disclosureStatement === 'tidak') {
            errors.push('You must select "Ya" to continue for disclosure statement');
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
        
        // Check final acceptance radio button
        if (!data.finalAcceptance) {
            errors.push('Please acknowledge the risk disclosure by selecting "Ya"');
        } else if (data.finalAcceptance === 'tidak') {
            errors.push('You must select "Ya" to continue for risk disclosure');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateAdditionalDisclosureStep = (data) => {
        const errors = [];
        
        if (!data.additionalDisclosureStatement) {
            errors.push('Please acknowledge the additional disclosure statement');
        } else if (data.additionalDisclosureStatement === 'tidak') {
            errors.push('You must select "Ya" to continue for additional disclosure statement');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateElectronicAgreementStep = (data) => {
        const errors = [];
        
        if (!data.electronicAgreement) {
            errors.push('Please acknowledge the electronic power of attorney agreement');
        } else if (data.electronicAgreement === 'tidak') {
            errors.push('You must select "Ya" to continue for electronic agreement');
        }
        
        if (!data.disputeResolutionBappebti || !data.disputeResolutionJakarta) {
            errors.push('Please select both dispute resolution methods');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateTradingRulesStep = (data) => {
        const errors = [];
        
        if (!data.tradingRulesAcceptance) {
            errors.push('Please acknowledge the PALN trading rules');
        } else if (data.tradingRulesAcceptance === 'no') {
            errors.push('You must select "Ya" to continue for trading rules');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateNewFundDeclarationStep = (data) => {
        const errors = [];
        
        if (!data.newFundDeclarationAcceptance) {
            errors.push('Please acknowledge the personal fund ownership declaration by selecting "Ya"');
        } else if (data.newFundDeclarationAcceptance === 'no') {
            errors.push('You must select "Ya" to continue for fund declaration');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateFundDeclarationStep = (data) => {
        const errors = [];
        
        if (!data.fundDeclarationAcceptance) {
            errors.push('Please acknowledge the fund declaration by selecting "Ya"');
        } else if (data.fundDeclarationAcceptance === 'no') {
            errors.push('You must select "Ya" to continue for fund declaration');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateAccessCodeResponsibilityStep = (data) => {
        const errors = [];
        
        if (!data.accessCodeResponsibilityAcceptance) {
            errors.push('Please acknowledge the personal access password responsibility statement');
        } else if (data.accessCodeResponsibilityAcceptance === 'no') {
            errors.push('You must select "Ya" to continue for access code responsibility');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateProcessVerificationStep = (data) => {
        const errors = [];
        
        if (!data.verificationAcceptance) {
            errors.push('Please acknowledge the electronic customer acceptance process verification');
        } else if (data.verificationAcceptance === 'no') {
            errors.push('You must select "Ya" to continue for process verification');
        }
        
        if (!data.verificationDate?.trim()) {
            errors.push('Process verification date is required');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const handleStepValidation = (stepIndex, stepData, allData) => {
        const validation = validateStep(stepIndex, stepData, allData);
        
        // Create field error mapping for red border styling
        const newFieldErrors = {};
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                // Account Information Step errors
                if (error.includes('Email address is required') || error.includes('valid email address')) newFieldErrors.email = true;
                if (error.includes('Demo account selection is required')) newFieldErrors.demoAccountNo = true;
                
                // Data Pribadi Step errors
                if (error.includes('Nama Lengkap')) newFieldErrors.namaLengkap = true;
                if (error.includes('Tempat Lahir')) newFieldErrors.tempatLahir = true;
                if (error.includes('Tanggal Lahir')) newFieldErrors.tanggalLahir = true;
                if (error.includes('Minimum 21 years old is required')) newFieldErrors.tanggalLahir = true;
                if (error.includes('No. KTP')) newFieldErrors.noKTP = true;
                if (error.includes('No. NPWP')) newFieldErrors.noNPWP = true;
                if (error.includes('Jenis Kelamin')) newFieldErrors.jenisKelamin = true;
                if (error.includes('Nama Ibu Kandung')) newFieldErrors.namaIbuKandung = true;
                if (error.includes('Status Perkawinan')) newFieldErrors.statusPerkawinan = true;
                if (error.includes('Street Address')) newFieldErrors.streetAddress = true;
                if (error.includes('City')) newFieldErrors.city = true;
                if (error.includes('Postal Code')) newFieldErrors.postalCode = true;
                if (error.includes('Country')) newFieldErrors.country = true;
                if (error.includes('Province')) newFieldErrors.province = true;
                if (error.includes('No. Handphone')) newFieldErrors.noHandphone = true;
                if (error.includes('Email')) newFieldErrors.contactEmail = true;
                if (error.includes('Status Kepemilikan Rumah')) newFieldErrors.statusKepemilikanRumah = true;
                if (error.includes('Tujuan Pembukaan Rekening')) newFieldErrors.tujuanPembukaanRekening = true;
                if (error.includes('Pengalaman Investasi')) newFieldErrors.pengalamanInvestasi = true;
                if (error.includes('Anggota Keluarga BAPPEBTI')) newFieldErrors.anggotaKeluargaBAPPEBTI = true;
                if (error.includes('Pernah Pailit')) newFieldErrors.pernahPailit = true;
                if (error.includes('WNI Tinggal di Luar Negeri')) newFieldErrors.wniLuarNegeri = true;
                
                // Conditional field errors
                if (error.includes('Please specify other home ownership status')) newFieldErrors.statusKepemilikanRumahOther = true;
                if (error.includes('Please specify other account opening purpose')) newFieldErrors.tujuanPembukaanRekeningOther = true;
                if (error.includes('Please provide details about your investment experience')) newFieldErrors.pengalamanInvestasiBidang = true;
                if (error.includes('Nama Istri/Suami is required when married')) newFieldErrors.namaIstriSuami = true;
                
                // Emergency Contact Step errors
                if (error.includes('Emergency Contact Name')) newFieldErrors.emergencyContactName = true;
                if (error.includes('Emergency Contact Phone')) newFieldErrors.emergencyContactPhone = true;
                if (error.includes('Emergency Contact Street Address')) newFieldErrors.emergencyContactStreetAddress = true;
                if (error.includes('Emergency Contact City')) newFieldErrors.emergencyContactCity = true;
                if (error.includes('Emergency Contact Postal Code')) newFieldErrors.emergencyContactPostalCode = true;
                if (error.includes('Emergency Contact Relationship')) newFieldErrors.emergencyContactRelationship = true;
                if (error.includes('Please specify other relationship')) newFieldErrors.emergencyContactRelationshipOther = true;
                
                // Data Pekerjaan Step errors
                if (error.includes('Jenis Pekerjaan')) newFieldErrors.jenisPekerjaan = true;
                if (error.includes('Please specify other employment type')) newFieldErrors.jenisPekerjaanOther = true;
                if (error.includes('Nama Perusahaan')) newFieldErrors.namaPerusahaan = true;
                if (error.includes('Bidang Usaha')) newFieldErrors.bidangUsaha = true;
                if (error.includes('Jabatan')) newFieldErrors.jabatan = true;
                if (error.includes('Lama Bekerja')) newFieldErrors.lamaBekerja = true;
                if (error.includes('Kantor Sebelumnya')) newFieldErrors.kantorSebelumnya = true;
                if (error.includes('Alamat Kantor')) newFieldErrors.alamatKantor = true;
                if (error.includes('Kota Kantor')) newFieldErrors.kotaKantor = true;
                if (error.includes('Postal Code Kantor')) newFieldErrors.postalCodeKantor = true;
                if (error.includes('No. Telepon Kantor')) newFieldErrors.noTeleponKantor = true;
                
                // Daftar Kekayaan Step errors
                if (error.includes('Penghasilan Pertahun')) newFieldErrors.penghasilanPertahun = true;
                if (error.includes('Lokasi Rumah')) newFieldErrors.lokasiRumah = true;
                if (error.includes('Nilai NJOP')) newFieldErrors.nilaiNJOP = true;
                if (error.includes('Bank Deposit')) newFieldErrors.bankDeposit = true;
                if (error.includes('Jumlah')) newFieldErrors.jumlah = true;
                if (error.includes('Account Type')) newFieldErrors.accountType = true;
            });
            
            // Bank Account Step errors - using pattern matching like Foreign Person form
            const bankFieldMappings = [
                { pattern: /Bank (\d+) - Nama Bank is required/, field: 'namaBank' },
                { pattern: /Bank (\d+) - Cabang is required/, field: 'cabang' },
                { pattern: /Bank (\d+) - No\. Rekening is required/, field: 'noRekening' },
                { pattern: /Bank (\d+) - Nama Pemilik Rekening is required/, field: 'namaPemilikRekening' },
                { pattern: /Bank (\d+) - No\. Telepon Bank is required/, field: 'noTeleponBank' },
                { pattern: /Bank (\d+) - Jenis Rekening Bank is required/, field: 'bankAccountType' },
                { pattern: /Bank (\d+) - Please specify other account type/, field: 'bankAccountTypeOther' }
            ];

            // Check for bank field errors
            validation.errors.forEach(error => {
                bankFieldMappings.forEach(({ pattern, field }) => {
                    const match = error.match(pattern);
                    if (match) {
                        const bankIndex = parseInt(match[1]) - 1;
                        newFieldErrors[field] = true;
                        newFieldErrors[`${field}_${bankIndex}`] = true;
                    }
                });
            });
            
            // Document Upload Step errors
            validation.errors.forEach(error => {
                if (error.includes('Missing required document:')) {
                    // Extract document name and find its position in requirements
                    const docName = error.replace('Missing required document: ', '');
                    documentRequirements.forEach((category, categoryIndex) => {
                        category.documents.forEach((doc, docIndex) => {
                            if (doc === docName) {
                                const docKey = `${categoryIndex}_${docIndex}`;
                                newFieldErrors[`document_${docKey}`] = true;
                            }
                        });
                    });
                }
            });
            
            // Declaration Step errors
            validation.errors.forEach(error => {
                if (error.includes('company profile agreement') || error.includes('You must select "Ya" to continue')) {
                    newFieldErrors.declaration = true;
                }
                if (error.includes('trading simulation') || error.includes('You must select "Ya" to continue for trading simulation')) {
                    newFieldErrors.tradingSimulation = true;
                }
                if (error.includes('Trading experience information is required')) {
                    newFieldErrors.tradingExperience = true;
                }
                if (error.includes('Previous broker company name is required')) {
                    newFieldErrors.brokerCompany = true;
                }
                if (error.includes('Previous demo account number is required')) {
                    newFieldErrors.demoAccountNumber = true;
                }
                if (error.includes('disclosure statement') || error.includes('You must select "Ya" to continue for disclosure statement')) {
                    newFieldErrors.disclosureStatement = true;
                }
                if (error.includes('risk disclosure') || error.includes('You must select "Ya" to continue for risk disclosure')) {
                    newFieldErrors.finalAcceptance = true;
                }
                if (error.includes('fund declaration') || error.includes('You must select "Ya" to continue for fund declaration') || error.includes('personal fund ownership declaration')) {
                    newFieldErrors.newFundDeclarationAcceptance = true;
                    newFieldErrors.fundDeclarationAcceptance = true;
                }
                
                // Risk disclosure checkbox errors
                if (error.includes('Please acknowledge risk statement')) {
                    const match = error.match(/Please acknowledge risk statement (\d+)/);
                    if (match) {
                        const statementNumber = parseInt(match[1]);
                        newFieldErrors[`point${statementNumber}`] = true;
                    }
                }
                
                // Additional disclosure statement errors
                if (error.includes('additional disclosure statement') || error.includes('You must select "Ya" to continue for additional disclosure statement')) {
                    newFieldErrors.additionalDisclosureStatement = true;
                }
                
                // Electronic agreement errors
                if (error.includes('electronic power of attorney agreement') || error.includes('You must select "Ya" to continue for electronic agreement')) {
                    newFieldErrors.electronicAgreement = true;
                }
                if (error.includes('Please select both dispute resolution methods')) {
                    newFieldErrors.disputeResolution = true;
                }
                
                // Trading rules errors
                if (error.includes('PALN trading rules') || error.includes('You must select "Ya" to continue for trading rules')) {
                    newFieldErrors.tradingRulesAcceptance = true;
                }
                
                // Access code responsibility errors
                if (error.includes('personal access password responsibility') || error.includes('You must select "Ya" to continue for access code responsibility')) {
                    newFieldErrors.accessCodeResponsibilityAcceptance = true;
                }
                
                // Process verification errors
                if (error.includes('electronic customer acceptance process verification') || error.includes('You must select "Ya" to continue for process verification')) {
                    newFieldErrors.verificationAcceptance = true;
                }
                if (error.includes('Process verification date is required')) {
                    newFieldErrors.verificationDate = true;
                }
            });
            
            // Set the field errors
            setFieldErrors(newFieldErrors);
            
            // Show notification with all validation errors
            const errorMessage = validation.errors.length === 1 
                ? validation.errors[0]
                : `Please fix the following issues: ${validation.errors.join(', ')}`;
                
            showNotification({
                title: 'Validation Error',
                message: errorMessage,
                type: 'error'
            });
        } else {
            // Clear field errors if validation passes
            setFieldErrors({});
        }
        
        return validation.isValid;
    };

    const handleStepChange = (step, data) => {
        // Step change handled by MultiStepFormWrapper
    };

    const handleSubmit = async (allFormData) => {
        try {
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
            
            // Submit using AuthService (same pattern as other forms)
            const response = await AuthService.submitIndonesianPersonKYC(formData);
            
            if (response.success) {
                showNotification({
                    title: 'Success',
                    message: `Indonesian Person KYC submitted successfully! Application Reference: ${response.data.applicationReference || response.data.applicationId}`,
                    type: 'success'
                });
                
                // Clear the form
                setFormData({});
                
                // Navigate to accounts page after successful submission
                setTimeout(() => {
                    navigate('/dashboard/accounts');
                }, 2000); // Give time for user to read the success message
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

const AccountInformationStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [email, setEmail] = useState(data.email || '');
    const [demoAccountNo, setDemoAccountNo] = useState(data.demoAccountNo || '');
    const [emailValid, setEmailValid] = useState(true);
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError) {
            clearFieldError(field);
        }
        
        if (field === 'email') {
            setEmail(value);
            const isValid = value.trim() === '' || validateEmail(value);
            setEmailValid(isValid);
            
            if (value.trim() !== '' && !isValid) {
                showNotification({
                    title: 'Invalid Email',
                    message: 'Please enter a valid email address',
                    type: 'error'
                });
            }
        }
        
        if (field === 'demoAccountNo') {
            setDemoAccountNo(value);
        }
        
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
                                isInvalid={!emailValid || fieldErrors.email}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Select Demo Account No. <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={demoAccountNo}
                                onChange={(e) => handleChange('demoAccountNo', e.target.value)}
                                isInvalid={fieldErrors.demoAccountNo}
                                required
                            >
                                <option value="">Select demo account...</option>
                                <option value="DEMO001">DEMO001 - Demo Account 1</option>
                                <option value="DEMO002">DEMO002 - Demo Account 2</option>
                                <option value="DEMO003">DEMO003 - Demo Account 3</option>
                                <option value="DEMO004">DEMO004 - Demo Account 4</option>
                                <option value="DEMO005">DEMO005 - Demo Account 5</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select a demo account.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

const DataPribadiStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError, setFieldError }) => {
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Real-time age validation for date of birth
        if (field === 'tanggalLahir' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
                ? age - 1
                : age;
                
            if (actualAge < 21) {
                showNotification({
                    title: 'Age Requirement',
                    message: 'You must be at least 21 years old to register',
                    type: 'error'
                });
                // Set field error to make border red immediately
                if (setFieldError) {
                    setFieldError('tanggalLahir');
                }
            } else {
                // Clear field error when age is valid
                if (clearFieldError) {
                    clearFieldError(field);
                }
            }
        } else {
            // Clear field error when user starts typing (for non-date fields)
            if (clearFieldError) {
                clearFieldError(field);
            }
        }
        
        // Clear conditional fields when switching options
        if (field === 'statusKepemilikanRumah' && value !== 'Lainnya') {
            newData.statusKepemilikanRumahOther = '';
            if (clearFieldError) {
                clearFieldError('statusKepemilikanRumahOther');
            }
        }
        
        if (field === 'tujuanPembukaanRekening' && value !== 'Lainnya') {
            newData.tujuanPembukaanRekeningOther = '';
            if (clearFieldError) {
                clearFieldError('tujuanPembukaanRekeningOther');
            }
        }
        
        if (field === 'pengalamanInvestasi' && value !== 'Yes') {
            newData.pengalamanInvestasiBidang = '';
            if (clearFieldError) {
                clearFieldError('pengalamanInvestasiBidang');
            }
        }
        
        onChange(newData);
    };

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
                                onChange={(e) => handleChange('namaLengkap', e.target.value)}
                                isInvalid={fieldErrors.namaLengkap}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your full name.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Tempat Lahir <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Place of birth"
                                value={data.tempatLahir || ''}
                                onChange={(e) => handleChange('tempatLahir', e.target.value)}
                                isInvalid={fieldErrors.tempatLahir}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your place of birth.
                            </Form.Control.Feedback>
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
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => handleChange('tanggalLahir', e.target.value)}
                                isInvalid={fieldErrors.tanggalLahir}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please select a valid date of birth. You must be at least 21 years old.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. KTP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your KTP number"
                                value={data.noKTP || ''}
                                onChange={(e) => handleChange('noKTP', e.target.value)}
                                isInvalid={fieldErrors.noKTP}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your KTP number.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('noNPWP', e.target.value)}
                                isInvalid={fieldErrors.noNPWP}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your NPWP number.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Jenis Kelamin <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.jenisKelamin || ''}
                                onChange={(e) => handleChange('jenisKelamin', e.target.value)}
                                isInvalid={fieldErrors.jenisKelamin}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select your gender.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('namaIbuKandung', e.target.value)}
                                isInvalid={fieldErrors.namaIbuKandung}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your mother's full name.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Status Perkawinan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.statusPerkawinan || ''}
                                onChange={(e) => handleChange('statusPerkawinan', e.target.value)}
                                isInvalid={fieldErrors.statusPerkawinan}
                                required
                            >
                                <option value="">Select Marital Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select your marital status.
                            </Form.Control.Feedback>
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
                                    onChange={(e) => handleChange('namaIstriSuami', e.target.value)}
                                    isInvalid={fieldErrors.namaIstriSuami}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter your spouse's full name.
                                </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('streetAddress', e.target.value)}
                                isInvalid={fieldErrors.streetAddress}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your street address.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={data.city || ''}
                                onChange={(e) => handleChange('city', e.target.value)}
                                isInvalid={fieldErrors.city}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your city.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('postalCode', e.target.value)}
                                isInvalid={fieldErrors.postalCode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your postal code.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('noHandphone', e.target.value)}
                                isInvalid={fieldErrors.noHandphone}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter your mobile phone number.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('statusKepemilikanRumah', e.target.value)}
                                isInvalid={fieldErrors.statusKepemilikanRumah}
                                required
                            >
                                <option value="">Select House Ownership Status</option>
                                <option value="Pribadi">Pribadi</option>
                                <option value="Keluarga">Keluarga</option>
                                <option value="Sewa/Kontrak">Sewa/Kontrak</option>
                                <option value="Lainnya">Lainnya</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select house ownership status.
                            </Form.Control.Feedback>
                            {data.statusKepemilikanRumah === 'Lainnya' && (
                                <>
                                    <Form.Control
                                        type="text"
                                        placeholder="Sebutkan status kepemilikan rumah lainnya"
                                        value={data.statusKepemilikanRumahOther || ''}
                                        onChange={(e) => handleChange('statusKepemilikanRumahOther', e.target.value)}
                                        isInvalid={fieldErrors.statusKepemilikanRumahOther}
                                        className="mt-2"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please specify other house ownership status.
                                    </Form.Control.Feedback>
                                </>
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
                                onChange={(e) => handleChange('tujuanPembukaanRekening', e.target.value)}
                                isInvalid={fieldErrors.tujuanPembukaanRekening}
                                required
                            >
                                <option value="">Select Account Purpose</option>
                                <option value="Lindung Nilai">Lindung Nilai</option>
                                <option value="Keuntungan">Keuntungan</option>
                                <option value="Spekulasi">Spekulasi</option>
                                <option value="Lainnya">Lainnya</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select account opening purpose.
                            </Form.Control.Feedback>
                            {data.tujuanPembukaanRekening === 'Lainnya' && (
                                <>
                                    <Form.Control
                                        type="text"
                                        placeholder="Sebutkan tujuan pembukaan rekening lainnya"
                                        value={data.tujuanPembukaanRekeningOther || ''}
                                        onChange={(e) => handleChange('tujuanPembukaanRekeningOther', e.target.value)}
                                        isInvalid={fieldErrors.tujuanPembukaanRekeningOther}
                                        className="mt-2"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please specify other account opening purpose.
                                    </Form.Control.Feedback>
                                </>
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Pengalaman Investasi <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.pengalamanInvestasi || ''}
                                onChange={(e) => handleChange('pengalamanInvestasi', e.target.value)}
                                isInvalid={fieldErrors.pengalamanInvestasi}
                                required
                            >
                                <option value="">Select Investment Experience</option>
                                <option value="Yes">Yes</option>
                                <option value="None">None</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select your investment experience.
                            </Form.Control.Feedback>
                            {data.pengalamanInvestasi === 'Yes' && (
                                <div className="mt-2">
                                    <Form.Label className="text-muted">Pengalaman Investasi Bidang <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Explain Investment Experience"
                                        value={data.pengalamanInvestasiBidang || ''}
                                        onChange={(e) => handleChange('pengalamanInvestasiBidang', e.target.value)}
                                        isInvalid={fieldErrors.pengalamanInvestasiBidang}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please explain your investment experience.
                                    </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('anggotaKeluargaBAPPEBTI', e.target.value)}
                                isInvalid={fieldErrors.anggotaKeluargaBAPPEBTI}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select an answer for BAPPEBTI family question.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('pernahPailit', e.target.value)}
                                isInvalid={fieldErrors.pernahPailit}
                                required
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select an answer for bankruptcy question.
                            </Form.Control.Feedback>
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

const EmergencyContactStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError, setFieldError }) => {
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError) {
            clearFieldError(field);
        }
        
        // Clear conditional fields when switching options
        if (field === 'emergencyContactRelationship' && value !== 'Lainnya') {
            newData.emergencyContactRelationshipOther = '';
            if (clearFieldError) {
                clearFieldError('emergencyContactRelationshipOther');
            }
        }
        
        onChange(newData);
    };

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
                                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactName}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter emergency contact full name.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">No. Handphone <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Emergency contact phone number"
                                value={data.emergencyContactPhone || ''}
                                onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactPhone}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter emergency contact phone number.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('emergencyContactStreetAddress', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactStreetAddress}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter emergency contact street address.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={data.emergencyContactCity || ''}
                                onChange={(e) => handleChange('emergencyContactCity', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactCity}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter emergency contact city.
                            </Form.Control.Feedback>
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
                                onChange={(e) => handleChange('emergencyContactPostalCode', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactPostalCode}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter emergency contact postal code.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Hubungan dengan Anda <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => handleChange('emergencyContactRelationship', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactRelationship}
                                required
                            >
                                <option value="">Select Relationship</option>
                                <option value="Pasangan">Pasangan (Spouse)</option>
                                <option value="Keluarga">Keluarga (Family)</option>
                                <option value="Anak">Anak (Child)</option>
                                <option value="Lainnya">Lainnya (Other)</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select relationship.
                            </Form.Control.Feedback>
                            {data.emergencyContactRelationship === 'Lainnya' && (
                                <>
                                    <Form.Control
                                        type="text"
                                        placeholder="Sebutkan hubungan lainnya"
                                        value={data.emergencyContactRelationshipOther || ''}
                                        onChange={(e) => handleChange('emergencyContactRelationshipOther', e.target.value)}
                                        isInvalid={fieldErrors.emergencyContactRelationshipOther}
                                        className="mt-2"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please specify other relationship.
                                    </Form.Control.Feedback>
                                </>
                            )}
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const DataPekerjaanStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError, setFieldError }) => {
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError) {
            clearFieldError(field);
        }
        
        // Clear conditional fields when switching employment type
        if (field === 'jenisPekerjaan') {
            // Clear all employment-related fields when changing job type
            if (value !== 'Swasta' && value !== 'Wiraswasta' && value !== 'Profesional' && value !== 'ASN') {
                const fieldsToeClear = [
                    'namaPerusahaan', 'bidangUsaha', 'jabatan', 'lamaBekerja', 
                    'kantorSebelumnya', 'alamatKantor', 'kotaKantor', 'postalCodeKantor', 
                    'noTeleponKantor', 'noFaksimiliKantor'
                ];
                fieldsToeClear.forEach(fieldName => {
                    newData[fieldName] = '';
                    if (clearFieldError) {
                        clearFieldError(fieldName);
                    }
                });
            }
            
            // Clear "other" field when not selecting "Lainnya"
            if (value !== 'Lainnya') {
                newData.jenisPekerjaanOther = '';
                if (clearFieldError) {
                    clearFieldError('jenisPekerjaanOther');
                }
            }
        }
        
        onChange(newData);
    };

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
                                onChange={(e) => handleChange('jenisPekerjaan', e.target.value)}
                                isInvalid={fieldErrors.jenisPekerjaan}
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
                            <Form.Control.Feedback type="invalid">
                                Please select employment type.
                            </Form.Control.Feedback>
                            {data.jenisPekerjaan === 'Lainnya' && (
                                <>
                                    <Form.Control
                                        type="text"
                                        placeholder="Sebutkan jenis pekerjaan lainnya"
                                        value={data.jenisPekerjaanOther || ''}
                                        onChange={(e) => handleChange('jenisPekerjaanOther', e.target.value)}
                                        isInvalid={fieldErrors.jenisPekerjaanOther}
                                        className="mt-2"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please specify other employment type.
                                    </Form.Control.Feedback>
                                </>
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
                                        onChange={(e) => handleChange('namaPerusahaan', e.target.value)}
                                        isInvalid={fieldErrors.namaPerusahaan}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter company name.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Bidang Usaha <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nature of Business"
                                        value={data.bidangUsaha || ''}
                                        onChange={(e) => handleChange('bidangUsaha', e.target.value)}
                                        isInvalid={fieldErrors.bidangUsaha}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter nature of business.
                                    </Form.Control.Feedback>
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
                                        onChange={(e) => handleChange('jabatan', e.target.value)}
                                        isInvalid={fieldErrors.jabatan}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your position.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Lama Bekerja <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Length of Work"
                                        value={data.lamaBekerja || ''}
                                        onChange={(e) => handleChange('lamaBekerja', e.target.value)}
                                        isInvalid={fieldErrors.lamaBekerja}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter length of work.
                                    </Form.Control.Feedback>
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
                                        onChange={(e) => handleChange('kantorSebelumnya', e.target.value)}
                                        isInvalid={fieldErrors.kantorSebelumnya}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter previous company.
                                    </Form.Control.Feedback>
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
                                        onChange={(e) => handleChange('alamatKantor', e.target.value)}
                                        isInvalid={fieldErrors.alamatKantor}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter office address.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">City <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="City"
                                        value={data.kotaKantor || ''}
                                        onChange={(e) => handleChange('kotaKantor', e.target.value)}
                                        isInvalid={fieldErrors.kotaKantor}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter office city.
                                    </Form.Control.Feedback>
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
                                        onChange={(e) => handleChange('postalCodeKantor', e.target.value)}
                                        isInvalid={fieldErrors.postalCodeKantor}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter office postal code.
                                    </Form.Control.Feedback>
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
                                        onChange={(e) => handleChange('noTeleponKantor', e.target.value)}
                                        isInvalid={fieldErrors.noTeleponKantor}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter office phone number.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">No. Faksimili Kantor (Optional)</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Office Fax No"
                                        value={data.noFaksimiliKantor || ''}
                                        onChange={(e) => handleChange('noFaksimiliKantor', e.target.value)}
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

const DaftarKekayaanStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError, setFieldError }) => {
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (field, value) => {
        // Validate numeric fields
        if (['nilaiNJOP', 'bankDeposit', 'jumlah'].includes(field)) {
            // Allow empty string or valid numbers (including decimals)
            if (value !== '' && (isNaN(value) || value < 0)) {
                showNotification({
                    title: 'Invalid Input',
                    message: 'Please enter a valid positive number',
                    type: 'error'
                });
                return; // Don't update if invalid
            }
        }
        
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError) {
            clearFieldError(field);
        }
        
        onChange(newData);
    };

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
                                onChange={(e) => handleChange('penghasilanPertahun', e.target.value)}
                                isInvalid={fieldErrors.penghasilanPertahun}
                                required
                            >
                                <option value="">Select Annual Income</option>
                                <option value="Antara 100 - 250 juta rupiah">Antara 100 - 250 juta rupiah (Between 100 - 250 million rupiah)</option>
                                <option value="Antara 250 - 500 juta rupiah">Antara 250 - 500 juta rupiah (Between 250 - 500 million rupiah)</option>
                                <option value="Di atas 500 juta rupiah">Di atas 500 juta rupiah (Above 500 million rupiah)</option>
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Please select annual income.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Lokasi Rumah <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Home location"
                                value={data.lokasiRumah || ''}
                                onChange={(e) => handleChange('lokasiRumah', e.target.value)}
                                isInvalid={fieldErrors.lokasiRumah}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter home location.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Nilai NJOP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Sales Value of Taxable Object"
                                value={data.nilaiNJOP || ''}
                                onChange={(e) => handleChange('nilaiNJOP', e.target.value)}
                                isInvalid={fieldErrors.nilaiNJOP}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid NJOP value (numbers only).
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Bank Deposit <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Deposit Bank"
                                value={data.bankDeposit || ''}
                                onChange={(e) => handleChange('bankDeposit', e.target.value)}
                                isInvalid={fieldErrors.bankDeposit}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid bank deposit amount (numbers only).
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Jumlah <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Total amount"
                                value={data.jumlah || ''}
                                onChange={(e) => handleChange('jumlah', e.target.value)}
                                isInvalid={fieldErrors.jumlah}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid total amount (numbers only).
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Lainnya</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Other assets"
                                value={data.lainnya || ''}
                                onChange={(e) => handleChange('lainnya', e.target.value)}
                            />
                        </Form.Group>
                </Col>
            </Row>
            </Form>
        </div>
    );
};

const RekeningBankStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError, setFieldError }) => {
    const [bankAccounts, setBankAccounts] = useState(data.bankAccounts || [{ 
        namaBank: '', 
        cabang: '', 
        noRekening: '', 
        namaPemilikRekening: '', 
        noTeleponBank: '', 
        bankAccountType: '',
        bankAccountTypeOther: ''
    }]);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Ensure bank accounts are initialized in parent data if not present
        if (!data.bankAccounts && bankAccounts.length > 0) {
            onChange({ ...data, bankAccounts: bankAccounts });
        }
    }, []);

    // Update parent data when bank accounts change
    useEffect(() => {
        if (bankAccounts.length > 0) {
            onChange({ ...data, bankAccounts: bankAccounts });
        }
    }, [bankAccounts]);

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
        const newAccounts = [...bankAccounts];
        newAccounts[index] = { ...newAccounts[index], [field]: value };
        setBankAccounts(newAccounts);
        onChange({ ...data, bankAccounts: newAccounts });
        
        // Clear field errors when user starts typing - using pattern from Foreign Person form
        if (clearFieldError) {
            clearFieldError(field);
            clearFieldError(`${field}_${index}`);
        }
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
                                            isInvalid={fieldErrors.namaBank || fieldErrors[`namaBank_${index}`]}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Nama Bank is required.
                                        </Form.Control.Feedback>
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
                                            isInvalid={fieldErrors.cabang || fieldErrors[`cabang_${index}`]}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Cabang is required.
                                        </Form.Control.Feedback>
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
                                            isInvalid={fieldErrors.noRekening || fieldErrors[`noRekening_${index}`]}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            No. Rekening is required.
                                        </Form.Control.Feedback>
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
                                            isInvalid={fieldErrors.namaPemilikRekening || fieldErrors[`namaPemilikRekening_${index}`]}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Nama Pemilik Rekening is required.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">No. Telepon Bank <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="tel"
                                            placeholder="Bank phone number"
                                            value={account.noTeleponBank || ''}
                                            onChange={(e) => updateBankAccount(index, 'noTeleponBank', e.target.value)}
                                            isInvalid={fieldErrors.noTeleponBank || fieldErrors[`noTeleponBank_${index}`]}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            No. Telepon Bank is required.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-muted">Jenis Rekening Bank <span className="text-danger">*</span></Form.Label>
                                        <Form.Select
                                            value={account.bankAccountType || ''}
                                            onChange={(e) => {
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
                                                
                                                // Clear field error when user makes selection
                                                if (clearFieldError) {
                                                    clearFieldError('bankAccountType');
                                                    clearFieldError(`bankAccountType_${index}`);
                                                }
                                            }}
                                            isInvalid={fieldErrors.bankAccountType || fieldErrors[`bankAccountType_${index}`]}
                                            required
                                        >
                                            <option value="">Select Account Type</option>
                                            <option value="GIRO">Giro</option>
                                            <option value="TABUNGAN">Tabungan</option>
                                            <option value="LAINNYA">Lainnya</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Jenis Rekening Bank is required.
                                        </Form.Control.Feedback>
                                        {account.bankAccountType === 'LAINNYA' && (
                                            <Form.Control
                                                type="text"
                                                placeholder="Sebutkan jenis rekening bank lainnya"
                                                value={account.bankAccountTypeOther || ''}
                                                onChange={(e) => updateBankAccount(index, 'bankAccountTypeOther', e.target.value)}
                                                isInvalid={fieldErrors.bankAccountTypeOther || fieldErrors[`bankAccountTypeOther_${index}`]}
                                                className="mt-2"
                                                required
                                            />
                                        )}
                                        {account.bankAccountType === 'LAINNYA' && (fieldErrors.bankAccountTypeOther || fieldErrors[`bankAccountTypeOther_${index}`]) && (
                                            <div className="invalid-feedback d-block">
                                                Please specify other account type.
                                            </div>
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

const DeclarationStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return <CompanyProfileDeclaration data={data} onChange={onChange} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
};

const CompanyProfileDeclaration = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
                        <div className={`d-flex gap-4 ${fieldErrors.declaration ? 'is-invalid' : ''}`}>
                            <Form.Check
                                type="radio"
                                id="declaration-ya"
                                name="declaration"
                                label="Ya"
                                value="ya"
                                checked={data.declaration === 'ya'}
                                onChange={(e) => {
                                    onChange({ ...data, declaration: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('declaration');
                                    }
                                }}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="declaration-tidak"
                                name="declaration"
                                label="Tidak"
                                value="tidak"
                                checked={data.declaration === 'tidak'}
                                onChange={(e) => {
                                    onChange({ ...data, declaration: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('declaration');
                                    }
                                }}
                                required
                            />
                        </div>
                        {data.declaration === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                        {fieldErrors.declaration && data.declaration !== 'tidak' && (
                            <div className="invalid-feedback d-block">
                                Please acknowledge the company profile agreement by selecting "Ya"
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

const TradingSimulationDeclaration = ({ data = {}, onChange, allData = {}, fieldErrors = {}, clearFieldError }) => {
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
                        <div className={`d-flex gap-4 ${fieldErrors.tradingSimulation ? 'is-invalid' : ''}`}>
                            <Form.Check
                                type="radio"
                                id="trading-simulation-ya"
                                name="tradingSimulation"
                                label="Ya"
                                value="ya"
                                checked={data.tradingSimulation === 'ya'}
                                onChange={(e) => {
                                    onChange({ ...data, tradingSimulation: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('tradingSimulation');
                                    }
                                }}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="trading-simulation-tidak"
                                name="tradingSimulation"
                                label="Tidak"
                                value="tidak"
                                checked={data.tradingSimulation === 'tidak'}
                                onChange={(e) => {
                                    onChange({ ...data, tradingSimulation: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('tradingSimulation');
                                    }
                                }}
                                required
                            />
                        </div>
                        {data.tradingSimulation === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                        {fieldErrors.tradingSimulation && data.tradingSimulation !== 'tidak' && (
                            <div className="invalid-feedback d-block">
                                Please acknowledge the trading simulation by selecting "Ya"
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
                        <div className={`d-flex gap-4 ${fieldErrors.tradingExperience && !data.tradingExperience ? 'is-invalid' : ''}`}>
                            <Form.Check
                                type="radio"
                                id="trading-experience-ya"
                                name="tradingExperience"
                                label="Ya"
                                value="ya"
                                checked={data.tradingExperience === 'ya'}
                                onChange={(e) => {
                                    onChange({ ...data, tradingExperience: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('tradingExperience');
                                    }
                                }}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="trading-experience-tidak"
                                name="tradingExperience"
                                label="Tidak"
                                value="tidak"
                                checked={data.tradingExperience === 'tidak'}
                                onChange={(e) => {
                                    onChange({ ...data, tradingExperience: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('tradingExperience');
                                    }
                                }}
                                required
                            />
                        </div>
                        {fieldErrors.tradingExperience && (
                            <div className="invalid-feedback d-block">
                                Please select your trading experience
                            </div>
                        )}
                    </Form.Group>

                    {data.tradingExperience === 'ya' && (
                        <>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted"><strong>Sebutkan Perusahaan Pialang <span className="text-danger">*</span></strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Broker Company Name"
                                    value={data.brokerCompany || ''}
                                    onChange={(e) => {
                                        onChange({ ...data, brokerCompany: e.target.value });
                                        if (clearFieldError) {
                                            clearFieldError('brokerCompany');
                                        }
                                    }}
                                    isInvalid={fieldErrors.brokerCompany}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Previous broker company name is required
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-muted"><strong>No Demo Akun (Pengalaman Transaksi) <span className="text-danger">*</span></strong></Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Demo Account Number"
                                    value={data.demoAccountNumber || ''}
                                    onChange={(e) => {
                                        onChange({ ...data, demoAccountNumber: e.target.value });
                                        if (clearFieldError) {
                                            clearFieldError('demoAccountNumber');
                                        }
                                    }}
                                    isInvalid={fieldErrors.demoAccountNumber}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Previous demo account number is required
                                </Form.Control.Feedback>
                            </Form.Group>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

const DisclosureStatementStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
                        <div className={`d-flex gap-4 ${fieldErrors.disclosureStatement ? 'is-invalid' : ''}`}>
                            <Form.Check
                                type="radio"
                                id="disclosure-ya"
                                name="disclosureStatement"
                                label="Ya"
                                value="ya"
                                checked={data.disclosureStatement === 'ya'}
                                onChange={(e) => {
                                    onChange({ ...data, disclosureStatement: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('disclosureStatement');
                                    }
                                }}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="disclosure-tidak"
                                name="disclosureStatement"
                                label="Tidak"
                                value="tidak"
                                checked={data.disclosureStatement === 'tidak'}
                                onChange={(e) => {
                                    onChange({ ...data, disclosureStatement: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('disclosureStatement');
                                    }
                                }}
                                required
                            />
                        </div>
                        {data.disclosureStatement === 'tidak' && (
                            <div className="mt-2">
                                <small className="text-danger">You must select "Ya" to continue</small>
                            </div>
                        )}
                        {fieldErrors.disclosureStatement && data.disclosureStatement !== 'tidak' && (
                            <div className="invalid-feedback d-block">
                                Please acknowledge the disclosure statement by selecting "Ya"
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

const DocumentUploadStep = ({ data = {}, onChange, requirements, fieldErrors = {}, clearFieldError }) => {
    const [uploadedDocs, setUploadedDocs] = useState(data.uploadedFiles || {});
    const fileInputRefs = useRef({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFileUpload = (categoryIndex, docIndex, file) => {
        if (!file) return;

        const docKey = `${categoryIndex}_${docIndex}`;
        const newUploadedDocs = {
            ...uploadedDocs,
            [docKey]: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                file: file
            }
        };

        setUploadedDocs(newUploadedDocs);
        onChange({ ...data, uploadedFiles: newUploadedDocs });

        // Clear field error when file is uploaded
        if (clearFieldError) {
            clearFieldError(`document_${docKey}`);
        }

        // Clear the file input
        if (fileInputRefs.current[docKey]) {
            fileInputRefs.current[docKey].value = '';
        }
    };

    const handleFileRemove = (categoryIndex, docIndex) => {
        const docKey = `${categoryIndex}_${docIndex}`;
        const newUploadedDocs = { ...uploadedDocs };
        delete newUploadedDocs[docKey];

        setUploadedDocs(newUploadedDocs);
        onChange({ ...data, uploadedFiles: newUploadedDocs });

        // Clear the file input value
        if (fileInputRefs.current[docKey]) {
            fileInputRefs.current[docKey].value = '';
        }
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Document Upload</h4>
                <p className="text-muted fs-5">Upload all required documents</p>
            </div>

            {requirements.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">
                            {category.category}
                            {category.optional && <span className="text-muted ms-2">(Optional)</span>}
                        </h6>
                    </Card.Header>
                    <Card.Body>
                        {category.documents.map((doc, docIndex) => {
                            const docKey = `${categoryIndex}_${docIndex}`;
                            const isUploaded = uploadedDocs[docKey];
                            
                            return (
                                <Form.Group key={docIndex} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Form.Label className="text-muted mb-0">
                                            {doc}
                                            {!category.optional && <span className="text-danger">*</span>}
                                            {isUploaded && (
                                                <span className="text-success ms-2">
                                                    <i className="mdi mdi-check-circle"></i> Uploaded: {isUploaded.name}
                                                </span>
                                            )}
                                        </Form.Label>
                                        {isUploaded && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleFileRemove(categoryIndex, docIndex)}
                                                title="Remove file"
                                            >
                                                <i className="mdi mdi-delete"></i> Remove
                                            </button>
                                        )}
                                    </div>
                                    
                                    {/* Show file input when no file uploaded */}
                                    {!isUploaded && (
                                        <Form.Control 
                                            type="file" 
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileUpload(categoryIndex, docIndex, e.target.files[0])}
                                            isInvalid={fieldErrors[`document_${docKey}`]}
                                            className="mt-2"
                                            ref={(el) => {
                                                if (el) {
                                                    fileInputRefs.current[docKey] = el;
                                                }
                                            }}
                                        />
                                    )}
                                    
                                    {/* Show custom file display when file uploaded */}
                                    {isUploaded && (
                                        <div className="mt-2">
                                            <div className={`form-control d-flex align-items-center ${fieldErrors[`document_${docKey}`] ? 'is-invalid' : ''}`}>
                                                <i className="mdi mdi-file-document me-2 text-primary"></i>
                                                <span className="flex-grow-1">{isUploaded.name}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Form.Text className="text-muted">
                                        Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG 
                                    </Form.Text>

                                    {fieldErrors[`document_${docKey}`] && (
                                        <div className="invalid-feedback d-block">
                                            This document is required.
                                        </div>
                                    )}
                                </Form.Group>
                            );
                        })}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};


const RiskDisclosureDocumentStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const handleCheckboxChange = (field, value) => {
        onChange({ ...data, [field]: value });
        
        // Clear field error when checkbox is checked
        if (clearFieldError && value) {
            clearFieldError(field);
        }
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
                                    isInvalid={fieldErrors[point.id]}
                                    required
                                />
                                {fieldErrors[point.id] && (
                                    <div className="invalid-feedback d-block">
                                        Please acknowledge this risk statement
                                    </div>
                                )}
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
                            <div className={`d-flex gap-4 ${fieldErrors.finalAcceptance ? 'is-invalid' : ''}`}>
                                <Form.Check
                                    type="radio"
                                    id="final-acceptance-ya"
                                    name="finalAcceptance"
                                    label="Ya (Yes)"
                                    value="ya"
                                    checked={data.finalAcceptance === 'ya'}
                                    onChange={(e) => {
                                        onChange({ ...data, finalAcceptance: e.target.value });
                                        if (clearFieldError) {
                                            clearFieldError('finalAcceptance');
                                        }
                                    }}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    id="final-acceptance-tidak"
                                    name="finalAcceptance"
                                    label="Tidak (No)"
                                    value="tidak"
                                    checked={data.finalAcceptance === 'tidak'}
                                    onChange={(e) => {
                                        onChange({ ...data, finalAcceptance: e.target.value });
                                        if (clearFieldError) {
                                            clearFieldError('finalAcceptance');
                                        }
                                    }}
                                    required
                                />
                            </div>
                            {data.finalAcceptance === 'tidak' && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
                            {fieldErrors.finalAcceptance && data.finalAcceptance !== 'tidak' && (
                                <div className="invalid-feedback d-block">
                                    Please acknowledge the risk disclosure by selecting "Ya"
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


const AdditionalDisclosureStatementStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
                        <div className={`d-flex gap-4 ${fieldErrors.additionalDisclosureStatement ? 'is-invalid' : ''}`}>
                            <Form.Check
                                type="radio"
                                id="additional-disclosure-ya"
                                name="additionalDisclosureStatement"
                                label="Ya"
                                value="ya"
                                checked={data.additionalDisclosureStatement === 'ya'}
                                onChange={(e) => {
                                    onChange({ ...data, additionalDisclosureStatement: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('additionalDisclosureStatement');
                                    }
                                }}
                                required
                            />
                            <Form.Check
                                type="radio"
                                id="additional-disclosure-tidak"
                                name="additionalDisclosureStatement"
                                label="Tidak"
                                value="tidak"
                                checked={data.additionalDisclosureStatement === 'tidak'}
                                onChange={(e) => {
                                    onChange({ ...data, additionalDisclosureStatement: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('additionalDisclosureStatement');
                                    }
                                }}
                                required
                            />
                        </div>
                        {fieldErrors.additionalDisclosureStatement && (
                            <div className="invalid-feedback d-block">
                                You must select "Ya" to continue
                            </div>
                        )}
                        {data.additionalDisclosureStatement === 'tidak' && !fieldErrors.additionalDisclosureStatement && (
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

const ElectronicAgreementStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
                        
                        <div className={`border p-3 bg-light mb-3 ${fieldErrors.disputeResolution ? 'border-danger' : ''}`}>
                            <p className="text-danger mb-2"><strong>Penyelesaian Perselisihan Melalui : <span className="text-danger">*</span></strong></p>
                            <Form.Check
                                type="checkbox"
                                id="dispute-bappebti"
                                label="Badan Arbitrase Perdagangan Berjangka Komoditi (BAKTI)"
                                checked={data.disputeResolutionBappebti || false}
                                onChange={(e) => {
                                    onChange({ ...data, disputeResolutionBappebti: e.target.checked });
                                    if (clearFieldError) {
                                        clearFieldError('disputeResolution');
                                    }
                                }}
                                isInvalid={fieldErrors.disputeResolution}
                            />
                            <Form.Check
                                type="checkbox"
                                id="dispute-jakarta"
                                label="Pengadilan Negeri Jakarta Barat"
                                checked={data.disputeResolutionJakarta || false}
                                onChange={(e) => {
                                    onChange({ ...data, disputeResolutionJakarta: e.target.checked });
                                    if (clearFieldError) {
                                        clearFieldError('disputeResolution');
                                    }
                                }}
                                isInvalid={fieldErrors.disputeResolution}
                            />
                            {fieldErrors.disputeResolution && (
                                <div className="invalid-feedback d-block mt-2">
                                    Please select both dispute resolution methods
                                </div>
                            )}
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
                            <div className={`d-flex gap-4 ${fieldErrors.electronicAgreement ? 'is-invalid' : ''}`}>
                                <Form.Check
                                    type="radio"
                                    id="electronic-agreement-ya"
                                    name="electronicAgreement"
                                    label="Ya"
                                    value="ya"
                                    checked={data.electronicAgreement === 'ya'}
                                    onChange={(e) => {
                                        onChange({ ...data, electronicAgreement: e.target.value });
                                        if (clearFieldError) {
                                            clearFieldError('electronicAgreement');
                                        }
                                    }}
                                    required
                                />
                                <Form.Check
                                    type="radio"
                                    id="electronic-agreement-tidak"
                                    name="electronicAgreement"
                                    label="Tidak"
                                    value="tidak"
                                    checked={data.electronicAgreement === 'tidak'}
                                    onChange={(e) => {
                                        onChange({ ...data, electronicAgreement: e.target.value });
                                        if (clearFieldError) {
                                            clearFieldError('electronicAgreement');
                                        }
                                    }}
                                    required
                                />
                            </div>
                            {fieldErrors.electronicAgreement && (
                                <div className="invalid-feedback d-block">
                                    You must select "Ya" to continue
                                </div>
                            )}
                            {data.electronicAgreement === 'tidak' && !fieldErrors.electronicAgreement && (
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

const TradingRulesStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const handleCheckboxChange = (field, value) => {
        onChange({ ...data, [field]: value });
        
        // Clear field error when checkbox is checked
        if (clearFieldError && value) {
            clearFieldError(field);
        }
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
                            <div className={`d-flex gap-3 ${fieldErrors.tradingRulesAcceptance ? 'is-invalid' : ''}`}>
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
                            {fieldErrors.tradingRulesAcceptance && (
                                <div className="invalid-feedback d-block">
                                    You must select "Ya" to continue
                                </div>
                            )}
                            {data.tradingRulesAcceptance === 'no' && !fieldErrors.tradingRulesAcceptance && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
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

const NewFundDeclarationStep = ({ data = {}, onChange, allData = {}, fieldErrors = {}, clearFieldError }) => {
    const handleInputChange = (field, value) => {
        onChange({ ...data, [field]: value });
        
        // Clear field error when user makes a selection
        if (clearFieldError && field === 'newFundDeclarationAcceptance') {
            clearFieldError('newFundDeclarationAcceptance');
        }
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
                            <div className={`d-flex gap-3 ${fieldErrors.newFundDeclarationAcceptance ? 'is-invalid' : ''}`}>
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
                            {fieldErrors.newFundDeclarationAcceptance && (
                                <div className="invalid-feedback d-block">
                                    You must select "Ya" to continue
                                </div>
                            )}
                            {data.newFundDeclarationAcceptance === 'no' && !fieldErrors.newFundDeclarationAcceptance && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
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

const AccessCodeResponsibilityStep = ({ data = {}, onChange, allData = {}, fieldErrors = {}, clearFieldError }) => {
    const handleInputChange = (field, value) => {
        onChange({ ...data, [field]: value });
        
        // Clear field error when user makes a selection
        if (clearFieldError && field === 'accessCodeResponsibilityAcceptance') {
            clearFieldError('accessCodeResponsibilityAcceptance');
        }
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
                            <p><strong>No. KTP / SIM / Paspor</strong> : {idNumber}</p>
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
                            <div className={`d-flex gap-3 ${fieldErrors.accessCodeResponsibilityAcceptance ? 'is-invalid' : ''}`}>
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
                            {fieldErrors.accessCodeResponsibilityAcceptance && (
                                <div className="invalid-feedback d-block">
                                    You must select "Ya" to continue
                                </div>
                            )}
                            {data.accessCodeResponsibilityAcceptance === 'no' && !fieldErrors.accessCodeResponsibilityAcceptance && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
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

const FundDeclarationStep = ({ data = {}, onChange, allData = {}, fieldErrors = {}, clearFieldError }) => {
    const handleInputChange = (field, value) => {
        onChange({ ...data, [field]: value });
        
        // Clear field error when user makes a selection
        if (clearFieldError && field === 'fundDeclarationAcceptance') {
            clearFieldError('fundDeclarationAcceptance');
        }
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
                            <div className={`d-flex gap-3 ${fieldErrors.fundDeclarationAcceptance ? 'is-invalid' : ''}`}>
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
                            {fieldErrors.fundDeclarationAcceptance && (
                                <div className="invalid-feedback d-block">
                                    You must select "Ya" to continue
                                </div>
                            )}
                            {data.fundDeclarationAcceptance === 'no' && !fieldErrors.fundDeclarationAcceptance && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
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


const ProcessVerificationStep = ({ data = {}, onChange, allData = {}, fieldErrors = {}, clearFieldError }) => {
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
                            <Row className={`mt-3 ${fieldErrors.verificationAcceptance ? 'is-invalid' : ''}`}>
                                <Col md={3}>
                                    <Form.Check
                                        type="radio"
                                        name="verificationAcceptance"
                                        id="verificationYes"
                                        label="Ya"
                                        checked={data.verificationAcceptance === 'yes'}
                                        onChange={(e) => {
                                            onChange({ ...data, verificationAcceptance: 'yes' });
                                            if (clearFieldError) {
                                                clearFieldError('verificationAcceptance');
                                            }
                                        }}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Check
                                        type="radio"
                                        name="verificationAcceptance"
                                        id="verificationNo"
                                        label="Tidak"
                                        checked={data.verificationAcceptance === 'no'}
                                        onChange={(e) => {
                                            onChange({ ...data, verificationAcceptance: 'no' });
                                            if (clearFieldError) {
                                                clearFieldError('verificationAcceptance');
                                            }
                                        }}
                                    />
                                </Col>
                            </Row>
                            {fieldErrors.verificationAcceptance && (
                                <div className="invalid-feedback d-block">
                                    You must select "Ya" to continue
                                </div>
                            )}
                            {data.verificationAcceptance === 'no' && !fieldErrors.verificationAcceptance && (
                                <div className="mt-2">
                                    <small className="text-danger">You must select "Ya" to continue</small>
                                </div>
                            )}
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted"><strong>Pernyataan Pada Tanggal: <span className="text-danger">*</span></strong></Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={data.verificationDate || new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Jakarta' }).slice(0, 16)}
                                onChange={(e) => {
                                    onChange({ ...data, verificationDate: e.target.value });
                                    if (clearFieldError) {
                                        clearFieldError('verificationDate');
                                    }
                                }}
                                isInvalid={fieldErrors.verificationDate}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Process verification date is required
                            </Form.Control.Feedback>
                        </Form.Group>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};


export default IndonesianPersonForm; 