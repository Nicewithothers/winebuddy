import { FormControl, FormGroup, Validators } from '@angular/forms';

export function cellarForm() {
    return new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(6)]),
        capacity: new FormControl('', [
            Validators.required,
            Validators.maxLength(Number.MAX_VALUE),
        ]),
    });
}
