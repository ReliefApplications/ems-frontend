import { Component } from '@angular/core';
import { LIST_ACTIVITIES } from './graphql/queries';
import { OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
// import { Activity } from './models/activity';

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
   * List of activities to display.
   */
  activities: any[] = [];

  /**
   * Constructor that injects the Apollo service.
   *
   * @param apollo The Apollo service for interacting with GraphQL API.
   */
  constructor(private apollo: Apollo) {}

  /**
   * OnInit lifecycle hook to fetch activities when the component initializes.
   */
  ngOnInit(): void {
    // Use Apollo service to watch the LIST_ACTIVITIES query
    this.apollo
      .watchQuery<{ activity: any[] }>({
        query: LIST_ACTIVITIES,
      })
      .valueChanges.subscribe((result) => {
        // Update the activities array with the fetched data
        this.activities = result.data.activity;
        console.log('Activities:', result);
      });
  }
}
