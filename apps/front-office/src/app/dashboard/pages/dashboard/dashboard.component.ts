import { Apollo } from 'apollo-angular';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GetDashboardByIdQueryResponse,
  GET_DASHBOARD_BY_ID,
} from './graphql/queries';
import {
  Dashboard,
  SafeDashboardService,
  SafeUnsubscribeComponent,
  SafeWidgetGridComponent,
  SafeConfirmService,
} from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';

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
  public isFullScreen = false;
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

  @ViewChild(SafeWidgetGridComponent)
  widgetGridComponent!: SafeWidgetGridComponent;
  public showFilter?: boolean;

  /**
   * Dashboard page.
   *
   * @param apollo Apollo client
   * @param route Angular current page
   * @param router Angular router
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param dashboardService Shared dashboard service
   * @param translate Angular translate service
   * @param confirmService Shared confirm service
   * @param renderer Angular renderer
   * @param elementRef Angular element ref
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private dashboardService: SafeDashboardService,
    private translate: TranslateService,
    private confirmService: SafeConfirmService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    super();
  }

  /**
   * Subscribes to the route to load the dashboard accordingly.
   */
  ngOnInit(): void {
    const rootElement = this.elementRef.nativeElement;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      // Doing this to be able to use custom styles on specific dashboards
      this.renderer.setAttribute(rootElement, 'data-dashboard-id', params.id);
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
              this.showFilter = this.dashboard.showFilter;
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

  /**
   * Show modal confirmation before leave the page if has changes on form
   *
   * @returns boolean of observable of boolean
   */
  canDeactivate(): Observable<boolean> | boolean {
    if (this.widgetGridComponent && !this.widgetGridComponent?.canDeactivate) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('pages.dashboard.update.exit'),
        content: this.translate.instant('pages.dashboard.update.exitMessage'),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'primary',
      });
      return dialogRef.closed.pipe(
        map((confirm) => {
          if (confirm) {
            return true;
          }
          return false;
        })
      );
    }
    return true;
  }
}
