import {Component, Input, Output, OnInit, EventEmitter, forwardRef, ViewChild, OnDestroy} from '@angular/core';
import {CronOptions, DefaultOptions} from './options/CronOptions';
import { Days, MonthWeeks, Months } from './enum/enums';
import {ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import {MatTab, MatTabChangeEvent} from '@angular/material/tabs';
import {debounceTime, Subscription} from 'rxjs';

type CronType = 'minutely' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'unknown';

const minutesExp = /\d+ 0\/\d+ \* 1\/1 \* [\?\*] \*/;
const hourlyExp = /\d+ \d+ 0\/\d+ 1\/1 \* [\?\*] \*/;
const dailyExp = /\d+ \d+ \d+ 1\/\d+ \* [\?\*] \*/;
const dailyWeekdayExp = /\d+ \d+ \d+ [\?\*] \* MON-FRI \*/;
const weeklyExp = /\d+ \d+ \d+ [\?\*] \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/;
const monthlyExpo = /\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ [\?\*] \*/;
const monthlyWeekdayExpo = /\d+ \d+ \d+ [\?\*] 1\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;
const yearlyExp  = /\d+ \d+ \d+ (\d+|L|LW|1W) \d+ [\?\*] \*/;
const yearlyMonthWeekExp = /\d+ \d+ \d+ [\?\*] \d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/;

export const CRON_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CronEditorComponent),
  multi: true,
};

interface CronToken {
  val: number;
  inc: number;
}

function parseCronNumberToken(val: string): CronToken {
  const v = val.split('/').map( x => parseInt(x, 10));
  if (v.length === 1) {
    return {val: v[0], inc: 0};
  }
  return {val: v[0], inc: v[1]}
}

function* range(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}


@Component({
  selector: 'ui-cron-editor',
  templateUrl: './cron-editor.component.html',
  styleUrls: ['./cron-editor.component.scss'],
  providers: [CRON_VALUE_ACCESSOR]
})
export class CronEditorComponent implements OnInit, OnDestroy, ControlValueAccessor {

  public seconds = [...range(0, 59)];
  public minutes = [...range(0, 59)];
  public hours = [...range(0, 23)];

  @Input() public backgroundColor: ThemePalette;
  @Input() public color: ThemePalette;

  @Input() public disabled = false;
  @Input() public options: CronOptions = new DefaultOptions();

  public activeTab!: string;
  public selectOptions = this.getSelectOptions();

  @ViewChild('minutesTab')
  minutesTab!: MatTab;

  @ViewChild('hourlyTab')
  hourlyTab!: MatTab;

  @ViewChild('dailyTab')
  dailyTab!: MatTab;

  @ViewChild('weeklyTab')
  weeklyTab!: MatTab;

  @ViewChild('monthlyTab')
  monthlyTab!: MatTab;

  @ViewChild('yearlyTab')
  yearlyTab!: MatTab;

  @ViewChild('advancedTab')
  advancedTab!: MatTab;

  formSub!: Subscription;

  touched = false;
  allForm = this.fb.group({
    cronType: [<CronType>'unknown', Validators.required],
    seconds: [0],

    minutes: [0],
    minutesPer: [0],

    hours: [this.getAmPmHour(0)],
    hoursPer: [0],
    hoursType: [this.getHourType(0)],

    days: [0],  // Days of Month
    daysPer: [0],

    months: [0],
    monthsInc: [0],

    day: ['1'], // Day of week '1' or 'MON;
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
    expression: ['0 0 0 0 0']
  });

  /*
 * ControlValueAccessor
 */
  public onChange!: (value: any) => void
  public onTouched!: () => void;


  get isCronFlavorQuartz() {
    return this.options.cronFlavor === 'quartz';
  }

  get isCronFlavorStandard() {
    return this.options.cronFlavor === 'standard';
  }

  get yearDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '*' : '';
  }

  get weekDayDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '?' : '*';
  }

  get monthDayDefaultChar() {
    return this.options.cronFlavor === 'quartz' ? '?' : '*';
  }

  constructor(private fb: FormBuilder) {
  }

  /* Update the cron output to that of the selected tab.
   * The cron output value is updated whenever a form is updated. To make it change in response to tab selection, we simply reset
   * the value of the form that goes into focus.
   * We cannot rely on the index of the tab, as the hide options could hide tabs and
   * then the index dynamically changes based on the hidden tab.*/
  onTabChange(tabChangeEvent: any) {
    const currentTab = tabChangeEvent.tab;
    let x: CronType;

    switch (currentTab) {
      case this.minutesTab:
        x = 'minutely';
        break;
      case this.hourlyTab:
        x = 'hourly';
        break;
      case this.dailyTab:
        x = 'daily';
        break;
      case this.weeklyTab:
        x = 'weekly';
        break;
      case this.monthlyTab:
        x = 'monthly';
        break;
      case this.yearlyTab:
        x = 'yearly';
        break;
      case this.advancedTab:
        x = 'unknown';
        break;
      default:
        throw (new Error('Invalid tab selected'));
    }
    this.allForm.controls.cronType.setValue(x);
  }

  public async ngOnInit() {
    this.formSub =  this.allForm.valueChanges.pipe(debounceTime(50)).subscribe(value => {

      this.markAsTouched();
      const cron = this.computeCron();
      // this.allForm.controls.expression.setValue(cron, {emitEvent: false});
      this.onChange(cron);
    });
  }

  ngOnDestroy() {
    this.formSub.unsubscribe();
  }

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

  private computeMinutesCron(): string {

    const state = this.allForm.value;

    // tslint:disable-next-line:max-line-length
    return `${this.isCronFlavorQuartz ? state.seconds : ''} 0/${state.minutesPer} * 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeHourlyCron(): string {

    const state = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} 0/${state.hoursPer} 1/1 * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeDailyCron(): string {
    if (this.allForm.value.weekdaysOnly) {
      return this.computeEveryWeekdayCron();
    }
    return this.computeEveryDaysCron();
  }

  private computeEveryDaysCron(): string {

    const state: any = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state?.hours, state.hoursType)} 1/${state.daysPer} * ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();

  }

  private computeEveryWeekdayCron(): string {

    const state: any = this.allForm.value;

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * MON-FRI ${this.yearDefaultChar}`.trim();
  }


  private computeWeeklyCron(): string {

    const state: any = this.allForm.value;
    const days = this.selectOptions.days
      .reduce((acc: any, day: any) => state[day] ? acc.concat([day]) : acc, [])
      .join(',');

    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} * ${days} ${this.yearDefaultChar}`.trim();
  }

  private computeMonthlyCron(): string {

    const state: any = this.allForm.value;

    if (state.specificWeekDay) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} 1/${state.monthsInc} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.days} 1/${state.monthsInc} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeYearlyCron(): string {
    const state: any = this.allForm.value;

    if (state.specificMonthWeek) {
      return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${this.monthDayDefaultChar} ${state.months} ${state.day}${state.monthsWeek} ${this.yearDefaultChar}`.trim();
    }
    return `${this.isCronFlavorQuartz ? state.seconds : ''} ${state.minutes} ${this.hourToCron(state.hours, state.hoursType)} ${state.day} ${state.months} ${this.weekDayDefaultChar} ${this.yearDefaultChar}`.trim();
  }

  private computeAdvancedExpression(): string {

    const state: any = this.allForm.value;
    return state.expression;
  }

  public dayDisplay(day: string): string {
    return Days[day];
  }

  public monthWeekDisplay(monthWeekNumber: string): string {
    return MonthWeeks[monthWeekNumber];
  }

  public monthDisplay(month: number): string {
    return Months[month];
  }

  public monthDayDisplay(month: string): string {
    if (month === 'L') {
      return 'Last Day';
    } else if (month === 'LW') {
      return 'Last Weekday';
    } else if (month === '1W') {
      return 'First Weekday';
    } else {
      return `${month}${this.getOrdinalSuffix(month)}`;
    }
  }

  private getAmPmHour(hour: number) {
    return this.options.use24HourTime ? hour : (hour + 11) % 12 + 1;
  }

  private getHourType(hour: number) {
    return this.options.use24HourTime ? undefined : (hour >= 12 ? 'PM' : 'AM');
  }

  private hourToCron(hour: number, hourType: string) {
    if (this.options.use24HourTime) {
      return hour;
    } else {
      return hourType === 'AM' ? (hour === 12 ? 0 : hour) : (hour === 12 ? 12 : hour + 12);
    }
  }

  private handleModelChange(cron: string) {

    if (!this.cronIsValid(cron)) {
      if (this.isCronFlavorQuartz) {
        throw new Error('Invalid cron expression, there must be 6 or 7 segments');
      }

      if (this.isCronFlavorStandard) {
        throw new Error('Invalid cron expression, there must be 5 segments');
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
    this.allForm.controls.seconds.setValue(parseInt(t[0], 10), {emitEvent: false})

    // Minutes
    let x = parseCronNumberToken(t[1]);
    this.allForm.controls.minutesPer.setValue(x.inc, {emitEvent: false});
    this.allForm.controls.minutes.setValue(x.val);

    // Hours
    x = parseCronNumberToken(t[2])
    this.allForm.controls.hoursPer.setValue(x.inc);
    this.allForm.controls.hours.setValue(x.val);
    if (this.allForm.value.hours) {
      this.allForm.controls.hoursType.setValue(this.getHourType(this.allForm.value.hours), {emitEvent: false});
    }

    // Day of Month
    x = parseCronNumberToken(t[3])
    this.allForm.controls.days.setValue(x.val, {emitEvent: false});
    this.allForm.controls.daysPer.setValue(x.val), {emitEvent: false};

    // Month
    x = parseCronNumberToken(t[4])
    this.allForm.controls.months.setValue(x.val, {emitEvent: false});
    this.allForm.controls.monthsInc.setValue(x.inc, {emitEvent: false});

    // Day of Week
    this.allForm.controls.day.setValue(t[5]);
    if (t[5].match('MON')) {
      this.allForm.controls.MON.setValue(true, {emitEvent: false});
    } else {
      this.allForm.controls.MON.setValue(false, {emitEvent: false});
    }

    if (t[5].match('TUE')) {
      this.allForm.controls.TUE.setValue(true, {emitEvent: false});
    } else {
      this.allForm.controls.TUE.setValue(false, {emitEvent: false});
    }

    if (t[5].match('WED')) {
      this.allForm.controls.WED.setValue(true, {emitEvent: false});
    } else {
      this.allForm.controls.WED.setValue(false, {emitEvent: false});
    }

    if (t[5].match('THU')) {
      this.allForm.controls.THU.setValue(true, {emitEvent: false});
    } else {
      this.allForm.controls.THU.setValue(false, {emitEvent: false});
    }

    if (t[5].match('FRI')) {
      this.allForm.controls.FRI.setValue(true, {emitEvent: false});
    } else {
      this.allForm.controls.FRI.setValue(false, {emitEvent: false});
    }

    if (t[5].match('SAT')) {
      this.allForm.controls.SAT.setValue(true, {emitEvent: false});
    } else {
      this.allForm.controls.SAT.setValue(false, {emitEvent: false});
    }

    if (t[5].match('SUN')) {
      this.allForm.controls.SUN.setValue(true, {emitEvent: false});
    } else {
      this.allForm.controls.SUN.setValue(false, {emitEvent: false});
    }

    // Year
    // Not supported

    if (cron.match(minutesExp)) {
      this.allForm.controls.cronType.setValue('minutely', {emitEvent: false});

    } else if (cron.match(hourlyExp)) {
      this.allForm.controls.cronType.setValue('hourly', {emitEvent: false});

    } else if (cron.match(dailyExp)) {
      this.allForm.controls.cronType.setValue('daily', {emitEvent: false});
      this.allForm.controls.weekdaysOnly.setValue(false);

    } else if (cron.match(dailyWeekdayExp)) {
      this.allForm.controls.cronType.setValue('daily', {emitEvent: false});
      this.allForm.controls.weekdaysOnly.setValue(true);

    } else if (cron.match(weeklyExp)) {
      this.allForm.controls.cronType.setValue('weekly', {emitEvent: false});

    } else if (cron.match(monthlyExpo)) {
      this.allForm.controls.cronType.setValue('monthly', {emitEvent: false});
      this.allForm.controls.specificWeekDay.setValue(false);

    } else if (cron.match(monthlyWeekdayExpo)) {
      this.allForm.controls.cronType.setValue('monthly', {emitEvent: false});
      this.allForm.controls.specificWeekDay.setValue(true);

    } else if (cron.match(yearlyExp)) {
      this.allForm.controls.cronType.setValue('yearly', {emitEvent: false});
      this.allForm.controls.specificMonthWeek.setValue(false);

    } else if (cron.match(yearlyMonthWeekExp)) {
      this.allForm.controls.cronType.setValue('yearly', {emitEvent: false});
      this.allForm.controls.specificMonthWeek.setValue(false);

    } else {
      this.allForm.controls.cronType.setValue('unknown', {emitEvent: false});
    }
    this.allForm.updateValueAndValidity( {onlySelf: true});
  }

  private cronIsValid(cron: string): boolean {
    if (cron) {
      const cronParts = cron.split(' ');
      return (this.isCronFlavorQuartz && (cronParts.length === 6
          || cronParts.length === 7)
        || (this.isCronFlavorStandard && cronParts.length === 5));
    }

    return false;
  }


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
      monthDaysWithLasts: ['1W', ...[...this.getRange(1, 31).map(String)], 'LW', 'L'],
      monthDaysWithOutLasts: [...[...this.getRange(1, 31).map(String)]],
      hourTypes: ['AM', 'PM']
    };
  }

  private getRange(start: number, end: number): number[] {
    const length = end - start + 1;
    return Array.apply(null, Array(length)).map((_, i) => i + start);
  }




  writeValue(obj: string | null): void {
    if (obj === null) {
      return
    }

    this.handleModelChange(obj);

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
}