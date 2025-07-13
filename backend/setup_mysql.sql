-- Create the database
CREATE DATABASE IF NOT EXISTS cenh3619_brokerfirm_2025;

-- Create the user
CREATE USER IF NOT EXISTS 'cenh3619_brokerfirm_admin'@'localhost' IDENTIFIED BY 'Centrium.2025';

-- Grant all privileges
GRANT ALL PRIVILEGES ON cenh3619_brokerfirm_2025.* TO 'cenh3619_brokerfirm_admin'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show the result
SELECT User, Host FROM mysql.user WHERE User = 'cenh3619_brokerfirm_admin';
