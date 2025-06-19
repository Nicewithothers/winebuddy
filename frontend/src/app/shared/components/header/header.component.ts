import { Component, OnInit } from '@angular/core';
import {
    HlmMenuBarComponent,
    HlmMenuBarItemDirective,
    HlmMenuComponent,
    HlmMenuItemDirective,
} from '@spartan-ng/ui-menu-helm';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import {
    lucideCircleUserRound,
    lucideLayoutGrid,
    lucideLogIn,
    lucideLogOut,
    lucideUserRoundPen,
} from '@ng-icons/lucide';
import { AuthService } from '../../services/auth.service';
import { HlmAvatarComponent, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import { User } from '../../models/User';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-header',
    imports: [
        HlmMenuBarComponent,
        HlmMenuBarItemDirective,
        NgOptimizedImage,
        RouterLink,
        NgIcon,
        HlmIconDirective,
        AsyncPipe,
        HlmAvatarComponent,
        HlmAvatarImageDirective,
        BrnMenuTriggerDirective,
        HlmMenuItemDirective,
        HlmMenuComponent,
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
export class HeaderComponent implements OnInit {
    user!: User;

    constructor(protected authService: AuthService) {}

    ngOnInit() {
        firstValueFrom(this.authService.user$).then(user => {
            this.user = user;
        });
    }

    signOut(): void {
        this.authService.logout();
    }
}
