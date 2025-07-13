import { Card, Col, Row } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import { useEffect } from 'react';
import {
	borderRadiusConfig,
	floatingConfig,
	horizontalConfig,
	stackedConfig,
	groupStackConfig,
	verticalConfig,
} from './data';

import { PageBreadcrumb } from '@/components';

const BarChartJs = () => {
	useEffect(() => {
		const borderRadiusTag = document.getElementById('border-radius-example');
		const borderRadiusChart = new Chart(borderRadiusTag, borderRadiusConfig);

		const floatingTag = document.getElementById('floating-example');
		const floatingChart = new Chart(floatingTag, floatingConfig);

		const horizontalTag = document.getElementById('horizontal-example');
		const horizontalChart = new Chart(horizontalTag, horizontalConfig);

		const stackedTag = document.getElementById('stacked-example');
		const stackedChart = new Chart(stackedTag, stackedConfig);

		const groupStackTag = document.getElementById('group-stack-example');
		const groupStackChart = new Chart(groupStackTag, groupStackConfig);

		const verticalTag = document.getElementById('vertical-example');
		const verticalChart = new Chart(verticalTag, verticalConfig);

		return () => {
			borderRadiusChart.destroy();
			floatingChart.destroy();
			horizontalChart.destroy();
			stackedChart.destroy();
			groupStackChart.destroy();
			verticalChart.destroy();
		};
	});

	return (
		<>
			<PageBreadcrumb title="Bar Chartjs" subName="Chartjs" />

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Border Radius</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="border-radius-example"
										data-colors="#727cf5,#0acf97"
									/>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Floating</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="floating-example" data-colors="#727cf5,#0acf97" />
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
							<h4 className="header-title mb-4">Horizontal</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="horizontal-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Stacked</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="stacked-example" data-colors="#727cf5,#0acf97" />
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
							<h4 className="header-title mb-4">Stacked with Groups</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="group-stack-example"
										data-colors="#727cf5,#0acf97"
									/>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Vertical</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="vertical-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { BarChartJs };
