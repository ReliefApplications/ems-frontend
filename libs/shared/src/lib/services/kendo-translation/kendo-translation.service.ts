import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';

/**
 * Shared Kendo Translation Service.
 * This service is used to translate all kendo components, that shows static text.
 */
@Injectable({
  providedIn: 'root',
})
export class KendoTranslationService extends MessageService {
  /**
   * Shared Kendo Translation Service.
   * This service is used to translate all kendo components, that shows static text.
   *
   * @param translateService Angular translation service.
   */
  constructor(private translateService: TranslateService) {
    super();
    this.translateService.onLangChange.subscribe(() => {
      this.notify();
    });
  }

  /**
   * Return locale value of the key.
   *
   * @param key key to translate
   * @returns locale value
   */
  override get(key: string): string {
    return this.translateService.instant(key);
  }
}
