import get from 'lodash/get';
import { JsonMetadata, Question, SurveyModel } from 'survey-angular';

/** Question with tooltip interface */
interface QuestionTooltip extends Question {
  tooltip?: string;
}

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
 * @param survey The survey instance
 * @param options The options object
 * @param options.question The question object
 * @param options.htmlElement The dom element of the question
 */
export const render = (
  survey: SurveyModel,
  options: { question: Question; htmlElement: HTMLElement }
): void => {
  // get the question and the html element of the question
  const el = options.htmlElement;
  const question = options.question as QuestionTooltip;

  // Display the tooltip
  const header = el?.parentElement?.parentElement?.querySelector(
    '.sv_q_title'
  ) as HTMLElement;
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
