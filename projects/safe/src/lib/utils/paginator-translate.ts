import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class MatPaginationIntlService extends MatPaginatorIntl {
  constructor(private translateService: TranslateService) {
    super();

    this.translateService.onLangChange.subscribe((_event: Event) => {
      if (_event) {
        this.translateLabels();
      }
    });

    this.translateLabels();
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const of = this.translateService
      ? this.translateService.instant('common.pagination.of')
      : 'of';
    if (length === 0 || pageSize === 0) {
      return '0 ' + of + ' ' + length;
    }
    length = Math.max(length, 0);
    const startIndex =
      page * pageSize > length
        ? (Math.ceil(length / pageSize) - 1) * pageSize
        : page * pageSize;

    const endIndex = Math.min(startIndex + pageSize, length);
    return startIndex + 1 + ' - ' + endIndex + ' ' + of + ' ' + length;
  };

  injectTranslateService(translate: TranslateService): void {
    this.translateService = translate;

    this.translateService.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  translateLabels(): void {
    this.itemsPerPageLabel = this.translateService.instant(
      'common.pagination.itemsPerPage'
    );
    this.changes.next();
  }
}
