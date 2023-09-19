import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { RestService } from '../rest/rest.service';

/**
 * Shared Authentication interceptor service
 */
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  /**
   * Shared Authentication interceptor service
   *
   * @param authService Shared authentication service
   * @param restService Shared rest service
   */
  constructor(
    private authService: AuthService,
    private restService: RestService
  ) {}

  /**
   * Intercept request to add token to headers
   *
   * @param request http request
   * @param next next interceptor in chain
   * @returns event if new token in request
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getAuthToken();

    if (request.url.startsWith(this.restService.apiUrl) && token) {
      // If we have a token, we set it to the header
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // redirect user to the logout page
          }
        }
        return throwError(() => new Error(err.message));
      })
    );
  }
}
