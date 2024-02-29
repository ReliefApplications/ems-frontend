import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DownloadService } from '../../services/download/download.service';

/**
 * Upload Records button component.
 */
@Component({
  selector: 'shared-upload-records',
  templateUrl: './upload-records.component.html',
  styleUrls: ['./upload-records.component.scss'],
})
export class UploadRecordsComponent {
  /** Upload state */
  public showUpload = false;
  /** Resource / form id */
  @Input() id!: string;
  /** Resource / form name */
  @Input() name!: string;
  /** Upload path */
  @Input() path!: string;
  /** Successfully uploaded output */
  @Output() uploaded = new EventEmitter();

  /**
   * Upload Records button component.
   *
   * @param downloadService Service used to download.
   */
  constructor(private downloadService: DownloadService) {}

  /**
   * Calls rest endpoint to upload new records for the resource.
   *
   * @param file File to upload.
   */
  public uploadFileData(file: any): void {
    const path = `upload/${this.path}/records/${this.id}`;
    this.downloadService.uploadFile(path, file).subscribe({
      next: (res) => {
        if (res.status === 'OK') {
          this.uploaded.emit();
          this.showUpload = false;
        }
      },
      error: () => {
        // The error message has already been handled in DownloadService
        this.showUpload = false;
      },
    });
  }

  /**
   * Get the records template, for upload.
   */
  public onDownloadTemplate(): void {
    const path = `download/${this.path}/records/${this.id}`;
    const queryString = new URLSearchParams({
      type: 'xlsx',
      template: 'true',
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/xlsx;charset=utf-8;`,
      `${this.name}_template.xlsx`
    );
  }
}
