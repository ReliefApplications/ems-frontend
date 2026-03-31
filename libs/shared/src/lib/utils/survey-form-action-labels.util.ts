import { SurveyModel } from 'survey-core';

/** Serializer property: primary save action label expression. */
export const SURVEY_PROP_SAVE_BUTTON_LABEL = 'saveButtonLabel';

/** Serializer property: modal save action label expression. */
export const SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL = 'modalSaveButtonLabel';

/** Serializer property: save-as-draft action label expression. */
export const SURVEY_PROP_SAVE_AS_DRAFT_BUTTON_LABEL = 'saveAsDraftButtonLabel';

/** Serializer property: modal save-as-draft action label expression. */
export const SURVEY_PROP_MODAL_SAVE_AS_DRAFT_BUTTON_LABEL =
  'modalSaveAsDraftButtonLabel';

/**
 * Evaluates a single form action button label from survey-level expression settings.
 *
 * @param survey Active survey model
 * @param propertyName Serializer property name (e.g. saveButtonLabel)
 * @returns Evaluated label, or empty string if unset (template uses default i18n)
 */
export function evaluateSurveyActionButtonLabel(
  survey: SurveyModel,
  propertyName: string
): string {
  const expression = survey.getPropertyValue(propertyName);
  if (!expression) return '';
  if (expression.includes('{')) {
    try {
      const result = survey.runExpression(expression);
      return typeof result === 'string' && result ? result : expression;
    } catch {
      return expression;
    }
  }
  return expression;
}

/**
 * Evaluates save / save-as-draft button labels from the survey settings.
 *
 * @param survey Active survey model
 * @returns Evaluated labels (empty strings fall back to default i18n in templates)
 */
export function getSurveyFormActionButtonLabels(survey: SurveyModel): {
  saveButtonLabel: string;
  modalSaveButtonLabel: string;
  saveAsDraftButtonLabel: string;
  modalSaveAsDraftButtonLabel: string;
} {
  const saveButtonLabel = evaluateSurveyActionButtonLabel(
    survey,
    SURVEY_PROP_SAVE_BUTTON_LABEL
  );
  const modalSaveButtonLabel =
    evaluateSurveyActionButtonLabel(
      survey,
      SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL
    ) || saveButtonLabel;
  const saveAsDraftButtonLabel = evaluateSurveyActionButtonLabel(
    survey,
    SURVEY_PROP_SAVE_AS_DRAFT_BUTTON_LABEL
  );
  const modalSaveAsDraftButtonLabel =
    evaluateSurveyActionButtonLabel(
      survey,
      SURVEY_PROP_MODAL_SAVE_AS_DRAFT_BUTTON_LABEL
    ) || saveAsDraftButtonLabel;

  return {
    saveButtonLabel,
    modalSaveButtonLabel,
    saveAsDraftButtonLabel,
    modalSaveAsDraftButtonLabel,
  };
}
