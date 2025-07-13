import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Row, Col, Card, Table, Badge, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import { authApi } from '@/common';
import { useNotificationContext, useAuthContext } from '@/common';
import { PageBreadcrumb } from '@/components';

const AdminDashboard = () => {
    const [ticketStats, setTicketStats] = useState({
        total: 0,
        open: 0,
        in_progress: 0,
        resolved: 0,
        closed: 0
    });
    const [tickets, setTickets] = useState([]);
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
        sort_by: 'created_at',
        sort_order: 'desc'
    });
    const { showNotification } = useNotificationContext();
    const { user } = useAuthContext();
    
    // Refs for cleanup and initial mount tracking
    const searchTimeoutRef = useRef(null);
    const abortControllerRef = useRef(null);
    const isInitialMountRef = useRef(true);

    if (user && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

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

    // Fetch dashboard data
    const fetchDashboardData = useCallback(async (resetData = false) => {
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
            
            // Get tickets with pagination and filtering
            const ticketsParams = {
                page: validPage,
                limit: validLimit,
                search: search.trim(),
                ...filters
            };

            const ticketsResponse = await authApi.getAllTickets(ticketsParams, {
                signal: abortControllerRef.current.signal
            });
            
            if (ticketsResponse?.data) {
                setTickets(ticketsResponse.data.tickets || []);
                
                const paginationData = ticketsResponse.data.pagination;
                
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

                
                // Extract ticket statistics
                const stats = ticketsResponse.data.statistics || {};
                setTicketStats({
                    total: stats.total || 0,
                    open: stats.open || 0,
                    in_progress: stats.in_progress || 0,
                    resolved: stats.resolved || 0,
                    closed: stats.closed || 0
                });
            }
            
            // Get user statistics (only on initial load)
            // This block is removed as per the edit hint.
        } catch (error) {
            if (error.name !== 'AbortError') {
                showNotification({
                    message: `Error loading dashboard data: ${error.toString()}`,
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
        fetchDashboardData(true);
        
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
            fetchDashboardData(false);
        }
    }, [pagination.page, pagination.limit, search, filters, fetchDashboardData]);

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

    // Calculate display range with bounds checking
    const safePage = Math.max(1, pagination.page);
    const safeLimit = Math.max(1, pagination.limit);
    const safeTotal = Math.max(0, pagination.total);
    
    const startRecord = safeTotal > 0 ? ((safePage - 1) * safeLimit) + 1 : 0;
    const endRecord = safeTotal > 0 ? Math.min(safePage * safeLimit, safeTotal) : 0;

    return (
        <>
            <PageBreadcrumb title="All tickets" subName="Tickets" />
            
            {/* Stats Cards */}
            <Row>
                <Col xl={4} md={6} className="mb-4">
                    <Card className="bg-success text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Total Tickets</h5>
                                    <h2 className="my-2 text-white">{ticketStats.total}</h2>
                                    <p className="mb-0">{ticketStats.open} open tickets</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-ticket mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xl={4} md={6} className="mb-4">
                    <Card className="bg-warning text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">In Progress</h5>
                                    <h2 className="my-2 text-white">{ticketStats.in_progress}</h2>
                                    <p className="mb-0">Tickets being processed</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-clock-outline mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xl={4} md={6} className="mb-4">
                    <Card className="bg-info text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Open Tickets</h5>
                                    <h2 className="my-2 text-white">{ticketStats.open}</h2>
                                    <p className="mb-0">Need your attention</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-alert-circle mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* All Tickets Section with Search and Filters */}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <h4 className="header-title mb-3 mb-sm-0">All Support Tickets</h4>
                                <div className="d-flex flex-wrap gap-2">
                                    <Form.Select 
                                        className="w-auto"
                                        value={filters.status}
                                        onChange={(e) => handleFilterChange('status', e.target.value)}
                                        style={{ minWidth: '140px' }}
                                    >
                                        <option value="">All Status</option>
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </Form.Select>
                                    
                                    <Form.Select 
                                        className="w-auto"
                                        value={filters.sort_by}
                                        onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                        style={{ minWidth: '140px' }}
                                    >
                                        <option value="created_at">Sort by Date</option>
                                        <option value="ticket_id">Sort by ID</option>
                                        <option value="subject">Sort by Subject</option>
                                        <option value="status">Sort by Status</option>
                                        <option value="user_id">Sort by Customer</option>
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
                                        placeholder="Search tickets by ID, subject, or customer..."
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
                                    <p className="mt-2">Loading tickets...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <Table className="table-centered table-hover mb-0">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Subject</th>
                                                    <th>Customer</th>
                                                    <th>Status</th>
                                                    <th>Created</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tickets.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            {search ? (
                                                                <>
                                                                    <i className="mdi mdi-magnify-close mdi-48px text-muted mb-2"></i>
                                                                    <p>No tickets found for "{search}"</p>
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
                                                                    <i className="mdi mdi-ticket-outline mdi-48px text-muted mb-2"></i>
                                                                    <p>No tickets found.</p>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    tickets.map((ticket) => (
                                                        <tr key={ticket.id}>
                                                            <td>#{ticket.id}</td>
                                                            <td>
                                                                <Link to={`/admin/tickets/${ticket.id}`}>
                                                                    {ticket.subject}
                                                                </Link>
                                                            </td>
                                                            <td>
                                                                <Link to={`/admin/users/${ticket.customer.id}`}>
                                                                    {ticket.customer.name}
                                                                </Link>
                                                                <br />
                                                                <small className="text-muted">{ticket.customer.email}</small>
                                                            </td>
                                                            <td>{getStatusBadge(ticket.status)}</td>
                                                            <td>{ticket.created_at}</td>
                                                            <td>
                                                                <Link 
                                                                    to={`/admin/tickets/${ticket.id}`} 
                                                                    className="btn btn-sm btn-primary"
                                                                >
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

                                    {/* Navigation Controls */}
                                    <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                        <div className="d-flex align-items-center">
                                            <small className="text-muted">
                                                {pagination.total > 0 ? (
                                                    `Showing ${startRecord} to ${endRecord} of ${pagination.total} tickets`
                                                ) : (
                                                    "No tickets found"
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
                </Col>
            </Row>
        </>
    );
};

export default AdminDashboard;