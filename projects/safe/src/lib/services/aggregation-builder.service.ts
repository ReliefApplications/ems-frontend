import { Apollo, gql, QueryRef } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { PipelineStage } from '../components/ui/aggregation-builder/pipeline/pipeline-stage.enum';
import { Accumulators } from '../components/ui/aggregation-builder/pipeline/expressions/operators';
import { Observable, Subject } from 'rxjs';
import { addNewField } from '../components/query-builder/query-builder-forms';
import { ApolloQueryResult } from '@apollo/client';
import { SafeGridService } from './grid.service';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(private apollo: Apollo, private gridService: SafeGridService) {}

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
    selectedFields: any,
    metaFields: any[]
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
        gridFields = this.gridService.getFields(
          this.formatFields(this.fieldsAfter(selectedFields, pipeline)),
          metaFields,
          {}
        );
        const query = this.buildAggregation(aggregationForm.value, false);
        if (query) {
          query.subscribe((res: any) => {
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
          });
        }
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
      const formattedField = formattedForm.value;
      if (formattedField.kind !== 'SCALAR' && field.fields.length) {
        formattedField.fields = this.formatFields(field.fields);
      }
      return formattedField;
    });
  }

  /**
   * Builds the aggregation query from aggregation definition
   *
   * @param aggregation Aggregation definition
   * @param withMapping Wether if we should inculde the mapping in the aggregation.
   * @returns Aggregation query
   */
  public buildAggregation(
    aggregation: any,
    withMapping = true
  ): Observable<ApolloQueryResult<any>> | null {
    if (aggregation) {
      const query = gql`
        query GetCustomAggregation($aggregation: JSON!, $withMapping: Boolean) {
          recordsAggregation(
            aggregation: $aggregation
            withMapping: $withMapping
          )
        }
      `;
      return this.apollo.query<any>({
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
            let groupByField = this.findField(stage.form.groupBy, fields);
            fields = [];
            if (groupByField) {
              // Change field type because of automatic unwind
              const newField = Object.assign({}, groupByField);
              newField.type = { ...groupByField.type };
              if (stage.form.groupBy.includes('.')) {
                const fieldArray = stage.form.groupBy.split('.');
                const sub = fieldArray.pop();
                newField.type.kind = 'OBJECT';
                newField.fields = newField.fields.map((x: any) =>
                  x.name === sub
                    ? {
                        ...x,
                        type: { ...x.type, kind: 'SCALAR', name: 'String' },
                      }
                    : x
                );
              } else {
                newField.type.kind = 'SCALAR';
                newField.type.name = 'String';
              }
              groupByField = newField;
            }
            fields.push(groupByField);
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
          if (stage.form.field.includes('.')) {
            const fieldArray = stage.form.field.split('.');
            const parent = fieldArray.shift();
            const sub = fieldArray.pop();
            fields = fields.map((field) => {
              if (field.name === parent) {
                const newField = Object.assign({}, field);
                newField.type = { ...field.type, kind: 'OBJECT' };
                newField.fields = field.fields.map((x: any) =>
                  x.name === sub
                    ? {
                        ...x,
                        type: { ...x.type, kind: 'SCALAR', name: 'String' },
                      }
                    : x
                );
                return newField;
              }
              return field;
            });
          } else {
            fields = fields.map((field) => {
              if (field.name === stage.form.field) {
                const newField = Object.assign({}, field);
                newField.type = {
                  ...field.type,
                  kind: 'SCALAR',
                  name: 'String',
                };
                return newField;
              }
              return field;
            });
          }
          break;
        }
        default: {
          break;
        }
      }
    }
    return fields.sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
  }

  /**
   * Adds fields in list of fields.
   *
   * @param fields list of fields.
   * @param form form value
   * @param initialFields initial list of fields
   */
  private addFields(fields: any[], form: any, initialFields: any[]): void {
    for (const addField of form) {
      fields.push({
        name: addField.name ? addField.name : addField.expression.operator,
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

  /**
   * Gets a field in list of fields.
   *
   * @param fieldName name of field to search
   * @param fields list of fields
   * @returns field
   */
  public findField(fieldName: string, fields: any[]): any {
    let outField = fields.find((x) => x.name === fieldName);
    if (!outField && fieldName.includes('.')) {
      const fieldArray = fieldName.split('.');
      const parent = fieldArray.shift();
      const sub = fieldArray.pop();
      outField = fields.reduce((o, field) => {
        if (
          field.name === parent &&
          field.fields.some((x: any) => x.name === sub)
        ) {
          const newField = { ...field };
          newField.fields = field.fields.filter((x: any) => x.name === sub);
          return newField;
        }
        return o;
      }, null);
    } else {
      outField = { ...outField };
    }
    return outField;
  }
}
