import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeCronExpressionControlComponent } from './cron-expression-control.component';
import { CronEditorModule } from 'ngx-cron-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeModalModule } from '../ui/modal/modal.module';
import { SafeReadableCronModule } from '../../pipes/readable-cron/readable-cron.module';
import { SafeAlertModule } from '../ui/alert/alert.module';

/** Cron expression control module. */
@NgModule({
  declarations: [SafeCronExpressionControlComponent],
  imports: [
    CommonModule,
    CronEditorModule,
    SafeModalModule,
    FormsModule,
    ReactiveFormsModule,
    SafeReadableCronModule,
    SafeAlertModule,
  ],
})
export class SafeCronExpressionControlModule {}
