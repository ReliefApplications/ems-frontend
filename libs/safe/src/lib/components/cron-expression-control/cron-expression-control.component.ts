import { Component, forwardRef, Inject, Input, Provider } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { CronOptions } from 'ngx-cron-editor';
import { CronExpressionControlModalComponent } from './cron-expression-control-modal/cron-expression-control-modal.component';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CronExpressionControlComponent),
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
export class CronExpressionControlComponent implements ControlValueAccessor {
  public control: UntypedFormControl = new UntypedFormControl({});
  @Input() public formGroup!: UntypedFormGroup;

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
   * @param data.control is the cron form control
   */
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      control: UntypedFormControl;
    }
  ) {
    if (this.data) {
      this.control = this.data.control;
    }
  }

  /**
   * Write new value
   *
   * @param value cron expression
   */
  writeValue(value: any): void {
    this.control.setValue(value);
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

  /** Opens the cron expression component modal */
  public onEditCronExpression(): void {
    this.dialog.open(CronExpressionControlModalComponent, {
      autoFocus: false,
      data: {
        control: this.formGroup.controls.schedule,
      },
    });
  }
}
