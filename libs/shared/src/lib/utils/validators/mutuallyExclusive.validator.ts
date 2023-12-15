import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * Validator function that checks that, at most, one
 * of the specified controls in the form group has a value
 *
 * @param opts Function options
 * @param opts.required Whether or not one of the fields must have a value
 * @param opts.fields The fields to check
 * @returns A validator function.
 */
export const mutuallyExclusive =
  (opts: { required?: boolean; fields: string[] }): ValidatorFn =>
  (formGroup: AbstractControl): ValidationErrors | null => {
    const { fields, required } = opts;
    if (!formGroup) {
      return null;
    }
    let count = 0;

    // Loop through all form controls in the fields array to check how many have a value
    for (const controlName of fields) {
      const control = formGroup.get(controlName);

      // Check if the control has a value
      if (control?.value) {
        count++;
      }
    }

    // If required and no control has a value, return the error
    if (required && count === 0) {
      return { required: fields };
    }

    // If more then one control has a value, return the error
    if (count > 1) {
      return { mutuallyExclusive: fields };
    }

    // Otherwise, the validation passes
    return null;
  };
