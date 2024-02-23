import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from '@progress/kendo-angular-dateinputs';
import { DomService } from '../../../services/dom/dom.service';
import { TranslateService } from '@ngx-translate/core';
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
 * @param translateService - The element that the directive is attached to
 * @returns The picker instance, or null if the type is not allowed
 */
export const createPickerInstance = (
  inputType: DateInputFormat,
  element: any,
  domService: DomService,
  translateService: TranslateService
):
  | DatePickerComponent
  | DateTimePickerComponent
  | TimePickerComponent
  | null => {
  const getDataLang = () => {
    // Pick the first available language from the following order:
    const lang = [
      localStorage.getItem('date-lang'),
      translateService.currentLang,
      translateService.defaultLang,
    ].find((l) =>
      languages.includes(l as AvailableLanguages)
    ) as AvailableLanguages;

    // If no language is found or valid, use 'en'
    return lang ?? 'en';
  };
  const currentFormatLang = getDataLang();

  let component: ReturnType<typeof createPickerInstance>;
  switch (inputType) {
    case 'date':
      const datePicker = domService.appendComponentToBody(
        DatePickerComponent,
        element
      );
      const datePickerInstance: DatePickerComponent = datePicker.instance;
      datePickerInstance.format =
        DateFormat[currentFormatLang as AvailableLanguages];
      component = datePickerInstance;
      break;
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
      component = dateTimePickerInstance;
      break;
    case 'time':
      const timePicker = domService.appendComponentToBody(
        TimePickerComponent,
        element
      );
      const timePickerInstance: TimePickerComponent = timePicker.instance;
      timePickerInstance.format =
        TimeFormat[currentFormatLang as AvailableLanguages];
      component = timePickerInstance;
      break;
    default:
      component = null;
      break;
  }

  translateService.onLangChange.subscribe(() => {
    if (!component) {
      return;
    }
    const currentFormatLang = getDataLang();
    switch (inputType) {
      case 'date':
        component.format = DateFormat[currentFormatLang as AvailableLanguages];
        break;
      case 'datetime':
      case 'datetime-local':
        component.format =
          DateTimeFormat[currentFormatLang as AvailableLanguages];
        break;
      case 'time':
        component.format = TimeFormat[currentFormatLang as AvailableLanguages];
        break;
      default:
        break;
    }
  });

  return component;
};

/**
 * Get date for input display.
 *
 * @param value question value
 * @param inputType question input type
 * @returns formatted date
 */
export const getDateDisplay = (value: any, inputType: string): Date => {
  if (value instanceof Date) {
    return value;
  }
  const date = new Date(value);
  if (inputType === 'time') {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  } else if (inputType === 'date') {
    const getDateFromParts = (dateParts: string[]) => {
      if (dateParts?.length === 3) {
        date.setFullYear(+dateParts[0]);
        date.setMonth(+dateParts[1] - 1);
        date.setDate(+dateParts[2]);
        return date;
      }

      return null;
    };
    // Check if value is in YYYY-MM-DD format
    if (value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const dateParts = value?.split('-');
      return getDateFromParts(dateParts) ?? date;
      // Check if value is in ISO format
    } else if (
      value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/)
    ) {
      const dateParts = value?.split('T')[0]?.split('-');
      return getDateFromParts(dateParts) ?? date;
    } else {
      return date;
    }
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
  } else if (inputType === 'date') {
    return new Intl.DateTimeFormat('fr-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(value);
  } else {
    return value.toISOString();
  }
};
