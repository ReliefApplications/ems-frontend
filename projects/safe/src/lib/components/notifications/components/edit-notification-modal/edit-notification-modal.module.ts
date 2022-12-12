import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditNotificationModalComponent } from './edit-notification-modal.component';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeAlertModule } from '../../../ui/alert/alert.module';
import { SafeReadableCronModule } from '../../../../pipes/readable-cron/readable-cron.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { SafeGraphQLSelectModule } from '../../../graphql-select/graphql-select.module';
import { MatRadioModule } from '@angular/material/radio';

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
