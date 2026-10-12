import { TranslateService } from '@ngx-translate/core';
import {
  areOnlyWarnings,
  getUploadReportModalData,
  getValidationModalData,
  toDisplayedErrors,
} from './validation-errors.util';

/** Translate service stub, returning the key and its parameters */
const translate = {
  instant: (key: string, params?: any) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
} as unknown as TranslateService;

describe('validation errors utils', () => {
  describe('areOnlyWarnings', () => {
    it('returns true when all the errors are warnings', () => {
      expect(
        areOnlyWarnings([
          { question: 'a', errors: ['x'], severity: 'warning' },
          { question: 'b', errors: ['y'], severity: 'warning' },
        ])
      ).toBe(true);
    });

    it('returns false when an error has another, or no, severity', () => {
      expect(
        areOnlyWarnings([
          { question: 'a', errors: ['x'], severity: 'warning' },
          { question: 'b', errors: ['y'] },
        ])
      ).toBe(false);
      expect(
        areOnlyWarnings([{ question: 'a', errors: ['x'], severity: 'error' }])
      ).toBe(false);
    });

    it('returns false when there is no error', () => {
      expect(areOnlyWarnings([])).toBe(false);
      expect(areOnlyWarnings(undefined)).toBe(false);
    });
  });

  describe('toDisplayedErrors', () => {
    it('does not display the name of uniqueness rules as a field', () => {
      expect(
        toDisplayedErrors([
          { question: 'name', errors: ['Required'] },
          { question: 'My rule', errors: ['Duplicate'], severity: 'warning' },
          { question: 'Other rule', errors: ['Duplicate'], severity: 'error' },
        ])
      ).toEqual([
        { question: 'name', errors: ['Required'] },
        { question: '-', errors: ['Duplicate'], severity: 'warning' },
        { question: '-', errors: ['Duplicate'], severity: 'error' },
      ]);
    });

    it('returns an empty list when there is no error', () => {
      expect(toDisplayedErrors(undefined)).toEqual([]);
    });
  });

  describe('getValidationModalData', () => {
    it('keeps the default texts of the modal for blocking errors', () => {
      const errors = [{ question: 'a', errors: ['x'] }];
      expect(getValidationModalData(errors, '2026-P1', translate)).toEqual({
        incrementalId: '2026-P1',
        errors,
      });
    });

    it('presents warnings as such, and offers to save anyway', () => {
      const data = getValidationModalData(
        [{ question: 'My rule', errors: ['x'], severity: 'warning' }],
        '',
        translate
      );
      expect(data.errors).toEqual([
        { question: '-', errors: ['x'], severity: 'warning' },
      ]);
      expect(data.severity).toEqual('warning');
      expect(data.confirmText).toEqual(
        'components.widget.grid.validation.saveAnyway'
      );
      expect(data.title).toEqual(
        'components.widget.grid.validation.warningTitle'
      );
      expect(data.subtitle).toEqual(
        'components.widget.grid.validation.warningSubtitle'
      );
      expect(data.hideConfirm).toBeUndefined();
    });
  });

  describe('getUploadReportModalData', () => {
    it('lists the messages of each row, without the name of the rules', () => {
      const data = getUploadReportModalData(
        [
          {
            row: 3,
            errors: [
              { question: 'org_code', errors: ['Duplicate'] },
              { question: 'name + country', errors: ['Duplicate too'] },
            ],
          },
          { row: 5, errors: [{ question: 'org_code', errors: ['Duplicate'] }] },
        ],
        'errors',
        translate
      );
      expect(data?.errors).toEqual([
        {
          question: 'components.uniquenessRules.upload.row:{"row":3}',
          errors: ['Duplicate', 'Duplicate too'],
        },
        {
          question: 'components.uniquenessRules.upload.row:{"row":5}',
          errors: ['Duplicate'],
        },
      ]);
      expect(data?.title).toEqual(
        'components.uniquenessRules.upload.errors.title'
      );
      expect(data?.severity).toEqual('error');
      expect(data?.hideConfirm).toBe(true);
      expect(data?.help).toEqual('');
    });

    it('reads the warnings of the rows when asked to', () => {
      const data = getUploadReportModalData(
        [{ row: 2, warnings: [{ question: 'name', errors: ['Duplicate'] }] }],
        'warnings',
        translate
      );
      expect(data?.errors).toHaveLength(1);
      expect(data?.severity).toEqual('warning');
      expect(data?.title).toEqual(
        'components.uniquenessRules.upload.warnings.title'
      );
    });

    it('returns null when there is nothing to report', () => {
      expect(
        getUploadReportModalData(undefined, 'errors', translate)
      ).toBeNull();
      expect(getUploadReportModalData([], 'warnings', translate)).toBeNull();
      expect(
        getUploadReportModalData([{ row: 2, errors: [] }], 'errors', translate)
      ).toBeNull();
      // Other upload endpoints may answer with something else than rows
      expect(
        getUploadReportModalData('error' as any, 'errors', translate)
      ).toBeNull();
    });
  });
});
