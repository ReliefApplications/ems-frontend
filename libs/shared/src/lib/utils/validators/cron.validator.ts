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
    const value = control.value;

    if (!value) {
      return { pattern: { value } };
    }

    if (!cron.isValidCron(value, CRON_OPTIONS)) {
      return { pattern: { value } };
    }

    return null;
  };
