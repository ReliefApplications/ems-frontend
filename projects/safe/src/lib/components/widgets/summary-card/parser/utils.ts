import { get } from 'lodash';
import { Record } from '../../../../models/record.model';
import calcFunctions from './calcFunctions';

/** Prefix for data keys */
const DATA_PREFIX = '{{data.';
/** Prefix for calc keys */
const CALC_PREFIX = '{{calc.';
/** Suffix for all keys */
const SUFFIX = '}}';

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
    const regex = new RegExp(`${DATA_PREFIX}${key}\\b${SUFFIX}`, 'gi');
    formattedHtml = formattedHtml.replace(regex, value as string);
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
  // if (record !== undefined && record !== null) {
  //   for (const [key, value] of Object.entries(record)) {
  //     if (!key.startsWith('__') && key !== 'form') {
  //       if (value instanceof Object) {
  //         for (const [key2] of Object.entries(value)) {
  //           if (!key2.startsWith('__')) {
  //             fields.push(
  //               '@data.' + (key === 'data' ? '' : key + '.') + key2
  //             );
  //           }
  //         }
  //       } else {
  //         fields.push('@data.' + key);
  //       }
  //     }
  //   }
  // }
  return fields;
};

/**
 * Apply the calc functions on the html body.
 *
 * @param html The html body on which we want to apply the functions
 * @returns The html body with the calculated result of the functions
 */
const applyOperations = (html: string): string => {
  const regex = new RegExp(
    `${CALC_PREFIX}(\\w+)\\(([^\\)]+)\\)${SUFFIX}`,
    'gm'
  );
  let parsedHtml = html;
  let result = regex.exec(html);
  while (result !== null) {
    // get the function
    const calcFunc = get(calcFunctions, result[1]);
    if (calcFunc) {
      // get the arguments and clean the numbers to be parsed correctly
      const args = result[2]
        .split(';')
        .map((arg) => arg.replace(/[\s,]/gm, ''));
      // apply the function
      let resultText;
      try {
        resultText = calcFunc.call(...args);
      } catch (err: any) {
        resultText = `<span style="text-decoration: red wavy underline" title="${err.message}"> ${err.name}</span>`;
      }
      parsedHtml = parsedHtml.replace(result[0], resultText);
    }
    result = regex.exec(html);
  }
  return parsedHtml;
};

/**
 * Returns an array with the record data keys.
 *
 * @param record Record object.
 * @returns list of data keys
 */
export const getDataKeys = (record: Record | null): string[] => {
  const fields = getFieldsValue(record);
  return Object.keys(fields).map((field) => DATA_PREFIX + field + SUFFIX);
};

/**
 * Returns an array with the calc operations keys.
 *
 * @returns List of calc keys
 */
export const getCalcKeys = (): string[] => {
  const calcObjects = Object.values(calcFunctions);
  return calcObjects.map((obj) => CALC_PREFIX + obj.signature + SUFFIX);
};
