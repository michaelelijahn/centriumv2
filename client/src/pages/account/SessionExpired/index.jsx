import { PageBreadcrumb } from '@/components';
import AccountWrapper from '@/pages/account/AccountWrapper';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t('Click here to ')}
                    <Link to={'/account/login'} className="text-primary fw-medium">
                        <b>{t('Log In')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const SessionExpired = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/account/login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <>
            <PageBreadcrumb title="Session Expired" />
            <AccountWrapper bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">
                        {t('Your Session Has Expired')}
                    </h4>
                    <p className="text-muted mb-4">
                        {t('Please log in again to continue.')}
                    </p>

                    <div className="logout-icon m-auto">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 160 160"
                            className="w-50 h-50"
                        >
                            <circle
                                cx="80"
                                cy="80"
                                r="62"
                                fill="none"
                                stroke="#dc3545"
                                strokeWidth="4"
                                className="path"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r="74"
                                fill="none"
                                stroke="#dc3545"
                                strokeWidth="4"
                                strokeDasharray="12,12"
                                className="spin"
                            />
                            <g transform="rotate(45 80 80)">
                                <rect
                                    x="75"
                                    y="40"
                                    width="10"
                                    height="80"
                                    fill="#dc3545"
                                    className="path"
                                />
                                <rect
                                    x="40"
                                    y="75"
                                    width="80"
                                    height="10"
                                    fill="#dc3545"
                                    className="path"
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </AccountWrapper>
        </>
    );
};

export default SessionExpired;