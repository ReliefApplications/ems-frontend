import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerDirective } from './date-picker.directive';
import { DateWrapperDirective } from './date-wrapper.directive';
import { DatePickerModule } from './date-picker/date-picker.module';
import { DateRangeModule } from './date-range/date-range.module';

/**
 * UI Date module
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
