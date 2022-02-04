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
      const pipeline = this.buildPipeline(aggregation, withMapping);
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

  /**
   * Builds the pipeline string from settings
   *
   * @param settings Form value.
   * @param withMapping Wether if we should inculde the mapping in the pipeline.
   * @returns Pipeline string.
   */
  public buildPipeline(settings: any, withMapping = true): string {
    const pipeline: any[] = [];
    if (settings.dataSource) {
      pipeline.push({
        $match: {
          $or: [
            { resource: { $oid: settings.dataSource } },
            { form: { $oid: settings.dataSource } },
          ],
        },
      });
    }
    if (settings.sourceFields && settings.sourceFields.length) {
      pipeline.push({
        $project: (settings.sourceFields as any[]).reduce(
          (o, field) =>
            Object.assign(o, {
              [field]: `$data.${field}`,
            }),
          {}
        ),
      });
    }
    if (settings.pipeline && settings.pipeline.length) {
      for (const stage of settings.pipeline) {
        switch (stage.type) {
          case StageType.FILTER: {
            // GET FILTERS FROM BACK END FUNCTION ??? PASS IT AS PARAMETER ?
            // pipeline.push({
            //   $match: {},
            // });
            break;
          }
          case StageType.SORT: {
            pipeline.push({
              $sort: {
                [stage.form.field]: stage.form.order === 'asc' ? 1 : -1,
              },
            });
            break;
          }
          case StageType.GROUP: {
            //TO DO
            break;
          }
          case StageType.ADD_FIELDS: {
            //TO DO
            break;
          }
          case StageType.UNWIND: {
            //TO DO
            break;
          }
          case StageType.CUSTOM: {
            //TO DO
            break;
          }
          default: {
            break;
          }
        }
      }
    }
    if (withMapping && settings.mapping) {
      pipeline.push({
        $project: {
          category: `$${settings.mapping.xAxis}`,
          field: `$${settings.mapping.yAxis}`,
          id: '$_id',
        },
      });
    }
    return JSON.stringify(pipeline);
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
