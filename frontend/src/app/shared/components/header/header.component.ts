import { Component } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideCircleUserRound,
    lucideLayoutGrid,
    lucideLogIn,
    lucideLogOut,
    lucideUserRoundPen,
} from '@ng-icons/lucide';
import { AuthService } from '../../services/auth.service';
import { BrnMenuImports } from '@spartan-ng/brain/menu';
import { HlmMenuImports } from '@spartan-ng/helm/menu';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-header',
    imports: [
        NgOptimizedImage,
        RouterLink,
        NgIcon,
        AsyncPipe,
        HlmMenuImports,
        HlmAvatarImports,
        BrnMenuImports,
        HlmIconImports,
    ],
    providers: [
        provideIcons({
            lucideLogIn,
            lucideUserRoundPen,
            lucideLayoutGrid,
            lucideCircleUserRound,
            lucideLogOut,
        }),
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
})
export class HeaderComponent {
    constructor(
        protected authService: AuthService,
        private router: Router,
    ) {}

    signOut(): void {
        this.authService.logout().subscribe(() => {
            this.router.navigate(['/']).then(() => {
                toast.success('Logged out successfully!', {
                    position: 'bottom-center',
                });
            });
        });
    }
}
