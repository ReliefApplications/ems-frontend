import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SafeDownloadService } from '../../../../services/download/download.service';
import { getCardStyle, parseHtml } from '../parser/utils';
import get from 'lodash/get';
import {
  GET_PAGE_BY_ID,
  GetPageByIdQueryResponse,
  GET_APPLICATION_BY_ID,
  GetApplicationByIdQueryResponse,
} from '../graphql/queries';
import { Page } from '../../../../models/page.model';
import { Apollo } from 'apollo-angular';
import { firstValueFrom } from 'rxjs';
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
  @Input() pageToLink?: any;

  public formattedHtml?: SafeHtml;
  resultText = '';
  public environment: any;
  public cardStyle?: string;
  private currentAppId: string;

  /**
   * Content component of Single Item of Summary Card.
   *
   * @param environment Environment specific data
   * @param sanitizer Sanitizes the cards content so angular can show it up.
   * @param downloadService Used to download file type fields
   * @param router Angular Router
   * @param apollo Apollo service
   */
  constructor(
    @Inject('environment') environment: any,
    private sanitizer: DomSanitizer,
    private downloadService: SafeDownloadService,
    private router: Router,
    private apollo: Apollo
  ) {
    this.environment = environment;
    //Get current app ID through the url of the current page
    if (this.router.url.includes('applications/')) {
      this.currentAppId = this.router.url.split('/')[2];
    } else {
      const urlAfterApp = this.router.url.substring(
        this.router.url.lastIndexOf(
          this.environment.frontOfficeUri + 'applications/'
        ) + 1
      );
      this.currentAppId = urlAfterApp.split('/')[1];
    }
  }

  async ngOnInit(): Promise<void> {
    this.cardStyle = getCardStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    this.formattedHtml = this.sanitizer.bypassSecurityTrustHtml(
      await this.applyPage(
        parseHtml(this.html, this.fieldsValue, this.fields, this.styles)
      )
    );
  }

  /**
   * Detects when the html or record inputs change.
   */
  async ngOnChanges() {
    this.cardStyle = getCardStyle(
      this.wholeCardStyles,
      this.styles,
      this.fieldsValue
    );
    const parsedHtml = parseHtml(
      this.html,
      this.fieldsValue,
      this.fields,
      this.styles
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
  public async onClick(event: any) {
    const type = event.target.getAttribute('type');
    if (this.makeCardClickable) {
      //Check if page to link is from same app or not. If not, do not link it
      const sameApplication = await this.checkPageApplication(
        this.pageToLink,
        this.currentAppId
      );
      if (sameApplication) {
        this.router.navigate([
          './applications/645e0c941d360b3e80725bf8/form/64638583886a176c28824ff4',
        ]);
      } else {
        console.log('CANNOT REDIRECT TO PAGE OUTSIDE THIS APPLICATION');
      }
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

  /**
   * Checks if an html element contains the page key and replaces it with correct link display
   *
   * @param html the html element to apply page modification to
   * @returns the modified html element
   */
  public applyPage = async (html: string): Promise<string> => {
    const regex = new RegExp(`{{page\\(\\s*[a-z0-9]{24}\\s*\\)}}`);
    let result = regex.exec(html);
    while (result !== null) {
      const pageId = result[0]
        .substring(result[0].indexOf('(') + 1, result[0].lastIndexOf(')'))
        .trim();

      //Check if page to link is from same app or not. If not, do not link it
      const sameApplication = await this.checkPageApplication(
        pageId,
        this.currentAppId
      );
      if (sameApplication) {
        //Get page information from the database
        const pagePromise: Promise<any> = firstValueFrom(
          this.apollo.query<GetPageByIdQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: pageId,
            },
          })
        );
        const pageToLink = await Promise.resolve(pagePromise);
        //Build the url depending on whether we are in the front or back office
        let url: string;
        this.router.url.includes('/applications')
          ? (url = './applications/')
          : (url = './');
        let finalUrlElement;
        pageToLink.data.page.type === 'dashboard'
          ? (finalUrlElement = pageToLink.data.page.content)
          : (finalUrlElement = pageToLink.data.page.id);
        url +=
          this.currentAppId +
          '/' +
          pageToLink.data.page.type +
          '/' +
          finalUrlElement;

        this.resultText =
          '<a href="' + url + '">' + pageToLink.data.page.name + '</a>';
      } else {
        this.resultText =
          'Error : Cannot link to page outside of this application';
      }

      html = html.replace(result[0], this.resultText);
      result = regex.exec(html);
    }
    return html;
  };

  /**
   * Checks if page is contained inside the current application
   *
   * @param pageId Id of page to check
   * @param currentAppId Id of current application
   */
  private async checkPageApplication(pageId: any, currentAppId: string) {
    const appPromise: Promise<any> = firstValueFrom(
      this.apollo.query<GetApplicationByIdQueryResponse>({
        query: GET_APPLICATION_BY_ID,
        variables: {
          id: currentAppId,
        },
      })
    );
    const appToCheck = await Promise.resolve(appPromise);
    let isSameApp = false;
    appToCheck.data.application.pages.map((elt: Page) => {
      if (elt.id === pageId) {
        isSameApp = true;
      }
    });
    return isSameApp;
  }
}
