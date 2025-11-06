import { isArray, isEqual, isNil } from 'lodash';
import { Record } from '../models/record.model';
import { AuthService } from '../services/auth/auth.service';
import {
  FunctionFactory,
  QuestionMatrixDropdownModel,
  QuestionMatrixDynamicModel,
  QuestionMatrixModel,
  SurveyModel,
} from 'survey-core';

/**
 * Registration of new custom functions for the survey.
 * Custom functions can be used in the logic fields.
 *
 * @param authService Shared auth service
 */
const addCustomFunctions = (authService: AuthService): void => {
  const customFunctions: { name: string; function: (...args: any[]) => any }[] =
    [
      {
        name: 'createdAt',
        /**
         * Get the creation date of the record.
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @returns Creation date of the record
         */
        function: function (this: { survey: SurveyModel }) {
          const record = this.survey.getPropertyValue('record') as
            | Record
            | undefined;
          return record ? new Date(Number(record.createdAt) || '') : new Date();
        },
      },
      {
        name: 'modifiedAt',
        /**
         * Get the modification date of the record.
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @returns Modification date of the record
         */
        function: function (this: { survey: SurveyModel }) {
          const record = this.survey.getPropertyValue('record') as
            | Record
            | undefined;
          return record
            ? new Date(Number(record.modifiedAt) || '')
            : new Date();
        },
      },
      {
        name: 'createdBy',
        /**
         * Get the creator of the record.
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @returns Creator of the record
         */
        function: function (this: { survey: SurveyModel }) {
          const record = this.survey.getPropertyValue('record') as
            | Record
            | undefined;
          if (record) {
            return record.createdBy?.name || '';
          } else {
            return authService.userValue?.name || '';
          }
        },
      },
      {
        name: 'id',
        /**
         * Get the ID of the record.
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @returns ID of the record
         */
        function: function (this: { survey: SurveyModel }) {
          console.log(this.survey);
          const record = this.survey.record as Record | undefined;
          console.log(record);
          return record ? record.id : 'unknown id';
        },
      },
      {
        name: 'weekday',
        /**
         * Get weekday from a date.
         * Example:
         * - expression: weekday(now())
         * - returns: 3
         *
         * @param params Date
         * @returns Weekday of the date
         */
        function: (params: Date[]) => new Date(params[0]).getDay(),
      },
      {
        name: 'addDays',
        /**
         * Add days to a date.
         *
         * @param params Date and number of days to add
         * @returns New date with added days
         */
        function: (params: any[]) => {
          const result = new Date(params[0]);
          result.setDate(result.getDate() + Number(params[1]));
          return result;
        },
      },
      {
        name: 'listRowsWithColValue',
        /**
         * Custom function that given a name for a matrix question, a column name and a column value,
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @param params question name & column name
         * @returns List of rows that have that value in the column.
         */
        function: function (this: { survey: SurveyModel }, params: any[]) {
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
          return rows.filter((row) =>
            isEqual(matrix[row]?.[colName], colValue)
          );
        },
      },
      {
        name: 'listColsForRows',
        /**
         * Custom function that given a question name for a matrix, and a list of rows names, returns a string with the values of the columns for each row.
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @param params question name & rows
         * @returns List of column values for each row
         */
        function: function (this: { survey: SurveyModel }, params: any[]) {
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
        },
      },
      {
        name: 'nl2br',
        /**
         * Custom function to replace new lines with <br> tags.
         *
         * @param params String with \n characters
         * @returns String with <br> tags
         */
        function: (params: any[]) => {
          if (!params[0]) return '';
          return params[0].replace(/\n/g, '<br>');
        },
      },
      {
        name: 'intersect',
        /**
         * Custom function that gets two arrays and returns the intersection of them.
         *
         * @param params JSON object
         * @returns Intersection of the two arrays
         */
        function: (params: any[]) => {
          if (!Array.isArray(params[0]) || !Array.isArray(params[1])) return [];
          return params[0].filter((value) =>
            params[1].find((v: any) => isEqual(v, value))
          );
        },
      },
      {
        name: 'getMatrixTitles',
        /**
         * Custom function to get matrix row/column titles.
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @param params Array of parameters
         * @returns Array of row/column titles
         */
        function: function (this: { survey: SurveyModel }, params: any[]) {
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
        },
      },
      {
        name: 'length',
        /**
         * Get length of an array.
         * Example:
         * - expression: length({multiselect})
         * - returns: 3
         *
         * @param params Array
         * @returns Length of the array
         */
        function: (params: any[]) => {
          console.log('Calling length with params:', params);
          if (!Array.isArray(params[0])) return 0;
          return params[0].length;
        },
      },
      {
        name: 'parse',
        /**
         * Parse a JSON string.
         *
         * @param params JSON object
         * @returns Parsed JSON object
         */
        function: (params: any[]) => {
          if (!params[0]) return '';
          return JSON.parse(params[0]);
        },
      },
      {
        name: 'now',
        /**
         * Get current date in ISO format.
         * Example:
         * - expression: now()
         * - returns: 2024-06-12T14:23:30.123Z
         *
         * @returns Current date in ISO format.
         */
        function: () => {
          return new Date().toISOString();
        },
      },
    ];

  customFunctions.forEach(({ name, function: func }) => {
    if (FunctionFactory.Instance.hasFunction(name)) {
      FunctionFactory.Instance.unregister(name);
    }
    FunctionFactory.Instance.register(name, func);
  });
};

export default addCustomFunctions;
