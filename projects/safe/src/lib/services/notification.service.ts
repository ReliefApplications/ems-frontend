import {Apollo, QueryRef} from 'apollo-angular';
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

  // tslint:disable-next-line: variable-name
  private _notifications = new BehaviorSubject<Notification[]>([]);
  public notificationsQuery!: QueryRef<GetNotificationsQueryResponse>;
  public cachedNotifications: Notification[] = [];
  private firstLoad = true;
  private previousNotificationId: any;

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

  constructor(
    private apollo: Apollo,
  ) { }

  /*  If notifications are empty, fetch all notifications and listen to new one.
      Else, only listen to new one
  */
  initNotifications(): void {
    if (this.firstLoad) {
      this.notificationsQuery = this.apollo.watchQuery<GetNotificationsQueryResponse>({
        query: GET_NOTIFICATIONS,
        variables: {
          first: ITEMS_PER_PAGE
        }
      });

      this.notificationsQuery.valueChanges.subscribe(res => {
        this.cachedNotifications = res.data.notifications.edges.map(x => x.node);
        this._notifications.next(this.cachedNotifications.slice(
          ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)));
        this.pageInfo.length = res.data.notifications.totalCount;
        this.pageInfo.endCursor = res.data.notifications.pageInfo.endCursor;
        this.firstLoad = false;
      });

      this.apollo.subscribe<NotificationSubscriptionResponse>({
        query: NOTIFICATION_SUBSCRIPTION
      }).subscribe(res => {
        if (res.data && res.data.notification) {
          // prevent new notification duplication
          if (this.previousNotificationId !== res.data.notification.id) {
            const notifications = this._notifications.getValue();
            if (notifications) {
              if (notifications.length <= 9) {
                this._notifications.next([res.data.notification, ...notifications]);
              }
              this.pageInfo.length++;
            } else {
              this._notifications.next([res.data.notification]);
            }
          }
          this.previousNotificationId = res.data.notification.id;
        }
      });
    }
  }

  /*  Return the notification list as an Observable.
  */
  get notifications(): Observable<Notification[]> {
    return this._notifications.asObservable();
  }

  /* Mark the given notification as seen and remove it from the array of notifications
  */
  markAsSeen(notification: Notification): void {
    const notifications = this._notifications.getValue();
    this.apollo.mutate<SeeNotificationMutationResponse>({
      mutation: SEE_NOTIFICATION,
      variables: {
        id: notification.id
      }
    }).subscribe(res => {
      if (res.data && res.data.seeNotification) {
        const seeNotification = res.data.seeNotification;
        this._notifications.next(notifications.filter(x => x.id !== seeNotification.id));
        this.pageInfo.length--;
      }
    });
  }

  /* Mark all notifications as seen and remove it from the array of notifications
  */
  markAllAsSeen(): void {
    const notificationsIds = this.cachedNotifications.map(x => x.id);
    this.apollo.mutate<SeeNotificationsMutationResponse>({
      mutation: SEE_NOTIFICATIONS,
      variables: {
        ids: notificationsIds
      }
    }).subscribe(res => {
      if (res.data && res.data.seeNotifications) {
        this._notifications.next([]);
        this.pageInfo.length = 0;
      }
    });
  }
}
