import { Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import Items from './Items';
import OrderSummary from './OrderSummary';
import ShippingInfo from './ShippingInfo';
import BillingInfo from './BillingInfo';
import DeliveryInfo from './DeliveryInfo';

const OrderDetailsEcom = () => {
	const order = {
		id: '#BM31',
		order_status: 'Packed',
		items: [
			{
				id: 1,
				name: 'The Military Duffle Bag',
				quantity: 3,
				price: '$128',
				total: '$384',
			},
			{
				id: 2,
				name: 'Mountain Basket Ball',
				quantity: 1,
				price: '$199',
				total: '$199',
			},
			{
				id: 3,
				name: 'Wavex Canvas Messenger Bag',
				quantity: 5,
				price: '$180',
				total: '$900',
			},
			{
				id: 4,
				name: 'The Utility Shirt',
				quantity: 2,
				price: '$79',
				total: '$158',
			},
		],
		gross_total: '$1641',
		shipping_charge: '$23',
		tax: '$19.22',
		net_total: '$1683.22',
		shipping: {
			provider: 'Stanley Jones',
			address_1: '795 Folsom Ave, Suite 600',
			address_2: 'San Francisco, CA 94107',
			phone: '(123) 456-7890 ',
			mobile: '(+01) 12345 67890',
		},
		billing: {
			type: 'Credit Card',
			provider: 'Visa ending in 2851',
			valid: '02/2020',
		},
		delivery: {
			provider: 'UPS Delivery',
			order_id: '#BM31',
			payment_mode: 'COD',
		},
	};

	return (
		<>
			<PageBreadcrumb title="Order Details" subName="E-commerce" />

			<Row>
				<Col>
					<Row className="justify-content-center">
						<Col lg={7} md={10} sm={11}>
							<div className="horizontal-steps mt-4 mb-4 pb-5">
								<div className="horizontal-steps-content">
									<div className="step-item">
										<OverlayTrigger
											placement="bottom"
											overlay={<Tooltip>20/08/2018 07:24 PM</Tooltip>}
										>
											<span> Order Placed</span>
										</OverlayTrigger>
									</div>
									<div className="step-item current">
										<OverlayTrigger
											placement="bottom"
											overlay={<Tooltip>21/08/2018 11:32 AM</Tooltip>}
										>
											<span> Packed</span>
										</OverlayTrigger>
									</div>
									<div className="step-item">
										<span>Shipped</span>
									</div>
									<div className="step-item">
										<span>Delivered</span>
									</div>
								</div>

								<div className="process-line" style={{ width: '33%' }}></div>
							</div>
						</Col>
					</Row>

					<Row>
						<Col lg={8}>
							<Card>
								<Card.Body>
									<h4 className="header-title mb-3">
										Items from Order {order.id}
									</h4>
									<Items items={order.items} />
								</Card.Body>
							</Card>
						</Col>
						<Col lg={4}>
							<Card>
								<Card.Body>
									<h4 className="header-title mb-3">Order Summary</h4>
									<OrderSummary summary={order} />
								</Card.Body>
							</Card>
						</Col>
					</Row>

					<Row>
						<Col lg={4}>
							<Card>
								<Card.Body>
									<h4 className="header-title mb-3">Shipping Information</h4>
									<ShippingInfo details={order.shipping} />
								</Card.Body>
							</Card>
						</Col>

						<Col lg={4}>
							<Card>
								<Card.Body>
									<h4 className="header-title mb-3">Billing Information</h4>
									<BillingInfo details={order.billing} />
								</Card.Body>
							</Card>
						</Col>

						<Col lg={4}>
							<Card>
								<Card.Body>
									<h4 className="header-title mb-3">Delivery Info</h4>
									<DeliveryInfo details={order.delivery} />
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Col>
			</Row>
		</>
	);
};

export { OrderDetailsEcom };
