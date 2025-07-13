import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Table, Form, Button, Badge, Pagination, Spinner, Alert } from 'react-bootstrap';
import { authApi } from '@/common';
import { useNotificationContext } from '@/common';
import { PageBreadcrumb } from '@/components';

const UserTickets = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        fetchUserDetails();
        fetchUserTickets();
    }, [userId, pagination.page, selectedStatus]);

    const fetchUserDetails = async () => {
        setUserLoading(true);
        try {
            const response = await authApi.getUserById(userId);
            
            if (response?.data) {
                console.log(response.data);
                setUser(response.data);
            }
        } catch (error) {
            showNotification({
                message: `Error fetching user details: ${error.toString()}`,
                type: 'error'
            });
        } finally {
            setUserLoading(false);
        }
    };

    const fetchUserTickets = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                status: selectedStatus
            };

            const response = await authApi.getUserTickets(userId, params);
            
            if (response?.data?.tickets) {
                setTickets(response.data.tickets);
                setPagination({
                    ...pagination,
                    total: response.data.pagination.total,
                    pages: response.data.pagination.pages
                });
            }
        } catch (error) {
            showNotification({
                message: `Error fetching tickets: ${error.toString()}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setPagination({ ...pagination, page: 1 });
    };

    const handlePageChange = (page) => {
        setPagination({ ...pagination, page });
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

    if (userLoading) {
        return (
            <>
                <PageBreadcrumb title="User Tickets" subName="Admin" />
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading user details...</p>
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <PageBreadcrumb title="User Tickets" subName="Admin" />
                <Alert variant="danger">
                    <Alert.Heading>User Not Found</Alert.Heading>
                    <p>The requested user could not be found or you don't have permission to view it.</p>
                    <div className="d-flex justify-content-end">
                        <Button variant="outline-danger" onClick={() => navigate('/dashboard/users')}>
                            Back to Users
                        </Button>
                    </div>
                </Alert>
            </>
        );
    }

    return (
        <>
            <PageBreadcrumb title={`${user.name}'s Tickets`} subName="Users" />
            
            <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="m-0">Support Tickets</h4>
                        <p className="text-muted mb-0 mt-1">
                            {user.name} (ID: {user.user_id}) - Total: {user.tickets.total || 0}
                        </p>
                    </div>
                    <div className="d-flex align-items-center">
                        <Form.Select 
                            className="me-2 w-auto"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="">All Statuses</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </Form.Select>
                        <Link 
                            to={`/dashboard/users/${user.user_id}`} 
                            className="btn btn-secondary"
                        >
                            <i className="mdi mdi-arrow-left me-1"></i>
                            Back to User
                        </Link>
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="table-responsive">
                        <Table className="table-centered table-hover mb-0">
                            <thead>
                                <tr>
                                    <th width="10%">ID</th>
                                    <th width="45%">Subject</th>
                                    <th width="15%">Status</th>
                                    <th width="15%">Created</th>
                                    <th width="15%">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-3">
                                            <Spinner animation="border" size="sm" variant="primary" className="me-2" />
                                            Loading tickets...
                                        </td>
                                    </tr>
                                ) : tickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-3">
                                            {selectedStatus ? (
                                                <>No {selectedStatus} tickets found.</>
                                            ) : (
                                                <>No tickets found.</>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    tickets.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td>#{ticket.id}</td>
                                            <td className="text-truncate" style={{ maxWidth: '300px' }}>
                                                <Link to={`/dashboard/tickets/${ticket.id}`}>
                                                    {ticket.subject}
                                                </Link>
                                            </td>
                                            <td>{getStatusBadge(ticket.status)}</td>
                                            <td>{ticket.created_at}</td>
                                            <td>
                                                <Link to={`/dashboard/tickets/${ticket.id}`} className="btn btn-sm btn-primary">
                                                    <i className="mdi mdi-eye me-1"></i>
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {pagination.pages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination>
                                <Pagination.First 
                                    disabled={pagination.page === 1}
                                    onClick={() => handlePageChange(1)}
                                />
                                <Pagination.Prev 
                                    disabled={pagination.page === 1}
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                />
                                
                                {[...Array(pagination.pages)].map((_, i) => {
                                    if (
                                        i + 1 === 1 || 
                                        i + 1 === pagination.pages || 
                                        (i + 1 >= pagination.page - 2 && i + 1 <= pagination.page + 2)
                                    ) {
                                        return (
                                            <Pagination.Item
                                                key={i}
                                                active={i + 1 === pagination.page}
                                                onClick={() => handlePageChange(i + 1)}
                                            >
                                                {i + 1}
                                            </Pagination.Item>
                                        );
                                    } else if (
                                        i + 1 === pagination.page - 3 || 
                                        i + 1 === pagination.page + 3
                                    ) {
                                        return <Pagination.Ellipsis key={i} className="disabled" />;
                                    }
                                    
                                    return null;
                                })}
                                
                                <Pagination.Next 
                                    disabled={pagination.page === pagination.pages}
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                />
                                <Pagination.Last 
                                    disabled={pagination.page === pagination.pages}
                                    onClick={() => handlePageChange(pagination.pages)}
                                />
                            </Pagination>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default UserTickets;