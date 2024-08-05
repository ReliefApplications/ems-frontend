import { GlobalOptions } from '../types';
import { Question } from 'survey-core';

/**
 * Logs the value of the parameter, and returns the value.
 * Useful for debugging.
 *
 * @param this Question instance
 * @param this.question Question instance
 * @param params Any value to log.
 * @returns The same value that was logged.
 */
function log(this: { question: Question }, params: any[]) {
  console.log(`${this.question.name}:`, ...params);
  return params[0];
}

/**
 *  Generator for the custom function log.
 *
 * @param _ Global options
 * @returns The custom function log
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => log;
