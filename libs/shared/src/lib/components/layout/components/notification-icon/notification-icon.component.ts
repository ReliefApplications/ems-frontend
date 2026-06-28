import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ButtonModule, MenuModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Notification } from '../../../../models/notification.model';
import { NotificationService } from '../../../../services/notification/notification.service';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { NotificationMenuComponent } from '../notification-menu/notification-menu.component';

/**
 * Header notification bell: badge, dropdown menu and notification interactions.
 *
 * Self-contained — subscribes to the notification service and handles loading,
 * marking as seen and opening the notification detail modal.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    IndicatorsModule,
    ButtonModule,
    MenuModule,
    TooltipModule,
    TranslateModule,
    NotificationMenuComponent,
  ],
  selector: 'shared-notification-icon',
  templateUrl: './notification-icon.component.html',
})
export class NotificationIconComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Notifications */
  public notifications: Notification[] = [];
  /** Boolean to check if there are more notifications */
  public hasMoreNotifications = false;
  /** Boolean to check if notifications are loading */
  public loadingNotifications = false;

  /**
   * Header notification bell component.
   *
   * @param notificationService Service that handles the notifications
   * @param dialog Dialog service provided by Angular CDK
   */
  constructor(
    private notificationService: NotificationService,
    private dialog: Dialog
  ) {
    super();
  }

  ngOnInit(): void {
    this.notificationService.init();
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications: Notification[]) => {
        this.notifications = notifications ?? [];
      });

    this.notificationService.hasNextPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.hasMoreNotifications = res;
        this.loadingNotifications = false;
      });
  }

  /**
   * Load more notifications
   *
   * @param e Event
   */
  public onLoadMoreNotifications(e: Event): void {
    e.stopPropagation();
    this.notificationService.fetchMore();
    this.loadingNotifications = true;
  }

  /**
   * Marks all the notifications as read
   */
  onMarkAllNotificationsAsRead(): void {
    this.notificationService.markAllAsSeen();
  }

  /**
   * Opens the notification detail modal and marks the notification as seen.
   *
   * @param notification The notification that was clicked on
   */
  async onNotificationClick(notification: Notification): Promise<void> {
    this.notificationService.markAsSeen(notification);
    const { NotificationDetailModalComponent } = await import(
      '../notification-detail-modal/notification-detail-modal.component'
    );
    this.dialog.open(NotificationDetailModalComponent, {
      data: { notification },
      autoFocus: false,
    });
  }

  /**
   * Marks a single notification as seen without opening the detail modal.
   *
   * @param event The click event (stopped to avoid triggering parent)
   * @param notification The notification to mark as seen
   */
  onMarkSingleNotification(event: Event, notification: Notification): void {
    event.stopPropagation();
    this.notificationService.markAsSeen(notification);
  }
}
