import { PropertyGridEditorCollection } from 'survey-creator-core';

/**
 * Property type used by the `translateField` property of the questions that
 * support auto-translation (text, comment, editor).
 */
export const TRANSLATE_SOURCE_QUESTION_TYPE = 'translatesourcequestion';

/** Question types that can be used as a translation source. */
const TRANSLATE_SOURCE_TYPES = ['text', 'comment', 'editor'];

/**
 * Custom property grid editor used to pick the survey question to translate
 * from. It renders a dropdown whose choices are the other text / comment /
 * editor questions of the survey.
 *
 * Unlike a `string` property with a `choices` function (handled by
 * `PropertyGridEditorDropdown`), the choices here are computed once when the
 * editor is created. The dropdown editor rebuilds its choices on every value
 * change (see `PropertyGridEditorDropdown.onMasterValueChanged`), which, with a
 * dynamic `choices` callback, re-runs `getAllQuestions()` on each pick and
 * freezes the property grid while clearing the displayed value mid-rebuild.
 */
PropertyGridEditorCollection.register({
  fit: (prop: any): boolean => prop.type === TRANSLATE_SOURCE_QUESTION_TYPE,
  getJSON: (obj: any): any => {
    const survey = obj?.survey;
    const choices = survey
      ? survey
          .getAllQuestions()
          .filter(
            (q: any) =>
              q !== obj && TRANSLATE_SOURCE_TYPES.includes(q.getType())
          )
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
