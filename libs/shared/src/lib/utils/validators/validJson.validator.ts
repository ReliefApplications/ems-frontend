import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * Checks if the json string is valid
 *
 * @returns null if the json is valid, object otherwise
 */
export function validJson(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // if there is no value, it should be valid
      return null;
    }
    try {
      JSON.parse(control.value);
    } catch {
      return { invalidJSON: true };
    }
    return null;
  };
}
