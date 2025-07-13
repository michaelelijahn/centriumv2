import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { authApi, useNotificationContext, useAuthContext } from '@/common';
import TicketAttachments from '../TicketAttachments';

const TicketDetail = ({ adminView = false }) => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [reply, setReply] = useState('');
    const [attachmentUrls, setAttachmentUrls] = useState({});
    const [error, setError] = useState(null);
    const { showNotification } = useNotificationContext();
    const { user: currentUser } = useAuthContext();

    useEffect(() => {
        if (adminView && currentUser?.role !== 'admin') {
            navigate('/dashboard/support');
        }
    }, [adminView, currentUser, navigate]);

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = adminView
                ? await authApi.getAdminTicketById(ticketId)
                : await authApi.getTicketById(ticketId);
            
            if (response?.data) {
                setTicket(response.data);
                
                if (response.data.attachments && response.data.attachments.length > 0) {
                    await fetchAttachmentUrls(response.data.attachments);
                }
            } else if (response?.success === false) {
                setError(response.message || "Failed to retrieve ticket details");
            } else {
                setError("Invalid response format from server");
            }
        } catch (error) {
            setError(`Error retrieving ticket details: ${error.toString()}`);
            showNotification({
                message: `Error retrieving ticket details: ${error.toString()}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchAttachmentUrls = async (attachments) => {
        const urlsObj = {};
        
        for (const attachment of attachments) {
            try {
                const response = await authApi.getAttachmentUrl(attachment.s3_key);
                
                if (response?.data?.url) {
                    urlsObj[attachment.id] = response.data.url;
                }
            } catch (error) {
                showNotification({
                    message: `Failed to get URL for attachment: ${attachment.file_name}`,
                    type: 'warning'
                });
            }
        }
        
        setAttachmentUrls(urlsObj);
    };

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleSubmitReply = async () => {
        if (!reply.trim()) return;
        
        setSubmitting(true);
        try {
            const response = adminView
                ? await authApi.submitTicketReply(ticketId, reply)
                : await authApi.submitCustomerTicketComment(ticketId, reply);
            
            if (response?.success || response?.status === 'success') {
                showNotification({
                    message: 'Reply sent successfully',
                    type: 'success'
                });
                setReply('');
                
                await fetchTicketDetails();
            } else {
                throw new Error(response?.message || 'Failed to submit reply');
            }
        } catch (error) {
            showNotification({
                message: `Error sending reply: ${error.toString()}`,
                type: 'error'
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!adminView) return;
        
        try {
            const response = await authApi.updateTicketStatus(ticketId, newStatus);
            
            if (response?.success || response?.status === 'success') {
                showNotification({
                    message: `Ticket status updated to ${newStatus}`,
                    type: 'success'
                });
                
                await fetchTicketDetails();
            } else {
                throw new Error(response?.message || 'Failed to update status');
            }
        } catch (error) {
            showNotification({
                message: `Error updating status: ${error.toString()}`,
                type: 'error'
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'open':
                return <Badge bg="info">Open</Badge>;
            case 'in_progress':
                return <Badge bg="warning">In Progress</Badge>;
            case 'resolved':
                return <Badge bg="success">Resolved</Badge>;
            case 'closed':
                return <Badge bg="secondary">Closed</Badge>;
            default:
                return <Badge bg="light" text="dark">{status}</Badge>;
        }
    };

    const adminListPath = '/dashboard/admin/tickets';
    const customerListPath = '/dashboard/support';

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Loading ticket details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger">
                <Alert.Heading>Error Loading Ticket</Alert.Heading>
                <p>{error}</p>
                <Button 
                    variant="outline-danger" 
                    onClick={() => navigate(adminView ? adminListPath : customerListPath)}
                >
                    Back to {adminView ? 'Admin Dashboard' : 'Tickets'}
                </Button>
            </Alert>
        );
    }

    if (!ticket) {
        return (
            <Card className="border-danger">
                <Card.Header className="bg-danger text-white">Ticket Not Found</Card.Header>
                <Card.Body>
                    <Card.Text>
                        The requested ticket could not be found or you don't have permission to view it.
                    </Card.Text>
                    <Button 
                        variant="outline-danger" 
                        onClick={() => navigate(adminView ? adminListPath : customerListPath)}
                    >
                        Back to {adminView ? 'Admin Dashboard' : 'Tickets'}
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Row>
            {/* Main Ticket Content Column */}
            <Col md={adminView ? 8 : 12}>
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h4 className="m-0">Ticket #{ticket.id}</h4>
                        <div>
                            <Link 
                                to={adminView ? adminListPath : customerListPath} 
                                className="btn btn-sm btn-secondary"
                            >
                                <i className="mdi mdi-arrow-left me-1"></i>
                                Back to List
                            </Link>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Row className="mb-3">
                            <Col>
                                <h5 className="mb-1">Subject</h5>
                                <p className="mb-0 fw-bold">{ticket.subject}</p>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <h5 className="mb-1">Status</h5>
                                <div>{getStatusBadge(ticket.status)}</div>
                            </Col>
                            <Col md={4}>
                                <h5 className="mb-1">Created</h5>
                                <p className="mb-0">{ticket.issued_at || ticket.created_at}</p>
                            </Col>
                            {adminView && ticket.customer && (
                                <Col md={4}>
                                    <h5 className="mb-1">Customer</h5>
                                    <p className="mb-0">
                                        {adminView ? (
                                            <Link to={`/dashboard/admin/users/${ticket.user_id}`}>
                                                {ticket.customer.name}
                                            </Link>
                                        ) : (
                                            <span>{ticket.customer.name}</span>
                                        )}
                                    </p>
                                </Col>
                            )}
                        </Row>

                        <h5 className="mb-1">Description</h5>
                        <div className="p-3 bg-light rounded mb-4">
                            <p className="mb-0">{ticket.description}</p>
                        </div>

                        {/* Display ticket attachments */}
                        {ticket.attachments && ticket.attachments.length > 0 && (
                            <TicketAttachments 
                                attachments={ticket.attachments} 
                                attachmentUrls={attachmentUrls}
                            />
                        )}

                        {ticket.responses && ticket.responses.length > 0 && (
                            <div className="mt-4">
                                <h5>Responses</h5>
                                {ticket.responses.map((response, index) => (
                                    <div 
                                        key={response.id || index} 
                                        className={`p-3 rounded mb-3 ${
                                            (adminView && response.user === 'Support Agent') || 
                                            (!adminView && response.user === 'You')
                                                ? 'bg-light border-start border-5 border-primary'
                                                : 'bg-light'
                                        }`}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <strong>{response.user}</strong>
                                            <small>{response.date}</small>
                                        </div>
                                        <p className="mb-0 mt-2">{response.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {ticket.status !== 'closed' && (
                            (adminView || (!adminView && currentUser && currentUser.id === ticket.user_id))
                        ) && (
                            <div className="mt-4">
                                <h5>Add Reply</h5>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    placeholder="Type your reply here..."
                                    value={reply}
                                    onChange={handleReplyChange}
                                    disabled={submitting}
                                    className="mb-3"
                                />
                                <Button 
                                    variant="primary"
                                    disabled={!reply.trim() || submitting}
                                    onClick={handleSubmitReply}
                                >
                                    {submitting ? (
                                        <>
                                            <Spinner as="span" size="sm" animation="border" className="me-1" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <i className="mdi mdi-send me-1"></i>
                                            Send Reply
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Col>
            
            {/* Admin-only Sidebar */}
            {adminView && ticket.customer && (
                <Col md={4}>
                    {/* Ticket Actions */}
                    <Card>
                        <Card.Header>
                            <h5 className="m-0">Ticket Actions</h5>
                        </Card.Header>
                        <Card.Body>
                            <h6 className="mb-2">Change Status</h6>
                            <div className="d-grid gap-2">
                                <Button 
                                    variant="outline-info"
                                    onClick={() => handleStatusChange('open')}
                                    disabled={ticket.status === 'open'}
                                >
                                    <i className="mdi mdi-folder-open me-1"></i>
                                    Mark as Open
                                </Button>
                                <Button 
                                    variant="outline-warning"
                                    onClick={() => handleStatusChange('in_progress')}
                                    disabled={ticket.status === 'in_progress'}
                                >
                                    <i className="mdi mdi-progress-clock me-1"></i>
                                    Mark as In Progress
                                </Button>
                                <Button 
                                    variant="outline-success"
                                    onClick={() => handleStatusChange('resolved')}
                                    disabled={ticket.status === 'resolved'}
                                >
                                    <i className="mdi mdi-check-circle me-1"></i>
                                    Mark as Resolved
                                </Button>
                                <Button 
                                    variant="outline-secondary"
                                    onClick={() => handleStatusChange('closed')}
                                    disabled={ticket.status === 'closed'}
                                >
                                    <i className="mdi mdi-close-circle me-1"></i>
                                    Close Ticket
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                    
                    {/* Customer Info */}
                    <Card className="mt-4">
                        <Card.Header>
                            <h5 className="m-0">Customer Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-center mb-3">
                                <div 
                                    className="rounded-circle bg-primary bg-opacity-10 mx-auto d-flex align-items-center justify-content-center"
                                    style={{ width: '80px', height: '80px' }}
                                >
                                    <span className="text-primary" style={{ fontSize: '32px' }}>
                                        {ticket.customer?.name?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <h5 className="mt-2 mb-0">{ticket.customer?.name}</h5>
                                <p className="text-muted">
                                    <i className="mdi mdi-email me-1"></i>
                                    {ticket.customer?.email}
                                </p>
                            </div>
                            
                            <div className="list-group list-group-flush">
                                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span>Customer ID</span>
                                    <strong>{ticket.customer?.id}</strong>
                                </div>
                                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span>Status</span>
                                    <Badge bg={ticket.customer?.status === 'active' ? 'success' : 'warning'}>
                                        {ticket.customer?.status || 'N/A'}
                                    </Badge>
                                </div>
                                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                                    <span>Total Tickets</span>
                                    <strong>{ticket.customer?.totalTickets || '-'}</strong>
                                </div>
                            </div>
                            
                            <div className="text-center mt-3">
                                {adminView ? (
                                    <Link 
                                        to={`/dashboard/admin/users/${ticket.customer?.id}`}
                                        className="btn btn-primary"
                                    >
                                        <i className="mdi mdi-account-details me-1"></i>
                                        View Profile
                                    </Link>
                                ) : (
                                    <Link 
                                        to={`/dashboard/support/${ticketId}`}
                                        className="btn btn-primary"
                                    >
                                        <i className="mdi mdi-account-details me-1"></i>
                                        View Profile
                                    </Link>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            )}
        </Row>
    );
};

export default TicketDetail;