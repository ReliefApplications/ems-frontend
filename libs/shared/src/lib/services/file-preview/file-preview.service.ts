import { Dialog } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import get from 'lodash/get';
import {
  DocumentManagementFile,
  DocumentManagementFileContent,
  DocumentManagementService,
} from '../document-management/document-management.service';
import { DownloadService } from '../download/download.service';

/** PDF mime type */
const PDF_MIME_TYPE = 'application/pdf';
/** Previewable image file extensions */
const IMAGE_EXTENSIONS = [
  'apng',
  'avif',
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp',
];

/** File object that can be opened from grids or generated HTML. */
export interface PreviewFile {
  name: string;
  type?: string;
  content?: string | DocumentManagementFileContent;
}

/** Shared service to preview PDFs/images and download other files. */
@Injectable({
  providedIn: 'root',
})
export class FilePreviewService {
  /**
   * Shared service to preview PDFs/images and download other files.
   *
   * @param dialog The Dialog service
   * @param downloadService Shared download service
   * @param documentManagementService Shared document management service
   * @param translate Angular translate service
   * @param snackBar Shared snackbar service
   * @param document document
   */
  constructor(
    private dialog: Dialog,
    private downloadService: DownloadService,
    private documentManagementService: DocumentManagementService,
    private translate: TranslateService,
    private snackBar: SnackbarService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Opens a preview for PDF/images or downloads other files.
   *
   * @param file File to open.
   */
  public openFile(file: PreviewFile): void {
    if (!this.isPreviewableFile(file)) {
      this.downloadFile(file);
      return;
    }

    if (typeof file.content === 'string') {
      if (file.content.startsWith('data')) {
        void this.openFilePreview(file, file.content);
      } else {
        const path = `download/file/${file.content}`;
        this.downloadService
          .getFileBlob(path, this.getFileType(file))
          .subscribe({
            next: (blob) => this.openBlobPreview(file, blob),
            error: () => this.showFilePreviewError(),
          });
      }
    } else if (this.isDocumentManagementFile(file)) {
      this.documentManagementService
        .getFileBlob({ ...file, type: this.getFileType(file) })
        .subscribe({
          next: (blob) => this.openBlobPreview(file, blob),
          error: () => this.showFilePreviewError(),
        });
    } else {
      this.downloadFile(file);
    }
  }

  /**
   * Downloads file.
   *
   * @param file File to download.
   */
  public downloadFile(file: PreviewFile): void {
    if (typeof file.content === 'string') {
      if (file.content.startsWith('data')) {
        const downloadLink = this.document.createElement('a');
        downloadLink.href = file.content;
        downloadLink.download = file.name;
        downloadLink.click();
      } else {
        const path = `download/file/${file.content}`;
        this.downloadService.getFile(path, this.getFileType(file), file.name);
      }
    } else if (this.isDocumentManagementFile(file)) {
      this.documentManagementService.getFile(file);
    } else {
      this.showFilePreviewError();
    }
  }

  /**
   * Opens a generated file button target from parsed HTML content.
   *
   * @param event click event
   * @param data record or survey data containing the file value
   */
  public openFileFromEvent(event: MouseEvent, data: unknown): void {
    const target = event.target as HTMLElement | null;
    const fileButton = target?.closest<HTMLButtonElement>(
      'button[type="file"][field][index]'
    );

    if (!fileButton) {
      return;
    }

    event.preventDefault();

    const fieldName = fileButton.getAttribute('field');
    const index = fileButton.getAttribute('index');
    if (!fieldName || Number.isNaN(Number(index))) {
      this.showFilePreviewError();
      return;
    }

    const file = get(
      data,
      `${fieldName}[${index}]`,
      null
    ) as PreviewFile | null;
    if (file) {
      this.openFile(file);
    }
  }

  /**
   * Opens a blob in the file preview modal.
   *
   * @param file File to preview
   * @param blob File blob
   */
  private openBlobPreview(file: PreviewFile, blob: Blob): void {
    const url = URL.createObjectURL(blob);
    void this.openFilePreview(file, url).then((opened) => {
      if (!opened) {
        URL.revokeObjectURL(url);
      }
    });
  }

  /**
   * Opens the preview modal for the file.
   *
   * @param file File to preview
   * @param url File URL
   * @returns true when the modal opened
   */
  private async openFilePreview(
    file: PreviewFile,
    url: string
  ): Promise<boolean> {
    try {
      const { FilePreviewModalComponent } = await import(
        '../../components/ui/core-grid/grid/file-preview-modal/file-preview-modal.component'
      );
      this.dialog.open(FilePreviewModalComponent, {
        data: {
          fileName: file.name,
          fileType: this.getFileType(file),
          url,
        },
        autoFocus: false,
        width: '90vw',
        height: '90vh',
      });

      return true;
    } catch {
      this.showFilePreviewError();
      return false;
    }
  }

  /**
   * Checks if file is previewable.
   *
   * @param file File to check
   * @returns true for PDFs and images
   */
  private isPreviewableFile(file: PreviewFile): boolean {
    const type = file.type?.toLowerCase() || '';
    const extension = this.getFileExtension(file.name);

    return (
      type === PDF_MIME_TYPE ||
      type.startsWith('image/') ||
      extension === 'pdf' ||
      IMAGE_EXTENSIONS.includes(extension)
    );
  }

  /**
   * Gets file MIME type from metadata or extension.
   *
   * @param file File to inspect
   * @returns file MIME type
   */
  private getFileType(file: PreviewFile): string {
    if (file.type) {
      return file.type;
    }

    const extension = this.getFileExtension(file.name);
    if (extension === 'pdf') {
      return PDF_MIME_TYPE;
    }

    return IMAGE_EXTENSIONS.includes(extension) ? `image/${extension}` : '';
  }

  /**
   * Gets the file extension.
   *
   * @param fileName File name
   * @returns lowercase extension
   */
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Checks if the file comes from document management.
   *
   * @param file File to check
   * @returns true when file has document management content
   */
  private isDocumentManagementFile(
    file: PreviewFile
  ): file is DocumentManagementFile {
    return (
      !!file.content &&
      typeof file.content !== 'string' &&
      typeof file.content.driveId === 'string' &&
      typeof file.content.itemId === 'string'
    );
  }

  /** Shows a file preview/download error. */
  private showFilePreviewError(): void {
    this.snackBar.openSnackBar(
      this.translate.instant('common.notifications.file.download.error'),
      { error: true }
    );
  }
}
