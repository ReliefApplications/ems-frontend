import {
  DatePickerComponent,
  DateTimePickerComponent,
  TimePickerComponent,
} from '@progress/kendo-angular-dateinputs';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { DomService } from '../../../services/dom/dom.service';
// Registers CLDR data (date/number formatting, mask segment names such as
// "day/month/year" translated) for every locale the app supports. Importing
// is a side-effecting registration call (setData), it doesn't set the active
// locale on its own — that's done per-instance below via CldrIntlService.
import '@progress/kendo-angular-intl/locales/en/all';
import '@progress/kendo-angular-intl/locales/fr/all';
import '@progress/kendo-angular-intl/locales/uk/all';

export type DateInputFormat = 'date' | 'datetime' | 'datetime-local' | 'time';

/**
 * It creates a date, datetime or time picker instance based on the input type
 *
 * @param inputType - The type of the input element.
 * @param element - The element that the directive is attached to.
 * @param domService - The element that the directive is attached to
 * @param calendarType - kendo type of calendar, classic or infinite (infinite by default)
 * @param locale - i18n/Angular locale code (e.g. 'uk') used to localize the picker's
 * generated mask/placeholder text (e.g. "day/month/year"). Defaults to 'en'.
 * @returns The picker instance, or null if the type is not allowed
 */
export const createPickerInstance = (
  inputType: DateInputFormat,
  element: any,
  domService: DomService,
  calendarType: 'classic' | 'infinite' = 'infinite',
  locale = 'en'
):
  | DatePickerComponent
  | DateTimePickerComponent
  | TimePickerComponent
  | null => {
  // Kendo's date inputs derive their placeholder/mask text from the injected
  // IntlService, which defaults to English regardless of the app's language.
  // Scoping a locale-specific IntlService to just this component instance
  // keeps the fix local, instead of overriding Kendo's culture app-wide.
  const providers = [
    { provide: IntlService, useValue: new CldrIntlService(locale) },
  ];
  switch (inputType) {
    case 'date':
      const datePicker = domService.appendComponentToBody(
        DatePickerComponent,
        element,
        providers
      );
      const datePickerInstance: DatePickerComponent = datePicker.instance;
      datePickerInstance.format = 'dd/MM/yyyy';
      datePickerInstance.calendarType = calendarType;
      return datePickerInstance;
    case 'datetime':
    case 'datetime-local':
      const dateTimePicker = domService.appendComponentToBody(
        DateTimePickerComponent,
        element,
        providers
      );
      const dateTimePickerInstance: DateTimePickerComponent =
        dateTimePicker.instance;
      dateTimePickerInstance.format = 'dd/MM/yyyy HH:mm';
      dateTimePickerInstance.calendarType = calendarType;
      return dateTimePickerInstance;
    case 'time':
      const timePicker = domService.appendComponentToBody(
        TimePickerComponent,
        element,
        providers
      );
      const timePickerInstance: TimePickerComponent = timePicker.instance;
      timePickerInstance.format = 'HH:mm';
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
