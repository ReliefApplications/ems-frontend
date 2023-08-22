import { isArray, isEqual, isNil } from 'lodash';
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

  // Custom function that given a question name for a matrix,
  // and a list of rows names, returns a string with the values of the columns
  // for each row.
  survey.FunctionFactory.Instance.register(
    'listColsForRows',
    function (this: { survey: SurveyModel }, params: any[]) {
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
          const rowTitle =
            matrix.rows.find((r) => r.value === row)?.text || row;
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
  );

  // Custom function to replace new lines with <br> tags.
  survey.FunctionFactory.Instance.register('nl2br', (params: any[]) => {
    if (!params[0]) return '';
    return params[0].replace(/\n/g, '<br>');
  });

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

  // Get length of an array
  survey.FunctionFactory.Instance.register('length', (params: any[]) => {
    if (!Array.isArray(params[0])) return 0;
    return params[0].length;
  });
};

export default addCustomFunctions;
