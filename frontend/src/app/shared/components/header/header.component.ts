import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    HlmMenuBarComponent,
    HlmMenuBarItemDirective,
    HlmMenuComponent,
    HlmMenuItemDirective,
} from '@spartan-ng/ui-menu-helm';
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import {
    lucideLayoutGrid,
    lucideLogIn,
    lucideLogOut,
    lucideSettings,
    lucideUserRoundPen,
} from '@ng-icons/lucide';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { HlmAvatarComponent, HlmAvatarImageDirective } from '@spartan-ng/ui-avatar-helm';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';

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
            lucideSettings,
            lucideLogOut,
        }),
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: true,
})
export class HeaderComponent implements OnInit {
    user!: Observable<User | null>;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.user = this.authService.currentUser$;
    }

    signOut() {
        this.authService.logout();
    }
}
