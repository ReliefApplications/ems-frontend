import { ChoicesRestful } from 'survey-angular';
import get from 'lodash/get';

/** Available question type with choices */
const SELECTABLE_TYPES = ['dropdown', 'checkbox', 'radiogroup', 'tagbox'];

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 * @param environment Current environment
 * @param referenceDataService Reference data service
 * @param domService Dom service.
 */
export const initCustomProperties = (Survey: any, environment: any): void => {
  // change the prefix for comments
  Survey.settings.commentPrefix = '_comment';
  // add tooltip property
  Survey.Serializer.addProperty('question', {
    name: 'tooltip:text',
    category: 'general',
    isLocalizable: true,
  });
  // override default expression properties
  Survey.Serializer.removeProperty('expression', 'readOnly');
  Survey.Serializer.removeProperty('survey', 'focusFirstQuestionAutomatic');
  Survey.Serializer.addProperty('expression', {
    name: 'readOnly:boolean',
    type: 'boolean',
    visibleIndex: 6,
    default: false,
    category: 'general',
    required: true,
  });
  // Pass token before the request to fetch choices by URL if it's targeting SAFE API
  Survey.ChoicesRestfull.onBeforeSendRequest = (
    sender: ChoicesRestful,
    options: { request: XMLHttpRequest }
  ) => {
    if (sender.url.includes(environment.apiUrl)) {
      const token = localStorage.getItem('idtoken');
      options.request.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  };
  // add the onCompleteExpression property to the survey
  Survey.Serializer.addProperty('survey', {
    name: 'onCompleteExpression:expression',
    type: 'expression',
    visibleIndex: 350,
    category: 'logic',
  });
};

/**
 * Render the custom properties
 *
 * @returns A function which render the custom properties on a question
 */
export const renderCustomProperties =
  (): ((survey: any, options: any) => void) =>
  (_: any, options: { question: any; htmlElement: any }): void => {
    // get the question and the html element of the question
    const el = options.htmlElement;
    const question = options.question;

    // Display the tooltip
    const header =
      el?.parentElement?.parentElement?.querySelector('.sv_q_title');
    if (header) {
      header.title = get(
        question,
        'localizableStrings.tooltip.renderedText',
        ''
      );
      const span = document.createElement('span');
      span.innerText = 'help';
      span.className = 'material-icons';
      span.style.fontSize = '1em';
      span.style.cursor = 'pointer';
      span.style.color = '#008DC9';
      header.appendChild(span);
      span.style.display = !question.tooltip ? 'none' : '';
      question.registerFunctionOnPropertyValueChanged('tooltip', () => {
        span.style.display = !question.tooltip ? 'none' : '';
        header.title = question.tooltip;
      });
    }

    // define the max size for files
    if (question.getType() === 'file') {
      question.maxSize = 7340032;
    }
  };
