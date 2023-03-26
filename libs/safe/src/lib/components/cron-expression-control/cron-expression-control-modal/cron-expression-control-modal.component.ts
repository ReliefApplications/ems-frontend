import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import get from 'lodash/get';
import { CronOptions } from 'ngx-cron-editor';

/**
 * Cron expression form control modal
 */
@Component({
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
    @Inject(MAT_DIALOG_DATA)
    public data: {
      value: string | undefined | null;
    }
  ) {
    this.control = new FormControl(get(this.data, 'value', null));
  }
}
