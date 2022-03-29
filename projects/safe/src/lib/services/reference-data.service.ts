import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { map } from 'rxjs/operators';
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
  private buildGraphQLQuery(referenceData: ReferenceData): string {
    let query = '{ ' + (referenceData.query || '') + ' { ';
    for (const field of referenceData.fields || []) {
      query += field + ' ';
    }
    query += '} }';
    return query;
  }

  /**
   * Build choices in the right format for a selectable questions.
   *
   * @param data Data used for choices.
   * @param referenceData ReferenceData configuration.
   * @param displayField Field used for display in the question.
   * @returns Choices.
   */
  private buildChoices(
    data: any,
    referenceData: ReferenceData,
    displayField: string
  ): { value: string | number; text: string }[] {
    let items = referenceData.path ? get(data, referenceData.path) : data;
    if (
      referenceData.type === referenceDataType.graphql &&
      referenceData.query
    ) {
      items = items[referenceData.query];
    }
    return items.map((item: any) => ({
      value: referenceData.valueField
        ? item[referenceData.valueField]
        : item.value,
      text: item[displayField],
    }));
  }

  /**
   * Asynchronously fetch choices from ReferenceData and return them in the right format for a selectable questions.
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
    switch (referenceData.type) {
      case referenceDataType.graphql: {
        const graphqlEndpoint = '/graphql'; // TO-DO: get it from apiConfiguration
        const url =
          this.apiProxy.baseUrl +
          referenceData.apiConfiguration?.name +
          graphqlEndpoint;
        const body = { query: this.buildGraphQLQuery(referenceData) };
        const data = (await this.apiProxy.buildPostRequest(url, body)) as any;
        return this.buildChoices(data, referenceData, displayField);
      }
      case referenceDataType.rest: {
        const url =
          this.apiProxy.baseUrl +
          referenceData.apiConfiguration?.name +
          referenceData.query;
        const data = await this.apiProxy.promisedRequestWithHeaders(url);
        return this.buildChoices(data, referenceData, displayField);
      }
      case referenceDataType.static: {
        return this.buildChoices(
          referenceData.data,
          referenceData,
          displayField
        );
      }
      default: {
        return this.buildChoices(
          referenceData.data,
          referenceData,
          displayField
        );
      }
    }
  }
}
