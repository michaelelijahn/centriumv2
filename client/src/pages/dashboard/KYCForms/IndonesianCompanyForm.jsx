import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { useNotificationContext } from '../../../common/context/useNotificationContext';
import AuthService from '../../../common/api/auth';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';

const IndonesianCompanyForm = () => {
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
                return <EmailRegistrationStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 2:
                return <CompanyDetailsStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} setFieldError={setFieldError} />;
            case 3:
                return <CompanyDocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 4:
                return <PowerOfAttorneyStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} setFieldError={setFieldError} />;
            case 5:
                return <PersonalDocumentUploadStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 6:
                return <ReadStatementsStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 7:
                return <ReviewStep allData={formData} />;
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
            
            case 3: // Company Documents step
                return validateCompanyDocumentsStep(stepData);
            
            case 4: // Power of Attorney step
                return validatePowerOfAttorneyStep(stepData);
            
            case 5: // Personal Documents step
                return validatePersonalDocumentsStep(stepData);
            
            case 6: // Read Statements step
                return validateReadStatementsStep(stepData);
            
            case 7: // Review step
                return validateReviewStep(stepData);
            
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
            { field: 'companyName', label: 'Company Name' },
            { field: 'businessLicenseNo', label: 'Business License Number' },
            { field: 'businessEntity', label: 'Business Entity' },
            { field: 'companyNPWP', label: 'Company NPWP' },
            { field: 'streetName', label: 'Company Address' },
            { field: 'city', label: 'City' },
            { field: 'postalCode', label: 'Postal Code' },
            { field: 'placeOfEstablishment', label: 'Place of Establishment' },
            { field: 'establishmentDate', label: 'Establishment Date' },
            { field: 'legalForm', label: 'Legal Form' },
            { field: 'officeTelephoneCountryCode', label: 'Office Telephone Country Code' },
            { field: 'officeTelephoneNo', label: 'Office Telephone Number' },
            { field: 'beneficialOwnerName', label: 'Beneficial Owner Name' },
            { field: 'beneficialOwnerIdNo', label: 'Beneficial Owner ID Number' },
            { field: 'sourceOfFunds', label: 'Source of Funds' },
            { field: 'accountPurpose', label: 'Account Purpose' },
            { field: 'authorizedPersonName', label: 'Authorized Person Name' },
            { field: 'authorizedDebitPerson', label: 'Authorized Debit Person' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });

        // Special validation for office telephone number (always +62 for Indonesian companies)
        if (data.officeTelephoneNo) {
            // For Indonesian companies, office phone should have at least 8-12 digits
            const phoneNumber = data.officeTelephoneNo.replace(/\D/g, ''); // Remove non-digits
            
            // Check if phone number starts with 0 (not allowed for Indonesian numbers with +62)
            if (phoneNumber.startsWith('0')) {
                errors.push('Office Telephone Number cannot start with 0');
            } else if (phoneNumber.length < 8) {
                errors.push('Office Telephone Number must have at least 8 digits');
            }
            
            // Auto-set country code to +62 if not set
            if (!data.officeTelephoneCountryCode) {
                data.officeTelephoneCountryCode = '+62';
            }
        }
        
        // Check conditional fields
        if (data.legalForm === 'OTHER' && !data.legalFormOther?.trim()) {
            errors.push('Please specify the other legal form');
        }
        
        if (data.sourceOfFunds === 'OTHER' && !data.sourceOfFundsOther?.trim()) {
            errors.push('Please specify the other source of funds');
        }
        
        if (data.accountPurpose === 'OTHER' && !data.accountPurposeOther?.trim()) {
            errors.push('Please specify the other account purpose');
        }

        // Validate bank accounts - the bankAccounts state is managed separately in CompanyDetailsStep
        // We need to get it from the component's local state, not from the step data
        // For now, let's validate the individual fields even if array appears empty
        // because the local bankAccounts state in the component might have data
        
        // Check if we have bank accounts data at all
        const hasBankAccounts = data.bankAccounts && Array.isArray(data.bankAccounts) && data.bankAccounts.length > 0;
        
        if (!hasBankAccounts) {
            // Add errors for the default bank account fields since we know at least one exists in the form
            errors.push('Bank 1 - Nama Bank is required');
            errors.push('Bank 1 - Cabang is required');
            errors.push('Bank 1 - No. Rekening is required');
            errors.push('Bank 1 - Account Holder Name is required');
            errors.push('Bank 1 - Bank Telephone Country Code is required');
            errors.push('Bank 1 - Bank Telephone No. is required');
            errors.push('Bank 1 - Bank Account Type is required');
        } else {
            console.log('Validating bank accounts:', data.bankAccounts);
            data.bankAccounts.forEach((account, index) => {
                const bankNumber = index + 1;
                console.log(`Validating bank account ${bankNumber}:`, account);
                
                if (!account.bankName?.trim()) {
                    errors.push(`Bank ${bankNumber} - Nama Bank is required`);
                }
                if (!account.branch?.trim()) {
                    errors.push(`Bank ${bankNumber} - Cabang is required`);
                }
                if (!account.accountNo?.trim()) {
                    errors.push(`Bank ${bankNumber} - No. Rekening is required`);
                }
                if (!account.accountHolderName?.trim()) {
                    errors.push(`Bank ${bankNumber} - Account Holder Name is required`);
                }
                if (!account.bankTelephoneCountryCode?.trim()) {
                    errors.push(`Bank ${bankNumber} - Bank Telephone Country Code is required`);
                }
                if (!account.bankTelephoneNo?.trim()) {
                    errors.push(`Bank ${bankNumber} - Bank Telephone No. is required`);
                }
                if (!account.bankAccountType?.trim()) {
                    errors.push(`Bank ${bankNumber} - Bank Account Type is required`);
                }
                
                // Special validation for bank telephone number
                if (account.bankTelephoneNo && account.bankTelephoneCountryCode) {
                    const phoneWithoutCode = account.bankTelephoneNo.replace(account.bankTelephoneCountryCode, '').trim();
                    if (!phoneWithoutCode || phoneWithoutCode.length < 4) {
                        errors.push(`Bank ${bankNumber} - Bank Telephone Number requires at least 4 digits after the country code`);
                    }
                }
                
                // Validate conditional field
                if (account.bankAccountType === 'LAINNYA' && !account.bankAccountTypeOther?.trim()) {
                    errors.push(`Bank ${bankNumber} - Please specify the bank account type`);
                }
            });
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateCompanyDocumentsStep = (data) => {
        const errors = [];
        
        // Define required company documents that must be uploaded
        const requiredCompanyDocs = [
            { key: 'articlesOfAssociation', name: 'Scan Anggaran Dasar Perusahaan (Scan Company\'s Articles of Association)' },
            { key: 'certificateOfIncorporation', name: 'Scan Nomor Izin Usaha (Scan Certificate of Incorporation)' },
            { key: 'financialStatements', name: 'Laporan Keuangan / Deskripsi Kegiatan Usaha (Financial Statements / Description of Business Activities)' },
            { key: 'managementStructure', name: 'Struktur Manajemen (Management Structure)' },
            { key: 'ownershipStructure', name: 'Struktur Kepemilikan (Ownership Structure)' },
            { key: 'boardOfResolutionFile', name: 'Spesimen Tanda Tangan Pihak Yang Melaksanakan Transaksi (Board of Resolution)' },
            { key: 'powerOfAttorneyFile', name: 'Surat Kuasa (Power of Attorney)' }
        ];
        
        // Check each required document
        requiredCompanyDocs.forEach(doc => {
            if (!data[doc.key]) {
                errors.push(`Required document missing: ${doc.name}`);
            }
        });
        
        return { isValid: errors.length === 0, errors };
    };

    const validatePowerOfAttorneyStep = (data) => {
        const errors = [];
        const requiredFields = [
            // Personal Information
            { field: 'fullName', label: 'Full Name' },
            { field: 'placeOfBirth', label: 'Place of Birth' },
            { field: 'dateOfBirth', label: 'Date of Birth' },
            { field: 'idPassportNo', label: 'ID/Passport Number' },
            { field: 'npwpNo', label: 'NPWP Number' },
            { field: 'gender', label: 'Gender' },
            { field: 'motherName', label: 'Mother Name' },
            { field: 'maritalStatus', label: 'Marital Status' },
            { field: 'nationality', label: 'Nationality' },
            // Address Information
            { field: 'streetAddress', label: 'Street Address' },
            { field: 'addressCity', label: 'City' },
            { field: 'addressPostalCode', label: 'Postal Code' },
            // Contact Information
            { field: 'homeTelephoneNo', label: 'Home Telephone Number' },
            { field: 'handphoneNo', label: 'Handphone Number' },
            { field: 'personalEmail', label: 'Email' },
            // Status and Purpose
            { field: 'homeOwnershipStatus', label: 'Home Ownership Status' },
            { field: 'accountOpeningPurpose', label: 'Account Opening Purpose' },
            // Experience Questions
            { field: 'investmentExperience', label: 'Investment Experience' },
            { field: 'futuresTradingExperience', label: 'Futures Trading Experience' },
            { field: 'familyInBappebti', label: 'Family in BAPPEBTI' },
            { field: 'declaredBankrupt', label: 'Bankruptcy Declaration' },
            // Emergency Contact Information
            { field: 'emergencyContactName', label: 'Emergency Contact Name' },
            { field: 'emergencyContactHandphone', label: 'Emergency Contact Handphone' },
            { field: 'emergencyContactStreetAddress', label: 'Emergency Contact Street Address' },
            { field: 'emergencyContactCity', label: 'Emergency Contact City' },
            { field: 'emergencyContactPostalCode', label: 'Emergency Contact Postal Code' },
            { field: 'emergencyContactRelationship', label: 'Emergency Contact Relationship' },
            // Job Information
            { field: 'jobOfPowerOfAttorney', label: 'Job of Power of Attorney' },
            // Assets Information
            { field: 'annualIncome', label: 'Annual Income' },
            { field: 'houseLocation', label: 'House Location' },
            { field: 'njopValue', label: 'NJOP Value' },
            { field: 'bankDeposit', label: 'Bank Deposit' },
            { field: 'totalAmount', label: 'Total Amount' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            // Special handling for radio button fields that can have "YA" or "TIDAK" values
            if (['investmentExperience', 'futuresTradingExperience', 'familyInBappebti', 'declaredBankrupt'].includes(field)) {
                if (field === 'investmentExperience') {
                    // Investment experience can be 'YA_BIDANG' or 'TIDAK'
                    if (!data[field] || !['YA_BIDANG', 'TIDAK'].includes(data[field])) {
                        errors.push(`${label} is required`);
                    }
                } else {
                    // Other radio fields use 'YA' or 'TIDAK'
                    if (!data[field] || !['YA', 'TIDAK'].includes(data[field])) {
                        errors.push(`${label} is required`);
                    }
                }
            } else {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
                }
            }
        });
        
        // Check conditional fields
        if (data.nationality === 'OTHER' && !data.nationalityOther?.trim()) {
            errors.push('Please specify other nationality');
        }
        
        if (data.homeOwnershipStatus === 'LAINNYA' && !data.homeOwnershipStatusOther?.trim()) {
            errors.push('Please specify other home ownership status');
        }
        
        if (data.accountOpeningPurpose === 'LAINNYA' && !data.accountOpeningPurposeOther?.trim()) {
            errors.push('Please specify other account opening purpose');
        }
        
        if (data.investmentExperience === 'YA_BIDANG' && !data.investmentExperienceExplanation?.trim()) {
            errors.push('Please provide details about investment experience');
        }
        
        if (data.jobOfPowerOfAttorney === 'LAINNYA' && !data.jobOfPowerOfAttorneyOther?.trim()) {
            errors.push('Please specify other job of power of attorney');
        }
        
        if (data.emergencyContactRelationship === 'LAINNYA' && !data.emergencyContactRelationshipOther?.trim()) {
            errors.push('Please specify other emergency contact relationship');
        }
        
        // Validate conditional employment fields for specific job types
        if (['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)) {
            const employmentFields = [
                { field: 'employmentCompanyName', label: 'Employment Company Name' },
                { field: 'businessField', label: 'Business Field' },
                { field: 'employmentPosition', label: 'Employment Position' },
                { field: 'lengthOfWork', label: 'Length of Work' },
                { field: 'officeStreetAddress', label: 'Office Street Address' },
                { field: 'officeCity', label: 'Office City' },
                { field: 'officePostalCode', label: 'Office Postal Code' },
                { field: 'officePhoneCountryCode', label: 'Office Phone Country Code' },
                { field: 'officePhoneNo', label: 'Office Phone Number' }
            ];
            
            employmentFields.forEach(({ field, label }) => {
                if (!data[field]?.trim()) {
                    errors.push(`${label} is required`);
                }
            });
        }
        
        // Validate email format
        if (data.personalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalEmail)) {
            errors.push('Please enter a valid email address');
        }
        
        // Validate phone numbers - cannot start with 0 and must have minimum digits
        if (data.homeTelephoneNo) {
            const phoneNumber = data.homeTelephoneNo.replace(/\D/g, ''); // Remove non-digits
            if (phoneNumber.startsWith('0')) {
                errors.push('Home Telephone Number cannot start with 0');
            } else if (phoneNumber.length < 8) {
                errors.push('Home Telephone Number must have at least 8 digits');
            }
            if (!data.homeTelephoneCountryCode) {
                data.homeTelephoneCountryCode = '+62';
            }
        }
        
        if (data.handphoneNo) {
            const phoneNumber = data.handphoneNo.replace(/\D/g, ''); // Remove non-digits
            if (phoneNumber.startsWith('0')) {
                errors.push('Handphone Number cannot start with 0');
            } else if (phoneNumber.length < 8) {
                errors.push('Handphone Number must have at least 8 digits');
            }
            if (!data.handphoneCountryCode) {
                data.handphoneCountryCode = '+62';
            }
        }
        
        if (data.emergencyContactHandphone) {
            const phoneNumber = data.emergencyContactHandphone.replace(/\D/g, ''); // Remove non-digits
            if (phoneNumber.startsWith('0')) {
                errors.push('Emergency Contact Handphone cannot start with 0');
            } else if (phoneNumber.length < 8) {
                errors.push('Emergency Contact Handphone must have at least 8 digits');
            }
            if (!data.emergencyContactHandphoneCountryCode) {
                data.emergencyContactHandphoneCountryCode = '+62';
            }
        }
        
        // Validate date of birth - must be at least 21 years old
        if (data.dateOfBirth) {
            const birthDate = new Date(data.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            // Calculate exact age considering month and day
            const exactAge = age - (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? 1 : 0);
            
            if (exactAge < 21) {
                errors.push('You must be at least 21 years old');
            }
        }
        
        // Validate disqualifying questions - these must be answered "TIDAK" (No)
        if (data.familyInBappebti === 'YA') {
            errors.push('You must select "Tidak (No)" for the BAPPEBTI family question to proceed');
        }
        
        if (data.declaredBankrupt === 'YA') {
            errors.push('You must select "Tidak (No)" for the bankruptcy question to proceed');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validatePersonalDocumentsStep = (data) => {
        const errors = [];
        
        // Define required personal documents that must be uploaded
        const requiredPersonalDocs = [
            { key: 'currentAccountFile', name: 'Rekening Koran / Tagihan Kartu Kredit (Current Account / Credit Card Statement)' },
            { key: 'electricityPhoneAccountFile', name: 'Rekening Listrik / Telepon (Electricity / Phone Account)' },
            { key: 'photoSelfiePersonalFile', name: 'Foto Terkini (Photo Selfie)' },
            { key: 'identityPassportPersonalFile', name: 'KTP / SIM / Paspor (Identity No. / SIM / Passport)' },
            { key: 'npwpPersonalFile', name: 'NPWP (Tax Identification No.)' }
        ];
        
        // Check each required document
        requiredPersonalDocs.forEach(doc => {
            if (!data[doc.key]) {
                errors.push(`Required document missing: ${doc.name}`);
            }
        });
        
        return { isValid: errors.length === 0, errors };
    };

    const validateReadStatementsStep = (data) => {
        const errors = [];
        
        // Updated to match actual field names used in Indonesian Company form
        const requiredStatements = [
            { field: 'companyProfileRead', label: 'Company Profile (Read)' },
            { field: 'companyProfileUnderstanding', label: 'Company Profile (Understanding)' },
            { field: 'statementRead', label: 'Statement of Having Simulation (Read)' },
            { field: 'statementUnderstanding', label: 'Statement of Having Simulation (Understanding)' },
            { field: 'experienceStatementRead', label: 'Statement of Having Experience (Read)' },
            { field: 'experienceUnderstanding', label: 'Statement of Having Experience (Understanding)' },
            { field: 'applicationStatementRead', label: 'Account Opening Application (Read)' },
            { field: 'applicationUnderstanding', label: 'Account Opening Application (Understanding)' },
            { field: 'riskDisclosureUnderstanding', label: 'Risk Disclosure (Understanding)' },
            { field: 'mandateStatementRead', label: 'Mandate Agreement (Read)' },
            { field: 'baktiArbitration', label: 'BAKTI Arbitration Agreement' },
            { field: 'mandateUnderstanding', label: 'Mandate Agreement (Understanding)' },
            { field: 'tradingRulesRead', label: 'Trading Rules (Read)' },
            { field: 'tradingRulesUnderstanding', label: 'Trading Rules (Understanding)' },
            { field: 'personalAccessPasswordRead', label: 'Personal Access Password (Read)' },
            { field: 'personalAccessPasswordUnderstanding', label: 'Personal Access Password (Understanding)' }
        ];
        
        // Add individual risk statement fields (1-14) with descriptive labels
        const riskStatementLabels = [
            'Risk Disclosure Statement 5.1 - Futures trading suitability and leverage risks',
            'Risk Disclosure Statement 5.2 - Unlimited loss potential beyond margin',
            'Risk Disclosure Statement 5.3 - No guaranteed profit warnings', 
            'Risk Disclosure Statement 5.4 - Leverage and rapid loss mechanisms',
            'Risk Disclosure Statement 5.5 - Position liquidation difficulties',
            'Risk Disclosure Statement 5.6 - Risk management limitations',
            'Risk Disclosure Statement 5.7 - Physical delivery obligations',
            'Risk Disclosure Statement 5.8 - System failure risks',
            'Risk Disclosure Statement 5.9 - Trading strategy risks',
            'Risk Disclosure Statement 5.10 - Day trading specific risks',
            'Risk Disclosure Statement 5.11 - Stop loss order limitations',
            'Risk Disclosure Statement 5.12 - Mandate agreement requirements',
            'Risk Disclosure Statement 5.13 - Comprehensive risk understanding',
            'Risk Disclosure Statement 5.14 - Indonesian language documentation'
        ];
        
        for (let i = 1; i <= 14; i++) {
            requiredStatements.push({ 
                field: `riskStatement${i}`, 
                label: riskStatementLabels[i - 1] 
            });
        }
        
        requiredStatements.forEach(({ field, label }) => {
            if (!data[field]) {
                errors.push(`Please read and acknowledge ${label}`);
            }
        });
        
        // Check trading experience (required field)
        if (!data.tradingExperience) {
            errors.push('Please select your trading experience (Yes or No)');
        }
        
        // Check conditional fields based on trading experience
        if (data.tradingExperience === 'ya') {
            if (!data.brokerCompany?.trim()) {
                errors.push('Please specify the broker company name');
            }
            if (!data.demoAccountNumber?.trim()) {
                errors.push('Please specify the demo account number');
            }
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateReviewStep = (data) => {
        // Review step is just for display - no additional validation needed
        // All required fields should have been validated in previous steps
        return { isValid: true, errors: [] };
    };

    const handleStepValidation = (stepIndex, stepData, allData) => {
        console.log(`Validating step ${stepIndex} with data:`, stepData);
        const validation = validateStep(stepIndex, stepData, allData);
        
        // Create field error mapping for red border styling
        const newFieldErrors = {};
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                // Email Registration Step errors
                if (error.includes('Company email address is required') || error.includes('valid email address')) newFieldErrors.email = true;
                if (error.includes('Demo account selection is required')) newFieldErrors.demoAccountNo = true;
                
                // Company Details Step errors
                if (error.includes('Company Name is required')) newFieldErrors.companyName = true;
                if (error.includes('Business License Number is required')) newFieldErrors.businessLicenseNo = true;
                if (error.includes('Business Entity is required')) newFieldErrors.businessEntity = true;
                if (error.includes('Company NPWP is required')) newFieldErrors.companyNPWP = true;
                if (error.includes('Company Address is required')) newFieldErrors.streetName = true;
                if (error.includes('City is required')) newFieldErrors.city = true;
                if (error.includes('Postal Code is required')) newFieldErrors.postalCode = true;
                if (error.includes('Place of Establishment is required')) newFieldErrors.placeOfEstablishment = true;
                if (error.includes('Establishment Date is required')) newFieldErrors.establishmentDate = true;
                if (error.includes('Legal Form is required')) newFieldErrors.legalForm = true;
                if (error.includes('Office Telephone Country Code is required')) newFieldErrors.officeTelephoneCountryCode = true;
                if (error.includes('Office Telephone Number is required')) newFieldErrors.officeTelephoneNo = true;
                if (error.includes('Office Telephone Number must have at least 8 digits')) newFieldErrors.officeTelephoneNo = true;
                if (error.includes('Office Telephone Number cannot start with 0')) newFieldErrors.officeTelephoneNo = true;
                if (error.includes('Home Telephone Number cannot start with 0')) newFieldErrors.homeTelephoneNo = true;
                if (error.includes('Home Telephone Number must have at least 8 digits')) newFieldErrors.homeTelephoneNo = true;
                if (error.includes('Handphone Number cannot start with 0')) newFieldErrors.handphoneNo = true;
                if (error.includes('Handphone Number must have at least 8 digits')) newFieldErrors.handphoneNo = true;
                if (error.includes('Emergency Contact Handphone cannot start with 0')) newFieldErrors.emergencyContactHandphone = true;
                if (error.includes('Emergency Contact Handphone must have at least 8 digits')) newFieldErrors.emergencyContactHandphone = true;
                if (error.includes('Beneficial Owner Name is required')) newFieldErrors.beneficialOwnerName = true;
                if (error.includes('Beneficial Owner ID Number is required')) newFieldErrors.beneficialOwnerIdNo = true;
                if (error.includes('Source of Funds is required')) newFieldErrors.sourceOfFunds = true;
                if (error.includes('Account Purpose is required')) newFieldErrors.accountPurpose = true;
                if (error.includes('Authorized Person Name is required')) newFieldErrors.authorizedPersonName = true;
                if (error.includes('Authorized Debit Person is required')) newFieldErrors.authorizedDebitPerson = true;
                
                // Conditional field errors for Company Details
                if (error.includes('Please specify the other legal form')) newFieldErrors.legalFormOther = true;
                if (error.includes('Please specify the other source of funds')) newFieldErrors.sourceOfFundsOther = true;
                if (error.includes('Please specify the other account purpose')) newFieldErrors.accountPurposeOther = true;
                
                // Power of Attorney Step errors
                if (error.includes('Full Name is required')) newFieldErrors.fullName = true;
                if (error.includes('Place of Birth is required')) newFieldErrors.placeOfBirth = true;
                if (error.includes('Date of Birth is required')) newFieldErrors.dateOfBirth = true;
                if (error.includes('ID/Passport Number is required')) newFieldErrors.idPassportNo = true;
                if (error.includes('NPWP Number is required')) newFieldErrors.npwpNo = true;
                if (error.includes('Gender is required')) newFieldErrors.gender = true;
                if (error.includes('Mother Name is required')) newFieldErrors.motherName = true;
                if (error.includes('Marital Status is required')) newFieldErrors.maritalStatus = true;
                if (error.includes('Nationality is required')) newFieldErrors.nationality = true;
                if (error.includes('Street Address is required')) newFieldErrors.streetAddress = true;
                if (error.includes('City is required')) newFieldErrors.addressCity = true;
                if (error.includes('Postal Code is required')) newFieldErrors.addressPostalCode = true;
                if (error.includes('Home Telephone Number is required')) newFieldErrors.homeTelephoneNo = true;
                if (error.includes('Handphone Number is required')) newFieldErrors.handphoneNo = true;
                if (error.includes('Email is required')) newFieldErrors.personalEmail = true;
                if (error.includes('Home Ownership Status is required')) newFieldErrors.homeOwnershipStatus = true;
                if (error.includes('Account Opening Purpose is required')) newFieldErrors.accountOpeningPurpose = true;
                if (error.includes('Investment Experience is required')) newFieldErrors.investmentExperience = true;
                if (error.includes('Futures Trading Experience is required')) newFieldErrors.futuresTradingExperience = true;
                if (error.includes('Family in BAPPEBTI is required')) newFieldErrors.familyInBappebti = true;
                if (error.includes('Bankruptcy Declaration is required')) newFieldErrors.declaredBankrupt = true;
                
                // Emergency Contact and Additional Power of Attorney fields
                if (error.includes('Emergency Contact Name is required')) newFieldErrors.emergencyContactName = true;
                if (error.includes('Emergency Contact Handphone is required')) newFieldErrors.emergencyContactHandphone = true;
                if (error.includes('Emergency Contact Street Address is required')) newFieldErrors.emergencyContactStreetAddress = true;
                if (error.includes('Emergency Contact City is required')) newFieldErrors.emergencyContactCity = true;
                if (error.includes('Emergency Contact Postal Code is required')) newFieldErrors.emergencyContactPostalCode = true;
                if (error.includes('Emergency Contact Relationship is required')) newFieldErrors.emergencyContactRelationship = true;
                if (error.includes('Job of Power of Attorney is required')) newFieldErrors.jobOfPowerOfAttorney = true;
                if (error.includes('Annual Income is required')) newFieldErrors.annualIncome = true;
                if (error.includes('House Location is required')) newFieldErrors.houseLocation = true;
                if (error.includes('NJOP Value is required')) newFieldErrors.njopValue = true;
                if (error.includes('Bank Deposit is required')) newFieldErrors.bankDeposit = true;
                if (error.includes('Total Amount is required')) newFieldErrors.totalAmount = true;
                
                // Employment fields (conditional)
                if (error.includes('Employment Company Name is required')) newFieldErrors.employmentCompanyName = true;
                if (error.includes('Business Field is required')) newFieldErrors.businessField = true;
                if (error.includes('Employment Position is required')) newFieldErrors.employmentPosition = true;
                if (error.includes('Length of Work is required')) newFieldErrors.lengthOfWork = true;
                if (error.includes('Office Street Address is required')) newFieldErrors.officeStreetAddress = true;
                if (error.includes('Office City is required')) newFieldErrors.officeCity = true;
                if (error.includes('Office Postal Code is required')) newFieldErrors.officePostalCode = true;
                if (error.includes('Office Phone Country Code is required')) newFieldErrors.officePhoneCountryCode = true;
                if (error.includes('Office Phone Number is required')) newFieldErrors.officePhoneNo = true;
                
                // Conditional field errors for Power of Attorney
                if (error.includes('Please specify other nationality')) newFieldErrors.nationalityOther = true;
                if (error.includes('Please specify other home ownership status')) newFieldErrors.homeOwnershipStatusOther = true;
                if (error.includes('Please specify other account opening purpose')) newFieldErrors.accountOpeningPurposeOther = true;
                if (error.includes('Please provide details about investment experience')) newFieldErrors.investmentExperienceExplanation = true;
                if (error.includes('Please specify other job of power of attorney')) newFieldErrors.jobOfPowerOfAttorneyOther = true;
                if (error.includes('Please specify other emergency contact relationship')) newFieldErrors.emergencyContactRelationshipOther = true;
                if (error.includes('Please enter a valid email address')) newFieldErrors.personalEmail = true;
                if (error.includes('You must be at least 21 years old')) newFieldErrors.dateOfBirth = true;
                if (error.includes('You must select "Tidak (No)" for the BAPPEBTI family question to proceed')) newFieldErrors.familyInBappebti = true;
                if (error.includes('You must select "Tidak (No)" for the bankruptcy question to proceed')) newFieldErrors.declaredBankrupt = true;
                
                // Document Upload Step errors
                if (error.includes('Please upload all required company documents')) newFieldErrors.companyDocumentsUploaded = true;
                if (error.includes('Please upload all required personal documents')) newFieldErrors.personalDocumentsUploaded = true;
                
                // Specific document upload errors
                if (error.includes('Required document missing: Scan Anggaran Dasar Perusahaan')) newFieldErrors.articlesOfAssociation = true;
                if (error.includes('Required document missing: Scan Nomor Izin Usaha')) newFieldErrors.certificateOfIncorporation = true;
                if (error.includes('Required document missing: Laporan Keuangan / Deskripsi Kegiatan Usaha')) newFieldErrors.financialStatements = true;
                if (error.includes('Required document missing: Struktur Manajemen')) newFieldErrors.managementStructure = true;
                if (error.includes('Required document missing: Struktur Kepemilikan')) newFieldErrors.ownershipStructure = true;
                if (error.includes('Required document missing: Spesimen Tanda Tangan Pihak Yang Melaksanakan Transaksi')) newFieldErrors.boardOfResolutionFile = true;
                if (error.includes('Required document missing: Surat Kuasa')) newFieldErrors.powerOfAttorneyFile = true;
                
                // Personal document upload errors
                if (error.includes('Required document missing: Rekening Koran / Tagihan Kartu Kredit')) newFieldErrors.currentAccountFile = true;
                if (error.includes('Required document missing: Rekening Listrik / Telepon')) newFieldErrors.electricityPhoneAccountFile = true;
                if (error.includes('Required document missing: Foto Terkini')) newFieldErrors.photoSelfiePersonalFile = true;
                if (error.includes('Required document missing: KTP / SIM / Paspor')) newFieldErrors.identityPassportPersonalFile = true;
                if (error.includes('Required document missing: NPWP')) newFieldErrors.npwpPersonalFile = true;
                
                // Read Statements Step errors - detailed mappings
                if (error.includes('Please read and acknowledge Company Profile (Read)')) newFieldErrors.companyProfileRead = true;
                if (error.includes('Please read and acknowledge Company Profile (Understanding)')) newFieldErrors.companyProfileUnderstanding = true;
                if (error.includes('Please read and acknowledge Statement of Having Simulation (Read)')) newFieldErrors.statementRead = true;
                if (error.includes('Please read and acknowledge Statement of Having Simulation (Understanding)')) newFieldErrors.statementUnderstanding = true;
                if (error.includes('Please read and acknowledge Statement of Having Experience (Read)')) newFieldErrors.experienceStatementRead = true;
                if (error.includes('Please read and acknowledge Statement of Having Experience (Understanding)')) newFieldErrors.experienceUnderstanding = true;
                if (error.includes('Please read and acknowledge Account Opening Application (Read)')) newFieldErrors.applicationStatementRead = true;
                if (error.includes('Please read and acknowledge Account Opening Application (Understanding)')) newFieldErrors.applicationUnderstanding = true;
                if (error.includes('Please read and acknowledge Risk Disclosure (Understanding)')) newFieldErrors.riskDisclosureUnderstanding = true;
                if (error.includes('Please read and acknowledge Mandate Agreement (Read)')) newFieldErrors.mandateStatementRead = true;
                if (error.includes('Please read and acknowledge BAKTI Arbitration Agreement')) newFieldErrors.baktiArbitration = true;
                if (error.includes('Please read and acknowledge Mandate Agreement (Understanding)')) newFieldErrors.mandateUnderstanding = true;
                if (error.includes('Please read and acknowledge Trading Rules (Read)')) newFieldErrors.tradingRulesRead = true;
                if (error.includes('Please read and acknowledge Trading Rules (Understanding)')) newFieldErrors.tradingRulesUnderstanding = true;
                if (error.includes('Please read and acknowledge Personal Access Password (Read)')) newFieldErrors.personalAccessPasswordRead = true;
                if (error.includes('Please read and acknowledge Personal Access Password (Understanding)')) newFieldErrors.personalAccessPasswordUnderstanding = true;
                if (error.includes('Please select your trading experience')) newFieldErrors.tradingExperience = true;
                if (error.includes('Please specify the broker company name')) newFieldErrors.brokerCompany = true;
                if (error.includes('Please specify the demo account number')) newFieldErrors.demoAccountNumber = true;
                
                // Risk statement checkboxes - individual mapping with descriptive labels
                const riskStatementErrorMappings = [
                    'Risk Disclosure Statement 5.1 - Futures trading suitability and leverage risks',
                    'Risk Disclosure Statement 5.2 - Unlimited loss potential beyond margin',
                    'Risk Disclosure Statement 5.3 - No guaranteed profit warnings', 
                    'Risk Disclosure Statement 5.4 - Leverage and rapid loss mechanisms',
                    'Risk Disclosure Statement 5.5 - Position liquidation difficulties',
                    'Risk Disclosure Statement 5.6 - Risk management limitations',
                    'Risk Disclosure Statement 5.7 - Physical delivery obligations',
                    'Risk Disclosure Statement 5.8 - System failure risks',
                    'Risk Disclosure Statement 5.9 - Trading strategy risks',
                    'Risk Disclosure Statement 5.10 - Day trading specific risks',
                    'Risk Disclosure Statement 5.11 - Stop loss order limitations',
                    'Risk Disclosure Statement 5.12 - Mandate agreement requirements',
                    'Risk Disclosure Statement 5.13 - Comprehensive risk understanding',
                    'Risk Disclosure Statement 5.14 - Indonesian language documentation'
                ];
                
                for (let i = 1; i <= 14; i++) {
                    if (error.includes(`Please read and acknowledge ${riskStatementErrorMappings[i - 1]}`)) {
                        newFieldErrors[`riskStatement${i}`] = true;
                    }
                }
            });
            
            // Bank Account errors - handle dynamic bank accounts
            const bankFieldMappings = [
                { pattern: /Bank (\d+) - Nama Bank is required/, field: 'bankName' },
                { pattern: /Bank (\d+) - Cabang is required/, field: 'branch' },
                { pattern: /Bank (\d+) - No\. Rekening is required/, field: 'accountNo' },
                { pattern: /Bank (\d+) - Account Holder Name is required/, field: 'accountHolderName' },
                { pattern: /Bank (\d+) - Bank Telephone Country Code is required/, field: 'bankTelephoneCountryCode' },
                { pattern: /Bank (\d+) - Bank Telephone No\. is required/, field: 'bankTelephoneNo' },
                { pattern: /Bank (\d+) - Bank Telephone Number requires at least 4 digits after the country code/, field: 'bankTelephoneNo' },
                { pattern: /Bank (\d+) - Bank Account Type is required/, field: 'bankAccountType' },
                { pattern: /Bank (\d+) - Please specify the bank account type/, field: 'bankAccountTypeOther' }
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
            
            // Set the field errors
            console.log('Setting field errors:', newFieldErrors);
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
        console.log(`Moving to step ${step}`, data);
    };

    const handleSubmit = async (data) => {
        console.log('Submitting Indonesian Company KYC (raw data):', data);
        
        try {
            // Show loading notification
            showNotification({
                title: 'Processing',
                message: 'Submitting your KYC application...',
                type: 'info'
            });
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
                if (key === 'bankAccounts' && Array.isArray(flattenedData[key])) {
                    // Convert bank accounts array to JSON string
                    formData.append('bankAccounts', JSON.stringify(flattenedData[key]));
                } else if (typeof flattenedData[key] === 'object' && flattenedData[key] !== null && !(flattenedData[key] instanceof File)) {
                    // Convert objects to JSON string (except File objects)
                    formData.append(key, JSON.stringify(flattenedData[key]));
                } else if (flattenedData[key] !== null && flattenedData[key] !== undefined) {
                    // Add primitive values directly
                    formData.append(key, flattenedData[key]);
                }
            });
            
            // Add Indonesian Company specific document files to FormData
            const documentFieldMapping = {
                'articlesOfAssociation': 'articles_of_association',
                'certificateOfIncorporation': 'certificate_of_incorporation',
                'financialStatements': 'financial_statements',
                'managementStructure': 'management_structure',
                'ownershipStructure': 'ownership_structure',
                'boardOfResolutionFile': 'board_of_resolution_file',
                'powerOfAttorneyFile': 'power_of_attorney_file',
                'currentAccountFile': 'current_account_file',
                'electricityPhoneAccountFile': 'electricity_phone_account_file',
                'photoSelfiePersonalFile': 'photo_selfie_personal_file',
                'identityPassportPersonalFile': 'identity_passport_personal_file',
                'npwpPersonalFile': 'npwp_personal_file'
            };
            
            // Add document files to FormData
            Object.keys(documentFieldMapping).forEach(frontendKey => {
                const backendKey = documentFieldMapping[frontendKey];
                if (flattenedData[frontendKey] instanceof File) {
                    formData.append(backendKey, flattenedData[frontendKey]);
                }
            });
            
            const response = await AuthService.submitIndonesianCompanyKYC(formData);
            
            if (response.success) {
                showNotification({
                    title: 'Success',
                    message: `Indonesian Company KYC submitted successfully! Application Reference: ${response.data.applicationReference || response.data.applicationId}`,
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
            console.error('Indonesian Company KYC Submission Error:', error);
            showNotification({
                title: 'Submission Failed',
                message: error.message || 'An error occurred while submitting your Indonesian Company KYC application. Please try again.',
                type: 'error'
            });
        }
    };

    return (
        <MultiStepFormWrapper
            accountType="Indonesian Company"
            steps={steps}
            onStepChange={handleStepChange}
            onSubmit={handleSubmit}
            onStepValidation={handleStepValidation}
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

const EmailRegistrationStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [email, setEmail] = useState(data.email || '');
    const [demoAccountNo, setDemoAccountNo] = useState(data.demoAccountNo || '');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleEmailChange = (field, value) => {
        const newData = { ...data, [field]: value };
        if (field === 'email') setEmail(value);
        if (field === 'demoAccountNo') setDemoAccountNo(value);
        
        // Clear field error when user starts typing
        if (clearFieldError && fieldErrors[field]) {
            clearFieldError(field);
        }
        
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
                                isInvalid={fieldErrors.email}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Select Demo Account No.</Form.Label>
                            <Form.Select
                                value={demoAccountNo}
                                onChange={(e) => handleEmailChange('demoAccountNo', e.target.value)}
                                isInvalid={fieldErrors.demoAccountNo}
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

const CompanyDetailsStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError, setFieldError }) => {
    const [bankAccounts, setBankAccounts] = useState(data.bankAccounts || [{ bankName: '', branch: '', accountNo: '', accountHolderName: '', bankTelephoneNo: '', bankTelephoneCountryCode: '', bankAccountType: '' }]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Ensure initial bank accounts are synced with form data
    useEffect(() => {
        if (!data.bankAccounts || data.bankAccounts.length === 0) {
            console.log('Initializing bank accounts in form data:', bankAccounts);
            onChange({ ...data, bankAccounts });
        }
    }, []);

    // Debug log to see fieldErrors
    useEffect(() => {
        if (Object.keys(fieldErrors).length > 0) {
            console.log('CompanyDetailsStep received fieldErrors:', fieldErrors);
        }
    }, [fieldErrors]);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError && fieldErrors[field]) {
            clearFieldError(field);
        }
        
        onChange(newData);
    };

    const handleCountryCodeChange = (countryCode) => {
        // Get the current phone number and remove any existing country code
        let currentPhoneNumber = data.officeTelephoneNo || '';
        
        // Remove any existing country code from the phone number
        if (data.officeTelephoneCountryCode) {
            currentPhoneNumber = currentPhoneNumber.replace(data.officeTelephoneCountryCode, '').trim();
        }
        
        const newData = { 
            ...data, 
            officeTelephoneCountryCode: countryCode,
            // Auto-populate the country code in the phone number field
            // If countryCode is empty (default "Code" selected), just keep the number without code
            officeTelephoneNo: countryCode ? countryCode + ' ' + currentPhoneNumber : currentPhoneNumber
        };
        
        // Clear field errors when user selects a country code
        if (clearFieldError && fieldErrors.officeTelephoneCountryCode) {
            clearFieldError('officeTelephoneCountryCode');
        }
        
        onChange(newData);
    };

    const handlePhoneNumberChange = (phoneNumber) => {
        const newData = { ...data, officeTelephoneNo: phoneNumber };
        
        // Clear field error when user starts typing
        if (clearFieldError && fieldErrors.officeTelephoneNo) {
            clearFieldError('officeTelephoneNo');
        }
        
        onChange(newData);
    };

    const addBankAccount = () => {
        const newAccounts = [...bankAccounts, { bankName: '', branch: '', accountNo: '', accountHolderName: '', bankTelephoneNo: '', bankTelephoneCountryCode: '', bankAccountType: '' }];
        setBankAccounts(newAccounts);
        console.log('Adding bank account, new accounts:', newAccounts);
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
        
        // Special handling for bank telephone country code
        if (field === 'bankTelephoneCountryCode') {
            newAccounts[index] = { 
                ...newAccounts[index], 
                [field]: value
            };
        } else if (field === 'bankTelephoneNo') {
            // Special handling for bank telephone number input
            let phoneNumber = value;
            
            // Remove any country code that might be present in the input
            const currentCountryCode = newAccounts[index].bankTelephoneCountryCode;
            if (currentCountryCode && phoneNumber.startsWith(currentCountryCode)) {
                phoneNumber = phoneNumber.replace(currentCountryCode, '').trim();
            }
            
            // Remove any non-digit characters except spaces and dashes for formatting
            phoneNumber = phoneNumber.replace(/[^\d\s-]/g, '');
            
            // Prevent starting with 0 - remove leading zeros
            phoneNumber = phoneNumber.replace(/^0+/, '');
            
            newAccounts[index] = { ...newAccounts[index], [field]: phoneNumber };
        } else {
        newAccounts[index] = { ...newAccounts[index], [field]: value };
            
            // Special handling for bank account type - clear the "other" field when not selecting "Lainnya"
            if (field === 'bankAccountType' && value !== 'LAINNYA') {
                newAccounts[index] = { ...newAccounts[index], bankAccountTypeOther: '' };
            }
        }
        
        console.log('Updated bank accounts:', newAccounts);
        setBankAccounts(newAccounts);
        
        // Clear field error when user starts typing
        if (clearFieldError && fieldErrors[field]) {
            clearFieldError(field);
        }
        if (clearFieldError && fieldErrors[`${field}_${index}`]) {
            clearFieldError(`${field}_${index}`);
        }
        
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Calon Nasabah Non-Orang Perseorangan (Nama Perusahaan) <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company registration number"
                                value={data.companyName || ''}
                                onChange={(e) => handleChange('companyName', e.target.value)}
                                isInvalid={fieldErrors.companyName}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Izin Usaha <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company license number"
                                value={data.businessLicenseNo || ''}
                                onChange={(e) => handleChange('businessLicenseNo', e.target.value)}
                                isInvalid={fieldErrors.businessLicenseNo}
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
                                onChange={(e) => handleChange('businessEntity', e.target.value)}
                                isInvalid={fieldErrors.businessEntity}
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
                                onChange={(e) => handleChange('companyNPWP', e.target.value)}
                                isInvalid={fieldErrors.companyNPWP}
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
                                onChange={(e) => handleChange('streetName', e.target.value)}
                                isInvalid={fieldErrors.streetName}
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
                                onChange={(e) => handleChange('city', e.target.value)}
                                isInvalid={fieldErrors.city}
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
                                onChange={(e) => handleChange('postalCode', e.target.value)}
                                isInvalid={fieldErrors.postalCode}
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
                                onChange={(e) => handleChange('placeOfEstablishment', e.target.value)}
                                isInvalid={fieldErrors.placeOfEstablishment}
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
                                onChange={(e) => handleChange('establishmentDate', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                isInvalid={fieldErrors.establishmentDate}
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
                                onChange={(e) => {
                                    const newData = { ...data, legalForm: e.target.value, ...(e.target.value !== 'OTHER' && { legalFormOther: '' }) };
                                    clearFieldError && clearFieldError('legalForm');
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.legalForm}
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
                                    onChange={(e) => handleChange('legalFormOther', e.target.value)}
                                    isInvalid={fieldErrors.legalFormOther}
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
                                    <Form.Control
                                        type="text"
                                        value="+62 (ID)"
                                        readOnly
                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                    />
                                </Col>
                                <Col md={8}>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter office telephone number"
                                        value={data.officeTelephoneNo || ''}
                                        onChange={(e) => {
                                            let phoneNumber = e.target.value;
                                            
                                            // Remove any non-digit characters except spaces and dashes for formatting
                                            phoneNumber = phoneNumber.replace(/[^\d\s-]/g, '');
                                            
                                            // Prevent starting with 0 - remove leading zeros
                                            phoneNumber = phoneNumber.replace(/^0+/, '');
                                            
                                            const newData = { 
                                                ...data, 
                                                officeTelephoneNo: phoneNumber,
                                                officeTelephoneCountryCode: '+62'
                                            };
                                            if (clearFieldError && fieldErrors.officeTelephoneNo) {
                                                clearFieldError('officeTelephoneNo');
                                            }
                                            onChange(newData);
                                        }}
                                        isInvalid={fieldErrors.officeTelephoneNo}
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Beneficial Owner <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter beneficial owner name"
                                value={data.beneficialOwnerName || ''}
                                onChange={(e) => handleChange('beneficialOwnerName', e.target.value)}
                                isInvalid={fieldErrors.beneficialOwnerName}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. KTP / SIM / Paspor Beneficial Owner <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter ID/Passport number"
                                value={data.beneficialOwnerIdNo || ''}
                                onChange={(e) => handleChange('beneficialOwnerIdNo', e.target.value)}
                                isInvalid={fieldErrors.beneficialOwnerIdNo}
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Sumber Dana <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.sourceOfFunds || ''}
                                onChange={(e) => {
                                    const newData = { ...data, sourceOfFunds: e.target.value, ...(e.target.value !== 'OTHER' && { sourceOfFundsOther: '' }) };
                                    clearFieldError && clearFieldError('sourceOfFunds');
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.sourceOfFunds}
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
                                    onChange={(e) => handleChange('sourceOfFundsOther', e.target.value)}
                                    isInvalid={fieldErrors.sourceOfFundsOther}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Maksud dan Tujuan Pembukaan Rekening Transaksi yang akan Dilakukan Calon Nasabah <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.accountPurpose || ''}
                                onChange={(e) => {
                                    const newData = { ...data, accountPurpose: e.target.value, ...(e.target.value !== 'OTHER' && { accountPurposeOther: '' }) };
                                    clearFieldError && clearFieldError('accountPurpose');
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.accountPurpose}
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
                                    onChange={(e) => handleChange('accountPurposeOther', e.target.value)}
                                    isInvalid={fieldErrors.accountPurposeOther}
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Nama Penerima Kuasa yang Menjalankan Transaksi <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter authorized person name"
                                value={data.authorizedPersonName || ''}
                                onChange={(e) => handleChange('authorizedPersonName', e.target.value)}
                                isInvalid={fieldErrors.authorizedPersonName}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Pihak yang berwenang melakukan Pendebetan <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter authorized debit person"
                                value={data.authorizedDebitPerson || ''}
                                onChange={(e) => handleChange('authorizedDebitPerson', e.target.value)}
                                isInvalid={fieldErrors.authorizedDebitPerson}
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
                                                isInvalid={fieldErrors.bankName || fieldErrors[`bankName_${index}`]}
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
                                                isInvalid={fieldErrors.branch || fieldErrors[`branch_${index}`]}
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
                                                isInvalid={fieldErrors.accountNo || fieldErrors[`accountNo_${index}`]}
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
                                                isInvalid={fieldErrors.accountHolderName || fieldErrors[`accountHolderName_${index}`]}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Bank Telephone No. <span className="text-danger">*</span></Form.Label>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Select
                                                        value={account.bankTelephoneCountryCode || ''}
                                                        onChange={(e) => updateBankAccount(index, 'bankTelephoneCountryCode', e.target.value)}
                                                        isInvalid={fieldErrors.bankTelephoneCountryCode || fieldErrors[`bankTelephoneCountryCode_${index}`]}
                                                        required
                                                    >
                                                        <option value="">Code</option>
                                                        {getCountries().map((country) => {
                                                            const callingCode = `+${getCountryCallingCode(country)}`;
                                                            const countryName = en[country] || country;
                                                            return (
                                                                <option key={country} value={callingCode}>
                                                                    {callingCode} ({countryName})
                                                                </option>
                                                            );
                                                        })}
                                                    </Form.Select>
                                                </Col>
                                                <Col md={8}>
                                                    <Form.Control
                                                        type="tel"
                                                        placeholder="Enter bank telephone number"
                                                        value={account.bankTelephoneNo || ''}
                                                        onChange={(e) => updateBankAccount(index, 'bankTelephoneNo', e.target.value)}
                                                        isInvalid={fieldErrors.bankTelephoneNo || fieldErrors[`bankTelephoneNo_${index}`]}
                                                        required
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Jenis Rekening Bank (Bank Account Type) <span className="text-danger">*</span></Form.Label>
                                            <Form.Select
                                                value={account.bankAccountType || ''}
                                                onChange={(e) => {
                                                    console.log(`Bank account type selected: ${e.target.value} for account ${index}`);
                                                    updateBankAccount(index, 'bankAccountType', e.target.value);
                                                }}
                                                isInvalid={fieldErrors.bankAccountType || fieldErrors[`bankAccountType_${index}`]}
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
                                                    isInvalid={fieldErrors.bankAccountTypeOther || fieldErrors[`bankAccountTypeOther_${index}`]}
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

const CompanyDocumentUploadStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [uploadedDocs, setUploadedDocs] = useState(data.uploadedCompanyDocuments || {});
    const [uploadedFiles, setUploadedFiles] = useState(data.uploadedCompanyFiles || {});
    const fileInputRefs = useRef({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Define company document requirements like Foreign Company/Person forms
    const companyDocumentRequirements = [
        {
            category: "Company Documents",
            documents: [
                "Scan Anggaran Dasar Perusahaan (Scan Company's Articles of Association)",
                "Scan Nomor Izin Usaha (Scan Certificate of Incorporation)",
                "Laporan Keuangan / Deskripsi Kegiatan Usaha (Financial Statements / Description of Business Activities)",
                "Struktur Manajemen (Management Structure)",
                "Struktur Kepemilikan (Ownership Structure)"
            ]
        }
    ];

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
        
        // Map document uploads to backend field names
        const documentMappingByIndex = {
            '0_0': 'articlesOfAssociation',        // Articles of Association
            '0_1': 'certificateOfIncorporation',   // Certificate of Incorporation  
            '0_2': 'financialStatements',          // Financial Statements
            '0_3': 'managementStructure',          // Management Structure
            '0_4': 'ownershipStructure'            // Ownership Structure
        };
        
        // Update parent component with file objects
        const updatedData = {
            ...data,
            uploadedCompanyDocuments: newUploadedDocs,
            companyDocumentsUploaded: Object.values(newUploadedDocs).every(doc => doc !== null)
        };
        
        // Add the specific document file to the data using backend field names
        if (documentMappingByIndex[docKey] && file) {
            updatedData[documentMappingByIndex[docKey]] = file;
        }
        
        onChange(updatedData);

        // Clear field error when file is uploaded
        if (clearFieldError) {
            const fieldName = documentMappingByIndex[docKey];
            if (fieldName) {
                clearFieldError(fieldName);
            }
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
        
        // Map document uploads to backend field names
        const documentMappingByIndex = {
            '0_0': 'articlesOfAssociation',        // Articles of Association
            '0_1': 'certificateOfIncorporation',   // Certificate of Incorporation  
            '0_2': 'financialStatements',          // Financial Statements
            '0_3': 'managementStructure',          // Management Structure
            '0_4': 'ownershipStructure'            // Ownership Structure
        };

        // Update parent component
        const updatedData = {
            ...data,
            uploadedCompanyDocuments: newUploadedDocs,
            companyDocumentsUploaded: Object.values(newUploadedDocs).every(doc => doc !== null)
        };
        
        // Remove the specific document file from the data
        if (documentMappingByIndex[docKey]) {
            delete updatedData[documentMappingByIndex[docKey]];
        }
        
        onChange(updatedData);

        // Clear the file input value
        if (fileInputRefs.current[docKey]) {
            fileInputRefs.current[docKey].value = '';
        }
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Company Documents Upload</h4>
                <p className="text-muted fs-5">Upload all required company documents for Indonesian Company</p>
            </div>

            {companyDocumentRequirements.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">{category.category}</h6>
                    </Card.Header>
                    <Card.Body>
                        {category.documents.map((doc, docIndex) => {
                            const docKey = `${categoryIndex}_${docIndex}`;
                            const isUploaded = uploadedDocs[docKey];
                            const documentMappingByIndex = {
                                '0_0': 'articlesOfAssociation',
                                '0_1': 'certificateOfIncorporation',
                                '0_2': 'financialStatements',
                                '0_3': 'managementStructure',
                                '0_4': 'ownershipStructure'
                            };
                            const fieldName = documentMappingByIndex[docKey];
                            
                            return (
                                <Form.Group key={docIndex} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Form.Label className="text-muted mb-0">
                                        {doc} <span className="text-danger">*</span>
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
                                            isInvalid={fieldErrors[fieldName]}
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
                                            <div className={`form-control d-flex align-items-center ${fieldErrors[fieldName] ? 'is-invalid' : ''}`}>
                                                <i className="mdi mdi-file-document me-2 text-primary"></i>
                                                <span className="flex-grow-1">{isUploaded.name}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Form.Text className="text-muted">
                                        Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                                    </Form.Text>

                                    {fieldErrors[fieldName] && (
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
            
             {/* Additional non-mapped documents */}
             <Card className="mb-4 border-0 shadow-sm">
                 <Card.Header className="bg-light border-0">
                     <h6 className="mb-0 text-primary">Additional Required Documents</h6>
                 </Card.Header>
                 <Card.Body>
                     <Form.Group className="mb-3">
                         <div className="d-flex justify-content-between align-items-center">
                             <Form.Label className="text-muted mb-0">
                             Spesimen Tanda Tangan Pihak Yang Melaksanakan Transaksi (Board of Resolution) <span className="text-danger">*</span>
                             {data.boardOfResolutionFile && (
                                 <span className="text-success ms-2">
                                         <i className="mdi mdi-check-circle"></i> Uploaded: {data.boardOfResolutionFile.name}
                                 </span>
                             )}
                         </Form.Label>
                             {data.boardOfResolutionFile && (
                                 <button
                                     type="button"
                                     className="btn btn-sm btn-outline-danger"
                                     onClick={() => {
                                         const newData = { ...data };
                                         delete newData.boardOfResolutionFile;
                                         onChange(newData);
                                     }}
                                     title="Remove file"
                                 >
                                     <i className="mdi mdi-delete"></i> Remove
                                 </button>
                             )}
                         </div>
                         
                         {/* Show file input when no file uploaded */}
                         {!data.boardOfResolutionFile && (
                         <Form.Control 
                             type="file" 
                             accept=".pdf,.jpg,.jpeg,.png" 
                                 onChange={(e) => {
                                     if (e.target.files[0]) {
                                         onChange({ ...data, boardOfResolutionFile: e.target.files[0] });
                                         // Clear field error when user uploads a file
                                         if (clearFieldError && fieldErrors.boardOfResolutionFile) {
                                             clearFieldError('boardOfResolutionFile');
                                         }
                                     }
                                 }}
                                 isInvalid={fieldErrors.boardOfResolutionFile}
                                 className="mt-2"
                             required 
                         />
                         )}
                         
                         {/* Show custom file display when file uploaded */}
                         {data.boardOfResolutionFile && (
                             <div className="mt-2">
                                 <div className={`form-control d-flex align-items-center ${fieldErrors.boardOfResolutionFile ? 'is-invalid' : ''}`}>
                                     <i className="mdi mdi-file-document me-2 text-primary"></i>
                                     <span className="flex-grow-1">{data.boardOfResolutionFile.name}</span>
                                 </div>
                             </div>
                         )}
                         
                         <Form.Text className="text-muted">
                             Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                         </Form.Text>

                         {fieldErrors.boardOfResolutionFile && (
                             <div className="invalid-feedback d-block">
                                 This document is required.
                             </div>
                         )}
                     </Form.Group>
 
                     <Form.Group className="mb-3">
                         <div className="d-flex justify-content-between align-items-center">
                             <Form.Label className="text-muted mb-0">
                             Surat Kuasa (Power of Attorney) <span className="text-danger">*</span>
                             {data.powerOfAttorneyFile && (
                                 <span className="text-success ms-2">
                                         <i className="mdi mdi-check-circle"></i> Uploaded: {data.powerOfAttorneyFile.name}
                                 </span>
                             )}
                         </Form.Label>
                             {data.powerOfAttorneyFile && (
                                 <button
                                     type="button"
                                     className="btn btn-sm btn-outline-danger"
                                     onClick={() => {
                                         const newData = { ...data };
                                         delete newData.powerOfAttorneyFile;
                                         onChange(newData);
                                     }}
                                     title="Remove file"
                                 >
                                     <i className="mdi mdi-delete"></i> Remove
                                 </button>
                             )}
                         </div>
                         
                         {/* Show file input when no file uploaded */}
                         {!data.powerOfAttorneyFile && (
                         <Form.Control 
                             type="file" 
                             accept=".pdf,.jpg,.jpeg,.png" 
                                 onChange={(e) => {
                                     if (e.target.files[0]) {
                                         onChange({ ...data, powerOfAttorneyFile: e.target.files[0] });
                                         // Clear field error when user uploads a file
                                         if (clearFieldError && fieldErrors.powerOfAttorneyFile) {
                                             clearFieldError('powerOfAttorneyFile');
                                         }
                                     }
                                 }}
                                 isInvalid={fieldErrors.powerOfAttorneyFile}
                                 className="mt-2"
                             required 
                         />
                         )}
                         
                         {/* Show custom file display when file uploaded */}
                         {data.powerOfAttorneyFile && (
                             <div className="mt-2">
                                 <div className={`form-control d-flex align-items-center ${fieldErrors.powerOfAttorneyFile ? 'is-invalid' : ''}`}>
                                     <i className="mdi mdi-file-document me-2 text-primary"></i>
                                     <span className="flex-grow-1">{data.powerOfAttorneyFile.name}</span>
                                 </div>
                             </div>
                         )}
                         
                         <Form.Text className="text-muted">
                             Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                         </Form.Text>

                         {fieldErrors.powerOfAttorneyFile && (
                             <div className="invalid-feedback d-block">
                                 This document is required.
                             </div>
                         )}
                     </Form.Group>
                 </Card.Body>
             </Card>
        </div>
    );
};

const PowerOfAttorneyStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError, setFieldError }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError && fieldErrors[field]) {
            clearFieldError(field);
        }
        
        onChange(newData);
    };

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
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                isInvalid={fieldErrors.fullName}
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
                                onChange={(e) => handleChange('placeOfBirth', e.target.value)}
                                isInvalid={fieldErrors.placeOfBirth}
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
                                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                max={new Date().toISOString().split('T')[0]}
                                isInvalid={fieldErrors.dateOfBirth}
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
                                onChange={(e) => handleChange('idPassportNo', e.target.value)}
                                isInvalid={fieldErrors.idPassportNo}
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
                                onChange={(e) => handleChange('npwpNo', e.target.value)}
                                isInvalid={fieldErrors.npwpNo}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Jenis Kelamin <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.gender || ''}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                isInvalid={fieldErrors.gender}
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
                                onChange={(e) => handleChange('motherName', e.target.value)}
                                isInvalid={fieldErrors.motherName}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Status Perkawinan <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.maritalStatus || ''}
                                onChange={(e) => handleChange('maritalStatus', e.target.value)}
                                isInvalid={fieldErrors.maritalStatus}
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
                                onChange={(e) => {
                                    const newData = { ...data, nationality: e.target.value, ...(e.target.value !== 'OTHER' && { nationalityOther: '' }) };
                                    clearFieldError && clearFieldError('nationality');
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.nationality}
                                required
                            >
                                <option value="">Select nationality</option>
                                {getCountries().map((country) => {
                                    const countryName = en[country] || country;
                                    return (
                                        <option key={country} value={country}>
                                            {countryName}
                                        </option>
                                    );
                                })}
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.nationality === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other nationality"
                                    value={data.nationalityOther || ''}
                                    onChange={(e) => handleChange('nationalityOther', e.target.value)}
                                    isInvalid={fieldErrors.nationalityOther}
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
                                onChange={(e) => handleChange('streetAddress', e.target.value)}
                                isInvalid={fieldErrors.streetAddress}
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
                                onChange={(e) => handleChange('addressCity', e.target.value)}
                                isInvalid={fieldErrors.addressCity}
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
                                onChange={(e) => handleChange('addressPostalCode', e.target.value)}
                                isInvalid={fieldErrors.addressPostalCode}
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
                            <Row>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        value="+62 (ID)"
                                        readOnly
                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                    />
                                </Col>
                                <Col md={8}>
                            <Form.Control
                                type="tel"
                                placeholder="Enter home telephone number"
                                value={data.homeTelephoneNo || ''}
                                        onChange={(e) => {
                                            let phoneNumber = e.target.value;
                                            
                                            // Remove any non-digit characters except spaces and dashes for formatting
                                            phoneNumber = phoneNumber.replace(/[^\d\s-]/g, '');
                                            
                                            // Prevent starting with 0 - remove leading zeros
                                            phoneNumber = phoneNumber.replace(/^0+/, '');
                                            
                                            const newData = { 
                                                ...data, 
                                                homeTelephoneNo: phoneNumber,
                                                homeTelephoneCountryCode: '+62'
                                            };
                                            if (clearFieldError && fieldErrors.homeTelephoneNo) {
                                                clearFieldError('homeTelephoneNo');
                                            }
                                            onChange(newData);
                                        }}
                                        isInvalid={fieldErrors.homeTelephoneNo}
                                required
                            />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Handphone (Handphone No.) <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        value="+62 (ID)"
                                        readOnly
                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                    />
                                </Col>
                                <Col md={8}>
                            <Form.Control
                                type="tel"
                                placeholder="Enter handphone number"
                                value={data.handphoneNo || ''}
                                        onChange={(e) => {
                                            let phoneNumber = e.target.value;
                                            
                                            // Remove any non-digit characters except spaces and dashes for formatting
                                            phoneNumber = phoneNumber.replace(/[^\d\s-]/g, '');
                                            
                                            // Prevent starting with 0 - remove leading zeros
                                            phoneNumber = phoneNumber.replace(/^0+/, '');
                                            
                                            const newData = { 
                                                ...data, 
                                                handphoneNo: phoneNumber,
                                                handphoneCountryCode: '+62'
                                            };
                                            if (clearFieldError && fieldErrors.handphoneNo) {
                                                clearFieldError('handphoneNo');
                                            }
                                            onChange(newData);
                                        }}
                                        isInvalid={fieldErrors.handphoneNo}
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
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Faksimili Rumah</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter home fax number (optional)"
                                value={data.homeFaxNo || ''}
                                onChange={(e) => handleChange('homeFaxNo', e.target.value)}
                                isInvalid={fieldErrors.homeFaxNo}
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
                                onChange={(e) => handleChange('personalEmail', e.target.value)}
                                isInvalid={fieldErrors.personalEmail}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {/* Status and Purpose Information */}
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Status Kepemilikan Rumah (Home Ownership Status) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.homeOwnershipStatus || ''}
                                onChange={(e) => {
                                    const newData = { ...data, homeOwnershipStatus: e.target.value, ...(e.target.value !== 'LAINNYA' && { homeOwnershipStatusOther: '' }) };
                                    if (clearFieldError && fieldErrors.homeOwnershipStatus) {
                                        clearFieldError('homeOwnershipStatus');
                                    }
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.homeOwnershipStatus}
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
                                    onChange={(e) => handleChange('homeOwnershipStatusOther', e.target.value)}
                                    isInvalid={fieldErrors.homeOwnershipStatusOther}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Tujuan Pembukaan Rekening (Purpose of Account Opening) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.accountOpeningPurpose || ''}
                                onChange={(e) => {
                                    const newData = { ...data, accountOpeningPurpose: e.target.value, ...(e.target.value !== 'LAINNYA' && { accountOpeningPurposeOther: '' }) };
                                    if (clearFieldError && fieldErrors.accountOpeningPurpose) {
                                        clearFieldError('accountOpeningPurpose');
                                    }
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.accountOpeningPurpose}
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
                                    onChange={(e) => handleChange('accountOpeningPurposeOther', e.target.value)}
                                    isInvalid={fieldErrors.accountOpeningPurposeOther}
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
                                    onChange={(e) => {
                                        const newData = { ...data, investmentExperience: e.target.value, ...(e.target.value !== 'YA_BIDANG' && { investmentExperienceExplanation: '' }) };
                                        // Clear the radio button error since a valid option is selected
                                        if (clearFieldError && fieldErrors.investmentExperience) {
                                            clearFieldError('investmentExperience');
                                        }
                                        onChange(newData);
                                    }}
                                    isInvalid={fieldErrors.investmentExperience && !data.investmentExperience}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (None)"
                                    name="investmentExperience"
                                    value="TIDAK"
                                    checked={data.investmentExperience === 'TIDAK'}
                                    onChange={(e) => {
                                        const newData = { ...data, investmentExperience: e.target.value, ...(e.target.value !== 'YA_BIDANG' && { investmentExperienceExplanation: '' }) };
                                        // Clear the radio button error since a valid option is selected
                                        if (clearFieldError && fieldErrors.investmentExperience) {
                                            clearFieldError('investmentExperience');
                                        }
                                        onChange(newData);
                                    }}
                                    isInvalid={fieldErrors.investmentExperience && !data.investmentExperience}
                                />
                            </div>
                            {data.investmentExperience === 'YA_BIDANG' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Explain investment experience"
                                    value={data.investmentExperienceExplanation || ''}
                                    onChange={(e) => handleChange('investmentExperienceExplanation', e.target.value)}
                                    isInvalid={fieldErrors.investmentExperienceExplanation}
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
                                    onChange={(e) => handleChange('futuresTradingExperience', e.target.value)}
                                    isInvalid={fieldErrors.futuresTradingExperience && !data.futuresTradingExperience}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (No)"
                                    name="futuresTradingExperience"
                                    value="TIDAK"
                                    checked={data.futuresTradingExperience === 'TIDAK'}
                                    onChange={(e) => handleChange('futuresTradingExperience', e.target.value)}
                                    isInvalid={fieldErrors.futuresTradingExperience && !data.futuresTradingExperience}
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
                                    onChange={(e) => handleChange('familyInBappebti', e.target.value)}
                                    isInvalid={fieldErrors.familyInBappebti && !data.familyInBappebti}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (No)"
                                    name="familyInBappebti"
                                    value="TIDAK"
                                    checked={data.familyInBappebti === 'TIDAK'}
                                    onChange={(e) => handleChange('familyInBappebti', e.target.value)}
                                    isInvalid={fieldErrors.familyInBappebti && !data.familyInBappebti}
                                />
                            </div>
                            {data.familyInBappebti === 'YA' && (
                                <div className="mt-2">
                                    <small className="text-danger">
                                        <i className="mdi mdi-alert-circle me-1"></i>
                                        You must select "Tidak (No)" to proceed. Having family members working in BAPPEBTI/Bursa/Berjangka/Kliring Berjangka disqualifies your application.
                                    </small>
                                </div>
                            )}
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
                                    onChange={(e) => handleChange('declaredBankrupt', e.target.value)}
                                    isInvalid={fieldErrors.declaredBankrupt && !data.declaredBankrupt}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Tidak (No)"
                                    name="declaredBankrupt"
                                    value="TIDAK"
                                    checked={data.declaredBankrupt === 'TIDAK'}
                                    onChange={(e) => handleChange('declaredBankrupt', e.target.value)}
                                    isInvalid={fieldErrors.declaredBankrupt && !data.declaredBankrupt}
                                />
                            </div>
                            {data.declaredBankrupt === 'YA' && (
                                <div className="mt-2">
                                    <small className="text-danger">
                                        <i className="mdi mdi-alert-circle me-1"></i>
                                        You must select "Tidak (No)" to proceed. Being declared bankrupt by the Court disqualifies your application.
                                    </small>
                                </div>
                            )}
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
                                onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactName}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>No. Handphone (Handphone No.) <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        value="+62 (ID)"
                                        readOnly
                                        style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed' }}
                                    />
                                </Col>
                                <Col md={8}>
                            <Form.Control
                                type="tel"
                                placeholder="Enter emergency contact handphone"
                                value={data.emergencyContactHandphone || ''}
                                        onChange={(e) => {
                                            let phoneNumber = e.target.value;
                                            
                                            // Remove any non-digit characters except spaces and dashes for formatting
                                            phoneNumber = phoneNumber.replace(/[^\d\s-]/g, '');
                                            
                                            // Prevent starting with 0 - remove leading zeros
                                            phoneNumber = phoneNumber.replace(/^0+/, '');
                                            
                                            const newData = { 
                                                ...data, 
                                                emergencyContactHandphone: phoneNumber,
                                                emergencyContactHandphoneCountryCode: '+62'
                                            };
                                            if (clearFieldError && fieldErrors.emergencyContactHandphone) {
                                                clearFieldError('emergencyContactHandphone');
                                            }
                                            onChange(newData);
                                        }}
                                        isInvalid={fieldErrors.emergencyContactHandphone}
                                required
                            />
                                </Col>
                            </Row>
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
                                onChange={(e) => handleChange('emergencyContactStreetAddress', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactStreetAddress}
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
                                onChange={(e) => handleChange('emergencyContactCity', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactCity}
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
                                onChange={(e) => handleChange('emergencyContactPostalCode', e.target.value)}
                                isInvalid={fieldErrors.emergencyContactPostalCode}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Hubungan dengan anda (Relationship) <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => {
                                    const newData = { ...data, emergencyContactRelationship: e.target.value, ...(e.target.value !== 'LAINNYA' && { emergencyContactRelationshipOther: '' }) };
                                    if (clearFieldError && fieldErrors.emergencyContactRelationship) {
                                        clearFieldError('emergencyContactRelationship');
                                    }
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.emergencyContactRelationship}
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
                                    onChange={(e) => handleChange('emergencyContactRelationshipOther', e.target.value)}
                                    isInvalid={fieldErrors.emergencyContactRelationshipOther}
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
                                onChange={(e) => {
                                    const newData = { 
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
                                    };
                                    if (clearFieldError && fieldErrors.jobOfPowerOfAttorney) {
                                        clearFieldError('jobOfPowerOfAttorney');
                                    }
                                    onChange(newData);
                                }}
                                isInvalid={fieldErrors.jobOfPowerOfAttorney}
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
                                    onChange={(e) => handleChange('jobOfPowerOfAttorneyOther', e.target.value)}
                                    isInvalid={fieldErrors.jobOfPowerOfAttorneyOther}
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
                                onChange={(e) => handleChange('employmentCompanyName', e.target.value)}
                                isInvalid={fieldErrors.employmentCompanyName}
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
                                onChange={(e) => handleChange('businessField', e.target.value)}
                                isInvalid={fieldErrors.businessField}
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
                                onChange={(e) => handleChange('employmentPosition', e.target.value)}
                                isInvalid={fieldErrors.employmentPosition}
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
                                onChange={(e) => handleChange('lengthOfWork', e.target.value)}
                                isInvalid={fieldErrors.lengthOfWork}
                                required
                            />
                        </Form.Group>
                    </Col>
                        </Row>

                        <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                                    <Form.Label className="text-muted" style={{ minHeight: '24px' }}>Kantor Sebelumnya (Previous Company)</Form.Label>
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
                                        onChange={(e) => handleChange('officeStreetAddress', e.target.value)}
                                        isInvalid={fieldErrors.officeStreetAddress}
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
                                        onChange={(e) => handleChange('officeCity', e.target.value)}
                                        isInvalid={fieldErrors.officeCity}
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
                                        onChange={(e) => handleChange('officePostalCode', e.target.value)}
                                        isInvalid={fieldErrors.officePostalCode}
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
                                                onChange={(e) => handleChange('officePhoneCountryCode', e.target.value)}
                                                isInvalid={fieldErrors.officePhoneCountryCode}
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
                                                onChange={(e) => handleChange('officePhoneNo', e.target.value)}
                                                isInvalid={fieldErrors.officePhoneNo}
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
                                onChange={(e) => handleChange('annualIncome', e.target.value)}
                                isInvalid={fieldErrors.annualIncome}
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
                                onChange={(e) => handleChange('houseLocation', e.target.value)}
                                isInvalid={fieldErrors.houseLocation}
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
                                onChange={(e) => handleChange('njopValue', e.target.value)}
                                isInvalid={fieldErrors.njopValue}
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
                                onChange={(e) => handleChange('bankDeposit', e.target.value)}
                                isInvalid={fieldErrors.bankDeposit}
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
                                onChange={(e) => handleChange('totalAmount', e.target.value)}
                                isInvalid={fieldErrors.totalAmount}
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

const PersonalDocumentUploadStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [uploadedDocs, setUploadedDocs] = useState(data.uploadedPersonalDocuments || {});
    const fileInputRefs = useRef({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Define personal document requirements like Foreign Company/Person forms
    const personalDocumentRequirements = [
        {
            category: "Personal Documents",
            documents: [
                "Rekening Koran / Tagihan Kartu Kredit (Current Account / Credit Card Statement)",
                "Rekening Listrik / Telepon (Electricity / Phone Account)", 
                "Foto Terkini (Photo Selfie)",
                "KTP / SIM / Paspor (Identity No. / SIM / Passport)",
                "NPWP (Tax Identification No.)"
            ]
        }
    ];

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
        
        // Map document uploads to backend field names
        const documentMappingByIndex = {
            '0_0': 'currentAccountFile',              // Current Account Statement
            '0_1': 'electricityPhoneAccountFile',     // Electricity/Phone Account  
            '0_2': 'photoSelfiePersonalFile',         // Photo Selfie
            '0_3': 'identityPassportPersonalFile',    // Identity/Passport
            '0_4': 'npwpPersonalFile'                 // NPWP
        };
        
        // Update parent component with file objects
        const updatedData = {
            ...data,
            uploadedPersonalDocuments: newUploadedDocs,
            personalDocumentsUploaded: Object.values(newUploadedDocs).every(doc => doc !== null)
        };
        
        // Add the specific document file to the data using backend field names
        if (documentMappingByIndex[docKey] && file) {
            updatedData[documentMappingByIndex[docKey]] = file;
        }
        
        onChange(updatedData);

        // Clear field error when file is uploaded
        if (clearFieldError) {
            const fieldName = documentMappingByIndex[docKey];
            if (fieldName) {
                clearFieldError(fieldName);
            }
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
        
        // Map document uploads to backend field names
        const documentMappingByIndex = {
            '0_0': 'currentAccountFile',              // Current Account Statement
            '0_1': 'electricityPhoneAccountFile',     // Electricity/Phone Account  
            '0_2': 'photoSelfiePersonalFile',         // Photo Selfie
            '0_3': 'identityPassportPersonalFile',    // Identity/Passport
            '0_4': 'npwpPersonalFile'                 // NPWP
        };

        // Update parent component
        const updatedData = {
            ...data,
            uploadedPersonalDocuments: newUploadedDocs,
            personalDocumentsUploaded: Object.values(newUploadedDocs).every(doc => doc !== null)
        };
        
        // Remove the specific document file from the data
        if (documentMappingByIndex[docKey]) {
            delete updatedData[documentMappingByIndex[docKey]];
        }
        
        onChange(updatedData);

        // Clear the file input value
        if (fileInputRefs.current[docKey]) {
            fileInputRefs.current[docKey].value = '';
        }
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Personal Documents Upload</h4>
                <p className="text-muted fs-5">Upload all required personal documents for Power of Attorney</p>
            </div>

            {personalDocumentRequirements.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">{category.category}</h6>
                    </Card.Header>
                    <Card.Body>
                        {category.documents.map((doc, docIndex) => {
                            const docKey = `${categoryIndex}_${docIndex}`;
                            const isUploaded = uploadedDocs[docKey];
                            const documentMappingByIndex = {
                                '0_0': 'currentAccountFile',
                                '0_1': 'electricityPhoneAccountFile',
                                '0_2': 'photoSelfiePersonalFile',
                                '0_3': 'identityPassportPersonalFile',
                                '0_4': 'npwpPersonalFile'
                            };
                            const fieldName = documentMappingByIndex[docKey];
                            
                            return (
                                <Form.Group key={docIndex} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Form.Label className="text-muted mb-0">
                                        {doc} <span className="text-danger">*</span>
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
                                        accept={docIndex === 2 ? ".jpg,.jpeg,.png" : ".pdf,.jpg,.jpeg,.png"}
                                        onChange={(e) => handleFileUpload(categoryIndex, docIndex, e.target.files[0])}
                                            isInvalid={fieldErrors[fieldName]}
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
                                            <div className={`form-control d-flex align-items-center ${fieldErrors[fieldName] ? 'is-invalid' : ''}`}>
                                                <i className="mdi mdi-file-document me-2 text-primary"></i>
                                                <span className="flex-grow-1">{isUploaded.name}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Form.Text className="text-muted">
                                        Max 10MB. Accepted formats: {docIndex === 2 ? "JPG, JPEG, PNG" : "PDF, JPG, JPEG, PNG"}
                                    </Form.Text>

                                    {fieldErrors[fieldName] && (
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

const ReadStatementsStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleCheckboxChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user checks the checkbox
        if (clearFieldError && fieldErrors[field] && value) {
            clearFieldError(field);
        }
        
        onChange(newData);
    };

    const handleRadioChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user selects an option
        if (clearFieldError && fieldErrors[field]) {
            clearFieldError(field);
        }
        
        onChange(newData);
    };

    const handleInputChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError && fieldErrors[field]) {
            clearFieldError(field);
        }
        
        onChange(newData);
    };

    // All required fields for validation
    const baseRequiredFields = [
        'companyProfileRead', 'companyProfileUnderstanding',
        'statementRead', 'statementUnderstanding', 'tradingExperience',
        'experienceStatementRead', 'experienceUnderstanding',
        'applicationStatementRead', 'applicationUnderstanding',
        'riskDisclosureUnderstanding',
        'mandateStatementRead', 'baktiArbitration', 'mandateUnderstanding',
        'tradingRulesRead', 'tradingRulesUnderstanding',
        'personalAccessPasswordRead', 'personalAccessPasswordUnderstanding'
    ];

    // Add conditional fields based on trading experience
    const conditionalFields = data.tradingExperience === 'ya' ? ['brokerCompany', 'demoAccountNumber'] : [];
    
    // Add individual risk statement fields (always required since disclosure is always shown)
    const riskStatementFields = [
        'riskStatement1', 'riskStatement2', 'riskStatement3', 'riskStatement4', 'riskStatement5',
        'riskStatement6', 'riskStatement7', 'riskStatement8', 'riskStatement9', 'riskStatement10',
        'riskStatement11', 'riskStatement12', 'riskStatement13', 'riskStatement14'
    ];
    
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
                        onChange={(e) => handleCheckboxChange('companyProfileRead', e.target.checked)}
                        isInvalid={fieldErrors.companyProfileRead}
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
                        onChange={(e) => handleCheckboxChange('companyProfileUnderstanding', e.target.checked)}
                        isInvalid={fieldErrors.companyProfileUnderstanding}
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
                        onChange={(e) => handleCheckboxChange('statementRead', e.target.checked)}
                        isInvalid={fieldErrors.statementRead}
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
                        onChange={(e) => handleCheckboxChange('statementUnderstanding', e.target.checked)}
                        isInvalid={fieldErrors.statementUnderstanding}
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
                                onChange={(e) => {
                                    const newData = { 
                                    ...data, 
                                    tradingExperience: e.target.value,
                                    ...(e.target.value !== 'ya' && { brokerCompany: '', demoAccountNumber: '' })
                                    };
                                    handleRadioChange('tradingExperience', e.target.value);
                                }} 
                                isInvalid={fieldErrors.tradingExperience && !data.tradingExperience}
                                required 
                            />
                            <Form.Check 
                                type="radio" 
                                name="tradingExperience" 
                                label="Tidak (No)" 
                                value="tidak" 
                                checked={data.tradingExperience === 'tidak'} 
                                onChange={(e) => {
                                    const newData = { 
                                    ...data, 
                                    tradingExperience: e.target.value,
                                    ...(e.target.value !== 'ya' && { brokerCompany: '', demoAccountNumber: '' })
                                    };
                                    handleRadioChange('tradingExperience', e.target.value);
                                }} 
                                isInvalid={fieldErrors.tradingExperience && !data.tradingExperience}
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
                                    onChange={(e) => handleInputChange('brokerCompany', e.target.value)} 
                                    isInvalid={fieldErrors.brokerCompany}
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
                                    onChange={(e) => handleInputChange('demoAccountNumber', e.target.value)} 
                                    isInvalid={fieldErrors.demoAccountNumber}
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
                        onChange={(e) => handleCheckboxChange('experienceStatementRead', e.target.checked)}
                        isInvalid={fieldErrors.experienceStatementRead}
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
                        onChange={(e) => handleCheckboxChange('experienceUnderstanding', e.target.checked)}
                        isInvalid={fieldErrors.experienceUnderstanding}
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
                        onChange={(e) => handleCheckboxChange('applicationStatementRead', e.target.checked)}
                        isInvalid={fieldErrors.applicationStatementRead}
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
                        onChange={(e) => handleCheckboxChange('applicationUnderstanding', e.target.checked)}
                        isInvalid={fieldErrors.applicationUnderstanding}
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

                    <div className="mb-4 border rounded p-4 bg-light">
                            <div className="mb-4">
                                <p className="fw-bold mb-3">1. Perdagangan Kontrak Berjangka belum tentu layak bagi semua investor. Anda dapat menderita kerugian dalam jumlah besar dan dalam jangka waktu singkat.</p>
                                <p className="mb-3">Jumlah kerugian uang dimungkinkan dapat melebihi jumlah uang yang pertama kali Anda setor (Margin awal) ke Pialang Berjangka Anda. Anda mungkin menderita kerugian seluruh Margin dan Margin tambahan yang ditempatkan pada Pialang Berjangka untuk mempertahankan posisi Kontrak Berjangka Anda. Hal ini disebabkan Perdagangan Berjangka sangat dipengaruhi oleh mekanisme leverage, dimana dengan jumlah investasi dalam bentuk yang relatif kecil dapat digunakan untuk membuka posisi dengan aset yang bernilai jauh lebih tinggi. Apabila Anda tidak siap dengan risiko seperti ini, sebaiknya Anda tidak melakukan perdagangan Kontrak Berjangka.</p>
                                <Form.Check
                                    type="checkbox"
                                    id="risk-statement-1"
                                    label="Saya Sudah membaca dan memahami"
                                    checked={data.riskStatement1 || false}
                                    onChange={(e) => handleCheckboxChange('riskStatement1', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement1}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement2', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement2}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement3', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement3}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement4', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement4}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement5', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement5}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement6', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement6}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement7', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement7}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement8', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement8}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement9', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement9}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement10', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement10}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement11', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement11}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement12', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement12}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement13', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement13}
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
                                    onChange={(e) => handleCheckboxChange('riskStatement14', e.target.checked)}
                                    isInvalid={fieldErrors.riskStatement14}
                                    required
                                />
                            </div>
                        </div>

                    <div className="border rounded p-3 bg-light mb-3">
                        <h6 className="text-center fw-bold mb-3">PERNYATAAN MENERIMA PEMBERITAHUAN ADANYA RISIKO</h6>
                        <p className="text-center mb-3">
                            Dengan mengisi kolom "YA" di bawah, saya menyatakan bahwa saya telah menerima "DOKUMEN PEMBERITAHUAN ADANYA RISIKO" mengerti dan menyetujui isinya.
                        </p>
                        <div className="d-flex justify-content-center">
                            <div className="d-flex align-items-start" style={{ gap: '8px' }}>
                        <Form.Check
                            type="checkbox"
                            id="risk-disclosure-understanding"
                            checked={data.riskDisclosureUnderstanding || false}
                                    onChange={(e) => handleCheckboxChange('riskDisclosureUnderstanding', e.target.checked)}
                                    isInvalid={fieldErrors.riskDisclosureUnderstanding}
                            required
                                />
                                <label htmlFor="risk-disclosure-understanding" className="form-check-label">
                                    Ya, Saya menyatakan bahwa saya telah membaca dan menerima informasi, mengerti dan memahami isinya{' '}
                                    <a href="/documents/kyc/indonesian-company/Risk Disclosure 240705.pdf" target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-underline">
                                        Risk Disclosure
                                    </a>.<span className="text-danger">*</span>
                                </label>
                            </div>
                        </div>
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
                        onChange={(e) => handleCheckboxChange('mandateStatementRead', e.target.checked)}
                        isInvalid={fieldErrors.mandateStatementRead}
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
                            onChange={(e) => handleCheckboxChange('baktiArbitration', e.target.checked)}
                            isInvalid={fieldErrors.baktiArbitration}
                            required
                        />
                    </Form.Group>

                    <Form.Check
                        type="checkbox"
                        id="mandate-understanding"
                        checked={data.mandateUnderstanding || false}
                        onChange={(e) => handleCheckboxChange('mandateUnderstanding', e.target.checked)}
                        isInvalid={fieldErrors.mandateUnderstanding}
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
                        onChange={(e) => handleCheckboxChange('tradingRulesRead', e.target.checked)}
                        isInvalid={fieldErrors.tradingRulesRead}
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
                        onChange={(e) => handleCheckboxChange('tradingRulesUnderstanding', e.target.checked)}
                        isInvalid={fieldErrors.tradingRulesUnderstanding}
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
                        onChange={(e) => handleCheckboxChange('personalAccessPasswordRead', e.target.checked)}
                        isInvalid={fieldErrors.personalAccessPasswordRead}
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
                        onChange={(e) => handleCheckboxChange('personalAccessPasswordUnderstanding', e.target.checked)}
                        isInvalid={fieldErrors.personalAccessPasswordUnderstanding}
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
                    Please complete all required fields before proceeding.
                   
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