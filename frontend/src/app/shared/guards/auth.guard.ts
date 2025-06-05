import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { toast } from 'ngx-sonner';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    return firstValueFrom(authService.user$).then(user => {
        if (user) {
            return true;
        } else {
            router.navigate(['/login']).then(() => {
                toast.error('You must be logged in to access this page.', {
                    position: 'bottom-center',
                });
            });
            return false;
        }
    });
};
