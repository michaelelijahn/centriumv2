import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Table, Button, Spinner, Badge, Row, Col, OverlayTrigger, Tooltip, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { authApi } from '@/common';
import { useNotificationContext, useAuthContext } from '@/common';
import { PageBreadcrumb } from '@/components';
import TradingFilters from './TradingFilters';
import CsvUploader from './CsvUploader';

const TradingList = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        buy: 0,
        sell: 0,
        currencies: {},
        books: {},
        volume: {
            total_quantity: 0,
            avg_price: 0,
            min_price: 0,
            max_price: 0
        }
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        hasMore: true,
        hasPrevious: false
    });
    const [filters, setFilters] = useState({
        search: '',
        side: '',
        book: '',
        currency_pair: '',
        counterparty: '',
        sort_by: 'created_at',
        sort_order: 'desc',
        date_from: '',
        date_to: ''
    });
    const { showNotification } = useNotificationContext();
    const { user } = useAuthContext();
    
    const abortControllerRef = useRef(null);
    const isInitialMountRef = useRef(true);

    // Initial check for admin access
    useEffect(() => {
        if (user?.role !== 'admin') {
            showNotification({
                message: 'You do not have permission to access this page',
                type: 'error'
            });
            return;
        }
    }, [user, showNotification]);

    const fetchTrades = useCallback(async (resetData = false) => {
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
            
            const queryParams = {
                page: validPage,
                limit: validLimit,
                search: filters.search.trim(),
                ...filters
            };

            // Remove empty filter values
            Object.keys(queryParams).forEach(key => {
                if (queryParams[key] === '') {
                    delete queryParams[key];
                }
            });

            const response = await authApi.getTrades(queryParams, {
                signal: abortControllerRef.current.signal
            });
            
            if (response?.data) {
                setTrades(response.data.trades || []);
                setStats(response.data.statistics || {});
                
                const paginationData = response.data.pagination;
                
                // Ensure backend pagination data is valid
                const backendPage = Math.max(1, paginationData.page || 1);
                const backendTotal = Math.max(0, paginationData.total || 0);
                const backendLimit = Math.max(1, paginationData.limit || 20);
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
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                showNotification({
                    message: `Error fetching trades: ${error.toString()}`,
                    type: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filters, showNotification]);

    // Initial load
    useEffect(() => {
        if (user?.role === 'admin') {
            isInitialMountRef.current = false;
            fetchTrades(true);
        }
        
        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // Trigger fetch when dependencies change (after initial load)
    useEffect(() => {
        if (!user || user.role !== 'admin') return;
        
        // Only fetch if this is not the initial mount
        if (!isInitialMountRef.current) {
            fetchTrades(false);
        }
    }, [pagination.page, pagination.limit, filters, user, fetchTrades]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSortChange = (column) => {
        if (filters.sort_by === column) {
            setFilters(prev => ({
                ...prev,
                sort_order: prev.sort_order === 'asc' ? 'desc' : 'asc'
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                sort_by: column,
                sort_order: 'desc'
            }));
        }
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePreviousPage = () => {
        if (pagination.hasPrevious && !loading) {
            const newPage = Math.max(1, pagination.page - 1);
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleNextPage = () => {
        if (pagination.hasMore && !loading) {
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

    const getSortIcon = (column) => {
        if (filters.sort_by !== column) return null;
        
        return filters.sort_order === 'asc' 
            ? <i className="mdi mdi-arrow-up ms-1" />
            : <i className="mdi mdi-arrow-down ms-1" />;
    };

    const handleFileUpload = async (file) => {
        setUploading(true);
        try {
            // Create FormData and append the file with the correct field name
            const formData = new FormData();
            formData.append('file', file);
            
            await authApi.uploadTradesCsv(formData);
            showNotification({
                message: 'Trades uploaded successfully',
                type: 'success'
            });
            fetchTrades(true); // Refresh data after upload
        } catch (error) {
            showNotification({
                message: `Upload failed: ${error.toString()}`,
                type: 'error'
            });
        } finally {
            setUploading(false);
        }
    };

    const formatNumber = (num) => {
        if (!num) return '0';
        return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    const formatCurrency = (num) => {
        if (!num) return '$0.00';
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD' 
        }).format(num);
    };

    // Calculate display range with bounds checking
    const safePage = Math.max(1, pagination.page);
    const safeLimit = Math.max(1, pagination.limit);
    const safeTotal = Math.max(0, pagination.total);
    
    const startRecord = safeTotal > 0 ? ((safePage - 1) * safeLimit) + 1 : 0;
    const endRecord = safeTotal > 0 ? Math.min(safePage * safeLimit, safeTotal) : 0;

    if (user?.role !== 'admin') {
        return null;
    }

    return (
        <>
            <PageBreadcrumb title="Trading Dashboard" subName="Trading" />
            
            {/* Statistics Cards */}
            <Row className="mb-4">
                <Col xl={3} md={6} className="mb-3">
                    <Card className="bg-primary text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Total Trades</h5>
                                    <h2 className="my-2 text-white">{formatNumber(stats.total)}</h2>
                                    <p className="mb-0">All transactions</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-chart-line mdi-36px text-white"></i>
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
                                    <h5 className="text-white">Buy Orders</h5>
                                    <h2 className="my-2 text-white">{formatNumber(stats.buy)}</h2>
                                    <p className="mb-0">Purchase transactions</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-trending-up mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={3} md={6} className="mb-3">
                    <Card className="bg-danger text-white h-100">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="text-white">Sell Orders</h5>
                                    <h2 className="my-2 text-white">{formatNumber(stats.sell)}</h2>
                                    <p className="mb-0">Sale transactions</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-trending-down mdi-36px text-white"></i>
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
                                    <h5 className="text-white">Avg Price</h5>
                                    <h2 className="my-2 text-white">{formatCurrency(stats.volume?.avg_price)}</h2>
                                    <p className="mb-0">Average trade price</p>
                                </div>
                                <div className="avatar-lg rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center">
                                    <i className="mdi mdi-currency-usd mdi-36px text-white"></i>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <CsvUploader 
                                onUpload={handleFileUpload} 
                                uploading={uploading} 
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h4 className="header-title mb-3 mb-sm-0">Trading List</h4>
                    </div>
                    
                    <div className="mt-3">
                        <TradingFilters 
                            filters={filters} 
                            onFilterChange={handleFilterChange} 
                        />
                    </div>
                </Card.Header>
                
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-2">Loading trades...</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <Table className="table-centered table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th 
                                                onClick={() => handleSortChange('trade_id')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Trade ID {getSortIcon('trade_id')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('timestamp')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Timestamp {getSortIcon('timestamp')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('book')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Book {getSortIcon('book')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('currency_pair')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Currency Pair {getSortIcon('currency_pair')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('side')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Side {getSortIcon('side')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('quantity')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Quantity {getSortIcon('quantity')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('price')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Price {getSortIcon('price')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('market')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Market {getSortIcon('market')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('order_id')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Order ID {getSortIcon('order_id')}
                                            </th>
                                            <th 
                                                onClick={() => handleSortChange('counterparty')}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                Counterparty {getSortIcon('counterparty')}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trades.length === 0 ? (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">
                                                    {filters.search ? (
                                                        <>
                                                            <i className="mdi mdi-chart-line-variant mdi-48px text-muted mb-2"></i>
                                                            <p>No trades found for "{filters.search}"</p>
                                                            <Button 
                                                                variant="link" 
                                                                onClick={() => {
                                                                    setFilters(prev => ({ ...prev, search: '' }));
                                                                }}
                                                            >
                                                                Clear search
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="mdi mdi-chart-timeline-variant mdi-48px text-muted mb-2"></i>
                                                            <p>No trades found.</p>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ) : (
                                            trades.map((trade, index) => (
                                                <tr key={trade.trade_id || index}>
                                                    <td>
                                                        <span className="fw-semibold text-primary">{trade.trade_id || '-'}</span>
                                                    </td>
                                                    <td>
                                                        <small>{trade.timestamp || '-'}</small>
                                                    </td>
                                                    <td>
                                                        <Badge bg="secondary" className="text-white">{trade.book || '-'}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg="info">{trade.currency_pair || '-'}</Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg={trade.side?.toLowerCase() === 'buy' ? 'success' : 'danger'}>
                                                            {trade.side || '-'}
                                                        </Badge>
                                                    </td>
                                                    <td className="text-end">{formatNumber(trade.quantity)}</td>
                                                    <td className="text-end">{formatNumber(trade.price)}</td>
                                                    <td>
                                                        <small>{trade.market || '-'}</small>
                                                    </td>
                                                    <td>
                                                        <small className="text-muted">{trade.order_id || '-'}</small>
                                                    </td>
                                                    <td>{trade.counterparty || '-'}</td>
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
                                            `Showing ${startRecord} to ${endRecord} of ${pagination.total} trades`
                                        ) : (
                                            "No trades found"
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
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </Form.Select>
                                    </div>

                                    {/* Previous/Next Navigation */}
                                    <div className="d-flex align-items-center gap-2">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            disabled={!pagination.hasPrevious || loading}
                                            onClick={handlePreviousPage}
                                        >
                                            <i className="mdi mdi-chevron-left me-1"></i>
                                            Previous {pagination.limit}
                                        </Button>
                                        
                                        <Button
                                            variant="outline-primary" 
                                            size="sm"
                                            disabled={!pagination.hasMore || loading}
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

export default TradingList;