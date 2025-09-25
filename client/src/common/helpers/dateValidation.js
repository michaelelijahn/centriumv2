/**
 * Date of Birth validation helper functions
 */

/**
 * Calculates accurate age from date of birth
 * @param {string|Date} dateOfBirth - Date of birth string or Date object
 * @returns {number|null} - Age in years, or null if invalid date
 */
export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) {
        return null;
    }
    
    try {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        
        // Check if the date is valid
        if (isNaN(birthDate.getTime())) {
            return null;
        }
        
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        // Account for month and day differences to get accurate age
        const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ? age - 1
            : age;
            
        return actualAge;
    } catch (error) {
        return null;
    }
};

/**
 * Validates date of birth with minimum age requirement
 * @param {string|Date} dateOfBirth - Date of birth to validate
 * @param {boolean} isRequired - Whether the date of birth field is required (default: true)
 * @param {number} minimumAge - Minimum required age (default: 21)
 * @param {string} fieldName - Name of the field for error messages (default: 'Date of Birth')
 * @returns {object} - Validation result with isValid, error, and age properties
 */
export const validateDateOfBirth = (dateOfBirth, isRequired = true, minimumAge = 21, fieldName = 'Date of Birth') => {
    const trimmedDate = typeof dateOfBirth === 'string' ? dateOfBirth.trim() : dateOfBirth;
    
    // Check if date of birth is required but empty
    if (isRequired && !trimmedDate) {
        return {
            isValid: false,
            error: `${fieldName} is required`,
            age: null
        };
    }
    
    // If date of birth is not required and empty, it's valid
    if (!isRequired && !trimmedDate) {
        return {
            isValid: true,
            error: null,
            age: null
        };
    }
    
    // Calculate age
    const age = calculateAge(trimmedDate);
    
    // Check if date is valid
    if (age === null) {
        return {
            isValid: false,
            error: 'Please enter a valid date of birth',
            age: null
        };
    }
    
    // Check minimum age requirement
    if (age < minimumAge) {
        return {
            isValid: false,
            error: `Minimum ${minimumAge} years old is required`,
            age: age
        };
    }
    
    return {
        isValid: true,
        error: null,
        age: age
    };
};

export default {
    calculateAge,
    validateDateOfBirth
};