import { MENU_ITEMS } from '@/common/menu-items';

const getMenuItems = () => {
	return MENU_ITEMS;
};

const findAllParent = (menuItems, menuItem) => {
	let parents = [];
	const parent = findMenuItem(menuItems, menuItem['parentKey']);

	if (parent) {
		parents.push(parent['key']);
		if (parent['parentKey']) parents = [...parents, ...findAllParent(menuItems, parent)];
	}
	return parents;
};

const findMenuItem = (menuItems, menuItemKey) => {
	if (menuItems && menuItemKey) {
		for (let i = 0; i < menuItems.length; i++) {
			if (menuItems[i].key === menuItemKey) {
				return menuItems[i];
			}
			const found = findMenuItem(menuItems[i].children, menuItemKey);
			if (found) return found;
		}
	}
	return null;
};

export { getMenuItems, findAllParent, findMenuItem };
