import { Component, HostBinding, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, TooltipModule } from '@oort-front/ui';

/**
 * Question-level toolbar of a file question, replacing SurveyJS's own
 * choose / clear buttons with a UI library "Select file" action.
 *
 * Injected by the file widget inside SurveyJS's upload area. It is centered
 * in the drop zone while the question is empty, and moved by the widget
 * styles to the top-right corner once a file is attached.
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
      [disabled]="locked"
      [uiTooltip]="
        locked ? ('components.form.file.outdated.locked' | translate) : ''
      "
      uiTooltipPosition="top"
      (click)="onSelect($event)"
    >
      {{ 'components.form.file.select' | translate }}
    </ui-button>
  `,
})
export class FileQuestionActionsComponent {
  /** Centered in the drop zone, moved to a corner by the widget styles */
  @HostBinding('class') hostClass =
    'file-question-actions flex items-center justify-center';
  /**
   * Whether selecting a file is locked ( single-file question holding a
   * stored file that must be removed permanently first )
   */
  @Input() locked = false;
  /**
   * Opens the file picker of the question
   *
   * @returns void
   */
  @Input() selectFile: () => void = () => undefined;

  /**
   * Opens the file picker, unless locked.
   *
   * @param event Click event
   */
  onSelect(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!this.locked) {
      this.selectFile();
    }
  }
}
