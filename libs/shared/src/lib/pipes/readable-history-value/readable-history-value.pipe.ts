import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNil } from 'lodash';

/**
 * Transforms a record history change value into a more readable inline string (or list).
 */
@Pipe({
  name: 'sharedReadableHistoryValue',
  standalone: true,
})
export class ReadableHistoryValuePipe implements PipeTransform {
  /**
   * Transforms a record history change value into a more readable inline string (or list).
   *
   * @param translate Angular translation service
   */
  constructor(private translate: TranslateService) {}

  /**
   * Transforms a history change value into a more readable inline string (or list).
   *
   * @param value The history change value to transform
   * @returns A 'readable' version of that value, in which objects use the format key (value1, value2)
   */
  transform(value: any): any {
    try {
      // base case
      if (typeof value !== 'object') return value;

      // arrays
      if (Array.isArray(value)) {
        return value.map((elem) => this.transform(elem));
      }

      // objects - non arrays
      const res: any[] = [];
      // Prevent errors to be thrown on null objects
      if (!isNil(value)) {
        const keys = Object.keys(value);
        keys.forEach((key, i) => {
          res.push(`${i ? ' ' : ''}${key} (${this.transform(value[key])})`);
        });
      }
      return res;
    } catch {
      return this.translate.instant('components.history.renderError');
    }
  }
}
