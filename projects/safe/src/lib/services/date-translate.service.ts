import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Date translation service.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeDateTranslateService {
  private lang: string;
  private lang$: BehaviorSubject<string>;

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
    this.lang$ = new BehaviorSubject<string>(this.lang);
  }

  /** Return current language */
  get currentLang(): string {
    return this.lang;
  }

  /**
   * Get the current language as an observable to allowed the component to
   * subscribe to it and be aware of language changes.
   *
   * @returns An observable of the current language for the dates
   */
  public getCurrentLang(): Observable<string> {
    return this.lang$.asObservable();
  }

  /**
   * Update date language
   *
   * @param lang language to use
   */
  public use(lang: string): void {
    this.lang = lang;
    this.lang$.next(lang);
    localStorage.setItem('date-lang', lang);
  }
}
