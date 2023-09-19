import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronExpressionControlComponent } from './cron-expression-control.component';
import { CronEditorModule } from 'ngx-cron-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReadableCronModule } from '../../pipes/readable-cron/readable-cron.module';
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
    ReadableCronModule,
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
