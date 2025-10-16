import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toast } from 'ngx-sonner';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService,
    ) {}

    async canActivate() {
        const user = await firstValueFrom(this.authService.user$);
        if (user) {
            return true;
        }
        this.router.navigate(['/login']).then(() => {
            toast.error('You need to be logged in to access this page, please log in first!', {
                position: 'bottom-center',
            });
        });
        return false;
    }
}
