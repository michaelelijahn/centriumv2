/**
 * Email validation helper functions
 */

// Email regex pattern used across all KYC forms
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email format is valid, false otherwise
 */
export const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }
    return EMAIL_REGEX.test(email.trim());
};

/**
 * Validates email with requirement check
 * @param {string} email - Email address to validate
 * @param {boolean} isRequired - Whether the email field is required
 * @param {string} fieldName - Name of the field for error messages (default: 'Email')
 * @returns {object} - Validation result with isValid and error properties
 */
export const validateEmail = (email, isRequired = true, fieldName = 'Email') => {
    const trimmedEmail = email?.trim() || '';
    
    // Check if email is required but empty
    if (isRequired && !trimmedEmail) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        };
    }
    
    // If email is not required and empty, it's valid
    if (!isRequired && !trimmedEmail) {
        return {
            isValid: true,
            error: null
        };
    }
    
    // Check email format
    if (!isValidEmail(trimmedEmail)) {
        return {
            isValid: false,
            error: 'Please enter a valid email address'
        };
    }
    
    return {
        isValid: true,
        error: null
    };
};

export default {
    isValidEmail,
    validateEmail
};