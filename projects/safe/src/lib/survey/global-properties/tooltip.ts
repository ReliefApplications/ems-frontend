import { EventBase, JsonMetadata, SurveyModel } from 'survey-core';
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
 * @param onLocChange The function to call when the locale changes
 */
export const render = (
  question: Question,
  el: HTMLElement,
  onLocChange: EventBase<SurveyModel>
): void => {
  // Display the tooltip
  const header = el?.parentElement?.parentElement?.querySelector(
    '.sv_q_title'
  ) as HTMLElement;
  if (header) {
    header.title = question.tooltip || '';
    const span = document.createElement('span');
    span.innerText = 'help';
    span.className = 'material-icons';
    span.style.fontSize = '1em';
    span.style.cursor = 'pointer';
    span.style.color = '#008DC9';
    span.style.paddingInlineStart = '0.5em';
    header.appendChild(span);
    span.style.display = !question.tooltip ? 'none' : '';

    question.registerFunctionOnPropertyValueChanged('tooltip', () => {
      span.style.display = !question.tooltip ? 'none' : '';
      header.title = question.tooltip || '';
    });

    // change tooltip on language change
    onLocChange.add(() => {
      span.style.display = !question.tooltip ? 'none' : '';
      header.title = question.tooltip || '';
    });
  }
};
