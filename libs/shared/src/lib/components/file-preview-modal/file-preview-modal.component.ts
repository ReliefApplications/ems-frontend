import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule, ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

/** File preview dialog data. */
export interface FilePreviewModalData {
  fileName: string;
  fileType: string;
  url: string;
}

/** Preview modal for grid image and PDF files. */
@Component({
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, TranslateModule],
  selector: 'shared-file-preview-modal',
  templateUrl: './file-preview-modal.component.html',
  styleUrls: ['./file-preview-modal.component.scss'],
})
export class FilePreviewModalComponent implements OnDestroy {
  /** Safe URL for embedded PDF preview. */
  public safeUrl: SafeResourceUrl;

  /** @returns true when the file is an image. */
  get isImage(): boolean {
    return this.data.fileType.startsWith('image/');
  }

  /**
   * Creates the file preview modal.
   *
   * @param dialogRef dialog reference
   * @param data dialog data
   * @param sanitizer Angular sanitizer
   * @param document browser document
   */
  constructor(
    public dialogRef: DialogRef<FilePreviewModalComponent>,
    @Inject(DIALOG_DATA) public data: FilePreviewModalData,
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
  }

  /** Downloads the currently previewed file. */
  public download(): void {
    const link = this.document.createElement('a');
    link.href = this.data.url;
    link.download = this.data.fileName;
    this.document.body.append(link);
    link.click();
    link.remove();
  }

  ngOnDestroy(): void {
    if (this.data.url.startsWith('blob:')) {
      URL.revokeObjectURL(this.data.url);
    }
  }
}
