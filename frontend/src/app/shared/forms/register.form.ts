import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordsValidator } from '../validators/PasswordsValidator';

export function registerForm() {
    return new FormGroup(
        {
            username: new FormControl('', [Validators.required, Validators.minLength(3)]),
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(3)]),
            passwordConfirm: new FormControl('', [Validators.required, Validators.minLength(3)]),
        },
        { validators: passwordsValidator },
    );
}
