import {
  Question,
  QuestionComment as QuestionCommentSurveyJS,
} from 'survey-angular';

/** Interface for question of type comment */
interface QuestionComment extends QuestionCommentSurveyJS {
  allowEdition?: boolean;
}

/**
 * Custom definition for overrriding the comment question. Add edit functionnality.
 *
 * @param Survey Survey library
 */
export const init = (Survey: any): void => {
  const widget = {
    name: 'comment-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: Question): boolean => question.getType() === 'comment',
    init: (): void => {
      Survey.Serializer.addProperty('comment', {
        name: 'allowEdition:boolean',
        type: 'boolean',
        dependsOn: ['readOnly'],
        default: false,
        category: 'general',
        visibleIf: (obj: Question) => {
          if (!obj || !obj.readOnly) {
            return false;
          } else {
            return true;
          }
        },
      });
    },
    isDefaultRender: true,
    afterRender: (question: QuestionComment, el: HTMLElement): void => {
      // Display of edit button for comment question
      if (question.allowEdition) {
        el.parentElement?.querySelector('#editComment')?.remove();
        const mainDiv = document.createElement('div');
        mainDiv.id = 'editComment';
        mainDiv.style.height = '23px';
        mainDiv.style.marginBottom = '0.5em';
        const btnEl = document.createElement('button');
        btnEl.innerText = 'Edit';
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

  Survey.CustomWidgetCollection.Instance.addCustomWidget(
    widget,
    'customwidget'
  );
};
