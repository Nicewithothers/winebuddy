import { FormControl, FormGroup, Validators } from '@angular/forms';

export function barrelForm() {
    return new FormGroup({
        maxVolume: new FormControl('', [Validators.required, Validators.min(0)]),
    });
}
