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
   * Sets the form title displayed in the application header.
   *
   * @param title Form title, or null to show the default app title.
   */
  setFormTitle(title: string | null): void {
    this.formTitle.next(title);
  }
}
