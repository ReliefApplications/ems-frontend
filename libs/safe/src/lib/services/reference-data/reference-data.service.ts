import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { isArray, isEqual, get } from 'lodash';
import { map } from 'rxjs/operators';
import localForage from 'localforage';
import {
  ReferenceData,
  referenceDataType,
} from '../../models/reference-data.model';
import {
  GetReferenceDataByIdQueryResponse,
  GET_REFERENCE_DATA_BY_ID,
} from './graphql/queries';
import { SafeApiProxyService } from '../api-proxy/api-proxy.service';
import { firstValueFrom } from 'rxjs';
import { ApiConfiguration } from '../../models/apiConfiguration.model';

/** Local storage key for last modified */
const LAST_MODIFIED_KEY = '_last_modified';
/** Local storage key for last request */
const LAST_REQUEST_KEY = '_last_request';
/** Property for filtering in requests */
const LAST_UPDATE_CODE = '{{lastUpdate}}';

/**
 *  Interface for items stored in localForage cache.
 */
interface CachedItems {
  items: any[];
  valueField: string;
}

/** Service for reference data */
@Injectable({
  providedIn: 'root',
})
export class SafeReferenceDataService {
  /**
   * Constructor of the service
   *
   * @param apollo The apollo client
   * @param apiProxy The api proxy service
   */
  constructor(private apollo: Apollo, private apiProxy: SafeApiProxyService) {}

  /**
   * Return a promise with the reference data corresponding to the id passed.
   *
   * @param id Reference data ID.
   * @returns Promised ReferenceData.
   */
  public loadReferenceData(id: string): Promise<ReferenceData> {
    return firstValueFrom(
      this.apollo
        .query<GetReferenceDataByIdQueryResponse>({
          query: GET_REFERENCE_DATA_BY_ID,
          variables: {
            id,
          },
        })
        .pipe(map(({ data }) => data.referenceData))
    );
  }

  /**
   * Build a graphQL query based on the ReferenceData configuration.
   *
   * @param referenceData Reference data configuration.
   * @param newItems do we need to query only new items
   * @returns GraphQL query.
   */
  private buildGraphQLQuery(
    referenceData: ReferenceData,
    newItems = false
  ): string {
    let query = '{ ' + (referenceData.query || '');
    if (newItems && referenceData.graphQLFilter) {
      let filter = `${referenceData.graphQLFilter}`;
      if (filter.includes(LAST_UPDATE_CODE)) {
        const lastUpdate =
          localStorage.getItem(referenceData.id + LAST_REQUEST_KEY) ||
          this.formatDateSQL(new Date(0));
        filter = filter.split(LAST_UPDATE_CODE).join(lastUpdate);
      }
      query += '(' + filter + ')';
    }
    query += ' { ';
    for (const field of referenceData.fields || []) {
      query += field + ' ';
    }
    query += '} }';
    return query;
  }

  /**
   * Asynchronously fetch choices from ReferenceData and return them in the right format for a selectable questions.
   * Include caching for requests to optimize number of requests.
   *
   * @param referenceDataID ReferenceData ID.
   * @param displayField Field used for display in the question.
   * @param filter The filter object
   * @param filter.foreignReferenceData The reference data name of the foreign question
   * @param filter.foreignField The field name for the foreign question
   * @param filter.foreignValue The value to filter on for the foreign field
   * @param filter.localField The field to filter on on the local reference data
   * @param filter.operator The operator to filter
   * @returns Promised choices.
   */
  public async getChoices(
    referenceDataID: string,
    displayField: string,
    filter?: {
      foreignReferenceData: string;
      foreignField: string;
      foreignValue: any;
      localField: string;
      operator: string;
    }
  ): Promise<{ value: string | number; text: string }[]> {
    const sortByDisplayField = (a: any, b: any) =>
      a[displayField] > b[displayField] ? 1 : -1;

    // get items
    const { items: items_, valueField } = (await localForage.getItem(
      referenceDataID
    )) as CachedItems;
    // sort items by displayField
    const items = items_.sort(sortByDisplayField);
    const foreignIsMultiselect = Array.isArray(filter?.foreignValue);
    // if we ask to filter and there is a value in foreign field
    if (
      filter &&
      ((foreignIsMultiselect && filter.foreignValue.length) ||
        (!foreignIsMultiselect && !!filter.foreignValue))
    ) {
      const { items: foreignItems, valueField: foreignValueField } =
        (await localForage.getItem(filter.foreignReferenceData)) as CachedItems;
      let selectedForeignValue: any | any[];
      // Retrieve foreign field items for multiselect or single select
      if (foreignIsMultiselect) {
        selectedForeignValue = filter.foreignValue.map(
          (value: any) =>
            foreignItems.find((item) => item[foreignValueField] === value)[
              filter.foreignField
            ]
        );
      } else {
        selectedForeignValue = foreignItems.find(
          (item) => item[foreignValueField] === filter.foreignValue
        )[filter.foreignField];
      }
      return items
        .filter((item) =>
          this.operate(
            selectedForeignValue,
            filter.operator,
            item[filter.localField]
          )
        )
        .map((item) => ({
          value: item[valueField],
          text: item[displayField],
        }));
    }
    // if we don't have to filter
    return items.map((item) => ({
      value: item[valueField],
      text: item[displayField],
    }));
  }

  /**
   * Get the items and the value field of a reference data
   *
   * @param referenceDataID The reference data id
   * @returns The item list and the value field
   */
  public async cacheItems(referenceDataID: string): Promise<void> {
    // Initialization
    let items: any;
    const referenceData = await this.loadReferenceData(referenceDataID);
    const cacheKey = referenceData.id || '';
    const valueField = referenceData.valueField || 'id';
    const cacheTimestamp = localStorage.getItem(cacheKey + LAST_MODIFIED_KEY);
    const modifiedAt = referenceData.modifiedAt || '';

    // Check if referenceData has changed. In this case, refresh choices instead of using cached ones.
    if (!cacheTimestamp || cacheTimestamp < modifiedAt) {
      items = await this.fetchItems(referenceData);
      // Cache items and timestamp
      localForage.setItem(cacheKey, { items, valueField });
      localStorage.setItem(cacheKey + LAST_MODIFIED_KEY, modifiedAt);
    } else {
      // If referenceData has not changed, use cached value and check for updates for graphQL.
      if (referenceData.type === referenceDataType.graphql) {
        const isCached = (await localForage.keys()).includes(cacheKey);
        // Fetch items
        const url =
          this.apiProxy.baseUrl +
          referenceData.apiConfiguration?.name +
          referenceData.apiConfiguration?.graphQLEndpoint;
        const body = { query: this.buildGraphQLQuery(referenceData, isCached) };
        const data = (await this.apiProxy.buildPostRequest(url, body)) as any;
        items = referenceData.path ? get(data, referenceData.path) : data;
        items = referenceData.query ? items[referenceData.query] : items;
        // Cache items
        if (isCached) {
          const { items: cache } = (await localForage.getItem(
            cacheKey
          )) as CachedItems;
          if (cache && items && items.length) {
            for (const newItem of items) {
              const cachedItemIndex = cache.findIndex(
                (cachedItem) => cachedItem[valueField] === newItem[valueField]
              );
              if (cachedItemIndex !== -1) {
                cache[cachedItemIndex] = newItem;
              } else {
                cache.push(newItem);
              }
            }
          }
          items = cache || [];
        }
        localForage.setItem(cacheKey, { items, valueField });
        localStorage.setItem(
          cacheKey + LAST_REQUEST_KEY,
          this.formatDateSQL(new Date())
        );
      } else {
        // If referenceData has not changed, use cached value for non graphQL.
        items = ((await localForage.getItem(cacheKey)) as CachedItems)?.items;
        if (!items) {
          items = await this.fetchItems(referenceData);
          // Cache items and timestamp
          localForage.setItem(cacheKey, { items, valueField });
          localStorage.setItem(cacheKey + LAST_MODIFIED_KEY, modifiedAt);
        }
      }
    }
  }

  /**
   * Fetch items from reference data parameters and set cache
   *
   * @param referenceData reference data to query items of
   * @returns list of items
   */
  private async fetchItems(referenceData: ReferenceData): Promise<any[]> {
    const cacheKey = referenceData.id || '';
    // Initialization
    let items: any;
    switch (referenceData.type) {
      case referenceDataType.graphql: {
        const url =
          this.apiProxy.baseUrl +
          referenceData.apiConfiguration?.name +
          referenceData.apiConfiguration?.graphQLEndpoint;
        const body = { query: this.buildGraphQLQuery(referenceData, false) };
        const data = (await this.apiProxy.buildPostRequest(url, body)) as any;
        items = referenceData.path ? get(data, referenceData.path) : data;
        items = referenceData.query ? items[referenceData.query] : items;
        localStorage.setItem(
          cacheKey + LAST_REQUEST_KEY,
          this.formatDateSQL(new Date())
        );
        break;
      }
      case referenceDataType.rest: {
        const url =
          this.apiProxy.baseUrl +
          referenceData.apiConfiguration?.name +
          referenceData.query;
        const data = await this.apiProxy.promisedRequestWithHeaders(url);
        items = referenceData.path ? get(data, referenceData.path) : data;
        break;
      }
      case referenceDataType.static: {
        items = referenceData.data;
        break;
      }
      default: {
        items = referenceData.data;
        break;
      }
    }
    return items;
  }

  /**
   * Format a date to YYYY-MM-DD HH:MM:SS.
   *
   * @param date date to format.
   * @returns String formatted to YYYY-MM-DD HH:MM:SS.
   */
  private formatDateSQL(date: Date): string {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000) // remove timezone
      .toISOString() // convert to iso string
      .replace('T', ' ') // remove the T between date and time
      .split('.')[0]; // remove the decimals after the seconds
  }

  /**
   * Calculate an operation for filters
   *
   * @param foreignValue The value which comes from the record item
   * @param operator The operator to use for the operation
   * @param localValue The value which comes from the filter
   * @returns A boolean, indicating the result of the operation
   */
  private operate = (
    foreignValue: any,
    operator: string,
    localValue: any
  ): boolean => {
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

  /**
   * Gets the fields from the API Configuration
   * and parses them to a list of fields names and types
   *
   * @param apiConfiguration API Configuration
   * @param path Path to the data
   * @param query Query name
   * @param type Type of reference data
   * @returns List of fields names and types
   */
  public async getFields(
    apiConfiguration: ApiConfiguration,
    path: string,
    query: string,
    type: referenceDataType
  ) {
    const referenceData: ReferenceData = {
      apiConfiguration,
      path,
      query,
      type,
    };

    const object = await this.fetchItems(referenceData);

    if (object && object.length > 0) {
      const fields: {
        name: string;
        type: string;
      }[] = [];
      for (const key of Object.keys(object[0])) {
        fields.push({ name: key, type: typeof object[0][key] });
      }
      return fields;
    }

    return [];
  }
}
