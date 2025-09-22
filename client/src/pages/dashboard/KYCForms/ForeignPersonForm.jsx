import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Alert, Card, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import MultiStepFormWrapper from '../../../components/KYCForm/MultiStepFormWrapper';
import { useNotificationContext } from '../../../common/context/useNotificationContext';
import AuthService from '../../../common/api/auth';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en';

const ForeignPersonForm = () => {
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
            title: "Personal Email",
            description: "Email registration"
        },
        {
            title: "Personal Data",
            description: "Personal information & contact details"
        },
        {
            title: "Emergency Contact",
            description: "Emergency contact person"
        },
        {
            title: "Employment Data",
            description: "Work & financial information"
        },
        {
            title: "Bank Accounts",
            description: "Margin deposit & withdrawal accounts"
        },
        {
            title: "Document Upload",
            description: "Required documents upload"
        },
        {
            title: "Review & Submit",
            description: "Final review and agreements"
        }
    ];

    // Document requirements for Foreign Person registration
    const documentRequirements = [
        {
            category: "Identity Documents",
            documents: [
                "Passport",
                "Photo Selfie"
            ]
        },
        {
            category: "Financial Documents",
            documents: [
                "Bank Account Statement or Credit Card Bill"
            ]
        },
        {
            category: "Utility Documents",
            documents: [
                "Telephone or Electricity Bill"
            ]
        },
        {
            category: "Tax Documents (Optional)",
            documents: [
                "Personal Tax Document"
            ],
            optional: true
        }
    ];

    const renderStep = ({ currentStep, formData: stepData, updateFormData }) => {
        switch (currentStep) {
            case 0:
                return <RequirementsStep requirements={documentRequirements} />;
            case 1:
                return <PersonalEmailRegistrationStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 2:
                return <PersonalDataStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 3:
                return <EmergencyContactStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 4:
                return <EmploymentDataStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 5:
                return <BankAccountStep data={stepData} onChange={updateFormData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 6:
                return <DocumentUploadStep data={stepData} onChange={updateFormData} requirements={documentRequirements} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            case 7:
                return <ReviewStep data={stepData} onChange={updateFormData} allData={formData} fieldErrors={fieldErrors} clearFieldError={clearFieldError} />;
            default:
                return <RequirementsStep requirements={documentRequirements} />;
        }
    };

    // Validation functions for each step
    const validateStep = (stepIndex, stepData, allData) => {
        switch (stepIndex) {
            case 0: // Requirements step - always valid (just informational)
                return { isValid: true, errors: [] };
            
            case 1: // Personal Email Registration step
                return validatePersonalEmailStep(stepData);
            
            case 2: // Personal Data step
                return validatePersonalDataStep(stepData);
            
            case 3: // Emergency Contact step
                return validateEmergencyContactStep(stepData);
            
            case 4: // Employment Data step
                return validateEmploymentDataStep(stepData);
            
            case 5: // Bank Account step
                return validateBankAccountStep(stepData);
            
            case 6: // Document Upload step
                return validateDocumentUploadStep(stepData);
            
            case 7: // Review step
                return validateReviewStep(stepData);
            
            default:
                return { isValid: true, errors: [] };
        }
    };

    const validatePersonalEmailStep = (data) => {
        const errors = [];
        
        if (!data.email?.trim()) {
            errors.push('Personal email address is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.demoAccountNo?.trim()) {
            errors.push('Demo account selection is required');
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validatePersonalDataStep = (data) => {
        const errors = [];
        const requiredFields = [
            { field: 'fullName', label: 'Full Name' },
            { field: 'placeOfBirth', label: 'Place of Birth' },
            { field: 'dateOfBirth', label: 'Date of Birth' },
            { field: 'passportId', label: 'Passport ID Number' },
            { field: 'gender', label: 'Gender' },
            { field: 'maritalStatus', label: 'Marital Status' },
            { field: 'citizen', label: 'Citizenship' },
            { field: 'countryCode', label: 'Country Code' },
            { field: 'phoneNumber', label: 'Phone Number' },
            { field: 'contactEmail', label: 'Email' },
            { field: 'streetAddress', label: 'Street Address' },
            { field: 'city', label: 'City' },
            { field: 'postalCode', label: 'Postal Code' },
            { field: 'country', label: 'Country' },
            { field: 'accountOpeningPurpose', label: 'Account Opening Purpose' },
            { field: 'investmentExperience', label: 'Investment Experience' },
            { field: 'familyInBappebti', label: 'Family in BAPPEBTI' },
            { field: 'declaredBankrupt', label: 'Bankruptcy Declaration' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });
        
        // Check conditional fields
        if (data.citizen === 'OTHER' && !data.citizenOther?.trim()) {
            errors.push('Please specify other citizenship');
        }
        
        if (data.country === 'OTHER' && !data.countryOther?.trim()) {
            errors.push('Please specify other country');
        }
        
        if (data.accountOpeningPurpose === 'Others' && !data.accountOpeningPurposeOther?.trim()) {
            errors.push('Please specify other account opening purpose');
        }
        
        if (data.investmentExperience === 'Yes' && !data.investmentExperienceDetails?.trim()) {
            errors.push('Please provide details about your investment experience');
        }
        
        // Validate age (must be at least 21 years old)
        if (data.dateOfBirth) {
            const birthDate = new Date(data.dateOfBirth);
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
        
        // Validate email format
        if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
            errors.push('Please enter a valid email address');
        }
        
        // Special validation for phone number - must have digits after country code
        if (data.phoneNumber && data.countryCode) {
            const numberPart = data.phoneNumber.substring(data.countryCode.length).trim();
            if (!numberPart || numberPart.length === 0) {
                errors.push('Please enter the phone number after the country code');
            }
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateEmergencyContactStep = (data) => {
        const errors = [];
        const requiredFields = [
            { field: 'emergencyContactName', label: 'Emergency Contact Full Name' },
            { field: 'emergencyContactRelationship', label: 'Relationship' },
            { field: 'emergencyContactCountryCode', label: 'Emergency Contact Country Code' },
            { field: 'emergencyContactPhoneNumber', label: 'Emergency Contact Phone Number' },
            { field: 'emergencyContactStreetAddress', label: 'Emergency Contact Street Address' },
            { field: 'emergencyContactCity', label: 'Emergency Contact City' },
            { field: 'emergencyContactPostalCode', label: 'Emergency Contact Postal Code' },
            { field: 'emergencyContactCountry', label: 'Emergency Contact Country' },
            { field: 'emergencyContactEmail', label: 'Emergency Contact Email' }
        ];
        
        requiredFields.forEach(({ field, label }) => {
            if (!data[field]?.trim()) {
                errors.push(`${label} is required`);
            }
        });
        
        // Check conditional fields
        if (data.emergencyContactRelationship === 'OTHER' && !data.emergencyContactRelationshipOther?.trim()) {
            errors.push('Please specify other relationship');
        }
        
        if (data.emergencyContactCountry === 'OTHER' && !data.emergencyContactCountryOther?.trim()) {
            errors.push('Please specify other emergency contact country');
        }
        
        // Validate email format
        if (data.emergencyContactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.emergencyContactEmail)) {
            errors.push('Please enter a valid email address for emergency contact');
        }
        
        // Special validation for phone number - must have digits after country code
        if (data.emergencyContactPhoneNumber && data.emergencyContactCountryCode) {
            const numberPart = data.emergencyContactPhoneNumber.substring(data.emergencyContactCountryCode.length).trim();
            if (!numberPart || numberPart.length === 0) {
                errors.push('Please enter the emergency contact phone number after the country code');
            }
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateEmploymentDataStep = (data) => {
        const errors = [];
        
        if (!data.employmentStatus?.trim()) {
            errors.push('Employment status is required');
        }
        
        // If employed or entrepreneur, validate employment details
        if (data.employmentStatus === 'WORK' || data.employmentStatus === 'ENTREPRENEUR') {
            const employmentFields = [
                { field: 'companyName', label: 'Company Name' },
                { field: 'businessNature', label: 'Nature of Business' },
                { field: 'position', label: 'Position' },
                { field: 'lengthOfWork', label: 'Length of Work' },
                { field: 'officeCountryCode', label: 'Office Country Code' },
                { field: 'officePhoneNumber', label: 'Office Phone Number' },
                { field: 'officeStreetAddress', label: 'Office Street Address' },
                { field: 'officeCity', label: 'Office City' },
                { field: 'officePostalCode', label: 'Office Postal Code' },
                { field: 'officeCountry', label: 'Office Country' }
            ];
            
            employmentFields.forEach(({ field, label }) => {
                if (!data[field]?.trim()) {
                    errors.push(`${label} is required`);
                }
            });
            
            if (data.officeCountry === 'OTHER' && !data.officeCountryOther?.trim()) {
                errors.push('Please specify other office country');
            }
            
            // Special validation for office phone number - must have digits after country code
            if (data.officePhoneNumber && data.officeCountryCode) {
                const numberPart = data.officePhoneNumber.substring(data.officeCountryCode.length).trim();
                if (!numberPart || numberPart.length === 0) {
                    errors.push('Please enter the office phone number after the country code');
                }
            }
        }
        
        return { isValid: errors.length === 0, errors };
    };

    const validateBankAccountStep = (data) => {
        const errors = [];
        
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

    const validateDocumentUploadStep = (data) => {
        const errors = [];
        
        // Check each required document individually
        documentRequirements.forEach((category, categoryIndex) => {
            if (!category.optional) {
                category.documents.forEach((doc, docIndex) => {
                    const docKey = `${categoryIndex}_${docIndex}`;
                    const isUploaded = data.uploadedDocuments && data.uploadedDocuments[docKey];
                    
                    if (!isUploaded) {
                        errors.push(`${doc} is required`);
                    }
                });
            }
        });
        
        return { isValid: errors.length === 0, errors };
    };

    const validateReviewStep = (data) => {
        const errors = [];
        
        const requiredAgreements = [
            'companyProfile',
            'statementSimulation', 
            'statementExperience',
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
                // Email Registration Step errors
                if (error.includes('Personal email address') || error.includes('valid email address')) newFieldErrors.email = true;
                if (error.includes('Demo account selection')) newFieldErrors.demoAccountNo = true;
                
                // Personal Data Step errors
                if (error.includes('Full Name is required')) newFieldErrors.fullName = true;
                if (error.includes('Place of Birth is required')) newFieldErrors.placeOfBirth = true;
                if (error.includes('Date of Birth is required')) newFieldErrors.dateOfBirth = true;
                if (error.includes('Minimum 21 years old is required')) newFieldErrors.dateOfBirth = true;
                if (error.includes('Passport ID Number is required')) newFieldErrors.passportId = true;
                if (error.includes('Gender is required')) newFieldErrors.gender = true;
                if (error.includes('Marital Status is required')) newFieldErrors.maritalStatus = true;
                if (error.includes('Citizenship is required')) newFieldErrors.citizen = true;
                if (error.includes('Country Code is required')) newFieldErrors.countryCode = true;
                if (error.includes('Phone Number is required')) newFieldErrors.phoneNumber = true;
                if (error.includes('phone number after the country code')) newFieldErrors.phoneNumber = true;
                if (error.includes('Email is required')) newFieldErrors.contactEmail = true;
                if (error.includes('Street Address is required')) newFieldErrors.streetAddress = true;
                if (error.includes('City is required')) newFieldErrors.city = true;
                if (error.includes('Postal Code is required')) newFieldErrors.postalCode = true;
                if (error.includes('Country is required')) newFieldErrors.country = true;
                if (error.includes('Account Opening Purpose is required')) newFieldErrors.accountOpeningPurpose = true;
                if (error.includes('Investment Experience is required')) newFieldErrors.investmentExperience = true;
                if (error.includes('Family in BAPPEBTI is required')) newFieldErrors.familyInBappebti = true;
                if (error.includes('Bankruptcy Declaration is required')) newFieldErrors.declaredBankrupt = true;
                if (error.includes('specify other citizenship')) newFieldErrors.citizenOther = true;
                if (error.includes('specify other country')) newFieldErrors.countryOther = true;
                if (error.includes('specify other account opening purpose')) newFieldErrors.accountOpeningPurposeOther = true;
                if (error.includes('details about your investment experience')) newFieldErrors.investmentExperienceDetails = true;
                
                // Emergency Contact Step errors
                if (error.includes('Emergency Contact Full Name is required')) newFieldErrors.emergencyContactName = true;
                if (error.includes('Relationship is required')) newFieldErrors.emergencyContactRelationship = true;
                if (error.includes('Emergency Contact Country Code is required')) newFieldErrors.emergencyContactCountryCode = true;
                if (error.includes('Emergency Contact Phone Number is required')) newFieldErrors.emergencyContactPhoneNumber = true;
                if (error.includes('emergency contact phone number after the country code')) newFieldErrors.emergencyContactPhoneNumber = true;
                if (error.includes('Emergency Contact Street Address is required')) newFieldErrors.emergencyContactStreetAddress = true;
                if (error.includes('Emergency Contact City is required')) newFieldErrors.emergencyContactCity = true;
                if (error.includes('Emergency Contact Postal Code is required')) newFieldErrors.emergencyContactPostalCode = true;
                if (error.includes('Emergency Contact Country is required')) newFieldErrors.emergencyContactCountry = true;
                if (error.includes('Emergency Contact Email is required')) newFieldErrors.emergencyContactEmail = true;
                if (error.includes('valid email address for emergency contact')) newFieldErrors.emergencyContactEmail = true;
                
                // Employment Data Step errors
                if (error.includes('Employment status is required')) newFieldErrors.employmentStatus = true;
                if (error.includes('Company Name is required')) newFieldErrors.companyName = true;
                if (error.includes('Nature of Business is required')) newFieldErrors.businessNature = true;
                if (error.includes('Position is required')) newFieldErrors.position = true;
                if (error.includes('Length of Work is required')) newFieldErrors.lengthOfWork = true;
                if (error.includes('Office Country Code is required')) newFieldErrors.officeCountryCode = true;
                if (error.includes('Office Phone Number is required')) newFieldErrors.officePhoneNumber = true;
                if (error.includes('office phone number after the country code')) newFieldErrors.officePhoneNumber = true;
                if (error.includes('Office Street Address is required')) newFieldErrors.officeStreetAddress = true;
                if (error.includes('Office City is required')) newFieldErrors.officeCity = true;
                if (error.includes('Office Postal Code is required')) newFieldErrors.officePostalCode = true;
                if (error.includes('Office Country is required')) newFieldErrors.officeCountry = true;
                if (error.includes('specify other office country')) newFieldErrors.officeCountryOther = true;
                
                // Bank Account Step errors - Handle indexed bank account errors
                // More robust pattern matching for bank account errors
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
                
                // Also add general bank field errors (without index)
                if (error.includes('Bank Name is required')) newFieldErrors.bankName = true;
                if (error.includes('Account Name is required')) newFieldErrors.accountName = true;
                if (error.includes('Bank Address is required')) newFieldErrors.bankAddress = true;
                if (error.includes('Bank City is required')) newFieldErrors.bankCity = true;
                if (error.includes('Bank Country is required')) newFieldErrors.bankCountry = true;
                if (error.includes('SWIFT Code is required')) newFieldErrors.swiftCode = true;
                if (error.includes('Account Number is required')) newFieldErrors.accountNo = true;
                if (error.includes('Please specify other country')) newFieldErrors.bankCountryOther = true;
                
                // Handle case when no bank accounts exist - mark first bank account fields as invalid
                if (error.includes('At least one bank account is required')) {
                    const bankFields = ['bankName', 'accountName', 'bankAddress', 'bankCity', 'bankCountry', 'swiftCode', 'accountNo'];
                    bankFields.forEach(field => {
                        newFieldErrors[`${field}_0`] = true;
                        newFieldErrors[field] = true; // Also add general field error
                    });
                }
                
                // Document Upload Step errors - Map specific document errors to field errors
                documentRequirements.forEach((category, categoryIndex) => {
                    if (!category.optional) {
                        category.documents.forEach((doc, docIndex) => {
                            if (error.includes(`${doc} is required`)) {
                                const docKey = `${categoryIndex}_${docIndex}`;
                                newFieldErrors[`document_${docKey}`] = true;
                            }
                        });
                    }
                });
                
                // Review Step errors - Map agreement errors to field errors
                if (error.includes('Please agree to Company Profile')) newFieldErrors.companyProfile = true;
                if (error.includes('Please agree to Statement of Having Simulation')) newFieldErrors.statementSimulation = true;
                if (error.includes('Please agree to Statement of Having Experience')) newFieldErrors.statementExperience = true;
                if (error.includes('Please agree to Account Opening Application')) newFieldErrors.accountOpening = true;
                if (error.includes('Please agree to Risk Disclosure')) newFieldErrors.riskDisclosure = true;
                if (error.includes('Please agree to Mandate Agreement')) newFieldErrors.mandateAgreement = true;
                if (error.includes('Please agree to Trading Rules')) newFieldErrors.tradingRules = true;
                if (error.includes('Please agree to Personal Access Password')) newFieldErrors.personalAccessPassword = true;
                
                // Add other step error mappings as needed
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
        // Auto-populate demo account from email step
        if (step === 2 && data.demoAccountNo) {
            setFormData(prevData => ({
                ...prevData,
                ...data,
                demoAccountNo: data.demoAccountNo
            }));
        }
    };

    const handleSubmit = async (data) => {
        try {
            // Show processing notification
            showNotification({
                title: 'Processing',
                message: 'Submitting your KYC application...',
                type: 'info'
            });
            
            console.log('Submitting Foreign Person KYC:', data);
            
            // Flatten step data into a single object
            const flattenedData = {};
            Object.keys(data).forEach(stepKey => {
                if (stepKey.startsWith('step_') && data[stepKey]) {
                    Object.assign(flattenedData, data[stepKey]);
                }
            });
            
            console.log('Flattened data:', flattenedData);
            
            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            
            // Add all flattened form fields
            Object.keys(flattenedData).forEach(key => {
                if (flattenedData[key] !== null && flattenedData[key] !== undefined) {
                    if (typeof flattenedData[key] === 'object' && !Array.isArray(flattenedData[key]) && !(flattenedData[key] instanceof File)) {
                        // Skip file objects and convert other objects to JSON
                        formData.append(key, JSON.stringify(flattenedData[key]));
                    } else if (Array.isArray(flattenedData[key])) {
                        // Convert arrays to JSON strings
                        formData.append(key, JSON.stringify(flattenedData[key]));
                    } else if (flattenedData[key] instanceof File) {
                        // Handle file uploads
                        formData.append(key, flattenedData[key]);
                    } else {
                        // Handle primitive values
                        formData.append(key, flattenedData[key]);
                    }
                }
            });
            
            // Add uploaded files
            if (flattenedData.uploadedDocuments) {
                Object.entries(flattenedData.uploadedDocuments).forEach(([key, fileName]) => {
                    if (fileName && flattenedData[`file_${key}`]) {
                        formData.append(key, flattenedData[`file_${key}`]);
                    }
                });
            }
            
            const response = await AuthService.submitForeignPersonKYC(formData);
            
            if (response.success) {
                showNotification({
                    title: 'Success',
                    message: `Foreign Person KYC submitted successfully! Application Reference: ${response.data.applicationReference || response.data.applicationId || 'N/A'}`,
                    type: 'success'
                });
                
                // Clear the form
                setFormData({});
                
                // Navigate to accounts page after successful submission
                setTimeout(() => {
                    navigate('/dashboard/accounts');
                }, 2000); // Give time for user to read the success message
                
                console.log('KYC Application submitted:', response.data);
            } else {
                throw new Error(response.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Error submitting Foreign Person KYC:', error);
            
            // Handle authentication errors more gracefully
            if (error.message && error.message.includes('Session expired')) {
                showNotification({
                    title: 'Session Expired',
                    message: 'Your session has expired. Please save your progress and log in again.',
                    type: 'warning'
                });
            } else {
                showNotification({
                    title: 'Submission Failed',
                    message: error.message || 'An error occurred while submitting your KYC application. Please try again.',
                    type: 'error'
                });
            }
        }
    };

    return (
        <MultiStepFormWrapper
            accountType="Foreign Person"
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
                    <li>Documents should be clear, legible scans or photos</li>
                    <li>Maximum file size: 10MB per document</li>
                    <li>Accepted formats: PDF, JPG, JPEG, PNG</li>
                </ul>
            </Alert>
        </div>
    );
};

const PersonalEmailRegistrationStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
            const isValid = value.trim() === '' || validateEmail(value);
            setEmailValid(isValid);
            
            if (value.trim() !== '' && !isValid) {
                showNotification({
                    title: 'Invalid Email',
                    message: 'Please enter a valid email address for personal email',
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
                <h4 className="text-primary mb-3">Personal Email Registration</h4>
                <p className="text-muted fs-5">Please provide your personal email address</p>
            </div>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Register Personal Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter personal email address"
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
                            <Form.Label className="text-muted">Select Demo Account No. <span className="text-danger">*</span></Form.Label>
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

const PersonalDataStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [contactEmailValid, setContactEmailValid] = useState(true);
    const { showNotification } = useNotificationContext();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleContactEmailChange = (value) => {
        // Clear field error when user starts typing
        if (clearFieldError) {
            clearFieldError('contactEmail');
        }
        
        // Validate email immediately
        const isValid = value.trim() === '' || validateEmail(value);
        setContactEmailValid(isValid);
        
        // Show notification for invalid email with content
        if (value.trim() !== '' && !isValid) {
            showNotification({
                title: 'Invalid Email',
                message: 'Please enter a valid email address for contact email',
                type: 'error'
            });
        }
        
        onChange({ ...data, contactEmail: value });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Personal Data</h4>
                <p className="text-muted fs-5">Please provide your complete personal information and contact details</p>
            </div>

            <Form>
                {/* Basic Personal Information */}
                <h5 className="text-primary mb-3">Personal Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Full Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your full name"
                                value={data.fullName || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('fullName');
                                    onChange({ ...data, fullName: e.target.value });
                                }}
                                isInvalid={fieldErrors.fullName}
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
                                value={data.placeOfBirth || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('placeOfBirth');
                                    onChange({ ...data, placeOfBirth: e.target.value });
                                }}
                                isInvalid={fieldErrors.placeOfBirth}
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
                                value={data.dateOfBirth || ''}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('dateOfBirth');
                                    onChange({ ...data, dateOfBirth: e.target.value });
                                }}
                                isInvalid={fieldErrors.dateOfBirth}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Gender <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.gender || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('gender');
                                    onChange({ ...data, gender: e.target.value });
                                }}
                                isInvalid={fieldErrors.gender}
                                required
                            >
                                <option value="">Please Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Passport ID No. <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter passport ID number"
                                value={data.passportId || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('passportId');
                                    onChange({ ...data, passportId: e.target.value });
                                }}
                                isInvalid={fieldErrors.passportId}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Marital Status <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.maritalStatus || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('maritalStatus');
                                    onChange({ ...data, maritalStatus: e.target.value });
                                }}
                                isInvalid={fieldErrors.maritalStatus}
                                required
                            >
                                <option value="">Select marital status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Citizen <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.citizen || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('citizen');
                                    onChange({ ...data, citizen: e.target.value });
                                }}
                                isInvalid={fieldErrors.citizen}
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
                            {data.citizen === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other citizenship"
                                    value={data.citizenOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('citizenOther');
                                        onChange({ ...data, citizenOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.citizenOther}
                                    className="mt-2"
                                    required
                                />
                            )}
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

                {/* Contact Information */}
                <h5 className="text-primary mb-3 mt-4">Contact Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Phone Number <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.countryCode || ''}
                                          isInvalid={fieldErrors.countryCode}
                                          onChange={(e) => {
                                             const selectedCode = e.target.value;
                                             // Clear field errors when user makes a selection
                                             clearFieldError && clearFieldError('countryCode');
                                             clearFieldError && clearFieldError('phoneNumber');
                                             
                                             // If no country is selected (back to "Select Country Code"), clear the phone number
                                             if (!selectedCode) {
                                                 onChange({ 
                                                     ...data, 
                                                     countryCode: selectedCode,
                                                     phoneNumber: ''
                                                 });
                                             }
                                             // If a country is selected, set the phone number to just the country code
                                             else {
                                                 onChange({ 
                                                     ...data, 
                                                     countryCode: selectedCode,
                                                     phoneNumber: selectedCode + ' '
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
                                        placeholder="Enter phone number"
                                        value={data.phoneNumber || ''}
                                          isInvalid={fieldErrors.phoneNumber}
                                          onChange={(e) => {
                                            let value = e.target.value;
                                            
                                            // Clear field error when user starts typing
                                            clearFieldError && clearFieldError('phoneNumber');
                                            
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
                                            
                                            onChange({ ...data, phoneNumber: value });
                                         }}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={data.contactEmail || ''}
                                onChange={(e) => handleContactEmailChange(e.target.value)}
                                isInvalid={!contactEmailValid || fieldErrors.contactEmail}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Background Information */}
                <h5 className="text-primary mb-3 mt-4">Background Information</h5>
                <Row>
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Account Opening Purpose <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Hedging"
                                    name="accountOpeningPurpose"
                                    value="Hedging"
                                    checked={data.accountOpeningPurpose === 'Hedging'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('accountOpeningPurpose');
                                        onChange({ ...data, accountOpeningPurpose: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.accountOpeningPurpose}
                                    required
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Gain"
                                    name="accountOpeningPurpose"
                                    value="Gain"
                                    checked={data.accountOpeningPurpose === 'Gain'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('accountOpeningPurpose');
                                        onChange({ ...data, accountOpeningPurpose: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.accountOpeningPurpose}
                                    required
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Speculation"
                                    name="accountOpeningPurpose"
                                    value="Speculation"
                                    checked={data.accountOpeningPurpose === 'Speculation'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('accountOpeningPurpose');
                                        onChange({ ...data, accountOpeningPurpose: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.accountOpeningPurpose}
                                    required
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Others"
                                    name="accountOpeningPurpose"
                                    value="Others"
                                    checked={data.accountOpeningPurpose === 'Others'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('accountOpeningPurpose');
                                        onChange({ ...data, accountOpeningPurpose: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.accountOpeningPurpose}
                                    required
                                />
                            </div>
                            {data.accountOpeningPurpose === 'Others' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other account opening purpose"
                                    value={data.accountOpeningPurposeOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('accountOpeningPurposeOther');
                                        onChange({ ...data, accountOpeningPurposeOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.accountOpeningPurposeOther}
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
                            <Form.Label className="text-muted">Investment Experience <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="investmentExperience"
                                    value="Yes"
                                    checked={data.investmentExperience === 'Yes'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('investmentExperience');
                                        onChange({ ...data, investmentExperience: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.investmentExperience}
                                    required
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="None"
                                    name="investmentExperience"
                                    value="None"
                                    checked={data.investmentExperience === 'None'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('investmentExperience');
                                        onChange({ ...data, investmentExperience: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.investmentExperience}
                                    required
                                />
                            </div>
                            {data.investmentExperience === 'Yes' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify your investment experience"
                                    value={data.investmentExperienceDetails || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('investmentExperienceDetails');
                                        onChange({ ...data, investmentExperienceDetails: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.investmentExperienceDetails}
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
                            <Form.Label className="text-muted">Do you have any family who working in BAPPEBTI / Bursa Berjangka / Kliring Berjangka? <span className="text-danger">*</span></Form.Label>
                            <div>
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="Yes"
                                    name="familyInBappebti"
                                    value="Yes"
                                    checked={data.familyInBappebti === 'Yes'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('familyInBappebti');
                                        onChange({ ...data, familyInBappebti: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.familyInBappebti}
                                    required
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="familyInBappebti"
                                    value="No"
                                    checked={data.familyInBappebti === 'No'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('familyInBappebti');
                                        onChange({ ...data, familyInBappebti: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.familyInBappebti}
                                    required
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
                                    value="Yes"
                                    checked={data.declaredBankrupt === 'Yes'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('declaredBankrupt');
                                        onChange({ ...data, declaredBankrupt: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.declaredBankrupt}
                                    required
                                />
                                <Form.Check
                                    inline
                                    type="radio"
                                    label="No"
                                    name="declaredBankrupt"
                                    value="No"
                                    checked={data.declaredBankrupt === 'No'}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('declaredBankrupt');
                                        onChange({ ...data, declaredBankrupt: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.declaredBankrupt}
                                    required
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const EmergencyContactStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    const [emergencyEmailValid, setEmergencyEmailValid] = useState(true);
    const { showNotification } = useNotificationContext();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmergencyEmailChange = (value) => {
        // Clear field error when user starts typing
        if (clearFieldError) {
            clearFieldError('emergencyContactEmail');
        }
        
        // Validate email immediately
        const isValid = value.trim() === '' || validateEmail(value);
        setEmergencyEmailValid(isValid);
        
        // Show notification for invalid email with content
        if (value.trim() !== '' && !isValid) {
            showNotification({
                title: 'Invalid Email',
                message: 'Please enter a valid email address for emergency contact',
                type: 'error'
            });
        }
        
        onChange({ ...data, emergencyContactEmail: value });
    };

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Emergency Contact</h4>
                <p className="text-muted fs-5">Please provide emergency contact person details</p>
            </div>

            <Form>
                {/* Emergency Contact Information */}
                <h5 className="text-primary mb-3">Emergency Contact Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Full Name of Emergency Contact <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter emergency contact full name"
                                value={data.emergencyContactName || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('emergencyContactName');
                                    onChange({ ...data, emergencyContactName: e.target.value });
                                }}
                                isInvalid={fieldErrors.emergencyContactName}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Relationship <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactRelationship || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('emergencyContactRelationship');
                                    onChange({ ...data, emergencyContactRelationship: e.target.value });
                                }}
                                isInvalid={fieldErrors.emergencyContactRelationship}
                                required
                            >
                                <option value="">Select relationship</option>
                                <option value="SPOUSE">Spouse</option>
                                <option value="FAMILY">Family</option>
                                <option value="CHILD">Child</option>
                                <option value="OTHER">Other</option>
                            </Form.Select>
                            {data.emergencyContactRelationship === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other relationship"
                                    value={data.emergencyContactRelationshipOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('emergencyContactRelationshipOther');
                                        onChange({ ...data, emergencyContactRelationshipOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.emergencyContactRelationshipOther}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Address Information */}
                <h5 className="text-primary mb-3 mt-4">Emergency Contact Address Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Street Address <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter street address"
                                value={data.emergencyContactStreetAddress || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('emergencyContactStreetAddress');
                                    onChange({ ...data, emergencyContactStreetAddress: e.target.value });
                                }}
                                isInvalid={fieldErrors.emergencyContactStreetAddress}
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
                                value={data.emergencyContactCity || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('emergencyContactCity');
                                    onChange({ ...data, emergencyContactCity: e.target.value });
                                }}
                                isInvalid={fieldErrors.emergencyContactCity}
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
                                value={data.emergencyContactPostalCode || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('emergencyContactPostalCode');
                                    onChange({ ...data, emergencyContactPostalCode: e.target.value });
                                }}
                                isInvalid={fieldErrors.emergencyContactPostalCode}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Country <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.emergencyContactCountry || ''}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('emergencyContactCountry');
                                    onChange({ ...data, emergencyContactCountry: e.target.value });
                                }}
                                isInvalid={fieldErrors.emergencyContactCountry}
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
                            {data.emergencyContactCountry === 'OTHER' && (
                                <Form.Control
                                    type="text"
                                    placeholder="Please specify other country"
                                    value={data.emergencyContactCountryOther || ''}
                                    onChange={(e) => {
                                        clearFieldError && clearFieldError('emergencyContactCountryOther');
                                        onChange({ ...data, emergencyContactCountryOther: e.target.value });
                                    }}
                                    isInvalid={fieldErrors.emergencyContactCountryOther}
                                    className="mt-2"
                                    required
                                />
                            )}
                        </Form.Group>
                    </Col>
                </Row>

                {/* Contact Information */}
                <h5 className="text-primary mb-3 mt-4">Contact Information</h5>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Phone Number <span className="text-danger">*</span></Form.Label>
                            <Row>
                                <Col md={4}>
                                    <Form.Select
                                        value={data.emergencyContactCountryCode || ''}
                                          isInvalid={fieldErrors.emergencyContactCountryCode}
                                          onChange={(e) => {
                                             const selectedCode = e.target.value;
                                             // Clear field errors when user makes a selection
                                             clearFieldError && clearFieldError('emergencyContactCountryCode');
                                             clearFieldError && clearFieldError('emergencyContactPhoneNumber');
                                             
                                             // If no country is selected (back to "Select Country Code"), clear the phone number
                                             if (!selectedCode) {
                                                 onChange({ 
                                                     ...data, 
                                                     emergencyContactCountryCode: selectedCode,
                                                     emergencyContactPhoneNumber: ''
                                                 });
                                             }
                                             // If a country is selected, set the phone number to just the country code
                                             else {
                                                 onChange({ 
                                                     ...data, 
                                                     emergencyContactCountryCode: selectedCode,
                                                     emergencyContactPhoneNumber: selectedCode + ' '
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
                                        placeholder="Enter phone number"
                                        value={data.emergencyContactPhoneNumber || ''}
                                          isInvalid={fieldErrors.emergencyContactPhoneNumber}
                                          onChange={(e) => {
                                            let value = e.target.value;
                                            
                                            // Clear field error when user starts typing
                                            clearFieldError && clearFieldError('emergencyContactPhoneNumber');
                                            
                                            // If there's a country code, ensure it stays at the beginning
                                            if (data.emergencyContactCountryCode) {
                                                if (!value.startsWith(data.emergencyContactCountryCode)) {
                                                    // If user deleted the country code, restore it
                                                    value = data.emergencyContactCountryCode + ' ' + value.replace(/^\+\d+\s?/, '');
                                                } else {
                                                    // Extract the number part after country code
                                                    const numberPart = value.substring(data.emergencyContactCountryCode.length).trim();
                                                    // Only allow numbers in the phone number part
                                                    const cleanNumber = numberPart.replace(/[^\d]/g, '');
                                                    value = data.emergencyContactCountryCode + (cleanNumber ? ' ' + cleanNumber : ' ');
                                                }
                                            }
                                            
                                            onChange({ ...data, emergencyContactPhoneNumber: value });
                                         }}
                                        required
                                    />
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email address"
                                value={data.emergencyContactEmail || ''}
                                onChange={(e) => handleEmergencyEmailChange(e.target.value)}
                                isInvalid={!emergencyEmailValid || fieldErrors.emergencyContactEmail}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please enter a valid email address.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

const EmploymentDataStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const showEmploymentDetails = data.employmentStatus === 'WORK' || data.employmentStatus === 'ENTREPRENEUR';

    return (
        <div>
            <div className="text-center mb-4">
                <h4 className="text-primary mb-3">Employment Data</h4>
                <p className="text-muted fs-5">Please provide your employment information</p>
            </div>

            <Form>
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Form.Group className="mb-3">
                            <Form.Label className="text-muted">Employment Status <span className="text-danger">*</span></Form.Label>
                            <Form.Select
                                value={data.employmentStatus || ''}
                                isInvalid={fieldErrors.employmentStatus}
                                onChange={(e) => {
                                    clearFieldError && clearFieldError('employmentStatus');
                                    onChange({ ...data, employmentStatus: e.target.value });
                                }}
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

                {showEmploymentDetails && (
                    <>
                        {/* Employment Information */}
                        <h5 className="text-primary mb-3 mt-4">Employment Information</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Company Name <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter company name"
                                        value={data.companyName || ''}
                                        isInvalid={fieldErrors.companyName}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('companyName');
                                            onChange({ ...data, companyName: e.target.value });
                                        }}
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
                                        value={data.businessNature || ''}
                                        isInvalid={fieldErrors.businessNature}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('businessNature');
                                            onChange({ ...data, businessNature: e.target.value });
                                        }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Position <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter your position"
                                        value={data.position || ''}
                                        isInvalid={fieldErrors.position}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('position');
                                            onChange({ ...data, position: e.target.value });
                                        }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Length of Work <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="e.g., 2 years, 6 months"
                                        value={data.lengthOfWork || ''}
                                        isInvalid={fieldErrors.lengthOfWork}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('lengthOfWork');
                                            onChange({ ...data, lengthOfWork: e.target.value });
                                        }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Previous Company</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter previous company (if any)"
                                        value={data.previousCompany || ''}
                                        onChange={(e) => onChange({ ...data, previousCompany: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Office Phone Number <span className="text-danger">*</span></Form.Label>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Select
                                                value={data.officeCountryCode || ''}
                                                isInvalid={fieldErrors.officeCountryCode}
                                                onChange={(e) => {
                                                   const selectedCode = e.target.value;
                                                   // Clear field errors when user makes a selection
                                                   clearFieldError && clearFieldError('officeCountryCode');
                                                   clearFieldError && clearFieldError('officePhoneNumber');
                                                   
                                                   // If no country is selected (back to "Select Country Code"), clear the phone number
                                                   if (!selectedCode) {
                                                       onChange({ 
                                                           ...data, 
                                                           officeCountryCode: selectedCode,
                                                           officePhoneNumber: ''
                                                       });
                                                   }
                                                   // If a country is selected, set the phone number to just the country code
                                                   else {
                                                       onChange({ 
                                                           ...data, 
                                                           officeCountryCode: selectedCode,
                                                           officePhoneNumber: selectedCode + ' '
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
                                                placeholder="Enter office phone number"
                                                value={data.officePhoneNumber || ''}
                                                isInvalid={fieldErrors.officePhoneNumber}
                                                onChange={(e) => {
                                                  let value = e.target.value;
                                                  
                                                  // Clear field error when user starts typing
                                                  clearFieldError && clearFieldError('officePhoneNumber');
                                                  
                                                  // If there's a country code, ensure it stays at the beginning
                                                  if (data.officeCountryCode) {
                                                      if (!value.startsWith(data.officeCountryCode)) {
                                                          // If user deleted the country code, restore it
                                                          value = data.officeCountryCode + ' ' + value.replace(/^\+\d+\s?/, '');
                                                      } else {
                                                          // Extract the number part after country code
                                                          const numberPart = value.substring(data.officeCountryCode.length).trim();
                                                          // Only allow numbers in the phone number part
                                                          const cleanNumber = numberPart.replace(/[^\d]/g, '');
                                                          value = data.officeCountryCode + (cleanNumber ? ' ' + cleanNumber : ' ');
                                                      }
                                                  }
                                                  
                                                  onChange({ ...data, officePhoneNumber: value });
                                               }}
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Office Address */}
                        <h5 className="text-primary mb-3 mt-4">Office Address</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Street Address <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter office street address"
                                        value={data.officeStreetAddress || ''}
                                        isInvalid={fieldErrors.officeStreetAddress}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('officeStreetAddress');
                                            onChange({ ...data, officeStreetAddress: e.target.value });
                                        }}
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
                                        value={data.officeCity || ''}
                                        isInvalid={fieldErrors.officeCity}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('officeCity');
                                            onChange({ ...data, officeCity: e.target.value });
                                        }}
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
                                        value={data.officePostalCode || ''}
                                        isInvalid={fieldErrors.officePostalCode}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('officePostalCode');
                                            onChange({ ...data, officePostalCode: e.target.value });
                                        }}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="text-muted">Country <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        value={data.officeCountry || ''}
                                        isInvalid={fieldErrors.officeCountry}
                                        onChange={(e) => {
                                            clearFieldError && clearFieldError('officeCountry');
                                            onChange({ ...data, officeCountry: e.target.value });
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
                                    {data.officeCountry === 'OTHER' && (
                                        <Form.Control
                                            type="text"
                                            placeholder="Please specify other country"
                                            value={data.officeCountryOther || ''}
                                            isInvalid={fieldErrors.officeCountryOther}
                                            onChange={(e) => {
                                                clearFieldError && clearFieldError('officeCountryOther');
                                                onChange({ ...data, officeCountryOther: e.target.value });
                                            }}
                                            className="mt-2"
                                            required
                                        />
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                )}
            </Form>
        </div>
    );
};

const BankAccountStep = ({ data = {}, onChange, fieldErrors = {}, clearFieldError }) => {
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
                <h4 className="text-primary mb-3">Bank Account Information For Margin Deposit And Withdrawal</h4>
                <p className="text-muted fs-5">Please provide your bank account details</p>
            </div>

            <Form>
                {/* Bank Accounts */}
                <h5 className="text-primary mb-3">Bank Accounts</h5>
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

const DocumentUploadStep = ({ data = {}, onChange, requirements, fieldErrors = {}, clearFieldError }) => {
    const [uploadedDocs, setUploadedDocs] = useState(data.uploadedDocuments || {});
    const [uploadedFiles, setUploadedFiles] = useState(data.uploadedFiles || {});
    const fileInputRefs = useRef({});

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const getDocumentFieldName = (categoryIndex, docIndex) => {
        // Map document categories to field names expected by backend
        const category = requirements[categoryIndex];
        const document = category.documents[docIndex];
        
        const fieldNameMapping = {
            'Passport': 'passport',
            'Photo Selfie': 'photo_selfie',
            'Bank Account Statement or Credit Card Bill': 'bank_statement',
            'Telephone or Electricity Bill': 'utility_bill',
            'Personal Tax Document': 'tax_document'
        };
        
        return fieldNameMapping[document] || `document_${categoryIndex}_${docIndex}`;
    };

    const handleFileUpload = (categoryIndex, docIndex, file) => {
        const docKey = `${categoryIndex}_${docIndex}`;
        const fieldName = getDocumentFieldName(categoryIndex, docIndex);
        
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
        
        // Calculate if all required documents are uploaded
        const requiredDocsCount = requirements.filter(cat => !cat.optional)
            .reduce((total, cat) => total + cat.documents.length, 0);
        const uploadedRequiredCount = Object.entries(newUploadedDocs).filter(([key, value]) => {
            const [catIdx] = key.split('_').map(Number);
            return value && !requirements[catIdx]?.optional;
        }).length;
        
        // Store file object for later submission
        const updatedData = {
            ...data,
            uploadedDocuments: newUploadedDocs,
            uploadedFiles: newUploadedFiles,
            documentsUploaded: uploadedRequiredCount >= requiredDocsCount,
            [`file_${docKey}`]: file  // Store actual file object
        };
        
        // Also store with backend field name
        if (file) {
            updatedData[fieldName] = file;
        }
        
        // Update parent component with uploaded documents info
        onChange(updatedData);
    };

    const handleFileRemove = (categoryIndex, docIndex) => {
        const docKey = `${categoryIndex}_${docIndex}`;
        const fieldName = getDocumentFieldName(categoryIndex, docIndex);
        
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
        
        // Calculate if all required documents are uploaded
        const requiredDocsCount = requirements.filter(cat => !cat.optional)
            .reduce((total, cat) => total + cat.documents.length, 0);
        const uploadedRequiredCount = Object.entries(newUploadedDocs).filter(([key, value]) => {
            const [catIdx] = key.split('_').map(Number);
            return value && !requirements[catIdx]?.optional;
        }).length;
        
        // Update parent component
        const updatedData = {
            ...data,
            uploadedDocuments: newUploadedDocs,
            uploadedFiles: newUploadedFiles,
            documentsUploaded: uploadedRequiredCount >= requiredDocsCount,
            [`file_${docKey}`]: null
        };
        
        // Remove the specific document file from the data
        updatedData[fieldName] = null;
        
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
                                            {!category.optional && <span className="text-danger"> *</span>}
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
        accountOpening: data.accountOpening || false,
        riskDisclosure: data.riskDisclosure || false,
        mandateAgreement: data.mandateAgreement || false,
        tradingRules: data.tradingRules || false,
        personalAccessPassword: data.personalAccessPassword || false
    });

    const handleAgreementChange = (field, value) => {
        const newAgreements = { ...agreements, [field]: value };
        setAgreements(newAgreements);
        
        // Clear field error when checkbox is checked
        if (value && clearFieldError) {
            clearFieldError(field);
        }
        
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
                            <p><strong>Steps Completed:</strong> 8/8</p>
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
                                isInvalid={fieldErrors.statementSimulation}
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
                                isInvalid={fieldErrors.statementExperience}
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
                                isInvalid={fieldErrors.accountOpening}
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
                                isInvalid={fieldErrors.riskDisclosure}
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
                                isInvalid={fieldErrors.mandateAgreement}
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
                                isInvalid={fieldErrors.tradingRules}
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
                                isInvalid={fieldErrors.personalAccessPassword}
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