import { ICON_EXTENSIONS } from './file.constants';

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
