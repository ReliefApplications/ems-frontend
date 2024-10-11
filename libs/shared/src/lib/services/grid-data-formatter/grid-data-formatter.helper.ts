import { get, isNil } from 'lodash';
import { GridField } from '../../models/grid.model';
import { ICON_EXTENSIONS } from '../../components/ui/core-grid/grid/grid.constants';

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
 * Removes file extension from the file name
 *
 * @param name Name of the file with the extension
 * @returns String with the name of the file without the extension
 */
export function removeFileExtension(name: string): string {
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
export function getFileIcon(name: string): string {
  const fileExt = name.split('.').pop();
  return fileExt && ICON_EXTENSIONS[fileExt]
    ? ICON_EXTENSIONS[fileExt]
    : 'k-i-file';
}

/**
 * Returns property value in object from path.
 *
 * @param item Item to get property of.
 * @param field parent field
 * @param parent parent field
 * @returns Value of the property.
 */
export function getPropertyValue(
  item: any,
  field: GridField,
  parent?: GridField
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
      return value.map(
        (x: any) => choices.find((choice) => choice.value == x)?.text || x
      );
    } else {
      if (parent) {
        value = get(item, field.name);
      }
      return meta.choices.find((x: any) => x.value == value)?.text || value;
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
