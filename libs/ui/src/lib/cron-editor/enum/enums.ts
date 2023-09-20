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
  // eslint-disable-next-line @typescript-eslint/naming-convention
  January = 1,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  February,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  March,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  April,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  May,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  June,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  July,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  August,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  September,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  October,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  November,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  December,
}
