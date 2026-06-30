import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ButtonModule, MenuModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { Notification } from '../../../../models/notification.model';
import {
  MarkNotificationAsSeen,
  NotificationListComponent,
} from '../notification-list/notification-list.component';

/** Subset of the ui-menu API consumed by the uiMenuTriggerFor directive */
interface MenuPanel {
  /** Reference to the menu content template */
  templateRef: TemplateRef<any>;
  /** Emits when the menu is closed */
  closed: EventEmitter<void>;
}

/**
 * Notification dropdown menu: header, notification list and load more action.
 *
 * Exposes the inner `ui-menu` panel (templateRef / closed) so it can be used
 * directly as a `uiMenuTriggerFor` target from a parent component.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    TranslateModule,
    NotificationListComponent,
  ],
  selector: 'shared-notification-menu',
  templateUrl: './notification-menu.component.html',
})
export class NotificationMenuComponent implements MenuPanel {
  /** Notifications to display */
  @Input() notifications: Notification[] = [];
  /** Whether more notifications can be loaded */
  @Input() hasMore = false;
  /** Whether notifications are currently loading */
  @Input() loading = false;

  /** Emits when the user marks all notifications as read */
  @Output() markAllAsRead = new EventEmitter<void>();
  /** Emits (with the original event) when the user loads more notifications */
  @Output() loadMore = new EventEmitter<Event>();
  /** Emits when a single notification is marked as seen */
  @Output() markAsSeen = new EventEmitter<MarkNotificationAsSeen>();

  /** Inner ui-menu, used as the trigger panel */
  @ViewChild('menu') private menu!: MenuPanel;

  /**
   * Notification dropdown menu component.
   *
   * @param dialog Dialog service provided by Angular CDK
   */
  constructor(private dialog: Dialog) {}

  /** Template of the inner menu (read lazily by the trigger directive) */
  get templateRef(): TemplateRef<any> {
    return this.menu.templateRef;
  }

  /** Closed emitter of the inner menu (read lazily by the trigger directive) */
  get closed(): EventEmitter<void> {
    return this.menu.closed;
  }

  /**
   * Opens the notification detail modal, only if the notification has HTML
   * content to display.
   *
   * @param notification The notification that was clicked on
   */
  async onNotificationClick(notification: Notification): Promise<void> {
    if (!notification.content?.html) {
      return;
    }
    const { NotificationDetailModalComponent } = await import(
      '../notification-detail-modal/notification-detail-modal.component'
    );
    this.dialog.open(NotificationDetailModalComponent, {
      data: { notification },
      autoFocus: false,
    });
  }
}
