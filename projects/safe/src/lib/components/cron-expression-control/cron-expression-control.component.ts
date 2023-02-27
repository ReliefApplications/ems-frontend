import { Component, forwardRef, Inject, Provider } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
} from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CronOptions } from 'ngx-cron-editor';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SafeCronExpressionControlComponent),
  multi: true,
};

/**
 * Cron expression form control
 */
@Component({
  selector: 'safe-cron-expression-control',
  templateUrl: './cron-expression-control.component.html',
  styleUrls: ['./cron-expression-control.component.scss'],
  providers: [CONTROL_VALUE_ACCESSOR],
})
export class SafeCronExpressionControlComponent
  implements ControlValueAccessor
{
  public form: UntypedFormControl = new UntypedFormControl({});

  public cronOptions: CronOptions = {
    defaultTime: '00:00:00',
    // Cron Tab Options
    hideMinutesTab: false,
    hideHourlyTab: false,
    hideDailyTab: false,
    hideWeeklyTab: false,
    hideMonthlyTab: false,
    hideYearlyTab: false,
    hideAdvancedTab: true,
    hideSpecificWeekDayTab: false,
    hideSpecificMonthWeekTab: false,
    // Time options
    use24HourTime: true,
    hideSeconds: false,
    // standard or quartz
    cronFlavor: 'standard',
  };

  private onTouched!: any;
  private onChanged!: any;
  public disabled = false;

  /**
   *  Cron expression form control
   *
   * @param data Injected dialog data
   * @param data.form is the cron form control
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: UntypedFormControl;
    }
  ) {
    if (this.data) {
      this.form = this.data.form;
    }
  }

  /**
   * Write new value
   *
   * @param value cron expression
   */
  writeValue(value: any): void {
    this.form.setValue(value);
  }

  /**
   * Register change of the control
   *
   * @param fn callback
   */
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled state
   *
   * @param isDisabled is control disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
