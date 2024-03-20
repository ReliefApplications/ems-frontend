import { get, isArray, isNil } from 'lodash';
import calcFunctions from './calcFunctions';
import { Page } from '../../models/page.model';
import { REFERENCE_DATA_END } from '../../services/query-builder/query-builder.service';
import { ICON_EXTENSIONS } from '../../components/ui/core-grid/grid/grid.constants';
import jsonpath from 'jsonpath';

/** Prefix for data keys */
const DATA_PREFIX = '{{data.';
/** Prefix for aggregation keys */
const AGGREGATION_PREFIX = '{{aggregation.';
/** Prefix for calc keys */
const CALC_PREFIX = '{{calc.';
/** Prefix for avatar keys */
const AVATAR_PREFIX = '{{avatars.';
/** Allowed image extensions */
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg', '.gif', '.bmp'];
/** Suffix for all keys */
const PLACEHOLDER_SUFFIX = '}}';

/**
 * Flattens the fields array, to also include the subfields of objects.
 *
 * @param fields Fields to flatten
 * @param path Current path to the field
 * @returns The flattened fields array
 */
const getFlatFields = (fields: any, path = ''): any => {
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
 * Parse the html body of a summary card with the content of a record,
 * and calculate the calc functions.
 *
 * @param html The html text.
 * @param options options
 * @param options.data available data
 * @param options.aggregation available aggregation data
 * @param options.fields Available fields.
 * @param options.pages list of application pages
 * @param options.styles Array of layout styles.
 * @returns The parsed html.
 */
export const parseHtml = (
  html: string,
  options: {
    data?: any;
    aggregation?: any;
    fields?: any;
    pages: any[];
    styles?: any[];
  }
) => {
  let formattedHtml = replacePages(html, options.pages);
  if (options.aggregation) {
    formattedHtml = replaceAggregationData(formattedHtml, options.aggregation);
  }
  if (options.data) {
    formattedHtml = replaceRecordFields(
      formattedHtml,
      options.data,
      getFlatFields(options.fields),
      options.styles
    );
  }
  return applyOperations(formattedHtml);
};

/**
 * gets the style for the cards
 *
 * @param wholeCardStyles boolean
 * @param fieldsValue array of fields to apply the filters
 * @param styles available
 * @returns the html styles
 */
export const getCardStyle = (
  wholeCardStyles: boolean = false,
  fieldsValue: any,
  styles: any[] = []
) => {
  if (wholeCardStyles) {
    let lastRowStyle = '';
    if (fieldsValue) {
      styles.map((style: any) => {
        if (style.fields.length === 0) {
          if (applyFilters(style.filter, fieldsValue)) {
            lastRowStyle = getLayoutStyle(style);
          }
        }
      });
    }
    return lastRowStyle;
  }
  return '';
};

/**
 * Replace page keys with links
 *
 * @param html html template
 * @param pages array of pages
 * @returns formatted html
 */
const replacePages = (html: string, pages: any[]): string => {
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
 * Replaces the html resource fields with the resource data.
 *
 * @param html String with the content html.
 * @param fieldsValue Content of the fields.
 * @param fields Available fields.
 * @param styles Array of layout styles.
 * @returns formatted html.
 */
const replaceRecordFields = (
  html: string,
  fieldsValue: any,
  fields: any,
  styles: any[] = []
): string => {
  let formattedHtml = html;
  if (fields) {
    // Regular expression for detecting when ="{{data.*}}" is used and
    // we should not interpret it, but keep the default attribute value
    const attributeRegex = /([a-zA-Z]+)="{{data\.(.*?)}}"/g;

    // Replace attributes with data binding expressions
    formattedHtml = formattedHtml.replace(
      attributeRegex,
      (match, attributeName, dataFieldName) => {
        // Check if it's an attribute with data binding
        if (attributeName && dataFieldName) {
          // Replace the attribute with the corresponding value
          const value = get(fieldsValue, dataFieldName);
          return !isNil(value) ? `${attributeName}="${value}"` : match;
        } else {
          // Return the original match if not a data binding attribute
          return match;
        }
      }
    );

    const links = formattedHtml.match(`href=["]?[^" >]+`);

    // We check for LIST fields and duplicate their only element for each subfield
    const listFields = fields.filter((field: any) => field.kind === 'LIST');
    listFields.forEach((field: any) => {
      const subFields = fields.filter((subField: any) =>
        subField.name.startsWith(field.name + '.[0]')
      );

      const length = get(fieldsValue, field.name)?.length ?? 0;
      // Start from 1 because we already have the first element (the one being used as a template)
      for (let i = 1; i < length; i++) {
        subFields.forEach((subField: any) => {
          const subFieldName = subField.name.replace(
            `${field.name}.[0]`,
            `${field.name}.[${i}]`
          );
          fields.push({
            ...subField,
            name: subFieldName,
          });
        });
      }
    });

    for (const field of fields) {
      const toReadableObject = (obj: any): any => {
        // If value exists keep checking
        if (obj) {
          if (typeof obj === 'object') {
            // If array, return mapped elements
            if (Array.isArray(obj)) {
              return obj.map((o) => toReadableObject(o)).join('<br>');
            } else {
              // If object, return object keys and values as strings
              return Object.keys(obj)
                .filter((key) => key !== '__typename')
                .map((key) => `${key}: ${obj[key]}`)
                .join(', ');
            }
          } else {
            // If not an object, return string representation
            return `${obj}`;
          }
        }
        // Return default undefined/null value if no obj
        return obj;
      };

      const value = toReadableObject(get(fieldsValue, field.name));

      const style = getLayoutsStyle(styles, field.name, fieldsValue);
      let convertedValue = '';
      // Inject avatars
      const avatarRgx = new RegExp(
        `{{avatars.(?<name>${DATA_PREFIX}${field.name}\\b${PLACEHOLDER_SUFFIX})( (?<shape>[a-z]+))? (?<width>[0-9]+) (?<height>[0-9]+) (?<maxItems>[0-9]+)}}`,
        'gi'
      );
      const matches = formattedHtml.matchAll(avatarRgx);
      for (const match of matches) {
        if (Array.isArray(value) && value.length > 0) {
          // Map value array to use only string values in case of reference data objects
          const checkedValue = value.map((v: any) => {
            const refData =
              v.__typename && v.__typename.endsWith(REFERENCE_DATA_END);
            let refDataValue = null;
            if (refData) {
              refDataValue = v[v.__typename.slice(0, -3)];
            }
            return refDataValue === null ? v : refDataValue;
          });
          const avatarValue = checkedValue.filter((v: string) => {
            if (typeof v === 'string') {
              const lowercaseValue = v.toLowerCase();
              return ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
                lowercaseValue.endsWith(ext)
              );
            } else {
              return false;
            }
          });
          if (avatarValue.length > 0) {
            const avatarGroup = createAvatarGroup(
              avatarValue,
              match?.groups?.shape as Shape,
              Number(match?.groups?.width),
              Number(match?.groups?.height),
              Number(match?.groups?.maxItems),
              document
            );
            formattedHtml = formattedHtml.replace(
              match[0],
              avatarGroup.innerHTML
            );
          }
        } else {
          formattedHtml = formattedHtml.replace(avatarRgx, '');
        }
      }
      if (!isNil(value)) {
        // First, try to find cases where the url is used as src of image or link
        const srcRegex = new RegExp(
          `src="${DATA_PREFIX}${field.name}\\b${PLACEHOLDER_SUFFIX}"`,
          'gi'
        );
        formattedHtml = formattedHtml.replace(srcRegex, `src=${value}`);

        // Prevent URL from containing style
        links?.forEach((link) => {
          if (
            link.match(`${DATA_PREFIX}${field.name}\\b${PLACEHOLDER_SUFFIX}`)
          ) {
            const formattedLink = link.replace(
              `${DATA_PREFIX}${field.name}${PLACEHOLDER_SUFFIX}`,
              value
            );
            formattedHtml = formattedHtml.replace(link, formattedLink);
          }
        });

        switch (field.type) {
          case 'url': {
            // Then, follow same logic than for other fields
            convertedValue = `<a href="${value}" style="${style}" target="_blank">${applyLayoutFormat(
              value,
              field
            )}</a>`;
            break;
          }
          case 'email':
            convertedValue = `<a href="mailto:${value}"
              style="${style}"
              >
              ${applyLayoutFormat(value, field)}
              </a>`;
            break;
          case 'date':
            convertedValue =
              `<span style='${style}'>` +
              applyLayoutFormat(
                new Date(value).toLocaleString().split(',')[0],
                field
              ) +
              '</span>';
            break;
          case 'datetime':
            const date = new Date(value);
            const hour =
              date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
            const minutes =
              date.getMinutes() < 10
                ? '0' + date.getMinutes()
                : date.getMinutes();
            const time = date.getHours() >= 12 ? 'PM' : 'AM';

            convertedValue =
              `<span style='${style}'>` +
              applyLayoutFormat(
                date.toLocaleString().split(',')[0] +
                  ', ' +
                  hour +
                  ':' +
                  minutes +
                  ' ' +
                  time,
                field
              ) +
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
            const fileArray = get(fieldsValue, field.name);
            if (isArray(fileArray)) {
              for (let i = 0; fileArray[i]; ) {
                const file = fileArray[i];
                const fileExt = file.name.split('.').pop();
                const fileIcon =
                  fileExt && ICON_EXTENSIONS[fileExt]
                    ? ICON_EXTENSIONS[fileExt]
                    : 'k-i-file';
                const fileName = applyLayoutFormat(
                  fileExt && ICON_EXTENSIONS[fileExt]
                    ? file.name.slice(0, file.name.lastIndexOf(fileExt) - 1)
                    : file.name,
                  field
                );
                convertedValue += `<button type="file"
                  field="${field.name}"
                  index="${i++}"
                  style="border: none; padding: 4px 6px; cursor: pointer; ${style}" title=
                  ${file.name}
                  >
                  <span class="k-icon ${fileIcon}" style="margin-right: 4px"></span>
                  ${fileName}
                  </button>`.replace(/\n/g, ''); // add elements to be able to identify file when clicking on button
              }
            }
            break;
          case 'owner':
          case 'users':
          case 'people':
          case 'resources':
            convertedValue = `<span style='${style}'>${
              value ? value.length : 0
            } items</span>`;
            break;
          case 'matrixdropdown':
          case 'matrixdynamic': {
            convertedValue = '<table><tr><th></th>';
            const rows =
              field.rows ??
              (Object.keys(value).map((row) => {
                return { label: row, name: row };
              }) ||
                []);
            const columns = field.columns || [];
            // Create header row with column names
            for (const col of columns) {
              convertedValue += `<th class="px-1">${col.label}</th>`;
            }

            convertedValue += '</tr>';

            // Create table rows with row names and data values
            for (const row of rows) {
              convertedValue += `<tr><th>${row.label}</th>`;

              for (const col of columns) {
                convertedValue += `<td class="text-right px-1">${
                  value[row.name]?.[col.name] ?? ''
                }</td>`;
              }

              convertedValue += '</tr>';
            }

            convertedValue += '</table>';
            break;
          }
          case 'matrix': {
            convertedValue = `<span style='${style}'>`;
            const rows = field.rows || [];
            for (const row of rows) {
              convertedValue += `${row.label}: ${value[row.name]} `;
            }
            convertedValue += '</span>';
            break;
          }
          default:
            const formattedValue = applyLayoutFormat(value, field);
            convertedValue = style
              ? `<span style='${style}'>${formattedValue}</span>`
              : isNil(formattedValue)
              ? ''
              : formattedValue;
            break;
        }
      }

      const escapeFieldNameForRegex = (fieldName: string): string =>
        fieldName.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

      const regex = new RegExp(
        `${DATA_PREFIX}${escapeFieldNameForRegex(
          field.name
        )}${PLACEHOLDER_SUFFIX}`,
        'gi'
      );
      formattedHtml = formattedHtml.replace(regex, convertedValue);
      const avatarCleanRegex = new RegExp(
        `${AVATAR_PREFIX}${field.name}[ 0-9]+${PLACEHOLDER_SUFFIX}`,
        'gi'
      );
      formattedHtml = formattedHtml.replace(avatarCleanRegex, convertedValue);
    }

    const regex = /{{data\.(.*?)}}/g;
    const replacedHtml = formattedHtml.replace(regex, (match, p1) => {
      // Replace the key with correct value
      return get(fieldsValue, p1, '');
    });
    formattedHtml = replacedHtml;
  }
  // replace all /n, removing it since we don't need because tailwind already styles it
  formattedHtml = formattedHtml.replace(/\n/g, '');
  return formattedHtml;
};

/**
 * Replace aggregation placeholders in template with aggregation data
 *
 * @param html html template
 * @param aggregation aggregation data
 * @returns formatted html
 */
const replaceAggregationData = (html: string, aggregation: any): string => {
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
  const regex = new RegExp(
    `${CALC_PREFIX}(\\w+)\\(([^\\)]+)\\)${PLACEHOLDER_SUFFIX}`,
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
 * Returns an array with the layout available fields.
 *
 * @param fields Array of fields.
 * @returns list of data keys
 */
export const getDataKeys = (fields: any): { value: string; text: string }[] => {
  return getFlatFields(fields).map((field: any) => ({
    value: DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX,
    text: DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX,
  }));
};

/**
 * Returns an array with the keys for aggregation autocompletion.
 *
 * @param aggregations Array of aggregations.
 * @returns list of aggregation keys
 */
export const getAggregationKeys = (
  aggregations: any[]
): { value: string; text: string }[] => {
  return aggregations.map((aggregation: any) => ({
    value: AGGREGATION_PREFIX + aggregation.id + PLACEHOLDER_SUFFIX,
    text: AGGREGATION_PREFIX + aggregation.name + PLACEHOLDER_SUFFIX,
  }));
};

/**
 * Returns an array with the calc operations keys.
 *
 * @returns List of calc keys
 */
export const getCalcKeys = (): { value: string; text: string }[] => {
  const calcObjects = Object.values(calcFunctions);
  return calcObjects.map((obj) => ({
    value: CALC_PREFIX + obj.signature + PLACEHOLDER_SUFFIX,
    text: CALC_PREFIX + obj.signature + PLACEHOLDER_SUFFIX,
  }));
};

/**
 * Return an array with the page keys.
 *
 * @param pages array of pages
 * @returns list of page keys
 */
export const getPageKeys = (
  pages: Page[]
): { value: string; text: string }[] => {
  return pages.map((page) => ({
    value: `{{page(${page.id})}}`,
    text: page.name || `{{page(${page.id})}}`,
  }));
};

/**
 * Applies layout field format ignoring html tags
 *
 * @param value Original value of the field
 * @param field Field information, used to get field name and format
 * @returns Formatted field value
 */
export const applyLayoutFormat = (value: any, field: any): any => {
  // replaces value for label, if it exists
  if (field.options)
    value = field.options.find((o: any) => o.value === value)?.text || value;

  if (value && field.layoutFormat && field.layoutFormat.length > 1) {
    const regex = new RegExp(
      `${DATA_PREFIX}${field.name}\\b${PLACEHOLDER_SUFFIX}`,
      'gi'
    );
    const formattedValue = field.layoutFormat
      .replace(/<(.|\n)*?>/g, '')
      .replace(regex, value);
    return applyOperations(formattedValue);
  } else {
    return value;
  }
};

/**
 * Loops through the layout styles and returns the last style that pass the filters
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

type Shape = 'circle' | 'square';

/**
 * Creates the html element faking an avatar group
 *
 * @param value Array of urls of the images
 * @param shape Shape of the avatars (circle or square for now)
 * @param width Width of the avatars
 * @param height Height of the avatars
 * @param maxItems Maximum number of avatars to show
 * @param document Document
 * @returns The html element
 */
const createAvatarGroup = (
  value: string[],
  shape: Shape | undefined,
  width: number | undefined,
  height: number | undefined,
  maxItems: number | undefined,
  document: Document
): HTMLElement => {
  const avatarGroup = document.createElement('avatar-group');
  const innerDiv = document.createElement('div');
  avatarGroup.appendChild(innerDiv);
  innerDiv.className = 'flex gap-1 overflow-hidden isolate';

  let shapeClass = '';
  switch (shape) {
    case 'circle':
      shapeClass = 'rounded-full';
      break;
    case 'square':
      shapeClass = 'rounded-md';
      break;
    default:
      shapeClass = 'rounded-full';
      break;
  }

  for (const image of value.slice(0, maxItems ? maxItems : value.length)) {
    const avatar = document.createElement('avatar');
    innerDiv.appendChild(avatar);

    const span = document.createElement('span');
    avatar.appendChild(span);

    span.className = `${shapeClass} bg-transparent block border-2 overflow-hidden ring-2 ring-transparent`;
    span.style.height = `${height}px`;
    span.style.width = `${width}px`;

    const img = document.createElement('img');
    span.appendChild(img);
    img.src = image;
    img.className = 'inline-block h-full w-full';
  }

  if (!isNil(maxItems) && maxItems > 0 && value.length > maxItems) {
    const avatar = document.createElement('avatar');
    innerDiv.appendChild(avatar);
    avatar.style.zIndex = '0';

    const span = document.createElement('span');
    avatar.appendChild(span);
    span.className = `${shapeClass} bg-gray-500 inline-flex items-center justify-center border-2 overflow-hidden ring-2 ring-transparent`;
    span.style.height = `${height}px`;
    span.style.width = `${width}px`;
    span.style.borderRadius = '50%';

    const innerSpan = document.createElement('span');
    span.appendChild(innerSpan);
    innerSpan.className = 'text-white text-xs font-medium leading-none';
    innerSpan.innerText = `+${value.length - maxItems}`;
  }

  return avatarGroup;
};
