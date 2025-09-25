-- Foreign Person KYC Schema
-- Extends the existing KYC system to support Foreign Person applications
-- Uses the existing kyc_applications, kyc_bank_accounts, kyc_documents, and kyc_agreements tables

-- ============================================================================
-- KYC FOREIGN PERSON IMPLEMENTATION
-- ============================================================================

-- Step 2: Personal Email Registration
CREATE TABLE `kyc_foreign_person_email` (
    `email_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `email` varchar(255) NOT NULL,
    `demo_account_no` varchar(50) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`email_id`),
    UNIQUE KEY `uk_application_person_email` (`application_id`),
    CONSTRAINT `fk_kyc_fp_email_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 3: Personal Data (comprehensive personal information)
CREATE TABLE `kyc_foreign_person_details` (
    `details_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Basic Personal Information
    `personal_title` enum('MR','MRS','MS','DR') NOT NULL,
    `full_name` varchar(255) NOT NULL,
    `place_of_birth` varchar(255) NOT NULL,
    `date_of_birth` date NOT NULL,
    `passport_id` varchar(50) NOT NULL,
    `gender` enum('Male','Female') NOT NULL,
    `marital_status` enum('Single','Married','Divorced','Widowed') NOT NULL,
    `citizen` varchar(3) NOT NULL,
    `citizen_other` varchar(100) DEFAULT NULL, -- conditional field
    
    -- Address Information
    `street_address` varchar(500) NOT NULL,
    `city` varchar(100) NOT NULL,
    `postal_code` varchar(20) NOT NULL,
    `country` varchar(3) NOT NULL,
    `country_other` varchar(100) DEFAULT NULL, -- conditional field
    
    -- Contact Information
    `country_code` varchar(5) NOT NULL,
    `phone_number` varchar(20) NOT NULL,
    `personal_email` varchar(255) NOT NULL,
    
    -- Background Information
    `source_of_funds` enum('BUSINESS_INCOME','INVESTMENT_INCOME','INHERITANCE','SAVINGS','LOAN','OTHER') NOT NULL,
    `source_of_funds_other` varchar(255) DEFAULT NULL, -- conditional field
    `trading_account_purpose` enum('Hedging','Gain','Speculation','Others') NOT NULL,
    `trading_account_purpose_other` varchar(255) DEFAULT NULL, -- conditional field
    `investment_experience` enum('Yes','None') NOT NULL,
    `investment_experience_details` text DEFAULT NULL, -- conditional field
    `family_in_bappebti` enum('Yes','No') NOT NULL,
    `declared_bankrupt` enum('Yes','No') NOT NULL,
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`details_id`),
    UNIQUE KEY `uk_application_person_details` (`application_id`),
    CONSTRAINT `fk_kyc_fp_details_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 4: Emergency Contact Information
CREATE TABLE `kyc_foreign_person_emergency_contact` (
    `emergency_contact_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Emergency Contact Basic Info
    `emergency_title` enum('MR','MRS','MS','DR') NOT NULL,
    `emergency_full_name` varchar(255) NOT NULL,
    `emergency_relationship` enum('SPOUSE','FAMILY','CHILD','OTHER') NOT NULL,
    `emergency_relationship_other` varchar(255) DEFAULT NULL, -- conditional field
    
    -- Emergency Contact Address
    `emergency_street_address` varchar(500) NOT NULL,
    `emergency_city` varchar(100) NOT NULL,
    `emergency_postal_code` varchar(20) NOT NULL,
    `emergency_country` varchar(3) NOT NULL,
    `emergency_country_other` varchar(100) DEFAULT NULL, -- conditional field
    
    -- Emergency Contact Information
    `emergency_country_code` varchar(5) NOT NULL,
    `emergency_phone_number` varchar(20) NOT NULL,
    `emergency_email` varchar(255) NOT NULL,
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`emergency_contact_id`),
    UNIQUE KEY `uk_application_emergency_contact` (`application_id`),
    CONSTRAINT `fk_kyc_fp_emergency_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 5: Employment Data
CREATE TABLE `kyc_foreign_person_employment` (
    `employment_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Employment Status
    `employment_status` enum('WORK','ENTREPRENEUR','RETIRED','STUDENT') NOT NULL,
    
    -- Employment Information (conditional based on status)
    `company_name` varchar(255) DEFAULT NULL,
    `business_nature` varchar(255) DEFAULT NULL,
    `job_position` varchar(255) DEFAULT NULL,
    `length_of_work` varchar(100) DEFAULT NULL,
    `previous_company` varchar(255) DEFAULT NULL,
    `monthly_income` varchar(100) DEFAULT NULL,
    `annual_income` varchar(100) DEFAULT NULL,
    
    -- Office Contact
    `office_country_code` varchar(5) DEFAULT NULL,
    `office_phone_number` varchar(20) DEFAULT NULL,
    
    -- Office Address (conditional)
    `office_street_address` varchar(500) DEFAULT NULL,
    `office_city` varchar(100) DEFAULT NULL,
    `office_postal_code` varchar(20) DEFAULT NULL,
    `office_country` varchar(3) DEFAULT NULL,
    `office_country_other` varchar(100) DEFAULT NULL, -- conditional field
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`employment_id`),
    UNIQUE KEY `uk_application_employment` (`application_id`),
    CONSTRAINT `fk_kyc_fp_employment_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Note: Bank Accounts, Documents, and Agreements tables are shared with foreign company
-- They use the same kyc_bank_accounts, kyc_documents, and kyc_agreements tables

-- Indexes for performance
CREATE INDEX idx_kyc_fp_email_app ON kyc_foreign_person_email(application_id);
CREATE INDEX idx_kyc_fp_details_app ON kyc_foreign_person_details(application_id);
CREATE INDEX idx_kyc_fp_emergency_app ON kyc_foreign_person_emergency_contact(application_id);
CREATE INDEX idx_kyc_fp_employment_app ON kyc_foreign_person_employment(application_id);
