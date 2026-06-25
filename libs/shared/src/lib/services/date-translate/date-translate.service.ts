import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Date translation service.
 */
@Injectable({
  providedIn: 'root',
})
export class DateTranslateService {
  /** Current language */
  private lang: string;

  /**
   * Date translation service.
   *
   * @param translate Angular translation service
   */
  constructor(private translate: TranslateService) {
    this.lang =
      localStorage.getItem('date-lang') ||
      this.translate.currentLang ||
      this.translate.defaultLang;

    this.translate.onLangChange.subscribe((event) => {
      if (!localStorage.getItem('date-lang')) {
        this.lang = event.lang;
      }
    });
  }

  /** @returns Current language */
  get currentLang(): string {
    return this.lang;
  }

  /**
   * Update date language
   *
   * @param lang language to use
   * @param save whether to save preference to localStorage
   */
  public use(lang: string, save = true): void {
    this.lang = lang;
    if (save) {
      localStorage.setItem('date-lang', lang);
    }
  }
}
