import { Apollo } from 'apollo-angular';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetDashboardByIdQueryResponse,
  GET_DASHBOARD_BY_ID,
} from './graphql/queries';
import {
  Dashboard,
  SafeSnackBarService,
  SafeDashboardService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

/**
 * Dashboard page.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
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

  /**
   * Dashboard page.
   *
   * @param apollo Apollo client
   * @param route Angular current page
   * @param router Angular router
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param dashboardService Shared dashboard service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private dashboardService: SafeDashboardService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Subscribes to the route to load the dashboard accordingly.
   */
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.id = params.id;
      this.loading = true;
      this.apollo
        .watchQuery<GetDashboardByIdQueryResponse>({
          query: GET_DASHBOARD_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe({
          next: ({ data, loading }) => {
            if (data.dashboard) {
              this.dashboard = data.dashboard;
              this.dashboardService.openDashboard(this.dashboard);
              this.widgets = data.dashboard.structure
                ? data.dashboard.structure
                : [];
              this.loading = loading;
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translate
                      .instant('common.dashboard.one')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
              this.router.navigate(['/applications']);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/applications']);
          },
        });
    });
  }

  /**
   * Removes all subscriptions of the component.
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dashboardService.closeDashboard();
  }
}
