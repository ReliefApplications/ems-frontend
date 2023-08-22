import {
  QuestionMatrixDropdownModel,
  QuestionMatrixDynamicModel,
  QuestionMatrixModel,
  SurveyModel,
} from 'survey-angular';
import { isEqual } from 'lodash';

/**
 * Custom function that given a name for a matrix question, a column name and a column value,
 * returns the list of rows that have that value in the column.
 *
 * @param this survey instance
 * @param this.survey survey instance
 * @param params params passed to the function
 * @returns The list of rows that have that value in the column.
 */
function listRowsWithColValue(this: { survey: SurveyModel }, params: any[]) {
  const [questionName, colName] = params;
  if (!questionName || !colName) return [];

  // could be undefined, meaning that we want to get the rows
  // with an empty value in the column.
  const colValue = params[2];

  const question = this.survey.getQuestionByName(params[0]);
  if (!question || !question.getType().startsWith('matrix')) return [];
  if (typeof colName !== 'string') return [];

  const matrixQuestion = question as
    | QuestionMatrixDropdownModel
    | QuestionMatrixModel
    | QuestionMatrixDynamicModel;

  const matrix = matrixQuestion.rows.reduce(
    (acc, row) => ({
      ...acc,
      [row.value]: matrixQuestion.columns.reduce(
        (acc2, col) => ({
          ...acc2,
          [col.name]: matrixQuestion.value?.[row.value]?.[col.name],
        }),
        {}
      ),
    }),
    {}
  );

  const rows = Object.keys(matrix);
  return rows.filter((row) => isEqual(matrix[row]?.[colName], colValue));
}

export default listRowsWithColValue;
