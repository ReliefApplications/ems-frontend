import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CronExpressionControlComponent } from './cron-expression-control.component';
import { CronEditorModule } from 'ngx-cron-editor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeModalModule } from '../ui/modal/modal.module';
import { SafeReadableCronModule } from '../../pipes/readable-cron/readable-cron.module';
import { SafeAlertModule } from '../ui/alert/alert.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { UiModule } from '@oort-front/ui';

/** Cron expression control module. */
@NgModule({
  declarations: [CronExpressionControlComponent],
  imports: [
    CommonModule,
    CronEditorModule,
    SafeModalModule,
    FormsModule,
    ReactiveFormsModule,
    SafeReadableCronModule,
    SafeAlertModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    UiModule,
  ],
  exports: [CronExpressionControlComponent],
})
export class CronExpressionControlModule {}
