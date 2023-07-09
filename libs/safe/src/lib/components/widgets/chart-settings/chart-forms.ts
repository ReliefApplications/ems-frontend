import { FormBuilder, Validators } from '@angular/forms';
import get from 'lodash/get';
import { createMappingForm } from '../../ui/aggregation-builder/aggregation-builder-forms';
import { DEFAULT_PALETTE } from '../../ui/charts/const/palette';

/** Creating a new instance of the FormBuilder class. */
const fb = new FormBuilder();

/**
 * Create chart form group
 *
 * @param value chart settings
 * @returns chart form group
 */
export const createChartForm = (value: any) => {
  const legend = get(value, 'legend', null);
  const title = get(value, 'title', null);
  const labels = get(value, 'labels', null);
  const palette: string[] = get(value, 'palette.value', []);
  const axes = get(value, 'axes', null);
  const stack = get(value, 'stack', null);
  const grid = get(value, 'grid', null);

  const formGroup = fb.group({
    type: [get(value, 'type', null), Validators.required],
    aggregationId: [get(value, 'aggregationId', null), Validators.required],
    mapping: createMappingForm(
      get(value, 'mapping', null),
      get(value, 'type', null)
    ),
    legend: fb.group({
      visible: [legend ? legend.visible : true],
      position: [legend ? legend.position : 'bottom'],
    }),
    title: fb.group({
      text: [get(title, 'text', null)],
      position: [
        {
          value: get(title, 'position', 'top'),
          disabled: !get(title, 'text', false),
        },
      ],
      bold: [
        {
          value: get(title, 'bold', false),
          disabled: !get(title, 'text', false),
        },
      ],
      italic: [
        {
          value: get(title, 'italic', false),
          disabled: !get(title, 'text', false),
        },
      ],
      underline: [
        {
          value: get(title, 'underline', false),
          disabled: !get(title, 'text', false),
        },
      ],
      font: [
        {
          value: get(title, 'font', ''),
          disabled: !get(title, 'text', false),
        },
      ],
      size: [
        {
          value: get(title, 'size', 12),
          disabled: !get(title, 'text', false),
        },
      ],
      color: [
        {
          value: get(title, 'color', null),
          disabled: !get(title, 'text', false),
        },
      ],
    }),
    palette: fb.group({
      enabled: get(value, 'palette.enabled', false),
      value: [
        {
          value:
            palette.length > 0
              ? palette
              : JSON.parse(JSON.stringify(DEFAULT_PALETTE)),
          disabled: !get(value, 'palette.enabled', false),
        },
      ],
    }),
    labels: fb.group({
      showCategory: [get(labels, 'showCategory', false)],
      showValue: [get(labels, 'showValue', false)],
      valueType: [
        {
          value: get(labels, 'valueType', 'value'),
          disabled:
            !get(labels, 'showValue', false) ||
            (['bar', 'column'].includes(get(value, 'type', '')) &&
              (!get(stack, 'usePercentage', false) ||
                !get(stack, 'enable', false))),
        },
      ],
    }),

    grid: fb.group({
      x: fb.group({
        display: get(grid, 'x.display', true),
      }),
      y: fb.group({
        display: get(grid, 'y.display', true),
      }),
    }),

    axes: fb.group({
      y: fb.group({
        enableMin: [get(axes, 'y.enableMin', false)],
        min: [
          {
            value: get(axes, 'y.enableMin', false)
              ? get(axes, 'y.min', null)
              : null,
            disabled: !get(axes, 'y.enableMin', false),
          },
        ],
        enableMax: [get(axes, 'y.enableMax', false)],
        max: [
          {
            value: get(axes, 'y.enableMax', false)
              ? get(axes, 'y.max', null)
              : null,
            disabled: !get(axes, 'y.enableMax', false),
          },
        ],
      }),
      x: fb.group({
        enableMin: [get(axes, 'x.enableMin', false)],
        min: [
          {
            value: get(axes, 'x.enableMin', false)
              ? get(axes, 'x.min', null)
              : null,
            disabled: !get(axes, 'x.enableMin', false),
          },
        ],
        enableMax: [get(axes, 'x.enableMax', false)],
        max: [
          {
            value: get(axes, 'x.enableMax', false)
              ? get(axes, 'x.max', null)
              : null,
            disabled: !get(axes, 'x.enableMax', false),
          },
        ],
      }),
    }),
    stack: fb.group({
      enable: [get(stack, 'enable', false)],
      usePercentage: [
        {
          value: get(stack, 'usePercentage', false),
          disabled: !get(stack, 'enable', false),
        },
      ],
    }),
    series: fb.array(
      get<any[]>(value, 'series', []).map((serie: any) =>
        createSerieForm(get(value, 'type', null), serie)
      )
    ),
  });

  formGroup.get('type')?.valueChanges.subscribe((value) => {
    // Update available mapping controls
    const mapping = formGroup.get('mapping');
    formGroup.setControl('mapping', createMappingForm(mapping?.value, value));
    // Update series controls when chart type change
    const seriesFormArray = fb.array(
      formGroup.value.series?.map((serie: any) =>
        createSerieForm(value, serie)
      ) || []
    );
    formGroup.setControl('series', seriesFormArray);
  });

  formGroup.get('aggregationId')?.valueChanges.subscribe(() => {
    formGroup.setControl(
      'mapping',
      createMappingForm(null, formGroup.get('type')?.value)
    );
  });

  // Update of palette
  formGroup.get('palette.enabled')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('palette.value')?.enable();
    } else {
      formGroup.get('palette.value')?.disable();
    }
  });

  // Update of y axis
  formGroup.get('axes.y.enableMin')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('axes.y.min')?.setValue(0);
      formGroup.get('axes.y.min')?.enable();
    } else {
      formGroup.get('axes.y.min')?.setValue(null);
      formGroup.get('axes.y.min')?.disable();
    }
  });
  formGroup.get('axes.y.enableMax')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('axes.y.max')?.setValue(100);
      formGroup.get('axes.y.max')?.enable();
    } else {
      formGroup.get('axes.y.max')?.setValue(null);
      formGroup.get('axes.y.max')?.disable();
    }
  });

  // Update of x axis
  formGroup.get('axes.x.enableMin')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('axes.x.min')?.setValue(0);
      formGroup.get('axes.x.min')?.enable();
    } else {
      formGroup.get('axes.x.min')?.setValue(null);
      formGroup.get('axes.x.min')?.disable();
    }
  });
  formGroup.get('axes.x.enableMax')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('axes.x.max')?.setValue(100);
      formGroup.get('axes.x.max')?.enable();
    } else {
      formGroup.get('axes.x.max')?.setValue(null);
      formGroup.get('axes.x.max')?.disable();
    }
  });

  // Update of labels
  formGroup.get('labels.showValue')?.valueChanges.subscribe((value) => {
    if (value) {
      if (['bar', 'column'].includes(formGroup.get('type')?.value)) {
        if (
          formGroup.get('stack.usePercentage')?.value &&
          formGroup.get('stack.enable')?.value
        )
          formGroup.get('labels.valueType')?.enable();
      } else formGroup.get('labels.valueType')?.enable();
    } else {
      formGroup.get('labels.valueType')?.disable();
    }
  });

  // Update of stack properties
  formGroup.get('stack.enable')?.valueChanges.subscribe((value) => {
    if (value) {
      formGroup.get('stack.usePercentage')?.enable();
    } else {
      formGroup.get('stack.usePercentage')?.disable();
    }
  });

  // update label value type based on stack settings
  formGroup.get('stack.usePercentage')?.valueChanges.subscribe((value) => {
    if (value) {
      if (formGroup.get('labels.showValue'))
        formGroup.get('labels.valueType')?.enable();
    } else {
      formGroup.get('labels.valueType')?.setValue('value');
      formGroup.get('labels.valueType')?.disable();
    }
  });

  formGroup.get('stack.enable')?.valueChanges.subscribe((value) => {
    if (value) {
      if (
        formGroup.get('stack.usePercentage')?.value &&
        formGroup.get('labels.showValue')
      )
        formGroup.get('labels.valueType')?.enable();
    } else {
      formGroup.get('labels.valueType')?.setValue('value');
      formGroup.get('labels.valueType')?.disable();
    }
  });

  formGroup.get('title.text')?.valueChanges.subscribe((value) => {
    if (!value) {
      formGroup.get('title.position')?.disable();
      formGroup.get('title.size')?.disable();
      formGroup.get('title.color')?.disable();
      formGroup.get('title.bold')?.disable();
      formGroup.get('title.italic')?.disable();
      formGroup.get('title.underline')?.disable();
    } else {
      formGroup.get('title.position')?.enable();
      formGroup.get('title.size')?.enable();
      formGroup.get('title.color')?.enable();
      formGroup.get('title.bold')?.enable();
      formGroup.get('title.italic')?.enable();
      formGroup.get('title.underline')?.enable();
    }
  });

  return formGroup;
};

/** TODO: Replace once we have UI */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/**
 * Create chart widget form group
 *
 * @param id widget id
 * @param value chart widget settings
 * @returns chart widget form group
 */
export const createChartWidgetForm = (id: any, value: any) =>
  fb.group({
    id,
    title: [get(value, 'title', ''), Validators.required],
    chart: createChartForm(get(value, 'chart')),
    resource: [get(value, 'resource', null), Validators.required],
    contextFilters: [get(value, 'contextFilters', DEFAULT_CONTEXT_FILTER)],
  });

/**
 * Create chart serie category form group
 *
 * @param value chart serie category
 * @returns chart serie category form group
 */
export const createCategoryForm = (value: any) => {
  return fb.group({
    category: get<string | undefined>(value, 'category', undefined),
    color: get<string | undefined>(value, 'color', undefined),
    visible: [get(value, 'visible', true)],
  });
};

/**
 * Create chart serie form group
 *
 * @param type type of chart
 * @param value chart serie
 * @returns chart serie form group
 */
export const createSerieForm = (type: string | null, value: any) =>
  fb.group({
    serie: get<string | undefined>(value, 'serie', undefined),
    visible: [get(value, 'visible', true)],
    ...(type &&
      ['bar', 'column', 'line'].includes(type) && {
        color: get<string | undefined>(value, 'color', undefined),
        fill: get<string | undefined>(value, 'fill', undefined),
        ...(['line'].includes(type) && {
          interpolation: get<string | undefined>(
            value,
            'interpolation',
            undefined
          ),
          stepped: get<string | undefined>(value, 'stepped', undefined),
        }),
      }),
    ...(type &&
      ['pie', 'polar', 'donut', 'radar'].includes(type) && {
        categories: fb.array(
          get(value, 'categories', []).map((category: any) =>
            createCategoryForm(category)
          )
        ),
      }),
  });
