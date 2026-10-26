import {
  createFileUrl,
  dataUrlToFile,
  isDraftFile,
  isLocalFileUrl,
  isPendingFile,
  isStoredFile,
  localUrlToFile,
  objectUrlToFile,
  revokeFileUrl,
} from './file.utils';

describe('file utils', () => {
  const dataUrl = 'data:text/plain;base64,aGVsbG8=';
  const objectUrl = 'blob:http://localhost/object-url';

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

  it('tells pending files ( local URLs ) from stored ones', () => {
    expect(isPendingFile({ content: objectUrl })).toBe(true);
    expect(isStoredFile({ content: objectUrl })).toBe(false);
    expect(isPendingFile({ content: dataUrl })).toBe(true);
    expect(isStoredFile({ content: dataUrl })).toBe(false);
    expect(isLocalFileUrl(objectUrl)).toBe(true);
    expect(isLocalFileUrl(dataUrl)).toBe(true);
    expect(isLocalFileUrl('https://host/file.pdf')).toBe(false);
    expect(isLocalFileUrl({ driveId: 'd', itemId: 'i' })).toBe(false);

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

  describe('object URLs', () => {
    const createObjectURL = jest.fn(() => objectUrl);
    const revokeObjectURL = jest.fn();
    let fetchMock: jest.Mock;

    beforeEach(() => {
      (URL as any).createObjectURL = createObjectURL;
      (URL as any).revokeObjectURL = revokeObjectURL;
      fetchMock = jest.fn((url: string) =>
        Promise.resolve({
          blob: () =>
            Promise.resolve(
              new Blob([url === objectUrl ? 'hello' : 'other'], {
                type: 'text/plain',
              })
            ),
        })
      );
      (globalThis as any).fetch = fetchMock;
    });

    afterEach(() => {
      jest.clearAllMocks();
      delete (globalThis as any).fetch;
    });

    it('stands for a picked file without reading its content', () => {
      const raw = new File(['hello'], 'hello.txt', { type: 'text/plain' });

      expect(createFileUrl(raw)).toBe(objectUrl);
      expect(createObjectURL).toHaveBeenCalledWith(raw);
    });

    it('releases object URLs only', () => {
      revokeFileUrl({ content: objectUrl });
      expect(revokeObjectURL).toHaveBeenCalledWith(objectUrl);

      revokeFileUrl({ content: dataUrl });
      revokeFileUrl({ content: 'form-id/blob' });
      revokeFileUrl({ content: { driveId: 'd', itemId: 'i' } });
      revokeFileUrl(null);
      expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    });

    it('rebuilds a browser file from an object URL', async () => {
      const file = await objectUrlToFile(objectUrl, 'hello.txt');

      expect(fetchMock).toHaveBeenCalledWith(objectUrl);
      expect(file).toBeInstanceOf(File);
      expect(file.name).toBe('hello.txt');
      expect(file.type).toBe('text/plain');
      expect(await readText(file)).toBe('hello');
    });

    it('prefers the given type over the blob one', async () => {
      const file = await objectUrlToFile(objectUrl, 'a', 'application/pdf');

      expect(file.type).toBe('application/pdf');
    });

    it('rebuilds a browser file from either kind of local URL', async () => {
      expect(await readText(await localUrlToFile(objectUrl, 'a'))).toBe(
        'hello'
      );
      expect(await readText(await localUrlToFile(dataUrl, 'a'))).toBe('hello');
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
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
