import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup, Button } from 'react-bootstrap';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { useNotificationContext } from '../../../common/context/useNotificationContext';
import AuthService from '../../../common/api/auth';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';

const RegulatedCompanyForm = () => {
    const [formData, setFormData] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const { showNotification } = useNotificationContext();

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
                return <EmailRegistrationStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 2:
                return <CompanyDetailsStep data={stepData} onChange={updateFormData} demoAccountNo={allFormData.step_1?.demoAccountNo} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 3:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 4:
                return <AuthorizePersonStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 5:
                return <PassportUploadStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 6:
                return <DocumentAgreementsStep data={stepData} onChange={updateFormData} onSubmit={handleSubmit} allData={allFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
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
        
        // Define required documents and their expected positions
        const requiredDocuments = [
            { name: 'Certificate of Incorporation', categoryIndex: 0, docIndex: 0 },
            { name: 'Board of Resolution', categoryIndex: 0, docIndex: 1 },
            { name: 'Bank Statement', categoryIndex: 1, docIndex: 0 },
            { name: 'Address Proof', categoryIndex: 1, docIndex: 1 },
            { name: 'Management Structure', categoryIndex: 2, docIndex: 0 },
            { name: 'Ownership Structure', categoryIndex: 2, docIndex: 1 },
            { name: 'Beneficial Owner Passport', categoryIndex: 2, docIndex: 2 }
        ];
        
        // Check each required document individually
        requiredDocuments.forEach(doc => {
            const docKey = `${doc.categoryIndex}_${doc.docIndex}`;
            if (!data.uploadedDocuments || !data.uploadedDocuments[docKey]) {
                errors.push(`Please upload ${doc.name}`);
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
        
        // Check if authorize person passport document is uploaded
        if (!data.uploadedDocuments || !data.uploadedDocuments.authorizePersonPassport) {
            errors.push('Please upload Authorize Person Passport');
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
        
        // Create field error mapping for red border styling
        const newFieldErrors = {};
        if (!validation.isValid) {
            // Map validation errors to specific field names for styling
            validation.errors.forEach(error => {
                // Email step errors
                if (error.includes('email address')) {
                    newFieldErrors.email = true;
                }
                if (error.includes('Demo account')) {
                    newFieldErrors.demoAccountNo = true;
                }
                
                // Company details step errors
                if (error.includes('Company Registration Name')) {
                    newFieldErrors.companyRegistrationName = true;
                }
                if (error.includes('Company License Number')) {
                    newFieldErrors.companyLicenseNo = true;
                }
                if (error.includes('Nature of Business')) {
                    newFieldErrors.natureOfBusiness = true;
                }
                if (error.includes('Company Legal Form')) {
                    newFieldErrors.companyLegalForm = true;
                }
                if (error.includes('other legal form')) {
                    newFieldErrors.companyLegalFormOther = true;
                }
                if (error.includes('Street Address')) {
                    newFieldErrors.streetAddress = true;
                }
                if (error.includes('City')) {
                    newFieldErrors.city = true;
                }
                if (error.includes('Postal/Zip Code')) {
                    newFieldErrors.postalCode = true;
                }
                if (error.includes('Country')) {
                    newFieldErrors.country = true;
                }
                if (error.includes('other country')) {
                    newFieldErrors.countryOther = true;
                }
                if (error.includes('Place of Establishment')) {
                    newFieldErrors.placeOfEstablishment = true;
                }
                if (error.includes('Date of Establishment')) {
                    newFieldErrors.dateOfEstablishment = true;
                }
                if (error.includes('Country Code')) {
                    newFieldErrors.countryCode = true;
                }
                if (error.includes('Office Telephone Number')) {
                    newFieldErrors.officeTelephoneNo = true;
                }
                if (error.includes('Beneficial Owner Name')) {
                    newFieldErrors.beneficialOwnerName = true;
                }
                if (error.includes('Beneficial Owner Passport Number')) {
                    newFieldErrors.beneficialOwnerPassportNo = true;
                }
                if (error.includes('Source of Funds')) {
                    newFieldErrors.sourceOfFunds = true;
                }
                if (error.includes('other source of funds')) {
                    newFieldErrors.sourceOfFundsOther = true;
                }
                if (error.includes('Trading Account Purpose')) {
                    newFieldErrors.tradingAccountPurpose = true;
                }
                if (error.includes('other trading account purpose')) {
                    newFieldErrors.tradingAccountPurposeOther = true;
                }
                
                // Document upload step errors
                if (error.includes('Please upload Certificate of Incorporation')) {
                    newFieldErrors['document_0_0'] = true;
                }
                if (error.includes('Please upload Board of Resolution')) {
                    newFieldErrors['document_0_1'] = true;
                }
                if (error.includes('Please upload Bank Statement')) {
                    newFieldErrors['document_1_0'] = true;
                }
                if (error.includes('Please upload Address Proof')) {
                    newFieldErrors['document_1_1'] = true;
                }
                if (error.includes('Please upload Management Structure')) {
                    newFieldErrors['document_2_0'] = true;
                }
                if (error.includes('Please upload Ownership Structure')) {
                    newFieldErrors['document_2_1'] = true;
                }
                if (error.includes('Please upload Beneficial Owner Passport')) {
                    newFieldErrors['document_2_2'] = true;
                }
                
                // Passport upload step errors
                if (error.includes('Please upload Authorize Person Passport')) {
                    newFieldErrors['document_authorizePersonPassport'] = true;
                }
                
                // Authorize Person step errors
                if (error.includes('Authorize Person Title')) {
                    newFieldErrors.authorizePersonTitle = true;
                }
                if (error.includes('Authorize Person Full Name')) {
                    newFieldErrors.authorizePersonFullName = true;
                }
                if (error.includes('Place of Birth')) {
                    newFieldErrors.authorizePersonPlaceOfBirth = true;
                }
                if (error.includes('Date of Birth')) {
                    newFieldErrors.authorizePersonDateOfBirth = true;
                }
                if (error.includes('Passport ID Number')) {
                    newFieldErrors.authorizePersonPassportId = true;
                }
                if (error.includes('Email is required') || (error.includes('Email') && error.includes('Authorize Person'))) {
                    newFieldErrors.authorizePersonEmail = true;
                }
                if (error.includes('Gender')) {
                    newFieldErrors.authorizePersonGender = true;
                }
                if (error.includes('Marital Status')) {
                    newFieldErrors.authorizePersonMaritalStatus = true;
                }
                if (error.includes('Citizenship')) {
                    newFieldErrors.authorizePersonCitizen = true;
                }
                if (error.includes('other citizenship')) {
                    newFieldErrors.authorizePersonCitizenOther = true;
                }
                if (error.includes('Country Code')) {
                    newFieldErrors.authorizePersonCountryCode = true;
                }
                if (error.includes('Phone Number')) {
                    newFieldErrors.authorizePersonPhoneNumber = true;
                }
                if ((error.includes('Street Address is required') || error.includes('Street Address')) && !error.includes('Office')) {
                    newFieldErrors.authorizePersonStreetAddress = true;
                }
                if ((error.includes('City is required') || error.includes('City')) && !error.includes('Office')) {
                    newFieldErrors.authorizePersonCity = true;
                }
                if ((error.includes('Postal Code is required') || error.includes('Postal Code')) && !error.includes('Office')) {
                    newFieldErrors.authorizePersonPostalCode = true;
                }
                if ((error.includes('Country is required') || error.includes('Country')) && !error.includes('Office') && !error.includes('Code')) {
                    newFieldErrors.authorizePersonCountry = true;
                }
                if (error.includes('other country') && !error.includes('Office')) {
                    newFieldErrors.authorizePersonCountryOther = true;
                }
                if (error.includes('Investment Experience')) {
                    newFieldErrors.authorizePersonInvestmentExperience = true;
                }
                if (error.includes('investment experience')) {
                    newFieldErrors.authorizePersonInvestmentExperienceDetails = true;
                }
                if (error.includes('Family in BAPPEBTI')) {
                    newFieldErrors.authorizePersonFamilyInBappebti = true;
                }
                if (error.includes('Bankruptcy Declaration')) {
                    newFieldErrors.authorizePersonDeclaredBankrupt = true;
                }
                if (error.includes('Company Name is required') || error.includes('Company Name')) {
                    newFieldErrors.authorizePersonCompanyName = true;
                }
                if (error.includes('Nature of Business is required') || (error.includes('Nature of Business') && error.includes('Authorize Person'))) {
                    newFieldErrors.authorizePersonBusinessNature = true;
                }
                if (error.includes('Job Position is required') || error.includes('Job Position')) {
                    newFieldErrors.authorizePersonJobPosition = true;
                }
                if (error.includes('Office Address is required') || error.includes('Office Address')) {
                    newFieldErrors.authorizePersonOfficeAddress = true;
                }
                if (error.includes('Office City is required') || error.includes('Office City')) {
                    newFieldErrors.authorizePersonOfficeCity = true;
                }
                if (error.includes('Office Postal Code is required') || error.includes('Office Postal Code')) {
                    newFieldErrors.authorizePersonOfficePostalCode = true;
                }
                if (error.includes('Office Country is required') || error.includes('Office Country')) {
                    newFieldErrors.authorizePersonOfficeCountry = true;
                }
                if (error.includes('other office country')) {
                    newFieldErrors.authorizePersonOfficeCountryOther = true;
                }
                
                // Bank Account errors - Handle indexed bank account errors
                const bankFieldMappings = [
                    { pattern: /Bank (\d+) - Bank Name is required/, field: 'bankName' },
                    { pattern: /Bank (\d+) - Account Name is required/, field: 'accountName' },
                    { pattern: /Bank (\d+) - Bank Address is required/, field: 'bankAddress' },
                    { pattern: /Bank (\d+) - Bank City is required/, field: 'bankCity' },
                    { pattern: /Bank (\d+) - Bank Country is required/, field: 'bankCountry' },
                    { pattern: /Bank (\d+) - SWIFT Code is required/, field: 'swiftCode' },
                    { pattern: /Bank (\d+) - Account Number is required/, field: 'accountNo' },
                    { pattern: /Bank (\d+) - Please specify other country/, field: 'bankCountryOther' }
                ];
                
                bankFieldMappings.forEach(({ pattern, field }) => {
                    const match = error.match(pattern);
                    if (match) {
                        const index = parseInt(match[1]) - 1;
                        newFieldErrors[`${field}_${index}`] = true;
                    }
                });
                
                // Document Agreements step errors
                const agreementMappings = [
                    { pattern: /Please agree to Company Profile/, field: 'companyProfile' },
                    { pattern: /Please agree to Statement of Having Simulation/, field: 'statementSimulation' },
                    { pattern: /Please agree to Statement of Having Experience/, field: 'statementExperience' },
                    { pattern: /Please agree to Disclosure Statement/, field: 'disclosureStatement' },
                    { pattern: /Please agree to Account Opening Application/, field: 'accountOpeningApplication' },
                    { pattern: /Please agree to Risk Disclosure/, field: 'riskDisclosure' },
                    { pattern: /Please agree to Mandate Agreement/, field: 'mandateAgreement' },
                    { pattern: /Please agree to Trading Rules/, field: 'tradingRules' },
                    { pattern: /Please agree to Personal Access Password/, field: 'personalAccessPassword' }
                ];
                
                agreementMappings.forEach(({ pattern, field }) => {
                    if (error.match(pattern)) {
                        newFieldErrors[field] = true;
                    }
                });
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

const EmailRegistrationStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [email, setEmail] = useState(data.email || '');
    const [demoAccountNo, setDemoAccountNo] = useState(data.demoAccountNo || '');
    const [emailValid, setEmailValid] = useState(true);

    const handleEmailChange = (field, value) => {
        const newData = { ...data, [field]: value };
        if (field === 'email') {
            setEmail(value);
            // Validate email format
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            setEmailValid(isValidEmail);
            // Clear field error when user starts typing
            if (clearFieldError && fieldErrors.email) {
                clearFieldError('email');
            }
        }
        if (field === 'demoAccountNo') {
            setDemoAccountNo(value);
            // Clear field error when user makes selection
            if (clearFieldError && fieldErrors.demoAccountNo) {
                clearFieldError('demoAccountNo');
            }
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

const CompanyDetailsStep = ({ data = {}, onChange, demoAccountNo, fieldErrors = {}, clearFieldError }) => {
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
                            <Form.Label className="text-muted">Company License Number <span className="text-danger">*</span></Form.Label>
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
                                    const newValue = e.target.value;
                                    clearFieldError && clearFieldError('companyLegalForm');
                                    // Clear the "other" text field when switching to "OTHER" or away from "OTHER"
                                    if (newValue === 'OTHER' || (data.companyLegalForm === 'OTHER' && newValue !== 'OTHER')) {
                                        onChange({ ...data, companyLegalForm: newValue, companyLegalFormOther: '' });
                                    } else {
                                        onChange({ ...data, companyLegalForm: newValue });
                                    }
                                }}
                                isInvalid={fieldErrors.companyLegalForm}
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
                                    const newValue = e.target.value;
                                    clearFieldError && clearFieldError('country');
                                    // Clear the "other" text field when switching to "OTHER" or away from "OTHER"
                                    if (newValue === 'OTHER' || (data.country === 'OTHER' && newValue !== 'OTHER')) {
                                        onChange({ ...data, country: newValue, countryOther: '' });
                                    } else {
                                        onChange({ ...data, country: newValue });
                                    }
                                }}
                                isInvalid={fieldErrors.country}
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
                                    // Clear the "other" text field when switching to "OTHER" or away from "OTHER"
                                    if (newValue === 'OTHER' || (data.sourceOfFunds === 'OTHER' && newValue !== 'OTHER')) {
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
                                    // Clear the "other" text field when switching to "OTHER" or away from "OTHER"
                                    if (newValue === 'OTHER' || (data.tradingAccountPurpose === 'OTHER' && newValue !== 'OTHER')) {
                                        onChange({ ...data, tradingAccountPurpose: newValue, tradingAccountPurposeOther: '' });
                                    } else {
                                        onChange({ ...data, tradingAccountPurpose: newValue });
                                    }
                                }}
                                isInvalid={fieldErrors.tradingAccountPurpose}
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

const DocumentUploadStep = ({ data = {}, onChange, requirements, fieldErrors = {}, clearFieldError }) => {
    const [uploadedDocuments, setUploadedDocuments] = useState(data.uploadedDocuments || {});
    const fileInputRefs = useRef({});

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

    const handleFileUpload = (categoryIndex, docIndex, file) => {
        if (!file) return;
        
        const docKey = `${categoryIndex}_${docIndex}`;
        const updatedDocs = {
            ...uploadedDocuments,
            [docKey]: file.name
        };
        setUploadedDocuments(updatedDocs);
        
        // Clear validation error for this document
        clearFieldError && clearFieldError(`document_${docKey}`);
        
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
        
        // Check if all required documents are uploaded
        const allDocsUploaded = requiredDocuments.every(doc => {
            return requirements.some(category => 
                category.documents.some((categoryDoc, index) => {
                    if (categoryDoc === doc) {
                        const categoryIdx = requirements.indexOf(category);
                        const key = `${categoryIdx}_${index}`;
                        return updatedDocs[key];
                    }
                    return false;
                })
            );
        });
        
        onChange({ 
            ...data, 
            uploadedDocuments: updatedDocs,
            documentsUploaded: allDocsUploaded
        });
    };

    const handleFileRemove = (categoryIndex, docIndex) => {
        const docKey = `${categoryIndex}_${docIndex}`;
        const updatedDocs = { ...uploadedDocuments };
        delete updatedDocs[docKey];
        setUploadedDocuments(updatedDocs);
        
        // Clear the file input
        if (fileInputRefs.current[docKey]) {
            fileInputRefs.current[docKey].value = '';
        }
        
        // Clear validation error for this document
        clearFieldError && clearFieldError(`document_${docKey}`);
        
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
            return requirements.some(category => 
                category.documents.some((categoryDoc, index) => {
                    if (categoryDoc === doc) {
                        const categoryIdx = requirements.indexOf(category);
                        const key = `${categoryIdx}_${index}`;
                        return updatedDocs[key];
                    }
                    return false;
                })
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

            {requirements.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-light border-0">
                        <h6 className="mb-0 text-primary">{category.category}</h6>
                            </Card.Header>
                            <Card.Body>
                        {category.documents.map((doc, docIndex) => {
                            const docKey = `${categoryIndex}_${docIndex}`;
                            const isUploaded = uploadedDocuments[docKey];
                            
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

const AuthorizePersonStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [bankAccounts, setBankAccounts] = useState(data.bankAccounts || [{ bankName: '', bankAddress: '', bankCity: '', bankPostalCode: '', bankCountry: '', bankCountryOther: '', swiftCode: '', accountNo: '', accountName: '' }]);
    const [emailValid, setEmailValid] = useState(true);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // Sync bank accounts with parent data
    useEffect(() => {
        if (data.bankAccounts && JSON.stringify(data.bankAccounts) !== JSON.stringify(bankAccounts)) {
            setBankAccounts(data.bankAccounts);
        }
    }, [data.bankAccounts]);

    // Ensure parent data always has current bank accounts
    useEffect(() => {
        if (JSON.stringify(data.bankAccounts) !== JSON.stringify(bankAccounts)) {
            onChange({ ...data, bankAccounts });
        }
    }, [bankAccounts, data, onChange]);

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
                            <Form.Label className="text-muted">Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={data.authorizePersonEmail || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // Validate email format
                                    const isValidEmail = value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                                    setEmailValid(isValidEmail);
                                    // Clear field error when user starts typing
                                    clearFieldError && clearFieldError('authorizePersonEmail');
                                    onChange({ ...data, authorizePersonEmail: value });
                                }}
                                isInvalid={fieldErrors.authorizePersonEmail || (data.authorizePersonEmail && !emailValid)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
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
                </Row>

                <Row>
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
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Citizen <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.authorizePersonCitizen || ''}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    clearFieldError && clearFieldError('authorizePersonCitizen');
                                    // Clear the "other" text field when switching to "OTHER" or away from "OTHER"
                                    if (newValue === 'OTHER' || (data.authorizePersonCitizen === 'OTHER' && newValue !== 'OTHER')) {
                                        onChange({ ...data, authorizePersonCitizen: newValue, authorizePersonCitizenOther: '' });
                                    } else {
                                        onChange({ ...data, authorizePersonCitizen: newValue });
                                    }
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
                    <Col md={12}>
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
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Phone Number <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={3}>
                                    <Form.Select
                                        value={data.authorizePersonCountryCode || ''}
                                        isInvalid={fieldErrors.authorizePersonCountryCode}
                                        onChange={(e) => {
                                            const selectedCode = e.target.value;
                                            // Clear field errors when user makes a selection
                                            clearFieldError && clearFieldError('authorizePersonCountryCode');
                                            clearFieldError && clearFieldError('authorizePersonPhoneNumber');
                                            
                                            // If no country is selected (back to "Select Country Code"), clear the phone number
                                            if (!selectedCode) {
                                                onChange({ 
                                                    ...data, 
                                                    authorizePersonCountryCode: selectedCode,
                                                    authorizePersonPhoneNumber: ''
                                                });
                                            }
                                            // If a country is selected, set the phone number to just the country code
                                            else {
                                                onChange({ 
                                                    ...data, 
                                                    authorizePersonCountryCode: selectedCode,
                                                    authorizePersonPhoneNumber: selectedCode + ' '
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
                                <Col md={9}>
                                    <Form.Control
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={data.authorizePersonPhoneNumber || ''}
                                        isInvalid={fieldErrors.authorizePersonPhoneNumber}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            
                                            // Clear field error when user starts typing
                                            clearFieldError && clearFieldError('authorizePersonPhoneNumber');
                                            
                                            // If there's a country code, ensure it stays at the beginning
                                            if (data.authorizePersonCountryCode) {
                                                if (!value.startsWith(data.authorizePersonCountryCode)) {
                                                    // If user deleted the country code, restore it
                                                    value = data.authorizePersonCountryCode + ' ' + value.replace(/^\+\d+\s?/, '');
                                                } else {
                                                    // Extract the number part after country code
                                                    const numberPart = value.substring(data.authorizePersonCountryCode.length).trim();
                                                    // Only allow numbers in the phone number part
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
                            <div className={`${fieldErrors.authorizePersonInvestmentExperience ? 'border border-danger rounded p-2' : ''}`}>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="investmentExperience"
                                    value="YES"
                                    checked={data.authorizePersonInvestmentExperience === 'YES'}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        clearFieldError && clearFieldError('authorizePersonInvestmentExperience');
                                        // Clear the details field when switching to "YES" or away from "YES"
                                        if (newValue === 'YES' || (data.authorizePersonInvestmentExperience === 'YES' && newValue !== 'YES')) {
                                            onChange({ ...data, authorizePersonInvestmentExperience: newValue, authorizePersonInvestmentExperienceDetails: '' });
                                        } else {
                                            onChange({ ...data, authorizePersonInvestmentExperience: newValue });
                                        }
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
                                        const newValue = e.target.value;
                                        clearFieldError && clearFieldError('authorizePersonInvestmentExperience');
                                        // Clear the details field when switching to "NO" or away from "YES"
                                        if (newValue === 'NO' || (data.authorizePersonInvestmentExperience === 'YES' && newValue !== 'YES')) {
                                            onChange({ ...data, authorizePersonInvestmentExperience: newValue, authorizePersonInvestmentExperienceDetails: '' });
                                        } else {
                                            onChange({ ...data, authorizePersonInvestmentExperience: newValue });
                                        }
                                    }}
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
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('authorizePersonInvestmentExperienceDetails');
                                        onChange({ ...data, authorizePersonInvestmentExperienceDetails: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.authorizePersonInvestmentExperienceDetails}
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
                            <Form.Label className="text-muted">Authorize Person Country <span className="text-danger">*</span></Form.Label>
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
                                            isInvalid={fieldErrors.bankName || fieldErrors[`bankName_${index}`]}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('bankName');
                                                clearFieldError && clearFieldError(`bankName_${index}`);
                                                updateBankAccount(index, 'bankName', e.target.value);
                                            }}
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
                                            isInvalid={fieldErrors.accountName || fieldErrors[`accountName_${index}`]}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('accountName');
                                                clearFieldError && clearFieldError(`accountName_${index}`);
                                                updateBankAccount(index, 'accountName', e.target.value);
                                            }}
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
                                            isInvalid={fieldErrors.bankAddress || fieldErrors[`bankAddress_${index}`]}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('bankAddress');
                                                clearFieldError && clearFieldError(`bankAddress_${index}`);
                                                updateBankAccount(index, 'bankAddress', e.target.value);
                                            }}
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
                                            isInvalid={fieldErrors.bankCity || fieldErrors[`bankCity_${index}`]}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('bankCity');
                                                clearFieldError && clearFieldError(`bankCity_${index}`);
                                                updateBankAccount(index, 'bankCity', e.target.value);
                                            }}
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
                                            isInvalid={fieldErrors.bankCountry || fieldErrors[`bankCountry_${index}`]}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('bankCountry');
                                                clearFieldError && clearFieldError(`bankCountry_${index}`);
                                                updateBankAccount(index, 'bankCountry', e.target.value);
                                            }}
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
                                                isInvalid={fieldErrors.bankCountryOther || fieldErrors[`bankCountryOther_${index}`]}
                                                onChange={(e) => {
                                                    clearFieldError && clearFieldError('bankCountryOther');
                                                    clearFieldError && clearFieldError(`bankCountryOther_${index}`);
                                                    updateBankAccount(index, 'bankCountryOther', e.target.value);
                                                }}
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
                                            isInvalid={fieldErrors.swiftCode || fieldErrors[`swiftCode_${index}`]}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('swiftCode');
                                                clearFieldError && clearFieldError(`swiftCode_${index}`);
                                                updateBankAccount(index, 'swiftCode', e.target.value);
                                            }}
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
                                            isInvalid={fieldErrors.accountNo || fieldErrors[`accountNo_${index}`]}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('accountNo');
                                                clearFieldError && clearFieldError(`accountNo_${index}`);
                                                updateBankAccount(index, 'accountNo', e.target.value);
                                            }}
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

const PassportUploadStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [uploadedDocuments, setUploadedDocuments] = useState(data.uploadedDocuments || {});
    const fileInputRefs = useRef({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleFileUpload = (file) => {
        if (!file) return;
        
        const docKey = 'authorizePersonPassport';
        const updatedDocs = {
            ...uploadedDocuments,
            [docKey]: file.name
        };
        setUploadedDocuments(updatedDocs);
        
        // Clear validation error for this document
        clearFieldError && clearFieldError(`document_${docKey}`);
        
            onChange({ 
                ...data, 
            uploadedDocuments: updatedDocs,
                passportDocumentsUploaded: true
            });
    };

    const handleFileRemove = () => {
        const docKey = 'authorizePersonPassport';
        const updatedDocs = { ...uploadedDocuments };
        delete updatedDocs[docKey];
        setUploadedDocuments(updatedDocs);
        
        // Clear the file input
        if (fileInputRefs.current[docKey]) {
            fileInputRefs.current[docKey].value = '';
        }
        
        // Clear validation error for this document
        clearFieldError && clearFieldError(`document_${docKey}`);
        
        onChange({ 
            ...data, 
            uploadedDocuments: updatedDocs,
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

            <Card className="mb-4 border-0 shadow-sm">
                <Card.Header className="bg-light border-0">
                    <h6 className="mb-0 text-primary">Authorize Person Passport</h6>
                </Card.Header>
                <Card.Body>
                    <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <Form.Label className="text-muted mb-0">
                                Authorize Person Passport <span className="text-danger">*</span>
                                {uploadedDocuments.authorizePersonPassport && (
                                    <span className="text-success ms-2">
                                        <i className="mdi mdi-check-circle"></i> Uploaded: {uploadedDocuments.authorizePersonPassport}
                                    </span>
                                )}
                            </Form.Label>
                            {uploadedDocuments.authorizePersonPassport && (
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={handleFileRemove}
                                    title="Remove file"
                                >
                                    <i className="mdi mdi-delete"></i> Remove
                                </button>
                            )}
                        </div>
                        
                        {/* Show file input when no file uploaded */}
                        {!uploadedDocuments.authorizePersonPassport && (
                        <Form.Control 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png" 
                                onChange={(e) => handleFileUpload(e.target.files[0])}
                                isInvalid={fieldErrors['document_authorizePersonPassport']}
                                className="mt-2"
                                ref={(el) => {
                                    if (el) {
                                        fileInputRefs.current['authorizePersonPassport'] = el;
                                    }
                                }}
                            />
                        )}
                        
                        {/* Show custom file display when file uploaded */}
                        {uploadedDocuments.authorizePersonPassport && (
                            <div className="mt-2">
                                <div className={`form-control d-flex align-items-center ${fieldErrors['document_authorizePersonPassport'] ? 'is-invalid' : ''}`}>
                                    <i className="mdi mdi-file-document text-primary me-2"></i>
                                    <span className="text-truncate">
                                        {uploadedDocuments.authorizePersonPassport}
                                    </span>
                                </div>
                            </div>
                        )}
                        
                        <Form.Text className="text-muted mt-2">
                            Max 10MB. Accepted formats: PDF, JPG, JPEG, PNG
                        </Form.Text>
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

const DocumentAgreementsStep = ({ data = {}, onChange, onSubmit, allData, fieldErrors = {}, clearFieldError }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleCheckboxChange = (fieldName, checked) => {
        // Clear field error when checkbox is checked
        if (checked && clearFieldError) {
            clearFieldError(fieldName);
        }
        
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
                                isInvalid={fieldErrors[agreement.field]}
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