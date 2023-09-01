import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';

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
  @Input() template = '';
  @Input() fields: any[] = [];
  @Input() fieldsValue: any;
  @Input() styleRules: any[] = [];
  @Input() wholeCardStyles = false;
  @Input() widgetID = -1;

  public html: SafeHtml = '';
  public style?: string;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param dataTemplateService Shared data template service, used to render content from template
   */
  constructor(private dataTemplateService: DataTemplateService) {}

  ngOnInit(): void {
    this.style = this.dataTemplateService.renderStyle(
      this.wholeCardStyles,
      this.fieldsValue,
      this.styleRules
    );
    this.html = this.dataTemplateService.renderHtml(
      this.template,
      this.fieldsValue,
      this.fields,
      this.styleRules
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.style = this.dataTemplateService.renderStyle(
      this.wholeCardStyles,
      this.fieldsValue,
      this.styleRules
    );
    this.html = this.dataTemplateService.renderHtml(
      this.template,
      this.fieldsValue,
      this.fields,
      this.styleRules
    );
  }

  /**
   * Pass click event to data template service
   *
   * @param event Click event
   */
  public onClick(event: any) {
    this.dataTemplateService.onClick(event, this.fieldsValue);
  }
}
