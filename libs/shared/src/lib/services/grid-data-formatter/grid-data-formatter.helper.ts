import { get, isNil } from 'lodash';
import { GridField } from '../../models/grid.model';
import { resolveLocalizedString } from '../../models/localized-string.model';

/**
 * Returns field style from path.
 *
 * @param item Item to get style of.
 * @param path Path of the property.
 * @returns Style for the property.
 */
export function getStyle(item: any, path: string): any {
  const fieldStyle = get(item, `_meta.style.${path}`);
  const rowStyle = get(item, '_meta.style._row');
  return fieldStyle ? fieldStyle : rowStyle;
}

/**
 * Returns full URL value.
 *
 * @param url Initial URL.
 * @returns full valid URL.
 */
export function getUrl(url: string): URL | null {
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
 * Returns property value in object from path.
 *
 * @param item Item to get property of.
 * @param field parent field
 * @param parent parent field
 * @param locale active language code, used to resolve localized choice text
 * @returns Value of the property.
 */
export function getPropertyValue(
  item: any,
  field: GridField,
  parent?: GridField,
  locale?: string | null
): any {
  let value = get(item, parent ? parent.name : field.name);
  const meta = field.meta;
  if (meta.choices) {
    if (Array.isArray(value)) {
      if (parent) {
        if (meta.graphQLFieldName) {
          value = value.map((x) => get(x, meta.graphQLFieldName as string));
        }
      }
      const choices = (meta.choices || []).filter((x) => !isNil(x.value));
      return value.map((x: any) => {
        const choice = choices.find((c) => c.value == x);
        return resolveLocalizedString(choice?.text, locale) || x;
      });
    } else {
      if (parent) {
        value = get(item, field.name);
      }
      const choice = meta.choices.find((x: any) => x.value == value);
      return resolveLocalizedString(choice?.text, locale) || value;
    }
  } else {
    if (meta.type === 'geospatial') {
      return [
        get(value, 'properties.address'),
        get(value, 'properties.countryName'),
      ]
        .filter((x) => x)
        .join(', ');
    }
    return value;
  }
}
