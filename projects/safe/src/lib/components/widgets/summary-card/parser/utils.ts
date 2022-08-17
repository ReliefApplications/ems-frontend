import { get } from 'lodash';
import { Record } from '../../../../models/record.model';
import calcFunctions from './calcFunctions';

/**
 * Parse the html body of a summary card with the content of a record,
 * and calculate the calc functions.
 *
 * @param html The html text
 * @param record The record to fill the text with
 * @returns The parsed html
 */
export const parseHtml = (html: string, record: Record | null) => {
  if (record) {
    const htmlWithRecord = replaceRecordFields(html, record);
    return applyOperations(htmlWithRecord);
  } else {
    return applyOperations(html);
  }
};

/**
 * Replaces the html resource fields with the resource data.
 *
 * @param html String with the content html.
 * @param record Record object.
 * @returns formatted html
 */
const replaceRecordFields = (html: string, record: any): string => {
  const fields = getFieldsValue(record);
  let formattedHtml = html;
  for (const [key, value] of Object.entries(fields)) {
    if (value) {
      const regex = new RegExp(`@\\bdata.${key}\\b`, 'gi');
      formattedHtml = formattedHtml.replace(regex, value as string);
    }
  }
  return formattedHtml;
};

/**
 * Returns an object with the record data keys paired with the values.
 *
 * @param record Record object.
 * @returns fields
 */
const getFieldsValue = (record: any) => {
  const fields: any = {};
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith('__') && key !== 'form') {
      if (value instanceof Object) {
        for (const [key2, value2] of Object.entries(value)) {
          if (!key2.startsWith('__')) {
            fields[(key === 'data' ? '' : key + '.') + key2] = value2;
          }
        }
      } else {
        fields[key] = value;
      }
    }
  }
  return fields;
};

/**
 * Apply the calc functions on the html body.
 *
 * @param html The html body on which we want to apply the functions
 * @returns The html body with the calculated result of the functions
 */
const applyOperations = (html: string): string => {
  const regex = /@calc\.(\w+)\(([^\)]+)\)/gm;
  let parsedHtml = html;
  // search the first operation
  let result = regex.exec(parsedHtml);
  while (result !== null) {
    // get the function
    const calcFunc = getCalcFunction(result[1]);
    // get the arguments and clean the numbers to be parsed correctly
    const args = result[2].split(';').map((arg) => arg.replace(/[\s,]/gm, ''));
    // apply the function
    const resultText = calcFunc(...args);
    parsedHtml = parsedHtml.replace(result[0], resultText);
    // search the next operation
    regex.lastIndex = 0;
    result = regex.exec(parsedHtml);
  }
  return parsedHtml;
};

/**
 * Get the function corresponding to the operation
 *
 * @param funcName The name of the function
 * @returns A function corresponding to the operation
 */
const getCalcFunction = (funcName: string) => {
  const func = get(calcFunctions, funcName);
  if (func) {
    return func.call;
  } else {
    return () => `[@calc.${funcName} is unknown]`;
  }
};
