import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as cron from 'cron-validator';

/** Default cron validator options */
const CRON_OPTIONS = {
  alias: true,
};

/**
 * Validate cron pattern.
 *
 * @returns validation errors
 */
export const cronValidator =
  (): ValidatorFn =>
  (control: AbstractControl): ValidationErrors | null => {
    const valid = control.value
      ? cron.isValidCron(control.value, CRON_OPTIONS)
      : false;

    // Exclude specific cron expressions
    const excludedExpressions = [
      '0 0/0 1/1 * *',
      '0/0 * 1/1 * *',
      '0 NaN 1/1 * *',
      '0 undefined * * MON-FRI',
      '0 undefined undefined 1/0 *',
      '0 NaN 1 undefined *',
    ];
    if (excludedExpressions.includes(control.value)) {
      return { pattern: { value: control.value } };
    }

    return valid ? null : { pattern: { value: control.value } };
  };
