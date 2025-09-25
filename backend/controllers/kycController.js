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
            safeValue(formData.officePhoneNumber),
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
            safeValue(formData.tradingAccountPurpose) || safeValue(formData.accountOpeningPurpose) || 'Others', // Map from accountOpeningPurpose
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

const submitIndonesianCompanyKYC = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        debugLog('=== INDONESIAN COMPANY KYC SUBMISSION STARTED ===');
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
        const applicationReference = `IC-${Date.now()}-${user_id}`;
        const [applicationResult] = await connection.execute(
            `INSERT INTO kyc_applications 
             (user_id, form_type, status, current_step, total_steps, application_reference, submitted_at) 
             VALUES (?, 'indonesian_company', 'submitted', 8, 8, ?, NOW())`,
            [user_id, applicationReference]
        );
        
        const applicationId = applicationResult.insertId;
        debugLog(`Created application with ID: ${applicationId}`);
        
        // 2. Insert email registration data
        debugLog(`=== INSERTING EMAIL DATA ===`);
        debugLog(`Email: ${formData.email}, Demo Account: ${formData.demoAccountNo}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_company_email (application_id, email, demo_account_no) 
             VALUES (?, ?, ?)`,
            [applicationId, safeValue(formData.email), safeValue(formData.demoAccountNo)]
        );
        
        // 3. Insert company details
        debugLog(`=== INSERTING COMPANY DETAILS ===`);
        const companyDetailsParams = [
            applicationId,
            safeValue(formData.companyName),
            safeValue(formData.businessLicenseNo),
            safeValue(formData.businessEntity),
            safeValue(formData.companyNPWP),
            safeValue(formData.streetName),
            safeValue(formData.city),
            safeValue(formData.postalCode),
            safeValue(formData.placeOfEstablishment),
            safeValue(formData.establishmentDate),
            safeValue(formData.legalForm),
            safeValue(formData.legalFormOther),
            safeValue(formData.officeTelephoneCountryCode),
            safeValue(formData.officeTelephoneNo),
            safeValue(formData.beneficialOwnerName),
            safeValue(formData.beneficialOwnerIdNo),
            safeValue(formData.sourceOfFunds),
            safeValue(formData.sourceOfFundsOther),
            safeValue(formData.accountPurpose),
            safeValue(formData.accountPurposeOther),
            safeValue(formData.authorizedPersonName),
            safeValue(formData.authorizedDebitPerson)
        ];
        
        debugLog(`Company details params: ${JSON.stringify(companyDetailsParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_company_details (
                application_id, company_name, business_license_no, business_entity, company_npwp,
                street_name, city, postal_code, place_of_establishment, establishment_date,
                legal_form, legal_form_other, office_telephone_country_code, office_telephone_no,
                beneficial_owner_name, beneficial_owner_id_no, source_of_funds, source_of_funds_other,
                account_purpose, account_purpose_other, authorized_person_name, authorized_debit_person
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            companyDetailsParams
        );
        
        // 4. Insert authorized person details
        debugLog(`=== INSERTING AUTHORIZED PERSON DETAILS ===`);
        const authorizedPersonParams = [
            applicationId,
            safeValue(formData.fullName),
            safeValue(formData.placeOfBirth),
            safeValue(formData.dateOfBirth),
            safeValue(formData.idPassportNo),
            safeValue(formData.npwpNo),
            safeValue(formData.gender),
            safeValue(formData.motherName),
            safeValue(formData.maritalStatus),
            safeValue(formData.nationality),
            safeValue(formData.nationalityOther),
            safeValue(formData.streetAddress),
            safeValue(formData.addressCity),
            safeValue(formData.addressPostalCode),
            safeValue(formData.homeTelephoneNo),
            safeValue(formData.handphoneNo),
            safeValue(formData.homeFaxNo),
            safeValue(formData.personalEmail),
            safeValue(formData.homeOwnershipStatus),
            safeValue(formData.homeOwnershipStatusOther),
            safeValue(formData.accountOpeningPurpose),
            safeValue(formData.accountOpeningPurposeOther),
            safeValue(formData.investmentExperience),
            safeValue(formData.investmentExperienceExplanation),
            safeValue(formData.futuresTradingExperience),
            safeValue(formData.familyInBappebti),
            safeValue(formData.declaredBankrupt)
        ];
        
        debugLog(`Authorized person params: ${JSON.stringify(authorizedPersonParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_company_authorized_person (
                application_id, full_name, place_of_birth, date_of_birth, id_passport_no, npwp_no,
                gender, mother_name, marital_status, nationality, nationality_other,
                street_address, address_city, address_postal_code, home_telephone_no, handphone_no,
                home_fax_no, personal_email, home_ownership_status, home_ownership_status_other,
                account_opening_purpose, account_opening_purpose_other, investment_experience,
                investment_experience_explanation, futures_trading_experience, family_in_bappebti, declared_bankrupt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            authorizedPersonParams
        );
        
        // 5. Insert emergency contact details
        debugLog(`=== INSERTING EMERGENCY CONTACT DETAILS ===`);
        const emergencyContactParams = [
            applicationId,
            safeValue(formData.emergencyContactName),
            safeValue(formData.emergencyContactHandphone),
            safeValue(formData.emergencyContactStreetAddress),
            safeValue(formData.emergencyContactCity),
            safeValue(formData.emergencyContactPostalCode),
            safeValue(formData.emergencyContactRelationship),
            safeValue(formData.emergencyContactRelationshipOther)
        ];
        
        debugLog(`Emergency contact params: ${JSON.stringify(emergencyContactParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_company_emergency_contact (
                application_id, emergency_contact_name, emergency_contact_handphone,
                emergency_contact_street_address, emergency_contact_city, emergency_contact_postal_code,
                emergency_contact_relationship, emergency_contact_relationship_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            emergencyContactParams
        );
        
        // 6. Insert employment details
        debugLog(`=== INSERTING EMPLOYMENT DETAILS ===`);
        const employmentParams = [
            applicationId,
            safeValue(formData.jobOfPowerOfAttorney),
            safeValue(formData.jobOfPowerOfAttorneyOther),
            safeValue(formData.employmentCompanyName),
            safeValue(formData.businessField),
            safeValue(formData.employmentPosition),
            safeValue(formData.lengthOfWork),
            safeValue(formData.previousCompany),
            safeValue(formData.officeStreetAddress),
            safeValue(formData.officeCity),
            safeValue(formData.officePostalCode),
            safeValue(formData.officePhoneCountryCode),
            safeValue(formData.officePhoneNo),
            safeValue(formData.officeFaxNo)
        ];
        
        debugLog(`Employment params: ${JSON.stringify(employmentParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_company_employment (
                application_id, job_of_power_of_attorney, job_of_power_of_attorney_other,
                employment_company_name, business_field, employment_position, length_of_work,
                previous_company, office_street_address, office_city, office_postal_code,
                office_phone_country_code, office_phone_no, office_fax_no
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            employmentParams
        );
        
        // 7. Insert assets information
        debugLog(`=== INSERTING ASSETS INFORMATION ===`);
        const assetsParams = [
            applicationId,
            safeValue(formData.annualIncome),
            safeValue(formData.houseLocation),
            safeValue(formData.njopValue),
            safeValue(formData.bankDeposit),
            safeValue(formData.totalAmount),
            safeValue(formData.otherAssets)
        ];
        
        debugLog(`Assets params: ${JSON.stringify(assetsParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_company_assets (
                application_id, annual_income, house_location, njop_value,
                bank_deposit, total_amount, other_assets
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            assetsParams
        );
        
        // 8. Insert bank accounts
        if (formData.bankAccounts && Array.isArray(formData.bankAccounts)) {
            debugLog(`=== INSERTING ${formData.bankAccounts.length} BANK ACCOUNTS ===`);
            for (let i = 0; i < formData.bankAccounts.length; i++) {
                const account = formData.bankAccounts[i];
                const bankAccountParams = [
                    applicationId,
                    safeValue(account.bankName),
                    safeValue(account.accountName || account.accountHolderName), // Handle both field names
                    safeValue(account.bankAddress || account.branch || ''), // Default if not provided, use branch as address if needed
                    safeValue(account.bankCity || account.branch || 'Jakarta'), // Map branch to city if needed, default to Jakarta
                    safeValue(account.bankCountry || 'ID'), // Default to Indonesia
                    safeValue(account.bankCountryOther),
                    safeValue(account.swiftCode || ''), // Default if not provided
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
        
        // 9. Handle document uploads
        const documentUploads = [];
        for (const file of files) {
            if (file) {
                try {
                    // Upload to S3
                    const fileName = `kyc/${applicationId}/${Date.now()}-${file.originalname}`;
                    const s3Response = await uploadToS3(file.buffer, fileName, file.mimetype);
                    
                    // Determine document category and type based on field name
                    const { category, type } = getIndonesianCompanyDocumentCategoryAndType(file.fieldname);
                    
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
        
        // 10. Insert agreements - using the new agreements table
        debugLog(`=== INSERTING AGREEMENTS ===`);
        const agreementsData = {
            company_profile_read: formData.companyProfileRead || false,
            company_profile_understanding: formData.companyProfileUnderstanding || false,
            statement_read: formData.statementRead || false,
            statement_understanding: formData.statementUnderstanding || false,
            trading_experience: safeValue(formData.tradingExperience),
            broker_company: safeValue(formData.brokerCompany),
            demo_account_number: safeValue(formData.demoAccountNumber),
            experience_statement_read: formData.experienceStatementRead || false,
            experience_understanding: formData.experienceUnderstanding || false,
            application_statement_read: formData.applicationStatementRead || false,
            application_understanding: formData.applicationUnderstanding || false,
            risk_disclosure_understanding: formData.riskDisclosureUnderstanding || false,
            risk_statement_1: formData.riskStatement1 || false,
            risk_statement_2: formData.riskStatement2 || false,
            risk_statement_3: formData.riskStatement3 || false,
            risk_statement_4: formData.riskStatement4 || false,
            risk_statement_5: formData.riskStatement5 || false,
            risk_statement_6: formData.riskStatement6 || false,
            risk_statement_7: formData.riskStatement7 || false,
            risk_statement_8: formData.riskStatement8 || false,
            risk_statement_9: formData.riskStatement9 || false,
            risk_statement_10: formData.riskStatement10 || false,
            risk_statement_11: formData.riskStatement11 || false,
            risk_statement_12: formData.riskStatement12 || false,
            risk_statement_13: formData.riskStatement13 || false,
            risk_statement_14: formData.riskStatement14 || false,
            mandate_statement_read: formData.mandateStatementRead || false,
            bakti_arbitration: formData.baktiArbitration || false,
            mandate_understanding: formData.mandateUnderstanding || false,
            trading_rules_read: formData.tradingRulesRead || false,
            trading_rules_understanding: formData.tradingRulesUnderstanding || false,
            personal_access_password_read: formData.personalAccessPasswordRead || false,
            personal_access_password_understanding: formData.personalAccessPasswordUnderstanding || false
        };
        
        const agreementParams = [
            applicationId,
            ...Object.values(agreementsData)
        ];
        
        debugLog(`Agreements params: ${JSON.stringify(agreementParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_company_agreements (
                application_id, company_profile_read, company_profile_understanding,
                statement_read, statement_understanding, trading_experience, broker_company, demo_account_number,
                experience_statement_read, experience_understanding, application_statement_read, application_understanding,
                risk_disclosure_understanding, risk_statement_1, risk_statement_2, risk_statement_3, risk_statement_4,
                risk_statement_5, risk_statement_6, risk_statement_7, risk_statement_8, risk_statement_9, risk_statement_10,
                risk_statement_11, risk_statement_12, risk_statement_13, risk_statement_14, mandate_statement_read,
                bakti_arbitration, mandate_understanding, trading_rules_read, trading_rules_understanding,
                personal_access_password_read, personal_access_password_understanding
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            agreementParams
        );
        
        await connection.commit();
        debugLog(`Successfully submitted Indonesian Company KYC application ${applicationId}`);
        
        res.json({
            success: true,
            data: {
                applicationId,
                applicationReference,
                message: 'Indonesian Company KYC application submitted successfully',
                documentsUploaded: documentUploads.length,
                documentDetails: documentUploads
            }
        });
        
    } catch (error) {
        await connection.rollback();
        debugLog(`Error in Indonesian Company KYC submission: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        next(error);
    } finally {
        connection.release();
        debugLog('=== INDONESIAN COMPANY KYC SUBMISSION COMPLETED ===');
    }
};

// Helper function to categorize documents based on field name for Indonesian Company
const getIndonesianCompanyDocumentCategoryAndType = (fieldName) => {
    const documentMapping = {
        // Company Documents
        'articlesOfAssociation': { category: 'Company Documents', type: 'Articles of Association' },
        'certificateOfIncorporation': { category: 'Company Documents', type: 'Certificate of Incorporation' },
        'financialStatements': { category: 'Company Documents', type: 'Financial Statements' },
        'managementStructure': { category: 'Company Documents', type: 'Management Structure' },
        'ownershipStructure': { category: 'Company Documents', type: 'Ownership Structure' },
        'boardOfResolutionFile': { category: 'Company Documents', type: 'Board of Resolution' },
        'powerOfAttorneyFile': { category: 'Company Documents', type: 'Power of Attorney' },
        
        // Personal Documents
        'currentAccountFile': { category: 'Personal Documents', type: 'Current Account Statement' },
        'electricityPhoneAccountFile': { category: 'Personal Documents', type: 'Electricity/Phone Bill' },
        'photoSelfiePersonalFile': { category: 'Personal Documents', type: 'Photo Selfie' },
        'identityPassportPersonalFile': { category: 'Personal Documents', type: 'Identity/Passport' },
        'npwpPersonalFile': { category: 'Personal Documents', type: 'NPWP Document' },
        
        // Generic fallback
        default: { category: 'Other Documents', type: 'Supporting Document' }
    };
    
    return documentMapping[fieldName] || documentMapping.default;
};

const submitIndonesianPersonKYC = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        debugLog('=== INDONESIAN PERSON KYC SUBMISSION STARTED ===');
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
        const applicationReference = `IP-${Date.now()}-${user_id}`;
        const [applicationResult] = await connection.execute(
            `INSERT INTO kyc_applications 
             (user_id, form_type, status, current_step, total_steps, application_reference, submitted_at) 
             VALUES (?, 'indonesian_person', 'submitted', 19, 19, ?, NOW())`,
            [user_id, applicationReference]
        );
        
        const applicationId = applicationResult.insertId;
        debugLog(`Created application with ID: ${applicationId}`);
        
        // 2. Insert email registration data
        debugLog(`=== INSERTING EMAIL DATA ===`);
        debugLog(`Email: ${formData.email}, Demo Account: ${formData.demoAccountNo}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_person_email (application_id, email, demo_account_no) 
             VALUES (?, ?, ?)`,
            [applicationId, safeValue(formData.email), safeValue(formData.demoAccountNo)]
        );
        
        // 3. Insert personal details with Indonesian-to-English field mapping
        debugLog(`=== INSERTING PERSONAL DETAILS ===`);
        
        // Map Indonesian form fields to English database fields
        const mapGender = (jenisKelamin) => {
            const mapping = {
                // Indonesian values
                'Laki-laki': 'LAKI_LAKI',
                'Perempuan': 'PEREMPUAN',
                // English values (from frontend)
                'Male': 'LAKI_LAKI',
                'Female': 'PEREMPUAN'
            };
            return mapping[jenisKelamin] || jenisKelamin;
        };
        
        const mapMaritalStatus = (statusPerkawinan) => {
            const mapping = {
                // Indonesian values
                'Belum Kawin': 'BELUM_KAWIN',
                'Kawin': 'KAWIN',
                'Cerai': 'CERAI',
                'Janda/Duda': 'JANDA_DUDA',
                // English values (from frontend)
                'Single': 'BELUM_KAWIN',
                'Married': 'KAWIN',
                'Divorced': 'CERAI',
                'Widowed': 'JANDA_DUDA'
            };
            return mapping[statusPerkawinan] || statusPerkawinan;
        };
        
        const mapHomeOwnership = (statusKepemilikanRumah) => {
            const mapping = {
                // Indonesian values (already correct from frontend)
                'Pribadi': 'PRIBADI',
                'Keluarga': 'KELUARGA',
                'Sewa/Kontrak': 'SEWA_KONTRAK',
                'Lainnya': 'LAINNYA'
            };
            return mapping[statusKepemilikanRumah] || statusKepemilikanRumah;
        };
        
        const mapAccountPurpose = (tujuanPembukaanRekening) => {
            const mapping = {
                // Indonesian values (need to check what frontend sends)
                'Lindung Nilai': 'LINDUNG_NILAI',
                'Keuntungan': 'KEUNTUNGAN', 
                'Spekulasi': 'SPEKULASI',
                'Lainnya': 'LAINNYA'
            };
            return mapping[tujuanPembukaanRekening] || tujuanPembukaanRekening;
        };
        
        const mapInvestmentExperience = (pengalamanInvestasi) => {
            const mapping = {
                // Indonesian values
                'Ya, di bidang': 'YA',
                'Ya': 'YA',
                'Tidak': 'TIDAK',
                // English values (from frontend)
                'Yes': 'YA',
                'None': 'TIDAK'
            };
            return mapping[pengalamanInvestasi] || pengalamanInvestasi;
        };
        
        const mapYesNo = (value) => {
            const mapping = {
                // Indonesian values
                'Ya': 'YA',
                'Tidak': 'TIDAK',
                // English values (from frontend)
                'Yes': 'YA',
                'No': 'TIDAK'
            };
            return mapping[value] || value;
        };
        
        const personalDetailsParams = [
            applicationId,
            safeValue(formData.namaLengkap), // full_name
            safeValue(formData.tempatLahir), // place_of_birth
            safeValue(formData.tanggalLahir), // date_of_birth
            safeValue(formData.noKTP), // id_card_no
            safeValue(formData.noNPWP), // npwp_no
            mapGender(safeValue(formData.jenisKelamin)), // gender
            safeValue(formData.namaIbuKandung), // mother_name
            mapMaritalStatus(safeValue(formData.statusPerkawinan)), // marital_status
            safeValue(formData.namaIstriSuami), // spouse_name
            safeValue(formData.streetAddress), // street_address
            safeValue(formData.city), // city
            safeValue(formData.postalCode), // postal_code
            safeValue(formData.noTelephoneRumah), // home_phone_no
            safeValue(formData.noHandphone), // mobile_phone_no
            safeValue(formData.noFaksimiliRumah), // home_fax_no
            mapHomeOwnership(safeValue(formData.statusKepemilikanRumah)), // home_ownership_status
            safeValue(formData.statusKepemilikanRumahOther), // home_ownership_status_other
            mapAccountPurpose(safeValue(formData.tujuanPembukaanRekening)), // account_opening_purpose
            safeValue(formData.tujuanPembukaanRekeningOther), // account_opening_purpose_other
            mapInvestmentExperience(safeValue(formData.pengalamanInvestasi)), // investment_experience
            safeValue(formData.pengalamanInvestasiBidang), // investment_experience_details
            mapYesNo(safeValue(formData.anggotaKeluargaBAPPEBTI)), // family_in_bappebti
            mapYesNo(safeValue(formData.pernahPailit)) // declared_bankrupt
        ];
        
        debugLog(`Personal details params: ${JSON.stringify(personalDetailsParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_person_details (
                application_id, full_name, place_of_birth, date_of_birth, id_card_no, npwp_no,
                gender, mother_name, marital_status, spouse_name, street_address, city, postal_code,
                home_phone_no, mobile_phone_no, home_fax_no, home_ownership_status, home_ownership_status_other,
                account_opening_purpose, account_opening_purpose_other, investment_experience, investment_experience_details,
                family_in_bappebti, declared_bankrupt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            personalDetailsParams
        );
        
        // 4. Insert emergency contact details
        debugLog(`=== INSERTING EMERGENCY CONTACT DETAILS ===`);
        
        const mapRelationship = (emergencyContactRelationship) => {
            const mapping = {
                'Pasangan': 'PASANGAN',
                'Keluarga': 'KELUARGA',
                'Anak': 'ANAK',
                'Lainnya': 'LAINNYA'
            };
            return mapping[emergencyContactRelationship] || emergencyContactRelationship;
        };
        
        const emergencyContactParams = [
            applicationId,
            safeValue(formData.emergencyContactName),
            safeValue(formData.emergencyContactPhone),
            safeValue(formData.emergencyContactStreetAddress),
            safeValue(formData.emergencyContactCity),
            safeValue(formData.emergencyContactPostalCode),
            mapRelationship(safeValue(formData.emergencyContactRelationship)),
            safeValue(formData.emergencyContactRelationshipOther)
        ];
        
        debugLog(`Emergency contact params: ${JSON.stringify(emergencyContactParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_person_emergency_contact (
                application_id, emergency_contact_name, emergency_contact_phone,
                emergency_contact_street_address, emergency_contact_city, emergency_contact_postal_code,
                emergency_contact_relationship, emergency_contact_relationship_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            emergencyContactParams
        );
        
        // 5. Insert employment details
        debugLog(`=== INSERTING EMPLOYMENT DETAILS ===`);
        
        const mapEmploymentType = (jenisPekerjaan) => {
            const mapping = {
                'Swasta': 'SWASTA',
                'Wiraswasta': 'WIRASWASTA',
                'Ibu RT': 'IBU_RT',
                'Profesional': 'PROFESIONAL',
                'ASN': 'ASN',
                'Mahasiswa': 'MAHASISWA',
                'Lainnya': 'LAINNYA'
            };
            return mapping[jenisPekerjaan] || jenisPekerjaan;
        };
        
        const employmentParams = [
            applicationId,
            mapEmploymentType(safeValue(formData.jenisPekerjaan)), // employment_type
            safeValue(formData.jenisPekerjaanOther), // employment_type_other
            safeValue(formData.namaPerusahaan), // company_name
            safeValue(formData.bidangUsaha), // business_field
            safeValue(formData.jabatan), // position
            safeValue(formData.lamaBekerja), // length_of_work
            safeValue(formData.perusahaanSebelumnya), // previous_company
            safeValue(formData.alamatKantor), // office_street_address
            safeValue(formData.kotaKantor), // office_city
            safeValue(formData.kodeposKantor), // office_postal_code
            safeValue(formData.countryCodeKantor), // office_phone_country_code
            safeValue(formData.noTelephoneKantor), // office_phone_no
            safeValue(formData.noFaksimiliKantor) // office_fax_no
        ];
        
        debugLog(`Employment params: ${JSON.stringify(employmentParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_person_employment (
                application_id, employment_type, employment_type_other, company_name, business_field,
                position, length_of_work, previous_company, office_street_address, office_city,
                office_postal_code, office_phone_country_code, office_phone_no, office_fax_no
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            employmentParams
        );
        
        // 6. Insert assets information
        debugLog(`=== INSERTING ASSETS INFORMATION ===`);
        
        const mapAnnualIncome = (penghasilanPertahun) => {
            const mapping = {
                'Antara 100 - 250 juta rupiah': '100_250_JUTA',
                'Antara 250 - 500 juta rupiah': '250_500_JUTA',
                'Di atas 500 juta rupiah': 'ABOVE_500_JUTA'
            };
            return mapping[penghasilanPertahun] || penghasilanPertahun;
        };
        
        const assetsParams = [
            applicationId,
            mapAnnualIncome(safeValue(formData.penghasilanPertahun)), // annual_income
            safeValue(formData.lokasiRumah), // home_location
            safeValue(formData.nilaiNJOP), // njop_value
            safeValue(formData.bankDeposit), // bank_deposit
            safeValue(formData.jumlahTotal), // total_amount
            safeValue(formData.kekayaanLain) // other_assets
        ];
        
        debugLog(`Assets params: ${JSON.stringify(assetsParams)}`);
        await connection.execute(
            `INSERT INTO kyc_indonesian_person_assets (
                application_id, annual_income, home_location, njop_value,
                bank_deposit, total_amount, other_assets
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            assetsParams
        );
        
        // 7. Insert bank accounts (reuse existing table with Indonesian-specific fields)
        if (formData.bankAccounts && Array.isArray(formData.bankAccounts)) {
            debugLog(`=== INSERTING ${formData.bankAccounts.length} BANK ACCOUNTS ===`);
            for (let i = 0; i < formData.bankAccounts.length; i++) {
                const account = formData.bankAccounts[i];
                
                const mapBankAccountType = (bankAccountType) => {
                    const mapping = {
                        'Giro': 'GIRO',
                        'Tabungan': 'TABUNGAN',
                        'Lainnya': 'LAINNYA'
                    };
                    return mapping[bankAccountType] || bankAccountType;
                };
                
                const bankAccountParams = [
                    applicationId,
                    safeValue(account.namaBank), // bank_name
                    safeValue(account.namaPemilikRekening), // account_name
                    safeValue(account.cabang || ''), // bank_address (using branch as address)
                    safeValue(account.cabang || 'Jakarta'), // bank_city (using branch, default Jakarta)
                    safeValue(account.bankCountry || 'ID'), // bank_country (default Indonesia)
                    safeValue(account.bankCountryOther), // bank_country_other
                    safeValue(account.swiftCode || ''), // swift_code
                    safeValue(account.noRekening), // account_no
                    i + 1, // account_order
                    safeValue(account.namaPemilikRekening), // account_holder_name (duplicate for compatibility)
                    safeValue(account.countryCodeBank || '+62'), // bank_telephone_country_code
                    safeValue(account.noTeleponBank), // bank_telephone_no
                    mapBankAccountType(safeValue(account.bankAccountType)), // bank_account_type
                    safeValue(account.bankAccountTypeOther) // bank_account_type_other
                ];
                
                debugLog(`Bank account ${i + 1} params: ${JSON.stringify(bankAccountParams)}`);
                await connection.execute(
                    `INSERT INTO kyc_bank_accounts (
                        application_id, bank_name, account_name, bank_address, bank_city,
                        bank_country, bank_country_other, swift_code, account_no, account_order,
                        account_holder_name, bank_telephone_country_code, bank_telephone_no,
                        bank_account_type, bank_account_type_other
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    bankAccountParams
                );
            }
        }
        
        // 8. Handle document uploads (reuse existing table)
        const documentUploads = [];
        for (const file of files) {
            if (file) {
                try {
                    // Upload to S3
                    const fileName = `kyc/${applicationId}/${Date.now()}-${file.originalname}`;
                    const s3Response = await uploadToS3(file.buffer, fileName, file.mimetype);
                    
                    // Determine document category and type based on field name for Indonesian Person
                    const { category, type } = getIndonesianPersonDocumentCategoryAndType(file.fieldname);
                    
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
        
        // 9. Insert agreements (Indonesian Person specific agreements - simplified approach using kyc_agreements table)
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
            company_profile: 'https://drive.google.com/file/d/company_profile_indonesian_person',
            statement_simulation: 'https://drive.google.com/file/d/statement_simulation_indonesian_person',
            statement_experience: 'https://drive.google.com/file/d/statement_experience_indonesian_person',
            disclosure_statement: 'https://drive.google.com/file/d/disclosure_statement_indonesian_person',
            account_opening: 'https://drive.google.com/file/d/account_opening_indonesian_person',
            risk_disclosure: 'https://drive.google.com/file/d/risk_disclosure_indonesian_person',
            mandate_agreement: 'https://drive.google.com/file/d/mandate_agreement_indonesian_person',
            trading_rules: 'https://drive.google.com/file/d/trading_rules_indonesian_person',
            personal_access_password: 'https://drive.google.com/file/d/personal_access_password_indonesian_person'
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
        debugLog(`Successfully submitted Indonesian Person KYC application ${applicationId}`);
        
        res.json({
            success: true,
            data: {
                applicationId,
                applicationReference,
                message: 'Indonesian Person KYC application submitted successfully',
                documentsUploaded: documentUploads.length,
                documentDetails: documentUploads
            }
        });
        
    } catch (error) {
        await connection.rollback();
        debugLog(`Error in Indonesian Person KYC submission: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        next(error);
    } finally {
        connection.release();
        debugLog('=== INDONESIAN PERSON KYC SUBMISSION COMPLETED ===');
    }
};

// Helper function to categorize documents based on field name for Indonesian Person
const getIndonesianPersonDocumentCategoryAndType = (fieldName) => {
    const documentMapping = {
        // Personal Documents
        'ktpFile': { category: 'Identity Documents', type: 'KTP (Identity Card)' },
        'npwpFile': { category: 'Tax Documents', type: 'NPWP Document' },
        'photoSelfieFile': { category: 'Identity Documents', type: 'Photo Selfie' },
        
        // Financial Documents
        'bankStatementFile': { category: 'Financial Documents', type: 'Bank Account Statement' },
        'creditCardBillFile': { category: 'Financial Documents', type: 'Credit Card Bill' },
        
        // Utility Documents
        'electricityBillFile': { category: 'Utility Documents', type: 'Electricity Bill' },
        'phoneBillFile': { category: 'Utility Documents', type: 'Phone Bill' },
        
        // Employment Documents
        'employmentLetterFile': { category: 'Employment Documents', type: 'Employment Letter' },
        'salarySlipFile': { category: 'Employment Documents', type: 'Salary Slip' },
        
        // Asset Documents
        'assetDocumentFile': { category: 'Asset Documents', type: 'Asset Documentation' },
        'propertyDocumentFile': { category: 'Asset Documents', type: 'Property Document' },
        
        // Generic fallback
        default: { category: 'Other Documents', type: 'Supporting Document' }
    };
    
    return documentMapping[fieldName] || documentMapping.default;
};

const submitRegulatedCompanyKYC = async (req, res, next) => {
    const connection = await pool.getConnection();
    
    try {
        debugLog('=== REGULATED COMPANY KYC SUBMISSION STARTED ===');
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
        const applicationReference = `RC-${Date.now()}-${user_id}`;
        const [applicationResult] = await connection.execute(
            `INSERT INTO kyc_applications 
             (user_id, form_type, status, current_step, total_steps, application_reference, submitted_at) 
             VALUES (?, 'regulated_company', 'submitted', 6, 6, ?, NOW())`,
            [user_id, applicationReference]
        );
        
        const applicationId = applicationResult.insertId;
        debugLog(`Created application with ID: ${applicationId}`);
        
        // 2. Insert email registration data
        debugLog(`=== INSERTING EMAIL DATA ===`);
        debugLog(`Email: ${formData.email}, Demo Account (camelCase): ${formData.demoAccountNo}, Demo Account (snake_case): ${formData.demo_account_no}`);
        await connection.execute(
            `INSERT INTO kyc_regulated_company_email (application_id, email, demo_account_no) 
             VALUES (?, ?, ?)`,
            [applicationId, safeValue(formData.email), safeValue(formData.demo_account_no)]
        );
        
        // 3. Insert company details (ONLY fields that exist in the form)
        debugLog(`=== INSERTING COMPANY DETAILS ===`);
        const companyDetailsParams = [
            applicationId,
            safeValue(formData.company_registration_name),
            safeValue(formData.company_license_no),
            safeValue(formData.nature_of_business),
            safeValue(formData.company_legal_form),
            safeValue(formData.company_legal_form_other),
            safeValue(formData.street_address),
            safeValue(formData.city),
            safeValue(formData.postal_code),
            safeValue(formData.country),
            safeValue(formData.country_other),
            safeValue(formData.place_of_establishment),
            safeValue(formData.date_of_establishment),
            safeValue(formData.country_code),
            safeValue(formData.office_telephone_no),
            safeValue(formData.beneficial_owner_name),
            safeValue(formData.beneficial_owner_passport_no),
            safeValue(formData.source_of_funds),
            safeValue(formData.source_of_funds_other),
            safeValue(formData.trading_account_purpose),
            safeValue(formData.trading_account_purpose_other)
        ];
        
        debugLog(`Company details params: ${JSON.stringify(companyDetailsParams)}`);
        await connection.execute(
            `INSERT INTO kyc_regulated_company_details (
                application_id, company_registration_name, company_license_no, nature_of_business,
                company_legal_form, company_legal_form_other, street_address, city, postal_code,
                country, country_other, place_of_establishment, date_of_establishment,
                country_code, office_telephone_no, beneficial_owner_name, beneficial_owner_passport_no,
                source_of_funds, source_of_funds_other, trading_account_purpose, trading_account_purpose_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            companyDetailsParams
        );
        
        // 4. Insert authorized person details (ONLY fields that exist in the form)
        debugLog(`=== INSERTING AUTHORIZED PERSON DATA ===`);
        const authorizedPersonParams = [
            applicationId,
            safeValue(formData.title),
            safeValue(formData.full_name),
            safeValue(formData.place_of_birth),
            safeValue(formData.date_of_birth),
            safeValue(formData.passport_id),
            safeValue(formData.email),
            safeValue(formData.gender),
            safeValue(formData.marital_status),
            safeValue(formData.citizen),
            safeValue(formData.citizen_other),
            safeValue(formData.country_code),
            safeValue(formData.phone_number),
            safeValue(formData.street_address),
            safeValue(formData.city),
            safeValue(formData.postal_code),
            safeValue(formData.country),
            safeValue(formData.country_other),
            safeValue(formData.investment_experience),
            safeValue(formData.investment_experience_details),
            safeValue(formData.family_in_bappebti),
            safeValue(formData.declared_bankrupt),
            safeValue(formData.company_name),
            safeValue(formData.business_nature),
            safeValue(formData.job_position),
            safeValue(formData.office_address),
            safeValue(formData.office_city),
            safeValue(formData.office_postal_code),
            safeValue(formData.office_country),
            safeValue(formData.office_country_other)
        ];
        
        debugLog(`Authorized person params: ${JSON.stringify(authorizedPersonParams)}`);
        await connection.execute(
            `INSERT INTO kyc_regulated_company_authorized_person (
                application_id, title, full_name, place_of_birth, date_of_birth, passport_id,
                email, gender, marital_status, citizen, citizen_other, country_code, phone_number,
                street_address, city, postal_code, country, country_other, investment_experience,
                investment_experience_details, family_in_bappebti, declared_bankrupt, company_name, business_nature, job_position,
                office_address, office_city, office_postal_code, office_country, office_country_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            authorizedPersonParams
        );

        // 5. Handle bank accounts (shared table)
        debugLog(`=== INSERTING BANK ACCOUNTS ===`);
        if (formData.bankAccounts && Array.isArray(formData.bankAccounts)) {
            for (let i = 0; i < formData.bankAccounts.length; i++) {
                const account = formData.bankAccounts[i];
                debugLog(`Inserting bank account ${i + 1}: ${JSON.stringify(account)}`);
                
                const bankAccountParams = [
                    applicationId,
                    safeValue(account.bankName),
                    safeValue(account.accountName),
                    safeValue(account.bankAddress),
                    safeValue(account.bankCity),
                    safeValue(account.bankCountry),
                    safeValue(account.bankCountryOther),
                    safeValue(account.swiftCode),
                    safeValue(account.accountNo), // This should be encrypted before storage in production
                    i + 1 // account_order
                ];
                
                await connection.execute(
                    `INSERT INTO kyc_bank_accounts (
                        application_id, bank_name, account_name, bank_address, bank_city,
                        bank_country, bank_country_other, swift_code, account_no, account_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    bankAccountParams
                );
                debugLog(`Bank account ${i + 1} inserted successfully`);
            }
        }
        
        // 6. Handle file uploads (shared table)
        debugLog(`=== PROCESSING FILE UPLOADS ===`);
        if (files && files.length > 0) {
            for (const file of files) {
                try {
                    debugLog(`Processing file: ${file.originalname}, Field: ${file.fieldname}`);
                    
                    // Upload to S3
                    const s3Result = await uploadToS3(file, 'kyc-documents');
                    debugLog(`S3 upload result: ${JSON.stringify(s3Result)}`);
                    
                    // Get document category and type based on field name
                    const docInfo = getDocumentInfo(file.fieldname);
                    
                    // Insert document record
                    await connection.execute(
                        `INSERT INTO kyc_documents (
                            application_id, document_category, document_type, original_filename,
                            stored_filename, file_path, file_size, mime_type
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            applicationId,
                            docInfo.category,
                            docInfo.type,
                            file.originalname,
                            s3Result.fileName,
                            s3Result.fileUrl,
                            file.size,
                            file.mimetype
                        ]
                    );
                    
                    debugLog(`Document record inserted for: ${file.originalname}`);
                } catch (fileError) {
                    debugLog(`Error processing file ${file.originalname}: ${fileError.message}`);
                    // Continue with other files, but log the error
                }
            }
        }
        
        // 9. Handle agreements (shared table)
        debugLog(`=== PROCESSING AGREEMENTS ===`);
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
        
        for (const agreementType of agreementTypes) {
            const agreedFieldName = `${agreementType.replace(/_/g, '')}Agreed`;
            const isAgreed = formData[agreedFieldName] === true || formData[agreedFieldName] === 'true';
            
            if (isAgreed) {
                await connection.execute(
                    `INSERT INTO kyc_agreements (application_id, agreement_type, agreed, agreed_at)
                     VALUES (?, ?, ?, NOW())`,
                    [applicationId, agreementType, true]
                );
                debugLog(`Agreement recorded: ${agreementType}`);
            }
        }
        
        await connection.commit();
        debugLog('=== REGULATED COMPANY KYC SUBMISSION COMPLETED SUCCESSFULLY ===');
        
        res.status(201).json({
            success: true,
            message: 'Regulated Company KYC application submitted successfully',
            data: {
                applicationId: applicationId,
                applicationReference: applicationReference,
                status: 'submitted'
            }
        });
        
    } catch (error) {
        await connection.rollback();
        debugLog(`ERROR in submitRegulatedCompanyKYC: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        
        res.status(500).json({
            success: false,
            message: 'Failed to submit Regulated Company KYC application',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    submitForeignCompanyKYC,
    submitForeignPersonKYC,
    submitIndonesianCompanyKYC,
    submitIndonesianPersonKYC,
    submitRegulatedCompanyKYC,
    getKYCApplicationStatus,
    getUserKYCApplications
};
