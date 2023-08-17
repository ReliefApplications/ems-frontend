import { Injectable } from '@angular/core';
import {
  AddAggregationMutationResponse,
  ADD_AGGREGATION,
  deleteAggregationMutationResponse,
  DELETE_AGGREGATION,
  EditAggregationMutationResponse,
  EDIT_AGGREGATION,
} from './graphql/mutations';
import {
  GetAggregationDataQueryResponse,
  GetResourceByIdQueryResponse,
  GET_RESOURCE_AGGREGATION_DATA,
  GET_RESOURCE_AGGREGATIONS,
  GET_REFERENCE_DATA_AGGREGATION_DATA,
  GET_REFERENCE_DATA_AGGREGATIONS,
} from './graphql/queries';
import { Aggregation } from '../../models/aggregation.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { firstValueFrom, Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { Connection } from '../../utils/graphql/connection.type';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GetReferenceDataAggregationsResponse } from '../../components/aggregation/add-aggregation-modal/graphql/queries';

/** Fallback AggregationConnection */
const FALLBACK_AGGREGATIONS: Connection<Aggregation> = {
  edges: [],
  totalCount: 0,
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasNextPage: false,
  },
};
/**
 * Shared service to manage aggregations.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeAggregationService {
  /**
   * Service for aggregations
   *
   * @param apollo The apollo service
   */
  constructor(private apollo: Apollo) {}

  /**
   * Gets list of aggregation from resourceId
   *
   * @param resourceId resource id
   * @param referenceDataId reference data id
   * @param options query options
   * @param options.ids list of aggregation id
   * @param options.first number of items to get
   */
  async getAggregations(
    resourceId: string,
    referenceDataId: string,
    options: { ids?: string[]; first?: number }
  ): Promise<Connection<Aggregation>> {
    const aggregations = resourceId
      ? await firstValueFrom(
          this.apollo.query<GetResourceByIdQueryResponse>({
            query: GET_RESOURCE_AGGREGATIONS,
            variables: {
              resource: resourceId,
              ids: options.ids,
              first: options.first,
            },
          })
        ).then(async ({ errors, data }) => {
          if (errors) {
            return FALLBACK_AGGREGATIONS;
          } else {
            return data.resource.aggregations || FALLBACK_AGGREGATIONS;
          }
        })
      : await firstValueFrom(
          this.apollo.query<GetReferenceDataAggregationsResponse>({
            query: GET_REFERENCE_DATA_AGGREGATIONS,
            variables: {
              referenceData: referenceDataId,
              ids: options.ids,
              first: options.first,
            },
          })
        ).then(async ({ errors, data }) => {
          if (errors) {
            return FALLBACK_AGGREGATIONS;
          } else {
            return data.referenceData.aggregations || FALLBACK_AGGREGATIONS;
          }
        });
    return aggregations;
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param resource Resource Id
   * @param referenceData ReferenceData Id
   * @param aggregation Aggregation definition
   * @param mapping aggregation mapping ( category, field, series )
   * @param contextFilters context filters, if any
   * @returns Aggregation query
   */
  aggregationDataQuery(
    resource: string,
    referenceData: string,
    aggregation: string,
    mapping?: any,
    contextFilters?: CompositeFilterDescriptor
  ): Observable<ApolloQueryResult<GetAggregationDataQueryResponse>> {
    return resource
      ? this.apollo.query<GetAggregationDataQueryResponse>({
          query: GET_RESOURCE_AGGREGATION_DATA,
          variables: {
            resource,
            aggregation,
            mapping,
            contextFilters,
          },
        })
      : this.apollo.query<GetAggregationDataQueryResponse>({
          query: GET_REFERENCE_DATA_AGGREGATION_DATA,
          variables: {
            referenceData,
            aggregation,
            mapping,
          },
        });
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param resource Resource Id
   * @param referenceData Reference data Id
   * @param aggregation Aggregation definition
   * @param first size of the page
   * @param skip index of the page
   * @param contextFilters context filters, if any
   * @returns Aggregation query
   */
  aggregationDataWatchQuery(
    resource: string,
    referenceData: string,
    aggregation: string,
    first: number,
    skip: number,
    contextFilters?: CompositeFilterDescriptor
  ): QueryRef<GetAggregationDataQueryResponse> {
    return resource
      ? this.apollo.watchQuery<GetAggregationDataQueryResponse>({
          query: GET_RESOURCE_AGGREGATION_DATA,
          variables: {
            resource,
            aggregation,
            first,
            skip,
            contextFilters,
          },
        })
      : this.apollo.watchQuery<GetAggregationDataQueryResponse>({
          query: GET_REFERENCE_DATA_AGGREGATION_DATA,
          variables: {
            referenceData,
            aggregation,
            first,
            skip,
          },
        });
  }

  /**
   * Edits a aggregation.
   *
   * @param aggregation aggregation to edit
   * @param value new value of the aggregation
   * @param resource resource the aggregation is attached to ( optional )
   * @param referenceData referenceData the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public editAggregation(
    aggregation: Aggregation,
    value: Aggregation,
    resource?: string,
    referenceData?: string
  ) {
    return this.apollo.mutate<EditAggregationMutationResponse>({
      mutation: EDIT_AGGREGATION,
      variables: {
        id: aggregation.id,
        resource,
        referenceData,
        aggregation: value,
      },
    });
  }

  /**
   * Create a new aggregation
   *
   * @param value the value of the aggregation
   * @param resource resource the aggregation is attached to ( optional )
   * @param referenceData reference data the aggregation is attached to (optional)
   * @returns Mutation observable
   */
  public addAggregation(
    value: Aggregation,
    resource?: string,
    referenceData?: string
  ) {
    return this.apollo.mutate<AddAggregationMutationResponse>({
      mutation: ADD_AGGREGATION,
      variables: {
        resource,
        referenceData,
        aggregation: value,
      },
    });
  }

  /**
   * Delete an aggregation
   *
   * @param aggregation aggregation to edit
   * @param resource resource the aggregation is attached to ( optional )
   * @param referenceData form the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public deleteAggregation(
    aggregation: Aggregation,
    resource?: string,
    referenceData?: string
  ) {
    return this.apollo.mutate<deleteAggregationMutationResponse>({
      mutation: DELETE_AGGREGATION,
      variables: {
        resource,
        referenceData,
        id: aggregation.id,
      },
    });
  }
}
