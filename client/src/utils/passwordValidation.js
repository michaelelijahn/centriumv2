import * as yup from 'yup';
import { passwordStrength } from 'check-password-strength';

const createPasswordSchema = (t) => {
  return yup.object().shape({
    first_name: yup.string().required(t('Please fill in your first name')),
    last_name: yup.string().required(t('Please fill in your last name')),
    email: yup.string().email('Please enter valid email').required(t('Please enter email')),
    phone: yup.string()
      .required('Phone number is required')
      .transform((value) => value.replace(/[^\d]/g, ''))
      .matches(/^[0-9]+$/, 'Phone number must contain only digits')
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number cannot be more than 15 digits'),
    password1: yup
      .string()
      .required(t('Please enter password')),
    password2: yup.string()
      .oneOf([yup.ref('password1')], 'Passwords must match')
      .required('Please confirm your password'),
    checkbox: yup
      .boolean()
      .oneOf([true], 'You must accept the Terms and Conditions')
      .required('You must accept the Terms and Conditions'),
  });
};

const formatPasswordError = (missing) => {
  if (!missing.length) return 'Password is not strong enough';
  
  return `Password must contain ${missing.map((req, index) => {
    if (index === 0) return req;
    if (index === missing.length - 1) return ` and ${req}`;
    return `, ${req}`;
  }).join('')}`;
};

export const usePasswordValidation = () => {
  const validatePassword = (password) => {
    const strength = passwordStrength(password);
    const requirements = ['lowercase', 'uppercase', 'symbol', 'number'];
    const missing = requirements.filter(req => !strength.contains.includes(req));
    
    if (strength.value !== 'Strong') {
      return {
        isValid: false,
        error: formatPasswordError(missing)
      };
    }
    
    return {
      isValid: true,
      error: null
    };
  };

  return {
    validatePassword
  };
};

export default createPasswordSchema;