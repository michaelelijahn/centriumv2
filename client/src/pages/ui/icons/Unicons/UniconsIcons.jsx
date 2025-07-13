import { PageBreadcrumb } from '@/components';
import { Card, Col, Row } from 'react-bootstrap';
import { uniconsIcons } from './data';
import { Fragment } from 'react';

const UniconsIcons = () => {
	return (
		<>
			<PageBreadcrumb title="Unicons" subName="icons" />

			{Object.keys(uniconsIcons).map((category, index) => (
				<Fragment key={index}>
					<Row>
						<Col>
							<Card>
								<Card.Body>
									<h4 className="m-t-0 header-title mb-4">{category}</h4>
									<Row className="icons-list-demo">
										{uniconsIcons[category].map((icon, index) => (
											<Col xl={3} lg={4} sm={6} key={index}>
												<i className={`uil ${icon}`} /> {icon}
											</Col>
										))}
									</Row>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Fragment>
			))}
		</>
	);
};

export { UniconsIcons };
