import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import AppMenu from './Menu';

// assets
import profileImg from '@/assets/images/users/avatar-1.jpg';
import { getMenuItems } from './utils/menu';
import { useAuthContext } from '@/common';
import { filterMenuItemsByRole } from './utils/filterMenuItemsByRole';

const UserBox = () => {
	return (
		<div className="leftbar-user">
			<Link to="/pages/profile">
				<img
					src={profileImg}
					alt="user-image"
					height="42"
					className="rounded-circle shadow-sm"
				/>
				<span className="leftbar-user-name mt-2">Dominic Keller</span>
			</Link>
		</div>
	);
};

const SideBarContent = () => {
    const { user } = useAuthContext();
    const userRole = user?.role;

    const filteredMenuItems = filterMenuItemsByRole(getMenuItems(), userRole);

    return (
        <>
            <UserBox />
            <AppMenu menuItems={filteredMenuItems} />
            <div className="clearfix" />
        </>
    );
};

const LeftSidebar = ({ isCondensed, leftbarDark }) => {
	const menuNodeRef = useRef(null);

	/**
	 * Handle the click anywhere in doc
	 */
	const handleOtherClick = (e) => {
		if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
		// else hide the menubar
		if (document.body) {
			document.body.classList.remove('sidebar-enable');
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleOtherClick, false);

		return () => {
			document.removeEventListener('mousedown', handleOtherClick, false);
		};
	}, []);

	return (
		<div className="leftside-menu" ref={menuNodeRef}>
			{!isCondensed && (
				<SimpleBar style={{ maxHeight: '100%' }} scrollbarMaxSize={320}>
					<SideBarContent />
				</SimpleBar>
			)}
			{isCondensed && <SideBarContent />}
		</div>
	);
};

export default LeftSidebar;