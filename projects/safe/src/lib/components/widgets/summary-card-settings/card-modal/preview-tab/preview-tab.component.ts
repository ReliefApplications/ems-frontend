import { Component, Input, OnChanges } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Record } from '../../../../../models/record.model';
import { parseHtml } from '../../../summary-card/parser/utils';

/**
 * Component used in the card-modal-settings for previewing the final result.
 */
@Component({
  selector: 'safe-preview-tab',
  templateUrl: './preview-tab.component.html',
  styleUrls: ['./preview-tab.component.scss'],
})
export class SafePreviewTabComponent implements OnChanges {
  @Input() html = '';
  @Input() record: Record | null = null;

  public formattedHtml: string = this.html;

  /**
   * Constructor used by the SafePreviewTab component.
   *
   * @param apollo Service used for getting the record queries.
   */
  constructor(private apollo: Apollo) {}

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.formattedHtml = parseHtml(this.html, this.record);
  }
}
