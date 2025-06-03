import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { toast } from 'ngx-sonner';

export const authGuard: CanActivateFn = async (route, state) => {
    const router = inject(Router);
    const token = sessionStorage.getItem('token') as string;
    if (token) {
        return true;
    } else {
        toast.error('You cannot access this page unless you log in!', {
            position: 'bottom-center',
        });
        await router.navigate(['/login']);
        return false;
    }
};
