import { get } from 'lodash';
import { applyLayoutFormat } from '../../../../../utils/parser/utils';
import { SafeDatePipe } from '../../../../../pipes/date/date.pipe';
import { ICON_EXTENSIONS } from '../grid.constants';

/** Keys added to grid row to display data in the html grid template */
export const FORMAT_KEYS = [
  'style',
  'text',
  'icon',
  'urlValue',
  'value',
  'showFullScreenButton',
];

/**
 * Grid field interface
 */
export interface GridField {
  name: string;
  title: string;
  type: string;
  format: string;
  editor: string;
  filter: string;
  meta: Meta;
  disabled: boolean;
  hidden: boolean;
  width: number;
  order: number;
  canSee: boolean;
}

/**
 * Meta property from grid field
 */
export interface Meta {
  type?: string;
  name: string;
  readOnly: boolean;
  permissions: Permissions;
}

/**
 * Permissions property from meta property inside grid field
 */
export interface Permissions {
  canSee: boolean;
  canUpdate: boolean;
}

/**
 * Format given row data to be suitable suitable for the grid
 *
 * @param rowData Data from grid row
 * @param {GridField[]} fields Grid fields
 * @param {SafeDatePipe} safeDatePipe Pipe to format date/time type fields
 */
export function formatGridRowData(
  rowData: any,
  fields: GridField[],
  safeDatePipe: SafeDatePipe
) {
  // Helpers to assign formatted values for each row
  const styleObj = {
    style: {},
  };
  const textObj = {
    text: {},
  };
  const iconObj = {
    icon: {},
  };
  const urlObj = {
    urlValue: {},
  };
  const valueObj = {
    value: {},
  };
  const showFullScreenButtonObj = {
    showFullScreenButton: {},
  };
  fields
    .filter((field) => !!rowData[field.name])
    .forEach((field) => {
      // Format styling for each field
      Object.assign(styleObj.style, {
        [field.name]: getStyle(rowData, field.name),
      });
      // Format text for each field
      if (!(field.type === 'JSON' && field.meta.type === 'file')) {
        // Format text text for each field
        const text = getFieldText(rowData, field, safeDatePipe);
        Object.assign(textObj.text, {
          [field.name]: text,
        });
        // Format url if exists for each field
        if (field.meta.type === 'url') {
          const url = getUrl(getPropertyValue(rowData, field));
          Object.assign(urlObj.urlValue, {
            [field.name]: url,
          });
        }
        // Format value for email and telephone if exists for each field
        if (field.meta.type === 'email' || field.meta.type === 'tel') {
          const value = getPropertyValue(rowData, field);
          Object.assign(valueObj.value, {
            [field.name]: value,
          });
        }
        // Initialize property to display the kendo button used to open the grid cell content in a modal
        Object.assign(showFullScreenButtonObj.showFullScreenButton, {
          [field.name]: false,
        });
      } else {
        // Format files name and icons for each field
        rowData[field.name].forEach((file: { name: string }) => {
          const text = applyFieldFormat(removeFileExtension(file.name), field);
          Object.assign(textObj.text, {
            [field.name]: {
              [file.name]: text,
            },
          });
          const icon = 'k-icon ' + getFileIcon(file.name);
          Object.assign(iconObj.icon, {
            [file.name]: icon,
          });
        });
      }
    });
  // General properties
  Object.assign(rowData, styleObj);
  Object.assign(rowData, textObj);
  // Specific types for each field and meta
  Object.assign(rowData, iconObj);
  Object.assign(rowData, urlObj);
  Object.assign(rowData, valueObj);
  Object.assign(rowData, showFullScreenButtonObj);
}

/**
 * Returns field style from path.
 *
 * @param item Item to get style of.
 * @param path Path of the property.
 * @returns Style for the property.
 */
function getStyle(item: any, path: string): any {
  const fieldStyle = get(item, `_meta.style.${path}`);
  const rowStyle = get(item, '_meta.style._row');
  return fieldStyle ? fieldStyle : rowStyle;
}

/**
 * Calls layout format from utils.ts to get the formatted fields
 *
 * @param name Content of the field as a string
 * @param field Field data
 * @returns Formatted field content as a string
 */
export function applyFieldFormat(
  name: string | null,
  field: any
): string | null {
  return applyLayoutFormat(name, field);
}

/**
 * Get the field text from the given row data object for the given field
 *
 * @param rowData grid row data object
 * @param {GridField} field field from which take and format data from the given row
 * @param {SafeDatePipe} safeDatePipe SafeDate pipe to format date/time options
 * @returns {string} formated by field type text content
 */
function getFieldText(
  rowData: any,
  field: GridField,
  safeDatePipe: SafeDatePipe
) {
  let finalText: any = '';
  switch (field.meta.type) {
    case 'time':
      finalText = applyFieldFormat(
        safeDatePipe.transform(getPropertyValue(rowData, field), 'shortTime'),
        field
      );
      break;
    case 'datetime':
    case 'datetime-local':
      finalText = applyFieldFormat(
        safeDatePipe.transform(getPropertyValue(rowData, field), 'short'),
        field
      );
      break;
    case 'date':
      finalText = applyFieldFormat(
        safeDatePipe.transform(getPropertyValue(rowData, field), 'shortDate'),
        field
      );
      break;
    default:
      finalText = applyFieldFormat(getPropertyValue(rowData, field), field);
      break;
  }
  return finalText ?? '';
}

/**
 * Returns full URL value.
 *
 * @param url Initial URL.
 * @returns full valid URL.
 */
function getUrl(url: string): URL | null {
  if (url && !(url.startsWith('https://') || url.startsWith('http://'))) {
    url = 'https://' + url;
  }
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

/**
 * Removes file extension from the file name
 *
 * @param name Name of the file with the extension
 * @returns String with the name of the file without the extension
 */
function removeFileExtension(name: string): string {
  const fileExt = name.split('.').pop();
  return fileExt && ICON_EXTENSIONS[fileExt]
    ? name.slice(0, name.lastIndexOf(fileExt) - 1)
    : name;
}

/**
 * Gets the kendo class icon for the file extension
 *
 * @param name Name of the file with the extension
 * @returns String with the name of the icon class
 */
function getFileIcon(name: string): string {
  const fileExt = name.split('.').pop();
  return fileExt && ICON_EXTENSIONS[fileExt]
    ? ICON_EXTENSIONS[fileExt]
    : 'k-i-file';
}

// === DATA ===
/**
 * Returns property value in object from path.
 *
 * @param item Item to get property of.
 * @param field parent field
 * @param subField subfield ( optional, used by reference data)
 * @returns Value of the property.
 */
function getPropertyValue(item: any, field: any, subField?: any): any {
  let value = get(item, field.name);
  const meta = subField ? subField.meta : field.meta;
  if (meta.choices) {
    if (Array.isArray(value)) {
      if (subField) {
        if (meta.graphQLFieldName) {
          value = value.map((x) => get(x, meta.graphQLFieldName));
        }
      }
      const text = meta.choices.reduce(
        (acc: string[], x: any) =>
          value.includes(x.value) ? acc.concat([x.text]) : acc,
        []
      );
      if (text.length < value.length) {
        return value;
      } else {
        return text;
      }
    } else {
      return meta.choices.find((x: any) => x.value === value)?.text || value;
    }
  } else {
    return value;
  }
}
