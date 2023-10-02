import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Shared Rest service, used to create Http request.
 */
@Injectable({
  providedIn: 'root',
})
export class RestService {
  public apiUrl = '';

  /**
   * Shared Rest service, used to create Http request.
   *
   * @param environment Environment variable
   * @param http Http client
   */
  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  /**
   * Create Http GET request.
   *
   * @param path the path.
   * @param options the options object for http request.
   * @returns Http GET request.
   */
  public get(path: string, options?: any): Observable<any> {
    const url = this.buildUrl(path);
    if (!options) {
      return this.http.get(url);
    }
    return this.http.get(url, options);
  }

  /**
   * Create Http POST request
   *
   * @param path the path.
   * @param body the body of the Http POST request.
   * @param options the options object for http request.
   * @returns Http POST request.
   */
  public post(path: string, body: any, options?: any): Observable<any> {
    const url = this.buildUrl(path);
    if (!options) {
      return this.http.post(url, body);
    }
    return this.http.post(url, body, options);
  }

  /**
   * Build the url from the given path.
   *
   * @param path the path.
   * @returns the url.
   */
  private buildUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    let url = this.apiUrl;
    if (!path.startsWith('/')) {
      url = `${url}/`;
    }
    return `${url}${path}`;
  }
}
