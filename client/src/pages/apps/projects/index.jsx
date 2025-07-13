import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const List = lazy(() => import('./List'));
const Details = lazy(() => import('./Details'));
const Gantt = lazy(() => import('./Gantt'));
const Create = lazy(() => import('./Create'));

export default function Dashboard() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="list" element={<List />} />
				<Route path="details" element={<Details />} />
				<Route path="gantt" element={<Gantt />} />
				<Route path="create" element={<Create />} />
			</Route>
		</Routes>
	);
}
