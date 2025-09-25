// Exact field mappings extracted from IndonesianCompanyForm validation functions
// No assumptions - only field names that exist in the actual validation code

export const STEP_FIELD_MAPPINGS = {
  // Step 0 - Requirements (no validation needed)
  0: {
    requiredFields: {},
    conditionalFields: {}
  },

  // Step 1 - Email Registration (validateEmailStep lines 148-162)
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

  // Step 2 - Company Details (validateCompanyDetailsStep lines 164-285)
  2: {
    requiredFields: {
      companyName: {
        fieldName: 'companyName',
        label: 'Company Name',
        validation: 'required'
      },
      businessLicenseNo: {
        fieldName: 'businessLicenseNo',
        label: 'Business License Number',
        validation: 'required'
      },
      businessEntity: {
        fieldName: 'businessEntity',
        label: 'Business Entity',
        validation: 'required'
      },
      companyNPWP: {
        fieldName: 'companyNPWP',
        label: 'Company NPWP',
        validation: 'required'
      },
      streetName: {
        fieldName: 'streetName',
        label: 'Company Address',
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
      placeOfEstablishment: {
        fieldName: 'placeOfEstablishment',
        label: 'Place of Establishment',
        validation: 'required'
      },
      establishmentDate: {
        fieldName: 'establishmentDate',
        label: 'Establishment Date',
        validation: 'required'
      },
      legalForm: {
        fieldName: 'legalForm',
        label: 'Legal Form',
        validation: 'required'
      },
      officeTelephoneCountryCode: {
        fieldName: 'officeTelephoneCountryCode',
        label: 'Office Telephone Country Code',
        validation: 'required'
      },
      officeTelephoneNo: {
        fieldName: 'officeTelephoneNo',
        label: 'Office Telephone Number',
        validation: 'indonesianPhone'
      },
      beneficialOwnerName: {
        fieldName: 'beneficialOwnerName',
        label: 'Beneficial Owner Name',
        validation: 'required'
      },
      beneficialOwnerIdNo: {
        fieldName: 'beneficialOwnerIdNo',
        label: 'Beneficial Owner ID Number',
        validation: 'required'
      },
      sourceOfFunds: {
        fieldName: 'sourceOfFunds',
        label: 'Source of Funds',
        validation: 'required'
      },
      accountPurpose: {
        fieldName: 'accountPurpose',
        label: 'Account Purpose',
        validation: 'required'
      },
      authorizedPersonName: {
        fieldName: 'authorizedPersonName',
        label: 'Authorized Person Name',
        validation: 'required'
      },
      authorizedDebitPerson: {
        fieldName: 'authorizedDebitPerson',
        label: 'Authorized Debit Person',
        validation: 'required'
      }
    },
    conditionalFields: {
      legalFormOther: {
        fieldName: 'legalFormOther',
        label: 'Other legal form',
        condition: (data) => data.legalForm === 'OTHER',
        validation: 'required'
      },
      sourceOfFundsOther: {
        fieldName: 'sourceOfFundsOther',
        label: 'Other source of funds',
        condition: (data) => data.sourceOfFunds === 'OTHER',
        validation: 'required'
      },
      accountPurposeOther: {
        fieldName: 'accountPurposeOther',
        label: 'Other account purpose',
        condition: (data) => data.accountPurpose === 'OTHER',
        validation: 'required'
      }
    },
    // Bank accounts validation (lines 224-282)
    bankAccountFields: {
      bankName: {
        fieldName: 'bankName',
        label: 'Nama Bank',
        validation: 'required'
      },
      branch: {
        fieldName: 'branch',
        label: 'Cabang',
        validation: 'required'
      },
      accountNo: {
        fieldName: 'accountNo',
        label: 'No. Rekening',
        validation: 'required'
      },
      accountHolderName: {
        fieldName: 'accountHolderName',
        label: 'Account Holder Name',
        validation: 'required'
      },
      bankTelephoneCountryCode: {
        fieldName: 'bankTelephoneCountryCode',
        label: 'Bank Telephone Country Code',
        validation: 'required'
      },
      bankTelephoneNo: {
        fieldName: 'bankTelephoneNo',
        label: 'Bank Telephone No.',
        validation: 'indonesianBankPhone'
      },
      bankAccountType: {
        fieldName: 'bankAccountType',
        label: 'Bank Account Type',
        validation: 'required'
      }
    },
    bankAccountConditionalFields: {
      bankAccountTypeOther: {
        fieldName: 'bankAccountTypeOther',
        label: 'Other bank account type',
        condition: (account) => account.bankAccountType === 'LAINNYA',
        validation: 'required'
      }
    }
  },

  // Step 3 - Company Documents (validateCompanyDocumentsStep lines 287-309)
  3: {
    requiredFields: {
      articlesOfAssociation: {
        fieldName: 'articlesOfAssociation',
        label: 'Scan Anggaran Dasar Perusahaan (Scan Company\'s Articles of Association)',
        validation: 'file'
      },
      certificateOfIncorporation: {
        fieldName: 'certificateOfIncorporation',
        label: 'Scan Nomor Izin Usaha (Scan Certificate of Incorporation)',
        validation: 'file'
      },
      financialStatements: {
        fieldName: 'financialStatements',
        label: 'Laporan Keuangan / Deskripsi Kegiatan Usaha (Financial Statements / Description of Business Activities)',
        validation: 'file'
      },
      managementStructure: {
        fieldName: 'managementStructure',
        label: 'Struktur Manajemen (Management Structure)',
        validation: 'file'
      },
      ownershipStructure: {
        fieldName: 'ownershipStructure',
        label: 'Struktur Kepemilikan (Ownership Structure)',
        validation: 'file'
      },
      boardOfResolutionFile: {
        fieldName: 'boardOfResolutionFile',
        label: 'Spesimen Tanda Tangan Pihak Yang Melaksanakan Transaksi (Board of Resolution)',
        validation: 'file'
      },
      powerOfAttorneyFile: {
        fieldName: 'powerOfAttorneyFile',
        label: 'Surat Kuasa (Power of Attorney)',
        validation: 'file'
      }
    },
    conditionalFields: {}
  },

  // Step 4 - Power of Attorney (validatePowerOfAttorneyStep lines 311-491)
  4: {
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
      idPassportNo: {
        fieldName: 'idPassportNo',
        label: 'ID/Passport Number',
        validation: 'required'
      },
      npwpNo: {
        fieldName: 'npwpNo',
        label: 'NPWP Number',
        validation: 'required'
      },
      gender: {
        fieldName: 'gender',
        label: 'Gender',
        validation: 'required'
      },
      motherName: {
        fieldName: 'motherName',
        label: 'Mother Name',
        validation: 'required'
      },
      maritalStatus: {
        fieldName: 'maritalStatus',
        label: 'Marital Status',
        validation: 'required'
      },
      nationality: {
        fieldName: 'nationality',
        label: 'Nationality',
        validation: 'required'
      },
      streetAddress: {
        fieldName: 'streetAddress',
        label: 'Street Address',
        validation: 'required'
      },
      addressCity: {
        fieldName: 'addressCity',
        label: 'City',
        validation: 'required'
      },
      addressPostalCode: {
        fieldName: 'addressPostalCode',
        label: 'Postal Code',
        validation: 'required'
      },
      homeTelephoneNo: {
        fieldName: 'homeTelephoneNo',
        label: 'Home Telephone Number',
        validation: 'indonesianPhone'
      },
      handphoneNo: {
        fieldName: 'handphoneNo',
        label: 'Handphone Number',
        validation: 'indonesianPhone'
      },
      personalEmail: {
        fieldName: 'personalEmail',
        label: 'Email',
        validation: 'email'
      },
      homeOwnershipStatus: {
        fieldName: 'homeOwnershipStatus',
        label: 'Home Ownership Status',
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
        validation: 'radioInvestment'
      },
      futuresTradingExperience: {
        fieldName: 'futuresTradingExperience',
        label: 'Futures Trading Experience',
        validation: 'radioYaTidak'
      },
      familyInBappebti: {
        fieldName: 'familyInBappebti',
        label: 'Family in BAPPEBTI',
        validation: 'radioYaTidak'
      },
      declaredBankrupt: {
        fieldName: 'declaredBankrupt',
        label: 'Bankruptcy Declaration',
        validation: 'radioYaTidak'
      },
      emergencyContactName: {
        fieldName: 'emergencyContactName',
        label: 'Emergency Contact Name',
        validation: 'required'
      },
      emergencyContactHandphone: {
        fieldName: 'emergencyContactHandphone',
        label: 'Emergency Contact Handphone',
        validation: 'indonesianPhone'
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
      emergencyContactRelationship: {
        fieldName: 'emergencyContactRelationship',
        label: 'Emergency Contact Relationship',
        validation: 'required'
      },
      jobOfPowerOfAttorney: {
        fieldName: 'jobOfPowerOfAttorney',
        label: 'Job of Power of Attorney',
        validation: 'required'
      },
      annualIncome: {
        fieldName: 'annualIncome',
        label: 'Annual Income',
        validation: 'required'
      },
      houseLocation: {
        fieldName: 'houseLocation',
        label: 'House Location',
        validation: 'required'
      },
      njopValue: {
        fieldName: 'njopValue',
        label: 'NJOP Value',
        validation: 'required'
      },
      bankDeposit: {
        fieldName: 'bankDeposit',
        label: 'Bank Deposit',
        validation: 'required'
      },
      totalAmount: {
        fieldName: 'totalAmount',
        label: 'Total Amount',
        validation: 'required'
      }
    },
    conditionalFields: {
      nationalityOther: {
        fieldName: 'nationalityOther',
        label: 'Other nationality',
        condition: (data) => data.nationality === 'OTHER',
        validation: 'required'
      },
      homeOwnershipStatusOther: {
        fieldName: 'homeOwnershipStatusOther',
        label: 'Other home ownership status',
        condition: (data) => data.homeOwnershipStatus === 'LAINNYA',
        validation: 'required'
      },
      accountOpeningPurposeOther: {
        fieldName: 'accountOpeningPurposeOther',
        label: 'Other account opening purpose',
        condition: (data) => data.accountOpeningPurpose === 'LAINNYA',
        validation: 'required'
      },
      investmentExperienceExplanation: {
        fieldName: 'investmentExperienceExplanation',
        label: 'Investment experience details',
        condition: (data) => data.investmentExperience === 'YA_BIDANG',
        validation: 'required'
      },
      jobOfPowerOfAttorneyOther: {
        fieldName: 'jobOfPowerOfAttorneyOther',
        label: 'Other job of power of attorney',
        condition: (data) => data.jobOfPowerOfAttorney === 'LAINNYA',
        validation: 'required'
      },
      emergencyContactRelationshipOther: {
        fieldName: 'emergencyContactRelationshipOther',
        label: 'Other emergency contact relationship',
        condition: (data) => data.emergencyContactRelationship === 'LAINNYA',
        validation: 'required'
      }
    },
    // Employment fields (conditional based on job type - lines 404-422)
    employmentFields: {
      employmentCompanyName: {
        fieldName: 'employmentCompanyName',
        label: 'Employment Company Name',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      businessField: {
        fieldName: 'businessField',
        label: 'Business Field',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      employmentPosition: {
        fieldName: 'employmentPosition',
        label: 'Employment Position',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      lengthOfWork: {
        fieldName: 'lengthOfWork',
        label: 'Length of Work',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      officeStreetAddress: {
        fieldName: 'officeStreetAddress',
        label: 'Office Street Address',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      officeCity: {
        fieldName: 'officeCity',
        label: 'Office City',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      officePostalCode: {
        fieldName: 'officePostalCode',
        label: 'Office Postal Code',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      officePhoneCountryCode: {
        fieldName: 'officePhoneCountryCode',
        label: 'Office Phone Country Code',
        validation: 'required',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      },
      officePhoneNo: {
        fieldName: 'officePhoneNo',
        label: 'Office Phone Number',
        validation: 'indonesianPhone',
        condition: (data) => ['SWASTA', 'WIRASWASTA', 'ASN'].includes(data.jobOfPowerOfAttorney)
      }
    }
  },

  // Step 5 - Personal Documents (validatePersonalDocumentsStep lines 493-513)
  5: {
    requiredFields: {
      currentAccountFile: {
        fieldName: 'currentAccountFile',
        label: 'Rekening Koran / Tagihan Kartu Kredit (Current Account / Credit Card Statement)',
        validation: 'file'
      },
      electricityPhoneAccountFile: {
        fieldName: 'electricityPhoneAccountFile',
        label: 'Rekening Listrik / Telepon (Electricity / Phone Account)',
        validation: 'file'
      },
      photoSelfiePersonalFile: {
        fieldName: 'photoSelfiePersonalFile',
        label: 'Foto Terkini (Photo Selfie)',
        validation: 'file'
      },
      identityPassportPersonalFile: {
        fieldName: 'identityPassportPersonalFile',
        label: 'KTP / SIM / Paspor (Identity No. / SIM / Passport)',
        validation: 'file'
      },
      npwpPersonalFile: {
        fieldName: 'npwpPersonalFile',
        label: 'NPWP (Tax Identification No.)',
        validation: 'file'
      }
    },
    conditionalFields: {}
  },

  // Step 6 - Read Statements (validateReadStatementsStep lines 515-585)
  6: {
    requiredFields: {
      companyProfileRead: {
        fieldName: 'companyProfileRead',
        label: 'Company Profile (Read)',
        validation: 'checkbox'
      },
      companyProfileUnderstanding: {
        fieldName: 'companyProfileUnderstanding',
        label: 'Company Profile (Understanding)',
        validation: 'checkbox'
      },
      statementRead: {
        fieldName: 'statementRead',
        label: 'Statement of Having Simulation (Read)',
        validation: 'checkbox'
      },
      statementUnderstanding: {
        fieldName: 'statementUnderstanding',
        label: 'Statement of Having Simulation (Understanding)',
        validation: 'checkbox'
      },
      experienceStatementRead: {
        fieldName: 'experienceStatementRead',
        label: 'Statement of Having Experience (Read)',
        validation: 'checkbox'
      },
      experienceUnderstanding: {
        fieldName: 'experienceUnderstanding',
        label: 'Statement of Having Experience (Understanding)',
        validation: 'checkbox'
      },
      applicationStatementRead: {
        fieldName: 'applicationStatementRead',
        label: 'Account Opening Application (Read)',
        validation: 'checkbox'
      },
      applicationUnderstanding: {
        fieldName: 'applicationUnderstanding',
        label: 'Account Opening Application (Understanding)',
        validation: 'checkbox'
      },
      riskDisclosureUnderstanding: {
        fieldName: 'riskDisclosureUnderstanding',
        label: 'Risk Disclosure (Understanding)',
        validation: 'checkbox'
      },
      mandateStatementRead: {
        fieldName: 'mandateStatementRead',
        label: 'Mandate Agreement (Read)',
        validation: 'checkbox'
      },
      baktiArbitration: {
        fieldName: 'baktiArbitration',
        label: 'BAKTI Arbitration Agreement',
        validation: 'checkbox'
      },
      mandateUnderstanding: {
        fieldName: 'mandateUnderstanding',
        label: 'Mandate Agreement (Understanding)',
        validation: 'checkbox'
      },
      tradingRulesRead: {
        fieldName: 'tradingRulesRead',
        label: 'Trading Rules (Read)',
        validation: 'checkbox'
      },
      tradingRulesUnderstanding: {
        fieldName: 'tradingRulesUnderstanding',
        label: 'Trading Rules (Understanding)',
        validation: 'checkbox'
      },
      personalAccessPasswordRead: {
        fieldName: 'personalAccessPasswordRead',
        label: 'Personal Access Password (Read)',
        validation: 'checkbox'
      },
      personalAccessPasswordUnderstanding: {
        fieldName: 'personalAccessPasswordUnderstanding',
        label: 'Personal Access Password (Understanding)',
        validation: 'checkbox'
      },
      tradingExperience: {
        fieldName: 'tradingExperience',
        label: 'Trading Experience',
        validation: 'required'
      },
      // Risk statements 1-14
      riskStatement1: {
        fieldName: 'riskStatement1',
        label: 'Risk Disclosure Statement 5.1 - Futures trading suitability and leverage risks',
        validation: 'checkbox'
      },
      riskStatement2: {
        fieldName: 'riskStatement2',
        label: 'Risk Disclosure Statement 5.2 - Unlimited loss potential beyond margin',
        validation: 'checkbox'
      },
      riskStatement3: {
        fieldName: 'riskStatement3',
        label: 'Risk Disclosure Statement 5.3 - No guaranteed profit warnings',
        validation: 'checkbox'
      },
      riskStatement4: {
        fieldName: 'riskStatement4',
        label: 'Risk Disclosure Statement 5.4 - Leverage and rapid loss mechanisms',
        validation: 'checkbox'
      },
      riskStatement5: {
        fieldName: 'riskStatement5',
        label: 'Risk Disclosure Statement 5.5 - Position liquidation difficulties',
        validation: 'checkbox'
      },
      riskStatement6: {
        fieldName: 'riskStatement6',
        label: 'Risk Disclosure Statement 5.6 - Risk management limitations',
        validation: 'checkbox'
      },
      riskStatement7: {
        fieldName: 'riskStatement7',
        label: 'Risk Disclosure Statement 5.7 - Physical delivery obligations',
        validation: 'checkbox'
      },
      riskStatement8: {
        fieldName: 'riskStatement8',
        label: 'Risk Disclosure Statement 5.8 - System failure risks',
        validation: 'checkbox'
      },
      riskStatement9: {
        fieldName: 'riskStatement9',
        label: 'Risk Disclosure Statement 5.9 - Trading strategy risks',
        validation: 'checkbox'
      },
      riskStatement10: {
        fieldName: 'riskStatement10',
        label: 'Risk Disclosure Statement 5.10 - Day trading specific risks',
        validation: 'checkbox'
      },
      riskStatement11: {
        fieldName: 'riskStatement11',
        label: 'Risk Disclosure Statement 5.11 - Stop loss order limitations',
        validation: 'checkbox'
      },
      riskStatement12: {
        fieldName: 'riskStatement12',
        label: 'Risk Disclosure Statement 5.12 - Mandate agreement requirements',
        validation: 'checkbox'
      },
      riskStatement13: {
        fieldName: 'riskStatement13',
        label: 'Risk Disclosure Statement 5.13 - Comprehensive risk understanding',
        validation: 'checkbox'
      },
      riskStatement14: {
        fieldName: 'riskStatement14',
        label: 'Risk Disclosure Statement 5.14 - Indonesian language documentation',
        validation: 'checkbox'
      }
    },
    conditionalFields: {
      brokerCompany: {
        fieldName: 'brokerCompany',
        label: 'Broker company name',
        condition: (data) => data.tradingExperience === 'ya',
        validation: 'required'
      },
      demoAccountNumber: {
        fieldName: 'demoAccountNumber',
        label: 'Demo account number',
        condition: (data) => data.tradingExperience === 'ya',
        validation: 'required'
      }
    }
  },

  // Step 7 - Review & Submit (validateReviewStep lines 587-591)
  7: {
    requiredFields: {},
    conditionalFields: {}
  }
};

// Import validation helpers - these should exist in your common helpers
import { validateEmail, validateDateOfBirth } from '../../../common/helpers';

/**
 * Indonesian phone validation helper
 * @param {string} phoneNumber - The phone number (should contain +62 prefix)
 * @param {string} fieldLabel - Field label for error message
 * @returns {Object} - { isValid: boolean, error: string }
 */
const validateIndonesianPhone = (phoneNumber, fieldLabel) => {
  if (!phoneNumber?.trim()) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }

  // Remove +62 prefix and spaces for validation
  const cleanNumber = phoneNumber.replace(/^\+62\s*/, '').replace(/\D/g, '');
  
  // Check if starts with 0 (not allowed for Indonesian numbers with +62)
  if (cleanNumber.startsWith('0')) {
    return { isValid: false, error: `${fieldLabel} cannot start with 0` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Indonesian bank phone validation (similar to regular phone but specific for bank accounts)
 * @param {string} phoneNumber - The bank phone number
 * @param {string} countryCode - The country code (should be +62)
 * @param {string} fieldLabel - Field label for error message
 * @returns {Object} - { isValid: boolean, error: string }
 */
const validateIndonesianBankPhone = (phoneNumber, countryCode, fieldLabel) => {
  if (!phoneNumber?.trim()) {
    return { isValid: false, error: `${fieldLabel} is required` };
  }
  
  if (!countryCode?.trim()) {
    return { isValid: false, error: 'Bank Telephone Country Code is required' };
  }
  
  // For bank phones, validate that the phone after country code has at least 4 digits
  const phoneWithoutCode = phoneNumber.replace(countryCode, '').trim();
  if (!phoneWithoutCode || phoneWithoutCode.length < 4) {
    return { isValid: false, error: `${fieldLabel} requires at least 4 digits after the country code` };
  }
  
  return { isValid: true, error: '' };
};

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
    const { fieldName, label, validation } = fieldConfig;
    
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
          if (!data[fieldName]?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors[fieldName] = true;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[fieldName])) {
            errors.push('Please enter a valid email address');
            fieldErrors[fieldName] = true;
          }
        } else if (stepIndex === 4) {
          // Step 4 email validation - personal email is required
          if (!data[fieldName]?.trim()) {
            errors.push(`${label} is required`);
            fieldErrors[fieldName] = true;
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[fieldName])) {
            errors.push('Please enter a valid email address');
            fieldErrors[fieldName] = true;
          }
        }
        break;
        
      case 'indonesianPhone':
        const phoneValidation = validateIndonesianPhone(data[fieldName], label);
        if (!phoneValidation.isValid) {
          errors.push(phoneValidation.error);
          fieldErrors[fieldName] = true;
        }
        break;
        
      case 'indonesianBankPhone':
        // This is for bank account phone validation
        const bankPhoneValidation = validateIndonesianBankPhone(
          data[fieldName], 
          data.bankTelephoneCountryCode, 
          label
        );
        if (!bankPhoneValidation.isValid) {
          errors.push(bankPhoneValidation.error);
          fieldErrors[fieldName] = true;
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
        if (!data[fieldName]) {
          errors.push(`Required document missing: ${label}`);
          fieldErrors[fieldName] = true;
        }
        break;
        
      case 'checkbox':
        if (!data[fieldName]) {
          errors.push(`Please read and acknowledge ${label}`);
          fieldErrors[fieldName] = true;
        }
        break;
        
      case 'radioInvestment':
        // Investment experience can be 'YA_BIDANG' or 'TIDAK'
        if (!data[fieldName] || !['YA_BIDANG', 'TIDAK'].includes(data[fieldName])) {
          errors.push(`${label} is required`);
          fieldErrors[fieldName] = true;
        }
        break;
        
      case 'radioYaTidak':
        // Other radio fields use 'YA' or 'TIDAK'
        if (!data[fieldName] || !['YA', 'TIDAK'].includes(data[fieldName])) {
          errors.push(`${label} is required`);
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

  // Special validation for Step 2 bank accounts
  if (stepIndex === 2) {
    if (!data.bankAccounts || data.bankAccounts.length === 0) {
      // Add errors for the default bank account fields
      Object.keys(stepMapping.bankAccountFields).forEach(field => {
        const config = stepMapping.bankAccountFields[field];
        errors.push(`Bank 1 - ${config.label} is required`);
        fieldErrors[field] = true;
      });
    } else {
      const hasValidBankAccount = data.bankAccounts.some(account => 
        account.bankName?.trim() || account.branch?.trim() || account.accountNo?.trim() ||
        account.accountHolderName?.trim() || account.bankTelephoneCountryCode?.trim() || 
        account.bankTelephoneNo?.trim() || account.bankAccountType?.trim()
      );
      
      if (!hasValidBankAccount) {
        Object.keys(stepMapping.bankAccountFields).forEach(field => {
          const config = stepMapping.bankAccountFields[field];
          errors.push(`Bank 1 - ${config.label} is required`);
          fieldErrors[field] = true;
        });
      } else {
        // Validate each bank account
        data.bankAccounts.forEach((account, index) => {
          const bankNumber = index + 1;
          
          Object.entries(stepMapping.bankAccountFields).forEach(([field, config]) => {
            if (config.validation === 'required' && !account[field]?.trim()) {
              errors.push(`Bank ${bankNumber} - ${config.label} is required`);
              fieldErrors[`${field}_${index}`] = true;
            } else if (config.validation === 'indonesianBankPhone') {
              const bankPhoneValidation = validateIndonesianBankPhone(
                account[field], 
                account.bankTelephoneCountryCode, 
                config.label
              );
              if (!bankPhoneValidation.isValid) {
                errors.push(`Bank ${bankNumber} - ${bankPhoneValidation.error}`);
                fieldErrors[`${field}_${index}`] = true;
              }
            }
          });
          
          // Validate conditional bank account fields
          Object.entries(stepMapping.bankAccountConditionalFields).forEach(([field, config]) => {
            if (config.condition(account) && !account[field]?.trim()) {
              errors.push(`Bank ${bankNumber} - Please specify the bank account type`);
              fieldErrors[`${field}_${index}`] = true;
            }
          });
        });
      }
    }
  }

  // Special validation for Step 4 employment fields
  if (stepIndex === 4 && stepMapping.employmentFields) {
    Object.entries(stepMapping.employmentFields).forEach(([field, config]) => {
      if (config.condition && config.condition(data)) {
        if (config.validation === 'required' && !data[field]?.trim()) {
          errors.push(`${config.label} is required`);
          fieldErrors[field] = true;
        } else if (config.validation === 'indonesianPhone') {
          const phoneValidation = validateIndonesianPhone(data[field], config.label);
          if (!phoneValidation.isValid) {
            errors.push(phoneValidation.error);
            fieldErrors[field] = true;
          }
        }
      }
    });
  }

  // Special validation for Step 4 disqualifying questions
  if (stepIndex === 4) {
    if (data.familyInBappebti === 'YA') {
      errors.push('You must select "Tidak (No)" for the BAPPEBTI family question to proceed');
      fieldErrors.familyInBappebti = true;
    }
    
    if (data.declaredBankrupt === 'YA') {
      errors.push('You must select "Tidak (No)" for the bankruptcy question to proceed');
      fieldErrors.declaredBankrupt = true;
    }
  }

  // Special validation for Step 6 trading experience conditional fields
  if (stepIndex === 6) {
    if (data.tradingExperience === 'ya') {
      if (!data.brokerCompany?.trim()) {
        errors.push('Please specify the broker company name');
        fieldErrors.brokerCompany = true;
      }
      if (!data.demoAccountNumber?.trim()) {
        errors.push('Please specify the demo account number');
        fieldErrors.demoAccountNumber = true;
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
  
  if (stepIndex === 2) {
    // Add bank account fields
    fields.push(...Object.values(stepMapping.bankAccountFields).map(config => config.fieldName));
  }
  
  if (stepIndex === 4 && stepMapping.employmentFields) {
    // Add employment fields (these are conditional)
    fields.push(...Object.values(stepMapping.employmentFields).map(config => config.fieldName));
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
  
  let conditionalFields = Object.values(stepMapping.conditionalFields)
    .filter(config => config.condition(data))
    .map(config => config.fieldName);
    
  // Add employment fields if applicable for step 4
  if (stepIndex === 4 && stepMapping.employmentFields) {
    const employmentFields = Object.values(stepMapping.employmentFields)
      .filter(config => config.condition && config.condition(data))
      .map(config => config.fieldName);
    conditionalFields.push(...employmentFields);
  }
  
  return conditionalFields;
};
