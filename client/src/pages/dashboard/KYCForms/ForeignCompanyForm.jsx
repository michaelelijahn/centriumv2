import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { useNotificationContext } from '../../../common/context/useNotificationContext';
import AuthService from '../../../common/api/auth';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';

const ForeignCompanyForm = () => {
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
                return <EmailRegistrationStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 2:
                return <CompanyDetailsStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 3:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 4:
                return <AuthorizePersonStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 5:
                return <ReviewStep data={stepData} onChange={updateFormData} allData={formData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
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

    // Validation functions for each step
    const validateStep = (stepIndex, stepData, allData) => {
        switch (stepIndex) {
            case 0: // Requirements step - always valid (just informational)
                return { isValid: true, errors: [] };
            
            case 1: // Email Registration step
                return validateEmailStep(stepData);
            
            case 2: // Company Details step
                return validateCompanyDetailsStep(stepData);
            
            case 3: // Document Upload step
                return validateDocumentUploadStep(stepData);
            
            case 4: // Authorize Person step
                return validateAuthorizePersonStep(stepData);
            
            case 5: // Review step
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
        
        // Special validation for phone number - must have digits after country code
        if (data.officeTelephoneNo && data.countryCode) {
            const numberPart = data.officeTelephoneNo.substring(data.countryCode.length).trim();
            if (!numberPart || numberPart.length === 0) {
                errors.push('Please enter the phone number after the country code');
            }
        }
        
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
        
        // Check if all required documents are uploaded (excluding Authorize Person Passport which is in step 4)
        const requiredDocuments = [
            { key: '0_0', name: 'Certificate of Incorporation' },
            { key: '0_1', name: 'Board of Resolution' },
            { key: '0_2', name: 'Address Proof' },
            { key: '1_0', name: 'Bank Statement' },
            { key: '2_0', name: 'Beneficial Owner Passport' },
            { key: '3_0', name: 'Management Structure' },
            { key: '3_1', name: 'Ownership Structure' }
        ];
        
        const uploadedDocs = data.uploadedDocuments || {};
        
        requiredDocuments.forEach(doc => {
            if (!uploadedDocs[doc.key]) {
                errors.push(`${doc.name} is required`);
            }
        });
        
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
            { field: 'authorizePersonPassport', label: 'Passport Upload' },
            { field: 'authorizePersonEmail', label: 'Authorize Person Email' },
            { field: 'authorizePersonGender', label: 'Gender' },
            { field: 'authorizePersonMaritalStatus', label: 'Marital Status' },
            { field: 'authorizePersonCitizen', label: 'Citizenship' },
            { field: 'authorizePersonCountryCode', label: 'Phone Country Code' },
            { field: 'authorizePersonPhoneNumber', label: 'Phone Number' },
            { field: 'authorizePersonStreetAddress', label: 'Authorize Person Street Address' },
            { field: 'authorizePersonCity', label: 'Authorize Person City' },
            { field: 'authorizePersonPostalCode', label: 'Authorize Person Postal Code' },
            { field: 'authorizePersonCountry', label: 'Authorize Person Country' },
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
        
        requiredFields.forEach(({ field, label }) => {
            // Handle different field types
            if (field === 'authorizePersonPassport') {
                // File upload field
                if (!data[field]) {
                    errors.push(`${label} is required`);
                }
            } else {
                // String fields
                if (!data[field]?.trim()) {
                    errors.push(`${label} is required`);
                }
            }
        });
        
        // Check conditional fields
        if (data.authorizePersonCitizen === 'OTHER' && !data.authorizePersonCitizenOther?.trim()) {
            errors.push('Please specify other citizenship');
        }
        
        if (data.authorizePersonCountry === 'OTHER' && !data.authorizePersonCountryOther?.trim()) {
            errors.push('Please specify other authorize person country');
        }
        
        if (data.authorizePersonOfficeCountry === 'OTHER' && !data.authorizePersonOfficeCountryOther?.trim()) {
            errors.push('Please specify other office country');
        }
        
        if (data.authorizePersonInvestmentExperience === 'YES' && !data.authorizePersonInvestmentExperienceDetails?.trim()) {
            errors.push('Please provide details about your investment experience');
        }
        
        // Validate email format
        if (data.authorizePersonEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.authorizePersonEmail)) {
            errors.push('Please enter a valid email address for authorize person');
        }
        
        // Validate age (must be at least 21 years old)
        if (data.authorizePersonDateOfBirth) {
            const birthDate = new Date(data.authorizePersonDateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            // Check if birthday has passed this year
            const actualAge = (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) 
                ? age - 1 
                : age;
                
            if (actualAge < 21) {
                errors.push('Minimum 21 years old is required');
            }
        }
        
        // Validate phone number format (must have numbers after country code)
        if (data.authorizePersonCountryCode && data.authorizePersonPhoneNumber) {
            const phoneWithoutCode = data.authorizePersonPhoneNumber.replace(data.authorizePersonCountryCode, '').trim();
            if (!phoneWithoutCode || phoneWithoutCode.length === 0) {
                errors.push('Please enter phone number after the country code');
            }
        }
        
        // Validate bank accounts
        if (!data.bankAccounts || data.bankAccounts.length === 0) {
            errors.push('At least one bank account is required');
            // Also add individual field errors for the first bank account to show red borders
            const firstBankFields = [
                { field: 'bankName', label: 'Bank Name' },
                { field: 'accountName', label: 'Account Name' },
                { field: 'bankAddress', label: 'Bank Address' },
                { field: 'bankCity', label: 'Bank City' },
                { field: 'bankCountry', label: 'Bank Country' },
                { field: 'swiftCode', label: 'SWIFT Code' },
                { field: 'accountNo', label: 'Account Number' }
            ];
            firstBankFields.forEach(({ label }) => {
                errors.push(`${label} is required`);
            });
        } else {
            // Check if all bank accounts are completely empty
            const hasValidBankAccount = data.bankAccounts.some(account => 
                account.bankName?.trim() || account.accountName?.trim() || account.bankAddress?.trim() ||
                account.bankCity?.trim() || account.bankCountry?.trim() || account.swiftCode?.trim() || account.accountNo?.trim()
            );
            
            if (!hasValidBankAccount) {
                errors.push('At least one bank account is required');
                // Add individual field errors for the first bank account to show red borders
                const firstBankFields = [
                    { field: 'bankName', label: 'Bank Name' },
                    { field: 'accountName', label: 'Account Name' },
                    { field: 'bankAddress', label: 'Bank Address' },
                    { field: 'bankCity', label: 'Bank City' },
                    { field: 'bankCountry', label: 'Bank Country' },
                    { field: 'swiftCode', label: 'SWIFT Code' },
                    { field: 'accountNo', label: 'Account Number' }
                ];
                firstBankFields.forEach(({ label }) => {
                    errors.push(`${label} is required`);
                });
            }
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

    const validateReviewStep = (data) => {
        const errors = [];
        
        const requiredAgreements = [
            'companyProfile',
            'statementSimulation', 
            'statementExperience',
            'disclosureStatement',
            'accountOpening',
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
            accountOpening: 'Account Opening Application',
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
        
        // Create field error mapping for red border styling
        const newFieldErrors = {};
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                // Map error messages to field names for styling
                if (error.includes('Company Registration Name')) newFieldErrors.companyRegistrationName = true;
                if (error.includes('Company License Number')) newFieldErrors.companyLicenseNo = true;
                if (error.includes('Nature of Business')) newFieldErrors.natureOfBusiness = true;
                if (error.includes('Company Legal Form')) newFieldErrors.companyLegalForm = true;
                if (error.includes('Street Address')) newFieldErrors.streetAddress = true;
                if (error.includes('City')) newFieldErrors.city = true;
                if (error.includes('Postal/Zip Code')) newFieldErrors.postalCode = true;
                if (error.includes('Country')) newFieldErrors.country = true;
                if (error.includes('Place of Establishment')) newFieldErrors.placeOfEstablishment = true;
                if (error.includes('Date of Establishment')) newFieldErrors.dateOfEstablishment = true;
                if (error.includes('Country Code') || error.includes('phone number after the country code')) newFieldErrors.countryCode = true;
                if (error.includes('Office Telephone Number') || error.includes('phone number after the country code')) newFieldErrors.officeTelephoneNo = true;
                if (error.includes('Beneficial Owner Name')) newFieldErrors.beneficialOwnerName = true;
                if (error.includes('Beneficial Owner Passport Number')) newFieldErrors.beneficialOwnerPassportNo = true;
                if (error.includes('Source of Funds')) newFieldErrors.sourceOfFunds = true;
                if (error.includes('Trading Account Purpose')) newFieldErrors.tradingAccountPurpose = true;
                if (error.includes('other legal form')) newFieldErrors.companyLegalFormOther = true;
                if (error.includes('other country')) newFieldErrors.countryOther = true;
                if (error.includes('other source of funds')) newFieldErrors.sourceOfFundsOther = true;
                if (error.includes('other trading account purpose')) newFieldErrors.tradingAccountPurposeOther = true;
                if (error.includes('Company email address') || error.includes('valid email address')) newFieldErrors.email = true;
                if (error.includes('Demo account selection')) newFieldErrors.demoAccountNo = true;
                // Document upload errors
                if (error.includes('Certificate of Incorporation')) newFieldErrors['document_0_0'] = true;
                if (error.includes('Board of Resolution')) newFieldErrors['document_0_1'] = true;
                if (error.includes('Address Proof')) newFieldErrors['document_0_2'] = true;
                if (error.includes('Bank Statement')) newFieldErrors['document_1_0'] = true;
                if (error.includes('Beneficial Owner Passport')) newFieldErrors['document_2_0'] = true;
                if (error.includes('Management Structure')) newFieldErrors['document_3_0'] = true;
                if (error.includes('Ownership Structure')) newFieldErrors['document_3_1'] = true;
                // Authorize Person Step errors
                if (error.includes('Authorize Person Title')) newFieldErrors.authorizePersonTitle = true;
                if (error.includes('Authorize Person Full Name')) newFieldErrors.authorizePersonFullName = true;
                if (error.includes('Place of Birth')) newFieldErrors.authorizePersonPlaceOfBirth = true;
                if (error.includes('Date of Birth')) newFieldErrors.authorizePersonDateOfBirth = true;
                if (error.includes('must be at least 21 years old')) newFieldErrors.authorizePersonDateOfBirth = true;
                if (error.includes('Minimum 21 years old is required')) newFieldErrors.authorizePersonDateOfBirth = true;
                if (error.includes('Passport ID Number')) newFieldErrors.authorizePersonPassportId = true;
                if (error.includes('Passport Upload')) newFieldErrors.authorizePersonPassport = true;
                if (error.includes('Authorize Person Email')) newFieldErrors.authorizePersonEmail = true;
                if (error.includes('valid email address for authorize person')) newFieldErrors.authorizePersonEmail = true;
                if (error.includes('Gender')) newFieldErrors.authorizePersonGender = true;
                if (error.includes('Marital Status')) newFieldErrors.authorizePersonMaritalStatus = true;
                if (error.includes('Citizenship')) newFieldErrors.authorizePersonCitizen = true;
                if (error.includes('Phone Country Code')) newFieldErrors.authorizePersonCountryCode = true;
                if (error.includes('Phone Number')) newFieldErrors.authorizePersonPhoneNumber = true;
                if (error.includes('phone number after the country code')) newFieldErrors.authorizePersonPhoneNumber = true;
                if (error.includes('Authorize Person Street Address')) newFieldErrors.authorizePersonStreetAddress = true;
                if (error.includes('Authorize Person City')) newFieldErrors.authorizePersonCity = true;
                if (error.includes('Authorize Person Postal Code')) newFieldErrors.authorizePersonPostalCode = true;
                if (error.includes('Authorize Person Country')) newFieldErrors.authorizePersonCountry = true;
                if (error.includes('Investment Experience')) newFieldErrors.authorizePersonInvestmentExperience = true;
                if (error.includes('Family in BAPPEBTI')) newFieldErrors.authorizePersonFamilyInBappebti = true;
                if (error.includes('Bankruptcy Declaration')) newFieldErrors.authorizePersonDeclaredBankrupt = true;
                if (error.includes('Company Name')) newFieldErrors.authorizePersonCompanyName = true;
                if (error.includes('Nature of Business')) newFieldErrors.authorizePersonBusinessNature = true;
                if (error.includes('Job Position')) newFieldErrors.authorizePersonJobPosition = true;
                if (error.includes('Office Address')) newFieldErrors.authorizePersonOfficeAddress = true;
                if (error.includes('Office City')) newFieldErrors.authorizePersonOfficeCity = true;
                if (error.includes('Office Postal Code')) newFieldErrors.authorizePersonOfficePostalCode = true;
                if (error.includes('Office Country')) newFieldErrors.authorizePersonOfficeCountry = true;
                if (error.includes('other citizenship')) newFieldErrors.authorizePersonCitizenOther = true;
                if (error.includes('other authorize person country')) newFieldErrors.authorizePersonCountryOther = true;
                if (error.includes('other office country')) newFieldErrors.authorizePersonOfficeCountryOther = true;
                if (error.includes('investment experience')) newFieldErrors.authorizePersonInvestmentExperienceDetails = true;
                // Bank account errors
                if (error.includes('Bank Name')) newFieldErrors.bankName = true;
                if (error.includes('Bank Address')) newFieldErrors.bankAddress = true;
                if (error.includes('Bank City')) newFieldErrors.bankCity = true;
                if (error.includes('Bank Postal Code')) newFieldErrors.bankPostalCode = true;
                if (error.includes('Bank Country')) newFieldErrors.bankCountry = true;
                if (error.includes('SWIFT Code')) newFieldErrors.swiftCode = true;
                if (error.includes('Account Number')) newFieldErrors.accountNo = true;
                if (error.includes('Account Name')) newFieldErrors.accountName = true;
                
                // Agreement field error mappings
                if (error.includes('Please agree to Company Profile')) newFieldErrors.companyProfile = true;
                if (error.includes('Please agree to Statement of Having Simulation')) newFieldErrors.statementSimulation = true;
                if (error.includes('Please agree to Statement of Having Experience')) newFieldErrors.statementExperience = true;
                if (error.includes('Please agree to Disclosure Statement')) newFieldErrors.disclosureStatement = true;
                if (error.includes('Please agree to Account Opening Application')) newFieldErrors.accountOpening = true;
                if (error.includes('Please agree to Risk Disclosure')) newFieldErrors.riskDisclosure = true;
                if (error.includes('Please agree to Mandate Agreement')) newFieldErrors.mandateAgreement = true;
                if (error.includes('Please agree to Trading Rules')) newFieldErrors.tradingRules = true;
                if (error.includes('Please agree to Personal Access Password')) newFieldErrors.personalAccessPassword = true;
            });
            
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
        
        setFieldErrors(newFieldErrors);
        return validation.isValid;
    };

    const handleSubmit = async (data) => {
        console.log('Submitting Foreign Company KYC (raw data):', data);
        
        try {
            // Show processing notification
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
            
            // Add file uploads to FormData
            const documentFieldMapping = {
                'certificateIncorporation': 'certificate_incorporation',
                'boardResolution': 'board_resolution',
                'addressProof': 'address_proof',
                'bankStatement': 'bank_statement',
                'beneficialOwnerPassport': 'beneficial_owner_passport',
                'managementStructure': 'management_structure',
                'ownershipStructure': 'ownership_structure',
                'authorizePersonPassport': 'authorize_person_passport'
            };
            
            // Add document files to FormData
            Object.keys(documentFieldMapping).forEach(frontendKey => {
                const backendKey = documentFieldMapping[frontendKey];
                if (flattenedData[frontendKey] instanceof File) {
                    formData.append(backendKey, flattenedData[frontendKey]);
                }
            });
            
            const response = await AuthService.submitForeignCompanyKYC(formData);
            
            if (response.success) {
                showNotification({
                    title: 'Success',
                    message: `Foreign Company KYC submitted successfully! Application Reference: ${response.data.applicationReference}`,
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
            console.error('KYC Submission Error:', error);
            showNotification({
                title: 'Submission Failed',
                message: error.message || 'An error occurred while submitting your KYC application. Please try again.',
                type: 'error'
            });
        }
    };

    return (
        <MultiStepFormWrapper
            accountType="Foreign Company"
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

const EmailRegistrationStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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

    const handleEmailChange = (field, value) => {
        const newData = { ...data, [field]: value };
        
        // Clear field error when user starts typing
        if (clearFieldError) {
            clearFieldError(field);
        }
        
        if (field === 'email') {
            setEmail(value);
            const isValid = value === '' || validateEmail(value);
            setEmailValid(isValid);
            
            if (value && !isValid) {
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
                <h4 className="text-primary mb-3">Company Email Registration</h4>
                <p className="text-dark fs-5">Please provide your official company email address</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">
                                Register Company Email <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter company email address"
                                value={email}
                                onChange={(e) => handleEmailChange('email', e.target.value)}
                                isInvalid={!emailValid || fieldErrors.email}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">
                                Select Demo Account No. <span className="text-danger">*</span>
                            </Form.Label>
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

const CompanyDetailsStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
                            <Form.Label className="text-muted">Company Registration Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company registration name"
                                value={data.companyRegistrationName || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('companyRegistrationName');
                                    onChange({ ...data, companyRegistrationName: e.target.value });
                                }}
                                isInvalid={fieldErrors.companyRegistrationName}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Company License No <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter company license number"
                                value={data.companyLicenseNo || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('companyLicenseNo');
                                    onChange({ ...data, companyLicenseNo: e.target.value });
                                }}
                                isInvalid={fieldErrors.companyLicenseNo}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('natureOfBusiness');
                                    onChange({ ...data, natureOfBusiness: e.target.value });
                                }}
                                isInvalid={fieldErrors.natureOfBusiness}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Company Legal Form <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.companyLegalForm || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('companyLegalForm');
                                    onChange({ ...data, companyLegalForm: e.target.value });
                                }}
                                isInvalid={fieldErrors.companyLegalForm}
                                required
                            >
                                <option value="">Select legal form</option>
                                <option value="LIMITED_LIABILITY_COMPANY">Limited Liability Company</option>
                                <option value="CORPORATION">Corporation</option>
                                <option value="PARTNERSHIP">Partnership</option>
                                <option value="SOLE_PROPRIETORSHIP">Sole Proprietorship</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.companyLegalForm === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other legal form"
                                    value={data.companyLegalFormOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('companyLegalFormOther');
                                        onChange({ ...data, companyLegalFormOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.companyLegalFormOther}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('streetAddress');
                                    onChange({ ...data, streetAddress: e.target.value });
                                }}
                                isInvalid={fieldErrors.streetAddress}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('city');
                                    onChange({ ...data, city: e.target.value });
                                }}
                                isInvalid={fieldErrors.city}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('postalCode');
                                    onChange({ ...data, postalCode: e.target.value });
                                }}
                                isInvalid={fieldErrors.postalCode}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.country || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('country');
                                    onChange({ ...data, country: e.target.value });
                                }}
                                isInvalid={fieldErrors.country}
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
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('countryOther');
                                        onChange({ ...data, countryOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.countryOther}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('placeOfEstablishment');
                                    onChange({ ...data, placeOfEstablishment: e.target.value });
                                }}
                                isInvalid={fieldErrors.placeOfEstablishment}
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
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('dateOfEstablishment');
                                    onChange({ ...data, dateOfEstablishment: e.target.value });
                                }}
                                isInvalid={fieldErrors.dateOfEstablishment}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Office Telephone No <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.countryCode || ''}
                                        isInvalid={fieldErrors.countryCode}
                                        onChange={(e) => {
                                            const selectedCode = e.target.value;
                                            // Clear field errors when user makes a selection
                                            clearFieldError && clearFieldError('countryCode');
                                            clearFieldError && clearFieldError('officeTelephoneNo');
                                            
                                            // If no country is selected (back to "Select Country Code"), clear the phone number
                                            if (!selectedCode) {
                                                onChange({ 
                                                    ...data, 
                                                    countryCode: selectedCode,
                                                    officeTelephoneNo: ''
                                                });
                                            }
                                            // If a country is selected, set the phone number to just the country code
                                            else {
                                                onChange({ 
                                                    ...data, 
                                                    countryCode: selectedCode,
                                                    officeTelephoneNo: selectedCode + ' '
                                                });
                                            }
                                        }}
                                        required
                                    >
                                        <option value="">Select Country Code</option>
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
                                        placeholder="Enter telephone number"
                                        value={data.officeTelephoneNo || ''}
                                        isInvalid={fieldErrors.officeTelephoneNo}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            
                                            // Clear field error when user starts typing
                                            clearFieldError && clearFieldError('officeTelephoneNo');
                                            
                                            // If there's a country code, ensure it stays at the beginning
                                            if (data.countryCode) {
                                                if (!value.startsWith(data.countryCode)) {
                                                    // If user deleted the country code, restore it
                                                    value = data.countryCode + ' ' + value.replace(/^\+\d+\s?/, '');
                                                } else {
                                                    // Extract the number part after country code
                                                    const numberPart = value.substring(data.countryCode.length).trim();
                                                    // Only allow numbers in the phone number part
                                                    const cleanNumber = numberPart.replace(/[^\d]/g, '');
                                                    value = data.countryCode + (cleanNumber ? ' ' + cleanNumber : ' ');
                                                }
                                            }
                                            
                                            onChange({ ...data, officeTelephoneNo: value });
                                        }}
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
                            <Form.Label className="text-muted">Beneficial Owner Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter beneficial owner name"
                                value={data.beneficialOwnerName || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('beneficialOwnerName');
                                    onChange({ ...data, beneficialOwnerName: e.target.value });
                                }}
                                isInvalid={fieldErrors.beneficialOwnerName}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('beneficialOwnerPassportNo');
                                    onChange({ ...data, beneficialOwnerPassportNo: e.target.value });
                                }}
                                isInvalid={fieldErrors.beneficialOwnerPassportNo}
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
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    // Clear field error when user makes a selection
                                    clearFieldError && clearFieldError('sourceOfFunds');
                                    // Clear the "other" text field if switching away from "OTHER"
                                    if (data.sourceOfFunds === 'OTHER' && newValue !== 'OTHER') {
                                        onChange({ ...data, sourceOfFunds: newValue, sourceOfFundsOther: '' });
                                    } else {
                                        onChange({ ...data, sourceOfFunds: newValue });
                                    }
                                }}
                                isInvalid={fieldErrors.sourceOfFunds}
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
                            {data.sourceOfFunds === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other source of funds"
                                    value={data.sourceOfFundsOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('sourceOfFundsOther');
                                        onChange({ ...data, sourceOfFundsOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.sourceOfFundsOther}
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
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    // Clear field error when user makes a selection
                                    clearFieldError && clearFieldError('tradingAccountPurpose');
                                    // Clear the "other" text field if switching away from "OTHER"
                                    if (data.tradingAccountPurpose === 'OTHER' && newValue !== 'OTHER') {
                                        onChange({ ...data, tradingAccountPurpose: newValue, tradingAccountPurposeOther: '' });
                                    } else {
                                        onChange({ ...data, tradingAccountPurpose: newValue });
                                    }
                                }}
                                isInvalid={fieldErrors.tradingAccountPurpose}
                                required
                            >
                                <option value="">Select purpose</option>
                                <option value="HEDGING">Hedging</option>
                                <option value="SPECULATION">Speculation</option>
                                <option value="ARBITRAGE">Arbitrage</option>
                                <option value="INVESTMENT">Investment</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.tradingAccountPurpose === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other trading purpose"
                                    value={data.tradingAccountPurposeOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('tradingAccountPurposeOther');
                                        onChange({ ...data, tradingAccountPurposeOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.tradingAccountPurposeOther}
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

const AuthorizePersonStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
        
        // Clear field error for bank account field
        if (clearFieldError) {
            clearFieldError(`${field}_${index}`);
            clearFieldError(field); // Also clear the generic field error
        }
        
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
                            <Form.Label className="text-muted">Authorize Person Title <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonTitle || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonTitle');
                                    onChange({ ...data, authorizePersonTitle: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonTitle}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonFullName');
                                    onChange({ ...data, authorizePersonFullName: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonFullName}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Place of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter place of birth"
                                value={data.authorizePersonPlaceOfBirth || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonPlaceOfBirth');
                                    onChange({ ...data, authorizePersonPlaceOfBirth: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonPlaceOfBirth}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Date of Birth <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="date"
                                value={data.authorizePersonDateOfBirth || ''}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonDateOfBirth');
                                    onChange({ ...data, authorizePersonDateOfBirth: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonDateOfBirth}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Passport ID No <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter passport ID number"
                                value={data.authorizePersonPassportId || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonPassportId');
                                    onChange({ ...data, authorizePersonPassportId: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonPassportId}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Authorize Person Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={data.authorizePersonEmail || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonEmail');
                                    onChange({ ...data, authorizePersonEmail: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonEmail}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Gender <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonGender || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonGender');
                                    onChange({ ...data, authorizePersonGender: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonGender}
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
                            <Form.Label className="text-muted">Marital Status <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonMaritalStatus || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonMaritalStatus');
                                    onChange({ ...data, authorizePersonMaritalStatus: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonMaritalStatus}
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
                            <Form.Label className="text-muted">Citizen <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonCitizen || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonCitizen');
                                    onChange({ ...data, authorizePersonCitizen: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonCitizen}
                                required
                            >
                                <option value="">Select citizenship</option>
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
                            {data.authorizePersonCitizen === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other citizenship"
                                    value={data.authorizePersonCitizenOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonCitizenOther');
                                        onChange({ ...data, authorizePersonCitizenOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.authorizePersonCitizenOther}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Phone Number <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.authorizePersonCountryCode || ''}
                                        onChange={(e) => {
                                            const selectedCode = e.target.value;
                                            clearFieldError && clearFieldError('authorizePersonCountryCode');
                                            if (!selectedCode) {
                                                onChange({ ...data, authorizePersonCountryCode: selectedCode, authorizePersonPhoneNumber: '' });
                                            } else {
                                                onChange({ ...data, authorizePersonCountryCode: selectedCode, authorizePersonPhoneNumber: selectedCode + ' ' });
                                            }
                                        }}
                                        isInvalid={fieldErrors.authorizePersonCountryCode}
                                        required
                                    >
                                        <option value="">Select Country Code</option>
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
                                        placeholder="Enter telephone number"
                                        value={data.authorizePersonPhoneNumber || ''}
                                        isInvalid={fieldErrors.authorizePersonPhoneNumber}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            clearFieldError && clearFieldError('authorizePersonPhoneNumber');
                                            if (data.authorizePersonCountryCode) {
                                                if (!value.startsWith(data.authorizePersonCountryCode)) {
                                                    value = data.authorizePersonCountryCode + ' ' + value.replace(/^\+\d+\s?/, '');
                                                } else {
                                                    const numberPart = value.substring(data.authorizePersonCountryCode.length).trim();
                                                    const cleanNumber = numberPart.replace(/[^\d]/g, '');
                                                    value = data.authorizePersonCountryCode + (cleanNumber ? ' ' + cleanNumber : ' ');
                                                }
                                            }
                                            onChange({ ...data, authorizePersonPhoneNumber: value });
                                        }}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonStreetAddress');
                                    onChange({ ...data, authorizePersonStreetAddress: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonStreetAddress}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonCity');
                                    onChange({ ...data, authorizePersonCity: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonCity}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonPostalCode');
                                    onChange({ ...data, authorizePersonPostalCode: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonPostalCode}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonCountry || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonCountry');
                                    onChange({ ...data, authorizePersonCountry: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonCountry}
                                required
                            >
                                <option value="">Select country</option>
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
                            {data.authorizePersonCountry === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other country"
                                    value={data.authorizePersonCountryOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonCountryOther');
                                        onChange({ ...data, authorizePersonCountryOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.authorizePersonCountryOther}
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
                            <div className={`${fieldErrors.authorizePersonInvestmentExperience ? 'border border-danger rounded p-2' : ''}`}>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="investmentExperience"
                                    value="YES"
                                    checked={data.authorizePersonInvestmentExperience === 'YES'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonInvestmentExperience');
                                        onChange({ ...data, authorizePersonInvestmentExperience: e.target.value });
                                    }}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="investmentExperience"
                                    value="NO"
                                    checked={data.authorizePersonInvestmentExperience === 'NO'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonInvestmentExperience');
                                        onChange({ ...data, authorizePersonInvestmentExperience: e.target.value });
                                    }}
                                />
                            </div>
                            {data.authorizePersonInvestmentExperience === 'YES' && (
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Please describe your investment experience, including types of investments, duration, and any relevant qualifications or certifications you may have."
                                    value={data.authorizePersonInvestmentExperienceDetails || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonInvestmentExperienceDetails');
                                        onChange({ ...data, authorizePersonInvestmentExperienceDetails: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.authorizePersonInvestmentExperienceDetails}
                                    className="mt-3"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Do you have any family who working in BAPPEBTI / Bursa Berjangka / Kliring Berjangka? <span className="text-danger">*</span></Form.Label>
                            <div className={`${fieldErrors.authorizePersonFamilyInBappebti ? 'border border-danger rounded p-2' : ''}`}>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="familyInBappebti"
                                    value="YES"
                                    checked={data.authorizePersonFamilyInBappebti === 'YES'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonFamilyInBappebti');
                                        onChange({ ...data, authorizePersonFamilyInBappebti: e.target.value });
                                    }}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="familyInBappebti"
                                    value="NO"
                                    checked={data.authorizePersonFamilyInBappebti === 'NO'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonFamilyInBappebti');
                                        onChange({ ...data, authorizePersonFamilyInBappebti: e.target.value });
                                    }}
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Have you declared bankrupt by the Court? <span className="text-danger">*</span></Form.Label>
                            <div className={`${fieldErrors.authorizePersonDeclaredBankrupt ? 'border border-danger rounded p-2' : ''}`}>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="declaredBankrupt"
                                    value="YES"
                                    checked={data.authorizePersonDeclaredBankrupt === 'YES'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonDeclaredBankrupt');
                                        onChange({ ...data, authorizePersonDeclaredBankrupt: e.target.value });
                                    }}
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="declaredBankrupt"
                                    value="NO"
                                    checked={data.authorizePersonDeclaredBankrupt === 'NO'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonDeclaredBankrupt');
                                        onChange({ ...data, authorizePersonDeclaredBankrupt: e.target.value });
                                    }}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonCompanyName');
                                    onChange({ ...data, authorizePersonCompanyName: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonCompanyName}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonBusinessNature');
                                    onChange({ ...data, authorizePersonBusinessNature: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonBusinessNature}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonJobPosition');
                                    onChange({ ...data, authorizePersonJobPosition: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonJobPosition}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonOfficeAddress');
                                    onChange({ ...data, authorizePersonOfficeAddress: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonOfficeAddress}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonOfficeCity');
                                    onChange({ ...data, authorizePersonOfficeCity: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonOfficeCity}
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
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonOfficePostalCode');
                                    onChange({ ...data, authorizePersonOfficePostalCode: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonOfficePostalCode}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonOfficeCountry || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('authorizePersonOfficeCountry');
                                    onChange({ ...data, authorizePersonOfficeCountry: e.target.value });
                                }}
                                isInvalid={fieldErrors.authorizePersonOfficeCountry}
                                required
                            >
                                <option value="">Select country</option>
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
                            {data.authorizePersonOfficeCountry === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other country"
                                    value={data.authorizePersonOfficeCountryOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonOfficeCountryOther');
                                        onChange({ ...data, authorizePersonOfficeCountryOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.authorizePersonOfficeCountryOther}
                                    className="mt-2"
                                    required
                                />
                            )}
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
                            <div className="d-flex justify-content-between align-items-center">
                                <Form.Label className="text-muted mb-0">
                                    Authorize Person Passport <span className="text-danger">*</span>
                                    {data.authorizePersonPassport && (
                                        <span className="text-success ms-2">
                                            <i className="mdi mdi-check-circle"></i> Uploaded: {data.authorizePersonPassport.name}
                                        </span>
                                    )}
                                </Form.Label>
                                {data.authorizePersonPassport && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => {
                                            // Clear the file input
                                            const fileInput = document.querySelector('input[type="file"][accept*=".pdf"]');
                                            if (fileInput) fileInput.value = '';
                                            onChange({ ...data, authorizePersonPassport: null });
                                        }}
                                        title="Remove file"
                                    >
                                        <i className="mdi mdi-delete"></i> Remove
                                    </button>
                                )}
                            </div>
                            
                            {/* Show file input when no file uploaded */}
                            {!data.authorizePersonPassport && (
                                <Form.Control 
                                    type="file" 
                                    accept=".pdf,.jpg,.jpeg,.png" 
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            clearFieldError && clearFieldError('authorizePersonPassport');
                                            onChange({ ...data, authorizePersonPassport: file });
                                        }
                                    }}
                                    isInvalid={fieldErrors.authorizePersonPassport}
                                    className="mt-2"
                                    required 
                                />
                            )}
                            
                            {/* Show custom file display when file uploaded */}
                            {data.authorizePersonPassport && (
                                <div className="mt-2">
                                    <div className={`form-control d-flex align-items-center ${fieldErrors.authorizePersonPassport ? 'is-invalid' : ''}`}>
                                        <i className="mdi mdi-file-document me-2 text-primary"></i>
                                        <span className="flex-grow-1">{data.authorizePersonPassport.name}</span>
                                    </div>
                                </div>
                            )}
                            
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
                                        <Form.Label className="text-muted">Bank Name <span className="text-danger">*</span></Form.Label>
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
                                        <Form.Label className="text-muted">Account Name <span className="text-danger">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter account holder name"
                                            value={account.accountName}
                                            onChange={(e) => updateBankAccount(index, 'accountName', e.target.value)}
                                            isInvalid={fieldErrors.accountName || fieldErrors[`accountName_${index}`]}
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
                                            isInvalid={fieldErrors.bankAddress || fieldErrors[`bankAddress_${index}`]}
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
                                            isInvalid={fieldErrors.bankCity || fieldErrors[`bankCity_${index}`]}
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
                                            isInvalid={fieldErrors.bankCountry || fieldErrors[`bankCountry_${index}`]}
                                            required
                                        >
                                            <option value="">Select country</option>
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
                                        {account.bankCountry === 'OTHER' && (
                                            <Form.Control
                                                type="text"
                                                placeholder="Please specify other country"
                                                value={account.bankCountryOther || ''}
                                                onChange={(e) => updateBankAccount(index, 'bankCountryOther', e.target.value)}
                                                isInvalid={fieldErrors.bankCountryOther || fieldErrors[`bankCountryOther_${index}`]}
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
                                            isInvalid={fieldErrors.swiftCode || fieldErrors[`swiftCode_${index}`]}
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
                                            isInvalid={fieldErrors.accountNo || fieldErrors[`accountNo_${index}`]}
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

const DocumentUploadStep = ({ data = {}, onChange, requirements, fieldErrors = {}, clearFieldError }) => {
    const [uploadedDocs, setUploadedDocs] = useState(data.uploadedDocuments || {});
    const [uploadedFiles, setUploadedFiles] = useState(data.uploadedFiles || {});
    const fileInputRefs = useRef({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFileUpload = (categoryIndex, docIndex, file) => {
        const docKey = `${categoryIndex}_${docIndex}`;
        const newUploadedDocs = {
            ...uploadedDocs,
            [docKey]: file ? file.name : null
        };
        
        const newUploadedFiles = {
            ...uploadedFiles,
            [docKey]: file || null
        };
        
        // Clear field error when file is uploaded
        if (file && clearFieldError) {
            clearFieldError(`document_${docKey}`);
        }
        
        setUploadedDocs(newUploadedDocs);
        setUploadedFiles(newUploadedFiles);
        
        // Map document uploads to backend field names
        const documentMappingByIndex = {
            '0_0': 'certificateIncorporation',      // Certificate of Incorporation
            '0_1': 'boardResolution',              // Board of Resolution  
            '0_2': 'addressProof',                 // Address Proof
            '1_0': 'bankStatement',                // Bank Statement
            '2_0': 'beneficialOwnerPassport',      // Beneficial Owner Passport
            '3_0': 'managementStructure',          // Management Structure
            '3_1': 'ownershipStructure'            // Ownership Structure
        };
        
        // Update parent component with both document names and File objects
        const updatedData = {
            ...data,
            uploadedDocuments: newUploadedDocs,
            uploadedFiles: newUploadedFiles,
            documentsUploaded: Object.values(newUploadedDocs).every(doc => doc !== null && doc !== undefined)
        };
        
        // Add the specific document file to the data using backend field names
        if (documentMappingByIndex[docKey] && file) {
            updatedData[documentMappingByIndex[docKey]] = file;
        }
        
        onChange(updatedData);
    };

    const handleFileRemove = (categoryIndex, docIndex) => {
        const docKey = `${categoryIndex}_${docIndex}`;
        const newUploadedDocs = {
            ...uploadedDocs,
            [docKey]: null
        };
        
        const newUploadedFiles = {
            ...uploadedFiles,
            [docKey]: null
        };
        
        // Clear the file input value
        if (fileInputRefs.current[docKey]) {
            fileInputRefs.current[docKey].value = '';
        }
        
        setUploadedDocs(newUploadedDocs);
        setUploadedFiles(newUploadedFiles);
        
        // Map document uploads to backend field names
        const documentMappingByIndex = {
            '0_0': 'certificateIncorporation',      // Certificate of Incorporation
            '0_1': 'boardResolution',              // Board of Resolution  
            '0_2': 'addressProof',                 // Address Proof
            '1_0': 'bankStatement',                // Bank Statement
            '2_0': 'beneficialOwnerPassport',      // Beneficial Owner Passport
            '3_0': 'managementStructure',          // Management Structure
            '3_1': 'ownershipStructure'            // Ownership Structure
        };
        
        // Update parent component
        const updatedData = {
            ...data,
            uploadedDocuments: newUploadedDocs,
            uploadedFiles: newUploadedFiles,
            documentsUploaded: Object.values(newUploadedDocs).every(doc => doc !== null && doc !== undefined)
        };
        
        // Remove the specific document file from the data
        if (documentMappingByIndex[docKey]) {
            updatedData[documentMappingByIndex[docKey]] = null;
        }
        
        onChange(updatedData);
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
                        <h6 className="mb-0 text-primary">{category.category}</h6>
                    </Card.Header>
                    <Card.Body>
                        {category.documents.map((doc, docIndex) => {
                            const docKey = `${categoryIndex}_${docIndex}`;
                            const isUploaded = uploadedDocs[docKey];
                            
                            return (
                                <Form.Group key={docIndex} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Form.Label className="text-muted mb-0">
                                            {doc} <span className="text-danger">*</span>
                                            {isUploaded && (
                                                <span className="text-success ms-2">
                                                    <i className="mdi mdi-check-circle"></i> Uploaded: {isUploaded}
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
                                                <span className="flex-grow-1">{isUploaded}</span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Form.Text className="text-muted">
                                        Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG 
                                    </Form.Text>
                                </Form.Group>
                            );
                        })}
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

const ReviewStep = ({ data = {}, onChange, allData, fieldErrors = {}, clearFieldError }) => {
    const [agreements, setAgreements] = useState({
        companyProfile: data.companyProfile || false,
        statementSimulation: data.statementSimulation || false,
        statementExperience: data.statementExperience || false,
        disclosureStatement: data.disclosureStatement || false,
        accountOpening: data.accountOpening || false,
        riskDisclosure: data.riskDisclosure || false,
        mandateAgreement: data.mandateAgreement || false,
        tradingRules: data.tradingRules || false,
        personalAccessPassword: data.personalAccessPassword || false
    });

    const handleAgreementChange = (field, value) => {
        // Clear field error when user interacts with checkbox
        if (clearFieldError) {
            clearFieldError(field);
        }
        
        const newAgreements = { ...agreements, [field]: value };
        setAgreements(newAgreements);
        
        // Update parent component with agreement data
        onChange({
            ...data,
            ...newAgreements
        });
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
                                isInvalid={fieldErrors.companyProfile}
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
                                isInvalid={fieldErrors.statementSimulation}
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
                                isInvalid={fieldErrors.statementExperience}
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
                                isInvalid={fieldErrors.disclosureStatement}
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
                                isInvalid={fieldErrors.accountOpening}
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
                                isInvalid={fieldErrors.riskDisclosure}
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
                                isInvalid={fieldErrors.mandateAgreement}
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
                                isInvalid={fieldErrors.tradingRules}
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
                                isInvalid={fieldErrors.personalAccessPassword}
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