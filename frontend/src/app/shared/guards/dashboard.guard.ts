import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';

@Injectable({
    providedIn: 'root',
})
export class DashboardGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        const user = await firstValueFrom(this.authService.user$);
        let isEligible: boolean = false;
        if (user) {
            switch (state.url) {
                case '/vineyard-dashboard':
                    isEligible = true;
                    break;
                case '/cellar-dashboard':
                    !!user.vineyard ? (isEligible = true) : (isEligible = false);
                    break;
                case '/barrel-dashboard':
                    !!user.vineyard && user.vineyard!.cellars!.length > 0
                        ? (isEligible = true)
                        : (isEligible = false);
                    break;
                case '/wine-dashboard':
                    !!user.vineyard && user.vineyard!.cellars!.length > 0
                        ? (isEligible = true)
                        : (isEligible = false);
                    break;
                default:
                    isEligible = false;
                    break;
            }
            if (isEligible) {
                return true;
            } else {
                this.router.navigate(['/dashboard']).then(() => {
                    toast.error('This route is closed until requirements met.', {
                        position: 'bottom-center',
                    });
                });
            }
        }
        return false;
    }
}
