import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditNotificationModalComponent } from './edit-notification-modal.component';
import { SafeModalModule } from '../../../ui/modal/modal.module';

/**
 * Add / Edit notification modal module.
 */
@NgModule({
  declarations: [EditNotificationModalComponent],
  imports: [CommonModule, SafeModalModule],
  exports: [EditNotificationModalComponent],
})
export class EditNotificationModalModule {}
