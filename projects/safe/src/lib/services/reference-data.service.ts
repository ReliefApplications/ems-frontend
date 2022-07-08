import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import get from 'lodash/get';
import { map } from 'rxjs/operators';
import localForage from 'localforage';
import {
  ReferenceData,
  referenceDataType,
} from '../models/reference-data.model';
import {
  GetReferenceDataByIdQueryResponse,
  GET_REFERENCE_DATA_BY_ID,
} from '../graphql/queries';
import { SafeApiProxyService } from './api-proxy.service';

const LAST_MODIFIED_KEY = '_last_modified';
const LAST_REQUEST_KEY = '_last_request';
const LAST_UPDATE_CODE = '$$LAST_UPDATE';

@Injectable({
  providedIn: 'root',
})
export class SafeReferenceDataService {
  constructor(private apollo: Apollo, private apiProxy: SafeApiProxyService) {}

  /**
   * Return a promise with the reference data corresponding to the id passed.
   *
   * @param id Reference data ID.
   * @returns Promised ReferenceData.
   */
  public loadReferenceData(id: string): Promise<ReferenceData> {
    return this.apollo
      .query<GetReferenceDataByIdQueryResponse>({
        query: GET_REFERENCE_DATA_BY_ID,
        variables: {
          id,
        },
      })
      .pipe(map((res) => res.data.referenceData))
      .toPromise();
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
   * Build choices in the right format for a selectable questions.
   *
   * @param items Items used for choices.
   * @param valueField Field used to store the value in the DB.
   * @param displayField Field used for display in the question.
   * @returns Choices.
   */
  private buildChoices(
    items: any[],
    valueField: string,
    displayField: string
  ): { value: string | number; text: string }[] {
    return items.map((item: any) => ({
      value: item[valueField],
      text: item[displayField],
    }));
  }

  /**
   * Asynchronously fetch choices from ReferenceData and return them in the right format for a selectable questions.
   * Include caching for requests to optimise number of requests.
   *
   * @param referenceDataID ReferenceData ID.
   * @param displayField Field used for display in the question.
   * @param filter The filter object
   * @returns Promised choices.
   */
  public async getChoices(
    referenceDataID: string,
    displayField: string,
    filter: any = {}
  ): Promise<{ value: string | number; text: string }[]> {
    // Initialisation
    let items: any;
    const referenceData = await this.loadReferenceData(referenceDataID);
    const cacheKey = referenceData.id || '';
    const valueField = referenceData.valueField || 'id';
    const cacheTimestamp = localStorage.getItem(cacheKey + LAST_MODIFIED_KEY);
    const modifiedAt = referenceData.modifiedAt || '';

    // Check if referenceData has changed. In this case, refresh choices instead of using cached ones.
    if (!cacheTimestamp || cacheTimestamp < modifiedAt) {
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
      // Cache items and timestamp
      localForage.setItem(cacheKey, items);
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
          const cache: any[] | null = await localForage.getItem(cacheKey);
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
        localForage.setItem(cacheKey, items);
        localStorage.setItem(
          cacheKey + LAST_REQUEST_KEY,
          this.formatDateSQL(new Date())
        );
      } else {
        // If referenceData has not changed, use cached value for non graphQL.
        items = await localForage.getItem(cacheKey);
      }
    }
    return this.buildChoices(items, valueField, displayField);
  }

  /**
   * Pad a number to 2 digits string.
   *
   * @param num number to pad
   * @returns 2 digits string.
   */
  private padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }

  /**
   * Format a date to YYYY-MM-DD HH:MM:SS.
   *
   * @param date date to format.
   * @returns String formatted to YYYY-MM-DD HH:MM:SS.
   */
  private formatDateSQL(date: Date): string {
    return (
      [
        date.getFullYear(),
        this.padTo2Digits(date.getMonth() + 1),
        this.padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        this.padTo2Digits(date.getHours()),
        this.padTo2Digits(date.getMinutes()),
        this.padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }
}
