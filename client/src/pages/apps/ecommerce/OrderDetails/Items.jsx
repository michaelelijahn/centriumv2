const Items = ({ items }) => {
	return (
		<div className="table-responsive">
			<table className="table mb-0">
				<thead className="table-light">
					<tr>
						<th>Item</th>
						<th>Quantity</th>
						<th>Price</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{(items || []).map((item, index) => {
						return (
							<tr key={index.toString()}>
								<td>{item.name}</td>
								<td>{item.quantity}</td>
								<td>{item.price}</td>
								<td>{item.total}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Items;
