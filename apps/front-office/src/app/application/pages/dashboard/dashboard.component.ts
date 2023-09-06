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
  ButtonActionT,
} from '@oort-front/safe';
import { TranslateService } from '@ngx-translate/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';
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
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  /** Current dashboard id */
  public id = '';
  /** Loading state of the loading */
  public loading = true;
  /** List of widgets */
  public widgets = [];
  /** Current dashboard */
  public dashboard?: Dashboard;
  /** displays dashboard name */
  public displayDashboardName = false;

  @ViewChild(SafeWidgetGridComponent)
  widgetGridComponent!: SafeWidgetGridComponent;
  public showFilter?: boolean;

  // === BUTTON ACTIONS ===
  public buttonActions: ButtonActionT[] = [];

  /** @returns type of context element */
  get contextType() {
    if (this.dashboard?.page?.context) {
      return 'resource' in this.dashboard.page.context ? 'record' : 'element';
    } else {
      return;
    }
  }

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
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.route.queryParams
        .pipe(takeUntil(this.destroy$))
        .subscribe((queryParams) => {
          if (queryParams.id) {
            this.displayDashboardName = true;
          } else {
            this.displayDashboardName = false;
          }
        });
      // Reset scroll when changing page
      const pageContainer = document.getElementById('appPageContainer');
      if (pageContainer) pageContainer.scrollTop = 0;
      this.route.queryParams
        .pipe(takeUntil(this.destroy$))
        .subscribe((queryParams) => {
          const viewId = queryParams.id;
          if (viewId) {
            this.initDashboardWithId(params.id).then(() => {
              // Find the id of the contextual dashboard and load it
              const dashboardsWithContext =
                this.dashboard?.page?.contentWithContext;
              const type = this.contextType;
              // find the contextual dashboard id in the list of dashboards from the parent dashboard
              // it's the one where the element or record id matches the one in the query params
              const dashboardWithContext = dashboardsWithContext?.find((d) => {
                if (type === 'element')
                  return 'element' in d && d.element === viewId;
                else if (type === 'record')
                  return 'record' in d && d.record === viewId;
                return false;
              });
              if (dashboardWithContext) {
                this.initDashboardWithId(dashboardWithContext.content);
              } else {
                return;
              }
            });
          } else {
            this.initDashboardWithId(params.id);
          }
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
    if (this.widgetGridComponent && !this.widgetGridComponent.canDeactivate) {
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

  /**
   * Init the dashboard
   *
   * @param id Dashboard id
   * @returns Promise
   */
  private async initDashboardWithId(id: string) {
    if (this.dashboard?.id === id) return; // don't init the dashboard if the id is the same
    const rootElement = this.elementRef.nativeElement;
    // Doing this to be able to use custom styles on specific dashboards
    this.renderer.setAttribute(rootElement, 'data-dashboard-id', id);
    this.loading = true;
    this.id = id;
    return firstValueFrom(
      this.apollo.query<GetDashboardByIdQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: this.id,
        },
      })
    )
      .then(({ data, loading }) => {
        if (data.dashboard) {
          this.dashboard = data.dashboard;
          this.dashboardService.openDashboard(this.dashboard);
          this.widgets = data.dashboard.structure
            ? data.dashboard.structure
            : [];
          this.buttonActions = this.dashboard.buttons || [];
          this.loading = loading;
          this.showFilter = this.dashboard.showFilter;
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.accessNotProvided', {
              type: this.translate
                .instant('common.dashboard.one')
                .toLowerCase(),
              error: '',
            }),
            { error: true }
          );
          this.router.navigate(['/applications']);
        }
      })
      .catch((err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/applications']);
      });
  }
}
