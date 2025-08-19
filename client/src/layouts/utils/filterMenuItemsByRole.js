// Utility to filter menu items by user role
export function filterMenuItemsByRole(menuItems, userRole) {
    const filteredMenuItems = [];

    menuItems.forEach(item => {
        // Always include title items
        if (item.isTitle) {
            filteredMenuItems.push(item);
            return;
        }

        // For items with children, filter recursively
        if (item.children) {
            const filteredChildren = filterChildrenByRole(item.children, userRole);
            
            // Only include the parent if it has at least one accessible child
            if (filteredChildren.length > 0) {
                filteredMenuItems.push({ ...item, children: filteredChildren });
            }
        } else {
            // For leaf items, check if user has access
            if (!item.allowedRoles || item.allowedRoles.includes(userRole)) {
                const { badge, ...rest } = item;
                filteredMenuItems.push(rest);
            }
        }
    });

    return filteredMenuItems;
}

// Helper function to recursively filter children
function filterChildrenByRole(children, userRole) {
    const filteredChildren = [];

    children.forEach(child => {
        if (child.children) {
            // Recursively filter nested children
            const nestedChildren = filterChildrenByRole(child.children, userRole);
            if (nestedChildren.length > 0) {
                filteredChildren.push({ ...child, children: nestedChildren });
            }
        } else {
            // Check if user has access to this child item
            if (!child.allowedRoles || child.allowedRoles.includes(userRole)) {
                const { badge, ...rest } = child;
                filteredChildren.push(rest);
            }
        }
    });

    return filteredChildren;
} 