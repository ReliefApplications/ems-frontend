import { JsonObjectProperty, Serializer } from 'survey-core';
import {
  SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL,
  SURVEY_PROP_MODAL_SAVE_AS_DRAFT_BUTTON_LABEL,
} from '../../utils/survey-form-action-labels.util';
import { init } from './others';

type SurveyPropertyOwner = {
  getPropertyValue: (propertyName: string) => string;
  [key: string]: unknown;
};

/**
 * Create a minimal survey-like object for serializer property visibility tests.
 *
 * @param propertyValues Survey-level property values
 * @returns Object exposing getPropertyValue for SurveyJS property callbacks
 */
const createSurveyPropertyOwner = (
  propertyValues: Partial<Record<string, string>> = {}
): SurveyPropertyOwner =>
  ({
    getPropertyValue: (propertyName: string) =>
      propertyValues[propertyName] || '',
  } as SurveyPropertyOwner);

describe('survey global navigation properties', () => {
  let modalSaveButtonProperty: JsonObjectProperty;
  let modalSaveAsDraftButtonProperty: JsonObjectProperty;
  let modalLabelOverridesToggleProperty: JsonObjectProperty;

  beforeAll(() => {
    init({ apiUrl: '', csApiUrl: '' });
    modalSaveButtonProperty = Serializer.getProperty(
      'survey',
      SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL
    );
    modalSaveAsDraftButtonProperty = Serializer.getProperty(
      'survey',
      SURVEY_PROP_MODAL_SAVE_AS_DRAFT_BUTTON_LABEL
    );
    modalLabelOverridesToggleProperty = Serializer.getProperty(
      'survey',
      'showAdvancedNavigationLabelOverrides'
    );
  });

  it('registers modal navigation override properties in the navigation category', () => {
    expect(modalLabelOverridesToggleProperty).toBeTruthy();
    expect(modalLabelOverridesToggleProperty.category).toBe('navigation');
    expect(modalLabelOverridesToggleProperty.isSerializable).toBe(false);

    expect(modalSaveButtonProperty).toBeTruthy();
    expect(modalSaveButtonProperty.category).toBe('navigation');

    expect(modalSaveAsDraftButtonProperty).toBeTruthy();
    expect(modalSaveAsDraftButtonProperty.category).toBe('navigation');
  });

  it('hides modal override properties by default', () => {
    const survey = createSurveyPropertyOwner();

    expect(modalSaveButtonProperty.visibleIf(survey)).toBe(false);
    expect(modalSaveAsDraftButtonProperty.visibleIf(survey)).toBe(false);
  });

  it('shows modal override properties when the advanced toggle is enabled', () => {
    const survey = createSurveyPropertyOwner();

    modalLabelOverridesToggleProperty.onSetValue(
      survey,
      true,
      undefined as any
    );

    expect(modalSaveButtonProperty.visibleIf(survey)).toBe(true);
    expect(modalSaveAsDraftButtonProperty.visibleIf(survey)).toBe(true);
  });

  it('keeps modal override properties visible when override values already exist', () => {
    const survey = createSurveyPropertyOwner({
      [SURVEY_PROP_MODAL_SAVE_BUTTON_LABEL]: 'Update record',
      [SURVEY_PROP_MODAL_SAVE_AS_DRAFT_BUTTON_LABEL]: 'Update draft',
    });

    expect(modalLabelOverridesToggleProperty.onGetValue(survey)).toBe(true);
    expect(modalSaveButtonProperty.visibleIf(survey)).toBe(true);
    expect(modalSaveAsDraftButtonProperty.visibleIf(survey)).toBe(true);
  });
});
