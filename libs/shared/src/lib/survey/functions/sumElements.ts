import { get, sum } from 'lodash';
import { GlobalOptions } from '../types';
import { SurveyModel } from 'survey-core';
import { getPanelDynamicData } from './getPanelDynamicData';

/**
 * Sum all the values of a question, which parent is a panel dynamic.
 *
 * @param this Self
 * @param this.survey Survey instance
 * @param params the question name (question parent must be a panel dynamic)
 * @returns the final sum result
 */
function sumElements(this: { survey: SurveyModel }, params: any[]) {
  const [questionName] = params;
  const surveyData = this.survey.data;
  const question = this.survey.getQuestionByName(questionName);

  const isInPanel = question.parentQuestion?.getType() === 'paneldynamic';
  if (isInPanel) {
    const parentPanelData = getPanelDynamicData(
      surveyData,
      question.parentQuestion.name
    );
    const values = parentPanelData.flatMap((panel: any) =>
      panel.flatMap((values: any) => get(values, questionName))
    );
    return sum(values);
  }
  return '';
}

/**
 *  Generator for the custom function sumElements.
 *
 * @param _ Global options
 * @returns The custom function sumElements
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => sumElements;
