import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

/**
 * Shared Language interceptor service.
 * Adds the current language to the request headers.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageInterceptorService implements HttpInterceptor {
  /**
   * Shared Language interceptor service
   *
   * @param translateService Angular translate service
   */
  constructor(private translateService: TranslateService) {}

  /**
   * Intercept request to add the current language to headers
   *
   * @param request http request
   * @param next next interceptor in chain
   * @returns event if new language in request
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const currentLang = this.translateService.currentLang;
    if (currentLang) {
      request = request.clone({
        setHeaders: {
          Language: currentLang,
        },
      });
    }
    return next.handle(request);
  }
}
