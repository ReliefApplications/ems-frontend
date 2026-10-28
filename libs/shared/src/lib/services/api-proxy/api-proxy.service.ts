import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { RestService } from '../rest/rest.service';
import { ApiConfiguration } from '../../models/api-configuration.model';

/**
 * Shared API Proxy service.
 * The API proxy service contacts the back-end generated proxy, based on the API definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiProxyService {
  /** API url */
  public baseUrl = '';

  /**
   * Shared API Proxy service.
   * The API proxy service contacts the back-end generated proxy, based on the API definitions.
   *
   * @param restService Shared rest service
   */
  constructor(private restService: RestService) {
    this.baseUrl = restService.apiUrl + '/proxy/';
  }

  /**
   * Build headers with the authentication token to API url.
   *
   * @param headers previous headers
   * @returns new Http headers, with token
   */
  private buildHeaders(headers: HttpHeaders = new HttpHeaders()): HttpHeaders {
    return headers.append('Content-Type', 'application/json');
  }

  /**
   * Sends a ping request to test an API configuration, as currently edited.
   *
   * The back-end only answers with the upstream status, never with the upstream body.
   * It refuses the request with 403 when the user cannot update the configuration,
   * and with 400 when the endpoint or the authentication URL is not a public host.
   *
   * @param api Current API configuration
   * @returns rest service post ping request, undefined when no ping url is set
   */
  public buildPingRequest(
    api: ApiConfiguration
  ): Observable<{ status: number }> | undefined {
    if (api.pingUrl) {
      const url = this.buildPingUrl(api.pingUrl);
      const headers = this.buildHeaders();
      return this.restService.post(url, api, { headers }) as Observable<{
        status: number;
      }>;
    }
    return undefined;
  }

  /**
   * Builds a get http request
   *
   * @param url URL string
   * @returns http request
   */
  public promisedRequestWithHeaders(url: string): Promise<any> {
    const headers = this.buildHeaders();
    return firstValueFrom(this.restService.get(url, { headers }));
  }

  /**
   * Builds a post http request
   *
   * @param url URL string.
   * @param body body of the request.
   * @param options standard http options.
   * @returns Promised http request
   */
  public buildPostRequest(
    url: string,
    body: any,
    options: any = {}
  ): Promise<ArrayBuffer> {
    const headers = this.buildHeaders(options.headers);
    return firstValueFrom(
      this.restService.post(url, body, { ...options, headers })
    );
  }

  /**
   * Builds the ping url to call the backend
   *
   * @param {string} pingUrl ping extension url
   * @returns string ping url
   */
  private buildPingUrl(pingUrl: string): string {
    // if (!apiName.endsWith('/') && !pingUrl.startsWith('/')) {
    //   apiName = apiName + '/';
    // }
    return `${this.baseUrl}ping/${pingUrl}`;
  }
}
