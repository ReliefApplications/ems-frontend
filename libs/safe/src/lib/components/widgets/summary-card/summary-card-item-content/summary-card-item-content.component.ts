import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DatatemplateService } from '../../../../services/datatemplate/datatemplate.service';

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
  @Input() styles: any[] = [];
  @Input() wholeCardStyles = false;

  public formattedHtml?: SafeHtml;
  public cardStyle?: string;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param dataTemplateService Used to generate style and html
   */
  constructor(private dataTemplateService: DatatemplateService) {}

  ngOnInit(): void {
    this.cardStyle = this.dataTemplateService.renderStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    this.formattedHtml = this.dataTemplateService.renderHtml(
      this.html,
      this.fieldsValue,
      this.fields,
      this.styles
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.cardStyle = this.dataTemplateService.renderStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    this.formattedHtml = this.dataTemplateService.renderHtml(
      this.html,
      this.fieldsValue,
      this.fields,
      this.styles
    );
  }

  /**
   * Manages all data types that require some extra functions
   *
   * @param event Click event
   */
  public onClick(event: any) {
    this.dataTemplateService.onClick(event, this.fieldsValue);
  }
}
