-- Corrected Regulated Company KYC Database Schema
-- This schema includes ONLY the fields that are actually collected by the RegulatedCompanyForm
-- Based on analysis of the frontend form fields vs backend controller expectations

-- ============================================================================
-- KYC REGULATED COMPANY IMPLEMENTATION (CORRECTED)
-- ============================================================================

-- Step 1: Email Registration
CREATE TABLE `kyc_regulated_company_email` (
    `email_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `email` varchar(255) NOT NULL,
    `demo_account_no` varchar(50) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`email_id`),
    UNIQUE KEY `uk_application_email` (`application_id`),
    CONSTRAINT `fk_kyc_rc_email_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 2: Company Details (ONLY fields actually collected by the form)
CREATE TABLE `kyc_regulated_company_details` (
    `details_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Basic company fields (collected in form)
    `company_registration_name` varchar(255) NOT NULL,
    `company_license_no` varchar(100) NOT NULL,
    `nature_of_business` varchar(255) NOT NULL,
    `company_legal_form` enum('PT','LLC','PLC','CORP','LTD','OTHER') NOT NULL,
    `company_legal_form_other` varchar(255) DEFAULT NULL, -- conditional field for OTHER
    
    -- Address fields (collected in form)
    `street_address` varchar(500) NOT NULL,
    `city` varchar(100) NOT NULL,
    `postal_code` varchar(20) NOT NULL,
    `country` varchar(3) NOT NULL,
    `country_other` varchar(100) DEFAULT NULL, -- conditional field for OTHER
    
    -- Establishment fields (collected in form)
    `place_of_establishment` varchar(255) NOT NULL,
    `date_of_establishment` date NOT NULL,
    `country_code` varchar(5) NOT NULL,
    `office_telephone_no` varchar(20) NOT NULL,
    
    -- Beneficial owner (collected in form)
    `beneficial_owner_name` varchar(255) NOT NULL,
    `beneficial_owner_passport_no` varchar(50) NOT NULL,
    
    -- Trading account info (collected in form)
    `source_of_funds` enum('BUSINESS_INCOME','CLIENT_FUNDS','INVESTMENT_INCOME','INHERITANCE','SAVINGS','LOAN','OTHER') NOT NULL,
    `source_of_funds_other` varchar(255) DEFAULT NULL, -- conditional field for OTHER
    `trading_account_purpose` enum('HEDGING','SPECULATION','ARBITRAGE','INVESTMENT','CLIENT_TRADING','OTHER') NOT NULL,
    `trading_account_purpose_other` varchar(255) DEFAULT NULL, -- conditional field for OTHER
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`details_id`),
    UNIQUE KEY `uk_application_details` (`application_id`),
    CONSTRAINT `fk_kyc_rc_details_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 3: Authorized Person (ONLY fields actually collected by the form)
CREATE TABLE `kyc_regulated_company_authorized_person` (
    `authorized_person_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Basic personal info (collected in form)
    `title` enum('MR','MRS','MS','DR') NOT NULL,
    `full_name` varchar(255) NOT NULL,
    `place_of_birth` varchar(255) NOT NULL,
    `date_of_birth` date NOT NULL,
    `passport_id` varchar(50) NOT NULL,
    `email` varchar(255) NOT NULL,
    `gender` enum('MALE','FEMALE') NOT NULL,
    `marital_status` enum('SINGLE','MARRIED','DIVORCED','WIDOWED') NOT NULL,
    `citizen` varchar(3) NOT NULL,
    `citizen_other` varchar(100) DEFAULT NULL, -- conditional field for OTHER
    `country_code` varchar(5) NOT NULL,
    `phone_number` varchar(20) NOT NULL,
    
    -- Address Information (collected in form)
    `street_address` varchar(500) NOT NULL,
    `city` varchar(100) NOT NULL,
    `postal_code` varchar(20) NOT NULL,
    `country` varchar(3) NOT NULL,
    `country_other` varchar(100) DEFAULT NULL, -- conditional field for OTHER
    
    -- Investment Experience (collected in form)
    `investment_experience` enum('YES','NO') NOT NULL,
    `investment_experience_details` text DEFAULT NULL, -- conditional field for YES
    
    -- Background Information (collected in form)
    `family_in_bappebti` enum('YES','NO') NOT NULL,
    `declared_bankrupt` enum('YES','NO') NOT NULL,
    
    -- Employment Data (collected in form)
    `company_name` varchar(255) NOT NULL,
    `business_nature` varchar(255) NOT NULL,
    `job_position` varchar(255) NOT NULL,
    `office_address` varchar(500) NOT NULL,
    `office_city` varchar(100) NOT NULL,
    `office_postal_code` varchar(20) NOT NULL,
    `office_country` varchar(3) NOT NULL,
    `office_country_other` varchar(100) DEFAULT NULL, -- conditional field for OTHER
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`authorized_person_id`),
    UNIQUE KEY `uk_application_auth_person` (`application_id`),
    CONSTRAINT `fk_kyc_rc_auth_person_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Note: Bank Accounts, Documents, and Agreements tables are shared across all form types
-- They use the existing kyc_bank_accounts, kyc_documents, and kyc_agreements tables

-- Create indexes for better performance
CREATE INDEX idx_kyc_rc_email_app ON kyc_regulated_company_email(application_id);
CREATE INDEX idx_kyc_rc_details_app ON kyc_regulated_company_details(application_id);
CREATE INDEX idx_kyc_rc_authorized_app ON kyc_regulated_company_authorized_person(application_id);

-- Additional indexes for commonly queried fields
CREATE INDEX idx_kyc_rc_details_license ON kyc_regulated_company_details(company_license_no);
CREATE INDEX idx_kyc_rc_auth_passport ON kyc_regulated_company_authorized_person(passport_id);
