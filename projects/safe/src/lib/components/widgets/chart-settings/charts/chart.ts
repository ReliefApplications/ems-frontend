import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createAggregationForm } from '../../../ui/aggregation-builder/aggregation-builder-forms';

export class Chart {
  public form: FormGroup;
  private fb: FormBuilder;

  constructor(settings?: any) {
    this.fb = new FormBuilder();
    const legend = settings ? settings.legend : null;
    const title = settings ? settings.title : null;
    const colorPalette = settings ? settings.colorPalette : null;
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
      colorPalette: this.fb.group({
        use: [colorPalette ? colorPalette.use : false],
        palette: this.fb.array(
          colorPalette
            ? colorPalette.palette
            : [
                '#ff6358',
                '#ffd246',
                '#78d237',
                '#28b4c8',
                '#2d73f5',
                '#aa46be',
                '#ffc09f',
                '#ffee93',
                '#fcf5c7',
                '#a0ced9',
                '#adf7b6',
                '#d4afb9',
                '#d1cfe2',
                '#9cadce',
                '#7ec4cf',
                '#52b2cf',
                '#84dcc6',
                '#ffa69e',
                '#6c8dfa',
                '#dfb2f4',
              ]
        ),
      }),
    });
  }
}
