import { Component, OnInit } from '@angular/core';
import { HlmMenuBarComponent, HlmMenuBarItemDirective } from '@spartan-ng/ui-menu-helm';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { lucideLogIn, lucideUserRoundPen } from '@ng-icons/lucide';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
    selector: 'app-header',
    imports: [
        HlmMenuBarComponent,
        HlmMenuBarItemDirective,
        NgOptimizedImage,
        RouterLink,
        NgIcon,
        HlmIconDirective,
        NgIf,
    ],
    providers: [provideIcons({ lucideLogIn, lucideUserRoundPen })],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
})
export class HeaderComponent implements OnInit {
    user: User | null = null;
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.user = user;
                this.isLoggedIn = this.authService.isLoggedIn();
            }
        });
    }
}
