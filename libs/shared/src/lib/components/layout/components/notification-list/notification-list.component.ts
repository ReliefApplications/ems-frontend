import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, IconModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../models/notification.model';
import { DateModule } from '../../../../pipes/date/date.module';

/** Payload emitted when a single notification is marked as seen */
export interface MarkNotificationAsSeen {
  /** Original DOM event (already stopped) */
  event: Event;
  /** Notification to mark as seen */
  notification: Notification;
}

/**
 * Displays the scrollable list of in-app notifications, or an empty state.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    TooltipModule,
    TranslateModule,
    DateModule,
  ],
  selector: 'shared-notification-list',
  templateUrl: './notification-list.component.html',
})
export class NotificationListComponent {
  /** Notifications to display */
  @Input() notifications: Notification[] = [];
  /** Emits when a notification is clicked */
  @Output() notificationClick = new EventEmitter<Notification>();
  /** Emits when a single notification is marked as seen */
  @Output() markAsSeen = new EventEmitter<MarkNotificationAsSeen>();

  /**
   * Marks a single notification as seen without triggering the row click.
   *
   * @param event The click event (stopped to avoid triggering parent)
   * @param notification The notification to mark as seen
   */
  onMarkAsSeen(event: Event, notification: Notification): void {
    event.stopPropagation();
    this.markAsSeen.emit({ event, notification });
  }
}
