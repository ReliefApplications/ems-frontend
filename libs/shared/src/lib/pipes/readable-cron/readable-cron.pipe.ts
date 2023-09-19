import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import cronstrue from 'cronstrue/i18n';

/**
 * Pipe to transform cron values into human readable format.
 */
@Pipe({
  name: 'sharedReadableCron',
})
export class ReadableCronPipe implements PipeTransform {
  /**
   * Pipe to transform cron values into human readable format.
   *
   * @param translate Angular translate service
   */
  constructor(private translate: TranslateService) {}

  /**
   * Transform CRON string ( valid or not ) into a human readable format
   *
   * @param value cron value
   * @returns human readable format
   */
  transform(value: string | null | undefined): string | null {
    if (value) {
      return cronstrue.toString(value, {
        locale: this.translate.currentLang,
        verbose: true,
      });
    } else {
      return null;
    }
  }
}
