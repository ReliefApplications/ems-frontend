import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CronEditorComponent } from './cron-editor.component';
import { TimePickerModule } from './time-picker/time-picker.module';
import { SelectMenuModule } from '../select-menu/select-menu.module';
import { FormWrapperModule } from '../form-wrapper/form-wrapper.module';
import { TabsModule } from '../tabs/tabs.module';
import { RadioModule } from '../radio/radio.module';
import { CheckboxModule } from '../checkbox/checkbox.module';

/**
 * UI CronEditor Module
 */
@NgModule({
  declarations: [CronEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    TimePickerModule,
    ReactiveFormsModule,
    SelectMenuModule,
    FormWrapperModule,
    TabsModule,
    RadioModule,
    CheckboxModule,
  ],
  exports: [CronEditorComponent, TimePickerModule],
})
export class CronEditorModule {}
