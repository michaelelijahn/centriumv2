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
                label: 'Admin',
                url: '/dashboard/admin',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'ds-trading',
                label: 'Trading',
                url: '/dashboard/trading',
                parentKey: 'dashboards',
                allowedRoles: ['admin'],
            },
            {
                key: 'apps-support',
                label: 'Help & Support',
                url: '/apps/support',
                parentKey: 'dashboards',
                allowedRoles: ['customer'],
            },
        ],
    },
];

export { MENU_ITEMS };
