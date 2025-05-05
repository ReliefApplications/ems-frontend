import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { Apollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';
import { setContext } from '@apollo/client/link/context';
import { DownloadService } from '../download/download.service';
import transformGraphQLVariables from '../../utils/reference-data/transform-graphql-variables.util';

/**
 * Common Services connection.
 */
@Injectable({
  providedIn: 'root',
})
export class CommonServicesService {
  /**
   * Common Services connection.
   *
   * @param environment Environment
   * @param restService Shared REST Service
   * @param apollo Apollo client
   * @param httpLink Apollo http link
   */
  constructor(
    @Inject('environment') private environment: any,
    private restService: RestService,
    private apollo: Apollo,
    private httpLink: HttpLink,
    private downloadService: DownloadService
  ) {
    this.createApolloClient();
  }

  /**
   * Build headers with the authentication token to API url.
   *
   * @param headers previous headers
   * @returns new Http headers, with token
   */
  private buildHeaders(headers: HttpHeaders = new HttpHeaders()): HttpHeaders {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      headers = headers.append('Authorization', `Bearer ${accessToken}`);
    }

    return headers.append('Content-Type', 'application/json');
  }

  /**
   * Build GraphQL request
   *
   * @param query GraphQL query
   * @returns Http request as observable
   */
  public graphqlRequest(query: string) {
    const url = `${this.environment.csApiUrl}/graphql/`;
    const headers = this.buildHeaders();
    const body = { query };
    return this.restService.post(url, body, { headers });
  }

  /**
   * Get excel from graphql request
   *
   * @param query GraphQL query
   * @returns Excel download
   */
  public graphqlToExcel(query: string, variables: any = {}) {
    const url = `${this.environment.csApiUrl}/graphql/excel`;
    const headers = this.buildHeaders();
    transformGraphQLVariables(query, variables);
    const body = { query, variables };
    return this.restService
      .post(url, body, { headers, responseType: 'blob' })
      .subscribe({
        next: (file) => {
          const blob = new Blob([file], { type: `text/xlsx;charset=utf-8;` });
          this.downloadService.saveFile('test.xlsx', blob);
        },
      });
  }

  /**
   * Build REST request
   *
   * @param path Endpoint path
   * @returns Http request as observable
   */
  public restRequest(path: string) {
    const url = `${this.environment.csApiUrl}/referenceData/items/${path}`;
    const headers = this.buildHeaders();
    return this.restService.get(url, { headers });
  }

  /**
   * Create Apollo Client to contact CS API.
   */
  private createApolloClient() {
    // Remove client if previously set
    this.apollo.removeClient('csClient');

    const httpLink = this.httpLink.create({
      uri: `${this.environment.csApiUrl}/graphql`,
    });

    const authLink = setContext(() => {
      const token = localStorage.getItem('access_token');
      return {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Accept: 'application/json; charset=utf-8',
          UserTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    const link = authLink.concat(httpLink);

    this.apollo.createNamed('csClient', {
      cache: new InMemoryCache(),
      link,
    });
  }
}
