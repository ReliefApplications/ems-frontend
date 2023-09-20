import { Injectable } from '@angular/core';
import { PipelineStage } from '../../components/ui/aggregation-builder/pipeline/pipeline-stage.enum';
import { Accumulators } from '../../components/ui/aggregation-builder/pipeline/expressions/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { addNewField } from '../../components/query-builder/query-builder-forms';

/**
 * Shared aggregation service.
 * Aggregation are used by chart widgets, to get the data.
 * The aggregation is flexible.
 */
@Injectable({
  providedIn: 'root',
})
export class AggregationBuilderService {
  private gridSubject = new BehaviorSubject<any>(null);

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
    let fields = [...initialFields];
    for (const stage of pipeline) {
      switch (stage.type) {
        case PipelineStage.GROUP: {
          const newFields = [];
          for (const rule of stage.form.groupBy) {
            if (rule.field) {
              let groupByField = this.findField(rule.field, fields);
              if (groupByField) {
                // Change field type because of automatic unwind
                const newField = Object.assign({}, groupByField);
                newField.type = { ...groupByField.type };
                if (rule.field.includes('.')) {
                  const fieldArray = rule.field.split('.');
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
              newFields.push(groupByField);
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
