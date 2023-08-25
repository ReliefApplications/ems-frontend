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
