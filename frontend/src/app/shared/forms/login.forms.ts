import { FormControl, FormGroup, Validators } from '@angular/forms';

export function loginForm() {
    return new FormGroup({
        username: new FormControl('', [Validators.required, Validators.minLength(3)]),
        password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
}
