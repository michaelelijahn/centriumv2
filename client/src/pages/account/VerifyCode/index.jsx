import { Form, PageBreadcrumb, TextInput } from '@/components';
import AccountWrapper from '../AccountWrapper';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useNotificationContext } from '@/common/context';
import { authApi } from '@/common/api';

const verifyCodeSchema = yup.object({
    code: yup.string()
        .matches(/^\d{6}$/, 'Must be exactly 6 digits')
        .required('Please enter verification code'),
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

const VerifyCode = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        if (!token) {
            showNotification({ 
                message: 'Invalid reset request. Please try again.', 
                type: 'error' 
            });
            navigate('/account/change-password');
        }
    }, [token, navigate, showNotification]);

    const handleSubmit = async (data) => {
        if (!token) {
            showNotification({ 
                message: 'Invalid reset request. Please try again.', 
                type: 'error' 
            });
            return;
        }

        setLoading(true);
        try {
            const res = await authApi.verifyCode({
                token,
                code: data.code
            });

            if (res.status === 'success') {
                showNotification({ 
                    message: 'Code verified successfully', 
                    type: 'success' 
                });
            
                navigate(`/account/set-new-password?token=${token}&code=${data.code}`);
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
            <PageBreadcrumb title="Verify Code" />
            <AccountWrapper bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">
                        {t('Enter Verification Code')}
                    </h4>
                    <p className="text-muted mb-4">
                        {t('Please enter the 6-digit verification code sent to your email.')}
                    </p>
                </div>

                <Form onSubmit={handleSubmit} schema={verifyCodeSchema}>
                    <TextInput
                        label={t('Verification Code')}
                        type="text"
                        name="code"
                        placeholder={t('Enter 6-digit code')}
                        containerClass={'mb-3'}
                    />

                    <div className="mb-0 text-center">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {t('Verify Code')}
                        </Button>
                    </div>
                </Form>
            </AccountWrapper>
        </>
    );
};

export default VerifyCode;