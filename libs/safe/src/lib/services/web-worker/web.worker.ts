import {
  AngularWebWorker,
  bootstrapWorker,
  Callable,
  OnWorkerInit,
} from 'angular-web-worker';
import localForage from 'localforage';
import { isArray, isEqual } from 'lodash';

/**
 *  Interface for items stored in localForage cache.
 */
export interface CachedItems {
  items: any[];
  valueField: string;
}

/// <reference lib="webworker" />

/**
 * Angular web worker
 */
@AngularWebWorker()
export class SafeAppWebWorker implements OnWorkerInit {
  /**
   * On worker init
   */
  onWorkerInit() {
    console.log('Worker instance laoded');
  }

  /**
   * Maps the given choices to a valid choices list for surveyjs
   *
   * @param items The items to map
   * @param mapProperties The properties to map
   * @param mapProperties.valueField The value field
   * @param mapProperties.displayField The display field
   * @param selectedForeignValue The selected foreign value
   * @param filter The filter to apply
   * @param filter.operator The operator to use for the operation
   * @param filter.localField The local field
   * @returns The mapped items
   */
  @Callable()
  public mapChoices(
    items: any[],
    mapProperties: { valueField: string; displayField: string },
    selectedForeignValue?: any,
    filter?: { operator: any; localField: string }
  ): { value: string | number; text: string }[] {
    let finalItems = items;
    if (filter && selectedForeignValue) {
      finalItems = items.filter((item) =>
        this.operate(
          selectedForeignValue,
          filter.operator,
          item[filter.localField]
        )
      );
    }
    const mappedItems = finalItems.map((item) => ({
      value: item[mapProperties.valueField],
      text: item[mapProperties.displayField],
    }));
    return mappedItems;
  }

  /**
   * Map the choices to a valid widget data
   *
   * @param choices The choices to map
   * @param valueField The value field
   * @param textField The text field
   * @returns The mapped widget data
   */
  @Callable()
  mapWidgetData(
    choices: any[],
    valueField: string,
    textField: string
  ): {
    text: any;
    value: any;
  }[] {
    return choices.map((choice: any) =>
      typeof choice === 'string'
        ? {
            text: choice,
            value: choice,
          }
        : {
            text: choice[textField],
            value: choice[valueField],
          }
    );
  }

  /**
   * Updates cache with the given items and cache key
   *
   * @param cacheKey The cache key
   * @param items The items to update
   * @param valueField The value field
   */
  @Callable()
  public async updateCacheStore(
    cacheKey: string,
    items: any[],
    valueField: string
  ) {
    const { items: cache } = (await localForage.getItem(
      cacheKey
    )) as CachedItems;
    if (cache && items && items.length) {
      for (const newItem of items) {
        const cachedItemIndex = cache.findIndex(
          (cachedItem: any) => cachedItem[valueField] === newItem[valueField]
        );
        if (cachedItemIndex !== -1) {
          cache[cachedItemIndex] = newItem;
        } else {
          cache.push(newItem);
        }
      }
    }
    items = cache || [];
    localForage.setItem(cacheKey, { items, valueField });
  }

  /**
   * Get the stored data from localForage
   *
   * @param referenceDataID The reference data ID
   * @returns The stored data
   */
  @Callable()
  public async getStoredData(referenceDataID: string): Promise<CachedItems> {
    const cacheItems = (await localForage.getItem(
      referenceDataID
    )) as CachedItems;
    return cacheItems;
  }

  /**
   * Sort the items by the given field
   *
   * @param items The items to sort
   * @param displayField The display field
   * @returns The sorted items
   */
  @Callable()
  public sortItemsByField(items: any[], displayField: string): any[] {
    const sortItems = items.sort((a: any, b: any) =>
      a[displayField] > b[displayField] ? 1 : -1
    );
    return sortItems;
  }

  /**
   * Calculate an operation for filters
   *
   * @param foreignValue The value which comes from the record item
   * @param operator The operator to use for the operation
   * @param localValue The value which comes from the filter
   * @returns A boolean, indicating the result of the operation
   */
  operate = (foreignValue: any, operator: string, localValue: any): boolean => {
    switch (operator) {
      case 'eq':
        return isEqual(foreignValue, localValue);
      case 'neq':
        return !isEqual(foreignValue, localValue);
      case 'gte':
        return foreignValue >= localValue;
      case 'gt':
        return foreignValue > localValue;
      case 'lte':
        return foreignValue <= localValue;
      case 'lt':
        return foreignValue < localValue;
      case 'contains':
        if (foreignValue === null) return false;
        if (isArray(localValue)) {
          for (const itemValue of localValue) {
            if (!foreignValue.includes(itemValue)) {
              return false;
            }
          }
          return true;
        } else {
          return foreignValue.includes(localValue);
        }
      case 'doesnotcontain':
        if (foreignValue === null) return true;
        if (isArray(localValue)) {
          for (const itemValue of localValue) {
            if (foreignValue.includes(itemValue)) {
              return false;
            }
          }
          return true;
        } else {
          return !foreignValue.includes(localValue);
        }
      case 'iscontained':
        return this.operate(localValue, 'contains', foreignValue);
      case 'isnotcontained':
        return this.operate(localValue, 'doesnotcontain', foreignValue);
      default:
        return true;
    }
  };
}

bootstrapWorker(SafeAppWebWorker);
