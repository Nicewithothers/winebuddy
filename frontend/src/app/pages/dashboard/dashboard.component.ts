import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/User';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { RouterLink } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';
import { CarouselItem, carouselItems } from '../../shared/models/other/CarouselItems';

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, NgClass, NgStyle],
    providers: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true,
})
export class DashboardComponent implements OnInit {
    user!: User;
    selectedBackground: CarouselItem | null = null;
    currentSelectedBackground: CarouselItem | null = null;
    carouselItems: CarouselItem[] = carouselItems;

    constructor(protected authService: AuthService) {}

    ngOnInit(): void {
        firstValueFrom(this.authService.user$).then(user => {
            this.user = user;
        });
    }

    setActiveBackground(url: string | null): void {
        if (url) {
            for (const carouselItem of carouselItems) {
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
                case '/wine-dashboard':
                    return !!this.user.vineyard &&
                        this.user.vineyard!.cellars!.length > 0 &&
                        this.user.vineyard!.cellars!.some(cellar => cellar.barrels && cellar.barrels!.length > 0);
                default:
                    return false;
            }
        }
        return false;
    }
}
