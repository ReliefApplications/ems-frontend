import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { DataTemplateService } from '../../../../services/data-template/data-template.service';
import { SafeApplicationService } from '../../../../services/application/application.service';

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

  public formattedHtml: SafeHtml = '';
  public formattedStyle?: string;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param dataTemplateService Shared data template service, used to render content from template
   * @param applicationService Shared application service
   */
  constructor(
    private dataTemplateService: DataTemplateService,
    private applicationService: SafeApplicationService
  ) {}

  ngOnInit(): void {
    this.setContentAndStyle();
  }

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.setContentAndStyle();
  }

  /**
   * Pass click event to data template service
   *
   * @param event Click event
   */
  public onClick(event: any) {
    this.dataTemplateService.onClick(event, this.fieldsValue);
  }

  /**
   * Sets content of the widget widget, querying associated record if any.
   */
  private setContentAndStyle(): void {
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

    if (!this.formattedStyle) {
      this.formattedStyle = this.applicationService.rawCustomStyle;
    }
  }
}
