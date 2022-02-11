import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { PipelineStage } from '../components/ui/aggregation-builder/pipeline/pipeline-stage.enum';
import { Accumulators } from '../components/ui/aggregation-builder/pipeline/expressions/operators';

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
    let fields = [...initialFields];
    for (const stage of pipeline) {
      switch (stage.type) {
        case PipelineStage.GROUP: {
          fields = [];
          if (stage.form.groupBy) {
            const groupByField = initialFields.find(
              (x) => x.name === stage.form.groupBy
            );
            if (groupByField) {
              fields.push(groupByField);
            }
          }
          if (stage.form.addFields) {
            for (const addField of stage.form.addFields) {
              fields.push({
                name: addField.name,
                type: {
                  name:
                    addField.expression.operator === Accumulators.AVG
                      ? 'Float'
                      : addField.expression.operator === Accumulators.COUNT
                      ? 'Int'
                      : initialFields.find(
                          (x) => x.name === addField.expression.field
                        ).type.name,
                  kind: 'SCALAR',
                },
              });
            }
          }
          break;
        }
        case PipelineStage.ADD_FIELDS: {
          // TO DO
          break;
        }
        case PipelineStage.UNWIND: {
          // TO DO
          break;
        }
        case PipelineStage.CUSTOM: {
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
