import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronExpressionControlComponent } from './cron-expression-control.component';
import { CronEditorModule } from 'ngx-cron-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeReadableCronModule } from '../../pipes/readable-cron/readable-cron.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {
  AlertModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
  FormWrapperModule,
  IconModule,
  ErrorMessageModule,
} from '@oort-front/ui';

/** Cron expression control module. */
@NgModule({
  declarations: [CronExpressionControlComponent],
  imports: [
    CommonModule,
    CronEditorModule,
    FormsModule,
    ReactiveFormsModule,
    SafeReadableCronModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
    IconModule,
    TooltipModule,
    ButtonModule,
    AlertModule,
    FormWrapperModule,
    ErrorMessageModule,
  ],
  exports: [CronExpressionControlComponent],
})
export class CronExpressionControlModule {}
