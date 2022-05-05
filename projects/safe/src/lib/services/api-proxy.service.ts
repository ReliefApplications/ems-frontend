import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

/**
 * Shared API Proxy service.
 * The API proxy service contacts the back-end generated proxy, based on the API definitions.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeApiProxyService {
  /** API url */
  public baseUrl: string;

  /**
   * Shared API Proxy service.
   * The API proxy service contacts the back-end generated proxy, based on the API definitions.
   *
   * @param environment Current environment
   * @param http Http client
   */
  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl + '/proxy/';
  }

  /**
   * Build headers with the authentication token to API url.
   */
  private buildHeaders(): HttpHeaders {
    const token = localStorage.getItem('idtoken');
    return new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Sends a ping request using the passed arguments
   */
  public buildPingRequest(name: string | undefined, pingUrl: string): any {
    if (name) {
      const url = `${this.baseUrl}${name}${pingUrl}`;
      const headers = this.buildHeaders();
      return this.http.get(url, { headers });
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
    return this.http.get(url, { headers }).toPromise();
  }

  /**
   * Builds a post http request
   *
   * @param url URL string.
   * @param body body of the request.
   * @param options standard http otions.
   * @returns Promised http request
   */
  public buildPostRequest(
    url: string,
    body: any,
    options: any = {}
  ): Promise<ArrayBuffer> {
    const headers = this.buildHeaders();
    return this.http.post(url, body, { ...options, headers }).toPromise();
  }
}
