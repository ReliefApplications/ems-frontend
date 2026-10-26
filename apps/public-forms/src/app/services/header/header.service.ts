import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Shares the title displayed in the application header.
 * Set by the pages (e.g. the form page once the form is loaded).
 */
@Injectable({ providedIn: 'root' })
export class HeaderService {
  /** Title of the currently displayed form, or null to show the default app title. */
  private formTitle = new BehaviorSubject<string | null>(null);
  /** Title of the currently displayed form, as observable. */
  public formTitle$ = this.formTitle.asObservable();

  /**
   * Additional languages (beyond the default one) supported by the
   * currently displayed form, or null when no form is loaded (no
   * restriction, e.g. on the home page).
   */
  private formLanguages = new BehaviorSubject<string[] | null>(null);
  /** Allowed additional languages for the currently displayed form, as observable. */
  public formLanguages$ = this.formLanguages.asObservable();

  /**
   * Sets the form title displayed in the application header.
   *
   * @param title Form title, or null to show the default app title.
   */
  setFormTitle(title: string | null): void {
    this.formTitle.next(title);
  }

  /**
   * Sets the additional languages supported by the currently displayed form.
   *
   * @param languages Additional languages supported by the form, or null when no form is loaded.
   */
  setFormLanguages(languages: string[] | null): void {
    this.formLanguages.next(languages);
  }
}
