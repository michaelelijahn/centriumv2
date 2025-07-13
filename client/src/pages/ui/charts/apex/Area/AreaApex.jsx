import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { PageBreadcrumb } from '@/components';

// data
import {
	SpilineAreaApexOpt,
	AreaApexOpt,
	NavigateAreaApexOpt,
	StackedAreaOpt,
	IrregularTimeSeriesOps,
	AreaNullValueOps,
} from './data';

const AreaApex = () => {
	return (
		<>
			<PageBreadcrumb title="Area" subName="Apex" />
			<div>
				<Row>
					<Col xl={6}>
						<Card>
							<Card.Body>
								<h4 className="header-title mb-4">Basic Area Chart</h4>
								<div dir="ltr">
									<ReactApexChart
										className="apex-charts"
										options={AreaApexOpt}
										height={380}
										series={AreaApexOpt.series}
										type="area"
									/>
								</div>
							</Card.Body>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<Card.Body>
								<h4 className="header-title mb-4">Spline Area</h4>
								<div dir="ltr">
									<ReactApexChart
										className="apex-charts"
										options={SpilineAreaApexOpt}
										height={380}
										series={SpilineAreaApexOpt.series}
										type="area"
									/>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={6}>
						<Card>
							<Card.Body>
								<h4 className="header-title mb-4">Area with Negative Values</h4>
								<div dir="ltr">
									<ReactApexChart
										className="apex-charts"
										options={NavigateAreaApexOpt}
										height={350}
										series={NavigateAreaApexOpt.series}
										type="area"
									/>
								</div>
							</Card.Body>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<Card.Body>
								<h4 className="header-title mb-4">Stacked Area</h4>
								<div dir="ltr">
									<ReactApexChart
										id="stacked-area"
										className="apex-charts"
										options={StackedAreaOpt}
										height={380}
										series={StackedAreaOpt.series}
										type="area"
									/>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={6}>
						<Card>
							<Card.Body>
								<h4 className="header-title mb-4">Irregular TimeSeries</h4>
								<div dir="ltr">
									<ReactApexChart
										id="area-timeSeries"
										className="apex-charts"
										options={IrregularTimeSeriesOps}
										height={380}
										series={IrregularTimeSeriesOps.series}
										type="area"
									/>
								</div>
							</Card.Body>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<Card.Body>
								<h4 className="header-title mb-4">Area Chart with Null values</h4>
								<div dir="ltr">
									<ReactApexChart
										id="area-chart-nullvalues"
										className="apex-charts"
										options={AreaNullValueOps}
										height={380}
										series={AreaNullValueOps.series}
										type="area"
									/>
								</div>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</div>
		</>
	);
};

export { AreaApex };
