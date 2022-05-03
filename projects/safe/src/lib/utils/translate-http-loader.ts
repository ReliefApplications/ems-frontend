import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * TranslateLoader object to manage missing languages
 */
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

  /**
   * Get the translation file for a specific language. First try to get the
   * file for the given language, then try for the "pure" language if it is a
   * composed-language code (for example try "fr" for "fr-fr"), and finally
   * get the default translation file if no file has been found.
   *
   * @param lang The code of the language file
   * @returns An observable of the language as a dict
   */
  getTranslation(lang: string): Observable<any> {
    return super.getTranslation(lang).pipe(
      catchError((err) => {
        const langCode = lang.split('-')[0];
        if (langCode !== lang) {
          console.warn(`${lang} not found, use ${langCode} instead`);
          return super.getTranslation(langCode);
        } else {
          throw throwError(err);
        }
      }),
      catchError(() => {
        console.warn(`${lang} not found, use ${this.defaultLocale} instead`);
        return super.getTranslation(this.defaultLocale);
      })
    );
  }
}
