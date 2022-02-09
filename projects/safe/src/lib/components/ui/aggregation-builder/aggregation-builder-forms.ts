import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createFilterGroup } from '../../query-builder/query-builder-forms';
import { StageType } from './pipeline/pipeline-stages';

const formBuilder = new FormBuilder();

/**
 * Builds a stage form from its initial value.
 *
 * @param value Initial value of the form.
 * @returns Stage form group.
 */
export const addStage = (value: any): FormGroup => {
  switch (value.type) {
    case StageType.FILTER: {
      return formBuilder.group({
        type: [StageType.FILTER],
        form: createFilterGroup(value.form ? value.form : {}, null),
      });
    }
    case StageType.SORT: {
      return formBuilder.group({
        type: [StageType.SORT],
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
    case StageType.GROUP: {
      return formBuilder.group({
        type: [StageType.GROUP],
      });
    }
    case StageType.ADD_FIELDS: {
      return formBuilder.group({
        type: [StageType.ADD_FIELDS],
      });
    }
    case StageType.UNWIND: {
      return formBuilder.group({
        type: [StageType.UNWIND],
      });
    }
    case StageType.CUSTOM: {
      return formBuilder.group({
        type: [StageType.CUSTOM],
      });
    }
    default: {
      return formBuilder.group({
        type: [StageType.FILTER],
      });
    }
  }
};

export const mappingFields = (widgetType: string): string[] => {
  // if (WIDGET_TYPES.some((x) => x.id === widgetType)) {
  //   return ['xAxis', 'yAxis'];
  // }
  // return [];
  return ['xAxis', 'yAxis'];
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
              Validators.required,
            ],
          }),
        {}
      )
    ),
  });
