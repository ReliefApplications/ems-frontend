import { get, isArray, isNil } from 'lodash';
import calcFunctions from './calcFunctions';
import { Page } from '../../models/page.model';
import { REFERENCE_DATA_END } from '../../services/query-builder/query-builder.service';

/** Prefix for data keys */
const DATA_PREFIX = '{{data.';
/** Prefix for calc keys */
const CALC_PREFIX = '{{calc.';
/** Prefix for avatar keys */
const AVATAR_PREFIX = '{{avatars.';
/** Allowed image extensions */
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg', '.gif', '.bmp'];
/** Suffix for all keys */
const PLACEHOLDER_SUFFIX = '}}';

/**
 * Mapping of file types / kendo icons.
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
 * @param pages list of application pages
 * @param styles Array of layout styles.
 * @returns The parsed html.
 */
export const parseHtml = (
  html: string,
  fieldsValue: any,
  fields: any,
  pages: any[],
  styles?: any[]
) => {
  const htmlWithLinks = replacePages(html, pages);
  if (fieldsValue) {
    const htmlWithRecord = replaceRecordFields(
      htmlWithLinks,
      fieldsValue,
      fields,
      styles
    );
    return applyOperations(htmlWithRecord);
  } else {
    return applyOperations(htmlWithLinks);
  }
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
    const links = formattedHtml.match(`href=["]?[^" >]+`);

    for (const field of fields) {
      const value = fieldsValue[field.name];
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
              Number(match?.groups?.maxItems)
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
            if (isArray(value)) {
              for (let i = 0; value[i]; ) {
                const file = value[i];
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
          case 'resources':
            convertedValue = `<span style='${style}'>${
              value ? value.length : 0
            } items</span>`;
            break;
          default:
            convertedValue = style
              ? `<span style='${style}'>${applyLayoutFormat(
                  value,
                  field
                )}</span>`
              : applyLayoutFormat(value, field) || '';
            break;
        }
      }

      const regex = new RegExp(
        `${DATA_PREFIX}${field.name}\\b${PLACEHOLDER_SUFFIX}`,
        'gi'
      );
      formattedHtml = formattedHtml.replace(regex, convertedValue);
      const avatarCleanRegex = new RegExp(
        `${AVATAR_PREFIX}${field.name}[ 0-9]+${PLACEHOLDER_SUFFIX}`,
        'gi'
      );
      formattedHtml = formattedHtml.replace(avatarCleanRegex, convertedValue);
    }
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
export const getDataKeys = (fields: any): { value: string; text: string }[] =>
  fields.map((field: any) => ({
    value: DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX,
    text: DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX,
  }));

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
 * @param name Original value of the field
 * @param field Field information, used to get field name and format
 * @returns Formatted field value
 */
export const applyLayoutFormat = (
  name: string | null,
  field: any
): string | null => {
  // replaces value for label, if it exists
  if (field.options)
    name = field.options.find((o: any) => o.value === name)?.text || name;

  if (name && field.layoutFormat && field.layoutFormat.length > 1) {
    const regex = new RegExp(
      `${DATA_PREFIX}${field.name}\\b${PLACEHOLDER_SUFFIX}`,
      'gi'
    );
    const value = field.layoutFormat
      .replace(/<(.|\n)*?>/g, '')
      .replace(regex, name);
    return applyOperations(value);
  } else {
    return name;
  }
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
 * @returns The html element
 */
const createAvatarGroup = (
  value: string[],
  shape: Shape | undefined,
  width: number | undefined,
  height: number | undefined,
  maxItems: number | undefined
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
