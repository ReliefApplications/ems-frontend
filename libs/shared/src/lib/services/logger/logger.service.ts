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
