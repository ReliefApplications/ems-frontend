import { TranslateService } from '@ngx-translate/core';
import { ValidationError } from '../models/record.model';
import type { ErrorsModalData } from '../components/ui/core-grid/errors-modal/errors-modal.component';

/** Rows of an uploaded file reported by the back-end, with their violations */
export interface UploadReportRow {
  row: number;
  errors?: ValidationError[];
  warnings?: ValidationError[];
}

/**
 * Whether the validation errors returned when saving a record are all
 * warnings ( e.g. uniqueness rules with a 'warning' severity ), which the user
 * can choose to ignore, saving the record anyway.
 *
 * @param errors validation errors returned by the back-end
 * @returns true if the record can be saved despite the errors
 */
export const areOnlyWarnings = (errors?: ValidationError[] | null): boolean =>
  !!errors?.length && errors.every((error) => error.severity === 'warning');

/**
 * Whether the validation errors are all blocking uniqueness violations, which
 * are the only errors with an 'error' severity: survey validation errors have
 * no severity.
 *
 * @param errors validation errors
 * @returns true if the errors are all blocking uniqueness violations
 */
export const areUniquenessErrors = (
  errors?: ValidationError[] | null
): boolean =>
  !!errors?.length && errors.every((error) => error.severity === 'error');

/**
 * Code of the GraphQL errors thrown by the back-end when a record violates
 * blocking uniqueness rules
 */
export const UNIQUENESS_ERROR_CODE = 'UNIQUENESS_RULE_VIOLATED';

/**
 * Extracts the blocking uniqueness violations from the errors of a record
 * mutation, if any. The back-end rejects the record with an error listing the
 * violated rules in its extensions, so they can be displayed as warnings are,
 * for the user to fix the record.
 *
 * @param errors errors returned by the mutation
 * @returns the violations, as validation errors
 */
export const getUniquenessViolations = (
  errors?:
    | readonly { message?: string; extensions?: Record<string, any> }[]
    | null
): ValidationError[] =>
  (errors || []).flatMap((error) =>
    error?.extensions?.['code'] === UNIQUENESS_ERROR_CODE &&
    Array.isArray(error.extensions['violations'])
      ? error.extensions['violations'].map((violation: ValidationError) => ({
          ...violation,
          severity: 'error' as const,
        }))
      : []
  );

/** Displayed instead of the field, for errors which are not about a field */
const NO_FIELD = '-';

/**
 * Formats validation errors for the errors modal, which lists them by field.
 * Uniqueness rules are not about a single field: their name is not displayed
 * as if it was one.
 *
 * @param errors validation errors returned by the back-end
 * @returns errors to display
 */
export const toDisplayedErrors = (
  errors?: ValidationError[] | null
): ValidationError[] =>
  (errors || []).map((error) =>
    error.severity ? { ...error, question: NO_FIELD } : error
  );

/**
 * Builds the data of the errors modal for the validation errors returned
 * when saving a record. When they are all warnings, the modal presents them
 * as such, and offers to save the record anyway. When they are all blocking
 * uniqueness violations, the modal explains the record was not saved: the
 * user can only fix it and save it again.
 *
 * @param errors validation errors returned by the back-end
 * @param incrementalId incremental id of the record, if any
 * @param translate Angular translate service
 * @returns data of the errors modal
 */
export const getValidationModalData = (
  errors: ValidationError[],
  incrementalId: string,
  translate: TranslateService
): ErrorsModalData => ({
  incrementalId,
  errors: toDisplayedErrors(errors),
  ...(areUniquenessErrors(errors) && {
    title: translate.instant('components.uniquenessRules.blocked.title'),
    subtitle: translate.instant('components.uniquenessRules.blocked.subtitle'),
    help: '',
    hideConfirm: true,
  }),
  ...(areOnlyWarnings(errors) && {
    severity: 'warning',
    title: translate.instant('components.widget.grid.validation.warningTitle'),
    subtitle: translate.instant(
      'components.widget.grid.validation.warningSubtitle'
    ),
    help: translate.instant('components.widget.grid.validation.warningHelp'),
    confirmText: translate.instant(
      'components.widget.grid.validation.saveAnyway'
    ),
  }),
});

/**
 * Builds the data of the errors modal for the rows of an uploaded file
 * violating uniqueness rules: either errors, when the file was rejected, or
 * warnings, when it was imported anyway.
 *
 * @param rows rows reported by the back-end
 * @param type whether the rows carry errors or warnings
 * @param translate Angular translate service
 * @returns data of the errors modal, or null if there is nothing to report
 */
export const getUploadReportModalData = (
  rows: UploadReportRow[] | undefined | null,
  type: 'errors' | 'warnings',
  translate: TranslateService
): ErrorsModalData | null => {
  // One line per row, with all its messages
  const errors = (Array.isArray(rows) ? rows : [])
    .map((row) => ({
      question: translate.instant('components.uniquenessRules.upload.row', {
        row: row.row,
      }),
      errors: (row[type] || []).flatMap((violation) => violation.errors),
    }))
    .filter((row) => row.errors.length);
  if (!errors.length) {
    return null;
  }
  const prefix = `components.uniquenessRules.upload.${type}`;
  return {
    incrementalId: '',
    errors,
    severity: type === 'warnings' ? 'warning' : 'error',
    title: translate.instant(`${prefix}.title`),
    subtitle: translate.instant(`${prefix}.subtitle`),
    help: '',
    questionHeader: translate.instant(
      'components.uniquenessRules.upload.rowHeader'
    ),
    hideConfirm: true,
  };
};
