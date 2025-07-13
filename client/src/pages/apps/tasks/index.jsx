import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const List = lazy(() => import('./List'));
const Details = lazy(() => import('./Details'));
const Kanban = lazy(() => import('./Kanban'));

export default function Dashboard() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="list" element={<List />} />1
				<Route path="details" element={<Details />} />
				<Route path="kanban" element={<Kanban />} />
			</Route>
		</Routes>
	);
}
