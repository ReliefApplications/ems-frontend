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
   * @returns GraphQL query.
   */
  private buildGraphQLQuery(
    referenceData: ReferenceData,
    newItems = false
  ): string {
    let query = '{ ' + (referenceData.query || '');
    // if (newItems) {
    //   // eslint-disable-next-line prettier/prettier
    //   let filter = 'filter:"modifieddate > \\\"$$TODAY\\\":datetime"'; // TO REMOVE WITH FIELD OF REF DATA
    //   if (filter.includes('$$TODAY')) {
    //     const today = new Date().toISOString().split('T')[0];
    //     filter = filter.split('$$TODAY').join(today);
    //   }
    //   query += '(' + filter + ')';
    // }
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
   * Include caching for graphQL requests to optimise number of requests.
   *
   * @param referenceDataID ReferenceData ID.
   * @param displayField Field used for display in the question.
   * @returns Promised choices.
   */
  public async getChoices(
    referenceDataID: string,
    displayField: string
  ): Promise<{ value: string | number; text: string }[]> {
    const referenceData = await this.loadReferenceData(referenceDataID);
    const cacheKey = referenceData.id || '';
    const valueField = referenceData.valueField || 'id';
    let items: any;
    switch (referenceData.type) {
      case referenceDataType.graphql: {
        const isCached = (await localForage.keys()).includes(cacheKey);
        // Fetch items
        const graphqlEndpoint = '/graphql'; // TO-DO: get it from apiConfiguration
        const url =
          this.apiProxy.baseUrl +
          referenceData.apiConfiguration?.name +
          graphqlEndpoint;
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
    return this.buildChoices(items, valueField, displayField);
  }
}
