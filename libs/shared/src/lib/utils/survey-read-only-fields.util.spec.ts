import { shouldLockReadOnlyFieldsOnRecordCreation } from './survey-read-only-fields.util';

/**
 * Creates the subset of SurveyJS behavior required by the predicate.
 *
 * @param propertyValue Value of the record creation locking setting
 * @returns Survey-like object exposing the configured property value
 */
const createSurvey = (propertyValue?: boolean) => ({
  getPropertyValue: () => propertyValue,
});

describe('shouldLockReadOnlyFieldsOnRecordCreation', () => {
  it('returns false when the option is unset', () => {
    expect(shouldLockReadOnlyFieldsOnRecordCreation(createSurvey())).toBe(
      false
    );
  });

  it('returns false when the option is disabled', () => {
    expect(shouldLockReadOnlyFieldsOnRecordCreation(createSurvey(false))).toBe(
      false
    );
  });

  it('returns true when the option is enabled', () => {
    expect(shouldLockReadOnlyFieldsOnRecordCreation(createSurvey(true))).toBe(
      true
    );
  });
});
