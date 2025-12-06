import { FormControl, FormGroup, Validators } from '@angular/forms';

export function wineForm() {
    return new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        grapeTypes: new FormControl('', [Validators.required]),
        quantity: new FormControl('', [Validators.required, Validators.max(50)]),
    });
}
