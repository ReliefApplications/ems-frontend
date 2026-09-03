import { Component, HostBinding, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { File, FileService } from '../../../services/file/file.service';

/**
 * Download action floating over the image preview of a file question.
 *
 * Injected by the file widget inside SurveyJS's image wrapper, which is
 * already positioned, so the host only needs to anchor itself to the
 * bottom-right corner of the image (the top-right corner is where SurveyJS
 * places its own choose / clear buttons).
 */
@Component({
  selector: 'shared-file-download-button',
  standalone: true,
  imports: [ButtonModule, TooltipModule, TranslateModule],
  template: `
    <ui-button
      [isIcon]="true"
      icon="download"
      category="tertiary"
      variant="primary"
      size="small"
      [uiTooltip]="'common.downloadObject' | translate : { name: file?.name }"
      uiTooltipPosition="top"
      (click)="onClick($event)"
    ></ui-button>
  `,
})
export class FileDownloadButtonComponent {
  /** File to download */
  @Input() file?: File;
  /**
   * Float over the bottom-right corner of the image, above SurveyJS's
   * transparent full-size file-name link
   */
  @HostBinding('class') hostClass = 'absolute bottom-2 right-2 z-10';
  /** Shared file service */
  private fileService = inject(FileService);

  /**
   * Downloads the file, keeping the click away from SurveyJS's own handlers.
   *
   * @param event Click event
   */
  onClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.file) {
      this.fileService.download(this.file);
    }
  }
}
