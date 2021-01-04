import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { SeeNotificationMutationResponse, SEE_NOTIFICATION } from '../graphql/mutations';
import { GetNotificationsQueryResponse, GET_NOTIFICATIONS } from '../graphql/queries';
import { NotificationSubscriptionResponse, NOTIFICATION_SUBSCRIPTION } from '../graphql/subscriptions';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class WhoNotificationService {

  // tslint:disable-next-line: variable-name
  private _notifications = new BehaviorSubject<Notification[]>(null);
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
        if (res.data.notification) {
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
      if (res.data.seeNotification) {
        this._notifications.next(notifications.filter(x => x.id !== res.data.seeNotification.id));
      }
    });
  }
}
