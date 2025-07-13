import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
import { Form as RHForm, SelectInput, TextInput } from '@/components/Form';
import Orders from './Orders';
import { orderData } from './data';
import { PageBreadcrumb } from '@/components';

const OrdersCRM = () => {
	const orderSchema = yup.object({
		email: yup.string().email('Please enter valid email').required('Please enter email'),
		password: yup.string().required('Please enter password'),
	});

	return (
		<>
			<PageBreadcrumb title="Orders List" subName="CRM" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<div className="mb-2 row">
								<RHForm
									onSubmit={() => {}}
									schema={orderSchema}
									className="col-xl-8"
								>
									<Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
										<Col xs="auto">
											<TextInput
												type="text"
												name="search"
												placeholder="Search..."
											/>
										</Col>
										<Col xs="auto">
											<Form.Group as={Row} className="align-items-center">
												<Form.Label
													htmlFor="exampleEmail3"
													as={Col}
													sm={3}
													className="mb-0 fw-medium"
												>
													Status
												</Form.Label>
												<Col sm={9}>
													<SelectInput
														name="select"
														className="form-select"
														key="select"
													>
														<option>Choose...</option>
														<option>Paid</option>
														<option>Awaiting Authorization</option>
														<option>Payment failed</option>
														<option>Cash On Delivery</option>
														<option>Fulfilled</option>
														<option>Unfulfilled</option>
													</SelectInput>
												</Col>
											</Form.Group>
										</Col>
									</Row>
								</RHForm>
								<Col xl={4}>
									<div className="text-xl-end mt-xl-0 mt-2">
										<Button variant="danger" className="mb-2 me-2">
											<i className="mdi mdi-basket me-1"></i> Add New Order
										</Button>
										<Button variant="light" className="mb-2">
											Export
										</Button>
									</div>
								</Col>
							</div>

							<Orders orderData={orderData} />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { OrdersCRM };
