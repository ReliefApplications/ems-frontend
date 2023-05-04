import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker.component';
import { ButtonModule } from '../button/button.module';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * UI Datepicker module
 */
@NgModule({
  declarations: [DatePickerComponent],
  imports: [
    CommonModule,
    ButtonModule,
    IntlModule,
    DateInputsModule,
    LabelModule,
    ButtonsModule,
    ReactiveFormsModule,
  ],
  exports: [DatePickerComponent],
})
export class DatePickerModule {}
