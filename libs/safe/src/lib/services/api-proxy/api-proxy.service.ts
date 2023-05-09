import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SafeRestService } from '../rest/rest.service';

/**
 * Shared API Proxy service.
 * The API proxy service contacts the back-end generated proxy, based on the API definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeApiProxyService {
  /** API url */
  public baseUrl = '';
  /**
   * Shared API Proxy service.
   * The API proxy service contacts the back-end generated proxy, based on the API definitions.
   *
   * @param restService Shared rest service
   */
  constructor(private restService: SafeRestService) {
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
   * @param name - The name of the API
   * @param pingUrl - The url to ping
   * @returns An observable with results of the request, or null if name is
   * undefined or empty
   */
  public buildPingRequest(name: string | undefined, pingUrl: string): any {
    if (name) {
      const url = `${this.baseUrl}${name}${pingUrl ?? ''}`;
      const headers = this.buildHeaders();
      return this.restService.get(url, { headers });
    }
    return null;
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
}
