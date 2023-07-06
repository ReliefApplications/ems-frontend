import { Component, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

/**
 * Cron expression form control
 */
@Component({
  selector: 'safe-cron-expression-control',
  templateUrl: './cron-expression-control.component.html',
  styleUrls: ['./cron-expression-control.component.scss'],
  // providers: [CONTROL_VALUE_ACCESSOR],
})
export class CronExpressionControlComponent
  extends SafeUnsubscribeComponent
  implements ControlValueAccessor
{
  // /** @returns the value */
  // get value(): string | undefined | null {
  //   return this.ngControl.value;
  // }

  // /** Sets the value */
  // set value(value: string | undefined | null) {
  //   this.ngControl.control?.setValue(value);
  // }
  public value: string | undefined | null;

  private onTouched!: any;
  private onChanged!: any;
  public disabled = false;

  /**
   *  Cron expression form control
   *
   * @param ngControl Angular form control base class
   * @param dialog Dialog service
   */
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private dialog: Dialog
  ) {
    super();
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Write new value
   *
   * @param value cron expression
   */
  writeValue(value: any): void {
    this.value = value;
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
  public async onEdit(): Promise<void> {
    const { CronExpressionControlModalComponent } = await import(
      './cron-expression-control-modal/cron-expression-control-modal.component'
    );
    const dialogRef = this.dialog.open(CronExpressionControlModalComponent, {
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.writeValue(value);
        this.onChanged(value);
      }
    });
  }
}
