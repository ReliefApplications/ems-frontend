import { Question, SurveyModel } from 'survey-core';
import { GlobalOptions } from '../types';
import { isArray } from 'lodash';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param this.question Question instance
 * @param params Params passed to the function
 * @returns The question value
 */
function onComplete(
  this: { survey: SurveyModel; question: Question },
  params: any[]
) {
  console.log(params, 'yessai cool');
  if (!this.question.onCompletion) {
    this.survey.onComplete.add(() => {
      if (!this.question.onCompletion.triggered) {
        const completionValue = this.question.onCompletion.value;
        console.log(this.question.value, completionValue);
        this.question.value = isArray(this.question.value)
          ? completionValue
          : completionValue[0];
        this.question.onCompletion.triggered = true;
      }
    });
  }
  this.question.onCompletion = { value: params, triggered: false };

  return this.question.value;
}

/**
 * Generator for the custom function onComplete.
 *
 * @param _ Global options
 * @returns The custom function onComplete
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => onComplete;
