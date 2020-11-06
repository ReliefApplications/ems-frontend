import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { GetDashboardByIdQueryResponse, GET_DASHBOARD_BY_ID } from '../../../graphql/queries';
import { Dashboard, WhoSnackBarService } from '@who-ems/builder';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // === DATA ===
  public id: string;
  public loading = true;
  public tiles = [];
  public dashboard: Dashboard;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    // this.id = this.route.snapshot.params.id;
    this.id = '5fa2b81efe601d46e2ed4bf9';
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
      } else {
        this.snackBar.openSnackBar('No access provided to this dashboard.', { error: true });
        this.router.navigate(['/dashboards']);
      }
    },
      (err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/dashboards']);
      }
    );
  }

}
