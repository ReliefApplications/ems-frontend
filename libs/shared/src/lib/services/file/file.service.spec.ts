import { TestBed } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Subject, of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { DownloadService } from '../download/download.service';
import { DocumentManagementService } from '../document-management/document-management.service';
import { File, FileService } from './file.service';

// Keep the dynamic import light: the service lazy-loads the preview modal,
// and we only care that the dialog receives the right component/data.
jest.mock(
  '../../components/file-preview-modal/file-preview-modal.component',
  // eslint-disable-next-line jsdoc/require-jsdoc
  () => ({ FilePreviewModalComponent: class FilePreviewModalComponent {} })
);

describe('FileService', () => {
  let service: FileService;
  let downloadService: { getFile: jest.Mock; getFileBlob: jest.Mock };
  let documentManagementService: { getFile: jest.Mock; getFileBlob: jest.Mock };
  let dialog: { open: jest.Mock };
  let snackBar: {
    openComponentSnackBar: jest.Mock;
    openSnackBar: jest.Mock;
  };
  let snackBarRef: any;
  let spinnerInstance: any;

  beforeEach(() => {
    // jsdom does not implement the object URL helpers.
    (URL as any).createObjectURL = jest.fn(() => 'blob:mock-url');
    (URL as any).revokeObjectURL = jest.fn();

    spinnerInstance = {
      message: '',
      loading: true,
      error: false,
    };
    snackBarRef = {
      instance: {
        dismiss: jest.fn(),
        triggerSnackBar: jest.fn(),
        nestedComponent: { instance: spinnerInstance },
      },
    };

    downloadService = { getFile: jest.fn(), getFileBlob: jest.fn() };
    documentManagementService = {
      getFile: jest.fn(),
      getFileBlob: jest.fn(),
    };
    dialog = { open: jest.fn() };
    snackBar = {
      openComponentSnackBar: jest.fn(() => snackBarRef),
      openSnackBar: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        FileService,
        { provide: DownloadService, useValue: downloadService },
        {
          provide: DocumentManagementService,
          useValue: documentManagementService,
        },
        { provide: Dialog, useValue: dialog },
        {
          provide: TranslateService,
          useValue: { instant: (key: string) => key },
        },
        { provide: SnackbarService, useValue: snackBar },
      ],
    });
    service = TestBed.inject(FileService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('downloadOrPreview', () => {
    it('downloads directly when the file cannot be previewed', async () => {
      const downloadSpy = jest.spyOn(service, 'download').mockImplementation();
      const file: File = {
        name: 'notes.txt',
        type: 'text/plain',
        content: 'some-id',
      };

      await firstValueFrom(service.downloadOrPreview(file));

      expect(downloadSpy).toHaveBeenCalledWith(file);
      expect(snackBar.openComponentSnackBar).not.toHaveBeenCalled();
      expect(dialog.open).not.toHaveBeenCalled();
    });

    it('previews a data URL string without fetching a blob', async () => {
      const file: File = {
        name: 'inline.png',
        type: 'image/png',
        content: 'data:image/png;base64,AAAA',
      };

      await firstValueFrom(service.downloadOrPreview(file));

      expect(downloadService.getFileBlob).not.toHaveBeenCalled();
      expect((URL as any).createObjectURL).not.toHaveBeenCalled();
      expect(dialog.open).toHaveBeenCalledTimes(1);
      const [, config] = dialog.open.mock.calls[0];
      expect(config.data).toEqual({
        fileName: 'inline.png',
        fileType: 'image/png',
        url: 'data:image/png;base64,AAAA',
      });
      // Data URLs are not object URLs, so nothing to revoke.
      expect((URL as any).revokeObjectURL).not.toHaveBeenCalled();
      expect(snackBarRef.instance.dismiss).toHaveBeenCalled();
    });

    it('fetches a blob and previews a server-stored file', async () => {
      downloadService.getFileBlob.mockReturnValue(of(new Blob(['x'])));
      const file: File = { name: 'picture.png', content: 'file-123' };

      await firstValueFrom(service.downloadOrPreview(file));

      expect(downloadService.getFileBlob).toHaveBeenCalledWith(
        'download/file/file-123',
        'image/png'
      );
      expect((URL as any).createObjectURL).toHaveBeenCalled();
      const [, config] = dialog.open.mock.calls[0];
      expect(config.data).toEqual({
        fileName: 'picture.png',
        fileType: 'image/png',
        url: 'blob:mock-url',
      });
      expect(snackBarRef.instance.dismiss).toHaveBeenCalled();
    });

    it('fetches a blob from document management', async () => {
      documentManagementService.getFileBlob.mockReturnValue(
        of(new Blob(['x']))
      );
      const file: File = {
        name: 'report.pdf',
        content: { driveId: 'drive-1', itemId: 'item-1' },
      };

      await firstValueFrom(service.downloadOrPreview(file));

      expect(documentManagementService.getFileBlob).toHaveBeenCalledWith({
        name: 'report.pdf',
        content: { driveId: 'drive-1', itemId: 'item-1' },
        type: 'application/pdf',
      });
      const [, config] = dialog.open.mock.calls[0];
      expect(config.data.url).toBe('blob:mock-url');
      expect(config.data.fileType).toBe('application/pdf');
    });

    it('shows an error when the blob request fails', async () => {
      downloadService.getFileBlob.mockReturnValue(
        throwError(() => new Error('boom'))
      );
      const file: File = { name: 'picture.png', content: 'file-123' };

      await firstValueFrom(service.downloadOrPreview(file));

      expect(dialog.open).not.toHaveBeenCalled();
      // The loading snackbar is turned into the error message.
      expect(spinnerInstance.error).toBe(true);
      expect(spinnerInstance.loading).toBe(false);
      expect(snackBarRef.instance.triggerSnackBar).toHaveBeenCalled();
    });

    it('revokes the object URL when the modal fails to open', async () => {
      downloadService.getFileBlob.mockReturnValue(of(new Blob(['x'])));
      dialog.open.mockImplementation(() => {
        throw new Error('cannot open');
      });
      const file: File = { name: 'picture.png', content: 'file-123' };

      await firstValueFrom(service.downloadOrPreview(file));

      expect((URL as any).revokeObjectURL).toHaveBeenCalledWith(
        'blob:mock-url'
      );
    });

    it('dismisses the loader when cancelled before settling', () => {
      const pending = new Subject<Blob>();
      downloadService.getFileBlob.mockReturnValue(pending.asObservable());
      const file: File = { name: 'picture.png', content: 'file-123' };

      const subscription = service.downloadOrPreview(file).subscribe();
      expect(snackBarRef.instance.dismiss).not.toHaveBeenCalled();

      subscription.unsubscribe();

      expect(snackBarRef.instance.dismiss).toHaveBeenCalled();
      expect(dialog.open).not.toHaveBeenCalled();
    });
  });

  describe('download', () => {
    it('downloads a data URL via an anchor element', () => {
      const anchor = { href: '', download: '', click: jest.fn() } as any;
      const createElementSpy = jest
        .spyOn(document, 'createElement')
        .mockReturnValue(anchor);
      const file: File = {
        name: 'inline.png',
        content: 'data:image/png;base64,AAAA',
      };

      service.download(file);

      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(anchor.href).toBe('data:image/png;base64,AAAA');
      expect(anchor.download).toBe('inline.png');
      expect(anchor.click).toHaveBeenCalled();
    });

    it('downloads a server-stored file via the download service', () => {
      const file: File = {
        name: 'sheet.csv',
        type: 'text/csv',
        content: 'file-123',
      };

      service.download(file);

      expect(downloadService.getFile).toHaveBeenCalledWith(
        'download/file/file-123',
        'text/csv',
        'sheet.csv'
      );
    });

    it('downloads a document management file', () => {
      const file: File = {
        name: 'report.pdf',
        content: { driveId: 'drive-1', itemId: 'item-1' },
      };

      service.download(file);

      expect(documentManagementService.getFile).toHaveBeenCalledWith(file);
    });

    it('shows an error for unsupported content', () => {
      const file: File = { name: 'mystery' };

      service.download(file);

      expect(snackBar.openSnackBar).toHaveBeenCalledWith(
        'common.notifications.file.download.error',
        { error: true }
      );
    });
  });
});
