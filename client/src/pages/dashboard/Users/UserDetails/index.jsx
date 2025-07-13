import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge, Form, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { authApi } from '@/common';
import { useNotificationContext } from '@/common';
import { PageBreadcrumb } from '@/components';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: ''
    });
    const { showNotification } = useNotificationContext();

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        setLoading(true);
        try {
            const response = await authApi.getUserById(userId);
            
            if (response?.data) {
                setUser(response.data);
                setFormData({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    status: response.data.status || 'active'
                });
            }
        } catch (error) {
            showNotification({
                message: `Error fetching user details: ${error.toString()}`,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const response = await authApi.updateUser(userId, formData);
            
            if (response?.success) {
                showNotification({
                    message: 'User details updated successfully',
                    type: 'success'
                });
                setEditing(false);
                fetchUserDetails();
            } else {
                throw new Error(response?.message || 'Failed to update user');
            }
        } catch (error) {
            showNotification({
                message: `Error updating user: ${error.toString()}`,
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge bg="success">Active</Badge>;
            case 'inactive':
                return <Badge bg="warning">Inactive</Badge>;
            case 'suspended':
                return <Badge bg="danger">Suspended</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const renderRoleBadge = (role) => {
        return role === 'admin' 
            ? <Badge bg="info">Admin</Badge>
            : <Badge bg="secondary">Customer</Badge>;
    };

    if (loading) {
        return (
            <>
                <PageBreadcrumb title="User Details" subName="Users" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => navigate('/dashboard/users')}
                        className="d-flex align-items-center"
                    >
                        <i className="mdi mdi-arrow-left me-2"></i>
                        Back to Users
                    </Button>
                </div>
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
                <PageBreadcrumb title="User Details" subName="Users" />
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button 
                        variant="outline-secondary" 
                        onClick={() => navigate('/dashboard/users')}
                        className="d-flex align-items-center"
                    >
                        <i className="mdi mdi-arrow-left me-2"></i>
                        Back to Users
                    </Button>
                </div>
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
            <PageBreadcrumb title="User Details" subName="Users" />
            
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/dashboard/users')}
                    className="d-flex align-items-center"
                >
                    <i className="mdi mdi-arrow-left me-2"></i>
                    Back to Users
                </Button>
            </div>
            
            <Row>
                <Col>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h4 className="m-0">User Profile</h4>
                            <div>
                                {editing ? (
                                    <>
                                        <Button 
                                            variant="outline-secondary" 
                                            className="me-2"
                                            onClick={() => setEditing(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            variant="primary" 
                                            form="userEditForm"
                                            type="submit"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <Spinner 
                                                        as="span" 
                                                        animation="border" 
                                                        size="sm" 
                                                        className="me-1"
                                                    />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>Save Changes</>
                                            )}
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        variant="primary" 
                                        onClick={() => setEditing(true)}
                                    >
                                        <i className="mdi mdi-pencil me-1"></i>
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            {editing ? (
                                <Form id="userEditForm" onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>User ID</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={user.id}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Role</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={user.role}
                                                    disabled
                                                />
                                                <Form.Text className="text-muted">
                                                    Role cannot be changed through this interface
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Full Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email Address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Phone Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Account Status</Form.Label>
                                                <Form.Select
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                    <option value="suspended">Suspended</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    

                                </Form>
                            ) : (
                                <Row>
                                    <Col md={6}>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                <strong>User ID:</strong>
                                                <span>{user.id}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                <strong>Name:</strong>
                                                <span>{user.name}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                <strong>Email:</strong>
                                                <span>{user.email}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                <strong>Phone:</strong>
                                                <span>{user.phone || 'Not provided'}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                <strong>Registration Date:</strong>
                                                <span>{user.created_at}</span>
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col md={6}>
                                        <ListGroup variant="flush">
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                <strong>Role:</strong>
                                                <span>{renderRoleBadge(user.role)}</span>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                <strong>Status:</strong>
                                                <span>{renderStatusBadge(user.status)}</span>
                                            </ListGroup.Item>

                                        </ListGroup>
                                    </Col>
                                </Row>
                            )}
                        </Card.Body>
                    </Card>
                    

                </Col>
            </Row>
        </>
    );
};

export default UserDetails;