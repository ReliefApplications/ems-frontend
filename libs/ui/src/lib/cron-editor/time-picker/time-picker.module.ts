import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimePickerComponent } from './time-picker.component';
import { SelectMenuModule } from '../../select-menu/select-menu.module';
import { FormWrapperModule } from '../../form-wrapper/form-wrapper.module';

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
  ],
  exports: [TimePickerComponent],
})
export class TimePickerModule {}
