import { Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Record } from '../../../../../models/record.model';
import { parseHtml } from '../../../summary-card/parser/utils';

/**
 * Component used in the card-modal-settings for previewing the final result.
 */
@Component({
  selector: 'safe-preview-tab',
  templateUrl: './preview-tab.component.html',
  styleUrls: ['./preview-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SafePreviewTabComponent implements OnChanges {
  @Input() html = '';
  @Input() fields: any[] = [];
  @Input() record: Record | null = null;

  public formattedHtml?: SafeHtml;

  /**
   * Constructor used by the SafePreviewTab component.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   */
  constructor(private sanitizer: DomSanitizer) {}

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, this.record, this.fields)
    );
  }
}
