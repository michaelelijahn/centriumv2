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
                key: 'ecommerce',
                label: 'Ecommerce',
                url: '/dashboard/ecommerce',
                parentKey: 'dashboards',
                allowedRoles: ['admin', 'customer'],
            },
            {
                key: 'tickets',
                label: 'Tickets',
                url: '/dashboard/tickets',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'trade',
                label: 'Trades',
                url: '/dashboard/trades',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'users',
                label: 'Users',
                url: '/dashboard/users',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'support',
                label: 'Help & Support',
                url: '/dashboard/support',
                parentKey: 'dashboards',
                allowedRoles: ['customer'],
            },
        ],
    },
];

export { MENU_ITEMS };
