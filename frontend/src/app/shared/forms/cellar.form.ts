import { FormControl, FormGroup, Validators } from '@angular/forms';

export function cellarForm() {
    return new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
        capacity: new FormControl('', [Validators.required, Validators.min(0)]),
    });
}
