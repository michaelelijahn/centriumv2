import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Projects = lazy(() => import('./Projects'));
const Orders = lazy(() => import('./Orders'));
const Client = lazy(() => import('./Client'));
const Management = lazy(() => import('./Management'));

export default function Dashboard() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="projects" element={<Projects />} />
				<Route path="orders" element={<Orders />} />
				<Route path="clients" element={<Client />} />
				<Route path="management" element={<Management />} />
			</Route>
		</Routes>
	);
}
