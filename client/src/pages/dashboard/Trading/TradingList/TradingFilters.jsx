import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

const TradingFilters = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };
    const handleReset = () => {
        onFilterChange({
            search: '',
            side: '',
            book: '',
            currency_pair: '',
            counterparty: '',
            date_from: '',
            date_to: '',
            sort_by: filters.sort_by,
            sort_order: filters.sort_order
        });
    };
    return (
        <Form className="mb-3">
            <Row className="g-2 align-items-end">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Search</Form.Label>
                        <Form.Control
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            placeholder="Search by trade ID, order ID, etc."
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Side</Form.Label>
                        <Form.Select name="side" value={filters.side} onChange={handleChange}>
                            <option value="">All</option>
                            <option value="buy">Buy</option>
                            <option value="sell">Sell</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Book</Form.Label>
                        <Form.Control
                            type="text"
                            name="book"
                            value={filters.book}
                            onChange={handleChange}
                            placeholder="Book"
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Currency Pair</Form.Label>
                        <Form.Control
                            type="text"
                            name="currency_pair"
                            value={filters.currency_pair}
                            onChange={handleChange}
                            placeholder="e.g. BTC/USD"
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Counterparty</Form.Label>
                        <Form.Control
                            type="text"
                            name="counterparty"
                            value={filters.counterparty}
                            onChange={handleChange}
                            placeholder="Counterparty"
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Date From</Form.Label>
                        <Form.Control
                            type="date"
                            name="date_from"
                            value={filters.date_from}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Date To</Form.Label>
                        <Form.Control
                            type="date"
                            name="date_to"
                            value={filters.date_to}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col md={1} className="d-flex align-items-end">
                    <Button variant="outline-secondary" onClick={handleReset} size="sm">Reset</Button>
                </Col>
            </Row>
        </Form>
    );
};

export default TradingFilters; 