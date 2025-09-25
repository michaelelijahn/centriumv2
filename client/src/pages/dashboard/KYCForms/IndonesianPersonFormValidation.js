// Exact field mappings extracted from IndonesianPersonForm validation functions
// Comprehensive validation rules for all 18 steps of Indonesian Person KYC form

export const STEP_FIELD_MAPPINGS = {
  // Step 0 - Requirements (no validation needed)
  0: {
    requiredFields: {},
    conditionalFields: {}
  },

  // Step 1 - Account Information (validateAccountInformationStep)
  1: {
    requiredFields: {
      email: {
        fieldName: 'email',
        label: 'Email address',
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

  // Step 2 - Data Pribadi (validateDataPribadiStep)
  2: {
    requiredFields: {
      namaLengkap: {
        fieldName: 'namaLengkap',
        label: 'Nama Lengkap',
        validation: 'required'
      },
      tempatLahir: {
        fieldName: 'tempatLahir',
        label: 'Tempat Lahir',
        validation: 'required'
      },
      tanggalLahir: {
        fieldName: 'tanggalLahir',
        label: 'Tanggal Lahir',
        validation: 'dateOfBirth'
      },
      noKTP: {
        fieldName: 'noKTP',
        label: 'No. KTP',
        validation: 'required'
      },
      noNPWP: {
        fieldName: 'noNPWP',
        label: 'No. NPWP',
        validation: 'required'
      },
      jenisKelamin: {
        fieldName: 'jenisKelamin',
        label: 'Jenis Kelamin',
        validation: 'required'
      },
      namaIbuKandung: {
        fieldName: 'namaIbuKandung',
        label: 'Nama Ibu Kandung',
        validation: 'required'
      },
      statusPerkawinan: {
        fieldName: 'statusPerkawinan',
        label: 'Status Perkawinan',
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
        label: 'Postal Code',
        validation: 'required'
      },
      noHandphone: {
        fieldName: 'noHandphone',
        label: 'No. Handphone',
        validation: 'required'
      },
      statusKepemilikanRumah: {
        fieldName: 'statusKepemilikanRumah',
        label: 'Status Kepemilikan Rumah',
        validation: 'required'
      },
      tujuanPembukaanRekening: {
        fieldName: 'tujuanPembukaanRekening',
        label: 'Tujuan Pembukaan Rekening',
        validation: 'required'
      },
      pengalamanInvestasi: {
        fieldName: 'pengalamanInvestasi',
        label: 'Pengalaman Investasi',
        validation: 'required'
      },
      anggotaKeluargaBAPPEBTI: {
        fieldName: 'anggotaKeluargaBAPPEBTI',
        label: 'Anggota Keluarga BAPPEBTI',
        validation: 'required'
      },
      pernahPailit: {
        fieldName: 'pernahPailit',
        label: 'Pernah Pailit',
        validation: 'required'
      }
    },
    conditionalFields: {
      namaIstriSuami: {
        fieldName: 'namaIstriSuami',
        label: 'Nama Istri/Suami',
        condition: (data) => data.statusPerkawinan === 'Married',
        validation: 'required'
      },
      statusKepemilikanRumahOther: {
        fieldName: 'statusKepemilikanRumahOther',
        label: 'Other home ownership status',
        condition: (data) => data.statusKepemilikanRumah === 'Lainnya',
        validation: 'required'
      },
      tujuanPembukaanRekeningOther: {
        fieldName: 'tujuanPembukaanRekeningOther',
        label: 'Other account opening purpose',
        condition: (data) => data.tujuanPembukaanRekening === 'Lainnya',
        validation: 'required'
      },
      pengalamanInvestasiBidang: {
        fieldName: 'pengalamanInvestasiBidang',
        label: 'Investment experience details',
        condition: (data) => data.pengalamanInvestasi === 'Yes',
        validation: 'required'
      }
    }
  },

  // Step 3 - Emergency Contact (validateEmergencyContactStep)
  3: {
    requiredFields: {
      emergencyContactName: {
        fieldName: 'emergencyContactName',
        label: 'Emergency Contact Name',
        validation: 'required'
      },
      emergencyContactPhone: {
        fieldName: 'emergencyContactPhone',
        label: 'Emergency Contact Phone',
        validation: 'required'
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
      }
    },
    conditionalFields: {
      emergencyContactRelationshipOther: {
        fieldName: 'emergencyContactRelationshipOther',
        label: 'Other relationship',
        condition: (data) => data.emergencyContactRelationship === 'Lainnya',
        validation: 'required'
      }
    }
  },

  // Step 4 - Data Pekerjaan (validateDataPekerjaanStep)
  4: {
    requiredFields: {
      jenisPekerjaan: {
        fieldName: 'jenisPekerjaan',
        label: 'Jenis Pekerjaan',
        validation: 'required'
      }
    },
    conditionalFields: {
      jenisPekerjaanOther: {
        fieldName: 'jenisPekerjaanOther',
        label: 'Other employment type',
        condition: (data) => data.jenisPekerjaan === 'Lainnya',
        validation: 'required'
      },
      // Employment fields required for specific job types
      namaPerusahaan: {
        fieldName: 'namaPerusahaan',
        label: 'Nama Perusahaan',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      bidangUsaha: {
        fieldName: 'bidangUsaha',
        label: 'Bidang Usaha',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      jabatan: {
        fieldName: 'jabatan',
        label: 'Jabatan',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      lamaBekerja: {
        fieldName: 'lamaBekerja',
        label: 'Lama Bekerja',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      kantorSebelumnya: {
        fieldName: 'kantorSebelumnya',
        label: 'Kantor Sebelumnya',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      alamatKantor: {
        fieldName: 'alamatKantor',
        label: 'Alamat Kantor',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      kotaKantor: {
        fieldName: 'kotaKantor',
        label: 'Kota Kantor',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      postalCodeKantor: {
        fieldName: 'postalCodeKantor',
        label: 'Postal Code Kantor',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      },
      noTeleponKantor: {
        fieldName: 'noTeleponKantor',
        label: 'No. Telepon Kantor',
        condition: (data) => ['Swasta', 'Wiraswasta', 'Profesional', 'ASN'].includes(data.jenisPekerjaan),
        validation: 'required'
      }
    }
  },

  // Step 5 - Daftar Kekayaan (validateDaftarKekayaanStep)
  5: {
    requiredFields: {
      penghasilanPertahun: {
        fieldName: 'penghasilanPertahun',
        label: 'Penghasilan Pertahun',
        validation: 'required'
      },
      lokasiRumah: {
        fieldName: 'lokasiRumah',
        label: 'Lokasi Rumah',
        validation: 'required'
      },
      nilaiNJOP: {
        fieldName: 'nilaiNJOP',
        label: 'Nilai NJOP',
        validation: 'required'
      },
      bankDeposit: {
        fieldName: 'bankDeposit',
        label: 'Bank Deposit',
        validation: 'required'
      },
      jumlah: {
        fieldName: 'jumlah',
        label: 'Jumlah',
        validation: 'required'
      }
    },
    conditionalFields: {}
  },

  // Step 6 - Rekening Bank (validateRekeningBankStep)
  6: {
    requiredFields: {},
    conditionalFields: {},
    // Bank accounts validation
    bankAccountFields: {
      namaBank: {
        fieldName: 'namaBank',
        label: 'Nama Bank',
        validation: 'required'
      },
      cabang: {
        fieldName: 'cabang',
        label: 'Cabang',
        validation: 'required'
      },
      noRekening: {
        fieldName: 'noRekening',
        label: 'No. Rekening',
        validation: 'required'
      },
      namaPemilikRekening: {
        fieldName: 'namaPemilikRekening',
        label: 'Nama Pemilik Rekening',
        validation: 'required'
      },
      noTeleponBank: {
        fieldName: 'noTeleponBank',
        label: 'No. Telepon Bank',
        validation: 'required'
      },
      bankAccountType: {
        fieldName: 'bankAccountType',
        label: 'Jenis Rekening Bank',
        validation: 'required'
      }
    },
    bankAccountConditionalFields: {
      bankAccountTypeOther: {
        fieldName: 'bankAccountTypeOther',
        label: 'Other account type',
        condition: (account) => account.bankAccountType === 'LAINNYA',
        validation: 'required'
      }
    }
  },

  // Step 7 - Document Upload (validateDocumentUploadStep)
  7: {
    requiredFields: {
      '0_0': {
        fieldName: 'uploadedFiles',
        documentKey: '0_0',
        label: 'Rekening Koran / Tagihan Kartu Kredit',
        validation: 'file'
      },
      '0_1': {
        fieldName: 'uploadedFiles',
        documentKey: '0_1',
        label: 'Rekening Listrik / Telepon',
        validation: 'file'
      },
      '0_2': {
        fieldName: 'uploadedFiles',
        documentKey: '0_2',
        label: 'Foto Terkini',
        validation: 'file'
      },
      '0_3': {
        fieldName: 'uploadedFiles',
        documentKey: '0_3',
        label: 'Identify No. (KTP)',
        validation: 'file'
      },
      '0_4': {
        fieldName: 'uploadedFiles',
        documentKey: '0_4',
        label: 'NPWP',
        validation: 'file'
      }
    },
    conditionalFields: {}
  },

  // Step 8 - Declaration (validateDeclarationStep)
  8: {
    requiredFields: {
      declaration: {
        fieldName: 'declaration',
        label: 'Company profile agreement',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 9 - Trading Simulation (validateTradingSimulationStep)
  9: {
    requiredFields: {
      tradingSimulation: {
        fieldName: 'tradingSimulation',
        label: 'Trading simulation agreement',
        validation: 'yaAcceptance'
      },
      tradingExperience: {
        fieldName: 'tradingExperience',
        label: 'Trading experience information',
        validation: 'required'
      }
    },
    conditionalFields: {
      brokerCompany: {
        fieldName: 'brokerCompany',
        label: 'Previous broker company name',
        condition: (data) => data.tradingExperience === 'ya',
        validation: 'required'
      },
      demoAccountNumber: {
        fieldName: 'demoAccountNumber',
        label: 'Previous demo account number',
        condition: (data) => data.tradingExperience === 'ya',
        validation: 'required'
      }
    }
  },

  // Step 10 - Disclosure Statement (validateDisclosureStatementStep)
  10: {
    requiredFields: {
      disclosureStatement: {
        fieldName: 'disclosureStatement',
        label: 'Disclosure statement',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 11 - Risk Disclosure Document (validateRiskDisclosureDocumentStep)
  11: {
    requiredFields: {
      point1: {
        fieldName: 'point1',
        label: 'Risk statement 1',
        validation: 'checkbox'
      },
      point2: {
        fieldName: 'point2',
        label: 'Risk statement 2',
        validation: 'checkbox'
      },
      point3: {
        fieldName: 'point3',
        label: 'Risk statement 3',
        validation: 'checkbox'
      },
      point4: {
        fieldName: 'point4',
        label: 'Risk statement 4',
        validation: 'checkbox'
      },
      point5: {
        fieldName: 'point5',
        label: 'Risk statement 5',
        validation: 'checkbox'
      },
      point6: {
        fieldName: 'point6',
        label: 'Risk statement 6',
        validation: 'checkbox'
      },
      point7: {
        fieldName: 'point7',
        label: 'Risk statement 7',
        validation: 'checkbox'
      },
      point8: {
        fieldName: 'point8',
        label: 'Risk statement 8',
        validation: 'checkbox'
      },
      point9: {
        fieldName: 'point9',
        label: 'Risk statement 9',
        validation: 'checkbox'
      },
      point10: {
        fieldName: 'point10',
        label: 'Risk statement 10',
        validation: 'checkbox'
      },
      point11: {
        fieldName: 'point11',
        label: 'Risk statement 11',
        validation: 'checkbox'
      },
      point12: {
        fieldName: 'point12',
        label: 'Risk statement 12',
        validation: 'checkbox'
      },
      point13: {
        fieldName: 'point13',
        label: 'Risk statement 13',
        validation: 'checkbox'
      },
      point14: {
        fieldName: 'point14',
        label: 'Risk statement 14',
        validation: 'checkbox'
      },
      finalAcceptance: {
        fieldName: 'finalAcceptance',
        label: 'Risk disclosure',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 12 - Additional Disclosure Statement (validateAdditionalDisclosureStep)
  12: {
    requiredFields: {
      additionalDisclosureStatement: {
        fieldName: 'additionalDisclosureStatement',
        label: 'Additional disclosure statement',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 13 - Electronic Agreement (validateElectronicAgreementStep)
  13: {
    requiredFields: {
      electronicAgreement: {
        fieldName: 'electronicAgreement',
        label: 'Electronic power of attorney agreement',
        validation: 'yaAcceptance'
      },
      disputeResolutionBappebti: {
        fieldName: 'disputeResolutionBappebti',
        label: 'Dispute resolution BAPPEBTI',
        validation: 'checkbox'
      },
      disputeResolutionJakarta: {
        fieldName: 'disputeResolutionJakarta',
        label: 'Dispute resolution Jakarta',
        validation: 'checkbox'
      }
    },
    conditionalFields: {}
  },

  // Step 14 - Trading Rules (validateTradingRulesStep)
  14: {
    requiredFields: {
      tradingRulesAcceptance: {
        fieldName: 'tradingRulesAcceptance',
        label: 'PALN trading rules',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 15 - New Fund Declaration (validateNewFundDeclarationStep)
  15: {
    requiredFields: {
      newFundDeclarationAcceptance: {
        fieldName: 'newFundDeclarationAcceptance',
        label: 'Personal fund ownership declaration',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 16 - Access Code Responsibility (validateAccessCodeResponsibilityStep)
  16: {
    requiredFields: {
      accessCodeResponsibilityAcceptance: {
        fieldName: 'accessCodeResponsibilityAcceptance',
        label: 'Personal access password responsibility statement',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 17 - Fund Declaration (validateFundDeclarationStep)
  17: {
    requiredFields: {
      fundDeclarationAcceptance: {
        fieldName: 'fundDeclarationAcceptance',
        label: 'Fund declaration',
        validation: 'yaAcceptance'
      }
    },
    conditionalFields: {}
  },

  // Step 18 - Process Verification (validateProcessVerificationStep)
  18: {
    requiredFields: {
      verificationAcceptance: {
        fieldName: 'verificationAcceptance',
        label: 'Electronic customer acceptance process verification',
        validation: 'yaAcceptance'
      },
      verificationDate: {
        fieldName: 'verificationDate',
        label: 'Process verification date',
        validation: 'required'
      }
    },
    conditionalFields: {}
  }
};

// Import validation helpers
import { validateEmail, validateDateOfBirth } from '../../../common/helpers';

/**
 * Efficient validation function that uses the field mappings
 * @param {number} stepIndex - The step to validate (0-18)
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
        // Email validation for Account Information step
        const emailValidation = validateEmail(data[fieldName], true, label);
        if (!emailValidation.isValid) {
          errors.push(emailValidation.error);
          fieldErrors[fieldName] = true;
        }
        break;
        
      case 'dateOfBirth':
        // Date of birth validation with 21 year minimum age requirement
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
        // Document upload validation
        if (stepIndex === 7) {
          const uploadedFiles = data.uploadedFiles || {};
          const hasFile = uploadedFiles[documentKey] && uploadedFiles[documentKey].name;
          if (!hasFile) {
            errors.push(`Missing required document: ${label}`);
            fieldErrors[`document_${documentKey}`] = true;
          }
        }
        break;
        
      case 'checkbox':
        // Checkbox validation for risk statements and agreements
        if (!data[fieldName]) {
          errors.push(`Please acknowledge ${label}`);
          fieldErrors[fieldName] = true;
        }
        break;
        
      case 'yaAcceptance':
        // Ya/Tidak acceptance validation
        if (!data[fieldName]) {
          errors.push(`Please acknowledge the ${label} by selecting "Ya"`);
          fieldErrors[fieldName] = true;
        } else if (data[fieldName] === 'tidak' || data[fieldName] === 'no') {
          errors.push(`You must select "Ya" to continue`);
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

  // Special validation for Step 6 - Bank Accounts
  if (stepIndex === 6) {
    if (!data.bankAccounts || data.bankAccounts.length === 0) {
      errors.push('At least one bank account is required');
      // Add field errors for all bank account fields
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
            fieldErrors[field] = true;
          }
        });
        
        // Validate conditional bank account fields
        Object.entries(stepMapping.bankAccountConditionalFields).forEach(([field, config]) => {
          if (config.condition(account) && !account[field]?.trim()) {
            errors.push(`Bank ${index + 1} - Please specify other account type`);
            fieldErrors[`${field}_${index}`] = true;
          }
        });
      });
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
 * @param {number} stepIndex - The step index (0-18)
 * @returns {string[]} - Array of field names
 */
export const getRequiredFieldsForStep = (stepIndex) => {
  const stepMapping = STEP_FIELD_MAPPINGS[stepIndex];
  if (!stepMapping) return [];
  
  const fields = Object.values(stepMapping.requiredFields).map(config => config.fieldName);
  
  if (stepIndex === 6) {
    // Add bank account fields
    fields.push(...Object.values(stepMapping.bankAccountFields).map(config => config.fieldName));
  }
  
  return fields;
};

/**
 * Get all conditional field names for a specific step
 * @param {number} stepIndex - The step index (0-18)
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
