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
  template: `
    <ui-dialog size="medium">
      <ng-container ngProjectAs="header">
        <h1>{{ data.notification.action }}</h1>
      </ng-container>
      <ng-container ngProjectAs="content">
        <p class="text-gray-500 text-sm mb-4">
          {{ data.notification.createdAt | sharedDate }}
        </p>
        <ng-container *ngIf="data.notification.content?.html; else noHtml">
          <div
            class="notification-html-content border rounded p-4 bg-gray-50 overflow-auto max-h-[60vh]"
            [innerHTML]="data.notification.content.html"
          ></div>
        </ng-container>
        <ng-template #noHtml>
          <p class="text-gray-700">
            {{ 'components.notifications.detail.emailSent' | translate }}
          </p>
        </ng-template>
      </ng-container>
      <ng-container ngProjectAs="actions">
        <ui-button (click)="close()" variant="primary">
          {{ 'common.close' | translate }}
        </ui-button>
      </ng-container>
    </ui-dialog>
  `,
  styles: [
    `
      .notification-html-content {
        word-break: break-word;
      }
    `,
  ],
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
