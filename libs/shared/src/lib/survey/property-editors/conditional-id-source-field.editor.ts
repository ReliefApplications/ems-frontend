import { PropertyGridEditorCollection } from 'survey-creator-core';

/**
 * Property type used by the `sourceField` property of conditionalId questions.
 */
export const CONDITIONAL_ID_SOURCE_FIELD_TYPE = 'conditionalidsourcefield';

/**
 * Custom property grid editor used to pick the boolean survey question that
 * drives a conditionalId field's generated value (e.g. cecis_case). Renders a
 * dropdown whose choices are the other boolean questions of the survey.
 */
PropertyGridEditorCollection.register({
  fit: (prop: any): boolean => prop.type === CONDITIONAL_ID_SOURCE_FIELD_TYPE,
  getJSON: (obj: any): any => {
    const survey = obj?.survey;
    const choices = survey
      ? survey
          .getAllQuestions()
          .filter((q: any) => q !== obj && q.getType() === 'boolean')
          .map((q: any) => ({ value: q.name, text: q.name }))
      : [];
    return {
      type: 'dropdown',
      allowClear: true,
      optionsCaption: '',
      choices,
    };
  },
});
