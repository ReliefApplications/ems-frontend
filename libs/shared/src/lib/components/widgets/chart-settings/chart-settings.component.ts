import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { createChartWidgetForm } from './chart-forms';
import { CHART_TYPES } from './constants';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

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
  implements OnInit
{
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  /** Widget form group */
  public formGroup!: ReturnType<typeof createChartWidgetForm>;
  /** Available chart types */
  public types = CHART_TYPES;
  /** Current chart type */
  public type: any;
  public dataFilter: any;

  // === DISPLAY PREVIEW ===
  public settings: any;
  public grid: any;
  public resourceId: any;

  /** @returns the form for the chart */
  public get chartForm(): UntypedFormGroup {
    return (this.formGroup?.controls.chart as UntypedFormGroup) || null;
  }

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.formGroup = createChartWidgetForm(
      this.widget.id,
      this.widget.settings
    );

    this.type = this.types.find((x) => x.name === this.chartForm.value.type);
    this.change.emit(this.formGroup);

    this.formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.formGroup.markAsDirty({ onlySelf: true });
      this.change.emit(this.formGroup);
    });

    this.chartForm.controls.type.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.type = this.types.find((x) => x.name === value);
      });
    this.resourceId = this.formGroup.get('resource')?.value;
  }
}
