import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { StageType } from '../components/ui/aggregation-builder/pipeline/pipeline-stages';

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
   * Builds the aggregation query from aggregation definition
   *
   * @param aggregation Aggregation definition
   * @param withMapping Wether if we should inculde the mapping in the aggregation.
   * @returns Aggregation query
   */
  public buildAggregation(aggregation: any, withMapping = true): any {
    if (aggregation) {
      const query = gql`
        query GetCustomAggregation($aggregation: JSON!, $withMapping: Boolean) {
          recordsAggregation(
            aggregation: $aggregation
            withMapping: $withMapping
          )
        }
      `;
      return this.apollo.watchQuery<any>({
        query,
        variables: {
          aggregation,
          withMapping,
        },
      });
    } else {
      return null;
    }
  }

  /**
   * Get the list of fields after passed pipeline.
   *
   * @param initialFields Initial value of fields before pipeline.
   * @param pipeline Pipeline stages to go through.
   * @returns Fields remaining at the end of the pipeline.
   */
  public fieldsAfter(initialFields: any[], pipeline: any[]): any[] {
    const fields = [...initialFields];
    for (const stage of pipeline) {
      switch (stage.type) {
        case StageType.GROUP: {
          // TO DO
          break;
        }
        case StageType.ADD_FIELDS: {
          // TO DO
          break;
        }
        case StageType.UNWIND: {
          // TO DO
          break;
        }
        case StageType.CUSTOM: {
          // TO DO
          break;
        }
        default: {
          break;
        }
      }
    }
    return fields.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
  }
}
