import { ICON_EXTENSIONS } from './file.constants';

/** Minimal file shape needed by the helpers below */
interface FileLike {
  content?: unknown;
  outdated?: boolean;
  draft?: boolean;
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
 * Whether a file of a file question is saved in the back-end storage along
 * with a draft record, waiting for the record submission to reach its final
 * storage ( see {@link isStoredFile} ).
 *
 * @param file File value item
 * @returns True if the file belongs to a draft
 */
export function isDraftFile(file: FileLike | null | undefined): boolean {
  return !!file?.draft;
}

/**
 * Whether the given file content is a URL that only lives in the browser:
 * the object URL of a freshly picked file, or the data URL of a file saved
 * in a record before its upload ( legacy ).
 *
 * @param content File value item content
 * @returns True if the content is a local URL
 */
export function isLocalFileUrl(content: unknown): content is string {
  return (
    typeof content === 'string' &&
    (content.indexOf('blob:') === 0 || content.indexOf('data:') === 0)
  );
}

/**
 * Whether a file of a file question is in its final storage ( document
 * management item or back-end storage path ), as opposed to a freshly picked
 * one still held as a local URL, or a draft file waiting for the record
 * submission: both are uploaded when the record is submitted.
 *
 * @param file File value item
 * @returns True if the file is stored
 */
export function isStoredFile(file: FileLike | null | undefined): boolean {
  const content = file?.content;
  if (!content || isDraftFile(file)) return false;
  if (typeof content === 'string') return !isLocalFileUrl(content);
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

/**
 * Whether a file of a file question has not been uploaded anywhere yet: its
 * content is the object URL of the picked file ( or a data URL for records
 * saved before their upload ), replaced by a storage reference once uploaded
 * ( see {@link isStoredFile} ). Such a file must never be saved as is in a
 * record, draft included.
 *
 * @param file File value item
 * @returns True if the file is pending upload
 */
export function isPendingFile(file: FileLike | null | undefined): boolean {
  return isLocalFileUrl(file?.content);
}

/**
 * Creates the object URL that stands for a picked file in a file question
 * value until the file is uploaded. Unlike a data URL, it does not load the
 * file content in memory: large files are read only when uploaded.
 *
 * @param file Picked browser file
 * @returns Object URL of the file
 */
export function createFileUrl(file: Blob): string {
  return URL.createObjectURL(file);
}

/**
 * Releases the object URL of a file question value item, once the file is
 * uploaded or removed. Data URLs and storage references are left untouched.
 *
 * @param file File value item
 */
export function revokeFileUrl(file: FileLike | null | undefined): void {
  const content = file?.content;
  if (typeof content === 'string' && content.indexOf('blob:') === 0) {
    URL.revokeObjectURL(content);
  }
}

/**
 * Rebuilds a browser file from an object URL, when the picked file is no
 * longer at hand ( e.g. the value was copied to another survey ).
 *
 * @param url Object URL of the file
 * @param name File name
 * @param type File MIME type, read from the blob when not provided
 * @returns Browser file
 */
export async function objectUrlToFile(
  url: string,
  name: string,
  type?: string
): Promise<File> {
  const blob = await fetch(url).then((response) => response.blob());
  return new File([blob], name, {
    type: type || blob.type || 'application/octet-stream',
  });
}

/**
 * Rebuilds a browser file from a local URL, object or data URL.
 *
 * @param url Local URL of the file
 * @param name File name
 * @param type File MIME type
 * @returns Browser file
 */
export function localUrlToFile(
  url: string,
  name: string,
  type?: string
): Promise<File> {
  return url.indexOf('blob:') === 0
    ? objectUrlToFile(url, name, type)
    : Promise.resolve(dataUrlToFile(url, name, type));
}

/**
 * Rebuilds a browser file from a data URL, e.g. to upload a file restored
 * from a record saved before its upload.
 *
 * @param dataUrl Data URL holding the file content
 * @param name File name
 * @param type File MIME type, read from the data URL when not provided
 * @returns Browser file
 */
export function dataUrlToFile(
  dataUrl: string,
  name: string,
  type?: string
): File {
  const separator = dataUrl.indexOf(',');
  const header = separator === -1 ? dataUrl : dataUrl.slice(0, separator);
  const payload = separator === -1 ? '' : dataUrl.slice(separator + 1);
  const mimeType =
    type || /^data:([^;,]+)/i.exec(header)?.[1] || 'application/octet-stream';
  const binary = /;base64/i.test(header)
    ? atob(payload)
    : decodeURIComponent(payload);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new File([bytes], name, { type: mimeType });
}
