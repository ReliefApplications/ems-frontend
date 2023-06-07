import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Page } from '../../models/page.model';
import { firstValueFrom } from 'rxjs';
import {
  GET_PAGE_BY_ID,
  GetPageByIdQueryResponse,
  GET_APPLICATION_BY_ID,
  GetApplicationByIdQueryResponse,
} from './graphql/queries';

/**
 * Service used in widgets to redirect to another page from the same app
 */
@Injectable({
  providedIn: 'root',
})
export class ToPageFromWidgetService {
  public environment: any;

  /**
   * Service to redirect to a page from a widget
   *
   * @param environment Environment specific data
   * @param router Angular router
   * @param apollo Apollo service
   */
  constructor(
    @Inject('environment') environment: any,
    private router: Router,
    private apollo: Apollo
  ) {
    this.environment = environment;
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
      let currentAppId: string;

      //Get current app ID through the url of the current page
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
      let resultText = '';
      if (sameApplication) {
        //Get page information from the database
        const pageInfo = await this.getPageInfo(pageId, currentAppId);

        resultText = '<a href="' + pageInfo.url + '">' + pageInfo.name + '</a>';
      } else {
        resultText = 'Error : Cannot link to page outside of this application';
      }

      html = html.replace(result[0], resultText);
      result = regex.exec(html);
    }
    return html;
  };

  /**
   * Gets the page information including url for the page
   *
   * @param pageId ID of the page to get information on
   * @param currentAppId ID of the current application
   * @returns the page information
   */
  public async getPageInfo(pageId: any, currentAppId: any) {
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
      currentAppId + '/' + pageToLink.data.page.type + '/' + finalUrlElement;

    return { url: url, name: pageToLink.data.page.name };
  }

  /**
   * Checks if page is contained inside the current application
   *
   * @param pageId Id of page to check
   * @param currentAppId Id of current application
   */
  public async checkPageApplication(pageId: any, currentAppId: string) {
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
