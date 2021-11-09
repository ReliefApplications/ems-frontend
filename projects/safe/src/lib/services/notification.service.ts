import { Apollo, QueryRef } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SeeNotificationMutationResponse, SEE_NOTIFICATION, SeeNotificationsMutationResponse, SEE_NOTIFICATIONS } from '../graphql/mutations';
import { GetNotificationsQueryResponse, GET_NOTIFICATIONS } from '../graphql/queries';
import { NotificationSubscriptionResponse, NOTIFICATION_SUBSCRIPTION } from '../graphql/subscriptions';
import { Notification } from '../models/notification.model';

const ITEMS_PER_PAGE = 10;

@Injectable({
  providedIn: 'root'
})
export class SafeNotificationService {

  private notifications = new BehaviorSubject<Notification[]>([]);
  public notificationsQuery!: QueryRef<GetNotificationsQueryResponse>;

  private hasNextPage = new BehaviorSubject<boolean>(true);

  private firstLoad = true;
  private previousNotificationId: any;

  public pageInfo = {
    endCursor: ''
  };

  /**
   * Returns the notification list as an Observable.
   */
  get notifications$(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  /**
   * Returns has next page indicator.
   */
  get hasNextPage$(): Observable<boolean> {
    return this.hasNextPage.asObservable();
  }

  constructor(
    private apollo: Apollo,
  ) { }

  /**
   * If notifications are empty, fetch all notifications and listen to new one.
   * Else, only listen to new one.
   */
  public init(): void {
    if (this.firstLoad) {
      this.notificationsQuery = this.apollo.watchQuery<GetNotificationsQueryResponse>({
        query: GET_NOTIFICATIONS,
        variables: {
          first: ITEMS_PER_PAGE
        }
      });

      this.notificationsQuery.valueChanges.subscribe(res => {
        this.notifications.next(res.data.notifications.edges.map(x => x.node));
        this.pageInfo.endCursor = res.data.notifications.pageInfo.endCursor;
        this.hasNextPage.next(res.data.notifications.pageInfo.hasNextPage);
        this.firstLoad = false;
      });

      this.apollo.subscribe<NotificationSubscriptionResponse>({
        query: NOTIFICATION_SUBSCRIPTION
      }).subscribe(res => {
        if (res.data && res.data.notification) {
          // prevent new notification duplication
          if (this.previousNotificationId !== res.data.notification.id) {
            const notifications = this.notifications.getValue();
            if (notifications) {
              this.notifications.next([res.data.notification, ...notifications]);
            } else {
              this.notifications.next([res.data.notification]);
            }
          }
          this.previousNotificationId = res.data.notification.id;
        }
      });
    }
  }

  /**
   * Mark the given notification as seen and remove it from the array of notifications.
   * @param notification Notification to mark as seen.
   */
  public markAsSeen(notification: Notification): void {
    const notifications = this.notifications.getValue();
    this.apollo.mutate<SeeNotificationMutationResponse>({
      mutation: SEE_NOTIFICATION,
      variables: {
        id: notification.id
      }
    }).subscribe(res => {
      if (res.data && res.data.seeNotification) {
        const seeNotification = res.data.seeNotification;
        this.notifications.next(notifications.filter(x => x.id !== seeNotification.id));
      }
    });
  }

  /**
   * Mark all notifications as seen and remove it from the array of notifications.
   */
  public markAllAsSeen(): void {
    const notificationsIds = this.notifications.getValue().map(x => x.id);
    this.apollo.mutate<SeeNotificationsMutationResponse>({
      mutation: SEE_NOTIFICATIONS,
      variables: {
        ids: notificationsIds
      }
    }).subscribe(res => {
      this.fetchMore();
    });
  }

  public fetchMore(): void {
    this.notificationsQuery.fetchMore({
      variables: {
        first: ITEMS_PER_PAGE,
        afterCursor: this.pageInfo.endCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return prev; }
        return Object.assign({}, prev, {
          notifications: {
            edges: [ ...prev.notifications.edges, ...fetchMoreResult.notifications.edges ],
            pageInfo: fetchMoreResult.notifications.pageInfo,
            totalCount: fetchMoreResult.notifications.totalCount
          }
        });
      }
    });
  }
}
