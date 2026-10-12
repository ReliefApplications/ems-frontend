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
 * as such, and offers to save the record anyway.
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
