import { Form, PageBreadcrumb, TextInput } from '@/components';
import AccountWrapper from '../AccountWrapper';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import * as yup from 'yup';
import { useAuthContext, useNotificationContext } from '@/common/context';
import { authApi } from '@/common/api';

const setPasswordSchema = yup.object({
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Please enter new password'),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Please confirm your password'),
});

const BottomLink = () => {
    const { t } = useTranslation();
    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Back to')}
                    <Link to={'/account/login'} className="text-muted ms-1">
                        <b>{t('Homepage')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const SetNewPassword = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const code = searchParams.get('code');
    const { showNotification } = useNotificationContext();
	const { removeSession } = useAuthContext();


    const handleSubmit = async (data) => {
        console.log(token);
        console.log(code);
        if (!token || !code) {
            showNotification({ 
                message: 'Invalid request. Please try again.', 
                type: 'error' 
            });
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.resetPassword({
                token,
                code,
                password: data.password
            });

            if (res.status === 'success') {
                removeSession();
                showNotification({ 
                    message: 'Password has been reset successfully', 
                    type: 'success' 
                });

                navigate('/account/login');
            }
        } catch (error) {
            showNotification({ 
                message: error.toString(), 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <PageBreadcrumb title="Set New Password" />
            <AccountWrapper bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">
                        {t('Set New Password')}
                    </h4>
                    <p className="text-muted mb-4">
                        {t('Please enter your new password below.')}
                    </p>
                </div>

                <Form onSubmit={handleSubmit} schema={setPasswordSchema}>
                    <TextInput
                        label={t('New Password')}
                        type="password"
                        name="password"
                        placeholder={t('Enter new password')}
                        containerClass={'mb-3'}
                    />

                    <TextInput
                        label={t('Confirm Password')}
                        type="password"
                        name="confirmPassword"
                        placeholder={t('Confirm new password')}
                        containerClass={'mb-3'}
                    />

                    <div className="mb-0 text-center">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {t('Set New Password')}
                        </Button>
                    </div>
                </Form>
            </AccountWrapper>
        </>
    );
};

export default SetNewPassword;