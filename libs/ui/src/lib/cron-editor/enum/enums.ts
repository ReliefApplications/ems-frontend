type DaysOfWeek = {
  [key: string]: string;
};

type MonthOfWeeks = {
  [key: string]: string;
};

/** Days of week */
export const Days: DaysOfWeek = {
  SUN: 'common.cronEditor.weekDays.sunday',
  MON: 'common.cronEditor.weekDays.monday',
  TUE: 'common.cronEditor.weekDays.tuesday',
  WED: 'common.cronEditor.weekDays.wednesday',
  THU: 'common.cronEditor.weekDays.thursday',
  FRI: 'common.cronEditor.weekDays.friday',
  SAT: 'common.cronEditor.weekDays.saturday',
};

/** Month weeks */
export const MonthWeeks: MonthOfWeeks = {
  '#1': 'common.cronEditor.weekNumber.first',
  '#2': 'common.cronEditor.weekNumber.second',
  '#3': 'common.cronEditor.weekNumber.third',
  '#4': 'common.cronEditor.weekNumber.fourth',
  '#5': 'common.cronEditor.weekNumber.fifth',
  L: 'common.cronEditor.weekNumber.last',
};

/* eslint-disable @typescript-eslint/naming-convention */
/** Months */
export enum Months {
  'common.cronEditor.months.january' = 1,
  'common.cronEditor.months.february',
  'common.cronEditor.months.march',
  'common.cronEditor.months.april',
  'common.cronEditor.months.may',
  'common.cronEditor.months.june',
  'common.cronEditor.months.july',
  'common.cronEditor.months.august',
  'common.cronEditor.months.september',
  'common.cronEditor.months.october',
  'common.cronEditor.months.november',
  'common.cronEditor.months.december',
}
