import { Component } from '@angular/core';
import { LIST_ACTIVITIES_BY_URL } from './graphql/queries';

/** Activities components displaying activity logs */
@Component({
  selector: 'shared-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent {
  /** Query for top pages */
  public topPagesQuery = LIST_ACTIVITIES_BY_URL;
}
