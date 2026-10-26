import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Output,
} from '@angular/core';
import { UploadEvent } from '@progress/kendo-angular-upload';

/**
 * Upload Menu to be displayed in overlay container.
 * Contains file upload and template download.
 */
@Component({
  selector: 'app-upload-menu',
  templateUrl: './upload-menu.component.html',
  styleUrls: ['./upload-menu.component.scss'],
})
export class UploadMenuComponent {
  /** Upload event emitter */
  @Output() upload = new EventEmitter<File>();
  /** Download event emitter, for template */
  @Output() download = new EventEmitter();
  /** Close event emitter */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<null> = new EventEmitter();
  /** File size limit, in MB */
  public maxFileSize: number;
  /** Show upload menu */
  private show = true;

  /** Listen to click event on the document */
  @HostListener('click')
  clickInside() {
    this.show = true;
  }

  /** Listen to document click event and close the component if outside of it */
  @HostListener('document:click')
  clickout() {
    if (!this.show) {
      this.close.emit();
    }
    this.show = false;
  }

  /**
   * Upload Menu to be displayed in overlay container.
   * Contains file upload and template download.
   *
   * @param environment environment
   */
  constructor(@Inject('environment') environment: any) {
    this.maxFileSize = environment.maxFileSize;
  }

  /**
   * Handles upload event.
   * Event is transmitted by the component to other components.
   *
   * @param e kendo upload event
   */
  onUpload(e: UploadEvent): void {
    e.preventDefault();
    const file = e.files[0].rawFile;
    this.upload.emit(file);
  }

  /**
   * Handles download template event.
   * Event is transmitted by the component to other components.
   */
  onDownloadTemplate(): void {
    this.download.emit();
  }
}
