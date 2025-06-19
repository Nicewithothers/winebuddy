import { FormControl, FormGroup, Validators } from '@angular/forms';

export function vineyardForm() {
    return new FormGroup({
        name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    });
}
