import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';

/**
 * Error handler interceptor service
 */
@Injectable()
export class ErrorHandlerInterceptorService implements HttpInterceptor {
  /**
   * Error handler interceptor service constructor
   *
   * @param snackbarService Snackbar service
   * @param environment Current environment data
   */
  constructor(
    private snackbarService: SnackbarService,
    @Inject('environment') private environment: any
  ) {}

  /**
   * Handle http request error to show a snackbar in the UI
   *
   * @param request Http request
   * @param next Http request handler
   * @returns Current request result
   */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes(this.environment.apiUrl)) {
      return next.handle(request).pipe(
        catchError((res: any) => {
          // Open default snackbar if error is not a GraphQL type
          if (res.status) {
            let errorMessage = `${res.statusText}: ${res.status}`;
            if (Array.isArray(res.error.errors)) {
              res.error.errors.forEach((error: { message: string }) => {
                errorMessage = errorMessage + '\n' + error.message;
              });
            } else {
              errorMessage = errorMessage + '\n' + res.error;
            }
            errorMessage = errorMessage + '\n' + res.message;
            this.snackbarService.openSnackBar(errorMessage, {
              error: true,
              duration: 0,
            });
          }
          return throwError(() => res.error.errors);
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
