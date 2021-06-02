import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';
import { SeeNotificationMutationResponse, SEE_NOTIFICATION, SeeNotificationsMutationResponse, SEE_NOTIFICATIONS } from '../graphql/mutations';
import { GetNotificationsQueryResponse, GET_NOTIFICATIONS } from '../graphql/queries';
import { NotificationSubscriptionResponse, NOTIFICATION_SUBSCRIPTION } from '../graphql/subscriptions';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class SafeNotificationService {

  // tslint:disable-next-line: variable-name
  private _notifications = new BehaviorSubject<Notification[]>([]);
  private firstLoad = true;

  constructor(
    private apollo: Apollo,
  ) { }

  /*  If notifications are empty, fetch all notifications and listen to new one.
      Else, only listen to new one
  */
  initNotifications(): void {
    if (this.firstLoad) {
      this.apollo.watchQuery<GetNotificationsQueryResponse>({
        query: GET_NOTIFICATIONS
      }).valueChanges.subscribe(res => {
        if (res.data.notifications) {
          this._notifications.next(res.data.notifications);
        } else {
          this._notifications.next([]);
        }
        this.firstLoad = false;
      });
      this.apollo.subscribe<NotificationSubscriptionResponse>({
        query: NOTIFICATION_SUBSCRIPTION
      }).subscribe(res => {
        console.log("j'ai une notif");
        if (res.data && res.data.notification) {
          const notifications = this._notifications.getValue();
          if (notifications) {
            this._notifications.next([res.data.notification, ...notifications]);
          } else {
            this._notifications.next([res.data.notification]);
          }
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
      }
    });
  }

  /* Mark all notifications as seen and remove it from the array of notifications
  */
  markAllAsSeen(): void {
    const notificationsIds = this._notifications.getValue().map(x => x.id);
    this.apollo.mutate<SeeNotificationsMutationResponse>({
      mutation: SEE_NOTIFICATIONS,
      variables: {
        ids: notificationsIds
      }
    }).subscribe(res => {
      if (res.data && res.data.seeNotifications) {
        this._notifications.next([]);
      }
    });
  }
}
