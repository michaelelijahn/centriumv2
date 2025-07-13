import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import { CheckInput, Form, PasswordInput, TextInput, PageBreadcrumb } from '@/components';
import AccountWrapper from '../AccountWrapper';
import useRegister from './useRegister';
import useBankRegister from './useBankRegister';
import { decryptData, deriveKey, encryptData, generateSalt } from '@/utils/encryption';
import { useIpAddress } from '@/utils/useIpAddress';

const BottomLink = () => {
    const { t } = useTranslation();
    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Already have account?')}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

export default function Register() {
    const { t } = useTranslation();
    const { loading: userLoading, register, isAuthenticated, schema, validatePassword } = useRegister();
    const { loading: bankLoading, registerBank, bankSchema } = useBankRegister();
    const { ipAddress, loading: ipLoading } = useIpAddress();
    const [currentStep, setCurrentStep] = useState(1);
    const [passwordFeedback, setPasswordFeedback] = useState('');
    
    const [personalData, setPersonalData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password1: '',
        password2: '',
        checkbox: false
    });
   
    const [bankData, setBankData] = useState({
        bank_name: '',
        bank_branch: '',
        bank_address: '',
        swift_code: '',
        account_number: '',
        account_holder_name: ''
    });

    const handlePersonalChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setPersonalData(prev => ({
            ...prev,
            [name]: newValue
        }));

        if (name === 'password1') {
            setPasswordFeedback('');
        }
    };

    const handleBankChange = (e) => {
        const { name, value } = e.target;
        setBankData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleNextStep = async (data) => {
        try {
            const { isValid, error } = validatePassword(data.password1);

            if (!isValid) {
                setPasswordFeedback(error);
                throw new Error(error);
            }

            setPasswordFeedback('');
            setPersonalData(data);
            setCurrentStep(2);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleBankSubmit = async (data) => {
        try {
            const salt = generateSalt();

            const userResult = await register({
                data: {
                    first_name: personalData.first_name,
                    last_name: personalData.last_name,
                    email: personalData.email,
                    phone: personalData.phone,
                    password: personalData.password1,
                    salt,
                    ip_address: ipAddress,
                    device_info: navigator.userAgent,
                }
            });

            if (userResult?.success && userResult?.data?.id) {
                const encryptionKey = await deriveKey(salt, userResult.data.id);
                const encryptedAccountNumber = await encryptData(data.account_number, encryptionKey);

                const bankResult = await registerBank({
                    data: {
                        user_id: userResult.data.id,
                        bank_name: data.bank_name,
                        bank_branch: data.bank_branch,
                        bank_address: data.bank_address,
                        swift_code: data.swift_code,
                        account_number: encryptedAccountNumber,
                        account_holder_name: data.account_holder_name
                    }
                });

                if (bankResult?.success) {
                    console.log("Registration complete!");
                }
            }
        } catch (error) {
            console.error('Error in registration:', error);
        }
    };

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
                <PageBreadcrumb title="Register" />
                <AccountWrapper bottomLinks={<BottomLink />}>
                    <div className="text-center w-75 m-auto">
                        <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Free Sign Up')}</h4>
                        <p className="text-muted mb-4">
                            {t("Don't have an account? Create your account, it takes less than a minute")}
                        </p>
                    </div>

                    <Form onSubmit={handleNextStep} schema={schema}>
                        <TextInput
                            label={t('First name')}
                            type="text"
                            name="first_name"
                            placeholder={t('Enter your first name')}
                            containerClass="mb-3"
                            value={personalData.first_name}
                            onChange={handlePersonalChange}
                        />
                        <TextInput
                            label={t('Last name')}
                            type="text"
                            name="last_name"
                            placeholder={t('Enter your last name')}
                            containerClass="mb-3"
                            value={personalData.last_name}
                            onChange={handlePersonalChange}
                        />
                        <TextInput
                            label={t('Email Address')}
                            type="email"
                            name="email"
                            placeholder={t('Enter your email')}
                            containerClass="mb-3"
                            value={personalData.email}
                            onChange={handlePersonalChange}
                        />
                        <TextInput
                            label={t('Phone')}
                            type="text"
                            name="phone"
                            placeholder={t('Enter your phone number')}
                            containerClass="mb-3"
                            value={personalData.phone}
                            onChange={handlePersonalChange}
                        />
                        
                        <PasswordInput
                            label={t('Password')}
                            name="password1"
                            placeholder={t('Enter your password')}
                            containerClass="mb-3"
                            value={personalData.password1}
                            onChange={handlePersonalChange}
                        />
                        {passwordFeedback && (
                            <div className="text-danger mb-2">{passwordFeedback}</div>
                        )}
                        <PasswordInput
                            label={t('Confirm Password')}
                            name="password2"
                            placeholder={t('Confirm password')}
                            containerClass="mb-3"
                            value={personalData.password2}
                            onChange={handlePersonalChange}
                        />

                        <CheckInput
                            id="terms"
                            name="checkbox"
                            type="checkbox"
                            containerClass="mb-2"
                            label={
                                <label htmlFor="terms" className="cursor-pointer">
                                    {t("I accept ")}
                                    <span className="text-muted">
                                        {t("Terms and Conditions")}
                                    </span>
                                </label>
                            }
                            defaultChecked={personalData.checkbox}
                            onChange={handlePersonalChange}
                        />

                        <div className="mb-3 text-center">
                            <Button variant="primary" type="submit" disabled={userLoading}>
                                {t('Next')}
                            </Button>
                        </div>
                    </Form>
                </AccountWrapper>
            </div>

            <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
                <PageBreadcrumb title="Bank Details" />
                <AccountWrapper>
                    <div className="text-center w-75 m-auto">
                        <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Bank Account Details')}</h4>
                        <p className="text-muted mb-4">
                            {t('Please enter your bank account information')}
                        </p>
                    </div>

                    <Form onSubmit={handleBankSubmit} schema={bankSchema}>
                        <TextInput
                            label={t('Bank Name')}
                            type="text"
                            name="bank_name"
                            placeholder={t('Enter bank name')}
                            containerClass="mb-3"
                            value={bankData.bank_name}
                            onChange={handleBankChange}
                        />
                        <TextInput
                            label={t('Branch Name')}
                            type="text"
                            name="bank_branch"
                            placeholder={t('Enter branch name')}
                            containerClass="mb-3"
                            value={bankData.bank_branch}
                            onChange={handleBankChange}
                        />
                        <TextInput
                            label={t('Branch Address')}
                            type="text"
                            name="bank_address"
                            placeholder={t('Enter bank branch address')}
                            containerClass="mb-3"
                            value={bankData.bank_address}
                            onChange={handleBankChange}
                        />
                        <TextInput
                            label={t('Account Number')}
                            type="text"
                            name="account_number"
                            placeholder={t('Enter account number')}
                            containerClass="mb-3"
                            value={bankData.account_number}
                            onChange={handleBankChange}
                        />
                        <TextInput
                            label={t('Account Holder Name')}
                            type="text"
                            name="account_holder_name"
                            placeholder={t('Enter account holder name')}
                            containerClass="mb-3"
                            value={bankData.account_holder_name}
                            onChange={handleBankChange}
                        />
                        <TextInput
                            label={t('SWIFT Code (Optional)')}
                            type="text"
                            name="swift_code"
                            placeholder={t('Enter SWIFT/BIC code')}
                            containerClass="mb-3"
                            value={bankData.swift_code}
                            onChange={handleBankChange}
                        />

                        <div className="mb-3 text-center">
                            <Button 
                                variant="secondary" 
                                onClick={() => setCurrentStep(1)}
                                className="me-2"
                            >
                                {t('Back')}
                            </Button>
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={bankLoading}
                            >
                                {t('Complete Registration')}
                            </Button>
                        </div>
                    </Form>
                </AccountWrapper>
            </div>
        </>
    );
}