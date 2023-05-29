import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeDownloadService } from '../../../../services/download/download.service';
import { parseHtml } from '../parser/utils';
import get from 'lodash/get';
import { GET_PAGE_BY_ID, GetPageByIdQueryResponse } from '../graphql/queries';
import { Apollo } from 'apollo-angular';
//import { Page } from '../../../../models/page.model';
import { firstValueFrom } from 'rxjs';

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
  resultText = '';

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   * @param apollo Apollo service
   */
  constructor(
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      parseHtml(
        this.html,
        this.fieldsValue,
        this.fields,
        this.styles,
        this.wholeCardStyles
      )
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  async ngOnChanges() {
    const parsedHtml = parseHtml(
      this.html,
      this.fieldsValue,
      this.fields,
      this.styles,
      this.wholeCardStyles
    );
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      await this.applyPage(parsedHtml)
    );
  }

  /**
   * Manages all data types that require some extra functions
   *
   * @param event Click event
   */
  public onClick(event: any) {
    const type = event.target.getAttribute('type');
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

  public applyPage = async (html: string): Promise<string> => {
    const regex = new RegExp(`{{page\\([a-z0-9]{24}\\)}}`);
    let result = regex.exec(html);
    while (result !== null) {
      const pageId = result[0].substring(
        result[0].indexOf('(') + 1,
        result[0].lastIndexOf(')')
      );
      const pagePromise: Promise<any> = firstValueFrom(
        this.apollo.query<GetPageByIdQueryResponse>({
          query: GET_PAGE_BY_ID,
          variables: {
            id: pageId,
          },
        })
      );
      const pageToLink = await Promise.resolve(pagePromise);

      this.resultText =
        '<a href="./applications">' + pageToLink.data.page.name + '</a>';
      html = html.replace(result[0], this.resultText);
      result = regex.exec(html);
    }
    return html;
  };
}
