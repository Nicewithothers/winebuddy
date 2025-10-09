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
        this.authService.register(this.registerForm.value).subscribe(user => {
            if (user) {
                this.router.navigate(['/login']).then(() => {
                    toast.success('Registered successfully!', {
                        position: 'bottom-center',
                    });
                });
            } else {
                toast.error('Registration failed, try again!', {
                    position: 'bottom-center',
                });
            }
        });
    }
}
