import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerSettingsComponent } from './scheduler-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  RadioModule,
  FormWrapperModule,
  SelectMenuModule,
} from '@oort-front/ui';

/** Module for the scheduler settings component */
@NgModule({
  declarations: [SafeSchedulerSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    TranslateModule,
    RadioModule,
    SelectMenuModule,
  ],
  exports: [SafeSchedulerSettingsComponent],
})
export class SafeSchedulerSettingsModule {}
