import * as SurveyCreator from 'survey-creator';
import { ItemValue } from 'survey-angular';

/**
 * Inits the custom tagbox component.
 *
 * @param survey survey class.
 */
export const init = (survey: any): void => {
  const component = {
    name: 'customTagbox',
    title: 'Tag box',
    category: 'Custom Questions',
    questionJSON: {
      name: 'customTagbox',
      type: 'tagbox',
      optionsCaption: 'Select values...',
      choicesOrder: 'asc',
      choices: [] as ItemValue[],
    },
    onInit: (): void => {
      survey.Serializer.addProperty('customTagbox', {
        name: 'choices',
        category: 'Choices',
        type: 'itemvalues',
        isDynamicChoices: true,
        visibleIndex: 3,
        required: true,
      });

      SurveyCreator.SurveyQuestionEditorDefinition.definition[
        'itemvalue[]@choices'
      ].properties.push('choices');
    },
    onLoaded: (question: any): void => {
      question.contentQuestion.choices = question.choices;
    },
  };
  survey.ComponentCollection.Instance.add(component);
};
