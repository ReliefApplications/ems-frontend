import { Pipe, PipeTransform } from '@angular/core';
import parser from 'cron-parser';

/**
 * Pipe to get next iteration from cron values.
 */
@Pipe({
  name: 'sharedCronParser',
})
export class CronParserPipe implements PipeTransform {
  /**
   * Get from CRON string ( valid or not ) next iteration date
   *
   * @param value cron value
   * @returns next iteration date
   */
  transform(value: string | null | undefined): Date | null {
    if (value) {
      const interval = parser.parseExpression(value);
      return interval.next().toDate();
    } else {
      return null;
    }
  }
}
