import { Apollo } from 'apollo-angular';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_DASHBOARD_BY_ID } from './graphql/queries';
import {
  Dashboard,
  DashboardQueryResponse,
  DashboardService,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from '@oort-front/ui';

/**
 * Dashboard component page, for application preview.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Id of loaded dashboard */
  public id = '';
  /** Loading indicator */
  public loading = true;
  /** Current widgets */
  public tiles = [];
  /** Current dashboard */
  public dashboard?: Dashboard;
  /** Emit event when changing steps */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  /**
   * Dashboard component page for application preview.
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param dashboardService Shared dashboard service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackbarService,
    private dashboardService: DashboardService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Gets the dashboard from the page parameters.
   */
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.loading = true;
      this.id = params.id;
      this.apollo
        .query<DashboardQueryResponse>({
          query: GET_DASHBOARD_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .subscribe({
          next: ({ data, loading }) => {
            if (data.dashboard) {
              this.dashboard = data.dashboard;
              this.dashboardService.openDashboard(this.dashboard);
              this.tiles = data.dashboard.structure
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
              this.router.navigate(['/dashboards']);
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
            this.router.navigate(['/dashboards']);
          },
        });
    });
  }

  /**
   * Destroys all subscriptions of the page.
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.dashboardService.closeDashboard();
  }
}
