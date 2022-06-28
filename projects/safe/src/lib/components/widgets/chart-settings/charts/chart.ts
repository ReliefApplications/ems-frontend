import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createAggregationForm } from '../../../ui/aggregation-builder/aggregation-builder-forms';

/** Class for the chart object */
export class Chart {
  public form: FormGroup;
  private fb: FormBuilder;

  /**
   * The constructor for a chart
   *
   * @param settings The settings of the chart
   */
  constructor(settings?: any) {
    this.fb = new FormBuilder();
    const legend = settings ? settings.legend : null;
    const title = settings ? settings.title : null;
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
    });
  }
}
