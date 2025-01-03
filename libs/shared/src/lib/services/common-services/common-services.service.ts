import { HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';

/**
 * Common Services connection.
 */
@Injectable({
  providedIn: 'root',
})
export class CommonServicesService {
  /** API url */
  private csBaseUrl = '';

  /**
   * Common Services connection.
   *
   * @param environment Environment
   * @param restService Shared REST Service
   */
  constructor(
    @Inject('environment') private environment: any,
    private restService: RestService
  ) {
    this.csBaseUrl = this.environment.csApiUrl;
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
    const url = `${this.csBaseUrl}/graphql/`;
    const headers = this.buildHeaders();
    const body = { query };
    return this.restService.post(url, body, { headers });
  }

  /**
   * Build REST request
   *
   * @param path Endpoint path
   * @returns Http request as observable
   */
  public restRequest(path: string) {
    const url = `${this.csBaseUrl}/referenceData/items/${path}`;
    const headers = this.buildHeaders();
    return this.restService.get(url, { headers });
  }
}
