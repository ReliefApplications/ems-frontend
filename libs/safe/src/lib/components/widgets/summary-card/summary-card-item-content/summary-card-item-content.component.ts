import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeDownloadService } from '../../../../services/download/download.service';
import { getCardStyle, parseHtml } from '../parser/utils';
import get from 'lodash/get';
import { Router } from '@angular/router';

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
  @Input() makeCardClickable: any;
  @Input() urlToLink?: any;

  public formattedHtml?: SafeHtml;
  public cardStyle?: string;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   * @param router Angular Router
   */
  constructor(
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cardStyle = getCardStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, this.fieldsValue, this.fields, this.styles)
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.cardStyle = getCardStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, this.fieldsValue, this.fields, this.styles)
    );
  }

  /**
   * Manages all data types that require some extra functions
   *
   * @param event Click event
   */
  public onClick(event: any) {
    const type = event.target.getAttribute('type');
    if (this.makeCardClickable) {
      this.router.navigate([
        './applications/645e0c941d360b3e80725bf8/form/64638583886a176c28824ff4',
      ]);
    }
    if (type === 'file') {
      const fieldName = event.target.getAttribute('field');
      const index = event.target.getAttribute('index');
      const file = get(this.fieldsValue, `${fieldName}[${index}]`, null);
      if (file) {
        const path = `download/file/${file.content}`;
        this.downloadService.getFile(path, file.type, file.name);
      }
    }
  }
}
