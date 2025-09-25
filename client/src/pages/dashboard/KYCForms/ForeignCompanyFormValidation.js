// Exact field mappings extracted from ForeignCompanyForm validation functions
// No assumptions - only field names that exist in the actual validation code

export const STEP_FIELD_MAPPINGS = {
  // Step 0 - Requirements (no validation needed)
  0: {
    requiredFields: {},
    conditionalFields: {}
  },

  // Step 1 - Email Registration (validateEmailStep lines 138-151)
  1: {
    requiredFields: {
      email: {
        fieldName: 'email',
        label: 'Company email address',
        validation: 'email'
      },
      demoAccountNo: {
        fieldName: 'demoAccountNo',
        label: 'Demo account selection',
        validation: 'required'
      }
    },
    conditionalFields: {}
  },

  // Step 2 - Company Details (validateCompanyDetailsStep lines 153-202)
  2: {
    requiredFields: {
      companyRegistrationName: {
        fieldName: 'companyRegistrationName',
        label: 'Company Registration Name',
        validation: 'required'
      },
      companyLicenseNo: {
        fieldName: 'companyLicenseNo',
        label: 'Company License Number',
        validation: 'required'
      },
      natureOfBusiness: {
        fieldName: 'natureOfBusiness',
        label: 'Nature of Business',
        validation: 'required'
      },
      companyLegalForm: {
        fieldName: 'companyLegalForm',
        label: 'Company Legal Form',
        validation: 'required'
      },
      streetAddress: {
        fieldName: 'streetAddress',
        label: 'Street Address',
        validation: 'required'
      },
      city: {
        fieldName: 'city',
        label: 'City',
        validation: 'required'
      },
      postalCode: {
        fieldName: 'postalCode',
        label: 'Postal/Zip Code',
        validation: 'required'
      },
      country: {
        fieldName: 'country',
        label: 'Country',
        validation: 'required'
      },
      placeOfEstablishment: {
        fieldName: 'placeOfEstablishment',
        label: 'Place of Establishment',
        validation: 'required'
      },
      dateOfEstablishment: {
        fieldName: 'dateOfEstablishment',
        label: 'Date of Establishment',
        validation: 'required'
      },
      countryCode: {
        fieldName: 'countryCode',
        label: 'Country Code',
        validation: 'required'
      },
      officePhoneNumber: {
        fieldName: 'officePhoneNumber',
        label: 'Office Phone Number',
        validation: 'phone'
      },
      beneficialOwnerName: {
        fieldName: 'beneficialOwnerName',
        label: 'Beneficial Owner Name',
        validation: 'required'
      },
      beneficialOwnerPassportNo: {
        fieldName: 'beneficialOwnerPassportNo',
        label: 'Beneficial Owner Passport Number',
        validation: 'required'
      },
      sourceOfFunds: {
        fieldName: 'sourceOfFunds',
        label: 'Source of Funds',
        validation: 'required'
      },
      tradingAccountPurpose: {
        fieldName: 'tradingAccountPurpose',
        label: 'Trading Account Purpose',
        validation: 'required'
      }
    },
    conditionalFields: {
      companyLegalFormOther: {
        fieldName: 'companyLegalFormOther',
        label: 'Other legal form',
        condition: (data) => data.companyLegalForm === 'OTHER',
        validation: 'required'
      },
      countryOther: {
        fieldName: 'countryOther',
        label: 'Other country',
        condition: (data) => data.country === 'OTHER',
        validation: 'required'
      },
      sourceOfFundsOther: {
        fieldName: 'sourceOfFundsOther',
        label: 'Other source of funds',
        condition: (data) => data.sourceOfFunds === 'OTHER',
        validation: 'required'
      },
      tradingAccountPurposeOther: {
        fieldName: 'tradingAccountPurposeOther',
        label: 'Other trading account purpose',
        condition: (data) => data.tradingAccountPurpose === 'OTHER',
        validation: 'required'
      }
    }
  },

  // Step 3 - Document Upload (validateDocumentUploadStep lines 204-226)
  3: {
    requiredFields: {
      '0_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '0_0',
        label: 'Certificate of Incorporation',
        validation: 'file'
      },
      '0_1': {
        fieldName: 'uploadedDocuments',
        documentKey: '0_1',
        label: 'Board of Resolution',
        validation: 'file'
      },
      '0_2': {
        fieldName: 'uploadedDocuments',
        documentKey: '0_2',
        label: 'Address Proof',
        validation: 'file'
      },
      '1_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '1_0',
        label: 'Bank Statement',
        validation: 'file'
      },
      '2_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '2_0',
        label: 'Beneficial Owner Passport',
        validation: 'file'
      },
      '3_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '3_0',
        label: 'Management Structure',
        validation: 'file'
      },
      '3_1': {
        fieldName: 'uploadedDocuments',
        documentKey: '3_1',
        label: 'Ownership Structure',
        validation: 'file'
      }
    },
    conditionalFields: {}
  },

  // Step 4 - Authorize Person (validateAuthorizePersonStep lines 228-363)
  4: {
    requiredFields: {
      authorizePersonTitle: {
        fieldName: 'authorizePersonTitle',
        label: 'Authorize Person Title',
        validation: 'required'
      },
      authorizePersonFullName: {
        fieldName: 'authorizePersonFullName',
        label: 'Authorize Person Full Name',
        validation: 'required'
      },
      authorizePersonPlaceOfBirth: {
        fieldName: 'authorizePersonPlaceOfBirth',
        label: 'Place of Birth',
        validation: 'required'
      },
      authorizePersonDateOfBirth: {
        fieldName: 'authorizePersonDateOfBirth',
        label: 'Date of Birth',
        validation: 'dateOfBirth'
      },
      authorizePersonPassportId: {
        fieldName: 'authorizePersonPassportId',
        label: 'Passport ID Number',
        validation: 'required'
      },
      authorizePersonPassport: {
        fieldName: 'authorizePersonPassport',
        label: 'Passport Upload',
        validation: 'file'
      },
      authorizePersonEmail: {
        fieldName: 'authorizePersonEmail',
        label: 'Authorize Person Email',
        validation: 'email'
      },
      authorizePersonGender: {
        fieldName: 'authorizePersonGender',
        label: 'Gender',
        validation: 'required'
      },
      authorizePersonMaritalStatus: {
        fieldName: 'authorizePersonMaritalStatus',
        label: 'Marital Status',
        validation: 'required'
      },
      authorizePersonCitizen: {
        fieldName: 'authorizePersonCitizen',
        label: 'Citizenship',
        validation: 'required'
      },
      authorizePersonCountryCode: {
        fieldName: 'authorizePersonCountryCode',
        label: 'Phone Country Code',
        validation: 'required'
      },
      authorizePersonPhoneNumber: {
        fieldName: 'authorizePersonPhoneNumber',
        label: 'Phone Number',
        validation: 'phone'
      },
      authorizePersonStreetAddress: {
        fieldName: 'authorizePersonStreetAddress',
        label: 'Authorize Person Street Address',
        validation: 'required'
      },
      authorizePersonCity: {
        fieldName: 'authorizePersonCity',
        label: 'Authorize Person City',
        validation: 'required'
      },
      authorizePersonPostalCode: {
        fieldName: 'authorizePersonPostalCode',
        label: 'Authorize Person Postal Code',
        validation: 'required'
      },
      authorizePersonCountry: {
        fieldName: 'authorizePersonCountry',
        label: 'Authorize Person Country',
        validation: 'required'
      },
      authorizePersonInvestmentExperience: {
        fieldName: 'authorizePersonInvestmentExperience',
        label: 'Investment Experience',
        validation: 'required'
      },
      authorizePersonFamilyInBappebti: {
        fieldName: 'authorizePersonFamilyInBappebti',
        label: 'Family in BAPPEBTI',
        validation: 'required'
      },
      authorizePersonDeclaredBankrupt: {
        fieldName: 'authorizePersonDeclaredBankrupt',
        label: 'Bankruptcy Declaration',
        validation: 'required'
      },
      authorizePersonCompanyName: {
        fieldName: 'authorizePersonCompanyName',
        label: 'Company Name',
        validation: 'required'
      },
      authorizePersonBusinessNature: {
        fieldName: 'authorizePersonBusinessNature',
        label: 'Nature of Business',
        validation: 'required'
      },
      authorizePersonJobPosition: {
        fieldName: 'authorizePersonJobPosition',
        label: 'Job Position',
        validation: 'required'
      },
      authorizePersonOfficeAddress: {
        fieldName: 'authorizePersonOfficeAddress',
        label: 'Office Address',
        validation: 'required'
      },
      authorizePersonOfficeCity: {
        fieldName: 'authorizePersonOfficeCity',
        label: 'Office City',
        validation: 'required'
      },
      authorizePersonOfficePostalCode: {
        fieldName: 'authorizePersonOfficePostalCode',
        label: 'Office Postal Code',
        validation: 'required'
      },
      authorizePersonOfficeCountry: {
        fieldName: 'authorizePersonOfficeCountry',
        label: 'Office Country',
        validation: 'required'
      }
    },
    conditionalFields: {
      authorizePersonCitizenOther: {
        fieldName: 'authorizePersonCitizenOther',
        label: 'Other citizenship',
        condition: (data) => data.authorizePersonCitizen === 'OTHER',
        validation: 'required'
      },
      authorizePersonCountryOther: {
        fieldName: 'authorizePersonCountryOther',
        label: 'Other authorize person country',
        condition: (data) => data.authorizePersonCountry === 'OTHER',
        validation: 'required'
      },
      authorizePersonOfficeCountryOther: {
        fieldName: 'authorizePersonOfficeCountryOther',
        label: 'Other office country',
        condition: (data) => data.authorizePersonOfficeCountry === 'OTHER',
        validation: 'required'
      },
      authorizePersonInvestmentExperienceDetails: {
        fieldName: 'authorizePersonInvestmentExperienceDetails',
        label: 'Investment experience details',
        condition: (data) => data.authorizePersonInvestmentExperience === 'YES',
        validation: 'required'
      }
    },
    // Bank accounts validation (lines 304-360)
    bankAccountFields: {
      bankName: {
        fieldName: 'bankName',
        label: 'Bank Name',
        validation: 'required'
      },
      accountName: {
        fieldName: 'accountName',
        label: 'Account Name',
        validation: 'required'
      },
      bankAddress: {
        fieldName: 'bankAddress',
        label: 'Bank Address',
        validation: 'required'
      },
      bankCity: {
        fieldName: 'bankCity',
        label: 'Bank City',
        validation: 'required'
      },
      bankCountry: {
        fieldName: 'bankCountry',
        label: 'Bank Country',
        validation: 'required'
      },
      swiftCode: {
        fieldName: 'swiftCode',
        label: 'SWIFT Code',
        validation: 'required'
      },
      accountNo: {
        fieldName: 'accountNo',
        label: 'Account Number',
        validation: 'required'
      }
    },
    bankAccountConditionalFields: {
      bankCountryOther: {
        fieldName: 'bankCountryOther',
        label: 'Other country',
        condition: (account) => account.bankCountry === 'OTHER',
        validation: 'required'
      }
    }
  },

  // Step 5 - Review & Submit (validateReviewStep lines 365-399)
  5: {
    requiredFields: {
      companyProfile: {
        fieldName: 'companyProfile',
        label: 'Company Profile',
        validation: 'checkbox'
      },
      statementSimulation: {
        fieldName: 'statementSimulation',
        label: 'Statement of Having Simulation',
        validation: 'checkbox'
      },
      statementExperience: {
        fieldName: 'statementExperience',
        label: 'Statement of Having Experience',
        validation: 'checkbox'
      },
      disclosureStatement: {
        fieldName: 'disclosureStatement',
        label: 'Disclosure Statement',
        validation: 'checkbox'
      },
      accountOpening: {
        fieldName: 'accountOpening',
        label: 'Account Opening Application',
        validation: 'checkbox'
      },
      riskDisclosure: {
        fieldName: 'riskDisclosure',
        label: 'Risk Disclosure',
        validation: 'checkbox'
      },
      mandateAgreement: {
        fieldName: 'mandateAgreement',
        label: 'Mandate Agreement',
        validation: 'checkbox'
      },
      tradingRules: {
        fieldName: 'tradingRules',
        label: 'Trading Rules',
        validation: 'checkbox'
      },
      personalAccessPassword: {
        fieldName: 'personalAccessPassword',
        label: 'Personal Access Password',
        validation: 'checkbox'
      }
    },
    conditionalFields: {}
  }
};

// Import validation helpers
import { validateEmail, validateDateOfBirth, validatePhoneWithCountryCode } from '../../../common/helpers';

/**
 * Efficient validation function that uses the field mappings
 * @param {number} stepIndex - The step to validate (0-5)
 * @param {Object} data - The form data for this step
 * @returns {Object} - { isValid: boolean, errors: string[], fieldErrors: Object }
 */
export const validateStepEfficiently = (stepIndex, data) => {
  const stepMapping = STEP_FIELD_MAPPINGS[stepIndex];
  if (!stepMapping) {
    return { isValid: true, errors: [], fieldErrors: {} };
  }

  const errors = [];
  const fieldErrors = {};

  // Step 0 has no validation
  if (stepIndex === 0) {
    return { isValid: true, errors: [], fieldErrors: {} };
  }

  // Validate required fields
  Object.entries(stepMapping.requiredFields).forEach(([key, fieldConfig]) => {
    const { fieldName, label, validation, documentKey } = fieldConfig;
    
    switch (validation) {
      case 'required':
        if (!data[fieldName]?.trim()) {
          errors.push(`${label} is required`);
          fieldErrors[fieldName] = true;
        }
        break;
        
      case 'email':
        if (stepIndex === 1) {
          // Step 1 email validation (required)
          const emailValidation = validateEmail(data[fieldName], true, label);
          if (!emailValidation.isValid) {
            errors.push(emailValidation.error);
            fieldErrors[fieldName] = true;
          }
        } else if (stepIndex === 4) {
          // Step 4 email validation - authorize person email is required
          if (!data[fieldName]?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors[fieldName] = true;
          } else {
            const emailValidation = validateEmail(data[fieldName], false, label);
            if (!emailValidation.isValid) {
              errors.push('Please enter a valid email address for authorize person');
              fieldErrors[fieldName] = true;
            }
          }
        }
        break;
        
      case 'phone':
        if (stepIndex === 2) {
          // Office phone validation - check if empty first, then validate format
          if (!data.officePhoneNumber?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors.officePhoneNumber = true;
          } else {
            const phoneValidation = validatePhoneWithCountryCode(data.officePhoneNumber, data.countryCode, false, 'office phone number');
            if (!phoneValidation.isValid) {
              errors.push(phoneValidation.error);
              fieldErrors.officePhoneNumber = true;
            }
          }
        } else if (stepIndex === 4) {
          // Authorize person phone validation - check if empty first, then validate format
          if (!data.authorizePersonPhoneNumber?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors.authorizePersonPhoneNumber = true;
          } else {
            const phoneValidation = validatePhoneWithCountryCode(data.authorizePersonPhoneNumber, data.authorizePersonCountryCode, false, 'phone number');
            if (!phoneValidation.isValid) {
              errors.push(phoneValidation.error);
              fieldErrors.authorizePersonPhoneNumber = true;
            }
          }
        }
        break;
        
      case 'dateOfBirth':
        // Date of birth is required - check if empty first, then validate age
        if (!data[fieldName]?.trim()) {
          errors.push(`${label} is required`);
          fieldErrors[fieldName] = true;
        } else {
          const dobValidation = validateDateOfBirth(data[fieldName], false, 21, label);
          if (!dobValidation.isValid) {
            errors.push(dobValidation.error);
            fieldErrors[fieldName] = true;
          }
        }
        break;
        
      case 'file':
        if (stepIndex === 3) {
          // Document upload validation
          const uploadedDocs = data.uploadedDocuments || {};
          if (!uploadedDocs[documentKey]) {
            errors.push(`${label} is required`);
            fieldErrors[`document_${documentKey}`] = true;
          }
        } else if (stepIndex === 4) {
          // Authorize person passport validation
          if (!data[fieldName]) {
            errors.push(`${label} is required`);
            fieldErrors[fieldName] = true;
          }
        }
        break;
        
      case 'checkbox':
        if (!data[fieldName]) {
          errors.push(`Please agree to ${label}`);
          fieldErrors[fieldName] = true;
        }
        break;
    }
  });

  // Validate conditional fields
  Object.entries(stepMapping.conditionalFields).forEach(([key, fieldConfig]) => {
    const { fieldName, label, condition, validation } = fieldConfig;
    
    if (condition(data)) {
      if (validation === 'required' && !data[fieldName]?.trim()) {
        errors.push(`Please specify the ${label.toLowerCase()}`);
        fieldErrors[fieldName] = true;
      }
    }
  });

  // Special validation for Step 4 bank accounts
  if (stepIndex === 4) {
    if (!data.bankAccounts || data.bankAccounts.length === 0) {
      errors.push('At least one bank account is required');
      // Add field errors for all bank account fields
      Object.keys(stepMapping.bankAccountFields).forEach(field => {
        fieldErrors[field] = true;
      });
    } else {
      const hasValidBankAccount = data.bankAccounts.some(account => 
        account.bankName?.trim() || account.accountName?.trim() || account.bankAddress?.trim() ||
        account.bankCity?.trim() || account.bankCountry?.trim() || account.swiftCode?.trim() || account.accountNo?.trim()
      );
      
      if (!hasValidBankAccount) {
        errors.push('At least one bank account is required');
        Object.keys(stepMapping.bankAccountFields).forEach(field => {
          fieldErrors[field] = true;
        });
      } else {
        // Validate each bank account
        data.bankAccounts.forEach((account, index) => {
          Object.entries(stepMapping.bankAccountFields).forEach(([field, config]) => {
            if (!account[field]?.trim()) {
              errors.push(`Bank ${index + 1} - ${config.label} is required`);
              fieldErrors[`${field}_${index}`] = true;
            }
          });
          
          // Validate conditional bank account fields
          Object.entries(stepMapping.bankAccountConditionalFields).forEach(([field, config]) => {
            if (config.condition(account) && !account[field]?.trim()) {
              errors.push(`Bank ${index + 1} - Please specify other country`);
              fieldErrors[`${field}_${index}`] = true;
            }
          });
        });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    fieldErrors
  };
};

/**
 * Get all required field names for a specific step
 * @param {number} stepIndex - The step index (0-5)
 * @returns {string[]} - Array of field names
 */
export const getRequiredFieldsForStep = (stepIndex) => {
  const stepMapping = STEP_FIELD_MAPPINGS[stepIndex];
  if (!stepMapping) return [];
  
  const fields = Object.values(stepMapping.requiredFields).map(config => config.fieldName);
  
  if (stepIndex === 4) {
    // Add bank account fields
    fields.push(...Object.values(stepMapping.bankAccountFields).map(config => config.fieldName));
  }
  
  return fields;
};

/**
 * Get all conditional field names for a specific step
 * @param {number} stepIndex - The step index (0-5)
 * @param {Object} data - Current form data to evaluate conditions
 * @returns {string[]} - Array of conditional field names that are currently required
 */
export const getConditionalFieldsForStep = (stepIndex, data) => {
  const stepMapping = STEP_FIELD_MAPPINGS[stepIndex];
  if (!stepMapping) return [];
  
  return Object.values(stepMapping.conditionalFields)
    .filter(config => config.condition(data))
    .map(config => config.fieldName);
};
