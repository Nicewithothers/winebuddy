import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { AsyncPipe } from '@angular/common';
import {
    HlmCardContentDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

@Component({
    selector: 'app-profile',
    imports: [
        HlmCardDirective,
        HlmCardContentDirective,
        HlmCardHeaderDirective,
        HlmCardTitleDirective,
        AsyncPipe,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
})
export class ProfileComponent {
    constructor(protected authService: AuthService) {}
}
