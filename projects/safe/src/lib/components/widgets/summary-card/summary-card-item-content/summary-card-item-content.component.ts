import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Record } from '../../../../models/record.model';
import { parseHtml } from '../parser/utils';

/**
 * Content component of Single Item of Summary Card.
 * Build html from item definition and queried record.
 */
@Component({
  selector: 'safe-summary-card-item-content',
  templateUrl: './summary-card-item-content.component.html',
  styleUrls: ['./summary-card-item-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SummaryCardItemContentComponent implements OnInit, OnChanges {
  @Input() html = '';
  @Input() fields: any[] = [];
  @Input() fieldsValue: any;

  public formattedHtml?: SafeHtml;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   */
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, this.fieldsValue, this.fields)
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, this.fieldsValue, this.fields)
    );
  }
}
