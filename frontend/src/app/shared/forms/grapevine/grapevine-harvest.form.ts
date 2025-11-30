import { FormControl, FormGroup, Validators } from '@angular/forms';

export function grapevineHarvestForm() {
    return new FormGroup({
        cellarName: new FormControl('', [Validators.required]),
    });
}
