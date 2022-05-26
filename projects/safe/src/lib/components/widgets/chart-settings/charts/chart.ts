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
        showCategory: [labels ? labels.showCategory : false],
        showValue: [labels ? labels.showValue : false],
        valueType: [labels ? labels.valueType : 'value'],
      }),
    });

    console.log(this.form);

    this.form.get('palette.enabled')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('palette.value')?.enable();
      } else {
        this.form.get('palette.value')?.disable();
      }
    });
  }
}
