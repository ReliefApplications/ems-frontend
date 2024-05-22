import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ReferenceData } from '../../models/reference-data.model';

/**
 * Checks if array of reference data fetched fields contains the field (current control value)
 *
 * @param fields array the all the available fields
 * @returns null if the field is available, otherwise returns a validation error
 */
export function containsFieldsValidator(
  fields: NonNullable<ReferenceData['fields']>
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // if there is no value, it should be valid
      return null;
    }
    const hasField = fields.some((field) => field.name === control.value.name);
    return hasField ? null : { invalidField: true };
  };
}
