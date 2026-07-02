import { File } from './file.service';

/**
 * Checks whether a file is marked as outdated.
 *
 * @param file File value
 * @returns true when the file is outdated
 */
export const isFileOutdated = (file: unknown): boolean =>
  !!file &&
  typeof file === 'object' &&
  (file as Pick<File, 'outdated'>).outdated === true;

/**
 * Filters files according to the widget/layout display option.
 *
 * @param files File values
 * @param showOutdatedFiles Should outdated files be kept
 * @returns filtered file values
 */
export const filterOutdatedFiles = <T extends Pick<File, 'outdated'>>(
  files: T[],
  showOutdatedFiles = true
): T[] =>
  showOutdatedFiles ? files : files.filter((file) => !isFileOutdated(file));
