import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

/**
 * Service that injects i18n translations in ui-paginator elements
 *
 * @class MatPaginationIntlService
 * @typedef {MatPaginationIntlService}
 * @augments {MatPaginatorIntl}
 */
@Injectable()
export class MatPaginationIntlService extends MatPaginatorIntl {
  /**
   * Creates an instance of MatPaginationIntlService.
   *
   * @param {TranslateService} translateService Translation Service Instance
   */
  constructor(private translateService: TranslateService) {
    super();

    this.translateService.onLangChange.subscribe((_event: Event) => {
      if (_event) {
        this.translateLabels();
      }
    });

    this.translateLabels();
  }

  /**
   * Returns paginator range string
   *
   * @param {number} page Page Number
   * @param {number} pageSize Page Size
   * @param {number} length Number of Items
   * @returns {string} Paginator Range String
   */
  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
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

  /**
   * Whenever the language changes, updates paginator translations as well
   *
   * @param {TranslateService} translate Translation Service Instance
   */
  injectTranslateService(translate: TranslateService): void {
    this.translateService = translate;

    this.translateService.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  /**
   * Fetches translations
   */
  translateLabels(): void {
    this.itemsPerPageLabel = this.translateService.instant(
      'common.pagination.itemsPerPage'
    );
    this.changes.next();
  }
}
