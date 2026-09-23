import { ICON_EXTENSIONS } from './file.constants';

/** Minimal file shape needed by the helpers below */
interface FileLike {
  content?: unknown;
  outdated?: boolean;
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
 * Whether a file of a file question is already stored ( document management
 * item or legacy path ), as opposed to a freshly picked one still held as a
 * data URL until the record is saved.
 *
 * @param file File value item
 * @returns True if the file is stored
 */
export function isStoredFile(file: FileLike | null | undefined): boolean {
  const content = file?.content;
  if (!content) return false;
  if (typeof content === 'string') return content.indexOf('data:') !== 0;
  return typeof content === 'object' && 'itemId' in content;
}

/**
 * Whether a file of a file question is marked as outdated.
 *
 * @param file File value item
 * @returns True if the file is outdated
 */
export function isOutdatedFile(file: FileLike | null | undefined): boolean {
  return !!file?.outdated;
}
