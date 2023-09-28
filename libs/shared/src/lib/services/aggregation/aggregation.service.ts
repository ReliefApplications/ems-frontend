import { Injectable } from '@angular/core';
import {
  ADD_AGGREGATION,
  DELETE_AGGREGATION,
  EDIT_AGGREGATION,
} from './graphql/mutations';
import {
  GET_RESOURCE_AGGREGATIONS,
  GET_REFERENCE_DATA_AGGREGATION_DATA,
  GET_REFERENCE_DATA_AGGREGATIONS,
  GET_RESOURCE_AGGREGATION_DATA,
} from './graphql/queries';
import {
  AddAggregationMutationResponse,
  Aggregation,
  AggregationDataQueryResponse,
  DeleteAggregationMutationResponse,
  EditAggregationMutationResponse,
} from '../../models/aggregation.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { firstValueFrom, Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { Connection } from '../../utils/graphql/connection.type';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { ResourceQueryResponse } from '../../models/resource.model';
import { ReferenceDataQueryResponse } from '../../models/reference-data.model';

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
 * Aggregation source types
 */
export const aggregationSource = ['resource', 'referenceData'] as const;
export type AggregationSource = (typeof aggregationSource)[number];

/**
 * Shared service to manage aggregations.
 */
@Injectable({
  providedIn: 'root',
})
export class AggregationService {
  /**
   * Service for aggregations
   *
   * @param apollo The apollo service
   */
  constructor(private apollo: Apollo) {}

  /**
   * Gets list of aggregation from resourceId
   *
   * @param id resource id
   * @param type from where to fetch the aggregations
   * @param options query options
   * @param options.ids list of aggregation id
   * @param options.first number of items to get
   */
  async getAggregations(
    id: string,
    type: AggregationSource,
    options: { ids?: string[]; first?: number }
  ): Promise<Connection<Aggregation>> {
    const aggregations = await firstValueFrom(
      this.apollo.query<ResourceQueryResponse | ReferenceDataQueryResponse>({
        query:
          type === 'resource'
            ? GET_RESOURCE_AGGREGATIONS
            : GET_REFERENCE_DATA_AGGREGATIONS,
        variables: {
          ...(type === 'resource' && { resource: id }),
          ...(type === 'referenceData' && { referenceData: id }),
          ids: options.ids,
          first: options.first,
        },
      })
    ).then(async ({ errors, data }) => {
      if (errors) {
        return FALLBACK_AGGREGATIONS;
      } else {
        return (
          ('resource' in data
            ? data.resource.aggregations
            : data.referenceData.aggregations) || FALLBACK_AGGREGATIONS
        );
      }
    });
    return aggregations;
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param id source Id
   * @param type source type, resource or reference data
   * @param aggregation Aggregation definition
   * @param mapping aggregation mapping ( category, field, series )
   * @param contextFilters context filters, if any
   * @param at 'at' argument value, if any
   * @returns Aggregation query
   */
  aggregationDataQuery(
    id: string,
    type: AggregationSource,
    aggregation: string,
    mapping?: any,
    contextFilters?: CompositeFilterDescriptor,
    at?: Date
  ): Observable<ApolloQueryResult<AggregationDataQueryResponse>> {
    return this.apollo.query<AggregationDataQueryResponse>({
      query:
        type === 'resource'
          ? GET_RESOURCE_AGGREGATION_DATA
          : GET_REFERENCE_DATA_AGGREGATION_DATA,
      variables: {
        ...(type === 'resource' && { resource: id }),
        ...(type === 'referenceData' && { referenceData: id }),
        aggregation,
        mapping,
        contextFilters,
        at,
      },
    });
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param id Source Id
   * @param type source type, resource or reference data
   * @param aggregation Aggregation definition
   * @param first size of the page
   * @param skip index of the page
   * @param contextFilters context filters, if any
   * @param at 'at' argument value, if any
   * @returns Aggregation query
   */
  aggregationDataWatchQuery(
    id: string,
    type: AggregationSource,
    aggregation: string,
    first: number,
    skip: number,
    contextFilters?: CompositeFilterDescriptor,
    at?: Date
  ): QueryRef<AggregationDataQueryResponse> {
    return this.apollo.watchQuery<AggregationDataQueryResponse>({
      query:
        type === 'resource'
          ? GET_RESOURCE_AGGREGATION_DATA
          : GET_REFERENCE_DATA_AGGREGATION_DATA,
      variables: {
        ...(type === 'resource' && { resource: id }),
        ...(type === 'referenceData' && { referenceData: id }),
        aggregation,
        first,
        skip,
        contextFilters,
        at,
      },
    });
  }

  /**
   * Edits a aggregation.
   *
   * @param aggregation aggregation to edit
   * @param value new value of the aggregation
   * @param id source the aggregation is attached to ( optional )
   * @param type source type, resource or reference data ( optional )
   * @returns Mutation observable
   */
  public editAggregation(
    aggregation: Aggregation,
    value: Aggregation,
    id?: string,
    type?: AggregationSource
  ) {
    return this.apollo.mutate<EditAggregationMutationResponse>({
      mutation: EDIT_AGGREGATION,
      variables: {
        id: aggregation.id,
        ...(type === 'resource' && { resource: id }),
        ...(type === 'referenceData' && { referenceData: id }),
        aggregation: value,
      },
    });
  }

  /**
   * Create a new aggregation
   *
   * @param value the value of the aggregation
   * @param id source the aggregation is attached to ( optional )
   * @param type source type, resource or reference data ( optional )
   * @returns Mutation observable
   */
  public addAggregation(
    value: Aggregation,
    id?: string,
    type?: AggregationSource
  ) {
    return this.apollo.mutate<AddAggregationMutationResponse>({
      mutation: ADD_AGGREGATION,
      variables: {
        ...(type === 'resource' && { resource: id }),
        ...(type === 'referenceData' && { referenceData: id }),
        aggregation: value,
      },
    });
  }

  /**
   * Delete an aggregation
   *
   * @param aggregation aggregation to edit
   * @param id source the aggregation is attached to ( optional )
   * @param type source type, resource or reference data ( optional )
   * @returns Mutation observable
   */
  public deleteAggregation(
    aggregation: Aggregation,
    id?: string,
    type?: AggregationSource
  ) {
    return this.apollo.mutate<DeleteAggregationMutationResponse>({
      mutation: DELETE_AGGREGATION,
      variables: {
        ...(type === 'resource' && { resource: id }),
        ...(type === 'referenceData' && { referenceData: id }),
        id: aggregation.id,
      },
    });
  }
}
