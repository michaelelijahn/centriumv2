const OrderSummary = ({ summary }) => {
	return (
		<div className="table-responsive">
			<table className="table mb-0">
				<thead className="table-light">
					<tr>
						<th>Description</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Grand Total :</td>
						<td>{summary.gross_total}</td>
					</tr>
					<tr>
						<td>Shipping Charge :</td>
						<td>{summary.shipping_charge}</td>
					</tr>
					<tr>
						<td>Estimated Tax : </td>
						<td>{summary.tax}</td>
					</tr>
					<tr>
						<th>Total :</th>
						<td>{summary.net_total}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default OrderSummary;
