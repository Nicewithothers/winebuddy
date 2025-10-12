import { Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { lucideKeyRound, lucideUser } from '@ng-icons/lucide';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { loginForm } from '../../shared/forms/login.forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
    selector: 'app-login',
    imports: [
        NgIcon,
        ReactiveFormsModule,
        HlmCardImports,
        HlmIconImports,
        HlmFormFieldImports,
        HlmInputImports,
        HlmButtonImports,
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
        this.authService.login(this.loginForm.value).subscribe(user => {
            if (user) {
                this.router.navigate(['/']).then(() => {
                    toast.success('Logged in successfully!', {
                        position: 'bottom-center',
                    });
                });
            } else {
                toast.error('Login failed, try again!', {
                    position: 'bottom-center',
                });
            }
        });
    }
}
