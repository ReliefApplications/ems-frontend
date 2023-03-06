import { TranslateService } from '@ngx-translate/core';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
  isCompositeFilterDescriptor,
} from '@progress/kendo-data-query';

/**
 * Get display of filter group
 *
 * @param fields list of fields
 * @param filter filter value
 * @param translate translate service
 * @returns display string of filter group
 */
export const getFilterGroupDisplay = (
  fields: any[],
  filter: CompositeFilterDescriptor | FilterDescriptor,
  translate: TranslateService
): string => {
  let displayString = '';
  let displayOperator = '';
  if (isCompositeFilterDescriptor(filter)) {
    switch (filter.logic) {
      case 'and': {
        displayOperator = translate.instant('kendo.grid.filterAndLogic');
        break;
      }
      case 'or': {
        displayOperator = translate.instant('kendo.grid.filterOrLogic');
        break;
      }
    }
    if (filter.filters.length > 0) {
      displayString += filter.filters
        .map((x) => getFilterGroupDisplay(fields, x, translate))
        .join(`) ${displayOperator} (`);
      if (filter.filters.length > 1) {
        displayString = `(${displayString})`;
      }
    }
  } else {
    displayString += getFilterRowDisplay(fields, filter, translate);
  }
  return displayString;
};

/**
 * Get display of filter row
 *
 * @param fields list of fields
 * @param filter filter value
 * @param translate translate service
 * @returns display string of filter row
 */
export const getFilterRowDisplay = (
  fields: any[],
  filter: FilterDescriptor,
  translate: TranslateService
): string => {
  let displayString = '';
  const field = fields.find((x) => x.name === filter.field);
  if (field) {
    displayString += `${field.text || field.name} `;
    switch (filter.operator) {
      case 'eq': {
        displayString += `${translate.instant('kendo.grid.filterEqOperator')} `;
        break;
      }
      case 'neq': {
        displayString += `${translate.instant(
          'kendo.grid.filterNotEqOperator'
        )} `;
        break;
      }
      case 'isnull': {
        displayString += `${translate.instant(
          'kendo.grid.filterIsNullOperator'
        )} `;
        break;
      }
      case 'isnotnull': {
        displayString += `${translate.instant(
          'kendo.grid.filterIsNotNullOperator'
        )} `;
        break;
      }
      case 'lt': {
        displayString += `${translate.instant('kendo.grid.filterLtOperator')} `;
        break;
      }
      case 'lte': {
        displayString += `${translate.instant(
          'kendo.grid.filterLteOperator'
        )} `;
        break;
      }
      case 'gt': {
        displayString += `${translate.instant('kendo.grid.filterGtOperator')} `;
        break;
      }
      case 'gte': {
        displayString += `${translate.instant(
          'kendo.grid.filterGteOperator'
        )} `;
        break;
      }
      case 'startswith': {
        displayString += `${translate.instant(
          'kendo.grid.filterStartsWithOperator'
        )} `;
        break;
      }
      case 'endswith': {
        displayString += `${translate.instant(
          'kendo.grid.filterEndsWithOperator'
        )} `;
        break;
      }
      case 'contains': {
        displayString += `${translate.instant(
          'kendo.grid.filterContainsOperator'
        )} `;
        break;
      }
      case 'doesnotcontain': {
        displayString += `${translate.instant(
          'kendo.grid.filterNotContainsOperator'
        )} `;
        break;
      }
      case 'isempty': {
        displayString += `${translate.instant(
          'kendo.grid.filterIsEmptyOperator'
        )} `;
        break;
      }
      case 'isnotempty': {
        displayString += `${translate.instant(
          'kendo.grid.filterIsNotEmptyOperator'
        )} `;
        break;
      }
    }
    displayString += getFieldValueDisplay(field, filter.value);
  }
  return displayString;
};

/**
 * Get display of filter field value
 *
 * @param field active field
 * @param value filter value
 * @returns display string of filter field value
 */
const getFieldValueDisplay = (field: any, value: any): string => {
  if (field.options) {
    if (Array.isArray(value)) {
      return field.options.reduce(
        (acc: string[], x: any) =>
          value.includes(x.value) ? acc.concat([x.text]) : acc,
        []
      );
    } else {
      return field.options.find((x: any) => x.value === value)?.text || '';
    }
  } else {
    return value;
  }
};
