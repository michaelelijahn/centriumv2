// Exact field mappings extracted from ForeignPersonForm validation functions
// No assumptions - only field names that exist in the actual validation code

export const STEP_FIELD_MAPPINGS = {
  // Step 0 - Requirements (no validation needed)
  0: {
    requiredFields: {},
    conditionalFields: {}
  },

  // Step 1 - Personal Email Registration (validatePersonalEmailStep lines 145-158)
  1: {
    requiredFields: {
      email: {
        fieldName: 'email',
        label: 'Personal email address',
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

  // Step 2 - Personal Data (validatePersonalDataStep lines 160-223)
  2: {
    requiredFields: {
      fullName: {
        fieldName: 'fullName',
        label: 'Full Name',
        validation: 'required'
      },
      placeOfBirth: {
        fieldName: 'placeOfBirth',
        label: 'Place of Birth',
        validation: 'required'
      },
      dateOfBirth: {
        fieldName: 'dateOfBirth',
        label: 'Date of Birth',
        validation: 'dateOfBirth'
      },
      passportId: {
        fieldName: 'passportId',
        label: 'Passport ID Number',
        validation: 'required'
      },
      gender: {
        fieldName: 'gender',
        label: 'Gender',
        validation: 'required'
      },
      maritalStatus: {
        fieldName: 'maritalStatus',
        label: 'Marital Status',
        validation: 'required'
      },
      citizen: {
        fieldName: 'citizen',
        label: 'Citizenship',
        validation: 'required'
      },
      countryCode: {
        fieldName: 'countryCode',
        label: 'Country Code',
        validation: 'required'
      },
      phoneNumber: {
        fieldName: 'phoneNumber',
        label: 'Phone Number',
        validation: 'phone'
      },
      contactEmail: {
        fieldName: 'contactEmail',
        label: 'Email',
        validation: 'email'
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
        label: 'Postal Code',
        validation: 'required'
      },
      country: {
        fieldName: 'country',
        label: 'Country',
        validation: 'required'
      },
      accountOpeningPurpose: {
        fieldName: 'accountOpeningPurpose',
        label: 'Account Opening Purpose',
        validation: 'required'
      },
      investmentExperience: {
        fieldName: 'investmentExperience',
        label: 'Investment Experience',
        validation: 'required'
      },
      familyInBappebti: {
        fieldName: 'familyInBappebti',
        label: 'Family in BAPPEBTI',
        validation: 'required'
      },
      declaredBankrupt: {
        fieldName: 'declaredBankrupt',
        label: 'Bankruptcy Declaration',
        validation: 'required'
      }
    },
    conditionalFields: {
      citizenOther: {
        fieldName: 'citizenOther',
        label: 'Other citizenship',
        condition: (data) => data.citizen === 'OTHER',
        validation: 'required'
      },
      countryOther: {
        fieldName: 'countryOther',
        label: 'Other country',
        condition: (data) => data.country === 'OTHER',
        validation: 'required'
      },
      accountOpeningPurposeOther: {
        fieldName: 'accountOpeningPurposeOther',
        label: 'Other account opening purpose',
        condition: (data) => data.accountOpeningPurpose === 'Others',
        validation: 'required'
      },
      investmentExperienceDetails: {
        fieldName: 'investmentExperienceDetails',
        label: 'Investment experience details',
        condition: (data) => data.investmentExperience === 'Yes',
        validation: 'required'
      }
    }
  },

  // Step 3 - Emergency Contact (validateEmergencyContactStep lines 225-266)
  3: {
    requiredFields: {
      emergencyContactName: {
        fieldName: 'emergencyContactName',
        label: 'Emergency Contact Full Name',
        validation: 'required'
      },
      emergencyContactRelationship: {
        fieldName: 'emergencyContactRelationship',
        label: 'Relationship',
        validation: 'required'
      },
      emergencyContactCountryCode: {
        fieldName: 'emergencyContactCountryCode',
        label: 'Emergency Contact Country Code',
        validation: 'required'
      },
      emergencyContactPhoneNumber: {
        fieldName: 'emergencyContactPhoneNumber',
        label: 'Emergency Contact Phone Number',
        validation: 'phone'
      },
      emergencyContactStreetAddress: {
        fieldName: 'emergencyContactStreetAddress',
        label: 'Emergency Contact Street Address',
        validation: 'required'
      },
      emergencyContactCity: {
        fieldName: 'emergencyContactCity',
        label: 'Emergency Contact City',
        validation: 'required'
      },
      emergencyContactPostalCode: {
        fieldName: 'emergencyContactPostalCode',
        label: 'Emergency Contact Postal Code',
        validation: 'required'
      },
      emergencyContactCountry: {
        fieldName: 'emergencyContactCountry',
        label: 'Emergency Contact Country',
        validation: 'required'
      },
      emergencyContactEmail: {
        fieldName: 'emergencyContactEmail',
        label: 'Emergency Contact Email',
        validation: 'email'
      }
    },
    conditionalFields: {
      emergencyContactRelationshipOther: {
        fieldName: 'emergencyContactRelationshipOther',
        label: 'Other relationship',
        condition: (data) => data.emergencyContactRelationship === 'OTHER',
        validation: 'required'
      },
      emergencyContactCountryOther: {
        fieldName: 'emergencyContactCountryOther',
        label: 'Other emergency contact country',
        condition: (data) => data.emergencyContactCountry === 'OTHER',
        validation: 'required'
      }
    }
  },

  // Step 4 - Employment Data (validateEmploymentDataStep lines 268-306)
  4: {
    requiredFields: {
      employmentStatus: {
        fieldName: 'employmentStatus',
        label: 'Employment Status',
        validation: 'required'
      }
    },
    conditionalFields: {},
    // Employment fields that are required when employmentStatus is 'WORK' or 'ENTREPRENEUR'
    employmentFields: {
      companyName: {
        fieldName: 'companyName',
        label: 'Company Name',
        validation: 'required'
      },
      businessNature: {
        fieldName: 'businessNature',
        label: 'Nature of Business',
        validation: 'required'
      },
      position: {
        fieldName: 'position',
        label: 'Position',
        validation: 'required'
      },
      lengthOfWork: {
        fieldName: 'lengthOfWork',
        label: 'Length of Work',
        validation: 'required'
      },
      officeCountryCode: {
        fieldName: 'officeCountryCode',
        label: 'Office Country Code',
        validation: 'required'
      },
      officePhoneNumber: {
        fieldName: 'officePhoneNumber',
        label: 'Office Phone Number',
        validation: 'phone'
      },
      officeStreetAddress: {
        fieldName: 'officeStreetAddress',
        label: 'Office Street Address',
        validation: 'required'
      },
      officeCity: {
        fieldName: 'officeCity',
        label: 'Office City',
        validation: 'required'
      },
      officePostalCode: {
        fieldName: 'officePostalCode',
        label: 'Office Postal Code',
        validation: 'required'
      },
      officeCountry: {
        fieldName: 'officeCountry',
        label: 'Office Country',
        validation: 'required'
      }
    },
    employmentConditionalFields: {
      officeCountryOther: {
        fieldName: 'officeCountryOther',
        label: 'Other office country',
        condition: (data) => data.officeCountry === 'OTHER',
        validation: 'required'
      }
    }
  },

  // Step 5 - Bank Accounts (validateBankAccountStep lines 308-338)
  5: {
    requiredFields: {},
    conditionalFields: {},
    // Bank account fields validation (at least one bank account required)
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

  // Step 6 - Document Upload (validateDocumentUploadStep lines 340-356)
  6: {
    requiredFields: {
      '0_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '0_0',
        label: 'Passport',
        validation: 'file'
      },
      '0_1': {
        fieldName: 'uploadedDocuments',
        documentKey: '0_1',
        label: 'Photo Selfie',
        validation: 'file'
      },
      '1_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '1_0',
        label: 'Bank Account Statement or Credit Card Bill',
        validation: 'file'
      },
      '2_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '2_0',
        label: 'Telephone or Electricity Bill',
        validation: 'file'
      }
    },
    conditionalFields: {},
    // Optional documents
    optionalFields: {
      '3_0': {
        fieldName: 'uploadedDocuments',
        documentKey: '3_0',
        label: 'Personal Tax Document',
        validation: 'file'
      }
    }
  },

  // Step 7 - Review & Submit (validateReviewStep lines 358-390)
  7: {
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
 * @param {number} stepIndex - The step to validate (0-7)
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
        } else if (stepIndex === 2) {
          // Step 2 contactEmail validation - required
          if (!data[fieldName]?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors[fieldName] = true;
          } else {
            const emailValidation = validateEmail(data[fieldName], false, label);
            if (!emailValidation.isValid) {
              errors.push('Please enter a valid email address');
              fieldErrors[fieldName] = true;
            }
          }
        } else if (stepIndex === 3) {
          // Step 3 emergencyContactEmail validation - required
          if (!data[fieldName]?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors[fieldName] = true;
          } else {
            const emailValidation = validateEmail(data[fieldName], false, 'Emergency contact email');
            if (!emailValidation.isValid) {
              errors.push('Please enter a valid email address for emergency contact');
              fieldErrors[fieldName] = true;
            }
          }
        }
        break;
        
      case 'phone':
        if (stepIndex === 2) {
          // Personal phone validation
          if (!data.phoneNumber?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors.phoneNumber = true;
          } else {
            const phoneValidation = validatePhoneWithCountryCode(data.phoneNumber, data.countryCode, false, 'phone number');
            if (!phoneValidation.isValid) {
              errors.push(phoneValidation.error);
              fieldErrors.phoneNumber = true;
            }
          }
        } else if (stepIndex === 3) {
          // Emergency contact phone validation
          if (!data.emergencyContactPhoneNumber?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors.emergencyContactPhoneNumber = true;
          } else {
            const phoneValidation = validatePhoneWithCountryCode(data.emergencyContactPhoneNumber, data.emergencyContactCountryCode, false, 'emergency contact phone number');
            if (!phoneValidation.isValid) {
              errors.push(phoneValidation.error);
              fieldErrors.emergencyContactPhoneNumber = true;
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
        if (stepIndex === 6) {
          // Document upload validation
          const uploadedDocs = data.uploadedDocuments || {};
          if (!uploadedDocs[documentKey]) {
            errors.push(`${label} is required`);
            fieldErrors[`document_${documentKey}`] = true;
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

  // Special validation for Step 4 employment fields
  if (stepIndex === 4 && (data.employmentStatus === 'WORK' || data.employmentStatus === 'ENTREPRENEUR')) {
    Object.entries(stepMapping.employmentFields).forEach(([key, fieldConfig]) => {
      const { fieldName, label, validation } = fieldConfig;
      
      if (validation === 'required' && !data[fieldName]?.trim()) {
        errors.push(`${label} is required`);
        fieldErrors[fieldName] = true;
      } else if (validation === 'phone') {
        // Office phone validation
        if (!data.officePhoneNumber?.trim()) {
          errors.push(`${label} is required`);
          fieldErrors.officePhoneNumber = true;
        } else {
          const phoneValidation = validatePhoneWithCountryCode(data.officePhoneNumber, data.officeCountryCode, false, 'office phone number');
          if (!phoneValidation.isValid) {
            errors.push(phoneValidation.error);
            fieldErrors.officePhoneNumber = true;
          }
        }
      }
    });
    
    // Validate employment conditional fields
    Object.entries(stepMapping.employmentConditionalFields).forEach(([key, fieldConfig]) => {
      const { fieldName, label, condition, validation } = fieldConfig;
      
      if (condition(data) && !data[fieldName]?.trim()) {
        errors.push(`Please specify other office country`);
        fieldErrors[fieldName] = true;
      }
    });
  }

  // Special validation for Step 5 bank accounts
  if (stepIndex === 5) {
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
 * @param {number} stepIndex - The step index (0-7)
 * @returns {string[]} - Array of field names
 */
export const getRequiredFieldsForStep = (stepIndex) => {
  const stepMapping = STEP_FIELD_MAPPINGS[stepIndex];
  if (!stepMapping) return [];
  
  const fields = Object.values(stepMapping.requiredFields).map(config => config.fieldName);
  
  if (stepIndex === 4) {
    // Add employment fields
    fields.push(...Object.values(stepMapping.employmentFields).map(config => config.fieldName));
  }
  
  if (stepIndex === 5) {
    // Add bank account fields
    fields.push(...Object.values(stepMapping.bankAccountFields).map(config => config.fieldName));
  }
  
  return fields;
};

/**
 * Get all conditional field names for a specific step
 * @param {number} stepIndex - The step index (0-7)
 * @param {Object} data - Current form data to evaluate conditions
 * @returns {string[]} - Array of conditional field names that are currently required
 */
export const getConditionalFieldsForStep = (stepIndex, data) => {
  const stepMapping = STEP_FIELD_MAPPINGS[stepIndex];
  if (!stepMapping) return [];
  
  const conditionalFields = Object.values(stepMapping.conditionalFields)
    .filter(config => config.condition(data))
    .map(config => config.fieldName);
    
  if (stepIndex === 4 && stepMapping.employmentConditionalFields) {
    conditionalFields.push(...Object.values(stepMapping.employmentConditionalFields)
      .filter(config => config.condition(data))
      .map(config => config.fieldName));
  }
  
  return conditionalFields;
};
