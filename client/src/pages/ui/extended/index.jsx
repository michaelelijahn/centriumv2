import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const DragNDrop = lazy(() => import('./DragNDrop'));
const Range = lazy(() => import('./Range'));
const Ratings = lazy(() => import('./Ratings'));
const Scrollbar = lazy(() => import('./Scrollbar'));

export default function BaseUI() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="dragdrop" element={<DragNDrop />} />
				<Route path="rangesliders" element={<Range />} />
				<Route path="ratings" element={<Ratings />} />
				<Route path="scrollbar" element={<Scrollbar />} />
			</Route>
		</Routes>
	);
}
