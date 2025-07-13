import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { authApi } from '@/common';
import { useAuthContext } from '@/common';
import { PageBreadcrumb } from '@/components';

const TradeDetail = () => {
    const { tradeId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [trade, setTrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.role !== 'admin') {
            setError('You do not have permission to view this page.');
            setLoading(false);
            return;
        }
        const fetchTrade = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await authApi.getTradeById(tradeId);
                if (response?.data) {
                    setTrade(response.data);
                } else {
                    setError('Trade not found.');
                }
            } catch (err) {
                setError('Error fetching trade details.');
            } finally {
                setLoading(false);
            }
        };
        fetchTrade();
    }, [tradeId, user]);

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading trade details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-4">
                <Alert.Heading>Error</Alert.Heading>
                <p>{error}</p>
                <Button variant="outline-danger" onClick={() => navigate('/dashboard/trading')}>Back to Trading List</Button>
            </Alert>
        );
    }

    if (!trade) {
        return (
            <Alert variant="warning" className="mt-4">
                <Alert.Heading>Trade Not Found</Alert.Heading>
                <Button variant="outline-warning" onClick={() => navigate('/dashboard/trading')}>Back to Trading List</Button>
            </Alert>
        );
    }

    return (
        <>
            <PageBreadcrumb title={`Trade #${trade.trade_id}`} subName="Trading" />
            <Row className="justify-content-center mt-4">
                <Col md={8} lg={7} xl={6}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Trade Details</h4>
                            <Button variant="secondary" size="sm" onClick={() => navigate('/dashboard/trading')}>
                                <i className="mdi mdi-arrow-left me-1"></i> Back to Trading List
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}><strong>Trade ID:</strong></Col>
                                <Col md={6}>{trade.trade_id || '-'}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Timestamp:</strong></Col>
                                <Col md={6}>{trade.timestamp || '-'}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Book:</strong></Col>
                                <Col md={6}><Badge bg="secondary">{trade.book || '-'}</Badge></Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Currency Pair:</strong></Col>
                                <Col md={6}><Badge bg="info">{trade.currency_pair || '-'}</Badge></Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Side:</strong></Col>
                                <Col md={6}><Badge bg={trade.side?.toLowerCase() === 'buy' ? 'success' : 'danger'}>{trade.side || '-'}</Badge></Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Quantity:</strong></Col>
                                <Col md={6}>{trade.quantity || '-'}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Price:</strong></Col>
                                <Col md={6}>{trade.price || '-'}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Market:</strong></Col>
                                <Col md={6}>{trade.market || '-'}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Order ID:</strong></Col>
                                <Col md={6}>{trade.order_id || '-'}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}><strong>Counterparty:</strong></Col>
                                <Col md={6}>{trade.counterparty || '-'}</Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default TradeDetail; 