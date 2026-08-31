import { isArray, isEqual, isNil } from 'lodash';
import { Record } from '../models/record.model';
import { DEFAULT_DATE_TIMEZONE, DatePipe } from '../pipes/date/date.pipe';
import { AuthService } from '../services/auth/auth.service';
import {
  FunctionFactory,
  QuestionMatrixDropdownModel,
  QuestionMatrixDynamicModel,
  QuestionMatrixModel,
  SurveyModel,
} from 'survey-core';

/**
 * Category buckets used to group custom functions in the reference panel.
 */
export type CustomFunctionCategory =
  | 'record'
  | 'date'
  | 'matrix'
  | 'array'
  | 'string'
  | 'misc';

/**
 * Static metadata describing a custom function for the reference panel.
 */
export interface CustomFunctionMeta {
  name: string;
  signature: string;
  description: string;
  example?: string;
  category: CustomFunctionCategory;
}

/**
 * Metadata for every function registered by {@link addCustomFunctions}.
 * Keep entries in sync with the registrations below.
 */
export const CUSTOM_FUNCTIONS_META: CustomFunctionMeta[] = [
  /** Creation date of the current record (or now() if new). */
  {
    name: 'createdAt',
    signature: 'createdAt()',
    description: 'Creation date of the current record (or now() if new).',
    category: 'record',
  },
  /** Last modification date of the current record. */
  {
    name: 'modifiedAt',
    signature: 'modifiedAt()',
    description: 'Last modification date of the current record.',
    category: 'record',
  },
  /** Name of the user who created the record. */
  {
    name: 'createdBy',
    signature: 'createdBy()',
    description: 'Name of the user who created the record.',
    category: 'record',
  },
  /** Internal ID of the current record. */
  {
    name: 'id',
    signature: 'id()',
    description: 'Internal ID of the current record.',
    category: 'record',
  },
  /** Incremental ID of the current record. */
  {
    name: 'incrementalId',
    signature: 'incrementalId()',
    description: 'Incremental ID of the current record.',
    category: 'record',
  },
  /** Returns the display value (choice text) of a question. */
  {
    name: 'displayValue',
    signature: "displayValue('questionName')",
    description: 'Returns the display value (choice text) of a question.',
    example: "displayValue('country') = 'France'",
    category: 'misc',
  },
  /** Day of the week of a date (0 = Sunday, 6 = Saturday). */
  {
    name: 'weekday',
    signature: 'weekday(date)',
    description: 'Day of the week of a date (0 = Sunday, 6 = Saturday).',
    example: 'weekday(now()) = 3',
    category: 'date',
  },
  /** Returns a new date with the given number of days added. */
  {
    name: 'addDays',
    signature: 'addDays(date, days)',
    description: 'Returns a new date with the given number of days added.',
    category: 'date',
  },
  /** Current date in ISO format. */
  {
    name: 'now',
    signature: 'now()',
    description: 'Current date in ISO format.',
    example: 'now() = 2024-06-12T14:23:30.123Z',
    category: 'date',
  },
  /** Formats a date value using Angular DatePipe. Defaults to UTC timezone. */
  {
    name: 'formatDate',
    signature: 'formatDate(value, format, timezone?)',
    description:
      'Formats a date using Angular DatePipe. Timezone is optional and defaults to UTC.',
    example: "formatDate({created_at}, 'dd/MM/yyyy HH:mm', 'UTC')",
    category: 'date',
  },
  /** Rows of a matrix where the column equals the given value. */
  {
    name: 'listRowsWithColValue',
    signature: "listRowsWithColValue('matrix', 'col', value)",
    description: 'Rows of a matrix where the column equals the given value.',
    category: 'matrix',
  },
  /** For each row name, formatted string of its column values. */
  {
    name: 'listColsForRows',
    signature: "listColsForRows('matrix', rows)",
    description: 'For each row name, formatted string of its column values.',
    category: 'matrix',
  },
  /** Resolves matrix row or column names to their display titles. */
  {
    name: 'getMatrixTitles',
    signature: "getMatrixTitles('matrix', names, isRow?)",
    description: 'Resolves matrix row or column names to their display titles.',
    category: 'matrix',
  },
  /** Intersection of two arrays (deep equality). */
  {
    name: 'intersect',
    signature: 'intersect(arrayA, arrayB)',
    description: 'Intersection of two arrays (deep equality).',
    category: 'array',
  },
  /** Length of an array. Returns 0 if not an array. */
  {
    name: 'length',
    signature: 'length(array)',
    description: 'Length of an array. Returns 0 if not an array.',
    example: 'length({multiselect}) = 3',
    category: 'array',
  },
  /** Replaces newline characters with <br> tags. */
  {
    name: 'nl2br',
    signature: 'nl2br(text)',
    description: 'Replaces newline characters with <br> tags.',
    category: 'string',
  },
  /** Parses a JSON string into an object. */
  {
    name: 'parse',
    signature: 'parse(jsonString)',
    description: 'Parses a JSON string into an object.',
    category: 'string',
  },
];

/**
 * Registration of new custom functions for the survey.
 * Custom functions can be used in the logic fields.
 *
 * @param authService Shared auth service
 * @param datePipe Shared date pipe
 */
const addCustomFunctions = (
  authService: AuthService,
  datePipe: DatePipe
): void => {
  const formatDateValue = (params: unknown[]): string => {
    const [value, format = 'mediumDate', timezone = DEFAULT_DATE_TIMEZONE] =
      params;
    if (isNil(value) || value === '') {
      return '';
    }

    try {
      return (
        datePipe.transform(
          value as string | number | Date,
          `${format}`,
          `${timezone || DEFAULT_DATE_TIMEZONE}`
        ) || ''
      );
    } catch {
      return '';
    }
  };

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
          const record = this.survey.record as Record | undefined;
          return record ? record.id : 'unknown id';
        },
      },
      {
        name: 'incrementalId',
        /**
         * Get the incremental ID of the record.
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @returns Incremental ID of the record
         */
        function: function (this: { survey: SurveyModel }) {
          const record = this.survey.getPropertyValue('record') as
            | Record
            | undefined;
          return record?.incrementalId ?? '';
        },
      },
      {
        name: 'displayValue',
        /**
         * Get the display value of a question (the choice text rather than
         * the underlying value). Useful in expressions where {questionName}
         * resolves to the raw value only.
         * Example:
         * - expression: displayValue('country') = 'France'
         *
         * @param this Context
         * @param this.survey Current survey instance
         * @param params Question name
         * @returns Display value of the question, or '' if not found
         */
        function: function (this: { survey: SurveyModel }, params: any[]) {
          const question = this.survey.getQuestionByName(params[0]);
          return question ? question.displayValue : '';
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
      {
        name: 'formatDate',
        /**
         * Format a date or datetime value using Angular DatePipe.
         *
         * @param params Date value, Angular date format, optional timezone
         * @returns Formatted date or empty string when invalid
         */
        function: (params: unknown[]) => formatDateValue(params),
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
