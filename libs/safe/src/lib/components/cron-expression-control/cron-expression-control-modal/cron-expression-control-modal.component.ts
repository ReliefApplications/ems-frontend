import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import get from 'lodash/get';
import { CronOptions } from 'ngx-cron-editor';
import { CommonModule } from '@angular/common';
import { CronEditorModule } from 'ngx-cron-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeReadableCronModule } from '../../../pipes/readable-cron/readable-cron.module';
import { AlertModule, ButtonModule, DialogModule } from '@oort-front/ui';

/**
 * Cron expression form control modal
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    CronEditorModule,
    FormsModule,
    ReactiveFormsModule,
    SafeReadableCronModule,
    DialogModule,
    ButtonModule,
    AlertModule,
  ],
  selector: 'safe-cron-expression-control-modal',
  templateUrl: './cron-expression-control-modal.component.html',
  styleUrls: ['./cron-expression-control-modal.component.scss'],
})
export class CronExpressionControlModalComponent {
  public control!: FormControl;
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

  /**
   *  Cron expression form control modal
   *
   * @param data Injected dialog data
   * @param data.value form control value
   */
  constructor(
    @Inject(DIALOG_DATA)
    public data: {
      value: string | undefined | null;
    }
  ) {
    this.control = new FormControl(get(this.data, 'value', null));
  }
}
