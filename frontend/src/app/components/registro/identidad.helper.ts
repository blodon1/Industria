import { AbstractControl, ValidationErrors } from "@angular/forms";

export function identidadValidator(c: AbstractControl): ValidationErrors | null {
    const ID_REGEX = /^[0-9]+$/;
    if (!c.value) return null;
    return c.value.match(ID_REGEX) == null ? { invalidPassword: true } : null;
}