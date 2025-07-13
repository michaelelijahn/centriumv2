const MENU_ITEMS = [
    {
        key: 'navigation',
        label: 'Navigation',
        isTitle: true,
    },
    {
        key: 'dashboards',
        label: 'Dashboards',
        isTitle: false,
        icon: 'uil-home-alt',
        children: [
            {
                key: 'ds-ecommerce',
                label: 'Ecommerce',
                url: '/dashboard/ecommerce',
                parentKey: 'dashboards',
                allowedRoles: ['admin', 'customer'],
            },
            {
                key: 'ds-admin',
                label: 'Admin Dashboard',
                url: '/dashboard/admin',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'ds-admin-ecommerce',
                label: 'Admin Ecommerce',
                url: '/dashboard/admin/ecommerce',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'ds-admin-trading',
                label: 'Admin Trading',
                url: '/dashboard/admin/trading',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'ds-admin-tickets',
                label: 'Admin Tickets',
                url: '/dashboard/admin/tickets',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'ds-admin-users',
                label: 'Admin Users',
                url: '/dashboard/admin/users',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'ds-support',
                label: 'Help & Support',
                url: '/dashboard/support',
                parentKey: 'dashboards',
                allowedRoles: ['customer'],
            },
        ],
    },
];

export { MENU_ITEMS };
