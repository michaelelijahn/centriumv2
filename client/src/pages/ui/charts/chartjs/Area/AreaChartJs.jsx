import { Card, Col, Row } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import { useEffect } from 'react';

import {
	boundariesConfig,
	datasetConfig,
	drawTimeConfig,
	stackedConfig,
	radarConfig,
} from './data';

import { PageBreadcrumb } from '@/components';

const AreaChartJs = () => {
	useEffect(() => {
		const boundariesTag = document.getElementById('boundaries-example');
		const boundariesChart = new Chart(boundariesTag, boundariesConfig);

		const datasetTag = document.getElementById('dataset-example');
		const datasetChart = new Chart(datasetTag, datasetConfig);

		const drawTimeTag = document.getElementById('draw-time-example');
		const drawTimeChart = new Chart(drawTimeTag, drawTimeConfig);

		const stackedTag = document.getElementById('stacked-example');
		const stackedChart = new Chart(stackedTag, stackedConfig);

		const radarTag = document.getElementById('radar-example');
		const radarChart = new Chart(radarTag, radarConfig);

		return () => {
			boundariesChart.destroy();
			datasetChart.destroy();
			drawTimeChart.destroy();
			stackedChart.destroy();
			radarChart.destroy();
		};
	}, []);

	return (
		<>
			<PageBreadcrumb title="Area Chartjs" subName="Chartjs" />

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Boundaries</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="boundaries-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Different Dataset</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas
										id="dataset-example"
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
							<h4 className="header-title mb-4">Draw Time</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="draw-time-example" data-colors="#727cf5,#0acf97" />
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
									<canvas
										id="stacked-example"
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
									<canvas
										id="radar-example"
										data-colors="#727cf5,#fa5c7c,#0acf97,#ebeff2, #f56f36"
									/>
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export { AreaChartJs };
