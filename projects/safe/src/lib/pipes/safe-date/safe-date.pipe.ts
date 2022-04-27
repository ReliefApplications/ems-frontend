import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'safeDate',
  pure: false,
})
export class SafeDatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(
    value: Date,
    format: string = 'mediumDate',
    timezone: string | undefined = undefined
  ): string {
    const datePipe = new DatePipe(
      this.translate.currentLang || this.translate.defaultLang
    );
    return datePipe.transform(value, format, timezone) || '';
  }
}
