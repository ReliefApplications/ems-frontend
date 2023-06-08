import { NgModule } from '@angular/core';
import { DatePickerDirective } from './date-picker.directive';
import { DateWrapperDirective } from './date-wrapper.directive';
import { DatePickerModule } from './date-picker/date-picker.module';
import { DateRangeModule } from './date-range/date-range.module';
import { CommonModule } from '@angular/common';

/**
 * UI shared date module
 */
@NgModule({
  declarations: [DatePickerDirective, DateWrapperDirective],
  imports: [CommonModule, DatePickerModule, DateRangeModule],
  exports: [
    DatePickerModule,
    DateRangeModule,
    DatePickerDirective,
    DateWrapperDirective,
  ],
})
export class DateModule {}
