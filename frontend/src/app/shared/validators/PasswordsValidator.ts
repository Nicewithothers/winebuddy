import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordsValidator: ValidatorFn = (
    control: AbstractControl,
): ValidationErrors | null => {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const passwordConfirm = formGroup.get('passwordConfirm')?.value;

    return password === passwordConfirm ? null : { passwordMisMatch: true };
};
