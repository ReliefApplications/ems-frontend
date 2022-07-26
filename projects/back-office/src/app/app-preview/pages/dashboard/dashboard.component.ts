import { Apollo } from 'apollo-angular';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetDashboardByIdQueryResponse,
  GET_DASHBOARD_BY_ID,
} from '../../../graphql/queries';
import {
  Dashboard,
  SafeSnackBarService,
  NOTIFICATIONS,
  SafeDashboardService,
} from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * Dashboard component page, for application preview.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // === DATA ===
  public id = '';
  public loading = true;
  public tiles = [];
  public dashboard?: Dashboard;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  /**
   * Dashboar component page for application preview.
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private dashboardService: SafeDashboardService
  ) {}

  /**
   * Gets the dashboard from the page parameters.
   */
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.apollo
        .watchQuery<GetDashboardByIdQueryResponse>({
          query: GET_DASHBOARD_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe(
          (res) => {
            if (res.data.dashboard) {
              this.dashboard = res.data.dashboard;
              this.dashboardService.openDashboard(this.dashboard);
              this.tiles = res.data.dashboard.structure
                ? res.data.dashboard.structure
                : [];
              this.loading = res.loading;
            } else {
              this.snackBar.openSnackBar(
                NOTIFICATIONS.accessNotProvided('dashboard'),
                { error: true }
              );
              this.router.navigate(['/dashboards']);
            }
          },
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/dashboards']);
          }
        );
    });
  }

  /**
   * Destroys all subscriptions of the page.
   */
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.dashboardService.closeDashboard();
  }
}
