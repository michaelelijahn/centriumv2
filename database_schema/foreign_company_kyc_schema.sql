-- Simplified KYC Schema for Foreign Company Form
-- Handles all conditional pathways without overengineering

-- Add to existing database (after existing tables)

-- ============================================================================
-- KYC FOREIGN COMPANY IMPLEMENTATION
-- ============================================================================

-- Master applications table
CREATE TABLE `kyc_applications` (
    `application_id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `form_type` enum('foreign_company','foreign_person','indonesian_company','indonesian_person','regulated_company') NOT NULL DEFAULT 'foreign_company',
    `status` enum('draft','submitted','under_review','approved','rejected') NOT NULL DEFAULT 'draft',
    `current_step` int(11) NOT NULL DEFAULT 0,
    `total_steps` int(11) NOT NULL DEFAULT 6,
    `application_reference` varchar(50) DEFAULT NULL,
    `submitted_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`application_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_status` (`status`),
    CONSTRAINT `fk_kyc_app_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 1: Email Registration
CREATE TABLE `kyc_foreign_company_email` (
    `email_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `email` varchar(255) NOT NULL,
    `demo_account_no` varchar(50) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`email_id`),
    UNIQUE KEY `uk_application_email` (`application_id`),
    CONSTRAINT `fk_kyc_fc_email_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 2: Company Details (including ALL conditional fields)
CREATE TABLE `kyc_foreign_company_details` (
    `details_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Required company fields
    `company_registration_name` varchar(255) NOT NULL,
    `company_license_no` varchar(100) NOT NULL,
    `nature_of_business` varchar(255) NOT NULL,
    `company_legal_form` enum('LIMITED_LIABILITY_COMPANY','CORPORATION','PARTNERSHIP','SOLE_PROPRIETORSHIP','OTHER') NOT NULL,
    `company_legal_form_other` varchar(255) DEFAULT NULL, -- conditional field
    
    -- Address fields
    `street_address` varchar(500) NOT NULL,
    `city` varchar(100) NOT NULL,
    `postal_code` varchar(20) NOT NULL,
    `country` varchar(3) NOT NULL,
    `country_other` varchar(100) DEFAULT NULL, -- conditional field
    
    -- Establishment fields
    `place_of_establishment` varchar(255) NOT NULL,
    `date_of_establishment` date NOT NULL,
    `country_code` varchar(5) NOT NULL,
    `office_telephone_no` varchar(20) NOT NULL,
    
    -- Beneficial owner
    `beneficial_owner_name` varchar(255) NOT NULL,
    `beneficial_owner_passport_no` varchar(50) NOT NULL,
    
    -- Trading account info
    `source_of_funds` enum('BUSINESS_INCOME','INVESTMENT_INCOME','INHERITANCE','SAVINGS','LOAN','OTHER') NOT NULL,
    `source_of_funds_other` varchar(255) DEFAULT NULL, -- conditional field
    `trading_account_purpose` enum('HEDGING','SPECULATION','ARBITRAGE','INVESTMENT','OTHER') NOT NULL,
    `trading_account_purpose_other` varchar(255) DEFAULT NULL, -- conditional field
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`details_id`),
    UNIQUE KEY `uk_application_details` (`application_id`),
    CONSTRAINT `fk_kyc_fc_details_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 4: Authorized Person (including ALL conditional fields)
CREATE TABLE `kyc_foreign_company_authorized_person` (
    `authorized_person_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Basic personal info
    `title` enum('MR','MRS','MS','DR') NOT NULL,
    `full_name` varchar(255) NOT NULL,
    `place_of_birth` varchar(255) NOT NULL,
    `date_of_birth` date NOT NULL,
    `passport_id` varchar(50) NOT NULL,
    `email` varchar(255) NOT NULL,
    `gender` enum('MALE','FEMALE') NOT NULL,
    `marital_status` enum('SINGLE','MARRIED','DIVORCED','WIDOWED') NOT NULL,
    `citizen` varchar(3) NOT NULL,
    `citizen_other` varchar(100) DEFAULT NULL, -- conditional field
    `country_code` varchar(5) NOT NULL,
    `phone_number` varchar(20) NOT NULL,
    
    -- Address Information
    `street_address` varchar(500) NOT NULL,
    `city` varchar(100) NOT NULL,
    `postal_code` varchar(20) NOT NULL,
    `country` varchar(3) NOT NULL,
    `country_other` varchar(100) DEFAULT NULL, -- conditional field
    
    -- Background Information
    `investment_experience` enum('YES','NO') NOT NULL,
    `investment_experience_details` text DEFAULT NULL, -- conditional field
    `family_in_bappebti` enum('YES','NO') NOT NULL,
    `declared_bankrupt` enum('YES','NO') NOT NULL,
    
    -- Employment Data
    `company_name` varchar(255) NOT NULL,
    `business_nature` varchar(255) NOT NULL,
    `job_position` varchar(255) NOT NULL,
    `office_address` varchar(500) NOT NULL,
    `office_city` varchar(100) NOT NULL,
    `office_postal_code` varchar(20) NOT NULL,
    `office_country` varchar(3) NOT NULL,
    `office_country_other` varchar(100) DEFAULT NULL, -- conditional field
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`authorized_person_id`),
    UNIQUE KEY `uk_application_auth_person` (`application_id`),
    CONSTRAINT `fk_kyc_fc_auth_person_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bank Accounts (supports multiple accounts per application)
CREATE TABLE `kyc_bank_accounts` (
    `bank_account_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `bank_name` varchar(255) NOT NULL,
    `account_name` varchar(255) NOT NULL,
    `bank_address` varchar(500) NOT NULL,
    `bank_city` varchar(100) NOT NULL,
    `bank_country` varchar(3) NOT NULL,
    `bank_country_other` varchar(100) DEFAULT NULL, -- conditional field
    `swift_code` varchar(20) NOT NULL,
    `account_no` text NOT NULL, -- encrypted
    `account_order` int(11) NOT NULL DEFAULT 1,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`bank_account_id`),
    KEY `idx_application_id` (`application_id`),
    CONSTRAINT `fk_kyc_bank_accounts_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Documents (flexible for all document types)
CREATE TABLE `kyc_documents` (
    `document_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `document_category` varchar(100) NOT NULL,
    `document_type` varchar(100) NOT NULL,
    `original_filename` varchar(255) NOT NULL,
    `stored_filename` varchar(255) NOT NULL,
    `file_path` varchar(500) NOT NULL,
    `file_size` bigint(20) NOT NULL,
    `mime_type` varchar(100) NOT NULL,
    `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`document_id`),
    KEY `idx_application_id` (`application_id`),
    KEY `idx_document_category` (`document_category`),
    CONSTRAINT `fk_kyc_documents_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 5: Agreements (the 9 required checkboxes)
CREATE TABLE `kyc_agreements` (
    `agreement_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `agreement_type` enum(
        'company_profile',
        'statement_simulation', 
        'statement_experience',
        'disclosure_statement',
        'account_opening',
        'risk_disclosure',
        'mandate_agreement',
        'trading_rules',
        'personal_access_password'
    ) NOT NULL,
    `agreed` boolean NOT NULL DEFAULT false,
    `agreed_at` timestamp NULL DEFAULT NULL,
    `document_url` varchar(500) DEFAULT NULL,
    PRIMARY KEY (`agreement_id`),
    UNIQUE KEY `uk_application_agreement` (`application_id`, `agreement_type`),
    KEY `idx_application_id` (`application_id`),
    CONSTRAINT `fk_kyc_agreements_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Pre-populate agreement types with their URLs
INSERT INTO `kyc_agreements` (`application_id`, `agreement_type`, `document_url`, `agreed`) VALUES
-- These will be created for each new application via the API
-- Just showing the document URLs from the form
-- company_profile: https://drive.google.com/file/d/1_29Uaed83l9pSudtzJO8oqWh5sD49A77/view
-- statement_simulation: https://drive.google.com/file/d/1UlhVYACvANdTruDqe7ZUpUjDkqDheIwB/view
-- etc.

-- Indexes for performance
CREATE INDEX idx_kyc_app_user_status ON kyc_applications(user_id, status);
CREATE INDEX idx_kyc_app_form_type ON kyc_applications(form_type, status);
CREATE INDEX idx_kyc_documents_app_category ON kyc_documents(application_id, document_category);
