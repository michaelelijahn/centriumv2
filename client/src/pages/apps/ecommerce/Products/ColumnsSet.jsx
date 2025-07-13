import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { products } from '../data';

/* product column render */
const ProductColumn = ({ row }) => {
	const rating = row.original.rating;
	const emptyStars = rating < 5 ? 5 - rating : 0;
	return (
		<>
			<img
				src={row.original.image}
				alt={row.original.name}
				title={row.original.name}
				className="rounded me-3"
				height="48"
			/>
			<p className="m-0 d-inline-block align-middle font-16">
				<Link to="/apps/ecommerce/details" className="text-body">
					{row.original.name}
				</Link>
				<br />
				{[...Array(rating)].map((x, index) => (
					<span key={index.toString()} className="text-warning mdi mdi-star"></span>
				))}
				{[...Array(emptyStars)].map((x, index) => (
					<span
						key={index.toString()}
						className="text-warning mdi mdi-star-outline"
					></span>
				))}
			</p>
		</>
	);
};

/* status column render */
const StatusColumn = ({ row }) => {
	return (
		<span
			className={classNames('badge', {
				'bg-success': row.original.status,
				'bg-danger': !row.original.status,
			})}
		>
			{row.original.status ? 'Active' : 'Deactivated'}
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

// get all columns
const columns = [
	{
		Header: 'Product',
		accessor: 'name',
		defaultCanSort: true,
		Cell: ProductColumn,
	},
	{
		Header: 'Category',
		accessor: 'category',
		defaultCanSort: true,
	},
	{
		Header: 'Added Date',
		accessor: 'added_date',
		defaultCanSort: true,
	},
	{
		Header: 'Price',
		accessor: 'price',
		defaultCanSort: true,
	},
	{
		Header: 'Quantity',
		accessor: 'quantity',
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

// get pagelist to display
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
		value: products.length,
	},
];

export { columns, sizePerPageList };
