import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Table, Form, InputGroup, Button, Badge, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authApi } from '@/common';
import { useNotificationContext } from '@/common';
import { PageBreadcrumb } from '@/components';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        total: 0,
        hasMore: true,
        hasPrevious: false
    });
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        role: '',
        sort_by: 'created_at',
        sort_order: 'desc'
    });
    const [statistics, setStatistics] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        admin: 0
    });
    const { showNotification } = useNotificationContext();

    // Refs for cleanup and initial mount tracking
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);
    const isInitialMountRef = useRef(true);

    // Debounced search function
    const debouncedSearch = useCallback((searchTerm) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            setSearch(searchTerm);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500); // 500ms delay
    }, []);

    // Handle search input change
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        setSearchLoading(true);
        debouncedSearch(value);
    };

    const fetchUsers = useCallback(async (resetData = false) => {
        // Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        // Create new abort controller
        abortControllerRef.current = new AbortController();
        
        if (resetData) {
        setLoading(true);
        }
        
        try {
            // Ensure page is within valid bounds
            const validPage = Math.max(1, pagination.page);
            const validLimit = Math.max(1, Math.min(100, pagination.limit));
            
            const params = {
                page: validPage,
                limit: validLimit,
                search: search.trim(),
                statistics: resetData || pagination.page === 1, // Get stats on first load or reset
                ...filters
            };

            const response = await authApi.getAllUsers(params, {
                signal: abortControllerRef.current.signal
            });
            
            if (response?.data?.users) {
                setUsers(response.data.users);
                
                const paginationData = response.data.pagination;
                
                // Ensure backend pagination data is valid
                const backendPage = Math.max(1, paginationData.page || 1);
                const backendTotal = Math.max(0, paginationData.total || 0);
                const backendLimit = Math.max(1, paginationData.limit || 5);
                const backendPages = Math.max(1, paginationData.pages || 1);
                
                // Ensure the current page doesn't exceed available pages
                const safePage = Math.min(backendPage, backendPages);
                
                setPagination(prev => ({
                    ...prev,
                    page: safePage,
                    total: backendTotal,
                    limit: backendLimit,
                    hasMore: safePage < backendPages,
                    hasPrevious: safePage > 1
                }));

                // Update statistics if available
                if (response.data.statistics) {
                    setStatistics(response.data.statistics);
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
            showNotification({
                message: `Error fetching users: ${error.toString()}`,
                type: 'error'
            });
            }
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    }, [pagination.page, pagination.limit, search, filters, showNotification]);

    // Initial load
    useEffect(() => {
        isInitialMountRef.current = false;
        fetchUsers(true);
        
        // Cleanup function
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Trigger fetch when dependencies change (after initial load)
    useEffect(() => {
        // Only fetch if this is not the initial mount
        if (!isInitialMountRef.current) {
            fetchUsers(false);
        }
    }, [pagination.page, pagination.limit, search, filters, fetchUsers]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePreviousPage = () => {
        if (pagination.hasPrevious && !loading && !searchLoading) {
            const newPage = Math.max(1, pagination.page - 1);
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleNextPage = () => {
        if (pagination.hasMore && !loading && !searchLoading) {
            const maxPages = Math.ceil(pagination.total / pagination.limit) || 1;
            const newPage = Math.min(maxPages, pagination.page + 1);
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handlePageSizeChange = (newLimit) => {
        setPagination(prev => ({ 
            ...prev, 
            limit: parseInt(newLimit), 
            page: 1 
        }));
    };

    const renderStatus = (status) => {
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

    const renderRole = (role) => {
        return role === 'admin' 
            ? <Badge bg="info">Admin</Badge>
            : <Badge bg="secondary">Customer</Badge>;
    };

    // Calculate display range with bounds checking
    const safePage = Math.max(1, pagination.page);
    const safeLimit = Math.max(1, pagination.limit);
    const safeTotal = Math.max(0, pagination.total);
    
    const startRecord = safeTotal > 0 ? ((safePage - 1) * safeLimit) + 1 : 0;
    const endRecord = safeTotal > 0 ? Math.min(safePage * safeLimit, safeTotal) : 0;

    return (
        <>
            <PageBreadcrumb title="User Management" subName="Users" />
            
            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col xl={3} md={6} className="mb-3">
                    <Card className="bg-primary text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Total Users</h5>
                                    <h2 className="my-2 text-white">{statistics.total}</h2>
                                    <p className="mb-0">Registered users</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-account-group mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={6} className="mb-3">
                    <Card className="bg-success text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Active Users</h5>
                                    <h2 className="my-2 text-white">{statistics.active}</h2>
                                    <p className="mb-0">Currently active</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-account-check mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={6} className="mb-3">
                    <Card className="bg-info text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Administrators</h5>
                                    <h2 className="my-2 text-white">{statistics.admin}</h2>
                                    <p className="mb-0">Admin users</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-shield-account mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={6} className="mb-3">
                    <Card className="bg-warning text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Inactive Users</h5>
                                    <h2 className="my-2 text-white">{statistics.inactive}</h2>
                                    <p className="mb-0">Need attention</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-account-off mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h4 className="header-title mb-3 mb-sm-0">All Users</h4>
                        <div className="d-flex flex-wrap gap-2">
                            <Form.Select 
                                className="w-auto"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                style={{ minWidth: '140px' }}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                            </Form.Select>
                            <Form.Select 
                                className="w-auto"
                                value={filters.role}
                                onChange={(e) => handleFilterChange('role', e.target.value)}
                                style={{ minWidth: '140px' }}
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="customer">Customer</option>
                            </Form.Select>
                            <Form.Select 
                                className="w-auto"
                                value={filters.sort_by}
                                onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                style={{ minWidth: '140px' }}
                            >
                                <option value="created_at">Sort by Date</option>
                                <option value="user_id">Sort by ID</option>
                                <option value="first_name">Sort by Name</option>
                                <option value="email">Sort by Email</option>
                                <option value="role">Sort by Role</option>
                                <option value="status">Sort by Status</option>
                            </Form.Select>
                            <Button
                                variant={filters.sort_order === 'asc' ? 'primary' : 'outline-primary'}
                                onClick={() => handleFilterChange('sort_order', filters.sort_order === 'asc' ? 'desc' : 'asc')}
                            >
                                <i className={`mdi mdi-sort-${filters.sort_order === 'asc' ? 'ascending' : 'descending'}`}></i>
                                    </Button>
                        </div>
                    </div>
                    
                    <div className="mt-3">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search users by name, email, or ID..."
                                value={searchInput}
                                onChange={handleSearchInputChange}
                            />
                            {searchLoading && (
                                <InputGroup.Text>
                                    <Spinner size="sm" animation="border" />
                                </InputGroup.Text>
                            )}
                        </InputGroup>
                        {searchInput !== search && (
                            <small className="text-muted mt-1 d-block">
                                <i className="mdi mdi-magnify me-1"></i>
                                Searching for "{searchInput}"...
                            </small>
                        )}
                    </div>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading users...</p>
                                        </div>
                    ) : (
                        <>
                    <div className="table-responsive">
                        <Table className="table-centered table-hover mb-0">
                            <thead>
                                <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                    <th>Role</th>
                                            <th>Registered</th>
                                            <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                        {users.length === 0 ? (
                                    <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    {search ? (
                                                        <>
                                                            <i className="mdi mdi-account-search-outline mdi-48px text-muted mb-2"></i>
                                                            <p>No users found for "{search}"</p>
                                                            <Button 
                                                                variant="link" 
                                                                onClick={() => {
                                                                    setSearchInput('');
                                                                    setSearch('');
                                                                }}
                                                            >
                                                                Clear search
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="mdi mdi-account-outline mdi-48px text-muted mb-2"></i>
                                                            <p>No users found.</p>
                                                        </>
                                                    )}
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>
                                                <Link to={`/dashboard/users/${user.id}`} className="text-body fw-medium">
                                                    {user.name}
                                                </Link>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{renderRole(user.role)}</td>
                                            <td>{user.created_at}</td>
                                            <td>{renderStatus(user.status)}</td>
                                            <td>
                                                <Link 
                                                    to={`/dashboard/users/${user.id}`} 
                                                            className="btn btn-sm btn-primary"
                                                >
                                                    <i className="mdi mdi-account-details me-1" />
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>

                            {/* Navigation Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <div className="d-flex align-items-center">
                                    <small className="text-muted">
                                        {pagination.total > 0 ? (
                                            `Showing ${startRecord} to ${endRecord} of ${pagination.total} users`
                                        ) : (
                                            "No users found"
                                        )}
                                    </small>
                                </div>
                                
                                <div className="d-flex align-items-center gap-3">
                                    {/* Page Size Selector */}
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 text-muted">Show:</span>
                                        <Form.Select 
                                            size="sm" 
                                            style={{ width: 'auto' }}
                                            value={pagination.limit}
                                            onChange={(e) => handlePageSizeChange(e.target.value)}
                                            >
                                            <option value="5">5</option>
                                            <option value="10">10</option>
                                            <option value="25">25</option>
                                            <option value="50">50</option>
                                        </Form.Select>
                                    </div>

                                    {/* Previous/Next Navigation */}
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            disabled={!pagination.hasPrevious || loading || searchLoading}
                                            onClick={handlePreviousPage}
                                        >
                                            <i className="mdi mdi-chevron-left me-1"></i>
                                            Previous {pagination.limit}
                                        </Button>
                                        
                                        <Button
                                            variant="outline-primary" 
                                            size="sm"
                                            disabled={!pagination.hasMore || loading || searchLoading}
                                            onClick={handleNextPage}
                                        >
                                            Next {pagination.limit}
                                            <i className="mdi mdi-chevron-right ms-1"></i>
                                        </Button>
                                    </div>
                                </div>
                        </div>
                        </>
                    )}
                </Card.Body>
            </Card>
        </>
    );
};

export default UserList;