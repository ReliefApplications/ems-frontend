type DaysOfWeek = {
  [key: string]: string;
};

type MonthOfWeeks = {
  [key: string]: string;
};

/** Days of week */
export const Days: DaysOfWeek = {
  SUN: 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
  FRI: 'Friday',
  SAT: 'Saturday',
};

/** Month weeks */
export const MonthWeeks: MonthOfWeeks = {
  '#1': 'First',
  '#2': 'Second',
  '#3': 'Third',
  '#4': 'Fourth',
  '#5': 'Fifth',
  L: 'Last',
};

/** Months */
export enum Months {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}
