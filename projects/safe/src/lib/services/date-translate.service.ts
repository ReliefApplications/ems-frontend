import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SafeDateTranslateService {
  private lang: string;

  constructor(private translate: TranslateService) {
    this.lang =
      localStorage.getItem('date-lang') ||
      this.translate.currentLang ||
      this.translate.defaultLang;
  }

  get currentLang(): string {
    return this.lang;
  }

  public use(lang: string): void {
    this.lang = lang;
    localStorage.setItem('date-lang', lang);
  }
}
