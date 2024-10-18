import { get } from 'lodash';
import jsonpath from 'jsonpath';

/**
 * Loops through the layout styles and returns the last style that pass the filters
 *
 * @param layouts Array of layout styles
 * @param key The key of the actual property in the html
 * @param fields Array of available fields
 * @returns A string with the correct style to apply
 */
export const getLayoutsStyle = (
  layouts: any,
  key: string,
  fields: any
): string => {
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
 * Flattens the fields array, to also include the subfields of objects.
 *
 * @param fields Fields to flatten
 * @param path Current path to the field
 * @returns The flattened fields array
 */
export const getFlatFields = (fields: any, path = ''): any => {
  const flatFields: any = [];

  fields.forEach((field: any) => {
    flatFields.push({
      ...field,
      name: path + field.name,
    });

    // If an object, also include its subfields as data keys
    if (field.kind === 'OBJECT') {
      flatFields.push(...getFlatFields(field.fields, path + field.name + '.'));
    } else if (field.kind === 'LIST') {
      flatFields.push(
        ...getFlatFields(field.fields, path + field.name + '.[0].')
      );
    }
  });

  return flatFields;
};

/**
 * Function to apply table width based on existing 'border' property
 *
 * @param formattedHtml html to parse
 * @returns formatted html string
 */
export const applyTableStyle = (formattedHtml: string) => {
  if (!formattedHtml.includes('table')) {
    return formattedHtml;
  }
  // Create a temporary container element to work with the HTML string
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = formattedHtml;

  const applyChildStyle = (table: HTMLTableElement, tag: 'th' | 'td') => {
    const elements = table.querySelectorAll(tag);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (table.style.borderColor && !element.style.borderColor) {
        element.style.borderColor = table.style.borderColor;
      }
      if (table.style.borderWidth && !element.style.borderWidth) {
        element.style.borderWidth = table.style.borderWidth;
      }
    }
  };

  // Find all table elements within the temporary container
  const tables = tempDiv.getElementsByTagName('table');

  // Loop through each table element
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    applyChildStyle(table, 'th');
    applyChildStyle(table, 'td');
    table.style.borderWidth = `${table.getAttribute('border')}px` || '';
  }

  // Return the modified HTML content as a string
  return tempDiv.innerHTML;
};

/**
 * Replace page keys with links
 *
 * @param html html template
 * @param pages array of pages
 * @returns formatted html
 */
export const replacePages = (html: string, pages: any[]): string => {
  let formattedHtml = html;
  if (pages) {
    for (const page of pages) {
      const regex = new RegExp(`{{page\\(${page.id}\\b\\)}}`, 'gi');
      formattedHtml = formattedHtml.replace(regex, page.url);
    }
  }
  return formattedHtml;
};

/**
 * Replace aggregation placeholders in template with aggregation data
 *
 * @param html html template
 * @param aggregation aggregation data
 * @returns formatted html
 */
export const replaceAggregationData = (
  html: string,
  aggregation: any
): string => {
  let formattedHtml = html;

  for (const key of Object.keys(aggregation)) {
    const regex = new RegExp(`{{aggregation\\.${key}\\.(.*?)}}`, 'g');
    const replacedHtml = formattedHtml.replace(regex, (match, p1) => {
      try {
        // Replace the key with correct value
        return jsonpath.query(get(aggregation, key), p1)[0] || '';
      } catch {
        return '';
      }
    });
    formattedHtml = replacedHtml;
  }
  // replace all /n, removing it since we don't need because tailwind already styles it
  formattedHtml = formattedHtml.replace(/\n/g, '');
  return formattedHtml;
};

/**
 * Get the css style of a layout style as a string
 *
 * @param layout Layout style
 * @returns Returns a string with all the styling
 */
export const getLayoutStyle = (layout: any): string => {
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
export const applyFilters = (filter: any, fields: any): boolean => {
  if (filter.logic) {
    const exp = filter.logic === 'or' ? 'some' : 'every';
    return filter.filters[exp]((f: any) => applyFilters(f, fields));
  }

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
};

/**
 * Check that all arguments are number
 * Throw an error if not
 *
 * @param {...any} args calc function arguments
 */
export const checkNumberArguments = (...args: any): void => {
  for (const arg of args) {
    if (isNaN(arg)) {
      const err = new Error('One of the arguments is not a number');
      err.name = 'NaN';
      throw err;
    }
  }
  return;
};
