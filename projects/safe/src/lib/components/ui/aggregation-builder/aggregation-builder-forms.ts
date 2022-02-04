import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WIDGET_TYPES } from '../../../models/dashboard.model';
import { createFilterGroup } from '../../query-builder/query-builder-forms';
import { StageType } from './pipeline/pipeline-stages';

const fb = new FormBuilder();

/**
 * Builds a stage form from its initial value.
 *
 * @param value Initial value of the form.
 * @returns Stage form group.
 */
export const stageForm = (value: any): FormGroup => {
  switch (value.type) {
    case StageType.FILTER: {
      return fb.group({
        type: [StageType.FILTER],
        form: createFilterGroup(value.form ? value.form : {}, null),
      });
    }
    case StageType.SORT: {
      return fb.group({
        type: [StageType.SORT],
        form: fb.group({
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
      return fb.group({
        type: [StageType.GROUP],
      });
    }
    case StageType.ADD_FIELDS: {
      return fb.group({
        type: [StageType.ADD_FIELDS],
      });
    }
    case StageType.UNWIND: {
      return fb.group({
        type: [StageType.UNWIND],
      });
    }
    case StageType.CUSTOM: {
      return fb.group({
        type: [StageType.CUSTOM],
      });
    }
    default: {
      return fb.group({
        type: [StageType.FILTER],
      });
    }
  }
};

export const mappingFields = (widgetType: string): string[] => {
  if (WIDGET_TYPES.some((x) => x.id === widgetType)) {
    return ['xAxis', 'yAxis'];
  }
  return [];
};

export const aggregationForm = (settings: any, widgetType: string): FormGroup =>
  fb.group({
    dataSource: [
      settings && settings.dataSource ? settings.dataSource : null,
      Validators.required,
    ],
    sourceFields: [
      settings && settings.sourceFields ? settings.sourceFields : [],
      Validators.required,
    ],
    pipeline: fb.array(
      settings && settings.pipeline && settings.pipeline.length
        ? settings.pipeline.map((x: any) => stageForm(x))
        : []
    ),
    mapping: fb.group(
      mappingFields(widgetType).reduce(
        (o, key) =>
          Object.assign(o, {
            [key]: [
              settings && settings.mapping && settings.mapping[key]
                ? settings.mapping[key]
                : '',
              Validators.required,
            ],
          }),
        {}
      )
    ),
  });
