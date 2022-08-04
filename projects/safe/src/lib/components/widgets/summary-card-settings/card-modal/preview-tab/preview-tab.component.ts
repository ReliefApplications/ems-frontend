import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import { SummaryCardService } from 'projects/safe/src/lib/services/summary-card.service';
import { Subscription } from 'rxjs';

/**
 * Component used in the card-modal-settings for previewing the final result.
 */
@Component({
  selector: 'safe-preview-tab',
  templateUrl: './preview-tab.component.html',
  styleUrls: ['./preview-tab.component.scss'],
})
export class SafePreviewTabComponent implements OnChanges {
  @Input() record: any;
  @Input() gridSettings: any;
  @Input() html: any;
  @Input() useLayouts = true;
  @Input() wholeCardLayouts: any;

  public formatedHtml = this.sanitizer.bypassSecurityTrustHtml('');

  /**
   * Get layouts from grid settings
   *
   * @returns Array of layouts
   */
  get layouts(): any {
    if (
      this.gridSettings &&
      this.gridSettings.query &&
      this.gridSettings.query.style
    ) {
      return this.gridSettings.query.style;
    }
    return [];
  }

  /**
   * Constructor used by the SafePreviewTab component.
   *
   * @param sanitizer Used to correctly display all styles in the preview.
   * @param summaryCardService Used to get the card contents for preview.
   */
  constructor(
    private sanitizer: DomSanitizer,
    private summaryCardService: SummaryCardService
  ) {}

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    let html = this.html;
    if (this.record) {
      if (this.useLayouts) {
        html = this.summaryCardService.replaceRecordFields(
          this.html,
          this.record,
          this.layouts,
          this.wholeCardLayouts
        );
      } else {
        html = this.summaryCardService.replaceRecordFields(
          this.html,
          this.record
        );
      }
    }
    this.formatedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
