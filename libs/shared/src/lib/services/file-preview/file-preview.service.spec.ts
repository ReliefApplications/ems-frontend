import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { DocumentManagementService } from '../document-management/document-management.service';
import { DownloadService } from '../download/download.service';
import { FilePreviewService } from './file-preview.service';

describe('FilePreviewService', () => {
  let service: FilePreviewService;

  beforeEach(() => {
    service = new FilePreviewService(
      { open: jest.fn() } as unknown as Dialog,
      {
        getFile: jest.fn(),
        getFileBlob: jest.fn(),
      } as unknown as DownloadService,
      {
        getFile: jest.fn(),
        getFileBlob: jest.fn(),
      } as unknown as DocumentManagementService,
      { instant: jest.fn((key: string) => key) } as unknown as TranslateService,
      { openSnackBar: jest.fn() } as unknown as SnackbarService,
      document
    );
  });

  it('opens a file from a nested generated file button click', () => {
    document.body.innerHTML = `
      <button type="file" field="documents" index="0">
        <span id="file-icon"></span>
      </button>
    `;
    const openFile = jest.spyOn(service, 'openFile').mockImplementation();
    const icon = document.getElementById('file-icon') as HTMLElement;
    let clickEvent!: MouseEvent;
    icon.addEventListener('click', (event) => {
      clickEvent = event;
    });

    icon.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    service.openFileFromEvent(clickEvent, {
      documents: [
        {
          name: 'report.pdf',
          type: 'application/pdf',
          content: 'file-id',
        },
      ],
    });

    expect(openFile).toHaveBeenCalledWith({
      name: 'report.pdf',
      type: 'application/pdf',
      content: 'file-id',
    });
  });

  it('ignores clicks outside generated file buttons', () => {
    const openFile = jest.spyOn(service, 'openFile').mockImplementation();
    const target = document.createElement('span');
    let clickEvent!: MouseEvent;
    target.addEventListener('click', (event) => {
      clickEvent = event;
    });

    target.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    );
    service.openFileFromEvent(clickEvent, {});

    expect(openFile).not.toHaveBeenCalled();
  });
});
