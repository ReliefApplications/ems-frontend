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
  selector: 'shared-summary-card-item-content',
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
  @Input() dataSource!: { record: any; layout: any };

  public formattedHtml: SafeHtml = '';
  public formattedStyle?: string;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param dataTemplateService Shared data template service, used to render content from template
   */
  constructor(private dataTemplateService: DataTemplateService) {}

  ngOnInit(): void {
    this.formattedStyle = this.dataTemplateService.renderStyle(
      this.wholeCardStyles,
      this.fieldsValue,
      this.styles
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
    this.formattedStyle = this.dataTemplateService.renderStyle(
      this.wholeCardStyles,
      this.fieldsValue,
      this.styles
    );
    this.formattedHtml = this.dataTemplateService.renderHtml(
      this.html,
      this.fieldsValue,
      this.fields,
      this.styles
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
