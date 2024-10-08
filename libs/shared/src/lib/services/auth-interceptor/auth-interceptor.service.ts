import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { RestService } from '../rest/rest.service';
import { ShadowDomService } from '@oort-front/ui';
import { jwtDecode } from 'jwt-decode';

/**
 * Shared Authentication interceptor service
 */
@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  /** Boolean flag to indicate if token refresh is on going for the intercepted request */
  private refreshTokenInProgress = false;
  /** Observable to handle hold request after token is refreshed */
  private refreshTokenDone = new BehaviorSubject<any>(null);

  /**
   * Shared Authentication interceptor service
   *
   * @param authService Shared authentication service
   * @param restService Shared rest service
   * @param shadowDomService Shared shadow dom service
   */
  constructor(
    private authService: AuthService,
    private restService: RestService,
    private shadowDomService: ShadowDomService
  ) {}

  /**
   * Clones the current intercepted request and sets the current idtoken
   *
   * @param request Current intercepted request
   * @returns Intercepted request with the current idtoken
   */
  private addBearerTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    // If we have a token, we set it to the header
    const token = this.authService.getAuthToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
  }

  /**
   * Clones the current intercepted request and sets the current access_token
   *
   * @param request Current intercepted request
   * @returns Intercepted request with the current access_token
   */
  private addAccessTokenToRequest(request: HttpRequest<any>): HttpRequest<any> {
    // Passing the access token so backend can use it in proxy request involving authorization code flow
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      request = request.clone({
        setHeaders: {
          AccessToken: accessToken,
        },
      });
    }
    return request;
  }

  /**
   * Clones the current intercepted request and sets the current tokens
   *
   * @param request Current intercepted request
   * @returns Intercepted request with the current tokens
   */
  private addTokensToRequest(request: HttpRequest<any>): HttpRequest<any> {
    if (request.url.startsWith(this.restService.apiUrl)) {
      request = this.addBearerTokenToRequest(request);
      request = this.addAccessTokenToRequest(request);
    }
    return request;
  }

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
    /**
     * Pipes current request with a default logic
     *
     * @returns request with default pipe logic
     */
    const defaultPipedRequest = () => {
      request = this.addTokensToRequest(request);
      return next.handle(request).pipe(
        catchError((err) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              // redirect user to the logout page
            }
          }
          return throwError(() => new Error(err.error || err.message));
        })
      );
    };

    /** Check if access token from system embedding web-widgets needs refresh */
    if (this.shadowDomService.isShadowRoot) {
      const currentToken = this.authService.getAuthToken();
      if (
        currentToken &&
        jwtDecode(currentToken as string)?.exp &&
        new Date((jwtDecode(currentToken)?.exp as number) * 1000) <=
          new Date(new Date().getTime() + 5 * 60 * 1000)
      ) {
        // Send signal to system embedding web-widgets to trigger access token refresh method of it's own
        this.authService.refreshToken.next(true);
        if (!this.refreshTokenInProgress) {
          this.refreshTokenInProgress = true;
          this.refreshTokenDone.next(null);
          return this.authService.isTokenRefreshed$.pipe(
            filter((isRefreshed) => !!isRefreshed),
            switchMap(() => {
              // When token is refreshed signal is received, send the request again with the new access token
              this.refreshTokenInProgress = false;
              this.refreshTokenDone.next(true);
              return defaultPipedRequest();
            })
          );
        } else {
          // Logic to handle for any other intercepted request while token was refreshing
          return this.refreshTokenDone.asObservable().pipe(
            filter((result) => !!result),
            take(1),
            switchMap(() => {
              return defaultPipedRequest();
            })
          );
        }
      } else {
        return defaultPipedRequest();
      }
    } else {
      return defaultPipedRequest();
    }
  }
}
