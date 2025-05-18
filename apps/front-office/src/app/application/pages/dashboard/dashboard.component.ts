import { Apollo } from 'apollo-angular';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GET_DASHBOARD_BY_ID } from './graphql/queries';
import {
  Dashboard,
  ConfirmService,
  ActionButton,
  ContextService,
  DashboardQueryResponse,
  Record,
  DashboardComponent as SharedDashboardComponent,
  DashboardAutomationService,
  BreadcrumbService,
} from '@oort-front/shared';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { DOCUMENT } from '@angular/common';
import { cloneDeep } from 'lodash';

/**
 * Dashboard page.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    {
      provide: SharedDashboardComponent,
      useClass: DashboardComponent,
    },
    DashboardAutomationService,
  ],
})
export class DashboardComponent
  extends SharedDashboardComponent
  implements OnInit
{
  /** Change step event ( in workflow ) */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();
  /** Is dashboard in fullscreen mode */
  public isFullScreen = false;
  /** Dashboard id */
  public id = '';
  /** Context id */
  public contextId?: string;
  /** Is dashboard loading */
  public loading = true;
  /** Current dashboard */
  public dashboard?: Dashboard;
  /** Show dashboard filter */
  public showFilter!: boolean;
  /** Current style variant */
  public variant!: string;
  /** hide / show the close icon on the right */
  public closable = true;
  /** Dashboard action buttons */
  public actionButtons: ActionButton[] = [];
  /** Should show dashboard name */
  public showName? = true;
  /** If dashboard is displayed under workflow  */
  public isStep = false;

  /**
   * Dashboard page.
   *
   * @param apollo Apollo client
   * @param route Angular current page
   * @param router Angular router
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param confirmService Shared confirm service
   * @param renderer Angular renderer
   * @param elementRef Angular element ref
   * @param document Document
   * @param contextService Dashboard context service
   * @param dashboardAutomationService Dashboard automation service
   * @param breadcrumbService Breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private contextService: ContextService,
    private dashboardAutomationService: DashboardAutomationService,
    private breadcrumbService: BreadcrumbService
  ) {
    super();
    this.dashboardAutomationService.dashboard = this;
  }

  /**
   * Subscribes to the route to load the dashboard accordingly.
   */
  ngOnInit(): void {
    /** Listen to router events navigation end, to get last version of params & queryParams. */
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.router), // initialize
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Reset scroll when changing page
        const pageContainer = this.document.getElementById('appPageContainer');
        if (pageContainer) {
          pageContainer.scrollTop = 0;
        }
        this.isStep = this.router.url.includes('/workflow/');
        /** Extract main dashboard id */
        const id = this.route.snapshot.paramMap.get('id');
        /** Extract query id to load template */
        const queryId = this.route.snapshot.queryParamMap.get('id');
        if (id) {
          this.loadDashboard(id, queryId?.trim());
        }
      });
  }

  /**
   * Reload the dashboard.
   */
  reload(): void {
    if (this.id) {
      this.loadDashboard(this.id, this.contextId);
    }
  }

  /** Sets up the widgets from the dashboard structure */
  private setWidgets() {
    this.widgets = cloneDeep(
      this.dashboard?.structure
        ?.filter((x: any) => x !== null)
        .map((widget: any) => {
          const contextData = this.dashboard?.contextData;
          this.contextService.context = this.contextId
            ? { id: this.contextId, ...contextData }
            : null;
          if (contextData) {
            return widget;
          }
          const { settings, originalSettings } =
            this.contextService.updateSettingsContextContent(
              widget.settings,
              this.dashboard
            );
          widget = {
            ...widget,
            originalSettings,
            settings,
          };
          return widget;
        }) || []
    );
  }

  /**
   * Init the dashboard
   *
   * @param id Dashboard id
   * @param contextId Context id (id of the element or the record)
   * @returns Promise
   */
  private async loadDashboard(id: string, contextId?: string) {
    const rootElement = this.elementRef.nativeElement;
    // Doing this to be able to use custom styles on specific dashboards
    this.renderer.setAttribute(rootElement, 'data-dashboard-id', id);
    this.loading = true;

    return firstValueFrom(
      this.apollo.query<DashboardQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id,
          contextEl: contextId || null,
        },
      })
    )
      .then(({ data }) => {
        if (data.dashboard) {
          this.id = data.dashboard.id || id;
          this.contextId = contextId ?? undefined;
          this.dashboard = data.dashboard;
          this.breadcrumbService.setBreadcrumb(
            this.isStep ? '@workflow' : '@dashboard',
            this.dashboard.name as string,
            this.isStep ? this.dashboard?.step?.workflow?.name : ''
          );
          this.initContext();
          this.setWidgets();
          this.actionButtons = this.dashboard.buttons || [];
          this.showFilter = this.dashboard.filter?.show ?? false;
          this.contextService.isFilterEnabled.next(this.showFilter);
          this.contextService.filterPosition.next({
            position: this.dashboard.filter?.position as any,
            dashboardId: this.dashboard.id ?? '',
          });
          this.contextService.setFilter(this.dashboard);
          this.variant = this.dashboard.filter?.variant || 'default';
          this.closable = this.dashboard.filter?.closable ?? false;
          this.showName = this.dashboard.step
            ? this.dashboard.step.showName
            : this.dashboard.page?.showName;
        } else {
          this.contextService.isFilterEnabled.next(false);
          this.contextService.setFilter();
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.accessNotProvided', {
              type: this.translate
                .instant('common.dashboard.one')
                .toLowerCase(),
              error: '',
            }),
            { error: true }
          );
          this.router.navigate(['/']);
        }
        this.loading = false;
      })
      .catch((err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/']);
      });
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

  /** Initializes the dashboard context */
  private initContext() {
    const callback = (contextItem: {
      element?: string;
      record?: string;
      recordData?: Record;
    }) => {
      this.contextService.onContextChange(
        'element' in contextItem ? contextItem.element : contextItem.record,
        this.route,
        this.dashboard
      );
    };
    this.contextService.initContext(this.dashboard as Dashboard, callback);
  }
}
