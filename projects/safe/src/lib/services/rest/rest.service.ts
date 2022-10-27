import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SafeRestService {
  public apiUrl = '';

  constructor(
    @Inject('environment') environment: any,
    private http: HttpClient
  ) {
    this.apiUrl = environment.apiUrl;
  }

  public get(path: string, options?: any): Observable<any> {
    const url = this.buildUrl(path);
    if (!options) {
      return this.http.get(url);
    }
    return this.http.get(url, options);
  }

  public post(path: string, body: any, options?: any): Observable<any> {
    const url = this.buildUrl(path);
    if (!options) {
      return this.http.post(url, body);
    }
    return this.http.post(url, body, options);
  }

  private buildUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    let url = this.apiUrl;
    if (!path.startsWith('/')) {
      url = `${url}/`
    }
    return `${url}${path}`;
  }
}
