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
 * Builds the data of the errors modal for the validation errors returned
 * when saving a record. When they are all warnings, the modal offers to save
 * the record anyway instead of presenting them as a failure.
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
  errors,
  ...(areOnlyWarnings(errors) && {
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
  const errors = (Array.isArray(rows) ? rows : []).flatMap((row) =>
    (row[type] || []).map((violation) => ({
      ...violation,
      question: `${translate.instant('components.uniquenessRules.upload.row', {
        row: row.row,
      })} · ${violation.question}`,
    }))
  );
  if (!errors.length) {
    return null;
  }
  const prefix = `components.uniquenessRules.upload.${type}`;
  return {
    incrementalId: '',
    errors,
    title: translate.instant(`${prefix}.title`),
    subtitle: translate.instant(`${prefix}.subtitle`),
    help: '',
    questionHeader: translate.instant(
      'components.uniquenessRules.upload.rowHeader'
    ),
    hideConfirm: true,
  };
};
