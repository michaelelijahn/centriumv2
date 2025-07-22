import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PageBreadcrumb } from '@/components';

const LiveAccountRequest = () => {
    const [recentSearch, setRecentSearch] = useState('');

    const AccountTypeCard = ({ icon, title, description, onClick }) => (
        <Card className="border-0 shadow-sm h-100 hover-shadow-lg transition-all">
            <Card.Body className="text-center p-3">
                <div className="mb-2">
                    <div className="bg-primary-subtle rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                        <i className={`${icon} text-primary`} style={{ fontSize: '1.25rem' }}></i>
                    </div>
                </div>
                <h6 className="fw-bold mb-2 small">{title}</h6>
                {description && (
                    <p className="text-muted mb-2" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>{description}</p>
                )}
                <Button 
                    variant="primary" 
                    size="sm"
                    className="px-3"
                    onClick={onClick}
                >
                    Register
                </Button>
            </Card.Body>
        </Card>
    );

    const accountTypes = [
        {
            icon: 'mdi mdi-office-building',
            title: 'FOREIGN COMPANY',
            description: 'For international businesses and corporations operating outside Indonesia with proper business registration'
        },
        {
            icon: 'mdi mdi-account-tie',
            title: 'FOREIGN PERSON',
            description: 'For individual international traders and investors who are non-Indonesian residents'
        },
        {
            icon: 'mdi mdi-office-building-outline',
            title: 'INDONESIAN COMPANY',
            description: 'For local Indonesian businesses, PT, CV, and other registered Indonesian business entities'
        },
        {
            icon: 'mdi mdi-account',
            title: 'INDONESIAN PERSON',
            description: 'For individual Indonesian citizens and residents with valid Indonesian identification'
        },
        {
            icon: 'mdi mdi-bank',
            title: 'REGULATED COMPANY',
            description: 'For licensed financial institutions, banks, and regulated investment companies'
        }
    ];

    const handleAccountTypeClick = (accountType) => {
        console.log(`Selected account type: ${accountType.title}`);
        // Here you would navigate to the specific registration form
        // For now, we'll show an alert
        alert(`You selected: ${accountType.title}\n\nThis would normally navigate to a registration form for ${accountType.title.toLowerCase()}.`);
    };

    return (
        <>
            {/* Back Button */}
            <div className="mt-4">
                <Link to="/dashboard/ecommerce" className="btn btn-link text-muted p-0 text-decoration-none">
                    <i className="mdi mdi-arrow-left me-1"></i>
                    Back
                </Link>
            </div>

            {/* Simple Header */}
            <div className="mt-3">
                <p className="text-muted mb-0 small"><strong>Register your KYC, our registration process will take no more than 10 minutes</strong></p>
            </div>

            {/* Page Title and Breadcrumb */}
            <div className="row">
                <div className="col-sm-12">
                    <div className="page-title-box d-flex justify-content-between align-items-center">
                        <h4 className="page-title mb-0">Live Account Request</h4>
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                <li className="breadcrumb-item">Trading</li>
                                <li className="breadcrumb-item active">Live Account Request</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

            <Row>
                {/* Account Categories Section */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom-0 p-3 pb-1">
                            <div className="text-center">
                                <h5 className="fw-bold text-primary mb-1">Select Account Category</h5>
                                <p className="text-muted small mb-0">Choose the account type that best describes you or your organization</p>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-3 pt-2">
                            <Row className="g-2">
                                {accountTypes.map((accountType, index) => (
                                    <Col md={6} key={index}>
                                        <AccountTypeCard
                                            icon={accountType.icon}
                                            title={accountType.title}
                                            description={accountType.description}
                                            onClick={() => handleAccountTypeClick(accountType)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Recent Registration Section */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-white border-bottom-0 p-3 pb-1">
                            <div className="text-center">
                                <h6 className="fw-bold text-primary mb-1">Recent Applications</h6>
                                <p className="text-muted small mb-0">Track your registration progress</p>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-3 pt-2">
                            {/* Search Box */}
                            <div className="mb-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Search applications..."
                                    value={recentSearch}
                                    onChange={(e) => setRecentSearch(e.target.value)}
                                    size="sm"
                                />
                            </div>

                            {/* Empty State */}
                            <div className="text-center py-2" style={{ minHeight: '150px' }}>
                                <div className="mb-2">
                                    <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                        <i className="mdi mdi-file-document-outline text-muted" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                </div>
                                <h6 className="text-muted mb-1 small">No Applications Yet</h6>
                                <p className="text-muted small mb-2">Your registration requests will appear here</p>
                                <Button variant="outline-primary" size="sm">
                                    <i className="mdi mdi-refresh me-1"></i>
                                    Refresh
                                </Button>
                            </div>

                            {/* Pagination */}
                            <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                                <Button variant="outline-secondary" size="sm" disabled>
                                    <i className="mdi mdi-chevron-left me-1"></i>
                                    Previous
                                </Button>
                                
                                <span className="text-muted small">0 of 0</span>
                                
                                <Button variant="outline-secondary" size="sm" disabled>
                                    Next
                                    <i className="mdi mdi-chevron-right ms-1"></i>
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default LiveAccountRequest; 