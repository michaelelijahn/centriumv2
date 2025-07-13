import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const BasicElements = lazy(() => import('./BasicElements'));
const FormAdvanced = lazy(() => import('./FormAdvanced'));
const Validation = lazy(() => import('./Validation'));
const Wizard = lazy(() => import('./Wizard'));
const FileUploads = lazy(() => import('./FileUploads'));
const Editors = lazy(() => import('./Editors'));

export default function FormsUI() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="basic" element={<BasicElements />} />
				<Route path="advanced" element={<FormAdvanced />} />
				<Route path="validation" element={<Validation />} />
				<Route path="wizard" element={<Wizard />} />
				<Route path="upload" element={<FileUploads />} />
				<Route path="editors" element={<Editors />} />
			</Route>
		</Routes>
	);
}
