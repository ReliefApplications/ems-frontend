import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Optional,
  Self,
} from '@angular/core';
import { CronOptions, DefaultCronOptions } from './options/cron.options';
import { Days, MonthWeeks, Months } from './enum/enums';
import {
  ControlValueAccessor,
  FormBuilder,
  NgControl,
  Validators,
} from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

type CronType =
  | 'minutely'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'unknown';

/** minutes regex */
const minutesExp = /\d+ 0\/\d+ \* 1\/1 \* [?*] \*/;
/** hourly regex */
const hourlyExp = /\d+ \d+ 0\/\d+ 1\/1 \* [?*] \*/;
/** daily regex */
const dailyExp = /\d+ \d+ \d+ 1\/\d+ \* [?*] \*/;
/** dailyWeekday regex */
const dailyWeekdayExp = /\d+ \d+ \d+ [?*] \* MON-FRI \*/;
/** weekly regex */
const weeklyExp =
  /\d+ \d+ \d+ [?*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/;
/** monthly regex */
const monthlyExpo = /\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [?*] \*/;
/** MonthlyWeekday regex */
const monthlyWeekdayExpo =
  /\d+ \d+ \d+ [?*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;
/** yearly regex */
const yearlyExp = /\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [?*] \*/;
/** yearlyMonthWeek regex */
const yearlyMonthWeekExp =
  /\d+ \d+ \d+ [?*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;

/** Interface declaration CronToken */
interface CronToken {
  val: number;
  inc: number;
}

/**
 * Parse CronNumber to token
 *
 * @param val value
 * @returns obj
 */
function parseCronNumberToken(val: string): CronToken {
  const v = val.split('/').map((x) => parseInt(x, 10));
  if (v.length === 1) {
    return { val: v[0], inc: 0 };
  }
  return { val: v[0], inc: v[1] };
}

/**
 * generate numbers in some range
 *
 * @param start start range
 * @param end end range
 * @yields i
 */
function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

/**
 * UI CronEditor Component
 * CronEditor is a UI component that allows users to switch between two mutually exclusive options (checked or unchecked, on or off) through a single click or tap.
 */
@Component({
  selector: 'ui-cron-editor',
  templateUrl: './cron-editor.component.html',
  styleUrls: ['./cron-editor.component.scss'],
})
export class CronEditorComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  /** Subject to emit when the component is destroyed. */
  destroy$: Subject<boolean> = new Subject<boolean>();
  /** Arrays representing seconds */
  public seconds = [...range(0, 59)];
  /** Arrays representing minutes */
  public minutes = [...range(0, 59)];
  /** Arrays representing hours */
  public hours = [...range(0, 23)];
  /** Boolean indicating whether the component is disabled. */
  @Input() public disabled = false;
  /** Options for the cron editor. */
  @Input() public options: CronOptions = DefaultCronOptions;
  /** Event emitter for cron validation. */
  @Output() cronValidEmitter: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  /** The current value of the cron expression. */
  public value: string | undefined | null;
  /** The currently active tab in the cron editor. */
  public activeTab!: string;
  /** Options for select inputs in the cron editor. */
  public selectOptions = this.getSelectOptions();
  /** Boolean indicating whether the component has been touched. */
  touched = false;
  /** Form group for all form controls in the cron editor. */
  allForm = this.fb.group({
    cronType: [<CronType>'unknown', Validators.required],
    seconds: [0],

    minutes: [1],
    minutesPer: [1],

    hours: [this.getAmPmHour(1)],
    hoursPer: [1],
    hoursType: [this.getHourType(1)],

    days: [1], // Days of Month
    daysPer: [1],

    months: [1],
    monthsInc: [1],

    day: ['MON'], // Day of week '1' or 'MON;
    monthsWeek: ['#1'],

    weekdaysOnly: [false],
    specificWeekDay: [false],
    specificMonthWeek: [false],
    MON: [true],
    TUE: [true],
    WED: [true],
    THU: [true],
    FRI: [true],
    SAT: [true],
    SUN: [true],
    expression: ['0 0 0 0 0'],
  });

  /*
   * ControlValueAccessor
   */
  public onChange!: (value: any) => void;
  public onTouched!: () => void;

  /** @returns is cron Flavor Quartz */
  get isCronFlavorQuartz() {
    return this.options.cronFlavor === 'quartz';
  }

  /** @returns is cron Flavor Standard */
  get isCronFlavorStandard() {
    return this.options.cronFlavor === 'standard';
  }

  /** @returns year default */
  get yearDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '*' : '';
  }

  /** @returns weekday default */
  get weekDayDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '?' : '*';
  }

  /** @returns monthday default */
  get monthDayDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '?' : '*';
  }

  /**
   * Ui CronEditor constructor
   *
   * @param fb FormBuilder
   * @param translate angular Translate service
   * @param ngControl Current control
   */
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
      if (this.ngControl.value) {
        this.handleModelChange(this.ngControl.value);
      }
    }
  }

  public async ngOnInit() {
    this.allForm.valueChanges
      .pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe(() => {
        this.markAsTouched();
        const cron = this.computeCron();
        this.cronValidEmitter.emit(this.cronIsValid(cron));
        this.onChange(cron);
      });
  }

  /**
   * Emit Destroy event, and unsubscribe to destroy
   */
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * compute Cron
   *
   * @returns string cron
   */
  private computeCron(): string {
    let cron: string;
    switch (this.allForm.value.cronType) {
      case 'minutely':
        cron = this.computeMinutesCron();
        break;
      case 'hourly':
        cron = this.computeHourlyCron();
        break;
      case 'daily':
        cron = this.computeDailyCron();
        break;
      case 'weekly':
        cron = this.computeWeeklyCron();
        break;
      case 'monthly':
        cron = this.computeMonthlyCron();
        break;
      case 'yearly':
        cron = this.computeYearlyCron();
        break;
      case 'unknown':
        cron = this.computeAdvancedExpression();
        break;
      default:
        throw Error('Unknown cron type ' + this.allForm.value.cronType);
    }
    return cron;
  }

  /**
   * compute MinutesCron
   *
   * @returns string minutesCron
   */
  private computeMinutesCron(): string {
    const state = this.allForm.value;

    // tslint:disable-next-line:max-line-length
    return `${this.isCronFlavorQuartz ? state.seconds : ''} 0/${
      state.minutesPer
    } * 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  /**
   * compute HourlyCron
   *
   * @returns string HourlyCron
   */
  private computeHourlyCron(): string {
    const state = this.allForm.value;
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
      state.minutes
    } 0/${state.hoursPer} 1/1 * ${this.weekDayDefaultChar} ${
      this.yearDefaultChar
    }`.trim();
  }

  /**
   * compute dailyCron
   *
   * @returns string dailyCron
   */
  private computeDailyCron(): string {
    if (this.allForm.value.weekdaysOnly) {
      return this.computeEveryWeekdayCron();
    }
    return this.computeEveryDaysCron();
  }

  /**
   * compute EveryDaysCron
   *
   * @returns string EveryDayscron
   */
  private computeEveryDaysCron(): string {
    const state: any = this.allForm.value;
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
      state.minutes
    } ${this.hourToCron(state?.hours, state.hoursType)} 1/${state.daysPer} * ${
      this.weekDayDefaultChar
    } ${this.yearDefaultChar}`.trim();
  }

  /**
   * compute everyWeekdayCron
   *
   * @returns string everyWeekdayCron
   */
  private computeEveryWeekdayCron(): string {
    const state: any = this.allForm.value;
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
      state.minutes
    } ${this.hourToCron(state.hours, state.hoursType)} ${
      this.monthDayDefaultChar
    } * MON-FRI ${this.yearDefaultChar}`.trim();
  }

  /**
   * compute weeklyCron
   *
   * @returns string weeklyCron
   */
  private computeWeeklyCron(): string {
    const state: any = this.allForm.value;
    const days = this.selectOptions.days
      .reduce(
        (acc: any, day: any) => (state[day] ? acc.concat([day]) : acc),
        []
      )
      .join(',');
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
      state.minutes
    } ${this.hourToCron(state.hours, state.hoursType)} ${
      this.monthDayDefaultChar
    } * ${days} ${this.yearDefaultChar}`.trim();
  }

  /**
   * compute monthlyCron
   *
   * @returns string monthlyCron
   */
  private computeMonthlyCron(): string {
    const state: any = this.allForm.value;
    if (state.specificWeekDay) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
        state.minutes
      } ${this.hourToCron(state.hours, state.hoursType)} ${
        this.monthDayDefaultChar
      } 1/${state.monthsInc} ${state.day}${state.monthsWeek} ${
        this.yearDefaultChar
      }`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
      state.minutes
    } ${this.hourToCron(state.hours, state.hoursType)} ${state.days} 1/${
      state.monthsInc
    } ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  /**
   * compute yearlyCron
   *
   * @returns string yearlyCron
   */
  private computeYearlyCron(): string {
    const state: any = this.allForm.value;
    if (state.specificMonthWeek) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
        state.minutes
      } ${this.hourToCron(state.hours, state.hoursType)} ${
        this.monthDayDefaultChar
      } ${state.months} ${state.day}${state.monthsWeek} ${
        this.yearDefaultChar
      }`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${
      state.minutes
    } ${this.hourToCron(state.hours, state.hoursType)} ${state.day} ${
      state.months
    } ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  /**
   * compute AdvancedExpression
   *
   * @returns state expression
   */
  private computeAdvancedExpression(): string {
    const state: any = this.allForm.value;
    return state.expression;
  }

  /**
   * Display day
   *
   * @param day day
   * @returns Days
   */
  public dayDisplay(day: string): string {
    return this.translate.instant(Days[day]);
  }

  /**
   * Display monthWeek
   *
   * @param monthWeekNumber monthWeekNumber
   * @returns MonthWeeks
   */
  public monthWeekDisplay(monthWeekNumber: string): string {
    return this.translate.instant(MonthWeeks[monthWeekNumber]);
  }

  /**
   * Display month
   *
   * @param month month
   * @returns Month
   */
  public monthDisplay(month: number): string {
    return this.translate.instant(Months[month]);
  }

  /**
   * Display monthDay
   *
   * @param month month
   * @returns monthDay
   */
  public monthDayDisplay(month: string): string {
    if (month === 'L') {
      return this.translate.instant('common.cronEditor.lastDay');
    } else if (month === 'LW') {
      return this.translate.instant('common.cronEditor.lastWeekDay');
    } else if (month === '1W') {
      return this.translate.instant('common.cronEditor.firstWeekDay');
    } else {
      return `${month}${this.getOrdinalSuffix(month)}`;
    }
  }

  /**
   * Get AmPm hour
   *
   * @param hour hour
   * @returns hour
   */
  private getAmPmHour(hour: number) {
    return this.options.use24HourTime ? hour : ((hour + 11) % 12) + 1;
  }

  /**
   * Get hour type
   *
   * @param hour hour
   * @returns hour type
   */
  private getHourType(hour: number) {
    return this.options.use24HourTime ? undefined : hour >= 12 ? 'PM' : 'AM';
  }

  /**
   * Convert hour to cron
   *
   * @param hour hour
   * @param hourType hour type
   * @returns hour
   */
  private hourToCron(hour: number, hourType: string) {
    if (this.options.use24HourTime) {
      return hour;
    } else {
      return hourType === 'AM'
        ? hour === 12
          ? 0
          : hour
        : hour === 12
        ? 12
        : hour + 12;
    }
  }

  /**
   * Handle model change
   *
   * @param cron cron
   */
  private handleModelChange(cron: string) {
    if (!this.cronIsValid(cron)) {
      if (this.isCronFlavorQuartz) {
        console.error('Invalid cron expression, there must be 6 or 7 segments');
      }
      if (this.isCronFlavorStandard) {
        console.error('Invalid cron expression, there must be 5 segments');
      }
    }

    // Store original cron expression here.
    this.allForm.controls.expression.setValue(cron);

    // Normalize cron so that second segment is included.
    if (cron.split(' ').length === 5 && this.isCronFlavorStandard) {
      cron = `0 ${cron} *`;
    }

    // Parse cron tokens
    const t = cron.split(' ');

    // Seconds
    this.allForm.controls.seconds.setValue(parseInt(t[0], 10), {
      emitEvent: false,
    });

    // Minutes
    let x = parseCronNumberToken(t[1]);
    this.allForm.controls.minutesPer.setValue(x.inc, {
      emitEvent: false,
    });
    this.allForm.controls.minutes.setValue(x.val);

    // Hours
    x = parseCronNumberToken(t[2]);
    this.allForm.controls.hoursPer.setValue(x.inc);
    this.allForm.controls.hours.setValue(x.val);
    if (this.allForm.value.hours) {
      this.allForm.controls.hoursType.setValue(
        this.getHourType(this.allForm.value.hours),
        {
          emitEvent: false,
        }
      );
    }

    // Day of Month
    x = parseCronNumberToken(t[3]);
    this.allForm.controls.days.setValue(x.val, { emitEvent: false });
    this.allForm.controls.daysPer.setValue(x.val),
      {
        emitEvent: false,
      };

    // Month
    x = parseCronNumberToken(t[4]);
    this.allForm.controls.months.setValue(x.val, {
      emitEvent: false,
    });
    this.allForm.controls.monthsInc.setValue(x.inc, {
      emitEvent: false,
    });

    // Day of Week
    this.allForm.controls.day.setValue(t[5]);
    if (t[5].match('MON')) {
      this.allForm.controls.MON.setValue(true, {
        emitEvent: false,
      });
    } else {
      this.allForm.controls.MON.setValue(false, {
        emitEvent: false,
      });
    }

    if (t[5].match('TUE')) {
      this.allForm.controls.TUE.setValue(true, {
        emitEvent: false,
      });
    } else {
      this.allForm.controls.TUE.setValue(false, {
        emitEvent: false,
      });
    }

    if (t[5].match('WED')) {
      this.allForm.controls.WED.setValue(true, {
        emitEvent: false,
      });
    } else {
      this.allForm.controls.WED.setValue(false, {
        emitEvent: false,
      });
    }

    if (t[5].match('THU')) {
      this.allForm.controls.THU.setValue(true, {
        emitEvent: false,
      });
    } else {
      this.allForm.controls.THU.setValue(false, {
        emitEvent: false,
      });
    }

    if (t[5].match('FRI')) {
      this.allForm.controls.FRI.setValue(true, { emitEvent: false });
    } else {
      this.allForm.controls.FRI.setValue(false, { emitEvent: false });
    }

    if (t[5].match('SAT')) {
      this.allForm.controls.SAT.setValue(true, { emitEvent: false });
    } else {
      this.allForm.controls.SAT.setValue(false, { emitEvent: false });
    }

    if (t[5].match('SUN')) {
      this.allForm.controls.SUN.setValue(true, { emitEvent: false });
    } else {
      this.allForm.controls.SUN.setValue(false, { emitEvent: false });
    }

    // Year
    // Not supported

    if (cron.match(minutesExp)) {
      this.allForm.controls.cronType.setValue('minutely', { emitEvent: false });
    } else if (cron.match(hourlyExp)) {
      this.allForm.controls.cronType.setValue('hourly', { emitEvent: false });
    } else if (cron.match(dailyExp)) {
      this.allForm.controls.cronType.setValue('daily', { emitEvent: false });
      this.allForm.controls.weekdaysOnly.setValue(false);
    } else if (cron.match(dailyWeekdayExp)) {
      this.allForm.controls.cronType.setValue('daily', { emitEvent: false });
      this.allForm.controls.weekdaysOnly.setValue(true);
    } else if (cron.match(weeklyExp)) {
      this.allForm.controls.cronType.setValue('weekly', { emitEvent: false });
    } else if (cron.match(monthlyExpo)) {
      this.allForm.controls.cronType.setValue('monthly', { emitEvent: false });
      this.allForm.controls.specificWeekDay.setValue(false);
    } else if (cron.match(monthlyWeekdayExpo)) {
      this.allForm.controls.cronType.setValue('monthly', { emitEvent: false });
      this.allForm.controls.specificWeekDay.setValue(true);
    } else if (cron.match(yearlyExp)) {
      this.allForm.controls.cronType.setValue('yearly', { emitEvent: false });
      this.allForm.controls.specificMonthWeek.setValue(false);
    } else if (cron.match(yearlyMonthWeekExp)) {
      this.allForm.controls.cronType.setValue('yearly', { emitEvent: false });
      this.allForm.controls.specificMonthWeek.setValue(false);
    } else {
      this.allForm.controls.cronType.setValue('unknown', { emitEvent: false });
    }
    this.allForm.updateValueAndValidity({ onlySelf: true });
  }

  /**
   * Cron is valid
   *
   * @param cron cron
   * @returns boolean
   */
  private cronIsValid(cron: string): boolean {
    if (cron) {
      const cronParts = cron.split(' ');
      return (
        (this.isCronFlavorQuartz &&
          (cronParts.length === 6 || cronParts.length === 7)) ||
        (this.isCronFlavorStandard &&
          cronParts.length === 5 &&
          !cron.includes('undefined'))
      );
    }

    return false;
  }

  /**
   * Get Ordinal Suffix
   *
   * @param value value
   * @returns string
   */
  private getOrdinalSuffix(value: string) {
    if (value.length > 1) {
      const secondToLastDigit = value.charAt(value.length - 2);
      if (secondToLastDigit === '1') {
        return 'th';
      }
    }

    const lastDigit = value.charAt(value.length - 1);
    switch (lastDigit) {
      case '1':
        return 'st';
      case '2':
        return 'nd';
      case '3':
        return 'rd';
      default:
        return 'th';
    }
  }

  /**
   * Get Select Options
   *
   * @returns select options
   */
  private getSelectOptions() {
    return {
      months: this.getRange(1, 12),
      monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
      days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      minutes: this.getRange(0, 59),
      fullMinutes: this.getRange(0, 59),
      seconds: this.getRange(0, 59),
      hours: this.getRange(1, 23),
      monthDays: this.getRange(1, 31),
      monthDaysWithLasts: [
        '1W',
        ...[...this.getRange(1, 31).map(String)],
        'LW',
        'L',
      ],
      monthDaysWithOutLasts: [...[...this.getRange(1, 31).map(String)]],
      hourTypes: ['AM', 'PM'],
    };
  }

  /**
   * Get Range
   *
   * @param start start value
   * @param end end value
   * @returns Days
   */
  private getRange(start: number, end: number): number[] {
    const length = end - start + 1;
    return [...Array(length)].map((_, i) => i + start);
  }

  /**
   * Write value
   *
   * @param obj obj
   */
  writeValue(obj: string | null): void {
    if (obj === null) {
      return;
    }
    this.handleModelChange(obj);
  }

  /**
   * RegisterOnChange
   *
   * @param fn fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * RegisterOnTouched
   *
   * @param fn fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * setDisabledState
   *
   * @param isDisabled boolean
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * markAsTouched
   *
   */
  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  /**
   * Change the monthly radio
   *
   * @param val is specific week day
   */
  public monthRadioChange(val: boolean) {
    this.allForm.get('specificWeekDay')?.setValue(val);
  }

  /**
   * Change the yearly radio
   *
   *  @param val is specific month week
   */
  public yearlyRadioChange(val: any) {
    this.allForm.get('day')?.setValue('1');
    this.allForm.get('specificMonthWeek')?.setValue(val);
  }
}
