import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SafeApiProxyService {

  public baseUrl: string;

  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl;
  }

  /**
   * Send a ping request using the passed arguments
   */
  public buildPingRequest(name: string | undefined, pingUrl: string): any {
    if (name) {
      const url = `${this.baseUrl}/${name}${pingUrl}`;
      const token = localStorage.getItem('msal.idtoken');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });
      return this.http.get(url, { headers });
    }
    return null;
  }

  public promisedRequestWithHeaders(url: string): Promise<any> {
    const token = localStorage.getItem('msal.idtoken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    return this.http.get(url, { headers }).toPromise();
  }
}
