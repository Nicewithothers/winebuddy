import { Component } from '@angular/core';
import { HlmFormFieldComponent } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { lucideKeyRound, lucideUser } from '@ng-icons/lucide';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
    HlmCardContentDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { loginForm } from '../../shared/forms/login.forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-login',
    imports: [
        HlmFormFieldComponent,
        HlmInputDirective,
        NgIcon,
        HlmIconDirective,
        HlmButtonDirective,
        ReactiveFormsModule,
        HlmCardDirective,
        HlmCardHeaderDirective,
        HlmCardTitleDirective,
        HlmCardContentDirective,
    ],
    providers: [
        provideIcons({ lucideUser, lucideKeyRound }),
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css',
    standalone: true,
})
export class LoginComponent {
    loginForm: FormGroup = loginForm();

    constructor(
        private router: Router,
        private authService: AuthService,
    ) {}

    login(): void {
        if (this.loginForm.invalid) {
            return;
        }

        this.authService.login(this.loginForm.value).subscribe(user => {
            if (user) {
                toast.success('Logged in successfully!', {
                    position: 'bottom-center',
                });
                this.authService.sessionHandler();
                this.router.navigate(['/']);
            } else {
                toast.error('Login failed, try again!', {
                    position: 'bottom-center',
                });
            }
        });
    }
}
