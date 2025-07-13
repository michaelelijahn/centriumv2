import { Form, PageBreadcrumb, TextInput } from '@/components';
import AccountWrapper from '../AccountWrapper';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useChangePassword, { changePasswordSchema } from './useChangePassword';

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

const ChangePassword = () => {
    const { t } = useTranslation();
    const { loading, changePassword } = useChangePassword();

    const handleSubmit = async (data) => {
        try {
            await changePassword({ data });
        } catch (error) {
            if (error.message !== 'Password reset instructions have been sent to your email.') {
                console.error('Error in changing password:', error);
            }
        }
    };

    return (
        <>
            <PageBreadcrumb title="Recover Password" />
            <AccountWrapper bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Change Password')}</h4>
                    <p className="text-muted mb-4">
                        {t("Enter your email address and we'll send you an email with instructions to reset your password.")}
                    </p>
                </div>

                <Form onSubmit={handleSubmit} schema={changePasswordSchema}>
                    <TextInput
                        label={t('Email Address')}
                        type="email"
                        name="email"
                        placeholder={t('Enter your Email')}
                        containerClass={'mb-3'}
                    />

                    <div className="mb-0 text-center">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {t('Change Password')}
                        </Button>
                    </div>
                </Form>
            </AccountWrapper>
        </>
    );
};

export default ChangePassword;