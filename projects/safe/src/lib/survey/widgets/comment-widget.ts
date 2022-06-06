/**
 * Custom definition for the comment question. Add edit functionnality.
 *
 * @param survey Survey instance
 */
export const init = (survey: any): void => {
  const widget = {
    name: 'comment-widget',
    widgetIsLoaded: (): boolean => true,
    isFit: (question: any): boolean => question.getType() === 'comment',
    init: (): void => {
      survey.Serializer.addProperty('comment', {
        name: 'allowEdition:boolean',
        type: 'boolean',
        dependsOn: ['readOnly'],
        default: false,
        category: 'general',
        visibleIf: (obj: any) => {
          if (!obj || !obj.readOnly) {
            return false;
          } else {
            return true;
          }
        },
      });
    },
    isDefaultRender: true,
    afterRender: (question: any, el: any): void => {
      // Display of edit button for comment question
      if (question.allowEdition) {
        const mainDiv = document.createElement('div');
        mainDiv.id = 'editComment';
        mainDiv.style.height = '23px';
        mainDiv.style.marginBottom = '0.5em';
        const btnEl = document.createElement('button');
        btnEl.innerText = 'Edit';
        btnEl.style.width = '50px';
        mainDiv.appendChild(btnEl);
        el.parentElement.insertBefore(mainDiv, el);
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

  survey.CustomWidgetCollection.Instance.addCustomWidget(widget);
};
