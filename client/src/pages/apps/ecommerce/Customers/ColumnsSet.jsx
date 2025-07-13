import { Link } from 'react-router-dom';
import classNames from 'classnames';

/* name column render */
const NameColumn = ({ row }) => {
	return (
		<div className="table-user">
			<img src={row.original.avatar} alt="" className="me-2 rounded-circle" />
			<Link to="" className="text-body fw-semibold">
				{row.original.name}
			</Link>
		</div>
	);
};

/* status column render */
const StatusColumn = ({ row }) => {
	return (
		<span
			className={classNames('badge', {
				'badge-success-lighten': row.original.status === 'Active',
				'badge-danger-lighten': row.original.status === 'Blocked',
			})}
		>
			{row.original.status}
		</span>
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

// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Customer>> = [
const columns = [
	{
		Header: 'Customer',
		accessor: 'name',
		defaultCanSort: true,
		Cell: NameColumn,
	},
	{
		Header: 'Phone',
		accessor: 'phone',
		defaultCanSort: true,
	},
	{
		Header: 'Email',
		accessor: 'email',
		defaultCanSort: true,
	},
	{
		Header: 'Location',
		accessor: 'location',
		defaultCanSort: true,
	},
	{
		Header: 'Created On',
		accessor: 'created_on',
		defaultCanSort: true,
	},
	{
		Header: 'Status',
		accessor: 'status',
		defaultCanSort: true,
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
		text: '25',
		value: 25,
	},
	{
		text: '50',
		value: 50,
	},
];

export { columns, sizePerPageList };
