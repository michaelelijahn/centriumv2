-- Indonesian Company KYC Database Schema
-- This schema follows the same structure as foreign_company and foreign_person schemas
-- Uses the existing kyc_applications, kyc_bank_accounts, kyc_documents, and kyc_agreements tables

-- Email Registration Step
CREATE TABLE `kyc_indonesian_company_email` (
    `email_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `email` varchar(255) NOT NULL,
    `demo_account_no` enum('DEMO001','DEMO002','DEMO003','DEMO004','DEMO005') NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`email_id`),
    UNIQUE KEY `uk_application_email` (`application_id`),
    CONSTRAINT `fk_kyc_ic_email_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Company Details Step
CREATE TABLE `kyc_indonesian_company_details` (
    `details_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `company_name` varchar(255) NOT NULL,
    `business_license_no` varchar(255) NOT NULL,
    `business_entity` varchar(255) NOT NULL,
    `company_npwp` varchar(255) NOT NULL,
    `street_name` varchar(255) NOT NULL,
    `city` varchar(255) NOT NULL,
    `postal_code` varchar(20) NOT NULL,
    `place_of_establishment` varchar(255) NOT NULL,
    `establishment_date` date NOT NULL,
    `legal_form` enum('PT','CV','FIRMA','KOPERASI','YAYASAN','OTHER') NOT NULL,
    `legal_form_other` varchar(255) DEFAULT NULL,
    `office_telephone_country_code` enum('+62','+65','+60','+1','+44','+61','+91') NOT NULL,
    `office_telephone_no` varchar(50) NOT NULL,
    `beneficial_owner_name` varchar(255) NOT NULL,
    `beneficial_owner_id_no` varchar(255) NOT NULL,
    `source_of_funds` enum('BUSINESS_PROFIT','INVESTMENT','SAVINGS','LOAN','OTHER') NOT NULL,
    `source_of_funds_other` varchar(255) DEFAULT NULL,
    `account_purpose` enum('HEDGING','SPECULATION','INVESTMENT','OTHER') NOT NULL,
    `account_purpose_other` varchar(255) DEFAULT NULL,
    `authorized_person_name` varchar(255) NOT NULL,
    `authorized_debit_person` varchar(255) NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`details_id`),
    UNIQUE KEY `uk_application_details` (`application_id`),
    CONSTRAINT `fk_kyc_ic_details_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Power of Attorney Details Step
CREATE TABLE `kyc_indonesian_company_authorized_person` (
    `authorized_person_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `full_name` varchar(255) NOT NULL,
    `place_of_birth` varchar(255) NOT NULL,
    `date_of_birth` date NOT NULL,
    `id_passport_no` varchar(255) NOT NULL,
    `npwp_no` varchar(255) NOT NULL,
    `gender` enum('LAKI_LAKI','PEREMPUAN') NOT NULL,
    `mother_name` varchar(255) NOT NULL,
    `marital_status` enum('BELUM_KAWIN','KAWIN','CERAI','JANDA_DUDA') NOT NULL,
    `nationality` enum('US','UK','SG','MY','AU','CA','ID','OTHER') NOT NULL,
    `nationality_other` varchar(255) DEFAULT NULL,
    `street_address` varchar(255) NOT NULL,
    `address_city` varchar(255) NOT NULL,
    `address_postal_code` varchar(20) NOT NULL,
    `home_telephone_no` varchar(50) NOT NULL,
    `handphone_no` varchar(50) NOT NULL,
    `home_fax_no` varchar(50) DEFAULT NULL,
    `personal_email` varchar(255) NOT NULL,
    `home_ownership_status` enum('PRIBADI','KELUARGA','SEWA_KONTRAK','LAINNYA') NOT NULL,
    `home_ownership_status_other` varchar(255) DEFAULT NULL,
    `account_opening_purpose` enum('LINDUNG_NILAI','KEUNTUNGAN','SPEKULASI','LAINNYA') NOT NULL,
    `account_opening_purpose_other` varchar(255) DEFAULT NULL,
    `investment_experience` enum('YA_BIDANG','TIDAK') NOT NULL,
    `investment_experience_explanation` text DEFAULT NULL,
    `futures_trading_experience` enum('YA','TIDAK') NOT NULL,
    `family_in_bappebti` enum('YA','TIDAK') NOT NULL,
    `declared_bankrupt` enum('YA','TIDAK') NOT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`authorized_person_id`),
    UNIQUE KEY `uk_application_auth_person` (`application_id`),
    CONSTRAINT `fk_kyc_ic_auth_person_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Emergency Contact Information
CREATE TABLE `kyc_indonesian_company_emergency_contact` (
    `emergency_contact_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `emergency_contact_name` varchar(255) NOT NULL,
    `emergency_contact_handphone` varchar(50) NOT NULL,
    `emergency_contact_street_address` varchar(255) NOT NULL,
    `emergency_contact_city` varchar(255) NOT NULL,
    `emergency_contact_postal_code` varchar(20) NOT NULL,
    `emergency_contact_relationship` enum('PASANGAN','KELUARGA','ANAK','LAINNYA') NOT NULL,
    `emergency_contact_relationship_other` varchar(255) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`emergency_contact_id`),
    UNIQUE KEY `uk_application_emergency_contact` (`application_id`),
    CONSTRAINT `fk_kyc_ic_emergency_contact_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Employment Details (conditional based on job type)
CREATE TABLE `kyc_indonesian_company_employment` (
    `employment_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `job_of_power_of_attorney` enum('SWASTA','WIRASWASTA','IBU_RT','PROFESIONAL','ASN','MAHASISWA','LAINNYA') NOT NULL,
    `job_of_power_of_attorney_other` varchar(255) DEFAULT NULL,
    `employment_company_name` varchar(255) DEFAULT NULL,
    `business_field` varchar(255) DEFAULT NULL,
    `employment_position` varchar(255) DEFAULT NULL,
    `length_of_work` varchar(255) DEFAULT NULL,
    `previous_company` varchar(255) DEFAULT NULL,
    `office_street_address` varchar(255) DEFAULT NULL,
    `office_city` varchar(255) DEFAULT NULL,
    `office_postal_code` varchar(20) DEFAULT NULL,
    `office_phone_country_code` enum('+62','+65','+60','+1','+44','+61','+91') DEFAULT NULL,
    `office_phone_no` varchar(50) DEFAULT NULL,
    `office_fax_no` varchar(50) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`employment_id`),
    UNIQUE KEY `uk_application_employment` (`application_id`),
    CONSTRAINT `fk_kyc_ic_employment_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Assets Information
CREATE TABLE `kyc_indonesian_company_assets` (
    `assets_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `annual_income` enum('100_250_JUTA','250_500_JUTA','ABOVE_500_JUTA') NOT NULL,
    `house_location` varchar(255) NOT NULL,
    `njop_value` varchar(255) NOT NULL,
    `bank_deposit` varchar(255) NOT NULL,
    `total_amount` varchar(255) NOT NULL,
    `other_assets` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`assets_id`),
    UNIQUE KEY `uk_application_assets` (`application_id`),
    CONSTRAINT `fk_kyc_ic_assets_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Read Statements and Agreements (specific to Indonesian Company)
CREATE TABLE `kyc_indonesian_company_agreements` (
    `agreement_id` int(11) NOT NULL AUTO_INCREMENT,
    `application_id` int(11) NOT NULL,
    `company_profile_read` tinyint(1) NOT NULL DEFAULT 0,
    `company_profile_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `statement_read` tinyint(1) NOT NULL DEFAULT 0,
    `statement_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `trading_experience` enum('ya','tidak') DEFAULT NULL,
    `broker_company` varchar(255) DEFAULT NULL,
    `demo_account_number` varchar(255) DEFAULT NULL,
    `experience_statement_read` tinyint(1) NOT NULL DEFAULT 0,
    `experience_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `application_statement_read` tinyint(1) NOT NULL DEFAULT 0,
    `application_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `risk_disclosure_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_1` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_2` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_3` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_4` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_5` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_6` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_7` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_8` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_9` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_10` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_11` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_12` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_13` tinyint(1) NOT NULL DEFAULT 0,
    `risk_statement_14` tinyint(1) NOT NULL DEFAULT 0,
    `mandate_statement_read` tinyint(1) NOT NULL DEFAULT 0,
    `bakti_arbitration` tinyint(1) NOT NULL DEFAULT 0,
    `mandate_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `trading_rules_read` tinyint(1) NOT NULL DEFAULT 0,
    `trading_rules_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `personal_access_password_read` tinyint(1) NOT NULL DEFAULT 0,
    `personal_access_password_understanding` tinyint(1) NOT NULL DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
    PRIMARY KEY (`agreement_id`),
    UNIQUE KEY `uk_application_agreements` (`application_id`),
    CONSTRAINT `fk_kyc_ic_agreements_app` FOREIGN KEY (`application_id`) REFERENCES `kyc_applications` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Bank Accounts table modification to include Indonesian Company specific fields
-- Note: We'll reuse the existing kyc_bank_accounts table but need to add the specific fields for Indonesian Company
ALTER TABLE `kyc_bank_accounts` 
ADD COLUMN `account_holder_name` varchar(255) NULL AFTER `account_no`,
ADD COLUMN `bank_telephone_country_code` enum('+62','+65','+60','+1','+44','+61','+91') NULL AFTER `account_holder_name`,
ADD COLUMN `bank_telephone_no` varchar(50) NULL AFTER `bank_telephone_country_code`,
ADD COLUMN `bank_account_type` enum('GIRO','TABUNGAN','LAINNYA') NULL AFTER `bank_telephone_no`,
ADD COLUMN `bank_account_type_other` varchar(255) NULL AFTER `bank_account_type`;

-- Create indexes for better performance
CREATE INDEX idx_kyc_ic_email_app ON kyc_indonesian_company_email(application_id);
CREATE INDEX idx_kyc_ic_details_app ON kyc_indonesian_company_details(application_id);
CREATE INDEX idx_kyc_ic_authorized_app ON kyc_indonesian_company_authorized_person(application_id);
CREATE INDEX idx_kyc_ic_emergency_app ON kyc_indonesian_company_emergency_contact(application_id);
CREATE INDEX idx_kyc_ic_employment_app ON kyc_indonesian_company_employment(application_id);
CREATE INDEX idx_kyc_ic_assets_app ON kyc_indonesian_company_assets(application_id);
CREATE INDEX idx_kyc_ic_agreements_app ON kyc_indonesian_company_agreements(application_id);

-- Additional indexes for commonly queried fields
CREATE INDEX idx_kyc_ic_details_npwp ON kyc_indonesian_company_details(company_npwp);
CREATE INDEX idx_kyc_ic_authorized_id ON kyc_indonesian_company_authorized_person(id_passport_no);
CREATE INDEX idx_kyc_ic_authorized_npwp ON kyc_indonesian_company_authorized_person(npwp_no);
