import { Component, HostBinding, inject, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, TooltipModule } from '@oort-front/ui';

/**
 * Question-level toolbar of a file question, replacing SurveyJS's own
 * choose / clear buttons with a UI library "Select file" action.
 *
 * Injected by the file widget inside SurveyJS's upload area. It is centered
 * in the drop zone while no file is displayed, and moved by the widget
 * styles to the top-right corner once a file is displayed.
 *
 * When the action is disabled ( maximum number of files reached, or single
 * stored file to remove first ), its tooltip explains why, mentioning the
 * outdated files hidden from the question that still count.
 */
@Component({
  selector: 'shared-file-question-actions',
  standalone: true,
  imports: [ButtonModule, TooltipModule, TranslateModule],
  template: `
    <ui-button
      icon="upload_file"
      category="secondary"
      variant="primary"
      size="small"
      [disabled]="locked || limitReached"
      [uiTooltip]="tooltip"
      uiTooltipPosition="top"
      (click)="onSelect($event)"
    >
      {{ 'components.form.file.select' | translate }}
    </ui-button>
  `,
})
export class FileQuestionActionsComponent {
  /** Translate service */
  private translate = inject(TranslateService);
  /**
   * Centered in the drop zone, moved to a corner by the widget styles.
   * Stacked above SurveyJS's file list, which is still rendered ( empty ) when
   * every file is hidden and would otherwise cover the centered action.
   */
  @HostBinding('class') hostClass =
    'file-question-actions relative z-[2] flex items-center justify-center';
  /**
   * Whether selecting a file is locked ( single-file question holding a
   * stored file that must be removed permanently first )
   */
  @Input() locked = false;
  /** Whether the maximum number of files of the question is reached */
  @Input() limitReached = false;
  /** Maximum number of files of the question, when limited */
  @Input() limit?: number;
  /** Number of files attached to the question but hidden from it */
  @Input() hiddenCount = 0;
  /**
   * Opens the file picker of the question
   *
   * @returns void
   */
  @Input() selectFile: () => void = () => undefined;

  /** @returns Tooltip of the select action, explaining why it is disabled */
  get tooltip(): string {
    if (this.locked) {
      return this.translate.instant(
        this.hiddenCount > 0
          ? 'components.form.file.outdated.hiddenSingle'
          : 'components.form.file.outdated.locked'
      );
    }
    if (this.limitReached) {
      return this.translate.instant(
        this.hiddenCount > 0
          ? 'components.form.file.outdated.limitReachedHidden'
          : 'components.form.file.limitReached',
        { count: this.hiddenCount, limit: this.limit }
      );
    }
    return '';
  }

  /**
   * Opens the file picker, unless locked or the limit is reached.
   *
   * @param event Click event
   */
  onSelect(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.locked && !this.limitReached) {
      this.selectFile();
    }
  }
}
