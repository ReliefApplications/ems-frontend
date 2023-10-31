import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from '@progress/kendo-angular-dateinputs';
import { DomService } from '../../../services/dom/dom.service';
export type DateInputFormat = 'date' | 'datetime' | 'datetime-local' | 'time';

/**
 * Datetime formats available to the datetime picker.
 */
export const DateTimeFormat = {
  en: 'MM/dd/yyyy hh:mm a',
  fr: 'dd/MM/yyyy HH:mm',
};

/**
 * Date formats available to the date picker.
 */
export const DateFormat = {
  en: 'MM/dd/yyyy',
  fr: 'dd/MM/yyyy',
};

/**
 * Time formats available to the time picker.
 */
export const TimeFormat = {
  en: 'hh:mm a',
  fr: 'HH:mm',
};

/**
 * Available languages for date/time formats.
 */
export const languages = ['en', 'fr'] as const;
export type AvailableLanguages = (typeof languages)[number];

/**
 * It creates a date, datetime or time picker instance based on the input type
 *
 * @param inputType - The type of the input element.
 * @param element - The element that the directive is attached to.
 * @param domService - The element that the directive is attached to
 * @returns The picker instance, or null if the type is not allowed
 */
export const createPickerInstance = (
  inputType: DateInputFormat,
  element: any,
  domService: DomService
):
  | DatePickerComponent
  | DateTimePickerComponent
  | TimePickerComponent
  | null => {
  const currentFormatLang = localStorage.getItem('date-lang') ?? 'en';
  switch (inputType) {
    case 'date':
      const datePicker = domService.appendComponentToBody(
        DatePickerComponent,
        element
      );
      const datePickerInstance: DatePickerComponent = datePicker.instance;
      datePickerInstance.format =
        DateFormat[currentFormatLang as AvailableLanguages];
      return datePickerInstance;
    case 'datetime':
    case 'datetime-local':
      const dateTimePicker = domService.appendComponentToBody(
        DateTimePickerComponent,
        element
      );
      const dateTimePickerInstance: DateTimePickerComponent =
        dateTimePicker.instance;
      dateTimePickerInstance.format =
        DateTimeFormat[currentFormatLang as AvailableLanguages];
      return dateTimePickerInstance;
    case 'time':
      const timePicker = domService.appendComponentToBody(
        TimePickerComponent,
        element
      );
      const timePickerInstance: TimePickerComponent = timePicker.instance;
      timePickerInstance.format =
        TimeFormat[currentFormatLang as AvailableLanguages];
      return timePickerInstance;
    default:
      return null;
  }
};

/**
 * Get date for input display.
 *
 * @param value question value
 * @param inputType question input type
 * @returns formatted date
 */
export const getDateDisplay = (value: any, inputType: string): Date => {
  const date = new Date(value);
  if (inputType === 'time') {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  } else {
    return date;
  }
};

/**
 * Set date for question / parameter value
 *
 * @param value input value
 * @param inputType question input type
 * @returns formatted date
 */
export const setDateValue = (value: Date, inputType: string): Date | string => {
  if (inputType === 'time') {
    // for time fields, translate the date to UTC
    return new Date(Date.UTC(1970, 0, 1, value.getHours(), value.getMinutes()));
  } else {
    return value.toISOString();
  }
};
