import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PageBreadcrumb } from '@/components';

const UnauthorizedAccess = () => {
    return (
        <>
            <PageBreadcrumb title="Unauthorized Access" />
            
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card>
                            <Card.Body className="p-4 text-center">
                                <div className="text-danger mb-4">
                                    <i className="mdi mdi-shield-alert-outline" style={{ fontSize: '5rem' }}></i>
                                </div>
                                
                                <h2>Access Denied</h2>
                                <p className="text-muted mb-4">
                                    You don't have permission to access this page.
                                    This area is restricted to administrators only.
                                </p>
                                
                                <Link to="/" className="btn btn-primary me-2">
                                    Go to Homepage
                                </Link>
                                <Link to="/account/login" className="btn btn-outline-secondary">
                                    Login with Another Account
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default UnauthorizedAccess;