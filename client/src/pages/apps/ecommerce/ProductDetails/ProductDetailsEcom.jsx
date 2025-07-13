import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { PageBreadcrumb, Rating } from '@/components';
import { useProductDetails } from '../hooks';
import Stocks from './Stocks';

// images
import productImg1 from '@/assets/images/products/product-5.jpg';
import productImg2 from '@/assets/images/products/product-1.jpg';
import productImg3 from '@/assets/images/products/product-6.jpg';
import productImg4 from '@/assets/images/products/product-3.jpg';

const ProductDetailsEcom = () => {
	const { selectedProductImg, handleImgChange, product } = useProductDetails();

	return (
		<>
			<PageBreadcrumb title="Product Details" subName="E-Commerce" />

			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Row>
								<Col lg={5}>
									<Link to="" className="text-center d-block mb-4">
										<img
											src={selectedProductImg}
											className="img-fluid"
											style={{ maxWidth: '280px' }}
											alt="Product-img"
										/>
									</Link>

									<div className="d-lg-flex d-none justify-content-center">
										<Link
											to=""
											onMouseOver={(e) => {
												handleImgChange(e, productImg1);
											}}
											onClick={(e) => {
												handleImgChange(e, productImg1);
											}}
										>
											<img
												src={productImg1}
												className="img-fluid img-thumbnail p-2"
												style={{ maxWidth: '75px' }}
												alt="Product-img"
											/>
										</Link>
										<Link
											to=""
											className="ms-2"
											onMouseOver={(e) => {
												handleImgChange(e, productImg2);
											}}
											onClick={(e) => {
												handleImgChange(e, productImg2);
											}}
										>
											<img
												src={productImg2}
												className="img-fluid img-thumbnail p-2"
												style={{ maxWidth: '75px' }}
												alt="Product-img"
											/>
										</Link>
										<Link
											to=""
											className="ms-2"
											onMouseOver={(e) => {
												handleImgChange(e, productImg3);
											}}
											onClick={(e) => {
												handleImgChange(e, productImg3);
											}}
										>
											<img
												src={productImg3}
												className="img-fluid img-thumbnail p-2"
												style={{ maxWidth: '75px' }}
												alt="Product-img"
											/>
										</Link>
										<Link
											to=""
											className="ms-2"
											onMouseOver={(e) => {
												handleImgChange(e, productImg4);
											}}
											onClick={(e) => {
												handleImgChange(e, productImg4);
											}}
										>
											<img
												src={productImg4}
												className="img-fluid img-thumbnail p-2"
												style={{ maxWidth: '75px' }}
												alt="Product-img"
											/>
										</Link>
									</div>
								</Col>

								<Col lg={7}>
									<form className="ps-lg-4">
										<h3 className="mt-0">
											{product.name}
											<Link to="" className="text-muted">
												<i className="mdi mdi-square-edit-outline ms-2"></i>
											</Link>
										</h3>
										<p className="mb-1">Added Date: {product.addedOn}</p>
										<Rating value={Number(product.rating)} />

										<div className="mt-3">
											<h4>
												<span className="badge badge-success-lighten">
													{product.status}
												</span>
											</h4>
										</div>

										<div className="mt-4">
											<h6 className="font-14">Retail Price:</h6>
											<h3> {product.price}</h3>
										</div>

										<div className="mt-4">
											<h6 className="font-14">Quantity</h6>
											<div className="d-flex">
												<input
													type="number"
													min="1"
													defaultValue={1}
													className="form-control"
													placeholder="Qty"
													style={{ width: '90px' }}
												/>
												<button
													type="button"
													className="btn btn-danger ms-2"
												>
													<i className="mdi mdi-cart me-1"></i> Add to
													cart
												</button>
											</div>
										</div>

										<div className="mt-4">
											<h6 className="font-14">Description:</h6>
											<p>{product.description}</p>
										</div>

										<div className="mt-4">
											<Row>
												<Col md={4}>
													<h6 className="font-14">Available Stock:</h6>
													<p className="text-sm lh-150">
														{product.stock}
													</p>
												</Col>
												<Col md={4}>
													<h6 className="font-14">Number of Orders:</h6>
													<p className="text-sm lh-150">
														{product.noOfOrders}
													</p>
												</Col>
												<Col md={4}>
													<h6 className="font-14">Revenue:</h6>
													<p className="text-sm lh-150">
														{product.revenue}
													</p>
												</Col>
											</Row>
										</div>
									</form>
								</Col>
							</Row>

							<Stocks />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { ProductDetailsEcom };
