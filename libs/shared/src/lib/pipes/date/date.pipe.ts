import { DatePipe as AngularDatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DateTranslateService } from '../../services/date-translate/date-translate.service';

/** Available date formats. */
export type DateFormat =
  | 'short'
  | 'medium'
  | 'long'
  | 'full'
  | 'shortDate'
  | 'mediumDate'
  | 'longDate'
  | 'fullDate'
  | 'shortTime'
  | 'mediumTime'
  | 'longTime'
  | 'fullTime';

/**
 * Pipe to translate dates and formats them according to the user preferences.
 */
@Pipe({
  name: 'sharedDate',
  pure: false,
})
export class DatePipe implements PipeTransform {
  /**
   * Pipe to translate dates and formats them according to the user preferences.
   *
   * @param dateTranslate Shared date translation service
   */
  constructor(private dateTranslate: DateTranslateService) {}

  /**
   * Convert the date to a user-readable format, according to the user
   * preferences
   *
   * @param value The date object
   * @param format The date format we want, according to the Angular doc
   * @param timezone The timezone of the date
   * @returns A readable date as string
   */
  transform(
    value: string | number | Date | null | undefined,
    format: DateFormat = 'mediumDate',
    timezone: string | undefined = undefined
  ): string | null {
    try {
      const datePipe = new AngularDatePipe(this.dateTranslate.currentLang);
      return datePipe.transform(value, format, timezone);
    } catch {
      console.warn(
        `Dates are not available with language ${this.dateTranslate.currentLang},`,
        `please change the language or add it to the app.module.ts file.`
      );
      return null;
    }
  }
}
