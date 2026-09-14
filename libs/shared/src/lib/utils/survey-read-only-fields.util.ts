import { SurveyModel } from 'survey-core';

/** Serializer property controlling read-only fields during record creation. */
export const SURVEY_PROP_LOCK_READ_ONLY_FIELDS_ON_RECORD_CREATION =
  'lockReadOnlyFieldsOnRecordCreation';

/**
 * Whether fields marked read-only must remain locked while creating a record.
 * Missing values preserve the legacy behavior.
 *
 * @param survey Active SurveyJS form
 * @returns True when read-only fields must be locked on record creation
 */
export function shouldLockReadOnlyFieldsOnRecordCreation(
  survey: Pick<SurveyModel, 'getPropertyValue'>
): boolean {
  return (
    survey.getPropertyValue(
      SURVEY_PROP_LOCK_READ_ONLY_FIELDS_ON_RECORD_CREATION
    ) === true
  );
}
