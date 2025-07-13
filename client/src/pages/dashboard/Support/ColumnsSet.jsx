import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import { useAuthContext } from '@/common/context';
import React from 'react';

const StatusColumn = ({ row }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'open':
                return { label: 'Open', className: 'bg-info' };
            case 'in_progress':
                return { label: 'In Progress', className: 'bg-warning' };
            case 'resolved':
                return { label: 'Resolved', className: 'bg-success' };
            case 'closed':
                return { label: 'Closed', className: 'bg-secondary' };
            default:
                return { label: 'Open', className: 'bg-info' };
        }
    };

    const statusConfig = getStatusConfig(row.original.status);

    return (
        <span className={classNames('badge', statusConfig.className)}>
            {statusConfig.label}
        </span>
    );
};

// Best practice: use a wrapper component to access hooks in table columns
const ActionColumn = (props) => {
    const { row } = props;
    const ticketId = row.original.id;
    return (
        <Link to={`/dashboard/tickets/${ticketId}`}>
            <Button variant="primary" size="sm">
                <i className="mdi mdi-eye me-1"></i> View
            </Button>
        </Link>
    );
};

const columns = [
    {
        Header: 'Subject',
        accessor: 'subject',
        defaultCanSort: true,
    },
    {
        Header: 'Date',
        accessor: 'issued_at',
        defaultCanSort: true,
    },
    {
        Header: 'Description',
        accessor: 'description',
        defaultCanSort: true,
    },
    {
        Header: 'Status',
        accessor: 'status',
        defaultCanSort: true,
        Cell: StatusColumn,
    },
    {
        Header: 'Actions',
        accessor: 'actions',
        defaultCanSort: false,
        Cell: ActionColumn,
    },
];

const sizePerPageList = [
    {
        text: '5',
        value: 5,
    },
    {
        text: '10',
        value: 10,
    },
    {
        text: '20',
        value: 20,
    },
    {
        text: 'All',
        value: 4,
    },
];

export { columns, sizePerPageList };