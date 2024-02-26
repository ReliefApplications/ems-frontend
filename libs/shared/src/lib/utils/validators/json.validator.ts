import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * Checks if the json string is valid, using JSON parser
 *
 * @returns null if the json is valid, otherwise returns a validation error
 */
export function JSONValidator(): ValidatorFn {
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
