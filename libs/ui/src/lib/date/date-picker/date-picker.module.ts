import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DatePickerComponent } from './date-picker.component';
import { IconModule } from '../../icon/icon.module';
import { TranslateModule } from '@ngx-translate/core';
import { DateModule } from '../date.module';

/**
 * UI Datepicker module
 */
@NgModule({
  declarations: [DatePickerComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    IntlModule,
    DateInputsModule,
    LabelModule,
    IconModule,
    TranslateModule,
    DateModule,
  ],
  exports: [DatePickerComponent],
})
export class DatePickerModule {}
