import { Component, Input, OnInit } from '@angular/core';
import { Dashboard } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../../graphql/queries';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @Input() id: string;

  // === DATA ===
  public loading = true;
  public tiles = [];
  public dashboard: Dashboard;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
      query: GET_DASHBOARD_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.dashboard) {
        this.dashboard = res.data.dashboard;
        this.tiles = res.data.dashboard.structure ? res.data.dashboard.structure : [];
        this.loading = res.loading;
      }
    });
  }

  ngOnChanges(): void {
    this.apollo.watchQuery<GetDashboardByIdQueryResponse>({
      query: GET_DASHBOARD_BY_ID,
      variables: {
        id: this.dashboard
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.dashboard) {
        this.dashboard = res.data.dashboard;
        this.tiles = res.data.dashboard.structure ? res.data.dashboard.structure : [];
        this.loading = res.loading;
      }
    });
  }

}
