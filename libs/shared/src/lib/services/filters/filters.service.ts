import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { FILTER_OPERATORS } from '../../components/filter/filter.const';

/** Filters access interface */
export interface Access {
  logic: string;
  filters: (
    | {
        field: string;
        operator: string;
        value?: string;
      }
    | Access
  )[];
}

/**
 * Shared filters service with common filter elements.
 */
@Injectable({ providedIn: 'root' })
export class FiltersService {
  /** Map of operators to their translation */
  public filterOperatorsMap: {
    [key: string]: string;
  } = {
    eq: this.translate.instant('kendo.grid.filterEqOperator'),
    neq: this.translate.instant('kendo.grid.filterNotEqOperator'),
    contains: this.translate.instant('kendo.grid.filterContainsOperator'),
    doesnotcontain: this.translate.instant(
      'kendo.grid.filterNotContainsOperator'
    ),
    startswith: this.translate.instant('kendo.grid.filterStartsWithOperator'),
    endswith: this.translate.instant('kendo.grid.filterEndsWithOperator'),
    isnull: this.translate.instant('kendo.grid.filterIsNullOperator'),
    isnotnull: this.translate.instant('kendo.grid.filterIsNotNullOperator'),
    isempty: this.translate.instant('kendo.grid.filterIsEmptyOperator'),
    isnotempty: this.translate.instant('kendo.grid.filterIsNotEmptyOperator'),
    in: this.translate.instant('kendo.grid.filterIsInOperator'),
    notin: this.translate.instant('kendo.grid.filterIsNotInOperator'),
    gt: this.translate.instant('kendo.grid.filterGtOperator'),
    gte: this.translate.instant('kendo.grid.filterGteOperator'),
    lt: this.translate.instant('kendo.grid.filterLtOperator'),
    lte: this.translate.instant('kendo.grid.filterLteOperator'),
  };

  /**
   * Shared filters service with common filter elements.
   *
   * @param translate Angular translate service
   * @param formBuilder Angular form builder
   */
  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder
  ) {}

  /**
   * Builds a filter form
   *
   * @param filter Initial filter
   * @returns Filter form
   */
  public createFilterGroup(filter: any): FormGroup {
    if (filter?.filters) {
      const filters = filter.filters.map((x: any) => this.createFilterGroup(x));
      return this.formBuilder.group({
        logic: filter.logic || 'and',
        filters: this.formBuilder.array(filters),
      });
    }
    if (filter?.field) {
      const group = this.formBuilder.group({
        field: filter.field,
        operator: filter.operator || 'eq',
        value: Array.isArray(filter.value) ? [filter.value] : filter.value,
      });
      if (
        FILTER_OPERATORS.find((op) => op.value === filter.operator)
          ?.disableValue
      ) {
        group.get('value')?.disable();
      }
      return group;
    }
    return this.formBuilder.group({
      logic: 'and',
      filters: this.formBuilder.array([]),
    });
  }

  /**
   * Gets the string representation of an access object
   *
   * @param access The access object
   * @returns the string representation of an access object
   */
  public getAccessString(access: Access) {
    const rulesStr: string[] = [];
    access.filters.forEach((rule) => {
      // nested access
      // eslint-disable-next-line no-prototype-builtins
      if (rule.hasOwnProperty('logic')) {
        const nestedAccess = rule as Access;
        rulesStr.push(`(${this.getAccessString(nestedAccess)})`);
      } else {
        const r = rule as {
          field: string;
          operator: string;
          value: string;
        };
        rulesStr.push(
          `${r.field} ${this.filterOperatorsMap[r.operator].toLowerCase()} ${
            r.value
          }`.trim()
        );
      }
    });
    if (rulesStr.length)
      return rulesStr.join(
        ` ${(access.logic === 'and'
          ? this.translate.instant('kendo.grid.filterAndLogic')
          : this.translate.instant('kendo.grid.filterOrLogic')
        ).toLowerCase()} `
      );
    else return this.translate.instant('components.role.summary.newFilter');
  }
}
