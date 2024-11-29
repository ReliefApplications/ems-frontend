import { Injectable } from '@angular/core';
import { RestService } from '../rest/rest.service';

/**
 * Service to track user activity
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  /** Base path for activity tracking */
  private activityBasePath = '/activity';

  /**
   * Service to track user activity
   *
   * @param restService Service to make REST calls
   */
  constructor(private restService: RestService) {}

  /**
   * Track an activity
   *
   * @param activity Activity to track
   * @returns Observable of the activity
   */
  public track(activity: any) {
    // I am not sure if this is the best way to handle this
    // but the application service observable retunrs a null in the subscribe
    // method on first call under all circumstances
    if (activity.metadata.url.includes('/applications/')) {
      const applicationId = activity.metadata.url
        .split('/applications/')[1]
        .split('/')[0];
      activity.metadata.applicationId = applicationId;
    }

    // TODO: Alias or shortcut?

    return this.restService.post(this.activityBasePath, activity).subscribe(
      (response) => {
        console.log('Activity tracked successfully', response);
      },
      (error) => {
        console.error('Error tracking activity', error);
      }
    );
  }
}
