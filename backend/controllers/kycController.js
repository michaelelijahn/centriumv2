const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { uploadToS3 } = require('../utils/s3Upload');

const debugLog = (message) => {
    try {
        const logDir = path.join(__dirname, '../logs');
        const logFile = path.join(logDir, 'app-error.log');
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] KYC DEBUG: ${message}\n`;
        
        fs.appendFileSync(logFile, logMessage);
    } catch (err) {
        console.log('KYC Debug:', message);
    }
};

// Helper function to safely convert undefined to null
const safeValue = (value) => {
    return value === undefined ? null : value;
};

// Helper function to map frontend values to database ENUM values
const mapTradingAccountPurpose = (frontendValue) => {
    const mapping = {
        'Hedging': 'HEDGING',
        'Gain': 'INVESTMENT', // Map "Gain" to "INVESTMENT"
        'Speculation': 'SPECULATION',
        'Others': 'OTHER'
    };
    return mapping[frontendValue] || 'OTHER'; // Default to 'OTHER' if not found
};

const submitForeignCompanyKYC = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        debugLog('=== FOREIGN COMPANY KYC SUBMISSION STARTED ===');
        debugLog(`Authorization header: ${req.headers['authorization']}`);
        debugLog(`req.user: ${JSON.stringify(req.user)}`);
        
        const user_id = req.user?.userId; // From authenticateToken middleware (JWT contains userId, not user_id)
        
        // Check if user is authenticated
        if (!user_id) {
            debugLog('ERROR: User not authenticated - req.user is undefined');
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in again.'
            });
        }
        const formData = req.body;
        const files = req.files || []; // With upload.any(), files is an array
        
        // Parse JSON strings from FormData
        Object.keys(formData).forEach(key => {
            if (typeof formData[key] === 'string') {
                try {
                    // Try to parse as JSON (for bankAccounts array, etc.)
                    formData[key] = JSON.parse(formData[key]);
                } catch (e) {
                    // Keep as string if not valid JSON
                }
            }
        });
        
        debugLog(`User ID: ${user_id}, Form Data: ${JSON.stringify(formData)}`);
        debugLog(`Files received: ${files.length}`);
        
        // Debug: Check for undefined values
        const checkForUndefined = (obj, prefix = '') => {
            Object.keys(obj).forEach(key => {
                if (obj[key] === undefined) {
                    debugLog(`WARNING: ${prefix}${key} is undefined`);
                } else if (obj[key] === null) {
                    debugLog(`INFO: ${prefix}${key} is null (OK)`);
                } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    checkForUndefined(obj[key], `${prefix}${key}.`);
                }
            });
        };
        
        debugLog('=== CHECKING FOR UNDEFINED VALUES ===');
        checkForUndefined(formData);
        
        if (formData.bankAccounts && Array.isArray(formData.bankAccounts)) {
            formData.bankAccounts.forEach((account, index) => {
                debugLog(`=== CHECKING BANK ACCOUNT ${index + 1} ===`);
                checkForUndefined(account, `bankAccount[${index}].`);
            });
        }
        
        await connection.beginTransaction();
        
        // 1. Create master KYC application
        const applicationReference = `FC-${Date.now()}-${user_id}`;
        const [applicationResult] = await connection.execute(
            `INSERT INTO kyc_applications 
             (user_id, form_type, status, current_step, total_steps, application_reference, submitted_at) 
             VALUES (?, 'foreign_company', 'submitted', 6, 6, ?, NOW())`,
            [user_id, applicationReference]
        );
        
        const applicationId = applicationResult.insertId;
        debugLog(`Created application with ID: ${applicationId}`);
        
        // 2. Insert email registration data
        debugLog(`=== INSERTING EMAIL DATA ===`);
        debugLog(`Email: ${formData.email}, Demo Account: ${formData.demoAccountNo}`);
        await connection.execute(
            `INSERT INTO kyc_foreign_company_email (application_id, email, demo_account_no) 
             VALUES (?, ?, ?)`,
            [applicationId, safeValue(formData.email), safeValue(formData.demoAccountNo)]
        );
        
        // 3. Insert company details
        debugLog(`=== INSERTING COMPANY DETAILS ===`);
        const companyDetailsParams = [
            applicationId,
            safeValue(formData.companyRegistrationName),
            safeValue(formData.companyLicenseNo),
            safeValue(formData.natureOfBusiness),
            safeValue(formData.companyLegalForm),
            safeValue(formData.companyLegalFormOther),
            safeValue(formData.streetAddress),
            safeValue(formData.city),
            safeValue(formData.postalCode),
            safeValue(formData.country),
            safeValue(formData.countryOther),
            safeValue(formData.placeOfEstablishment),
            safeValue(formData.dateOfEstablishment),
            safeValue(formData.countryCode),
            safeValue(formData.officeTelephoneNo),
            safeValue(formData.beneficialOwnerName),
            safeValue(formData.beneficialOwnerPassportNo),
            safeValue(formData.sourceOfFunds),
            safeValue(formData.sourceOfFundsOther),
            safeValue(formData.tradingAccountPurpose),
            safeValue(formData.tradingAccountPurposeOther)
        ];
        
        debugLog(`Company details params: ${JSON.stringify(companyDetailsParams)}`);
        await connection.execute(
            `INSERT INTO kyc_foreign_company_details (
                application_id, company_registration_name, company_license_no, nature_of_business,
                company_legal_form, company_legal_form_other, street_address, city, postal_code,
                country, country_other, place_of_establishment, date_of_establishment,
                country_code, office_telephone_no, beneficial_owner_name, beneficial_owner_passport_no,
                source_of_funds, source_of_funds_other, trading_account_purpose, trading_account_purpose_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            companyDetailsParams
        );
        
        // 4. Insert authorized person details
        debugLog(`=== INSERTING AUTHORIZED PERSON DETAILS ===`);
        const authorizedPersonParams = [
            applicationId,
            safeValue(formData.authorizePersonTitle),
            safeValue(formData.authorizePersonFullName),
            safeValue(formData.authorizePersonPlaceOfBirth),
            safeValue(formData.authorizePersonDateOfBirth),
            safeValue(formData.authorizePersonPassportId),
            safeValue(formData.authorizePersonEmail),
            safeValue(formData.authorizePersonGender),
            safeValue(formData.authorizePersonMaritalStatus),
            safeValue(formData.authorizePersonCitizen),
            safeValue(formData.authorizePersonCitizenOther),
            safeValue(formData.authorizePersonCountryCode),
            safeValue(formData.authorizePersonPhoneNumber),
            safeValue(formData.authorizePersonStreetAddress),
            safeValue(formData.authorizePersonCity),
            safeValue(formData.authorizePersonPostalCode),
            safeValue(formData.authorizePersonCountry),
            safeValue(formData.authorizePersonCountryOther),
            safeValue(formData.authorizePersonInvestmentExperience),
            safeValue(formData.authorizePersonInvestmentExperienceDetails),
            safeValue(formData.authorizePersonFamilyInBappebti),
            safeValue(formData.authorizePersonDeclaredBankrupt),
            safeValue(formData.authorizePersonCompanyName),
            safeValue(formData.authorizePersonBusinessNature),
            safeValue(formData.authorizePersonJobPosition),
            safeValue(formData.authorizePersonOfficeAddress),
            safeValue(formData.authorizePersonOfficeCity),
            safeValue(formData.authorizePersonOfficePostalCode),
            safeValue(formData.authorizePersonOfficeCountry),
            safeValue(formData.authorizePersonOfficeCountryOther)
        ];
        
        debugLog(`Authorized person params: ${JSON.stringify(authorizedPersonParams)}`);
        await connection.execute(
            `INSERT INTO kyc_foreign_company_authorized_person (
                application_id, title, full_name, place_of_birth, date_of_birth, passport_id,
                email, gender, marital_status, citizen, citizen_other, country_code, phone_number,
                street_address, city, postal_code, country, country_other, investment_experience,
                investment_experience_details, family_in_bappebti, declared_bankrupt,
                company_name, business_nature, job_position, office_address, office_city,
                office_postal_code, office_country, office_country_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            authorizedPersonParams
        );
        
        // 5. Insert bank accounts
        if (formData.bankAccounts && Array.isArray(formData.bankAccounts)) {
            debugLog(`=== INSERTING ${formData.bankAccounts.length} BANK ACCOUNTS ===`);
            for (let i = 0; i < formData.bankAccounts.length; i++) {
                const account = formData.bankAccounts[i];
                const bankAccountParams = [
                    applicationId,
                    safeValue(account.bankName),
                    safeValue(account.accountName),
                    safeValue(account.bankAddress),
                    safeValue(account.bankCity),
                    safeValue(account.bankCountry),
                    safeValue(account.bankCountryOther),
                    safeValue(account.swiftCode),
                    safeValue(account.accountNo), // Should be encrypted in production
                    i + 1
                ];
                
                debugLog(`Bank account ${i + 1} params: ${JSON.stringify(bankAccountParams)}`);
                await connection.execute(
                    `INSERT INTO kyc_bank_accounts (
                        application_id, bank_name, account_name, bank_address, bank_city,
                        bank_country, bank_country_other, swift_code, account_no, account_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    bankAccountParams
                );
            }
        }
        
        // 6. Handle document uploads
        const documentUploads = [];
        for (const file of files) {
            if (file) {
                try {
                    // Upload to S3
                    const fileName = `kyc/${applicationId}/${Date.now()}-${file.originalname}`;
                    const s3Response = await uploadToS3(file.buffer, fileName, file.mimetype);
                    
                    // Determine document category and type based on field name
                    const { category, type } = getDocumentCategoryAndType(file.fieldname);
                    
                    await connection.execute(
                        `INSERT INTO kyc_documents (
                            application_id, document_category, document_type, original_filename,
                            stored_filename, file_path, file_size, mime_type
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            applicationId,
                            category,
                            type,
                            file.originalname,
                            fileName,
                            s3Response.Location,
                            file.size,
                            file.mimetype
                        ]
                    );
                    
                    documentUploads.push({
                        fieldName: file.fieldname,
                        originalName: file.originalname,
                        uploadedPath: s3Response.Location
                    });
                } catch (uploadError) {
                    debugLog(`Error uploading file ${file.fieldname}: ${uploadError.message}`);
                    throw new Error(`Failed to upload document: ${file.originalname}`);
                }
            }
        }
        
        // 7. Insert agreements
        const agreementTypes = [
            'company_profile',
            'statement_simulation',
            'statement_experience',
            'disclosure_statement',
            'account_opening',
            'risk_disclosure',
            'mandate_agreement',
            'trading_rules',
            'personal_access_password'
        ];
        
        const agreementUrls = {
            company_profile: 'https://drive.google.com/file/d/1_29Uaed83l9pSudtzJO8oqWh5sD49A77/view',
            statement_simulation: 'https://drive.google.com/file/d/1UlhVYACvANdTruDqe7ZUpUjDkqDheIwB/view',
            statement_experience: 'https://drive.google.com/file/d/1DScf7jYgnbUzeK6QfP7eaNlm0hp6wX4E/view',
            disclosure_statement: 'https://drive.google.com/file/d/1dfTD9xjnoz3-blO2bxprhhS1prXHDIKG/view',
            account_opening: 'https://drive.google.com/file/d/1bxOc9ZtkWymJU_b7PGfKoehl-fAj1g7W/view',
            risk_disclosure: 'https://drive.google.com/file/d/1A4cJO0K3ZKV3aZWL6AzzELi42t0CIrIB/view',
            mandate_agreement: 'https://drive.google.com/file/d/1o5PmpjMO_vVK55YDeHDJ6QzyNSCRL4MK/view',
            trading_rules: 'https://drive.google.com/file/d/16kBaWNpbEI7SnKR9le4sOsOBmc9967vn/view',
            personal_access_password: 'https://drive.google.com/file/d/1JVpkMMDikDrYE-R63BXR4ZnkrvLNVZjS/view'
        };
        
        debugLog(`=== INSERTING AGREEMENTS ===`);
        for (const agreementType of agreementTypes) {
            const isAgreed = formData[agreementType] === true;
            const agreementParams = [
                applicationId,
                agreementType,
                isAgreed,
                isAgreed ? new Date() : null,
                safeValue(agreementUrls[agreementType])
            ];
            
            debugLog(`Agreement ${agreementType}: ${isAgreed}, params: ${JSON.stringify(agreementParams)}`);
            await connection.execute(
                `INSERT INTO kyc_agreements (
                    application_id, agreement_type, agreed, agreed_at, document_url
                ) VALUES (?, ?, ?, ?, ?)`,
                agreementParams
            );
        }
        
        await connection.commit();
        debugLog(`Successfully submitted KYC application ${applicationId}`);
        
        res.json({
            success: true,
            data: {
                applicationId,
                applicationReference,
                message: 'Foreign Company KYC application submitted successfully',
                documentsUploaded: documentUploads.length,
                documentDetails: documentUploads
            }
        });
        
    } catch (error) {
        await connection.rollback();
        debugLog(`Error in KYC submission: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        next(error);
    } finally {
        connection.release();
        debugLog('=== FOREIGN COMPANY KYC SUBMISSION COMPLETED ===');
    }
};

// Helper function to categorize documents based on field name
const getDocumentCategoryAndType = (fieldName) => {
    const documentMapping = {
        'certificate_incorporation': { category: 'Company Documents', type: 'Certificate of Incorporation' },
        'board_resolution': { category: 'Company Documents', type: 'Board of Resolution' },
        'address_proof': { category: 'Company Documents', type: 'Address Proof' },
        'bank_statement': { category: 'Financial Documents', type: 'Bank Statement' },
        'beneficial_owner_passport': { category: 'Personal Documents', type: 'Beneficial Owner Passport' },
        'management_structure': { category: 'Company Structure', type: 'Management Structure' },
        'ownership_structure': { category: 'Company Structure', type: 'Ownership Structure' },
        'authorize_person_passport': { category: 'Personal Documents', type: 'Authorize Person Passport' },
        // Generic fallback
        default: { category: 'Other Documents', type: 'Supporting Document' }
    };
    
    return documentMapping[fieldName] || documentMapping.default;
};

// Get KYC application status
const getKYCApplicationStatus = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        const user_id = req.user?.userId;
        const { applicationId } = req.params;
        
        const [applications] = await connection.execute(
            `SELECT ka.*, 
                    kfce.email, kfce.demo_account_no,
                    kfcd.company_registration_name,
                    kfcap.full_name as authorized_person_name
             FROM kyc_applications ka
             LEFT JOIN kyc_foreign_company_email kfce ON ka.application_id = kfce.application_id
             LEFT JOIN kyc_foreign_company_details kfcd ON ka.application_id = kfcd.application_id  
             LEFT JOIN kyc_foreign_company_authorized_person kfcap ON ka.application_id = kfcap.application_id
             WHERE ka.application_id = ? AND ka.user_id = ?`,
            [applicationId, user_id]
        );
        
        if (applications.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'KYC application not found'
            });
        }
        
        const application = applications[0];
        
        // Get documents count
        const [documentCount] = await connection.execute(
            'SELECT COUNT(*) as document_count FROM kyc_documents WHERE application_id = ?',
            [applicationId]
        );
        
        res.json({
            success: true,
            data: {
                ...application,
                document_count: documentCount[0].document_count
            }
        });
        
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
};

// Get all KYC applications for a user
const getUserKYCApplications = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        const user_id = req.user?.userId;
        
        const [applications] = await connection.execute(
            `SELECT ka.*, 
                    kfce.email, kfce.demo_account_no,
                    kfcd.company_registration_name,
                    kfcap.full_name as authorized_person_name
             FROM kyc_applications ka
             LEFT JOIN kyc_foreign_company_email kfce ON ka.application_id = kfce.application_id
             LEFT JOIN kyc_foreign_company_details kfcd ON ka.application_id = kfcd.application_id  
             LEFT JOIN kyc_foreign_company_authorized_person kfcap ON ka.application_id = kfcap.application_id
             WHERE ka.user_id = ?
             ORDER BY ka.created_at DESC`,
            [user_id]
        );
        
        res.json({
            success: true,
            data: applications
        });
        
    } catch (error) {
        next(error);
    } finally {
        connection.release();
    }
};

const submitForeignPersonKYC = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        debugLog('=== FOREIGN PERSON KYC SUBMISSION STARTED ===');
        debugLog(`Authorization header: ${req.headers['authorization']}`);
        debugLog(`req.user: ${JSON.stringify(req.user)}`);
        
        const user_id = req.user?.userId; // From authenticateToken middleware (JWT contains userId, not user_id)
        
        // Check if user is authenticated
        if (!user_id) {
            debugLog('ERROR: User not authenticated - req.user is undefined');
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in again.'
            });
        }
        
        const formData = req.body;
        const files = req.files || []; // With upload.any(), files is an array
        
        // Parse JSON strings from FormData
        Object.keys(formData).forEach(key => {
            if (typeof formData[key] === 'string') {
                try {
                    // Try to parse as JSON (for bankAccounts array, etc.)
                    formData[key] = JSON.parse(formData[key]);
                } catch (e) {
                    // Keep as string if not valid JSON
                }
            }
        });
        
        debugLog(`User ID: ${user_id}, Form Data: ${JSON.stringify(formData)}`);
        debugLog(`Files received: ${files.length}`);
        
        // Debug: Check for undefined values
        const checkForUndefined = (obj, prefix = '') => {
            Object.keys(obj).forEach(key => {
                if (obj[key] === undefined) {
                    debugLog(`WARNING: ${prefix}${key} is undefined`);
                } else if (obj[key] === null) {
                    debugLog(`INFO: ${prefix}${key} is null (OK)`);
                } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                    checkForUndefined(obj[key], `${prefix}${key}.`);
                }
            });
        };
        
        debugLog('=== CHECKING FOR UNDEFINED VALUES ===');
        checkForUndefined(formData);
        
        if (formData.bankAccounts && Array.isArray(formData.bankAccounts)) {
            formData.bankAccounts.forEach((account, index) => {
                debugLog(`=== CHECKING BANK ACCOUNT ${index + 1} ===`);
                checkForUndefined(account, `bankAccount[${index}].`);
            });
        }
        
        await connection.beginTransaction();
        
        // 1. Create master KYC application
        const applicationReference = `FP-${Date.now()}-${user_id}`;
        const [applicationResult] = await connection.execute(
            `INSERT INTO kyc_applications 
             (user_id, form_type, status, current_step, total_steps, application_reference, submitted_at) 
             VALUES (?, 'foreign_person', 'submitted', 8, 8, ?, NOW())`,
            [user_id, applicationReference]
        );
        
        const applicationId = applicationResult.insertId;
        debugLog(`Created application with ID: ${applicationId}`);
        
        // 2. Insert email registration data
        debugLog(`=== INSERTING EMAIL DATA ===`);
        debugLog(`Email: ${formData.email}, Demo Account: ${formData.demoAccountNo}`);
        debugLog(`Available form fields: ${Object.keys(formData).join(', ')}`);
        debugLog(`SafeValue email: ${safeValue(formData.email)}, SafeValue demo: ${safeValue(formData.demoAccountNo)}`);
        await connection.execute(
            `INSERT INTO kyc_foreign_person_email (application_id, email, demo_account_no) 
             VALUES (?, ?, ?)`,
            [applicationId, safeValue(formData.email), safeValue(formData.demoAccountNo)]
        );
        
        // 3. Insert personal details
        debugLog(`=== INSERTING PERSONAL DETAILS ===`);
        const personalDetailsParams = [
            applicationId,
            safeValue(formData.personalTitle) || 'MR', // Default value since frontend doesn't have this field
            safeValue(formData.fullName),
            safeValue(formData.placeOfBirth),
            safeValue(formData.dateOfBirth),
            safeValue(formData.passportId),
            safeValue(formData.gender),
            safeValue(formData.maritalStatus),
            safeValue(formData.citizen),
            safeValue(formData.citizenOther),
            safeValue(formData.streetAddress),
            safeValue(formData.city),
            safeValue(formData.postalCode),
            safeValue(formData.country),
            safeValue(formData.countryOther),
            safeValue(formData.countryCode),
            safeValue(formData.phoneNumber),
            safeValue(formData.contactEmail), // Frontend uses contactEmail, not personalEmail
            safeValue(formData.sourceOfFunds) || 'OTHER', // Default since frontend uses accountOpeningPurpose instead
            safeValue(formData.sourceOfFundsOther) || safeValue(formData.accountOpeningPurpose), // Map accountOpeningPurpose to sourceOfFunds
            mapTradingAccountPurpose(formData.tradingAccountPurpose || formData.accountOpeningPurpose), // Map from accountOpeningPurpose
            safeValue(formData.tradingAccountPurposeOther) || safeValue(formData.accountOpeningPurposeOther),
            safeValue(formData.investmentExperience),
            safeValue(formData.investmentExperienceDetails),
            safeValue(formData.familyInBappebti),
            safeValue(formData.declaredBankrupt)
        ];
        
        debugLog(`Personal details params: ${JSON.stringify(personalDetailsParams)}`);
        await connection.execute(
            `INSERT INTO kyc_foreign_person_details (
                application_id, personal_title, full_name, place_of_birth, date_of_birth, passport_id,
                gender, marital_status, citizen, citizen_other, street_address, city, postal_code,
                country, country_other, country_code, phone_number, personal_email,
                source_of_funds, source_of_funds_other, trading_account_purpose, trading_account_purpose_other,
                investment_experience, investment_experience_details, family_in_bappebti, declared_bankrupt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            personalDetailsParams
        );
        
        // 4. Insert emergency contact details
        debugLog(`=== INSERTING EMERGENCY CONTACT DETAILS ===`);
        const emergencyContactParams = [
            applicationId,
            safeValue(formData.emergencyTitle) || 'MR', // Default since frontend doesn't have this field
            safeValue(formData.emergencyContactName), // Frontend uses emergencyContactName
            safeValue(formData.emergencyContactRelationship), // Frontend uses emergencyContactRelationship
            safeValue(formData.emergencyContactRelationshipOther), // Frontend uses emergencyContactRelationshipOther
            safeValue(formData.emergencyContactStreetAddress), // Frontend uses emergencyContactStreetAddress
            safeValue(formData.emergencyContactCity), // Frontend uses emergencyContactCity
            safeValue(formData.emergencyContactPostalCode), // Frontend uses emergencyContactPostalCode
            safeValue(formData.emergencyContactCountry), // Frontend uses emergencyContactCountry
            safeValue(formData.emergencyContactCountryOther), // Frontend uses emergencyContactCountryOther
            safeValue(formData.emergencyContactCountryCode), // Frontend uses emergencyContactCountryCode
            safeValue(formData.emergencyContactPhoneNumber), // Frontend uses emergencyContactPhoneNumber
            safeValue(formData.emergencyContactEmail) // Frontend uses emergencyContactEmail
        ];
        
        debugLog(`Emergency contact params: ${JSON.stringify(emergencyContactParams)}`);
        await connection.execute(
            `INSERT INTO kyc_foreign_person_emergency_contact (
                application_id, emergency_title, emergency_full_name, emergency_relationship, emergency_relationship_other,
                emergency_street_address, emergency_city, emergency_postal_code, emergency_country, emergency_country_other,
                emergency_country_code, emergency_phone_number, emergency_email
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            emergencyContactParams
        );
        
        // 5. Insert employment details
        debugLog(`=== INSERTING EMPLOYMENT DETAILS ===`);
        const employmentParams = [
            applicationId,
            safeValue(formData.employmentStatus),
            safeValue(formData.companyName),
            safeValue(formData.businessNature),
            safeValue(formData.position), // Frontend uses 'position', not 'jobPosition'
            safeValue(formData.lengthOfWork),
            safeValue(formData.previousCompany),
            safeValue(formData.monthlyIncome),
            safeValue(formData.annualIncome),
            safeValue(formData.officeCountryCode),
            safeValue(formData.officePhoneNumber),
            safeValue(formData.officeStreetAddress), // Frontend uses officeStreetAddress
            safeValue(formData.officeCity),
            safeValue(formData.officePostalCode),
            safeValue(formData.officeCountry),
            safeValue(formData.officeCountryOther)
        ];
        
        debugLog(`Employment params: ${JSON.stringify(employmentParams)}`);
        await connection.execute(
            `INSERT INTO kyc_foreign_person_employment (
                application_id, employment_status, company_name, business_nature, job_position,
                length_of_work, previous_company, monthly_income, annual_income,
                office_country_code, office_phone_number, office_street_address, office_city,
                office_postal_code, office_country, office_country_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            employmentParams
        );
        
        // 6. Insert bank accounts (reuse existing table)
        if (formData.bankAccounts && Array.isArray(formData.bankAccounts)) {
            debugLog(`=== INSERTING ${formData.bankAccounts.length} BANK ACCOUNTS ===`);
            for (let i = 0; i < formData.bankAccounts.length; i++) {
                const account = formData.bankAccounts[i];
                const bankAccountParams = [
                    applicationId,
                    safeValue(account.bankName),
                    safeValue(account.accountName),
                    safeValue(account.bankAddress),
                    safeValue(account.bankCity),
                    safeValue(account.bankCountry),
                    safeValue(account.bankCountryOther),
                    safeValue(account.swiftCode),
                    safeValue(account.accountNo), // Should be encrypted in production
                    i + 1
                ];
                
                debugLog(`Bank account ${i + 1} params: ${JSON.stringify(bankAccountParams)}`);
                await connection.execute(
                    `INSERT INTO kyc_bank_accounts (
                        application_id, bank_name, account_name, bank_address, bank_city,
                        bank_country, bank_country_other, swift_code, account_no, account_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    bankAccountParams
                );
            }
        }
        
        // 7. Handle document uploads (reuse existing table)
        const documentUploads = [];
        for (const file of files) {
            if (file) {
                try {
                    // Upload to S3
                    const fileName = `kyc/${applicationId}/${Date.now()}-${file.originalname}`;
                    const s3Response = await uploadToS3(file.buffer, fileName, file.mimetype);
                    
                    // Determine document category and type based on field name for foreign person
                    const { category, type } = getForeignPersonDocumentCategoryAndType(file.fieldname);
                    
                    await connection.execute(
                        `INSERT INTO kyc_documents (
                            application_id, document_category, document_type, original_filename,
                            stored_filename, file_path, file_size, mime_type
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            applicationId,
                            category,
                            type,
                            file.originalname,
                            fileName,
                            s3Response.Location,
                            file.size,
                            file.mimetype
                        ]
                    );
                    
                    documentUploads.push({
                        fieldName: file.fieldname,
                        originalName: file.originalname,
                        uploadedPath: s3Response.Location
                    });
                } catch (uploadError) {
                    debugLog(`Error uploading file ${file.fieldname}: ${uploadError.message}`);
                    throw new Error(`Failed to upload document: ${file.originalname}`);
                }
            }
        }
        
        // 8. Insert agreements (Foreign Person form specific - no disclosure_statement)
        const agreementTypes = [
            'company_profile',
            'statement_simulation',
            'statement_experience',
            'account_opening',
            'risk_disclosure',
            'mandate_agreement',
            'trading_rules',
            'personal_access_password'
        ];
        
        const agreementUrls = {
            company_profile: 'https://drive.google.com/file/d/1HeIYSnt2j1GsWckrkoRo40kh5_Y_BCVY/view',
            statement_simulation: 'https://drive.google.com/file/d/1SL4WEzRnUNR3uGkwXKo8X17UNo-UJiG6/view',
            statement_experience: 'https://drive.google.com/file/d/12MVWUxguyt2El8UOd1UCH6nG-Y9FKdIC/view',
            account_opening: 'https://drive.google.com/file/d/1SCB1N4Knnou1aELdphobbRVlidUoD7m2/view',
            risk_disclosure: 'https://drive.google.com/file/d/16bXQ-tGmWTU7jfIeACQe3zgF69XJAv3r/view',
            mandate_agreement: 'https://drive.google.com/file/d/1C1jz5_-ZMG_yWHHUW9Z9brzNy7sMHwfA/view',
            trading_rules: 'https://drive.google.com/file/d/1HOABLBHfN3qVy-RtBXuSNGzqHbsTe2Bk/view',
            personal_access_password: 'https://drive.google.com/file/d/1etnTr_bAODhysXoS03sTUzvEPMNK6eZ1/view'
        };
        
        debugLog(`=== INSERTING AGREEMENTS ===`);
        for (const agreementType of agreementTypes) {
            const isAgreed = formData[agreementType] === true;
            const agreementParams = [
                applicationId,
                agreementType,
                isAgreed,
                isAgreed ? new Date() : null,
                safeValue(agreementUrls[agreementType])
            ];
            
            debugLog(`Agreement ${agreementType}: ${isAgreed}, params: ${JSON.stringify(agreementParams)}`);
            await connection.execute(
                `INSERT INTO kyc_agreements (
                    application_id, agreement_type, agreed, agreed_at, document_url
                ) VALUES (?, ?, ?, ?, ?)`,
                agreementParams
            );
        }
        
        await connection.commit();
        debugLog(`Successfully submitted Foreign Person KYC application ${applicationId}`);
        
        res.json({
            success: true,
            data: {
                applicationId,
                applicationReference,
                message: 'Foreign Person KYC application submitted successfully',
                documentsUploaded: documentUploads.length,
                documentDetails: documentUploads
            }
        });
        
    } catch (error) {
        await connection.rollback();
        debugLog(`Error in Foreign Person KYC submission: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        next(error);
    } finally {
        connection.release();
        debugLog('=== FOREIGN PERSON KYC SUBMISSION COMPLETED ===');
    }
};

// Helper function to categorize documents based on field name for Foreign Person
const getForeignPersonDocumentCategoryAndType = (fieldName) => {
    const documentMapping = {
        'passport': { category: 'Identity Documents', type: 'Passport' },
        'photo_selfie': { category: 'Identity Documents', type: 'Photo Selfie' },
        'bank_statement': { category: 'Financial Documents', type: 'Bank Account Statement or Credit Card Bill' },
        'utility_bill': { category: 'Utility Documents', type: 'Telephone or Electricity Bill' },
        'tax_document': { category: 'Tax Documents', type: 'Personal Tax Document' },
        // Generic fallback
        default: { category: 'Other Documents', type: 'Supporting Document' }
    };
    
    return documentMapping[fieldName] || documentMapping.default;
};

module.exports = {
    submitForeignCompanyKYC,
    submitForeignPersonKYC,
    getKYCApplicationStatus,
    getUserKYCApplications
};
