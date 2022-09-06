import { get } from 'lodash';
import { Record } from '../../../../models/record.model';
import calcFunctions from './calcFunctions';

/** Prefix for data keys */
const DATA_PREFIX = '@data.';
/** Prefix for calc keys */
const CALC_PREFIX = '@calc.';

/**
 * Parse the html body of a summary card with the content of a record,
 * and calculate the calc functions.
 *
 * @param html The html text
 * @param record The record to fill the text with
 * @param fields Available fields
 * @returns The parsed html
 */
export const parseHtml = (html: string, record: Record | null, fields: any) => {
  if (record) {
    const htmlWithRecord = replaceRecordFields(html, record, fields);
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
 * @param fields Available fields
 * @returns formatted html
 */
const replaceRecordFields = (
  html: string,
  record: any,
  fields: any
): string => {
  const fieldsValue = getFieldsValue(record);
  let formattedHtml = html;
  if (fields) {
    for (const field of fields) {
      const value = fieldsValue[field.name];
      let convertedValue: any;

      // Formats urls
      if (
        field.type === 'String' &&
        value &&
        value.match(/(https?:\/\/[^\s]+)/)
      ) {
        convertedValue =
          '<a href="' + value + '" target="_blank">' + value + '</a>';
        // Formats emails
      } else if (
        field.type === 'String' &&
        value &&
        value.match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
      ) {
        convertedValue =
          '<a href="mailto: ' + value + '" target="_blank">' + value + '</a>';
        // Formats dates
      } else if (field.type === 'Date' && value) {
        const date = new Date(value);
        convertedValue = date.toLocaleString().split(',')[0];
        // Formats date and time
      } else if (field.type === 'DateTime' && value) {
        const date = new Date(value);
        const hour =
          date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        const minutes =
          date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        const time = date.getHours() >= 12 ? 'PM' : 'AM';
        convertedValue =
          date.toLocaleString().split(',')[0] +
          ', ' +
          hour +
          ':' +
          minutes +
          ' ' +
          time;
        // Formats booleans
      } else if (field.type === 'Boolean') {
        const checked = value ? 'checked' : '';
        convertedValue =
          '<input type="checkbox" style="margin: 0; height: 16px; width: 16px;" ' +
          checked +
          ' disabled></input>';
        // Formats file inputs
      } else if (field.type === 'JSON') {
        console.log(value);
        convertedValue = value;
      } else {
        convertedValue = fieldsValue[field.name];
      }

      const regex = new RegExp(`${DATA_PREFIX}${field.name}\\b`, 'gi');
      formattedHtml = formattedHtml.replace(regex, convertedValue as string);
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
  const regex = new RegExp(`${CALC_PREFIX}(\\w+)\\(([^\\)]+)\\)`, 'gm');
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
 * Returns an array with the layout available fields.
 *
 * @param fields Array of fields.
 * @returns list of data keys
 */
export const getDataKeys = (fields: any): string[] =>
  // const fields = getFieldsValue(record);
  // return Object.keys(fields).map((field) => DATA_PREFIX + field);
  fields.map((field: any) => DATA_PREFIX + field.name);

/**
 * Returns an array with the calc operations keys.
 *
 * @returns List of calc keys
 */
export const getCalcKeys = (): string[] => {
  const calcObjects = Object.values(calcFunctions);
  return calcObjects.map((obj) => CALC_PREFIX + obj.signature);
};
