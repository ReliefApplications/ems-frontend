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
  GET_AGGREGATION_DATA,
  GET_RESOURCE_AGGREGATIONS,
} from './graphql/queries';
import { Aggregation } from '../../models/aggregation.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { firstValueFrom, Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { Connection } from '../../utils/graphql/connection.type';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

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
   * @param resourceId resourceId id
   * @param options query options
   * @param options.ids list of aggregation id
   * @param options.first number of items to get
   */
  async getAggregations(
    resourceId: string,
    options: { ids?: string[]; first?: number }
  ): Promise<Connection<Aggregation>> {
    return await firstValueFrom(
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
    });
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param resource Resource Id
   * @param aggregation Aggregation definition
   * @param mapping aggregation mapping ( category, field, series )
   * @param contextFilters context filters, if any
   * @returns Aggregation query
   */
  aggregationDataQuery(
    resource: string,
    aggregation: string,
    mapping?: any,
    contextFilters?: CompositeFilterDescriptor
  ): Observable<ApolloQueryResult<GetAggregationDataQueryResponse>> {
    return this.apollo.query<GetAggregationDataQueryResponse>({
      query: GET_AGGREGATION_DATA,
      variables: {
        resource,
        aggregation,
        mapping,
        contextFilters,
      },
    });
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param resource Resource Id
   * @param aggregation Aggregation definition
   * @param first size of the page
   * @param skip index of the page
   * @param contextFilters context filters, if any
   * @returns Aggregation query
   */
  aggregationDataWatchQuery(
    resource: string,
    aggregation: string,
    first: number,
    skip: number,
    contextFilters?: CompositeFilterDescriptor
  ): QueryRef<GetAggregationDataQueryResponse> {
    return this.apollo.watchQuery<GetAggregationDataQueryResponse>({
      query: GET_AGGREGATION_DATA,
      variables: {
        resource,
        aggregation,
        first,
        skip,
        contextFilters,
      },
    });
  }

  /**
   * Edits a aggregation.
   *
   * @param aggregation aggregation to edit
   * @param value new value of the aggregation
   * @param resource resource the aggregation is attached to ( optional )
   * @param form form the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public editAggregation(
    aggregation: Aggregation,
    value: Aggregation,
    resource?: string,
    form?: string
  ) {
    return this.apollo.mutate<EditAggregationMutationResponse>({
      mutation: EDIT_AGGREGATION,
      variables: {
        id: aggregation.id,
        resource,
        form,
        aggregation: value,
      },
    });
  }

  /**
   * Create a new aggregation
   *
   * @param value the value of the aggregation
   * @param resource resource the aggregation is attached to ( optional )
   * @param form form the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public addAggregation(value: Aggregation, resource?: string, form?: string) {
    return this.apollo.mutate<AddAggregationMutationResponse>({
      mutation: ADD_AGGREGATION,
      variables: {
        resource,
        form,
        aggregation: value,
      },
    });
  }

  /**
   * Delete an aggregation
   *
   * @param aggregation aggregation to edit
   * @param resource resource the aggregation is attached to ( optional )
   * @param form form the aggregation is attached to ( optional )
   * @returns Mutation observable
   */
  public deleteAggregation(
    aggregation: Aggregation,
    resource?: string,
    form?: string
  ) {
    return this.apollo.mutate<deleteAggregationMutationResponse>({
      mutation: DELETE_AGGREGATION,
      variables: {
        resource,
        form,
        id: aggregation.id,
      },
    });
  }
}
