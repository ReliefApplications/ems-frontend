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
    this.baseUrl = environment.apiUrl;
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
      const url = `${this.baseUrl}/${name}${pingUrl}`;
      const token = localStorage.getItem('idtoken');
      const headers = new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `Bearer ${token}`,
      });
      return this.http.get(url, { headers });
    }
    return null;
  }

  /**
   * Builds a http request
   *
   * @param url URL string
   * @returns http request
   */
  public promisedRequestWithHeaders(url: string): Promise<any> {
    const token = localStorage.getItem('idtoken');
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${token}`,
    });
    return this.http.get(url, { headers }).toPromise();
  }
}
