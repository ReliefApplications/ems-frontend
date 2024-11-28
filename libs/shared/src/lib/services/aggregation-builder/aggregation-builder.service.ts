import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { GraphQLError } from 'graphql';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { addNewField } from '../../components/query-builder/query-builder-forms';
import { Accumulators } from '../../components/ui/aggregation-builder/pipeline/expressions/operators';
import { PipelineStage } from '../../components/ui/aggregation-builder/pipeline/pipeline-stage.enum';
import {
  Aggregation,
  AggregationDataQueryResponse,
  ReferenceDataAggregationQueryResponse,
} from '../../models/aggregation.model';
import { ReferenceData } from '../../models/reference-data.model';
import { Resource } from '../../models/resource.model';
import getReferenceDataAggregationFields from '../../utils/reference-data/aggregation-fields.util';
import { AggregationService } from '../aggregation/aggregation.service';
import { QueryBuilderService } from '../query-builder/query-builder.service';

/**
 * Shared aggregation service.
 * Aggregation are used by chart widgets, to get the data.
 * The aggregation is flexible.
 */
@Injectable({
  providedIn: 'root',
})
export class AggregationBuilderService {
  /** Subject used to send the data for the preview grid. */
  private gridSubject = new BehaviorSubject<any>(null);

  /**
   * Aggregation builder service
   *
   * @param queryBuilder shared query builder service
   * @param aggregationService Aggregation service
   * @param dialog CDK dialog service
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private aggregationService: AggregationService,
    private dialog: Dialog
  ) {}

  /**
   * Get the data for grid preview as an observable.
   *
   * @returns An observable with all the data needed for the preview grid.
   */
  public getPreviewGrid(): Observable<any> {
    return this.gridSubject.asObservable();
  }

  /**
   * Formats fields so they are aligned with the queryBuilder format.
   *
   * @param fields Raw fields to format.
   * @returns formatted fields.
   */
  public formatFields(fields: any[]): any[] {
    return fields.map((field: any) => {
      const formattedForm = addNewField(field, true);
      formattedForm.enable();
      const formattedField = formattedForm.value;
      if (
        formattedField.kind !== 'SCALAR' &&
        field.fields &&
        field.fields.length &&
        'fields' in formattedField
      ) {
        formattedField.fields = this.formatFields(field.fields);
      }
      return formattedField;
    });
  }

  /**
   * Get the list of fields after passed pipeline.
   *
   * @param initialFields Initial value of fields before pipeline.
   * @param pipeline Pipeline stages to go through.
   * @returns Fields remaining at the end of the pipeline.
   */
  public fieldsAfter(initialFields: any[], pipeline: any[]): any[] {
    let fields = cloneDeep([...initialFields]);
    for (const stage of pipeline) {
      switch (stage.type) {
        case PipelineStage.GROUP: {
          const newFields = [];
          for (const rule of stage.form.groupBy) {
            if (rule.field) {
              let groupByField = this.findField(rule.field, fields);
              if (!groupByField) {
                continue;
              } else {
                const newField = Object.assign({}, groupByField);
                newField.type = { ...groupByField.type };
                if (rule.field.includes('.')) {
                  newField.name = rule.field.split('.').pop();
                }
                // Change field type because of automatic unwind
                newField.type.kind = 'SCALAR';
                newField.type.name = 'String';
                newField.type.fields = [];
                groupByField = newField;
                newFields.push(groupByField);
              }
            }
          }
          fields = newFields;
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
                        multiSelect: false,
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
    return fields
      .filter((x) => x) // remove null elements
      .sort((a: any, b: any) => (a.name > b.name ? 1 : -1));
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
      let sub: string | undefined;
      const findSubfield: any = (fields: any[]) => {
        sub = fieldArray.shift();
        if (fieldArray.length > 0) {
          const subField = fields.filter((x: any) => x.name === sub);
          return subField.map((x) => {
            return { ...x, fields: findSubfield(x.fields) };
          });
        } else {
          return fields.filter((x: any) => x.name === sub);
        }
      };
      outField = { ...fields.find((x) => x.name === parent) };
      outField.fields = findSubfield(outField.fields);
    } else {
      outField = { ...outField };
    }
    return outField;
  }

  /**
   * Get available series fields from resource or reference data, and aggregation definition
   *
   * @param aggregation aggregation definition
   * @param options options
   * @param options.resource resource
   * @param options.referenceData reference data
   * @returns available series fields
   */
  public getAvailableSeriesFields(
    aggregation: Aggregation,
    options: {
      resource?: Resource | null;
      referenceData?: ReferenceData | null;
    }
  ) {
    let fields: any[] = [];
    if (options.referenceData) {
      fields = getReferenceDataAggregationFields(
        options.referenceData,
        this.queryBuilder
      );
    } else {
      fields = this.queryBuilder
        .getFields(options.resource?.queryName as string)
        .filter(
          (field: any) =>
            !(
              field.name.includes('_id') &&
              (field.type.name === 'ID' ||
                (field.type.kind === 'LIST' && field.type.ofType.name === 'ID'))
            )
        );
    }

    const selectedFields = aggregation.sourceFields
      .map((x: string) => {
        const field = fields.find((y) => x === y.name);
        if (!field) return null;
        if (field.type.kind !== 'SCALAR') {
          Object.assign(field, {
            fields: this.queryBuilder.deconfineFields(
              field.type,
              new Set()
                .add(
                  options.resource
                    ? options.resource.name
                    : options.referenceData?.name
                )
                .add(field.type.ofType?.name)
            ),
          });
        }
        return field;
      })
      .filter((x: any) => x !== null);
    return this.fieldsAfter(selectedFields, aggregation?.pipeline);
  }

  /**
   * Open a preview modal for the given aggregation
   * Preview data is displayed using a monaco editor
   *
   * @param aggregationDataOptions Aggregation data options
   * @param aggregationDataOptions.referenceData Related reference data
   * @param aggregationDataOptions.resource Related resource
   * @param aggregationDataOptions.aggregation Aggregation to fetch
   * @param aggregationDataOptions.sourceFields Source fields to display
   * @param aggregationDataOptions.pipeline Pipeline to be applied
   * @param aggregationDataOptions.mapping Mapping to be applied
   * @param aggregationDataOptions.contextFilters Any context filters to apply
   * @param aggregationDataOptions.at Date from where to fetch items
   * @param aggregationDataOptions.first How many items to fetch
   * @param aggregationDataOptions.queryParams Any query params for the request
   * @returns errors to be displayed or undefined if successful load
   */
  public async onPreviewAggregation(aggregationDataOptions: {
    referenceData?: string;
    resource?: string;
    aggregation: string;
    sourceFields?: any;
    pipeline?: any;
    mapping?: any;
    contextFilters?: CompositeFilterDescriptor;
    at?: Date;
    first?: number;
    queryParams?: any;
  }): Promise<readonly GraphQLError[] | undefined> {
    const query$ = this.aggregationService.aggregationDataQuery({
      ...aggregationDataOptions,
      first: 10,
    });

    const { data: aggregationData, errors } = await firstValueFrom(query$);
    if (!aggregationData || errors) {
      return errors;
    }
    this.openAggregationPayload(aggregationData);
    return;
  }

  /**
   * Opens a dialog displaying the aggregation data given
   *
   * @param aggregationData Aggregation data to display in the preview dialog
   *
   * @returns dialog ref instance
   */
  private async openAggregationPayload(
    aggregationData:
      | AggregationDataQueryResponse
      | ReferenceDataAggregationQueryResponse
  ) {
    const { PayloadModalComponent } = await import(
      '../../components/payload-modal/payload-modal.component'
    );
    this.dialog.open(PayloadModalComponent, {
      data: {
        payload:
          'recordsAggregation' in aggregationData
            ? aggregationData.recordsAggregation
            : aggregationData.referenceDataAggregation,
        aggregationPayload: true,
        helpText: 'pages.aggregation.preview.help',
      },
    });
  }
}
