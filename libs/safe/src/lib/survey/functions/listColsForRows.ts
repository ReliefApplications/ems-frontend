import {
  QuestionMatrixDropdownModel,
  QuestionMatrixDynamicModel,
  QuestionMatrixModel,
  SurveyModel,
} from 'survey-angular';
import { isArray, isNil } from 'lodash';

/**
 * Custom function that given a question name for a matrix,
 * and a list of rows names, returns a string with the values of the columns for each row
 *
 * @param this survey instance
 * @param this.survey survey instance
 * @param params params passed to the function
 * @returns The list of rows that have that value in the column.
 */
function listColsForRows(this: { survey: SurveyModel }, params: any[]) {
  const [questionName, rows] = params;
  if (!questionName || !rows) return [];

  const question = this.survey.getQuestionByName(questionName);
  if (!question || !question.getType().startsWith('matrix')) return [];

  const matrix = question as
    | QuestionMatrixDropdownModel
    | QuestionMatrixModel
    | QuestionMatrixDynamicModel;

  return rows
    .map((row: string) => {
      const rowTitle = matrix.rows.find((r) => r.value === row)?.text || row;
      const colsValues = matrix.columns
        .map((col) => {
          // Get type of column
          const colType =
            col.cellType === 'default' ? matrix.cellType : col.cellType;

          const colTitle = col.title;
          const value = matrix.value?.[row]?.[col.name];
          let formattedValue;
          switch (colType) {
            case 'boolean':
              // Get the label of the boolean value
              formattedValue = isNil(value)
                ? ''
                : value
                ? col.labelTrue
                : col.labelFalse;
              break;
            case 'dropdown':
              formattedValue = value?.text || value?.value;
              break;
            case 'file':
              if (isArray(value))
                formattedValue = value.map((v) => v.name).join(', ');
              break;
            default:
              formattedValue = value;
          }

          return {
            title: colTitle,
            value: formattedValue,
          };
        })
        .filter((value) => !!value.value)
        .map((value) => `${value.title}: ${value.value}`)
        .join(', ');
      if (!colsValues) return '';
      return `[${rowTitle}]\n${colsValues}`;
    })
    .filter((value: string) => !!value)
    .join('\n');
}

export default listColsForRows;
