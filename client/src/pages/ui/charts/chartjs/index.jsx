import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Area = lazy(() => import('./Area'));
const Bar = lazy(() => import('./Bar'));
const Line = lazy(() => import('./Line'));
const Other = lazy(() => import('./Other'));

export default function BaseUI() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="area" element={<Area />} />
				<Route path="bar" element={<Bar />} />
				<Route path="line" element={<Line />} />
				<Route path="other" element={<Other />} />
			</Route>
		</Routes>
	);
}
