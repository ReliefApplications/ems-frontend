import { QuestionCustomModel } from 'survey-core';
import { GlobalOptions } from '../types';

/**
 * Always returns the value expression if the question's value is empty.
 * Otherwise, returns the current value of the question (set by the user).
 *
 * @param this survey instance
 * @param this.question question invoking the function
 * @param params params passed to the function
 * @returns the value for the question (that's the expression value if the question value is empty)
 */
function once(this: { question: QuestionCustomModel }, params: any) {
  const expression = params;
  return this.question?.value ? this.question?.value : expression;
}

/**
 *  Generator for the custom function once.
 *
 * @param _ Global options
 * @returns The custom function once
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => once;
