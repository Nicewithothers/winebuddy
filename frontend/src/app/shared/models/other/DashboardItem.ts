export interface DashboardItem {
    displayText: string;
    backgroundImage: string;
    route: string;
}

export const dashboardItems: DashboardItem[] = [
    {
        displayText: 'Vineyard Dashboard',
        backgroundImage: '/images/dashboard/vineyard.png',
        route: '/vineyard-dashboard',
    },
    {
        displayText: 'Cellar Dashboard',
        backgroundImage: '/images/dashboard/cellar.png',
        route: '/cellar-dashboard',
    },
    {
        displayText: 'Grapevine Dashboard',
        backgroundImage: '/images/dashboard/grapevine.png',
        route: '/grapevine-dashboard',
    },
    {
        displayText: 'Barrel Dashboard',
        backgroundImage: '/images/dashboard/barrel.png',
        route: '/barrel-dashboard',
    },
    {
        displayText: 'Wine Dashboard',
        backgroundImage: '/images/dashboard/wine.png',
        route: '/wine-dashboard',
    },
];
