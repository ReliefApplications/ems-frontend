import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as cron from 'cron-validator';

/**
 * Validate cron pattern.
 *
 * @returns validation errors
 */
export const cronValidator =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const valid = control.value ? cron.isValidCron(control.value) : false;
    return valid ? null : { pattern: { value: control.value } };
  };
