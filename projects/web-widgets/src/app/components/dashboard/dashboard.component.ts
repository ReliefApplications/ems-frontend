import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Dashboard } from '@safe/builder';
import {
  GetDashboardByIdQueryResponse,
  GET_DASHBOARD_BY_ID,
} from './graphql/queries';

/**
 * Dashboard component
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnChanges {
  @Input() id = '618a343dd1fcfa386278f147';

  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  public loading = true;
  public tiles = [];
  public dashboard?: Dashboard;

  /**
   * Dashboard component
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .query<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .subscribe(({ data, loading }) => {
        if (data.dashboard) {
          this.dashboard = data.dashboard;
          this.tiles = data.dashboard.structure ? data.dashboard.structure : [];
          this.loading = loading;
        }
      });
  }

  ngOnChanges(): void {
    this.apollo
      .query<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .subscribe(({ data, loading }) => {
        if (data.dashboard) {
          this.dashboard = data.dashboard;
          this.tiles = data.dashboard.structure ? data.dashboard.structure : [];
          this.loading = loading;
        }
      });
  }
}
