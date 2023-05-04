import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangeComponent } from './date-range.component';
import { ButtonModule } from '../button/button.module';

/**
 * UI Daterange module
 */
@NgModule({
  declarations: [DateRangeComponent],
  imports: [CommonModule, ButtonModule],
  exports: [DateRangeComponent],
})
export class DateRangeModule {}
