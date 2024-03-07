import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponseBase,
} from '@angular/common/http';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { isNil } from 'lodash';

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
        // GraphQl errors would be treated as so for the app even if status is 200
        switchMap((req) => {
          const keysFromBody = Object.keys((req as any).body?.data);
          if (
            req instanceof HttpResponseBase &&
            // Could be cases where we query two different objects and one can fail and the other no
            // In those cases we prioritize the use of correctly retrieved data
            // Therefor we treat as strict error if all queries fail
            (((req as any).body?.errors?.length &&
              keysFromBody?.every((key) =>
                isNil((req as any).body?.data[key])
              )) ||
              keysFromBody?.every((key) => isNil((req as any).body?.data[key])))
          ) {
            return throwError(() => {
              return { error: { errors: (req as any).body?.errors } };
            });
          } else {
            return of(req);
          }
        }),
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
            this.snackbarService.openSnackBar(errorMessage, {
              error: true,
              duration: 0,
            });
          }
          return throwError(() => {
            return !isNil(res.message)
              ? { errors: [res.message] }
              : res.error.errors;
          });
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
