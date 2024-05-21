import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';
import { firstValueFrom } from 'rxjs';

/** Event types */
export enum EventType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  DOWNLOAD_FILE = 'DOWNLOAD_FILE',
}

type LoginEvent = {
  type: EventType.LOGIN;
  user: string;
  datetime: Date;
};
type LogoutEvent = {
  type: EventType.LOGOUT;
  user: string;
  datetime: Date;
};

export type DownloadFileEvent = {
  type: EventType.DOWNLOAD_FILE;
  user: string;
  datetime: Date;
  file: string;
  form: string;
};

/** Event type */
export type Event = LoginEvent | LogoutEvent | DownloadFileEvent;

/** Analytics service, for sending events to server. */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  /** Analytics URL */
  private static readonly ANALYTICS_URL = '/events';

  /**
   * Analytics service, for sending events to server.
   *
   * @param restService REST service
   */
  constructor(private restService: RestService) {}

  /**
   * Send an event to the server.
   *
   * @param event Event to send
   */
  sendEvent(event: Omit<Event, 'user'>): void {
    firstValueFrom(
      this.restService.post(`${AnalyticsService.ANALYTICS_URL}/track`, event)
    ).catch((error) => {
      console.error('Failed to log event', event, error);
    });
  }
}
