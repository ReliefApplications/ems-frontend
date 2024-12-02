import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { ActivityLog } from '../../models/activity-log.model';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { LIST_ACTIVITIES } from './graphql/queries';
import { takeUntil } from 'rxjs/operators';
import { RestService } from '../../services/rest/rest.service';

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
  /** List of activities to display. */
  public activitiesLogs: ActivityLog[] = [];
  /** Columns to display in the table. */
  public displayedColumns: string[] = [];
  /** Attributes */
  public attributes: { text: string; value: string }[] = [];

  /**
   * Shared activity log component.
   *
   * @param apollo Apollo Client
   * @param restService Shared rest service
   */
  constructor(private apollo: Apollo, private restService: RestService) {
    super();
  }

  /**
   * OnInit lifecycle hook to fetch activities when the component initializes.
   */
  ngOnInit(): void {
    this.getAttributes();
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
    this.restService
      .get('/activity/download-activities', { responseType: 'blob' })
      .subscribe((blob: any) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'activities.xlsx';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      });
  }

  /**
   * Fetch attributes to build columns
   */
  private getAttributes(): void {
    this.restService
      .get('/permissions/attributes')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attributes: any) => {
          this.attributes = attributes;
          this.displayedColumns = [
            'userId',
            'username',
            ...this.attributes.map((x) => x.value),
            'url',
          ];
        },
        error: () => {
          this.displayedColumns = ['userId', 'username', 'url'];
        },
      });
  }
}
