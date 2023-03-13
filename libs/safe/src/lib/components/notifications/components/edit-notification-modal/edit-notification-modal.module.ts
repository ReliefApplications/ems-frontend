import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditNotificationModalComponent } from './edit-notification-modal.component';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeAlertModule } from '../../../ui/alert/alert.module';
import { SafeReadableCronModule } from '../../../../pipes/readable-cron/readable-cron.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { SafeGraphQLSelectModule } from '../../../graphql-select/graphql-select.module';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

/**
 * Add / Edit notification modal module.
 */
@NgModule({
  declarations: [EditNotificationModalComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    SafeAlertModule,
    SafeReadableCronModule,
    SafeDividerModule,
    SafeGraphQLSelectModule,
    MatRadioModule,
  ],
  exports: [EditNotificationModalComponent],
})
export class EditNotificationModalModule {}
