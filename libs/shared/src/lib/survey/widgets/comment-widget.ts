import {
  CustomWidgetCollection,
  Serializer,
  SurveyModel,
  surveyLocalization,
} from 'survey-core';
import { Question, QuestionComment } from '../types';
/**
 * Custom definition for overriding the comment question. Add edit functionality.
 *
 * @param customWidgetCollectionInstance CustomWidgetCollection
 * @param document Document
 */
export const init = (
  customWidgetCollectionInstance: CustomWidgetCollection,
  document: Document
): void => {
  const widget = {
    name: 'comment-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'comment',
    init: (): void => {
      Serializer.addProperty('comment', {
        name: 'allowEdition:boolean',
        type: 'boolean',
        dependsOn: ['readOnly'],
        default: false,
        category: 'general',
        visibleIf: (obj: null | QuestionComment) => Boolean(obj?.readOnly),
      });
    },
    isDefaultRender: true,
    afterRender: (question: QuestionComment, el: HTMLElement): void => {
      // Display of edit button for comment question
      if (question.allowEdition) {
        el.parentElement?.querySelector('#editComment')?.remove();
        const mainDiv = document.createElement('div');
        mainDiv.id = 'editComment';
        mainDiv.style.marginBottom = '0.5em';
        const btnEl = document.createElement('button');
        btnEl.innerText = surveyLocalization.getString(
          'oort:edit',
          (question.survey as SurveyModel).locale
        );
        btnEl.className = 'sd-btn !px-3 !py-1';
        btnEl.style.width = '50px';
        mainDiv.appendChild(btnEl);
        el.parentElement?.insertBefore(mainDiv, el);
        mainDiv.style.display = !question.allowEdition ? 'none' : '';
        question.registerFunctionOnPropertyValueChanged('allowEdition', () => {
          mainDiv.style.display = !question.allowEdition ? 'none' : '';
        });
        question.registerFunctionOnPropertyValueChanged('readOnly', () => {
          mainDiv.style.display = !question.readOnly ? 'none' : '';
        });
        btnEl.onclick = () => {
          question.readOnly = false;
        };
      }
    },
  };

  customWidgetCollectionInstance.addCustomWidget(widget, 'customwidget');
};
