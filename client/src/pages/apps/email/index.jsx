import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Inbox = lazy(() => import('./Inbox'));
const Read = lazy(() => import('./Read'));

export default function Dashboard() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="inbox" element={<Inbox />} />
				<Route path="read" element={<Read />} />
			</Route>
		</Routes>
	);
}
