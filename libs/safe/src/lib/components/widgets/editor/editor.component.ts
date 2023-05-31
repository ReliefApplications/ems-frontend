import { Component, OnInit, Input, Inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Apollo } from 'apollo-angular';
import {
  GET_RECORD_BY_ID,
  GetRecordByIdQueryResponse,
  GET_PAGE_BY_ID,
  GetPageByIdQueryResponse,
  GET_APPLICATION_BY_ID,
  GetApplicationByIdQueryResponse,
} from './graphql/queries';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

/**
 * Text widget component using KendoUI
 */
@Component({
  selector: 'safe-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class SafeEditorComponent implements OnInit {
  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() public title = '';
  @Input() public text = '';
  @Input() public record = '';

  // === TEXT SANITIZED ===
  public safeText: SafeHtml = '';
  resultText = '';

  public environment: any;

  /**
   * Constructor for safe-editor component
   *
   * @param sanitizer Dom sanitizer instance
   * @param environment Environment specific data
   * @param apollo Apollo instance
   * @param router Angular Router
   */
  constructor(
    private sanitizer: DomSanitizer,
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private router: Router
  ) {
    this.environment = environment;
  }

  /** Sanitize the text. */
  async ngOnInit(): Promise<void> {
    if (!this.record) {
      this.safeText = this.sanitizer.bypassSecurityTrustHtml(
        await this.applyPage(this.text)
      );
      return;
    }

    this.apollo
      .query<GetRecordByIdQueryResponse>({
        query: GET_RECORD_BY_ID,
        variables: {
          id: this.record,
        },
      })
      .subscribe(async (res) => {
        const regex = /{{data\.(.*?)}}/g;
        const data = res.data?.record.data || {};
        // replace all {{data.<field>}} with the value from the data
        const textWithAddedData = this.text.replace(regex, (match) => {
          const field = match.replace('{{data.', '').replace('}}', '');
          return data[field] || match;
        });
        this.safeText = this.sanitizer.bypassSecurityTrustHtml(
          await this.applyPage(textWithAddedData)
        );
      });
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
    console.log('we are here', regex, html);
    while (result !== null) {
      const pageId = result[0]
        .substring(result[0].indexOf('(') + 1, result[0].lastIndexOf(')'))
        .trim();
      console.log('PAGE ID', pageId);
      //Get current app ID through the url of the current page
      let currentAppId: string;
      if (this.router.url.includes('applications/')) {
        currentAppId = this.router.url.split('/')[2];
      } else {
        const urlAfterApp = this.router.url.substring(
          this.router.url.lastIndexOf(
            this.environment.frontOfficeUri + 'applications/'
          ) + 1
        );
        currentAppId = urlAfterApp.split('/')[1];
      }
      //Check if page to link is from same app or not. If not, do not link it
      const sameApplication = await this.checkPageApplication(
        pageId,
        currentAppId
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
          currentAppId +
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
    appToCheck.data.application.pages.map((elt: any) => {
      if (elt.id === pageId) {
        isSameApp = true;
      }
    });
    return isSameApp;
  }
}
