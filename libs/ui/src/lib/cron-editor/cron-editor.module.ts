import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CronEditorComponent } from './cron-editor.component';
import { TimePickerModule } from './time-picker/time-picker.module';

@NgModule({
  declarations: [CronEditorComponent],
  imports: [CommonModule, FormsModule, TimePickerModule, ReactiveFormsModule],
  exports: [CronEditorComponent, TimePickerModule],
})
export class CronEditorModule {}
