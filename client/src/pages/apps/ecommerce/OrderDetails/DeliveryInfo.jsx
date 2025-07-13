const DeliveryInfo = ({ details }) => {
	return (
		<div className="text-center">
			<i className="mdi mdi-truck-fast h2 text-muted"></i>
			<h5>
				<b>{details.provider}</b>
			</h5>
			<p className="mb-1">
				<b>Order ID :</b> {details.order_id}
			</p>
			<p className="mb-0">
				<b>Payment Mode :</b> {details.payment_mode}
			</p>
		</div>
	);
};

export default DeliveryInfo;
