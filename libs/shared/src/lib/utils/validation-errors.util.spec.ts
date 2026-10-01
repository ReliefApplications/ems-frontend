import { TranslateService } from '@ngx-translate/core';
import {
  areOnlyWarnings,
  getUploadReportModalData,
  getValidationModalData,
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

  describe('getValidationModalData', () => {
    it('keeps the default texts of the modal for blocking errors', () => {
      const errors = [{ question: 'a', errors: ['x'] }];
      expect(getValidationModalData(errors, '2026-P1', translate)).toEqual({
        incrementalId: '2026-P1',
        errors,
      });
    });

    it('offers to save anyway when there are only warnings', () => {
      const errors = [
        { question: 'a', errors: ['x'], severity: 'warning' as const },
      ];
      const data = getValidationModalData(errors, '', translate);
      expect(data.errors).toEqual(errors);
      expect(data.confirmText).toEqual(
        'components.widget.grid.validation.saveAnyway'
      );
      expect(data.title).toEqual(
        'components.widget.grid.validation.warningTitle'
      );
      expect(data.hideConfirm).toBeUndefined();
    });
  });

  describe('getUploadReportModalData', () => {
    it('lists the violations of each row, without confirm button', () => {
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
      expect(data?.errors.map((x) => x.question)).toEqual([
        'components.uniquenessRules.upload.row:{"row":3} · org_code',
        'components.uniquenessRules.upload.row:{"row":3} · name + country',
        'components.uniquenessRules.upload.row:{"row":5} · org_code',
      ]);
      expect(data?.title).toEqual(
        'components.uniquenessRules.upload.errors.title'
      );
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
