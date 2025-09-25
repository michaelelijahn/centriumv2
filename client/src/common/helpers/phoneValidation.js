/**
 * Phone number validation helper functions
 */

/**
 * Extracts the phone number part after the country code
 * @param {string} phoneNumber - Full phone number including country code
 * @param {string} countryCode - Country code (e.g., '+1', '+62')
 * @returns {string} - Phone number without country code, trimmed
 */
export const extractPhoneNumber = (phoneNumber, countryCode) => {
    if (!phoneNumber || !countryCode) {
        return '';
    }
    return phoneNumber.substring(countryCode.length).trim();
};

/**
 * Validates phone number with country code following ForeignPersonForm pattern
 * @param {string} phoneNumber - Full phone number including country code
 * @param {string} countryCode - Country code (e.g., '+1', '+62')
 * @param {boolean} isRequired - Whether the phone field is required (default: false)
 * @param {string} fieldName - Name of the field for error messages (default: 'Phone Number')
 * @returns {object} - Validation result with isValid and error properties
 */
export const validatePhoneWithCountryCode = (phoneNumber, countryCode, isRequired = false, fieldName = 'Phone Number') => {
    if (isRequired && (!phoneNumber?.trim() || !countryCode?.trim())) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        };
    }
    
    if (!phoneNumber && !countryCode) {
        return {
            isValid: true,
            error: null
        };
    }
    
    if (!phoneNumber && countryCode) {
        return {
            isValid: false,
            error: `Please enter the ${fieldName.toLowerCase()} after the country code`
        };
    }
    
    if (phoneNumber && !countryCode) {
        return {
            isValid: false,
            error: 'Country code is required'
        };
    }
    
    const numberPart = extractPhoneNumber(phoneNumber, countryCode);
    
    if (!numberPart || numberPart.length === 0) {
        return {
            isValid: false,
            error: `Please enter the ${fieldName.toLowerCase()} after the country code`
        };
    }
    
    return {
        isValid: true,
        error: null
    };
};

/**
 * Validates multiple phone fields at once
 * @param {Array} phoneFields - Array of phone field objects with { phoneNumber, countryCode, isRequired, fieldName }
 * @returns {object} - Validation result with isValid and errors array
 */
export const validateMultiplePhones = (phoneFields) => {
    const errors = [];
    
    phoneFields.forEach(({ phoneNumber, countryCode, isRequired = false, fieldName = 'Phone Number' }) => {
        const validation = validatePhoneWithCountryCode(phoneNumber, countryCode, isRequired, fieldName);
        if (!validation.isValid) {
            errors.push(validation.error);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Formats phone input by ensuring country code prefix and preventing deletion
 * @param {string} value - Input value
 * @param {string} countryCode - Country code to prefix
 * @returns {string} - Formatted phone number with protected country code
 */
export const formatPhoneInput = (value, countryCode) => {
    if (!countryCode) {
        return value || '';
    }
    
    if (!value) {
        return countryCode + ' ';
    }
    
    // If user tries to delete the country code, restore it
    if (!value.startsWith(countryCode)) {
        // If the value is shorter than the country code, user is trying to delete it
        if (value.length < countryCode.length) {
            return countryCode + ' ';
        }
        
        // Remove any existing country code prefix and clean the number
        const cleanValue = value.replace(/^\+\d+\s?/, '').replace(/[^\d\s-]/g, '');
        return countryCode + (cleanValue ? ' ' + cleanValue : ' ');
    }
    
    // Value starts with country code, extract and clean the number part
    const numberPart = value.substring(countryCode.length).trim();
    const cleanNumber = numberPart.replace(/[^\d\s-]/g, '');
    return countryCode + (cleanNumber ? ' ' + cleanNumber : ' ');
};

export default {
    extractPhoneNumber,
    validatePhoneWithCountryCode,
    validateMultiplePhones,
    formatPhoneInput
};
