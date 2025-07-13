import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Basic = lazy(() => import('./Basic'));
const Advanced = lazy(() => import('./Advanced'));

export default function BaseUI() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="basic" element={<Basic />} />
				<Route path="advanced" element={<Advanced />} />
			</Route>
		</Routes>
	);
}
