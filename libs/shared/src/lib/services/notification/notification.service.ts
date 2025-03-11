import { Apollo, QueryRef } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { SEE_NOTIFICATION, SEE_NOTIFICATIONS } from './graphql/mutations';
import { GET_LAYOUT, GET_NOTIFICATIONS } from './graphql/queries';
import { NOTIFICATION_SUBSCRIPTION } from './graphql/subscriptions';
import {
  Notification,
  NotificationSubscriptionResponse,
  NotificationsQueryResponse,
  SeeNotificationMutationResponse,
  SeeNotificationsMutationResponse,
} from '../../models/notification.model';
import { updateQueryUniqueValues } from '../../utils/update-queries';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { ResourceQueryResponse } from '../../models/resource.model';
import { clone, get } from 'lodash';
import { Layout } from '../../models/layout.model';
import { Dialog } from '@angular/cdk/dialog';

/** Pagination: number of items per query */
const ITEMS_PER_PAGE = 10;

/**
 * Shared notification service. Subscribes to Apollo to automatically fetch new notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  /** Current notifications */
  private notifications = new BehaviorSubject<Notification[]>([]);
  /** Cached notifications */
  private cachedNotifications: Notification[] = [];

  /** @returns Current notifications as observable */
  get notifications$(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  /** Notifications query */
  public notificationsQuery!: QueryRef<NotificationsQueryResponse>;

  /** Is there more notifications to load */
  private hasNextPage = new BehaviorSubject<boolean>(true);

  /** @returns Is there more notifcations to load as observable */
  get hasNextPage$(): Observable<boolean> {
    return this.hasNextPage.asObservable();
  }

  /** Stores if notifications where loaded previously */
  private firstLoad = true;
  /** Stores previous id */
  private previousNotificationId: any;
  /** Current page info */
  public pageInfo = {
    endCursor: '',
  };

  /**
   * Shared notification service. Subscribes to Apollo to automatically fetch new notifications.
   *
   * @param apollo Apollo client
   * @param snackBar shared snackbar service
   * @param dialog Dialog service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private dialog: Dialog,
    private translate: TranslateService
  ) {}

  /**
   * If notifications are empty, fetch all notifications and listen to new one.
   * Else, only listen to new one.
   */
  public init(): void {
    if (this.firstLoad) {
      this.notificationsQuery =
        this.apollo.watchQuery<NotificationsQueryResponse>({
          query: GET_NOTIFICATIONS,
          variables: {
            first: ITEMS_PER_PAGE,
          },
        });

      this.notificationsQuery.valueChanges.subscribe(({ data }) => {
        this.updateValues(data);
      });

      this.apollo
        .subscribe<NotificationSubscriptionResponse>({
          query: NOTIFICATION_SUBSCRIPTION,
        })
        .subscribe(({ data }) => {
          if (data && data.notification) {
            // prevent new notification duplication
            if (this.previousNotificationId !== data.notification.id) {
              const notifications = this.notifications.getValue();
              if (notifications) {
                this.notifications.next([data.notification, ...notifications]);
              } else {
                this.notifications.next([data.notification]);
              }
            }
            this.previousNotificationId = data.notification.id;
          }
        });
    }
  }

  /**
   * Marks the given notification as seen and remove it from the array of notifications.
   *
   * @param notification Notification to mark as seen.
   */
  public markAsSeen(notification: Notification): void {
    const notifications = this.notifications.getValue();
    this.apollo
      .mutate<SeeNotificationMutationResponse>({
        mutation: SEE_NOTIFICATION,
        variables: {
          id: notification.id,
        },
      })
      .subscribe(({ data }) => {
        if (data && data.seeNotification) {
          const seeNotification = data.seeNotification;
          this.notifications.next(
            notifications.filter((x) => x.id !== seeNotification.id)
          );
        }
      });
  }

  /**
   * Redirect to records modal after clicking on notification with active redirection.
   *
   * @param notification The notification that was clicked on
   */
  public async redirectToRecords(notification: Notification) {
    const redirect = notification.redirect;

    if (redirect && redirect.active && redirect.layout && redirect.resource) {
      if (!redirect.recordIds?.length) {
        // No record id detected
        this.snackBar.openSnackBar(
          this.translate.instant('components.notifications.noRecord'),
          { error: true }
        );
      }

      if (redirect.recordIds?.length === 1) {
        // Open record modal to single record id
        const { RecordModalComponent } = await import(
          '../../components/record-modal/record-modal.component'
        );
        this.dialog.open(RecordModalComponent, {
          data: {
            recordId: redirect.recordIds[0],
          },
          autoFocus: false,
        });
      } else if (redirect.recordIds?.length) {
        // Get layout selected on trigger
        const layout = await this.getNotificationLayout(
          redirect.layout,
          redirect.resource
        );

        if (layout?.query) {
          // Open ResourceGridModalComponent to multiple record ids
          const { ResourceGridModalComponent } = await import(
            '../../components/search-resource-grid-modal/search-resource-grid-modal.component'
          );
          this.dialog.open(ResourceGridModalComponent, {
            data: {
              gridSettings: clone(layout.query),
            },
          });
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.widget.summaryCard.errors.invalidSource'
            ),
            { error: true }
          );
        }
      }
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('components.notifications.noRedirect'),
        { error: true }
      );
    }
  }

  /**
   * Marks all notifications as seen and remove it from the array of notifications.
   */
  public markAllAsSeen(): void {
    const notificationsIds = this.notifications.getValue().map((x) => x.id);
    this.apollo
      .mutate<SeeNotificationsMutationResponse>({
        mutation: SEE_NOTIFICATIONS,
        variables: {
          ids: notificationsIds,
        },
      })
      .subscribe(() => {
        this.fetchMore();
      });
  }

  /**
   * Loads more notifications.
   */
  public fetchMore(): void {
    this.notificationsQuery
      .fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
        },
      })
      .then(({ data }) => this.updateValues(data));
  }

  /**
   * Update notification data values
   *
   * @param data query response data
   */
  private updateValues(data: NotificationsQueryResponse) {
    this.cachedNotifications = updateQueryUniqueValues(
      this.cachedNotifications,
      data.notifications.edges.map((x) => x.node)
    );
    this.notifications.next(this.cachedNotifications);
    this.pageInfo.endCursor = data.notifications.pageInfo.endCursor;
    this.hasNextPage.next(data.notifications.pageInfo.hasNextPage);
    this.firstLoad = false;
  }

  /**
   * Get notification with trigger redirection layout
   *
   * @param layout layout id
   * @param resource resource id
   * @returns Layout object
   */
  private async getNotificationLayout(
    layout: string,
    resource: string
  ): Promise<Layout | undefined> {
    const apolloRes = await firstValueFrom(
      this.apollo.query<ResourceQueryResponse>({
        query: GET_LAYOUT,
        variables: {
          id: layout,
          resource,
        },
      })
    );

    if (get(apolloRes, 'data')) {
      return apolloRes.data.resource.layouts?.edges[0]?.node;
    } else {
      return undefined;
    }
  }
}
