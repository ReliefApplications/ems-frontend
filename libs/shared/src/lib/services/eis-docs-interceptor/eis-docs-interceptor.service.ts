import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Shared EIS docs interceptor service
 */
@Injectable({
  providedIn: 'root',
})
export class EISDocsInterceptorService implements HttpInterceptor {
  /**
   * Shared EIS docs interceptor service
   *
   * @param environment environment
   */
  constructor(@Inject('environment') private environment: any) {}

  /**
   * Intercept request to format given errors from CS API accordingly to our frontend
   *
   * @param request http request
   * @param next next interceptor in chain
   * @returns request with format error if needed
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.startsWith(this.environment.csApiUrl)) {
      return next.handle(request).pipe(
        catchError((err) => {
          return throwError(
            () =>
              new HttpErrorResponse({
                ...err,
                error: JSON.stringify(err),
              })
          );
        })
      );
    }
    return next.handle(request);
  }
}
