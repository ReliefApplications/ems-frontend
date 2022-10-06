import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeDownloadService } from '../../../../services/download/download.service';
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
  @Input() record: Record | null = null;
  @Input() aggregationData: any;

  public formattedHtml?: SafeHtml;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   */
  constructor(
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService
  ) {}

  ngOnInit(): void {
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, this.record, this.aggregationData, this.fields)
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  ngOnChanges(): void {
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(this.html, this.record, this.aggregationData, this.fields)
    );
  }

  /**
   * Manages all data types that require some extra functions
   *
   * @param event Click event
   */
  public click(event: any) {
    const type = event.target.getAttribute('type');
    if (type === 'file') {
      const position = event.target.getAttribute('number');
      const occurence = event.target.getAttribute('occurence');
      const name = this.fields.filter((field) => field.type === 'file')[
        position
      ].name;
      const data = this.record?.data;
      const file = data[name] ? data[name][occurence] : null;
      const path = `download/file/${file.content}`;
      this.downloadService.getFile(path, file.type, file.name);
    }
  }
}
