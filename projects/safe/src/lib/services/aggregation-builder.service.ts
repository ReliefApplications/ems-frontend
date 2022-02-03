import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StageType } from '../components/ui/aggregation-builder/pipeline/pipeline-stages';
import { QueryBuilderService } from './query-builder.service';

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
  constructor(
    private apollo: Apollo,
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) {}

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
    console.log('PIPELINE', pipeline);
    return JSON.stringify(pipeline);
  }

  /**
   * Builds a stage form from its initial value.
   *
   * @param value Initial value of the form.
   * @returns Stage form group.
   */
  public stageForm(value: any): FormGroup {
    switch (value.type) {
      case StageType.FILTER: {
        return this.formBuilder.group({
          type: [StageType.FILTER],
          form: this.queryBuilder.createFilterGroup(
            value.form ? value.form : {},
            null
          ),
        });
      }
      case StageType.SORT: {
        return this.formBuilder.group({
          type: [StageType.SORT],
          form: this.formBuilder.group({
            field: [
              value.form && value.form.field ? value.form.field : '',
              Validators.required,
            ],
            order: [
              value.form && value.form.order ? value.form.order : 'asc',
              Validators.required,
            ],
          }),
        });
      }
      case StageType.GROUP: {
        return this.formBuilder.group({
          type: [StageType.GROUP],
        });
      }
      case StageType.ADD_FIELDS: {
        return this.formBuilder.group({
          type: [StageType.ADD_FIELDS],
        });
      }
      case StageType.UNWIND: {
        return this.formBuilder.group({
          type: [StageType.UNWIND],
        });
      }
      case StageType.CUSTOM: {
        return this.formBuilder.group({
          type: [StageType.CUSTOM],
        });
      }
      default: {
        return this.formBuilder.group({
          type: [StageType.FILTER],
        });
      }
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
