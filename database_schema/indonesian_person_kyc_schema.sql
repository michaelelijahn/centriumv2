-- Indonesian Person KYC Database Schema
-- This schema follows the same structure as foreign_company, foreign_person, and indonesian_company schemas
-- Uses the existing kyc_applications, kyc_bank_accounts, kyc_documents, and kyc_agreements tables
-- All field names and enum values are in English for consistency with database storage requirements

-- ============================================================================
-- KYC INDONESIAN PERSON IMPLEMENTATION
-- ============================================================================

-- Step 1: Email Registration
CREATE TABLE `kyc_indonesian_person_email` (
    `email_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `email` varchar(255) NOT NULL,
    `demo_account_no` enum('DEMO001','DEMO002','DEMO003','DEMO004','DEMO005') NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`email_id`),
    UNIQUE KEY `uk_application_email` (`application_id`),
    CONSTRAINT `fk_kyc_ip_email_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 2: Personal Data (Data Pribadi)
CREATE TABLE `kyc_indonesian_person_details` (
    `details_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Basic Personal Information
    `full_name` varchar(255) NOT NULL,
    `place_of_birth` varchar(255) NOT NULL,
    `date_of_birth` date NOT NULL,
    `id_card_no` varchar(255) NOT NULL,
    `npwp_no` varchar(255) NOT NULL,
    `gender` enum('LAKI_LAKI','PEREMPUAN') NOT NULL,
    `mother_name` varchar(255) NOT NULL,
    `marital_status` enum('BELUM_KAWIN','KAWIN','CERAI','JANDA_DUDA') NOT NULL,
    `spouse_name` varchar(255) DEFAULT NULL, -- conditional field when married
    
    -- Address Information
    `street_address` varchar(255) NOT NULL,
    `city` varchar(255) NOT NULL,
    `postal_code` varchar(20) NOT NULL,
    
    -- Contact Information
    `home_phone_no` varchar(50) DEFAULT NULL,
    `mobile_phone_no` varchar(50) NOT NULL,
    `home_fax_no` varchar(50) DEFAULT NULL,
    
    -- Home and Account Information
    `home_ownership_status` enum('PRIBADI','KELUARGA','SEWA_KONTRAK','LAINNYA') NOT NULL,
    `home_ownership_status_other` varchar(255) DEFAULT NULL, -- conditional field
    `account_opening_purpose` enum('LINDUNG_NILAI','KEUNTUNGAN','SPEKULASI','LAINNYA') NOT NULL,
    `account_opening_purpose_other` varchar(255) DEFAULT NULL, -- conditional field
    
    -- Investment Experience
    `investment_experience` enum('YA','TIDAK') NOT NULL,
    `investment_experience_details` text DEFAULT NULL, -- conditional field
    `family_in_bappebti` enum('YA','TIDAK') NOT NULL,
    `declared_bankrupt` enum('YA','TIDAK') NOT NULL,
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`details_id`),
    UNIQUE KEY `uk_application_person_details` (`application_id`),
    CONSTRAINT `fk_kyc_ip_details_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 3: Emergency Contact Information
CREATE TABLE `kyc_indonesian_person_emergency_contact` (
    `emergency_contact_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Emergency Contact Basic Info
    `emergency_contact_name` varchar(255) NOT NULL,
    `emergency_contact_phone` varchar(50) NOT NULL,
    
    -- Emergency Contact Address
    `emergency_contact_street_address` varchar(255) NOT NULL,
    `emergency_contact_city` varchar(255) NOT NULL,
    `emergency_contact_postal_code` varchar(20) NOT NULL,
    
    -- Relationship
    `emergency_contact_relationship` enum('PASANGAN','KELUARGA','ANAK','LAINNYA') NOT NULL,
    `emergency_contact_relationship_other` varchar(255) DEFAULT NULL, -- conditional field
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`emergency_contact_id`),
    UNIQUE KEY `uk_application_emergency_contact` (`application_id`),
    CONSTRAINT `fk_kyc_ip_emergency_contact_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 4: Employment Data (Data Pekerjaan)
CREATE TABLE `kyc_indonesian_person_employment` (
    `employment_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Employment Type
    `employment_type` enum('SWASTA','WIRASWASTA','IBU_RT','PROFESIONAL','ASN','MAHASISWA','LAINNYA') NOT NULL,
    `employment_type_other` varchar(255) DEFAULT NULL, -- conditional field
    
    -- Employment Information (conditional based on employment type)
    `company_name` varchar(255) DEFAULT NULL,
    `business_field` varchar(255) DEFAULT NULL,
    `position` varchar(255) DEFAULT NULL,
    `length_of_work` varchar(255) DEFAULT NULL,
    `previous_company` varchar(255) DEFAULT NULL,
    
    -- Office Address (conditional)
    `office_street_address` varchar(255) DEFAULT NULL,
    `office_city` varchar(255) DEFAULT NULL,
    `office_postal_code` varchar(20) DEFAULT NULL,
    
    -- Office Contact (conditional)
    `office_phone_country_code` enum('+62','+65','+60','+1','+44','+61','+91') DEFAULT NULL,
    `office_phone_no` varchar(50) DEFAULT NULL,
    `office_fax_no` varchar(50) DEFAULT NULL,
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`employment_id`),
    UNIQUE KEY `uk_application_employment` (`application_id`),
    CONSTRAINT `fk_kyc_ip_employment_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Step 5: Assets Information (Daftar Kekayaan)
CREATE TABLE `kyc_indonesian_person_assets` (
    `assets_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    
    -- Required annual income
    `annual_income` enum('100_250_JUTA','250_500_JUTA','ABOVE_500_JUTA') NOT NULL,
    
    -- Optional asset information
    `home_location` varchar(255) DEFAULT NULL,
    `njop_value` varchar(255) DEFAULT NULL,
    `bank_deposit` varchar(255) DEFAULT NULL,
    `total_amount` varchar(255) DEFAULT NULL,
    `other_assets` text DEFAULT NULL,
    
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`assets_id`),
    UNIQUE KEY `uk_application_assets` (`application_id`),
    CONSTRAINT `fk_kyc_ip_assets_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Note: Bank Accounts, Documents, and Agreements tables are shared across all form types
-- They use the existing kyc_bank_accounts, kyc_documents, and kyc_agreements tables

-- Bank Accounts table modification to include Indonesian Person specific fields
-- Note: We'll extend the existing kyc_bank_accounts table to support Indonesian Person fields
-- These fields were already added for Indonesian Company, so they can be reused
-- Additional columns if needed for Indonesian Person:
-- - account_holder_name (already exists)
-- - bank_telephone_country_code (already exists) 
-- - bank_telephone_no (already exists)
-- - bank_account_type (already exists)
-- - bank_account_type_other (already exists)

-- Create indexes for better performance
CREATE INDEX idx_kyc_ip_email_app ON kyc_indonesian_person_email(application_id);
CREATE INDEX idx_kyc_ip_details_app ON kyc_indonesian_person_details(application_id);
CREATE INDEX idx_kyc_ip_emergency_app ON kyc_indonesian_person_emergency_contact(application_id);
CREATE INDEX idx_kyc_ip_employment_app ON kyc_indonesian_person_employment(application_id);
CREATE INDEX idx_kyc_ip_assets_app ON kyc_indonesian_person_assets(application_id);

-- Additional indexes for commonly queried fields
CREATE INDEX idx_kyc_ip_details_ktp ON kyc_indonesian_person_details(id_card_no);
CREATE INDEX idx_kyc_ip_details_npwp ON kyc_indonesian_person_details(npwp_no);
CREATE INDEX idx_kyc_ip_details_name ON kyc_indonesian_person_details(full_name);

-- Update the main kyc_applications table to ensure indonesian_person is included in form_type enum
-- (This should already be included based on the foreign_company_kyc_schema.sql)
-- ALTER TABLE `kyc_applications` MODIFY `form_type` enum('foreign_company','foreign_person','indonesian_company','indonesian_person','regulated_company') NOT NULL DEFAULT 'foreign_company';

