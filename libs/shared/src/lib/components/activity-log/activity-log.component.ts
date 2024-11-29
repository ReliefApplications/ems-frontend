import { Component, Input } from '@angular/core';
import { LIST_ACTIVITIES } from './graphql/queries';
import { OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivityLog } from '../../models/activity-log.model';
import { HttpClient } from '@angular/common/http';

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
export class ActivityLogComponent implements OnInit {
  /**
   * User ID to filter activities.
   */
  @Input() userId: string | undefined;

  /**
   * Application ID to filter activities.
   */
  @Input() applicationId: string | undefined;

  /**
   * List of activities to display.
   */
  activitiesLogs: ActivityLog[] = [];

  /**
   * Columns to display in the table.
   */
  displayedColumns: string[] = ['userId', 'eventType', 'url'];

  /**
   * URL to download activities.
   */
  downloadUrl = 'http://localhost:3000/activity/download-activities';

  /**
   * Constructor that injects the Apollo service.
   *
   * @param apollo The Apollo service for interacting with GraphQL API.
   * @param http The HttpClient service for making HTTP requests.
   */
  constructor(private apollo: Apollo, private http: HttpClient) {}

  /**
   * OnInit lifecycle hook to fetch activities when the component initializes.
   */
  ngOnInit(): void {
    // Use Apollo service to watch the LIST_ACTIVITIES query
    this.apollo
      .watchQuery<{ activityLogs: ActivityLog[] }>({
        query: LIST_ACTIVITIES,
        variables: { userId: this.userId, applicationId: this.applicationId },
      })
      .valueChanges.subscribe((result) => {
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
