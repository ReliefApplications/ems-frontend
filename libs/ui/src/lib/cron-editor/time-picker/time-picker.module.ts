import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePickerComponent } from './time-picker.component';
import { SelectMenuModule } from '../../select-menu/select-menu.module';
import { FormWrapperModule } from '../../form-wrapper/form-wrapper.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * TimePicker Module
 */
@NgModule({
  declarations: [TimePickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectMenuModule,
    FormWrapperModule,
    TranslateModule,
  ],
  exports: [TimePickerComponent],
})
export class TimePickerModule {}
