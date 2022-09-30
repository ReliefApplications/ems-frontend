import { get } from 'lodash';
import calcFunctions from './calcFunctions';

/** Prefix for data keys */
const DATA_PREFIX = '@data.';
/** Prefix for calc keys */
const CALC_PREFIX = '@calc.';

/**
 *
 */
const ICON_EXTENSIONS: any = {
  bmp: 'k-i-file-programming',
  csv: 'k-i-file-csv',
  doc: 'k-i-file-word',
  docm: 'k-i-file-word',
  docx: 'k-i-file-word',
  eml: 'k-i-file',
  epub: 'k-i-file',
  gif: 'k-i-file-video',
  gz: 'k-i-file-zip',
  htm: 'k-i-file-programming',
  html: 'k-i-file-programming',
  jpg: 'k-i-file-image',
  jpeg: 'k-i-file-image',
  msg: 'k-i-file',
  odp: 'k-i-file-presentation',
  odt: 'k-i-file-txt',
  ods: 'k-i-file-data',
  pdf: 'k-i-file-pdf',
  png: 'k-i-file-image',
  ppt: 'k-i-file-ppt',
  pptx: 'k-i-file-ppt',
  pptm: 'k-i-file-ppt',
  rtf: 'k-i-file-txt',
  txt: 'k-i-file-txt',
  xls: 'k-i-file-excel',
  xlsx: 'k-i-file-excel',
  xps: 'k-i-file',
  zip: 'k-i-file-zip',
  xlsm: 'k-i-file-excel',
  xml: 'k-i-file-excel',
};

/**
 * Parse the html body of a summary card with the content of a record,
 * and calculate the calc functions.
 *
 * @param html The html text.
 * @param fieldsValue Field value.
 * @param fields Available fields.
 * @param styles Array of layout styles.
 * @param wholeCardStyles Boolean indicating if styles should be applied to the wholecard.
 * @returns The parsed html.
 */
export const parseHtml = (
  html: string,
  fieldsValue: any,
  fields: any,
  styles?: any[],
  wholeCardStyles?: boolean
) => {
  if (fieldsValue) {
    const htmlWithRecord = replaceRecordFields(
      html,
      fieldsValue,
      fields,
      styles,
      wholeCardStyles
    );
    return applyOperations(htmlWithRecord);
  } else {
    return applyOperations(html);
  }
};

/**
 * Replaces the html resource fields with the resource data.
 *
 * @param html String with the content html.
 * @param fieldsValue Content of the fields.
 * @param fields Available fields.
 * @param styles Array of layout styles.
 * @param wholeCardStyles Boolean indicating if styles should be applied to the wholecard.
 * @returns formatted html.
 */
const replaceRecordFields = (
  html: string,
  fieldsValue: any[],
  fields: any,
  styles: any[] = [],
  wholeCardStyles: boolean = false
): string => {
  let formattedHtml = html;
  if (wholeCardStyles) {
    let lastRowStyle: any = null;
    styles.map((style: any) => {
      if (style.fields.length === 0) {
        lastRowStyle = style;
      }
    });
    if (lastRowStyle) {
      formattedHtml =
        `<div style='${getLayoutStyle(lastRowStyle)}'>` +
        formattedHtml +
        '</div>';
    }
  }
  if (fields) {
    for (const field of fields) {
      const value = fieldsValue[field.name];
      const style = getLayoutsStyle(styles, field.name, fields);
      let convertedValue: any;
      switch (field.type) {
        case 'url':
          convertedValue = `<a href="${value}" style="${style}" target="_blank">${value}</a>`;
          break;
        case 'email':
          convertedValue = `<a href="mailto: ${value}" style="${style}" target="_blank">${value}</a>`;
          break;
        case 'date':
          convertedValue =
            `<span style='${style}'>` +
            new Date(parseInt(value, 10)).toLocaleString().split(',')[0] +
            +'</span>';
          break;
        case 'datetime':
          const date = new Date(parseInt(value, 10));
          const hour =
            date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
          const minutes =
            date.getMinutes() < 10
              ? '0' + date.getMinutes()
              : date.getMinutes();
          const time = date.getHours() >= 12 ? 'PM' : 'AM';
          convertedValue =
            `<span style='${style}'>` +
            date.toLocaleString().split(',')[0] +
            ', ' +
            hour +
            ':' +
            minutes +
            ' ' +
            time +
            '</span>';
          break;
        case 'boolean':
          const checked = value ? 'checked' : '';
          convertedValue =
            '<input type="checkbox" style="margin: 0; height: 16px; width: 16px;" ' +
            checked +
            ' disabled></input>';
          break;
        case 'file':
          convertedValue = '';
          for (const file of value) {
            const fileExt = file.name.split('.').pop();
            const fileIcon =
              fileExt && ICON_EXTENSIONS[fileExt]
                ? ICON_EXTENSIONS[fileExt]
                : 'k-i-file';
            const fileName =
              fileExt && ICON_EXTENSIONS[fileExt]
                ? file.name.slice(0, file.name.lastIndexOf(fileExt) - 1)
                : file.name;
            convertedValue +=
              `<button style="border: none; padding: 4px 6px; ${style}" title="` +
              file.name +
              '">' +
              ' <span class="k-icon ' +
              fileIcon +
              '" style="margin-right: 4px"></span>' +
              fileName +
              '</button>';
          }
          break;
        case 'owner':
        case 'users':
        case 'resources':
          convertedValue = `<span style='${style}'>${value.lenght} items</span>`;
          break;
        default:
          convertedValue = `<span style='${style}'>${value}</span>`;
          break;
      }
      //   if ( field.type === 'url' && value ) { // Formats urls
      //     convertedValue =
      //       '<a href="' + value + '" target="_blank">' + value + '</a>';
      //   } else if ( field.type === 'email' && value ) { // Formats emails
      //     convertedValue =
      //       '<a href="mailto: ' + value + '" target="_blank">' + value + '</a>';
      //   } else if ( field.type === 'date' && value ) { // Formats dates
      //     const date = new Date(value);
      //     convertedValue = date.toLocaleString().split(',')[0];
      //   } else if (
      //     // Formats date and time
      //     field.type === 'DateTime' &&
      //     value
      //   ) {
      //     const date = new Date(value);
      //     const hour =
      //       date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
      //     const minutes =
      //       date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      //     const time = date.getHours() >= 12 ? 'PM' : 'AM';
      //     convertedValue =
      //       date.toLocaleString().split(',')[0] +
      //       ', ' +
      //       hour +
      //       ':' +
      //       minutes +
      //       ' ' +
      //       time;
      //   } else if (
      //     // Formats booleans
      //     field.type === 'Boolean'
      //   ) {
      //     const checked = value ? 'checked' : '';
      //     convertedValue =
      //       '<input type="checkbox" style="margin: 0; height: 16px; width: 16px;" ' +
      //       checked +
      //       ' disabled></input>';
      //   } else if (
      //     // Formats file inputs
      //     field.type === 'JSON' &&
      //     value &&
      //     value.length > 0 &&
      //     typeof value[0] !== 'string'
      //   ) {
      //     convertedValue = '';
      //     for (const file of value) {
      //       const fileExt = file.name.split('.').pop();
      //       const fileIcon =
      //         fileExt && ICON_EXTENSIONS[fileExt]
      //           ? ICON_EXTENSIONS[fileExt]
      //           : 'k-i-file';
      //       const fileName =
      //         fileExt && ICON_EXTENSIONS[fileExt]
      //           ? file.name.slice(0, file.name.lastIndexOf(fileExt) - 1)
      //           : file.name;
      //       convertedValue +=
      //         '<button style="border: none; padding: 4px 6px;" title="' +
      //         file.name +
      //         '">' +
      //         fileName +
      //         ' <span class="k-icon ' +
      //         fileIcon +
      //         '"></span>' +
      //         '</button>';
      //     }
      //   } else if (
      //     // Formats custom questions
      //     field.kind === 'LIST' &&
      //     value &&
      //     value.length > 0
      //   ) {
      //     convertedValue = value.length + ' items';
      //   } else {
      //     // Anything else
      //     convertedValue = value;
      //   }

      const regex = new RegExp(`${DATA_PREFIX}${field.name}\\b`, 'gi');
      formattedHtml = formattedHtml.replace(regex, convertedValue);
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
export const getFieldsValue = (record: any) => {
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

/**
 * Loops throught the layout styles and returns the last style that pass the filters
 *
 * @param layouts Array of layout styles
 * @param key The key of the actual property in the html
 * @param fields Array of available fields
 * @returns A string with the correct style to apply
 */
const getLayoutsStyle = (layouts: any, key: string, fields: any): string => {
  let style = '';
  layouts.map((layout: any) => {
    if (layout.fields.length === 0 || layout.fields.includes(key)) {
      if (applyFilters(layout.filter, fields)) {
        style = getLayoutStyle(layout);
      }
    }
  });
  return style;
};

/**
 * Get the css style of a layout style as a string
 *
 * @param layout Layout style
 * @returns Returns a string with all the styling
 */
const getLayoutStyle = (layout: any): string => {
  let style = '';
  if (layout.background.color) {
    style += `background-color: ${layout.background.color}; `;
  }
  if (layout.text.color) {
    style += `color: ${layout.text.color}; `;
  }
  if (layout.text.bold) {
    style += 'font-weight: bold; ';
  }
  if (layout.text.italic) {
    style += 'font-style: italic; ';
  }
  if (layout.text.underline) {
    style += 'text-decoration: underline; ';
  }
  return style;
};

/**
 * Apply the filter provided to the specified field
 *
 * @param filter Filter object
 * @param fields Array of fields
 * @returns Returns a boolean with the result of the filter
 */
const applyFilters = (filter: any, fields: any): boolean => {
  if (filter.logic) {
    for (let i = 0; filter.filters[i]; i++) {
      if (applyFilters(filter.filters[i], fields)) {
        if (filter.logic === 'or') {
          return true;
        }
      } else if (filter.logic === 'and') {
        return false;
      }
    }
    return filter.logic === 'or' ? false : true;
  } else {
    const value = fields[filter.field];
    switch (filter.operator) {
      case 'eq': {
        // equal
        return value === filter.value;
      }
      case 'neq': {
        // not equal
        return value !== filter.value;
      }
      case 'isnull': {
        return value === null;
      }
      case 'isnotnull': {
        return value !== null;
      }
      case 'lt': {
        // lesser
        return value < filter.value;
      }
      case 'lte': {
        // lesser or equal
        return value <= filter.value;
      }
      case 'gt': {
        // greater
        return value > filter.value;
      }
      case 'gte': {
        // greater or equal
        return value >= filter.value;
      }
      case 'startswith': {
        if (!value) {
          return false;
        }
        return value[0] === filter.value;
      }
      case 'endswith': {
        if (!value) {
          return false;
        }
        return value[value.length] === filter.value;
      }
      case 'contains': {
        if (!value) {
          return false;
        }
        for (let i = 0; value[i]; i++) {
          if (value[i] === filter.value) {
            return true;
          }
        }
        return false;
      }
      case 'doesnotcontain': {
        if (!value) {
          return true;
        }
        for (let i = 0; value[i]; i++) {
          if (value[i] === filter.value) {
            return false;
          }
        }
        return true;
      }
      case 'isempty': {
        if (!value) {
          return true;
        }
        return value.length <= 0;
      }
      case 'isnotempty': {
        if (!value) {
          return false;
        }
        return value.length > 0;
      }
      default: {
        return false;
      }
    }
  }
};
