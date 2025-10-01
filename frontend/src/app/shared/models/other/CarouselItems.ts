export interface CarouselItem {
    displayText: string;
    backgroundImage: string;
    route: string;
}

export const carouselItems: CarouselItem[] = [
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
