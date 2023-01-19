import { Apollo, QueryRef } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  SeeNotificationMutationResponse,
  SEE_NOTIFICATION,
  SeeNotificationsMutationResponse,
  SEE_NOTIFICATIONS,
} from './graphql/mutations';
import {
  GetNotificationsQueryResponse,
  GET_NOTIFICATIONS,
} from './graphql/queries';
import {
  NotificationSubscriptionResponse,
  NOTIFICATION_SUBSCRIPTION,
} from './graphql/subscriptions';
import { Notification } from '../../models/notification.model';

/** Pagination: number of items per query */
const ITEMS_PER_PAGE = 10;

/**
 * Shared notification service. Subscribes to Apollo to automatically fetch new notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeNotificationService {
  /** Current notifications */
  private notifications = new BehaviorSubject<Notification[]>([]);
  /** @returns Current notifications as observable */
  get notifications$(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  /** Notifications query */
  public notificationsQuery!: QueryRef<GetNotificationsQueryResponse>;

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
   */
  constructor(private apollo: Apollo) {}

  /**
   * If notifications are empty, fetch all notifications and listen to new one.
   * Else, only listen to new one.
   */
  public init(): void {
    if (this.firstLoad) {
      this.notificationsQuery =
        this.apollo.watchQuery<GetNotificationsQueryResponse>({
          query: GET_NOTIFICATIONS,
          variables: {
            first: ITEMS_PER_PAGE,
          },
        });

      this.notificationsQuery.valueChanges.subscribe(({ data }) => {
        this.notifications.next(data.notifications.edges.map((x) => x.node));
        this.pageInfo.endCursor = data.notifications.pageInfo.endCursor;
        this.hasNextPage.next(data.notifications.pageInfo.hasNextPage);
        this.firstLoad = false;
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
    this.notificationsQuery.fetchMore({
      variables: {
        first: ITEMS_PER_PAGE,
        afterCursor: this.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          notifications: {
            edges: [
              ...prev.notifications.edges,
              ...fetchMoreResult.notifications.edges,
            ],
            pageInfo: fetchMoreResult.notifications.pageInfo,
            totalCount: fetchMoreResult.notifications.totalCount,
          },
        });
      },
    });
  }
}
