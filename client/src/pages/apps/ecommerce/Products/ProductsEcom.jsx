import { Link } from 'react-router-dom';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';
import { columns, sizePerPageList } from './ColumnsSet';
import { products } from '../data';

const ProductsEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Products" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Row className="mb-2">
								<Col sm={5}>
									<Link to="" className="btn btn-danger mb-2">
										<i className="mdi mdi-plus-circle me-2"></i> Add Products
									</Link>
								</Col>

								<Col sm={7}>
									<div className="text-sm-end">
										<Button variant="success" className="mb-2 me-1">
											<i className="mdi mdi-cog-outline"></i>
										</Button>

										<Button variant="light" className="mb-2 me-1">
											Import
										</Button>

										<Button variant="light" className="mb-2">
											Export
										</Button>
									</div>
								</Col>
							</Row>

							<Table
								columns={columns}
								data={products}
								pageSize={5}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSelectable={true}
								isSearchable={true}
								theadClass="table-light"
								searchBoxClass="mb-2"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { ProductsEcom };
