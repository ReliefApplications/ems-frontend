import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
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
   * @returns new Http headers, with token
   */
  private buildHeaders(): HttpHeaders {
    return new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    });
  }

  /**
   * Sends a ping request using the passed arguments
   *
   * @param api Current API configuration
   * @returns rest service post ping request
   */
  public buildPingRequest(api: ApiConfiguration): any {
    if (api.pingUrl) {
      const url = this.buildPingUrl(api.pingUrl);
      const headers = this.buildHeaders();
      return this.restService.post(url, api, { headers });

      // if (name) {
      //   const url = this.buildPingUrl(name, pingUrl);
      //   const headers = this.buildHeaders();
      //   if (body) {
      //     return this.restService.post(this.baseUrl, body, { headers });
      //   }
      //   return this.restService.get(url, { headers });
      // }
      // return null;
    }
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
    const headers = this.buildHeaders();
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
    return `${this.baseUrl}/ping/${pingUrl}`;
  }
}
