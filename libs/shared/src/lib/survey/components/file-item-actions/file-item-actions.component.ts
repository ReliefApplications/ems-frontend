import { NgIf } from '@angular/common';
import { Component, HostBinding, inject, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, IconModule, TooltipModule } from '@oort-front/ui';
import { File, FileService } from '../../../services/file/file.service';

/**
 * Per-file toolbar of a file question, replacing SurveyJS's own per-file
 * remove button with UI library actions.
 *
 * Injected by the file widget inside SurveyJS's image wrapper of each file.
 * It shows, depending on the inputs set by the widget: a warning icon when
 * the file is outdated, a download action ( image previews ), a toggle to
 * mark the file as outdated / active, and the removal action, permanent or
 * not.
 */
@Component({
  selector: 'shared-file-item-actions',
  standalone: true,
  imports: [NgIf, ButtonModule, IconModule, TooltipModule, TranslateModule],
  template: `
    <ui-icon
      *ngIf="outdated"
      class="file-item-actions__warning"
      icon="warning"
      variant="warning"
      [size]="20"
      [uiTooltip]="'components.form.file.outdated.tooltip' | translate"
      uiTooltipPosition="top"
    ></ui-icon>
    <ui-button
      *ngIf="canDownload"
      [isIcon]="true"
      icon="download"
      category="tertiary"
      variant="primary"
      size="small"
      [uiTooltip]="'common.downloadObject' | translate : { name: file?.name }"
      uiTooltipPosition="top"
      (click)="onDownload($event)"
    ></ui-button>
    <ui-button
      *ngIf="canOutdate"
      [isIcon]="true"
      [icon]="outdated ? 'restore' : 'delete'"
      category="tertiary"
      [variant]="outdated ? 'primary' : 'danger'"
      size="small"
      [uiTooltip]="
        (outdated
          ? 'components.form.file.outdated.markAsActive'
          : 'components.form.file.outdated.markAsOutdated'
        ) | translate
      "
      uiTooltipPosition="top"
      (click)="onToggleOutdated($event)"
    ></ui-button>
    <ui-button
      *ngIf="canRemove"
      [isIcon]="true"
      [icon]="permanentRemoval ? 'delete_forever' : 'delete'"
      category="tertiary"
      variant="danger"
      size="small"
      [uiTooltip]="
        (permanentRemoval
          ? 'components.form.file.outdated.removePermanently'
          : 'components.form.file.remove'
        ) | translate
      "
      uiTooltipPosition="top"
      (click)="onRemove($event)"
    ></ui-button>
  `,
})
export class FileItemActionsComponent {
  /** Shared file service */
  private fileService = inject(FileService);
  /**
   * Rendered as a centered row below the file icon; the widget styles switch
   * it to an overlay in the corner of image and PDF previews.
   */
  @HostBinding('class') hostClass =
    'file-item-actions flex items-center justify-center gap-1';
  /** File the toolbar is attached to */
  @Input() file?: File;
  /** Whether the file is currently marked as outdated */
  @Input() outdated = false;
  /** Whether the download action is displayed */
  @Input() canDownload = false;
  /** Whether the file can be marked as outdated / active */
  @Input() canOutdate = false;
  /** Whether the file can be removed */
  @Input() canRemove = false;
  /** Whether the removal is permanent ( file question allowing outdated files ) */
  @Input() permanentRemoval = false;
  /**
   * Marks the file as outdated, or as active if already outdated
   *
   * @returns void
   */
  @Input() toggleOutdated: () => void = () => undefined;
  /**
   * Removes the file from the question
   *
   * @returns void
   */
  @Input() removeFile: () => void = () => undefined;

  /**
   * Downloads the file, keeping the click away from SurveyJS's own handlers.
   *
   * @param event Click event
   */
  onDownload(event: Event): void {
    this.stop(event);
    if (this.file) {
      this.fileService.download(this.file);
    }
  }

  /**
   * Toggles the outdated state, keeping the click away from SurveyJS's own
   * handlers.
   *
   * @param event Click event
   */
  onToggleOutdated(event: Event): void {
    this.stop(event);
    this.toggleOutdated();
  }

  /**
   * Removes the file, keeping the click away from SurveyJS's own handlers.
   *
   * @param event Click event
   */
  onRemove(event: Event): void {
    this.stop(event);
    this.removeFile();
  }

  /**
   * Keeps a click away from SurveyJS's own handlers ( e.g. the transparent
   * file-name link stretched over single image previews ).
   *
   * @param event Click event
   */
  private stop(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
