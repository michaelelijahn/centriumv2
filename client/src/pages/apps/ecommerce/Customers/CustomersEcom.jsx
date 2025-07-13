import { Row, Col, Card, Button } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';
import { customers } from '../data';
import { columns, sizePerPageList } from './ColumnsSet';

const CustomersEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Customers" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row>
								<Col sm={5}>
									<Button className="btn btn-danger mb-2">
										<i className="mdi mdi-plus-circle me-2"></i> Add Customers
									</Button>
								</Col>

								<Col sm={7}>
									<div className="text-sm-end">
										<Button className="btn btn-success mb-2 me-1">
											<i className="mdi mdi-cog"></i>
										</Button>

										<Button className="btn btn-light mb-2 me-1">Import</Button>

										<Button className="btn btn-light mb-2">Export</Button>
									</div>
								</Col>
							</Row>

							<Table
								columns={columns}
								data={customers}
								pageSize={10}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSelectable={true}
								isSearchable={true}
								tableClass="table-striped"
								searchBoxClass="mt-2 mb-3"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { CustomersEcom };
