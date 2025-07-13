import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Accordions = lazy(() => import('./AccordionsUI'));
const Alerts = lazy(() => import('./AlertsUI'));
const Avatars = lazy(() => import('./AvatarsUI'));
const Badges = lazy(() => import('./BadgesUI'));
const Breadcrumb = lazy(() => import('./BreadcrumbUI'));
const Buttons = lazy(() => import('./ButtonsUI'));
const Cards = lazy(() => import('./CardsUI'));
const Carousel = lazy(() => import('./CarouselUI'));
const Dropdowns = lazy(() => import('./DropdownsUI'));
const Embed = lazy(() => import('./EmbedUI'));
const Grid = lazy(() => import('./GridUI'));
const ListGroup = lazy(() => import('./ListGroupUI'));
const Modals = lazy(() => import('./ModalsUI'));
const Notifications = lazy(() => import('./NotificationsUI'));
const Offcanvas = lazy(() => import('./OffcanvasUI'));
const Placeholders = lazy(() => import('./PlaceholdersUI'));
const Pagination = lazy(() => import('./PaginationUI'));
const Popover = lazy(() => import('./PopoverUI'));
const Progress = lazy(() => import('./ProgressUI'));
const Ribbons = lazy(() => import('./RibbonsUI'));
const Spinners = lazy(() => import('./SpinnersUI'));
const Tabs = lazy(() => import('./TabsUI'));
const Tooltips = lazy(() => import('./TooltipsUI'));
const Links = lazy(() => import('./LinksUI'));
const Typography = lazy(() => import('./TypographyUI'));
const Utilities = lazy(() => import('./UtilitiesUI'));

export default function BaseUI() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route path="accordions" element={<Accordions />} />
				<Route path="alerts" element={<Alerts />} />
				<Route path="avatars" element={<Avatars />} />
				<Route path="badges" element={<Badges />} />
				<Route path="breadcrumb" element={<Breadcrumb />} />
				<Route path="buttons" element={<Buttons />} />
				<Route path="cards" element={<Cards />} />
				<Route path="carousel" element={<Carousel />} />
				<Route path="dropdowns" element={<Dropdowns />} />
				<Route path="embed" element={<Embed />} />
				<Route path="grid" element={<Grid />} />
				<Route path="listgroups" element={<ListGroup />} />
				<Route path="modals" element={<Modals />} />
				<Route path="notifications" element={<Notifications />} />
				<Route path="offcanvas" element={<Offcanvas />} />
				<Route path="placeholders" element={<Placeholders />} />
				<Route path="pagination" element={<Pagination />} />
				<Route path="popovers" element={<Popover />} />
				<Route path="progress" element={<Progress />} />
				<Route path="ribbons" element={<Ribbons />} />
				<Route path="spinners" element={<Spinners />} />
				<Route path="tabs" element={<Tabs />} />
				<Route path="tooltips" element={<Tooltips />} />
				<Route path="links" element={<Links />} />
				<Route path="typography" element={<Typography />} />
				<Route path="utilities" element={<Utilities />} />
			</Route>
		</Routes>
	);
}
