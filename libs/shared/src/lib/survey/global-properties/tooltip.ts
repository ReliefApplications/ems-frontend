import get from 'lodash/get';
import { JsonMetadata } from 'survey-angular';
import { Question } from '../types';

/**
 * Add support for custom properties to the survey
 *
 * @param Survey Survey library
 */
export const init = (Survey: any): void => {
  const serializer: JsonMetadata = Survey.Serializer;

  // add tooltip property
  serializer.addProperty('question', {
    name: 'tooltip:text',
    category: 'general',
    isLocalizable: true,
  });
};

/**
 * Render the custom properties
 *
 * @param question The question object
 * @param el The html element of the question
 * @param document Document
 */
export const render = (
  question: Question,
  el: HTMLElement,
  document: Document
): void => {
  // Display the tooltip
  const header = el?.parentElement?.querySelector('.sv_q_title') as HTMLElement;
  if (header) {
    header.title = get(question, 'localizableStrings.tooltip.renderedText', '');
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
      header.title = question.tooltip || '';
    });
  }
};
