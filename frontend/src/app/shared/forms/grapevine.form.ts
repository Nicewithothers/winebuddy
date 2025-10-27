import { FormControl, FormGroup, Validators } from '@angular/forms';

export function grapevineForm() {
    return new FormGroup({
        grapeType: new FormControl('', [Validators.required]),
    });
}
