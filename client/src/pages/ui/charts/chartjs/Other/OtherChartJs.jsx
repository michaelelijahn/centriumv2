import { Card, Col, Row } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import { useEffect } from 'react';
import {
	bubbleConfig,
	donutConfig,
	pieConfig,
	polarAreaConfig,
	radarConfig,
	scatterConfig,
	barLineConfig,
} from './data';

import { PageBreadcrumb } from '@/components';

const OtherChartJs = () => {
	useEffect(() => {
		const bubbleTag = document.getElementById('bubble-example');
		const bubbleChart = new Chart(bubbleTag, bubbleConfig);

		const donutTag = document.getElementById('donut-example');
		const donutChart = new Chart(donutTag, donutConfig);

		const pieTag = document.getElementById('pie-example');
		const pieChart = new Chart(pieTag, pieConfig);

		const polarAreaTag = document.getElementById('polar-area-example');
		const polarAreaChart = new Chart(polarAreaTag, polarAreaConfig);

		const radarTag = document.getElementById('radar-example');
		const radarChart = new Chart(radarTag, radarConfig);

		const scatterTag = document.getElementById('scatter-example');
		const scatterChart = new Chart(scatterTag, scatterConfig);

		const barLineTag = document.getElementById('bar-line-example');
		const barLine = new Chart(barLineTag, barLineConfig);

		return () => {
			bubbleChart.destroy();
			donutChart.destroy();
			pieChart.destroy();
			polarAreaChart.destroy();
			radarChart.destroy();
			scatterChart.destroy();
			barLine.destroy();
		};
	}, []);

	return (
		<>
			<PageBreadcrumb title="Other Chartjs" subName="Chartjs" />

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Bubble</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="bubble-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">DONUT</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="donut-example"
										data-colors="#727cf5,#fa5c7c,#0acf97,#ebeff2"
									/>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Pie</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="pie-example"
										data-colors="#727cf5,#fa5c7c,#0acf97,#ebeff2, #f56f36"
									/>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Polar Area</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="polar-area-example"
										data-colors="#727cf5,#fa5c7c,#0acf97,#ebeff2, #f56f36"
									/>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Radar</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="radar-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Scatter</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="scatter-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Stacked Bar/Line</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="bar-line-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { OtherChartJs };
