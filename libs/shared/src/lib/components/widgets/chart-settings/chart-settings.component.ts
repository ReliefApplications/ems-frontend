import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { createChartWidgetForm } from './chart-forms';
import { CHART_TYPES } from './constants';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { WidgetSettings } from '../../../models/dashboard.model';

/**
 * Chart settings component
 */
@Component({
  selector: 'shared-chart-settings',
  templateUrl: './chart-settings.component.html',
  styleUrls: ['./chart-settings.component.scss'],
})
/** Modal content for the settings of the chart widgets. */
export class ChartSettingsComponent
  extends UnsubscribeComponent
  implements OnInit, WidgetSettings<typeof createChartWidgetForm>
{
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  @Output() formChange: EventEmitter<ReturnType<typeof createChartWidgetForm>> =
    new EventEmitter();
  /** Widget form group */
  public widgetFormGroup!: ReturnType<typeof createChartWidgetForm>;
  /** Available chart types */
  public types = CHART_TYPES;
  /** Current chart type */
  public type: any;

  /** @returns Chart form */
  public get chartForm() {
    return this.widgetFormGroup?.controls.chart;
  }

  /** @returns Chart's legend form */
  public get legendForm() {
    return this.chartForm?.controls.legend;
  }

  ngOnInit(): void {
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }
    this.type = this.types.find((x) => x.name === this.chartForm.value.type);

    this.widgetFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.widgetFormGroup.markAsDirty({ onlySelf: true });
        this.formChange.emit(this.widgetFormGroup);
      });

    this.chartForm.controls.type.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.type = this.types.find((x) => x.name === value);
      });

    this.legendForm.controls.position.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.legendForm.controls.visible.patchValue(value !== 'none');
      });
  }

  /**
   * Build the settings form, using the widget saved parameters
   */
  public buildSettingsForm() {
    this.widgetFormGroup = createChartWidgetForm(
      this.widget.id,
      this.widget.settings
    );
  }
}
