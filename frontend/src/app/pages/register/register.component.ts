import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { lucideKeyRound, lucideMail, lucideUser } from '@ng-icons/lucide';
import { registerForm } from '../../shared/forms/register.form';
import { AuthService } from '../../shared/services/auth.service';
import { toast } from 'ngx-sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
    selector: 'app-register',
    imports: [
        NgIcon,
        ReactiveFormsModule,
        HlmCardImports,
        HlmIconImports,
        HlmFormFieldImports,
        HlmInputImports,
        HlmButtonImports,
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
