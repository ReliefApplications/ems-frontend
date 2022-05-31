import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';
import { createAggregationForm } from '../../../ui/aggregation-builder/aggregation-builder-forms';

const DEFAULT_PALETTE = [
  '#ff6358',
  '#ffd246',
  '#78d237',
  '#28b4c8',
  '#2d73f5',
  '#aa46be',
  '#FF8A82',
  '#FFDD74',
  '#9ADD69',
  '#5EC7D6',
  '#6296F8',
  '#BF74CE',
  '#BF4A42',
  '#BF9E35',
  '#5A9E29',
  '#1E8796',
  '#2256B8',
  '#80358F',
  '#FFB1AC',
  '#FFE9A3',
];

export class Chart {
  public form: FormGroup;
  private fb: FormBuilder;

  constructor(settings?: any) {
    this.fb = new FormBuilder();
    const legend = settings ? settings.legend : null;
    const title = settings ? settings.title : null;
    const labels = settings ? settings.labels : null;
    const palette: string[] = get(settings, 'palette.value', []);
    const axes = settings ? settings.axes : null;
    const stack = settings ? settings.stack : null;

    // build form
    this.form = this.fb.group({
      type: [
        settings && settings.type ? settings.type : null,
        Validators.required,
      ],
      aggregation: createAggregationForm(
        settings ? settings.aggregation : null,
        settings ? `${settings.type}-chart` : ''
      ),
      legend: this.fb.group({
        visible: [legend ? legend.visible : true],
        position: [legend ? legend.position : 'bottom'],
        orientation: [legend ? legend.orientation : 'horizontal'],
      }),
      title: this.fb.group({
        visible: [title ? title.visible : true],
        text: [title ? title.text : null],
        position: [title ? title.position : 'top'],
      }),
      palette: this.fb.group({
        enabled: get(settings, 'palette.enabled', false),
        value: [
          {
            value:
              palette.length > 0
                ? palette
                : JSON.parse(JSON.stringify(DEFAULT_PALETTE)),
            disabled: !get(settings, 'palette.enabled', false),
          },
        ],
      }),
      labels: this.fb.group({
        showCategory: [get(labels, 'showCategory', false)],
        showValue: [get(labels, 'showValue', false)],
        valueType: [
          {
            value: get(labels, 'valueType', 'value'),
            disabled: !get(labels, 'showValue', false),
          },
        ],
      }),
      axes: this.fb.group({
        y: this.fb.group({
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
        x: this.fb.group({
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
      stack: this.fb.group({
        activateStack: [get(stack, 'activateStack', false)],
        stackTo100: [
          {
            value: get(stack, 'stackTo100', false),
            disabled: !get(stack, 'activateStack', false),
          },
        ],
      }),
    });

    // Update of palette
    this.form.get('palette.enabled')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('palette.value')?.enable();
      } else {
        this.form.get('palette.value')?.disable();
      }
    });

    // Update of y axis
    this.form.get('axes.y.enableMin')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('axes.y.min')?.setValue(0);
        this.form.get('axes.y.min')?.enable();
      } else {
        this.form.get('axes.y.min')?.setValue(null);
        this.form.get('axes.y.min')?.disable();
      }
    });
    this.form.get('axes.y.enableMax')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('axes.y.max')?.setValue(100);
        this.form.get('axes.y.max')?.enable();
      } else {
        this.form.get('axes.y.max')?.setValue(null);
        this.form.get('axes.y.max')?.disable();
      }
    });

    // Update of x axis
    this.form.get('axes.x.enableMin')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('axes.x.min')?.setValue(0);
        this.form.get('axes.x.min')?.enable();
      } else {
        this.form.get('axes.x.min')?.setValue(null);
        this.form.get('axes.x.min')?.disable();
      }
    });
    this.form.get('axes.x.enableMax')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('axes.x.max')?.setValue(100);
        this.form.get('axes.x.max')?.enable();
      } else {
        this.form.get('axes.x.max')?.setValue(null);
        this.form.get('axes.x.max')?.disable();
      }
    });

    // Update of labels
    this.form.get('labels.showValue')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('labels.valueType')?.enable();
      } else {
        this.form.get('labels.valueType')?.disable();
      }
    });

    // Update of stack properties
    this.form.get('stack.activateStack')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('stack.stackTo100')?.enable();
      } else {
        this.form.get('stack.stackTo100')?.disable();
      }
    });
  }
}
