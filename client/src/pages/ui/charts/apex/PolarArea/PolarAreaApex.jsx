import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';

import { BasicPolarAreaOpt, MonochromePolarAreaOpt } from './data';

import { PageBreadcrumb } from '@/components';

const PolarAreaApex = () => {
	return (
		<>
			<PageBreadcrumb title="Polar Area" subName="Apex" />

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Basic Polar Area Chart</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={BasicPolarAreaOpt}
									height={380}
									series={BasicPolarAreaOpt.series}
									type="polarArea"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Monochrome Polar Area</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={MonochromePolarAreaOpt}
									height={380}
									series={MonochromePolarAreaOpt.series}
									type="polarArea"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { PolarAreaApex };
