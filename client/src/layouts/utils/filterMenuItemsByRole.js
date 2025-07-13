// Utility to filter menu items by user role
export function filterMenuItemsByRole(menuItems, userRole) {
    const navigationTitle = menuItems.find(item => item.key === 'navigation');
    const dashboards = menuItems.find(item => item.key === 'dashboards');

    // Filter dashboards children by allowedRoles and remove 'badge' property
    let dashboardsChildren = [];
    if (dashboards && dashboards.children) {
        dashboardsChildren = dashboards.children.filter(child => {
            if (!child.allowedRoles) return true;
            return child.allowedRoles.includes(userRole);
        }).map(child => {
            const { badge, ...rest } = child;
            return rest;
        });
    }

    // Build the filtered menu
    const filteredMenuItems = [];
    if (navigationTitle) filteredMenuItems.push(navigationTitle);
    if (dashboards) filteredMenuItems.push({ ...dashboards, children: dashboardsChildren });

    return filteredMenuItems;
} 