import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

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
  | 'mediumTime'
  | 'longTime'
  | 'fullTime';

@Pipe({
  name: 'safeDate',
  pure: false,
})
export class SafeDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

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
    value: Date,
    format: DateFormat = 'mediumDate',
    timezone: string | undefined = undefined
  ): string | null {
    try {
      const datePipe = new DatePipe(
        this.translate.currentLang || this.translate.defaultLang
      );
      return datePipe.transform(value, format, timezone);
    } catch {
      console.warn(
        `Dates are not available with language ${this.translate.currentLang},`,
        `please change the language or add it to the app.module.ts file.`
      );
      return null;
    }
  }
}
