import { SurveyModel } from 'survey-core';

/** Serializer property: toggle to require a confirmation modal before updating a record. */
export const SURVEY_PROP_CONFIRM_RECORD_UPDATE = 'confirmRecordUpdate';

/**
 * Serializer property: expression overriding {@link SURVEY_PROP_CONFIRM_RECORD_UPDATE}.
 * When set, its boolean result decides whether the confirmation modal is shown.
 */
export const SURVEY_PROP_CONFIRM_RECORD_UPDATE_IF = 'confirmRecordUpdateIf';

/**
 * Whether a confirmation modal should be shown before updating a record.
 *
 * The logic expression takes precedence when provided; otherwise the boolean
 * toggle from the form general settings is used.
 *
 * @param survey Active survey model
 * @returns True when the update must be confirmed by the user
 */
export function shouldConfirmRecordUpdate(survey: SurveyModel): boolean {
  const expression = survey.getPropertyValue(
    SURVEY_PROP_CONFIRM_RECORD_UPDATE_IF
  );
  if (expression) {
    try {
      return Boolean(survey.runExpression(expression));
    } catch {
      return false;
    }
  }
  return Boolean(survey.getPropertyValue(SURVEY_PROP_CONFIRM_RECORD_UPDATE));
}
