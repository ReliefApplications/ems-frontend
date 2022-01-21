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
} from './graphql/queries';
import {
  Dashboard,
  SafeSnackBarService,
  SafeDashboardService,
  NOTIFICATIONS,
} from '@safe/builder';
import { Subscription } from 'rxjs';

/**
 * Dashboard page.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  /** Current dashboard id */
  public id = '';
  /** Loading state of the loading */
  public loading = true;
  /** List of widgets */
  public widgets = [];
  /** Current dashboard */
  public dashboard?: Dashboard;
  /** Subscribes to the route to load the dashboard */
  private routeSubscription?: Subscription;

  /**
   * Dashboard page.
   *
   * @param apollo Apollo client
   * @param route Angular current page
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
   * Subscribes to the route to load the dashboard accordingly.
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
              this.widgets = res.data.dashboard.structure
                ? res.data.dashboard.structure
                : [];
              this.loading = res.loading;
            } else {
              this.snackBar.openSnackBar(
                NOTIFICATIONS.accessNotProvided('dashboard'),
                { error: true }
              );
              this.router.navigate(['/applications']);
            }
          },
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/applications']);
          }
        );
    });
  }

  /**
   * Removes all subscriptions of the component.
   */
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    this.dashboardService.closeDashboard();
  }
}
