import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSchedulerSettingsComponent } from './scheduler-settings.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { RadioModule, FormWrapperModule } from '@oort-front/ui';

/** Module for the scheduler settings component */
@NgModule({
  declarations: [SafeSchedulerSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    FormWrapperModule,
    MatSelectModule,
    TranslateModule,
    RadioModule,
  ],
  exports: [SafeSchedulerSettingsComponent],
})
export class SafeSchedulerSettingsModule {}
