import { AbstractControl, ValidatorFn } from '@angular/forms';

export function matchPasswordValidator(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);

        // Return null if controls haven't been initialized yet
        if (!control || !matchingControl) {
            return null;
        }

        // Return null if matching
        if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
            return null;
        }

        // Set error if passwords don't match
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mismatch: true });
            return { mismatch: true };
        } else {
            matchingControl.setErrors(null);
            return null;
        }
    };
}