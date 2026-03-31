import { SurveyModel } from 'survey-core';
import {
  evaluateSurveyActionButtonLabel,
  getSurveyFormActionButtonLabels,
  SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL,
  SURVEY_PROP_MODAL_SAVE_AS_DRAFT_BUTTON_LABEL,
  SURVEY_PROP_SAVE_AS_DRAFT_BUTTON_LABEL,
  SURVEY_PROP_SAVE_BUTTON_LABEL,
} from './survey-form-action-labels.util';

type SurveyProperties = Partial<Record<string, string>>;

/**
 * Create a minimal survey mock for action label evaluation tests.
 *
 * @param properties Survey-level properties returned by getPropertyValue
 * @param runExpression Mocked survey expression evaluator
 * @returns Survey model mock with the methods used by the utility
 */
const createSurveyMock = (
  properties: SurveyProperties,
  runExpression = jest.fn()
): SurveyModel =>
  ({
    getPropertyValue: (propertyName: string) => properties[propertyName],
    runExpression,
  } as unknown as SurveyModel);

describe('survey form action labels utility', () => {
  describe('evaluateSurveyActionButtonLabel', () => {
    it('returns an empty string when the property is not set', () => {
      const survey = createSurveyMock({});

      expect(
        evaluateSurveyActionButtonLabel(survey, SURVEY_PROP_SAVE_BUTTON_LABEL)
      ).toBe('');
    });

    it('returns a static label without evaluating it', () => {
      const runExpression = jest.fn();
      const survey = createSurveyMock(
        {
          [SURVEY_PROP_SAVE_BUTTON_LABEL]: 'Save changes',
        },
        runExpression
      );

      expect(
        evaluateSurveyActionButtonLabel(survey, SURVEY_PROP_SAVE_BUTTON_LABEL)
      ).toBe('Save changes');
      expect(runExpression).not.toHaveBeenCalled();
    });

    it('evaluates expression-based labels', () => {
      const runExpression = jest.fn().mockReturnValue('Continue editing');
      const expression =
        "iif({status} = 'draft', 'Continue editing', 'Save form')";
      const survey = createSurveyMock(
        {
          [SURVEY_PROP_SAVE_BUTTON_LABEL]: expression,
        },
        runExpression
      );

      expect(
        evaluateSurveyActionButtonLabel(survey, SURVEY_PROP_SAVE_BUTTON_LABEL)
      ).toBe('Continue editing');
      expect(runExpression).toHaveBeenCalledWith(expression);
    });

    it('falls back to the configured expression when evaluation throws', () => {
      const expression =
        "iif({status} = 'draft', 'Continue editing', 'Save form')";
      const survey = createSurveyMock(
        {
          [SURVEY_PROP_SAVE_BUTTON_LABEL]: expression,
        },
        jest.fn(() => {
          throw new Error('Expression error');
        })
      );

      expect(
        evaluateSurveyActionButtonLabel(survey, SURVEY_PROP_SAVE_BUTTON_LABEL)
      ).toBe(expression);
    });

    it('falls back to the configured expression when evaluation is not a string', () => {
      const expression =
        "iif({status} = 'draft', 'Continue editing', 'Save form')";
      const survey = createSurveyMock(
        {
          [SURVEY_PROP_SAVE_BUTTON_LABEL]: expression,
        },
        jest.fn().mockReturnValue(true)
      );

      expect(
        evaluateSurveyActionButtonLabel(survey, SURVEY_PROP_SAVE_BUTTON_LABEL)
      ).toBe(expression);
    });
  });

  describe('getSurveyFormActionButtonLabels', () => {
    it('falls back to the form save label when the modal label is empty', () => {
      const saveExpression = "iif({status} = 'draft', 'Save draft', 'Save')";
      const runExpression = jest.fn((expression: string) => {
        if (expression === saveExpression) return 'Save draft';
        return expression;
      });
      const survey = createSurveyMock(
        {
          [SURVEY_PROP_SAVE_BUTTON_LABEL]: saveExpression,
          [SURVEY_PROP_SAVE_AS_DRAFT_BUTTON_LABEL]: 'Save as draft',
        },
        runExpression
      );

      expect(getSurveyFormActionButtonLabels(survey)).toEqual({
        saveButtonLabel: 'Save draft',
        modalSaveButtonLabel: 'Save draft',
        saveAsDraftButtonLabel: 'Save as draft',
        modalSaveAsDraftButtonLabel: 'Save as draft',
      });
    });

    it('uses dedicated modal labels when they are configured', () => {
      const saveExpression = "iif({status} = 'draft', 'Save draft', 'Save')";
      const modalExpression =
        "iif({status} = 'draft', 'Update draft', 'Update record')";
      const draftExpression =
        "iif({status} = 'draft', 'Update saved draft', 'Save as draft')";
      const runExpression = jest.fn((expression: string) => {
        if (expression === saveExpression) return 'Save';
        if (expression === modalExpression) return 'Update record';
        if (expression === draftExpression) return 'Update saved draft';
        return expression;
      });
      const survey = createSurveyMock(
        {
          [SURVEY_PROP_SAVE_BUTTON_LABEL]: saveExpression,
          [SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL]: modalExpression,
          [SURVEY_PROP_SAVE_AS_DRAFT_BUTTON_LABEL]: 'Save as draft',
          [SURVEY_PROP_MODAL_SAVE_AS_DRAFT_BUTTON_LABEL]: draftExpression,
        },
        runExpression
      );

      expect(getSurveyFormActionButtonLabels(survey)).toEqual({
        saveButtonLabel: 'Save',
        modalSaveButtonLabel: 'Update record',
        saveAsDraftButtonLabel: 'Save as draft',
        modalSaveAsDraftButtonLabel: 'Update saved draft',
      });
    });
  });
});
