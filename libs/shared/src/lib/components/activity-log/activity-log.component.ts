import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivityLog } from '../../models/activity-log.model';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { LIST_ACTIVITIES } from './graphql/queries';
import { takeUntil } from 'rxjs/operators';

/**
 * URL to download activities.
 */

/**
 * Shared activity log component.
 */
@Component({
  selector: 'shared-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /**
   * List of activities to display.
   */
  activitiesLogs: ActivityLog[] = [];

  /**
   * Columns to display in the table.
   */
  displayedColumns: string[] = [
    'userId',
    'url',
    'username',
    'region',
    'country',
  ];

  /**
   * URL to download activities.
   */
  downloadUrl = '';

  /**
   * Constructor that injects the Apollo service.
   *
   * @param environment environment values
   * @param apollo The Apollo service for interacting with GraphQL API.
   * @param http The HttpClient service for making HTTP requests.
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    private http: HttpClient
  ) {
    super();
    this.downloadUrl = `${environment.apiUrl}/activity/download-activities`;
  }

  /**
   * OnInit lifecycle hook to fetch activities when the component initializes.
   */
  ngOnInit(): void {
    // Use Apollo service to watch the LIST_ACTIVITIES query
    this.apollo
      .watchQuery<{ activityLogs: ActivityLog[] }>({
        query: LIST_ACTIVITIES,
      })
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        // Update the activities array with the fetched data
        this.activitiesLogs = result.data.activityLogs;
      });
  }

  /**
   * Method to download activities when the link is clicked.
   */
  downloadActivities(): void {
    this.http
      .get(this.downloadUrl, { responseType: 'blob' })
      .subscribe((blob: any) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'activities.xlsx';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      });
  }
}
