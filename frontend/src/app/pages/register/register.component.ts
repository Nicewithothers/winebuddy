import { Component } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmFormFieldComponent } from '@spartan-ng/ui-formfield-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lucideKeyRound, lucideMail, lucideUser } from '@ng-icons/lucide';
import {
    HlmCardContentDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { RegisterRequest } from '../../shared/models/register-request';
import { registerForm } from '../../shared/forms/register.form';
import { AuthService } from '../../shared/services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
    selector: 'app-register',
    imports: [
        HlmButtonDirective,
        HlmFormFieldComponent,
        HlmIconDirective,
        HlmInputDirective,
        NgIcon,
        ReactiveFormsModule,
        HlmCardDirective,
        HlmCardHeaderDirective,
        HlmCardTitleDirective,
        HlmCardContentDirective,
    ],
    providers: [provideIcons({ lucideUser, lucideKeyRound, lucideMail })],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    standalone: true,
})
export class RegisterComponent {
    registerForm: FormGroup = registerForm();

    constructor(
        private router: Router,
        private authService: AuthService,
    ) {}

    register(): void {
        if (this.registerForm.invalid) {
            return;
        }

        const registerData: RegisterRequest = {
            username: this.registerForm.get('username')?.value,
            email: this.registerForm.get('email')?.value,
            password: this.registerForm.get('password')?.value,
        };

        this.authService.register(registerData).subscribe(user => {
            if (user) {
                toast.success('Registered successfully, you can now log in!', {
                    position: 'bottom-center',
                });
                this.router.navigate(['/login']);
            } else {
                toast.error('Register failed, try again!', {
                    position: 'bottom-center',
                });
            }
        });
    }
}
