import { Link } from 'react-router-dom';
import classNames from 'classnames';

/* order column render */
const OrderColumn = ({ row }) => {
	return (
		<Link to="" className="text-body fw-bold">
			#BM{row.original.order_id}
		</Link>
	);
};

/* orderdate column render */
const OrderDateColumn = ({ row }) => {
	return (
		<>
			{row.original.order_date}
			<small className="text-muted">{row.original.order_time}</small>
		</>
	);
};

/* payment column render */
const PaymentStatusColumn = ({ row }) => {
	return (
		<h5>
			<span
				className={classNames('badge', {
					'badge-success-lighten': row.original.payment_status === 'Paid',
					'badge-danger-lighten': row.original.payment_status === 'Payment Failed',
					'badge-info-lighten': row.original.payment_status === 'Unpaid',
					'badge-warning-lighten':
						row.original.payment_status === 'Awaiting Authorization',
				})}
			>
				{row.original.payment_status === 'Paid' && <i className="mdi mdi-bitcoin me-1"></i>}
				{row.original.payment_status === 'Payment Failed' && (
					<i className="mdi mdi-cancel me-1"></i>
				)}
				{row.original.payment_status === 'Unpaid' && <i className="mdi mdi-cash me-1"></i>}
				{row.original.payment_status === 'Awaiting Authorization' && (
					<i className="mdi mdi-timer-sand me-1"></i>
				)}
				{row.original.payment_status}
			</span>
		</h5>
	);
};

/* status column render */
const StatusColumn = ({ row }) => {
	return (
		<h5>
			<span
				className={classNames('badge', {
					'badge-success-lighten': row.original.order_status === 'Delivered',
					'badge-danger-lighten': row.original.order_status === 'Cancelled',
					'badge-info-lighten': row.original.order_status === 'Shipped',
					'badge-warning-lighten': row.original.order_status === 'Processing',
				})}
			>
				{row.original.order_status}
			</span>
		</h5>
	);
};

/* action column render */
const ActionColumn = () => {
	return (
		<>
			<Link to="" className="action-icon">
				<i className="mdi mdi-eye"></i>
			</Link>
			<Link to="" className="action-icon">
				<i className="mdi mdi-square-edit-outline"></i>
			</Link>
			<Link to="" className="action-icon">
				<i className="mdi mdi-delete"></i>
			</Link>
		</>
	);
};

// get all columns
const columns = [
	{
		Header: 'Order ID',
		accessor: 'order_id',
		defaultCanSort: true,
		Cell: OrderColumn,
	},
	{
		Header: 'Date',
		accessor: 'order_date',
		defaultCanSort: false,
		Cell: OrderDateColumn,
	},
	{
		Header: 'Payment Status',
		accessor: 'payment_status',
		defaultCanSort: false,
		Cell: PaymentStatusColumn,
	},
	{
		Header: 'Total',
		accessor: 'total',
		defaultCanSort: false,
	},
	{
		Header: 'Payment Method',
		accessor: 'payment_method',
		defaultCanSort: false,
	},
	{
		Header: 'Status',
		accessor: 'order_status',
		defaultCanSort: false,
		Cell: StatusColumn,
	},
	{
		Header: 'Action',
		accessor: 'id',
		defaultCanSort: false,
		Cell: ActionColumn,
	},
];

const sizePerPageList = [
	{
		text: '10',
		value: 10,
	},
	{
		text: '20',
		value: 20,
	},
	{
		text: '50',
		value: 50,
	},
];

export { columns, sizePerPageList };
