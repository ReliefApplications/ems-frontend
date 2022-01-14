import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

/**
 * Shared aggregation service.
 * Aggregation are used by chart widgets, to get the data.
 * The aggregation is flexible.
 */
@Injectable({
  providedIn: 'root',
})
export class AggregationBuilderService {
  /**
   * Shared aggregation service.
   * Aggregation are used by chart widgets, to get the data.
   * The aggregation is flexible.
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {}

  /**
   * Builds the aggregation query from pipeline definition
   *
   * @param pipeline Pipeline definition
   * @returns Aggregation query
   */
  public buildAggregation(pipeline: string): any {
    if (pipeline) {
      const query = gql`
        query GetCustomAggregation($pipeline: JSON!) {
          recordsAggregation(pipeline: $pipeline)
        }
      `;
      return this.apollo.watchQuery<any>({
        query,
        variables: {
          pipeline: JSON.parse(pipeline),
        },
      });
    } else {
      return null;
    }
  }
}
