import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createFilterGroup } from '../../query-builder/query-builder-forms';
import { PipelineStage } from './pipeline/pipeline-stage.enum';
import { AbstractControl, ValidationErrors } from '@angular/forms';

const formBuilder = new FormBuilder();

/**
 * Creates a addFields stage form.
 *
 * @param value initial value
 * @returns Stage form group.
 */
export const addFieldsForm = (value: any): FormGroup =>
  formBuilder.group({
    name: [value && value.name ? value.name : '', Validators.required],
    expression: formBuilder.group({
      operator: [
        value && value.expression && value.expression.operator
          ? value.expression.operator
          : '',
        Validators.required,
      ],
      field: [
        value && value.expression && value.expression.field
          ? value.expression.field
          : '',
      ],
    }),
  });

/**
 * Builds a stage form from its initial value.
 *
 * @param value Initial value of the form.
 * @returns Stage form group.
 */
export const addStage = (value: any): FormGroup => {
  switch (value.type) {
    case PipelineStage.FILTER: {
      return formBuilder.group({
        type: [PipelineStage.FILTER],
        form: createFilterGroup(value.form ? value.form : {}, null),
      });
    }
    case PipelineStage.SORT: {
      return formBuilder.group({
        type: [PipelineStage.SORT],
        form: formBuilder.group({
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
    case PipelineStage.GROUP: {
      return formBuilder.group({
        type: [PipelineStage.GROUP],
        form: formBuilder.group({
          groupBy: [
            value.form && value.form.groupBy ? value.form.groupBy : '',
            Validators.required,
          ],
          addFields: formBuilder.array(
            value.form && value.form.addFields
              ? value.form.addFields.map((x: any) => addFieldsForm(x))
              : []
          ),
        }),
      });
    }
    case PipelineStage.ADD_FIELDS: {
      return formBuilder.group({
        type: [PipelineStage.ADD_FIELDS],
        form: formBuilder.array(
          value.form
            ? value.form.map((x: any) => addFieldsForm(x))
            : [addFieldsForm(null)],
          Validators.required
        ),
      });
    }
    case PipelineStage.UNWIND: {
      return formBuilder.group({
        type: [PipelineStage.UNWIND],
        form: formBuilder.group({
          field: [
            value.form && value.form.field ? value.form.field : '',
            Validators.required,
          ],
        }),
      });
    }
    case PipelineStage.CUSTOM: {
      const formGroup = formBuilder.group({
        type: [PipelineStage.CUSTOM],
        form: formBuilder.group({
          raw: [
            value.form && value.form.raw ? value.form.raw : '',
            Validators.required,
          ],
        }),
      });
      formGroup
        .get('form')
        ?.get('raw')
        ?.setValidators([Validators.required, jsonValidator]);
      return formGroup;
    }
    default: {
      return formBuilder.group({
        type: [PipelineStage.CUSTOM],
        form: formBuilder.group({
          raw: [
            value.form && value.form.raw ? value.form.raw : '',
            Validators.required,
          ],
        }),
      });
    }
  }
};

export const mappingFields = (widgetType: string): string[] => {
  // if (WIDGET_TYPES.some((x) => x.id === widgetType)) {
  //   return ['xAxis', 'yAxis'];
  // }
  // return [];
  const fields = ['category', 'value'];
  if (['bar-chart', 'column-chart', 'line-chart'].includes(widgetType)) {
    fields.push('seriesItem');
  }
  return fields;
};

/**
 * Generates a new aggregation form.
 *
 * @param value initial value
 * @param widgetType type of widget
 * @returns New aggregation form
 */
export const createAggregationForm = (
  value: any,
  widgetType: string
): FormGroup =>
  formBuilder.group({
    dataSource: [
      value && value.dataSource ? value.dataSource : null,
      Validators.required,
    ],
    sourceFields: [
      value && value.sourceFields ? value.sourceFields : [],
      Validators.required,
    ],
    pipeline: formBuilder.array(
      value && value.pipeline && value.pipeline.length
        ? value.pipeline.map((x: any) => addStage(x))
        : []
    ),
    mapping: formBuilder.group(
      mappingFields(widgetType).reduce(
        (o, key) =>
          Object.assign(o, {
            [key]: [
              value && value.mapping && value.mapping[key]
                ? value.mapping[key]
                : '',
              key !== 'seriesItem' ? Validators.required : {},
            ],
          }),
        {}
      )
    ),
  });

/**
 * Checks that the control value is a valid JSON.
 *
 * @param control
 * @returns
 */
const jsonValidator = (control: AbstractControl): ValidationErrors | null => {
  try {
    JSON.parse(control.value);
  } catch (e) {
    return { jsonInvalid: true };
  }

  return null;
};
