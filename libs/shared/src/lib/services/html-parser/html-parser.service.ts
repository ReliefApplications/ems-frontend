import { inject, Injectable } from '@angular/core';
import { ceil, floor, get, isArray, isNil, max, min, round } from 'lodash';
import { Page } from '../../models/page.model';
import {
  applyFilters,
  applyTableStyle,
  checkNumberArguments,
  getFlatFields,
  getLayoutsStyle,
  getLayoutStyle,
  replaceAggregationData,
  replacePages,
} from './html-parser-helper';
import { DatePipe } from '../../pipes/date/date.pipe';
import { REFERENCE_DATA_END } from '../query-builder/query-builder.service';
import { ICON_EXTENSIONS } from '../../components/ui/core-grid/grid/grid.constants';

type Shape = 'circle' | 'square';

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

/**
 * Shared DOM service. Dom service is used to inject component on the go ( meaning without putting them in template directly ).
 * TODO: prefix
 */
@Injectable({
  providedIn: 'root',
})
export class HtmlParserService {
  /** Date pipe used for transforming date calc values */
  private datePipe = inject(DatePipe);
  /** Function for replacing aggregation data in html */
  replaceAggregationData = replaceAggregationData;

  /**
   * Definition of all supported functions for calculations inside the text of a
   * summary card
   */
  public calcFunctions: Record<
    string,
    { signature: string; call: (...args: string[]) => string }
  > = {
    round: {
      signature: 'round( value ; precision )',
      /**
       * Calculate the rounded value of a given value
       *
       * @param value The decimal value to round
       * @param precision The precision we want, in number of decimals (optional, default to 0)
       * @returns The rounded value
       */
      call: (value, precision = '0') => {
        const parsedValue = parseFloat(value);
        const parsedPrecision = parseInt(precision, 10);
        try {
          checkNumberArguments(parsedValue, parsedPrecision);
          return round(parsedValue, parsedPrecision).toString();
        } catch {
          return '0';
        }
      },
    },
    roundup: {
      signature: 'roundup( value ; precision )',
      /**
       * Calculate the rounded value of a given value
       *
       * @param value The decimal value to round
       * @param precision The precision we want, in number of decimals (optional, default to 0)
       * @returns The rounded value
       */
      call: (value, precision = '0') => {
        const parsedValue = parseFloat(value);
        const parsedPrecision = parseInt(precision, 10);
        try {
          checkNumberArguments(parsedValue, parsedPrecision);
          return ceil(parsedValue, parsedPrecision).toString();
        } catch {
          return '0';
        }
      },
    },
    rounddown: {
      signature: 'rounddown( value ; precision )',
      /**
       * Calculate the rounded value of a given value
       *
       * @param value The decimal value to round
       * @param precision The precision we want, in number of decimals (optional, default to 0)
       * @returns The rounded value
       */
      call: (value, precision = '0') => {
        const parsedValue = parseFloat(value);
        const parsedPrecision = parseInt(precision, 10);
        try {
          checkNumberArguments(parsedValue, parsedPrecision);
          return floor(parsedValue, parsedPrecision).toString();
        } catch {
          return '0';
        }
      },
    },
    percentage: {
      signature: 'percentage( value ; total ; precision )',
      /**
       * Transform a value as a percentage
       *
       * @param value The value to transform
       * @param total The total reference of the percentage (optional, default to 1)
       * @param precision The precision we want, in number of decimals (optional, default to 2)
       * @returns The value as a percentage
       */
      call: (value, total = '1', precision = '2') => {
        const percent = (parseFloat(value) / parseFloat(total)) * 100;
        const parsedPrecision = parseInt(precision, 10);
        try {
          checkNumberArguments(percent, parsedPrecision);
          return percent.toFixed(parsedPrecision) + '%';
        } catch {
          return '0';
        }
      },
    },
    min: {
      signature: 'min( value1 ; value2 ; ... )',
      /**
       * Get minimum value from array
       *
       * @param values array of values, must be separated in the template by ";"
       * @returns minimum value
       */
      call: (...values) => {
        // Ensure that the values are treated as numbers
        return min(values?.map((x) => Number(x)))?.toString() || '';
      },
    },
    max: {
      signature: 'max( value1 ; value2 ; ... )',
      /**
       * Get maximum value from array
       *
       * @param values array of values, must be separated in the template by ";"
       * @returns maximum value
       */
      call: (...values) => {
        // Ensure that the values are treated as numbers
        return max(values?.map((x) => Number(x)))?.toString() || '';
      },
    },
    date: {
      signature: 'date( value ; format )',
      call: (value, format) => {
        try {
          const spanRegex = /<span[^>]*>(.*?)<\/span>/gi;
          const spanContent = spanRegex.exec(value)?.[1]?.trim();
          const valueToFormat = !isNil(spanContent) ? spanContent : value;
          const formattedDate = this.datePipe.transform(
            new Date(valueToFormat),
            format
          ) as string;
          // Replace original value inside the span tag with the formatted value
          if (!isNil(spanContent)) {
            value = value.replace(spanContent, formattedDate || '');
          }
          return (!isNil(spanContent) ? value : formattedDate) || '';
        } catch {
          return '';
        }
      },
    },
  };

  /**
   * Apply the calc functions on the html body.
   *
   * @param html The html body on which we want to apply the functions
   * @returns The html body with the calculated result of the functions
   */
  private applyOperations(html: string): string {
    const regex = new RegExp(
      `${CALC_PREFIX}(\\w+)\\((.*?)\\)${PLACEHOLDER_SUFFIX}`,
      'gm'
    );
    let parsedHtml = html;
    let result = regex.exec(html);
    while (result !== null) {
      // get the function
      const calcFunc = get(this.calcFunctions, result[1]);
      if (calcFunc) {
        // get the arguments and clean the numbers to be parsed correctly
        const args =
          result[2]
            .match(/(?:<[^>]+>|[^<;]+)+/g)
            ?.map((arg) => {
              /** Make sure that the new date case does not break any previous clean up */
              return result?.[1] === 'date'
                ? arg.trim()
                : // Replace below replaces the space space between span and style property from arg as elements,
                  // breaking any style application from given element
                  arg.replace(/[\s,]/gm, '');
            })
            .filter((arg) => !!arg) || [];
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
  }

  /**
   * Replaces the html resource fields with the resource data.
   *
   * @param html String with the content html.
   * @param fieldsValue Content of the fields.
   * @param fields Available fields.
   * @param styles Array of layout styles.
   * @returns formatted html.
   */
  replaceRecordFields(
    html: string,
    fieldsValue: any,
    fields: any,
    styles: any[] = []
  ): string {
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

        let value = get(fieldsValue, field.name);
        // If object is of type resource, transform each associated record
        if (field.type === 'resources') {
          value = (value || []).map((x: any) => toReadableObject(x));
        } else {
          // Else, transform value into readable one
          value = toReadableObject(value);
        }

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
              convertedValue = `<a href="${value}" style="${style}" target="_blank">${this.applyLayoutFormat(
                value,
                field
              )}</a>`;
              break;
            }
            case 'email':
              convertedValue = `<a href="mailto:${value}"
                style="${style}"
                >
                ${this.applyLayoutFormat(value, field)}
                </a>`;
              break;
            case 'date':
              convertedValue =
                `<span style='${style}'>` +
                this.applyLayoutFormat(
                  new Date(value).toLocaleString('en').split(',')[0],
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
                this.applyLayoutFormat(
                  date.toLocaleString('en').split(',')[0] +
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
                  const fileName = this.applyLayoutFormat(
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
            case 'resources': {
              const length = value ? value.length : 0;
              convertedValue = `<span style='${style}'>${length} item${
                length > 1 ? 's' : ''
              }</span>`;
              break;
            }
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
              const formattedValue = this.applyLayoutFormat(value, field);
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
  }

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
  public parseHtml(
    html: string,
    options: {
      data?: any;
      aggregation?: any;
      fields?: any;
      pages?: any[];
      styles?: any[];
    }
  ) {
    let formattedHtml = replacePages(html, options.pages);
    if (Object.keys(options.aggregation || {})?.length) {
      formattedHtml = this.replaceAggregationData(
        formattedHtml,
        options.aggregation
      );
    }
    if (options.data) {
      formattedHtml = this.replaceRecordFields(
        formattedHtml,
        options.data,
        getFlatFields(options.fields),
        options.styles
      );
    }
    formattedHtml = applyTableStyle(formattedHtml);
    return this.applyOperations(formattedHtml);
  }

  /**
   * gets the style for the cards
   *
   * @param wholeCardStyles boolean
   * @param fieldsValue array of fields to apply the filters
   * @param styles available
   * @returns the html styles
   */
  public getCardStyle(
    wholeCardStyles = false,
    fieldsValue: any,
    styles: any[] = []
  ) {
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
  }

  /**
   * Returns an object with the record data keys paired with the values.
   *
   * @param record Record object.
   * @returns fields
   */
  public getFieldsValue(record: any) {
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
  }

  /**
   * Returns an array with the layout available fields.
   *
   * @param fields Array of fields.
   * @returns list of data keys
   */
  public getDataKeys(fields: any): { value: string; text: string }[] {
    return getFlatFields(fields).map((field: any) => ({
      value: DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX,
      text: DATA_PREFIX + field.name + PLACEHOLDER_SUFFIX,
    }));
  }

  /**
   * Returns an array with the keys for aggregation autocompletion.
   *
   * @param aggregations Array of aggregations.
   * @returns list of aggregation keys
   */
  public getAggregationKeys(
    aggregations: any[]
  ): { value: string; text: string }[] {
    return aggregations.map((aggregation: any) => ({
      value: AGGREGATION_PREFIX + aggregation.id + PLACEHOLDER_SUFFIX,
      text: AGGREGATION_PREFIX + aggregation.name + PLACEHOLDER_SUFFIX,
    }));
  }

  /**
   * Returns an array with the calc operations keys.
   *
   * @returns List of calc keys
   */
  public getCalcKeys(): { value: string; text: string }[] {
    const calcObjects = Object.values(this.calcFunctions);
    return calcObjects.map((obj) => ({
      value: CALC_PREFIX + obj.signature + PLACEHOLDER_SUFFIX,
      text: CALC_PREFIX + obj.signature + PLACEHOLDER_SUFFIX,
    }));
  }

  /**
   * Return an array with the page keys.
   *
   * @param pages array of pages
   * @returns list of page keys
   */
  public getPageKeys(pages: Page[]): { value: string; text: string }[] {
    return pages.map((page) => ({
      value: `{{page(${page.id})}}`,
      text: page.name || `{{page(${page.id})}}`,
    }));
  }

  /**
   * Applies layout field format ignoring html tags
   *
   * @param value Original value of the field
   * @param field Field information, used to get field name and format
   * @returns Formatted field value
   */
  public applyLayoutFormat(value: any, field: any): any {
    if (field.meta?.type === 'records') {
      // If using a display field, build a list of separated values
      if (field.displayField && isArray(value)) {
        return value
          .map((x) => get(x, field.displayField))
          .filter((x) => x)
          .join(`${field.separator} `);
      } else {
        return value;
      }
    }
    // Get choices from field
    const options = field.options ?? field.meta?.choices;
    if (options) {
      // replaces value for label, if it exists
      value = options.find((o: any) => o.value == value)?.text || value;
    }

    if (value && field.layoutFormat && field.layoutFormat.length > 1) {
      const regex = new RegExp(
        `${DATA_PREFIX}${field.name}\\b${PLACEHOLDER_SUFFIX}`,
        'gi'
      );
      const formattedValue = field.layoutFormat
        .replace(/<(.|\n)*?>/g, '')
        .replace(regex, value);
      return this.applyOperations(formattedValue);
    } else {
      return value;
    }
  }
}
