import {
  QuestionMatrixDropdownModel,
  QuestionMatrixDynamicModel,
  QuestionMatrixModel,
  SurveyModel,
} from 'survey-core';
import { isNil } from 'lodash';
import { GlobalOptions } from '../types';

/**
 * Custom function to get row/col titles given a list of the row/col names.
 *
 * @param this Survey instance
 * @param this.survey Survey instance
 * @param params params passed to the function
 * @returns The list of rows that have that value in the column.
 */
function getMatrixTitles(this: { survey: SurveyModel }, params: any[]) {
  const [questionName, names, isRow] = params;
  if (!questionName || !names) return [];

  // If a third parameter is not provided, we assume that we want to get the row titles.
  const gettingRows = isNil(isRow) ? true : isRow;

  const question = this.survey.getQuestionByName(params[0]);
  if (!question || !question.getType().startsWith('matrix')) return [];

  const matrix = question as
    | QuestionMatrixDropdownModel
    | QuestionMatrixModel
    | QuestionMatrixDynamicModel;

  return names.map((name: string) => {
    return gettingRows
      ? matrix.rows.find((row) => row.value === name)?.text || name
      : matrix.columns.find((col) => col.name === name)?.title || name;
  });
}

/**
 *  Generator for the custom function getMatrixTitles.
 *
 * @param _ Global options
 * @returns The custom function getMatrixTitles
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (_: GlobalOptions) => getMatrixTitles;
