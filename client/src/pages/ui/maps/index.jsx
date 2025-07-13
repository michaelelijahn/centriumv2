import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Google = lazy(() => import('./Google'));
const Vector = lazy(() => import('./Vector'));

export default function MapsUI() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="googlemaps" element={<Google />} />
				<Route path="vectormaps" element={<Vector />} />
			</Route>
		</Routes>
	);
}
