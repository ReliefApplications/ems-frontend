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
  GET_GRID_RESOURCE_META,
  GetFormByIdQueryResponse,
  GET_GRID_FORM_META,
} from './graphql/queries';
import { Aggregation } from '../../models/aggregation.model';
import { Apollo } from 'apollo-angular';

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
   * Gets list of aggregation from source
   *
   * @param source source id
   * @param ids selected aggregation ( optional )
   * @returns list of aggregation
   */
  async getAggregations(
    source: string,
    ids?: string[]
  ): Promise<Aggregation[]> {
    return await this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_GRID_RESOURCE_META,
        variables: {
          resource: source,
        },
      })
      .toPromise()
      .then(async (res) => {
        if (res.errors) {
          return await this.apollo
            .query<GetFormByIdQueryResponse>({
              query: GET_GRID_FORM_META,
              variables: {
                id: source,
              },
            })
            .toPromise()
            .then((res2) => {
              if (res2.errors) {
                return [];
              } else {
                const aggregations = res2.data.form.aggregations || [];
                return ids
                  ? aggregations.filter((x) => x.id && ids.includes(x.id))
                  : [];
              }
            });
        } else {
          const aggregations = res.data.resource.aggregations || [];
          return ids
            ? aggregations
                .filter((x) => x.id && ids.includes(x.id))
                .sort(
                  (a, b) => ids.indexOf(a.id || '') - ids.indexOf(b.id || '')
                )
            : [];
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
