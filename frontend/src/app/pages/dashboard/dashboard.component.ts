import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/User';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../shared/services/auth.service';
import { RouterLink } from '@angular/router';
import { NgClass, NgOptimizedImage, NgStyle } from '@angular/common';
import { DashboardItem, dashboardItems } from '../../shared/models/other/DashboardItem';
import { HlmTypographyImports } from '@spartan-ng/helm/typography';

@Component({
    selector: 'app-dashboard',
    imports: [RouterLink, NgClass, NgStyle, HlmTypographyImports, NgOptimizedImage],
    providers: [],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true,
})
export class DashboardComponent implements OnInit {
    user!: User;
    selectedBackground: DashboardItem | null = null;
    currentSelectedBackground: DashboardItem | null = null;
    carouselItems: DashboardItem[] = dashboardItems;

    constructor(protected authService: AuthService) {}

    ngOnInit(): void {
        firstValueFrom(this.authService.user$).then(user => {
            this.user = user;
        });
    }

    setActiveBackground(url: string | null): void {
        if (url) {
            for (const carouselItem of dashboardItems) {
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

    checkAccessibleItems(item: DashboardItem): boolean {
        if (this.user) {
            switch (item.route) {
                case '/vineyard-dashboard':
                    return true;
                case '/cellar-dashboard':
                    return !!this.user.vineyard;
                case '/barrel-dashboard':
                    return !!this.user.vineyard && this.user.vineyard!.cellars!.length > 0;
                case '/wine-dashboard':
                    return (
                        !!this.user.vineyard &&
                        this.user.vineyard!.cellars!.length > 0 &&
                        this.user.vineyard!.cellars!.some(
                            cellar => cellar.barrels && cellar.barrels!.length > 0,
                        )
                    );
                default:
                    return false;
            }
        }
        return false;
    }
}
