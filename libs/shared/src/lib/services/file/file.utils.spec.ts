import {
  dataUrlToFile,
  isDraftFile,
  isPendingFile,
  isStoredFile,
} from './file.utils';

describe('file utils', () => {
  const dataUrl = 'data:text/plain;base64,aGVsbG8=';

  /**
   * Reads a browser file as text ( jsdom has neither Response nor Blob.text ).
   *
   * @param file File to read
   * @returns File content
   */
  const readText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });

  it('tells pending files ( data URLs ) from stored ones', () => {
    expect(isPendingFile({ content: dataUrl })).toBe(true);
    expect(isStoredFile({ content: dataUrl })).toBe(false);

    expect(isPendingFile({ content: { driveId: 'd', itemId: 'i' } })).toBe(
      false
    );
    expect(isStoredFile({ content: { driveId: 'd', itemId: 'i' } })).toBe(true);
    expect(isPendingFile({ content: 'legacy/path.pdf' })).toBe(false);
    expect(isStoredFile({ content: 'legacy/path.pdf' })).toBe(true);

    expect(isPendingFile(null)).toBe(false);
    expect(isPendingFile({})).toBe(false);
  });

  it('keeps draft files out of the stored ones until the record is submitted', () => {
    const draft = { content: 'form-id/blob', draft: true };

    expect(isDraftFile(draft)).toBe(true);
    expect(isStoredFile(draft)).toBe(false);
    expect(isPendingFile(draft)).toBe(false);

    expect(isDraftFile({ content: 'form-id/blob' })).toBe(false);
    expect(isDraftFile(null)).toBe(false);
  });

  it('rebuilds a browser file from a base64 data URL', async () => {
    const file = dataUrlToFile(dataUrl, 'hello.txt');

    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('hello.txt');
    expect(file.type).toBe('text/plain');
    expect(file.size).toBe(5);
    expect(await readText(file)).toBe('hello');
  });

  it('prefers the given type and falls back to octet-stream', () => {
    expect(dataUrlToFile(dataUrl, 'a', 'application/pdf').type).toBe(
      'application/pdf'
    );
    expect(dataUrlToFile('data:;base64,aGVsbG8=', 'a').type).toBe(
      'application/octet-stream'
    );
  });

  it('rebuilds a browser file from a URL-encoded data URL', async () => {
    const file = dataUrlToFile('data:text/plain,hello%20world', 'hello.txt');

    expect(await readText(file)).toBe('hello world');
  });
});
