import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from './date.pipe';

/**
 *  Date module.
 * Include pipe to format date depending on user parameters.
 */
@NgModule({
  declarations: [DatePipe],
  imports: [CommonModule],
  exports: [DatePipe],
})
export class DateModule {}
