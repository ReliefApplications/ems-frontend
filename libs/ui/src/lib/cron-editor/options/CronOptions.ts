export type CronFlavor = 'standard' | 'quartz';

/** CronOptions interface declaration */
export interface CronOptions {
  formInputClass?: string;
  formSelectClass?: string;
  formRadioClass?: string;
  formCheckboxClass?: string;
  defaultTime: string;
  hideMinutesTab: boolean;
  hideHourlyTab: boolean;
  hideDailyTab: boolean;
  hideWeeklyTab: boolean;
  hideMonthlyTab: boolean;
  hideYearlyTab: boolean;
  hideAdvancedTab: boolean;
  hideSpecificWeekDayTab: boolean;
  hideSpecificMonthWeekTab: boolean;
  use24HourTime: boolean;
  hideSeconds: boolean;
  cronFlavor: CronFlavor;
}

/** DefaultOptions interface declaration */
export class DefaultOptions implements CronOptions {
  formInputClass!: 'form-control cron-editor-input';
  formSelectClass!: 'form-control cron-editor-select';
  formRadioClass!: 'cron-editor-radio';
  formCheckboxClass!: 'cron-editor-checkbox';
  cronFlavor: CronFlavor = 'standard';
  defaultTime = '00:00:00';
  hideAdvancedTab = false;
  hideDailyTab = false;
  hideHourlyTab = false;
  hideMinutesTab = false;
  hideMonthlyTab = false;
  hideSeconds = false;
  hideSpecificMonthWeekTab = false;
  hideSpecificWeekDayTab = false;
  hideWeeklyTab = false;
  hideYearlyTab = false;
  use24HourTime = true;
}
