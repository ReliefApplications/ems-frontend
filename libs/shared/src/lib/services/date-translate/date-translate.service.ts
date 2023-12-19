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
  }

  /** @returns Current language */
  get currentLang(): string {
    return this.lang;
  }

  /**
   * Update date language
   *
   * @param lang language to use
   */
  public use(lang: string): void {
    this.lang = lang;
    localStorage.setItem('date-lang', lang);
  }
}
