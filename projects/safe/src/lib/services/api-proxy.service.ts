import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiConfiguration } from '../models/apiConfiguration.model';

@Injectable({
  providedIn: 'root'
})
export class SafeApiProxyService {

  public baseUrl: string;

  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient
  ) {
    this.baseUrl = environment.API_URL;
  }

  /**
   * Send a ping request using the passed ApiConfiguration
   */
  public buildPingRequest(apiConfiguration: ApiConfiguration | undefined): any {
    if (apiConfiguration) {
      const pingUrl = 'HelloAzureService';
      const url = `${this.baseUrl}/${apiConfiguration.name}/${pingUrl}`;
      // const url = `${this.baseUrl}/auth/EIOS`
      const token = localStorage.getItem('msal.idtoken');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      });
      return this.http.get(url, { headers });
    }
    return null;
  }
}
