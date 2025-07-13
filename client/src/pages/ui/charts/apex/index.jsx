import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Area = lazy(() => import('./Area'));
const Bar = lazy(() => import('./Bar'));
const Bubble = lazy(() => import('./Bubble'));
const Candlestick = lazy(() => import('./Candlestick'));
const Column = lazy(() => import('./Column'));
const Heatmap = lazy(() => import('./Heatmap'));
const Line = lazy(() => import('./Line'));
const Mixed = lazy(() => import('./Mixed'));
const Timeline = lazy(() => import('./Timeline'));
const Boxplot = lazy(() => import('./Boxplot'));
const Treemap = lazy(() => import('./Treemap'));
const Pie = lazy(() => import('./Pie'));
const Radar = lazy(() => import('./Radar'));
const Radialbar = lazy(() => import('./Radialbar'));
const Scatter = lazy(() => import('./Scatter'));
const PolarArea = lazy(() => import('./PolarArea'));
const Sparklines = lazy(() => import('./Sparklines'));

export default function BaseUI() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="area" element={<Area />} />
				<Route path="bar" element={<Bar />} />
				<Route path="bubble" element={<Bubble />} />
				<Route path="candlestick" element={<Candlestick />} />
				<Route path="column" element={<Column />} />
				<Route path="heatmap" element={<Heatmap />} />
				<Route path="line" element={<Line />} />
				<Route path="mixed" element={<Mixed />} />
				<Route path="timeline" element={<Timeline />} />
				<Route path="boxplot" element={<Boxplot />} />
				<Route path="treemap" element={<Treemap />} />
				<Route path="pie" element={<Pie />} />
				<Route path="radar" element={<Radar />} />
				<Route path="radialbar" element={<Radialbar />} />
				<Route path="scatter" element={<Scatter />} />
				<Route path="polararea" element={<PolarArea />} />
				<Route path="sparklines" element={<Sparklines />} />
			</Route>
		</Routes>
	);
}
