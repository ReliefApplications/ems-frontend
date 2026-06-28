import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
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
   * Sanitized email HTML, ready to be set as the iframe `srcdoc`.
   * Rendering inside a sandboxed iframe fully isolates the email's styles
   * from the application (and the application's styles from the email).
   */
  public safeHtml: SafeHtml | null = null;

  /**
   * Notification detail modal component.
   *
   * @param dialogRef CDK dialog reference
   * @param data Dialog data containing the notification
   * @param sanitizer Angular DOM sanitizer
   */
  constructor(
    public dialogRef: DialogRef<void>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private sanitizer: DomSanitizer
  ) {
    const html = this.data.notification.content?.html;
    if (html) {
      this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

  /** Close the modal */
  close(): void {
    this.dialogRef.close();
  }
}
