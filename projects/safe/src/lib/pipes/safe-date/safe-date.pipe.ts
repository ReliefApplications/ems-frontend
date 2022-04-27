import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'safeDate',
  pure: false,
})
export class SafeDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: Date, format: string = 'mediumDate'): string {
    const datePipe = new DatePipe(this.translateService.currentLang);
    return datePipe.transform(value, format) || '';
  }
}
