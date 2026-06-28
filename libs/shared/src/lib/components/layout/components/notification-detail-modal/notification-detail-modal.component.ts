import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../models/notification.model';
import { DateModule } from '../../../../pipes/date/date.module';

/** Dialog data for notification detail modal */
interface DialogData {
  notification: Notification;
}

/**
 * Modal to display the full content of an in-app notification.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    TranslateModule,
    DateModule,
  ],
  selector: 'shared-notification-detail-modal',
  templateUrl: './notification-detail-modal.component.html',
  styleUrls: ['./notification-detail-modal.component.scss'],
})
export class NotificationDetailModalComponent {
  /**
   * Notification detail modal component.
   *
   * @param dialogRef CDK dialog reference
   * @param data Dialog data containing the notification
   */
  constructor(
    public dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA) public data: DialogData
  ) {}

  /** Close the modal */
  close(): void {
    this.dialogRef.close();
  }
}
