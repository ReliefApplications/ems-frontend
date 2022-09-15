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
  GetResourceByIdQueryResponse,
  GET_RESOURCE_AGGREGATIONS,
} from './graphql/queries';
import {
  Aggregation,
  AggregationConnection,
} from '../../models/aggregation.model';
import { Apollo } from 'apollo-angular';

/** Fallback AggregationConnection */
const FALLBACK_AGGREGATIONS: AggregationConnection = {
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
  ): Promise<AggregationConnection> {
    return await this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_AGGREGATIONS,
        variables: {
          resource: resourceId,
          ids: options.ids,
          first: options.first,
        },
      })
      .toPromise()
      .then(async (res) => {
        if (res.errors) {
          return FALLBACK_AGGREGATIONS;
        } else {
          return res.data.resource.aggregations || FALLBACK_AGGREGATIONS;
        }
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
