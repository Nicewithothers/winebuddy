import { FormControl, FormGroup, Validators } from '@angular/forms';

export function barrelForm() {
    return new FormGroup({
        barrelType: new FormControl('', [Validators.required]),
        barrelSize: new FormControl('', [Validators.required]),
        maxVolume: new FormControl('', [Validators.required]),
    });
}
