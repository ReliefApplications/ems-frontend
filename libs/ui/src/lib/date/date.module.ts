import { NgModule } from '@angular/core';
import { DatePickerDirective } from './date-picker.directive';
import { DateWrapperDirective } from './date-wrapper.directive';

/**
 * UI shared date module
 */
@NgModule({
  declarations: [DatePickerDirective, DateWrapperDirective],
  exports: [DatePickerDirective, DateWrapperDirective],
})
export class DateModule {}
