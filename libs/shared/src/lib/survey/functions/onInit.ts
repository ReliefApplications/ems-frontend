import { Question } from 'survey-core';
import { GlobalOptions } from '../types';
import { isNull } from 'lodash';

/**
 * Registration of new custom functions for the survey.
 *
 * @param this Survey instance
 * @param this.question Question instance
 * @param params Params passed to the function
 * @returns The question value
 */
function onInit(this: { question: Question }, params: any[]) {
  if (!this.question.onInit && !isNull(params[0])) {
    this.question.onInit = true;
    return params;
  }
  return this.question.value;
}

/**
 * Generator for the custom function onInit.
 *
 * @param _ Global options
 * @returns The custom function onInit
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => onInit;
