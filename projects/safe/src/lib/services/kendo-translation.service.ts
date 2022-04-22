import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@progress/kendo-angular-l10n';

@Injectable({
  providedIn: 'root',
})
export class KendoTranslationService extends MessageService {
  constructor(private translateService: TranslateService) {
    super();
  }

  get(key: string): string {
    return this.translateService.instant(key);
  }
}
