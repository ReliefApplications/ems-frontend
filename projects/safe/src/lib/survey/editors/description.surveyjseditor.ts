import * as SurveyCore from 'survey-core';
import { JsonObjectProperty, Question } from 'survey-core';
import { PropertyGridEditorCollection } from 'survey-creator-core';

/** Inits the custom html widget */
export const init = (): void => {
  const widget = {
    name: 'description',
    title: 'Custom HTML',
    isFit: (question: Question) => question.getType() === 'description',
    init: () => {
      // Register description type using the empty question as the base.
      SurveyCore.Serializer.addClass('description', [], undefined, 'empty');

      // Hide the description type from the toolbox.
      SurveyCore.CustomWidgetCollection.Instance.getCustomWidgetByName(
        'description'
      ).showInToolbox = false;
    },
    afterRender: (question: Question, htmlElement: HTMLElement): void => {
      const html = question.innerHTML;
      const div = document.createElement('div');

      div.style.color = 'initial';
      div.style.backgroundColor = '#fff';
      div.style.padding = '0.5rem';
      div.style.border = '1px solid #e5e7eb';
      div.style.borderRadius = '0.375rem';

      div.innerHTML = html;
      htmlElement.appendChild(div);
    },
  };

  // registers custom widget as type
  SurveyCore.CustomWidgetCollection.Instance.add(widget, 'customtype');

  // registers custom property editor
  PropertyGridEditorCollection.register({
    fit: (prop: JsonObjectProperty) => prop.type === 'description',
    getJSON: () => ({
      type: 'description',
    }),
  });
};
