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

    const valid = cron.isValidCron(value, CRON_OPTIONS);

    if (!valid) {
      return { pattern: { value } };
    }

    // Exclude nonsense expressions like every 0 minutes/seconds
    const excludedExpressions = [
      '0 0/0 1/1 * *',
      '0/0 * 1/1 * *',
      '0 NaN 1/1 * *',
      '0 undefined * * MON-FRI',
      '0 undefined undefined 1/0 *',
      '0 NaN 1 undefined *',
    ];
    if (excludedExpressions.includes(value)) {
      return { pattern: { value } };
    }

    // Extra validation: disallow step values of 0 in any field
    const parts = value.trim().split(/\s+/);

    for (const part of parts) {
      if (part.includes('/')) {
        const [, step] = part.split('/');
        if (step === '0' || step === 'NaN' || step === 'undefined') {
          return { pattern: { value } };
        }
      }
    }

    // ✅ valid cron
    return null;
  };
