import { FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordComparator(c: AbstractControl): ValidationErrors | null {
    if (!c.get('passw') || !c.get('passw2')) return null;

    return c.get('passw')?.value != c.get('passw2')?.value ?
        { mismatch: true } : null;
}

export function passwordValidator(c: AbstractControl): ValidationErrors | null {
    const CONTRA_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!c.value) return null;
    return c.value.match(CONTRA_REGEX) == null ? { invalidPassword: true } : null;
}

export function phoneValidator(c: AbstractControl): ValidationErrors | null {
    const CEL_REGEX = /^(2|8|9|3)\d{3}-?\d{4}$/;
    if (!c.value) return null;
    return c.value.match(CEL_REGEX) == null ? { invalidPhone: true } : null;
}
