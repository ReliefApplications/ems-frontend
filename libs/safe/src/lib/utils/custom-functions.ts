import { isEqual, isNil } from 'lodash';
import { Record } from '../models/record.model';
import { SafeAuthService } from '../services/auth/auth.service';
import {
  QuestionMatrixDropdownModel,
  QuestionMatrixDynamicModel,
  QuestionMatrixModel,
  SurveyModel,
} from 'survey-angular';

/**
 * Registration of new custom functions for the survey.
 * Custom functions can be used in the logic fields.
 *
 * @param survey Survey instance
 * @param authService Shared auth service
 * @param record Current record
 */
const addCustomFunctions = (
  survey: any,
  authService: SafeAuthService,
  record?: Record | undefined
): void => {
  survey.FunctionFactory.Instance.register('createdAt', () =>
    record ? new Date(Number(record.createdAt) || '') : new Date()
  );
  survey.FunctionFactory.Instance.register('modifiedAt', () =>
    record ? new Date(Number(record.modifiedAt) || '') : new Date()
  );
  survey.FunctionFactory.Instance.register('createdBy', () => {
    if (record) {
      return record.createdBy?.name || '';
    } else {
      return authService.userValue?.name || '';
    }
  });
  survey.FunctionFactory.Instance.register('id', () =>
    record ? record.id : 'unknown id'
  );
  survey.FunctionFactory.Instance.register('weekday', (params: Date[]) =>
    new Date(params[0]).getDay()
  );
  survey.FunctionFactory.Instance.register('addDays', (params: any[]) => {
    const result = new Date(params[0]);
    result.setDate(result.getDate() + Number(params[1]));
    return result;
  });

  // Custom function that given a name for a matrix question, a column name and a column value,
  // returns the list of rows that have that value in the column.
  survey.FunctionFactory.Instance.register(
    'listRowsWithColValue',
    function (this: { survey: SurveyModel }, params: any[]) {
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
  );

  // Custom function that gets two arrays and returns the intersection of them.
  survey.FunctionFactory.Instance.register('intersect', (params: any[]) => {
    if (!Array.isArray(params[0]) || !Array.isArray(params[1])) return [];
    return params[0].filter((value) =>
      params[1].find((v: any) => isEqual(v, value))
    );
  });

  // Custom function to get row/col titles given a list of the row/col names.
  survey.FunctionFactory.Instance.register(
    'getMatrixTitles',
    function (this: { survey: SurveyModel }, params: any[]) {
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
  );
};

export default addCustomFunctions;
