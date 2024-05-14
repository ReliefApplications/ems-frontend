import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { isArray, isEqual, get, set } from 'lodash';
import { map } from 'rxjs/operators';
import localForage from 'localforage';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
  referenceDataType,
} from '../../models/reference-data.model';
import { ApiProxyService } from '../api-proxy/api-proxy.service';
import { GET_REFERENCE_DATA_BY_ID } from './graphql/queries';
import { firstValueFrom } from 'rxjs';
import {
  ApiConfiguration,
  authType,
} from '../../models/api-configuration.model';
import jsonpath from 'jsonpath';
import toJsonSchema from 'to-json-schema';
import transformGraphQLVariables from '../../utils/reference-data/transform-graphql-variables.util';
import { HttpHeaders } from '@angular/common/http';

/** Local storage key for last request */
const LAST_REQUEST_KEY = '_last_request';
/** Property for filtering in requests */
const LAST_UPDATE_CODE = '{{lastUpdate}}';
/**
 *  Interface for items stored in localForage cache.
 */
interface CachedItems {
  items: any[];
  pageInfo?: any;
  valueField: string;
}

/**
 * Reference data service
 */
@Injectable({
  providedIn: 'root',
})
export class ReferenceDataService {
  /**
   * Reference data service
   *
   * @param apollo The apollo client
   * @param apiProxy The api proxy service
   */
  constructor(private apollo: Apollo, private apiProxy: ApiProxyService) {}

  /**
   * Return a promise with the reference data corresponding to the id passed.
   *
   * @param id Reference data ID.
   * @returns Promised ReferenceData.
   */
  public loadReferenceData(id: string): Promise<ReferenceData> {
    return firstValueFrom(
      this.apollo
        .query<ReferenceDataQueryResponse>({
          query: GET_REFERENCE_DATA_BY_ID,
          variables: {
            id,
          },
        })
        .pipe(map(({ data }) => data.referenceData))
    );
  }

  /**
   * Asynchronously fetch choices from ReferenceData and return them in the right format for a selectable questions.
   * Include caching for requests to optimize number of requests.
   *
   * @param referenceDataID ReferenceData ID.
   * @param displayField Field used for display in the question.
   * @param storePrimitiveValue Whether to store the whole item or only the primitive value given the displayField
   * @param graphQLVariables optional graphql variables, built from form value
   * @returns Promised choices.
   */
  public async getChoices(
    referenceDataID: string,
    displayField: string,
    storePrimitiveValue: boolean = true,
    graphQLVariables?: any
  ): Promise<{ value: string | number; text: string }[]> {
    const sortByDisplayField = (a: any, b: any) =>
      a[displayField] > b[displayField] ? 1 : -1;

    // get items
    const { items, referenceData } = await this.cacheItems(
      referenceDataID,
      graphQLVariables && graphQLVariables
    );
    const valueField = referenceData?.valueField || '';

    // sort items by displayField
    items.sort(sortByDisplayField);
    // if we don't have to filter
    return items.map((item) => ({
      value: storePrimitiveValue ? item[valueField] : item,
      text: item[displayField],
    }));
  }

  /**
   * Get the items and the value field of a reference data
   *
   * @param referenceData The reference data id or the reference data object
   * @param variables Graphql variables ( optional )
   * @returns The item list and the value field
   */
  public async cacheItems(
    referenceData: string | ReferenceData,
    variables: any = {}
  ) {
    // Initialization
    let items: any[] = [];
    let paginationRes: Awaited<
      ReturnType<typeof this.processItemsByRequestType>
    >['pageInfo'] = null;

    if (typeof referenceData === 'string') {
      referenceData = await this.loadReferenceData(referenceData);
    }
    const cacheKey = `${referenceData.id || ''}-${JSON.stringify(variables)}`;
    const valueField = referenceData.valueField || 'id';
    const cacheTimestamp = localStorage.getItem(cacheKey + LAST_REQUEST_KEY);
    const modifiedAt = referenceData.modifiedAt || '';

    const isCached =
      cacheTimestamp &&
      cacheTimestamp >= modifiedAt &&
      (await localForage.keys()).includes(cacheKey);

    // If it isn't cached, fetch items and cache them
    if (!isCached) {
      const { items: i, pageInfo: p } = await this.fetchItems(
        referenceData,
        variables
      );
      items = i;
      paginationRes = p;
      // Cache items and timestamp
      await localForage.setItem(cacheKey, { items, valueField, pageInfo: p });
      localStorage.setItem(cacheKey + LAST_REQUEST_KEY, modifiedAt);
    } else {
      // If referenceData has not changed, use cached value and check for updates for graphQL.
      if (referenceData.type === referenceDataType.graphql) {
        // Cache items
        const { items: cache, pageInfo: p } = (await localForage.getItem(
          cacheKey
        )) as CachedItems;
        items = cache || [];
        paginationRes = p;

        await localForage.setItem(cacheKey, { items, valueField, pageInfo: p });
        localStorage.setItem(
          cacheKey + LAST_REQUEST_KEY,
          this.formatDateSQL(new Date())
        );
      } else {
        // If referenceData has not changed, use cached value for non graphQL.
        items = ((await localForage.getItem(cacheKey)) as CachedItems)?.items;
        if (!items) {
          items = (await this.fetchItems(referenceData)).items;
          // Cache items and timestamp
          await localForage.setItem(cacheKey, { items, valueField });
          localStorage.setItem(cacheKey + LAST_REQUEST_KEY, modifiedAt);
        }
      }
    }

    return { items, referenceData, pageInfo: paginationRes };
  }

  /**
   * Fetch items from reference data parameters and set cache
   *
   * @param referenceData reference data to query items of
   * @param variables Graphql variables (optional)
   * @returns list of items
   */
  public async fetchItems(referenceData: ReferenceData, variables: any = {}) {
    const cacheKey = referenceData.id || '';
    // Initialization
    let items: any[];
    let paginationInfo: Awaited<
      ReturnType<typeof this.processItemsByRequestType>
    >['pageInfo'] = null;

    switch (referenceData.type) {
      case referenceDataType.graphql: {
        const { items: i, pageInfo: p } = await this.processItemsByRequestType(
          referenceData,
          referenceDataType.graphql,
          variables
        );
        items = i;
        paginationInfo = p;
        localStorage.setItem(
          cacheKey + LAST_REQUEST_KEY,
          this.formatDateSQL(new Date())
        );
        break;
      }
      case referenceDataType.rest: {
        items = (
          await this.processItemsByRequestType(
            referenceData,
            referenceDataType.rest
          )
        ).items;
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
    return { items, pageInfo: paginationInfo };
  }

  /**
   * Builds the request and process the query for the given reference data item and reference data request type
   *
   * @param referenceData Reference data item
   * @param type Reference data request type
   * @param variables Graphql variables (optional)
   * @returns processed items by the request type
   */
  private async processItemsByRequestType(
    referenceData: ReferenceData,
    type: referenceDataType,
    variables: any = {}
  ) {
    let data!: any;
    if (type === referenceDataType.graphql) {
      let url = '';
      const options = {};
      if (
        referenceData.apiConfiguration?.authType === authType.authorizationCode
      ) {
        // If using authorizationCode authentication, directly query the target endpoint
        url =
          (referenceData.apiConfiguration?.endpoint ?? '') +
          (referenceData.apiConfiguration?.graphQLEndpoint ?? '');
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
          // Add access token to the request headers
          let headers = new HttpHeaders();
          headers = headers.append('Authorization', `Bearer ${accessToken}`);
          set(options, 'headers', headers);
        }
      } else {
        // Else, use the back-end
        url =
          this.apiProxy.baseUrl +
          (referenceData.apiConfiguration?.name ?? '') +
          (referenceData.apiConfiguration?.graphQLEndpoint ?? '');
      }
      const query = this.processQuery(referenceData);

      if (query) {
        transformGraphQLVariables(query, variables);
      }

      const body = { query, variables };
      data = (await this.apiProxy.buildPostRequest(url, body, options)) as any;
    } else if (type === referenceDataType.rest) {
      const url =
        this.apiProxy.baseUrl +
        referenceData.apiConfiguration?.name +
        referenceData.query;
      data = await this.apiProxy.promisedRequestWithHeaders(url);
    }

    const items = referenceData.path
      ? jsonpath.query(data, referenceData.path)
      : data;

    // Build page info
    if (referenceData.pageInfo?.strategy) {
      // If the api doesn't tell us the total count,
      // we hide it along with the paginator pages and only update it
      // again when we get a page smaller than the previous one
      // indicating that we reached the end of the list
      const totalCount =
        (referenceData.pageInfo.totalCountField
          ? jsonpath.query(data, referenceData.pageInfo.totalCountField)[0]
          : null) ?? Number.MAX_SAFE_INTEGER;

      const pageSize = referenceData.pageInfo.pageSizeVar
        ? variables[referenceData.pageInfo.pageSizeVar] ?? 0
        : items?.length || 0;

      let lastCursor = null;
      if (referenceData.pageInfo?.strategy === 'cursor') {
        const cursors = jsonpath.query(
          data,
          referenceData.pageInfo.cursorField
        );
        items.forEach((item: any) => {
          item.__CURSOR__ = cursors.shift();
        });
        lastCursor = items[items.length - 1].__CURSOR__;
      }

      return {
        items,
        pageInfo: {
          totalCount,
          pageSize,
          lastCursor,
        },
      };
    }
    return { items, pageInfo: null };
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
   * @returns fields & payload
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

    const { items: result } = await this.fetchItems(referenceData);

    if (result) {
      if (result.length > 0) {
        const fields: {
          name: string;
          type: string;
        }[] = [];
        const schema = toJsonSchema(result, { arrays: { mode: 'first' } });
        const properties = get(schema, 'items.properties') || {};
        /**
         * Find fields from object properties
         *
         * @param properties object properties
         * @param prefix prefix, for nested fields
         */
        const findFields = (properties: any, prefix?: string) => {
          for (const [key, value] of Object.entries(properties) as [
            string,
            any
          ][]) {
            const field = {
              name: prefix ? prefix + key : key,
              type: value.type,
            };
            fields.push(field);
            if (field.type === 'object') {
              findFields(
                value.properties,
                prefix ? prefix + field.name + '.' : field.name + '.'
              );
            }
          }
        };
        try {
          findFields(properties);
        } catch (err) {
          console.error(err);
        }
        return { fields: fields, payload: result };
      } else {
        return { fields: [], payload: result };
      }
    }

    return { fields: [], payload: [] };
  }

  /**
   * Processes a refData query, replacing template variables with values
   *
   * @param refData Reference data to process
   * @returns Processed query
   */
  private processQuery(refData: ReferenceData) {
    const { query, id } = refData;
    if (!query) return query;

    const filterVariables = [LAST_UPDATE_CODE] as const;
    let processedQuery = query;
    for (const variable of filterVariables) {
      switch (variable) {
        case LAST_UPDATE_CODE:
          const lastUpdate =
            localStorage.getItem(id + LAST_REQUEST_KEY) ||
            this.formatDateSQL(new Date(0));
          processedQuery = processedQuery
            .split(LAST_UPDATE_CODE)
            .join(lastUpdate);
          break;
        default:
          console.error('Unknown variable on refData query', variable);
      }
    }
    return processedQuery;
  }
}
