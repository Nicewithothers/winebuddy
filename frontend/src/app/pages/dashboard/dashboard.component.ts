import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/User';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass, NgStyle } from '@angular/common';
import { CarouselItem } from '../../shared/models/other/CarouselItems';

@Component({
    selector: 'app-dashboard',
    imports: [AsyncPipe, RouterLink, NgClass, NgStyle],
    providers: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true,
})
export class DashboardComponent implements OnInit {
    user!: User;
    selectedBackground: CarouselItem | null = null;
    currentSelectedBackground: CarouselItem | null = null;

    constructor(
        protected authService: AuthService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        firstValueFrom(this.authService.user$).then(user => {
            this.user = user;
        });
    }

    carouselItems: CarouselItem[] = [
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

    setActiveBackground(url: string | null): void {
        if (url) {
            for (const carouselItem of this.carouselItems) {
                if (url === carouselItem.backgroundImage) {
                    this.selectedBackground = carouselItem;
                    this.currentSelectedBackground = carouselItem;
                }
            }
        } else {
            this.selectedBackground = null;
            setTimeout(() => {
                if (!this.selectedBackground) {
                    this.currentSelectedBackground = null;
                }
            }, 500);
        }
    }

    checkAccessibleItems(item: CarouselItem): boolean {
        if (this.user) {
            switch (item.route) {
                case '/vineyard-dashboard':
                    return true;
                case '/cellar-dashboard':
                    return !!this.user.vineyard;
                case '/barrel-dashboard':
                    return !!this.user.vineyard && this.user.vineyard!.cellars!.length > 0;
                default:
                    return false;
            }
        }
        return false;
    }
}
