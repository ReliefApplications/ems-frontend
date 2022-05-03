import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class SafeTranslateHttpLoader extends TranslateHttpLoader {
  defaultLocale: string;

  constructor(
    defaultLocale: string,
    http: HttpClient,
    prefix?: string,
    suffix?: string
  ) {
    super(http, prefix, suffix);
    this.defaultLocale = defaultLocale;
  }

  getTranslation(lang: string): Observable<any> {
    return super.getTranslation(lang).pipe(
      catchError(() => {
        const langCode = lang.split('-')[0];
        console.warn(`${lang} not found, use ${langCode} instead`);
        return super.getTranslation(langCode);
      }),
      catchError(() => {
        console.warn(`${lang} not found, use ${this.defaultLocale} instead`);
        return super.getTranslation(this.defaultLocale);
      })
    );
  }
}
