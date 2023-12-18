import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

/**
 * Validator function that checks that, at most, one
 * of the specified controls in the form group has a value
 * if the trigger control send does have one
 *
 * @param opts Function options
 * @param opts.triggerField The field to check if fields to contain value should have it
 * @param opts.fieldsToContainValue The fields to contain value if trigger field does contain one
 * @returns A validator function.
 */
export const fieldsAreRequired =
  (opts: {
    triggerField: string;
    fieldsToContainValue: string[];
  }): ValidatorFn =>
  (formGroup: AbstractControl): ValidationErrors | null => {
    const { triggerField, fieldsToContainValue } = opts;
    if (!formGroup) {
      return null;
    }
    if (formGroup.get(triggerField)?.value) {
      const isThereAValidValue =
        fieldsToContainValue.filter((field) => formGroup.get(field)?.value)
          .length === 1;
      if (!isThereAValidValue) {
        return { fieldsAreRequired: fieldsToContainValue };
      }
    }
    // Otherwise, the validation passes
    return null;
  };
