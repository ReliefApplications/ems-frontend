import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { PipelineStage } from '../components/ui/aggregation-builder/pipeline/pipeline-stage.enum';
import { Accumulators } from '../components/ui/aggregation-builder/pipeline/expressions/operators';
import { Observable, Subject } from 'rxjs';
import { addNewField } from '../components/query-builder/query-builder-forms';
import { SafeSnackBarService } from './snackbar.service';
import { NOTIFICATIONS } from '../const/notifications';

/**
 * Shared aggregation service.
 * Aggregation are used by chart widgets, to get the data.
 * The aggregation is flexible.
 */
@Injectable({
  providedIn: 'root',
})
export class AggregationBuilderService {
  private gridSubject = new Subject<any>();

  /**
   * Shared aggregation service.
   * Aggregation are used by chart widgets, to get the data.
   * The aggregation is flexible.
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo, private snackBar: SafeSnackBarService) {}

  /**
   * Returns an observable with all the data needed for the preview grid.
   */
  public getPreviewGrid(): Observable<any> {
    return this.gridSubject.asObservable();
  }

  /**
   * Initializes preview grid using pipeline parameters.
   *
   * @param aggregation form.
   * @param pipeline Array of stages.
   * @param selected fields before aggregation.
   */
  public initGrid(
    aggregationForm: any,
    pipeline: any[],
    selectedFields: any
  ): void {
    let loadingGrid = true;
    let gridData: any = {
      data: [],
      total: 0,
    };
    let gridFields: any[] = [];

    if (aggregationForm.get('pipeline')?.valid) {
      if (pipeline.length) {
        loadingGrid = true;
        gridFields = this.formatFields(
          this.fieldsAfter(selectedFields.value, pipeline)
        );
        this.buildAggregation(
          aggregationForm.value,
          false
        ).valueChanges.subscribe((res: any) => {
          if (res.errors) {
            this.snackBar.openSnackBar(NOTIFICATIONS.aggregationError, {
              error: true,
            });
          } else {
            if (res.data.recordsAggregation) {
              gridData = {
                data: res.data.recordsAggregation,
                total: res.data.recordsAggregation.length,
              };
            }
            loadingGrid = res.loading;
            this.gridSubject.next({
              fields: gridFields,
              data: gridData,
              loading: loadingGrid,
            });
          }
        });
      } else {
        gridFields = [];
        gridData = {
          data: [],
          total: 0,
        };
      }
    }
    this.gridSubject.next({
      fields: gridFields,
      data: gridData,
      loading: loadingGrid,
    });
  }

  /**
   * Formats fields so they are aligned with the queryBuilder format.
   *
   * @param fields Raw fields to format.
   * @return formatted fields.
   */
  public formatFields(fields: any[]): any[] {
    return fields.map((field: any) => {
      const formattedForm = addNewField(field, true);
      formattedForm.enable();
      return formattedForm.value;
    });
  }

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
          if (stage.form.groupBy) {
            const groupByField = fields.find(
              (x) => x.name === stage.form.groupBy
            );
            if (groupByField) {
              fields = [];
              fields.push(groupByField);
            }
          }
          if (stage.form.addFields) {
            this.addFields(fields, stage.form.addFields, initialFields);
          }
          break;
        }
        case PipelineStage.ADD_FIELDS: {
          this.addFields(fields, stage.form, initialFields);
          break;
        }
        case PipelineStage.UNWIND: {
          fields = fields.map((field) => {
            if (field.name === stage.form.field) {
              const newField = Object.assign({}, field);
              newField.type = { ...field.type, kind: 'SCALAR', name: 'String' };
              return newField;
            }
            return field;
          });
          break;
        }
        default: {
          break;
        }
      }
    }
    return fields.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
  }

  private addFields(fields: any[], form: any, initialFields: any[]): void {
    for (const addField of form) {
      fields.push({
        name: addField.name,
        type: {
          name:
            addField.expression.operator === Accumulators.AVG
              ? 'Float'
              : addField.expression.operator === Accumulators.COUNT
              ? 'Int'
              : initialFields.find(
                  (x: any) => x.name === addField.expression.field
                )?.type.name || 'String',
          kind: 'SCALAR',
        },
      });
    }
  }
}
