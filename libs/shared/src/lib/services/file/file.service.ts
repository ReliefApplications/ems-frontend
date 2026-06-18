import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DownloadService } from '../download/download.service';
import {
  DocumentManagementFileContent,
  DocumentManagementService,
} from '../document-management/document-management.service';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { SnackbarSpinnerComponent } from '../../components/snackbar-spinner/snackbar-spinner.component';

/** Snackbar duration in ms */
const SNACKBAR_DURATION = 3000;
/** PDF mime type */
const PDF_MIME_TYPE = 'application/pdf';
/** Image file extensions */
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

/**
 * File object interface
 */
export interface File {
  name: string;
  type?: string;
  content?: string | DocumentManagementFileContent;
}

/**
 * File service
 * - Download or preview
 * - Direct download
 */
@Injectable({
  providedIn: 'root',
})
export class FileService {
  /** Document */
  private document = inject(DOCUMENT);
  /** Download service */
  private downloadService = inject(DownloadService);
  /** Document management service */
  private documentManagementService = inject(DocumentManagementService);
  /** Dialog service */
  private dialog = inject(Dialog);
  /** Translate service */
  private translate = inject(TranslateService);
  /** Snackbar service */
  private snackBar = inject(SnackbarService);

  /**
   * Download or preview file in modal
   *
   * @param file File
   */
  public downloadOrPreview(file: File) {
    if (!this.canPreview(file)) {
      this.download(file);
    } else if (typeof file.content === 'string') {
      const snackBarRef = this.createPreviewLoader();
      if (file.content.startsWith('data')) {
        void this.openFilePreview(file, file.content, snackBarRef);
      } else {
        const path = `download/file/${file.content}`;
        this.downloadService
          .getFileBlob(path, this.getFileType(file))
          .subscribe({
            next: (blob) => this.openBlobPreview(file, blob, snackBarRef),
            error: () => this.showFilePreviewError(snackBarRef),
          });
      }
    } else if (this.isDocumentManagementFile(file)) {
      const snackBarRef = this.createPreviewLoader();
      this.documentManagementService
        .getFileBlob({ ...file, type: this.getFileType(file) })
        .subscribe({
          next: (blob) => this.openBlobPreview(file, blob, snackBarRef),
          error: () => this.showFilePreviewError(snackBarRef),
        });
    } else {
      this.download(file);
    }
  }

  /**
   * Opens a loading spinner snackbar for the preview action.
   *
   * @returns snackbar reference
   */
  private createPreviewLoader() {
    return this.snackBar.openComponentSnackBar(SnackbarSpinnerComponent, {
      duration: 0,
      data: {
        message: this.translate.instant(
          'common.notifications.file.preview.processing'
        ),
        loading: true,
      },
    });
  }

  /**
   * Downloads file
   *
   * @param file File to download.
   */
  public download(file: File): void {
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
      // Using document management
      this.documentManagementService.getFile(file);
    } else {
      this.showFilePreviewError();
    }
  }

  /**
   * Checks if file can be previewed.
   *
   * @param file File to check
   * @returns true for PDFs and images
   */
  private canPreview(file: File): boolean {
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
   * Gets the file extension.
   *
   * @param fileName File name
   * @returns lowercase extension
   */
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Gets file MIME type from metadata or extension.
   *
   * @param file File to inspect
   * @returns file MIME type
   */
  private getFileType(file: File): string {
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
   * Opens a blob in the file preview modal.
   *
   * @param file File to preview
   * @param blob File blob
   * @param snackBarRef Loading snackbar reference to dismiss once opened
   */
  private openBlobPreview(file: File, blob: Blob, snackBarRef?: any): void {
    const url = URL.createObjectURL(blob);
    void this.openFilePreview(file, url, snackBarRef).then((opened) => {
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
   * @param snackBarRef Loading snackbar reference to dismiss once opened
   * @returns true when the modal opened
   */
  private async openFilePreview(
    file: File,
    url: string,
    snackBarRef?: any
  ): Promise<boolean> {
    try {
      const { FilePreviewModalComponent } = await import(
        '../../components/file-preview-modal/file-preview-modal.component'
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

      snackBarRef?.instance.dismiss();
      return true;
    } catch {
      this.showFilePreviewError(snackBarRef);
      return false;
    }
  }

  /**
   * Checks if the file comes from document management.
   *
   * @param file File to check
   * @returns true when file has document management content
   */
  private isDocumentManagementFile(
    file: File
  ): file is File & { content: DocumentManagementFileContent } {
    return (
      !!file.content &&
      typeof file.content !== 'string' &&
      typeof file.content.driveId === 'string' &&
      typeof file.content.itemId === 'string'
    );
  }

  /**
   * Shows a file preview/download error.
   *
   * @param snackBarRef Loading snackbar reference to turn into the error message
   */
  private showFilePreviewError(snackBarRef?: any): void {
    const message = this.translate.instant(
      'common.notifications.file.download.error'
    );
    const spinner = snackBarRef?.instance.nestedComponent;
    if (spinner) {
      spinner.instance.message = message;
      spinner.instance.loading = false;
      spinner.instance.error = true;
      snackBarRef.instance.triggerSnackBar(SNACKBAR_DURATION);
    } else {
      this.snackBar.openSnackBar(message, { error: true });
    }
  }
}
