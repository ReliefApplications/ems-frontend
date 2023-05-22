import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronExpressionControlComponent } from './cron-expression-control.component';
import { CronEditorModule } from 'ngx-cron-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeReadableCronModule } from '../../pipes/readable-cron/readable-cron.module';
import { SafeAlertModule } from '../ui/alert/alert.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ButtonModule } from '@oort-front/ui';
import { DialogModule } from '@oort-front/ui';
// @TODO: Remove SafeIconModule import after ui-icon is being used in the app
import { SafeIconModule } from '../ui/icon/icon.module';

/** Cron expression control module. */
@NgModule({
  declarations: [CronExpressionControlComponent],
  imports: [
    CommonModule,
    CronEditorModule,
    FormsModule,
    ReactiveFormsModule,
    SafeReadableCronModule,
    SafeAlertModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonModule,
    DialogModule,
    SafeIconModule,
  ],
  exports: [CronExpressionControlComponent],
})
export class CronExpressionControlModule {}
