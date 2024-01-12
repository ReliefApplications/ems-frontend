import { Apollo } from 'apollo-angular';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { GET_DASHBOARD_BY_ID } from './graphql/queries';
import {
  Dashboard,
  DashboardService,
  UnsubscribeComponent,
  WidgetGridComponent,
  ConfirmService,
  ButtonActionT,
  ContextService,
  DashboardQueryResponse,
  Record,
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
})
export class DashboardComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  /** Change step event ( in workflow ) */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();
  /** Widget grid reference */
  @ViewChild(WidgetGridComponent)
  widgetGridComponent!: WidgetGridComponent;
  /** Is dashboard in fullscreen mode */
  public isFullScreen = false;
  /** Dashboard id */
  public id = '';
  /** Application id */
  public applicationId?: string;
  /** Is dashboard loading */
  public loading = true;
  /** List of widgets */
  public widgets: any[] = [];
  /** Current dashboard */
  public dashboard?: Dashboard;
  /** Show dashboard filter */
  public showFilter!: boolean;
  /** Current style variant */
  public variant!: string;
  /** hide / show the close icon on the right */
  public closable = true;
  // === BUTTON ACTIONS ===
  /** Dashboard button actions */
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
   * @param document Document
   * @param contextService Dashboard context service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private contextService: ContextService
  ) {
    super();
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
        this.loading = true;
        // Reset scroll when changing page
        const pageContainer = this.document.getElementById('appPageContainer');
        if (pageContainer) {
          pageContainer.scrollTop = 0;
        }
        /** Extract main dashboard id */
        const id = this.route.snapshot.paramMap.get('id');
        /** Extract query id to load template */
        const queryId = this.route.snapshot.queryParamMap.get('id');
        if (id) {
          if (queryId) {
            // Try to load template
            this.loadDashboard(id).then(() => {
              const templates = this.dashboard?.page?.contentWithContext;
              const type = this.contextType;
              if (type) {
                // Find template from parent's templates, based on query params id
                const template = templates?.find((d) => {
                  // If templates use reference data
                  if (type === 'element')
                    return (
                      'element' in d &&
                      d.element.toString().trim() === queryId.trim()
                    );
                  // If templates use resource
                  else if (type === 'record')
                    return (
                      'record' in d &&
                      d.record.toString().trim() === queryId.trim()
                    );
                  return false;
                });

                if (template) {
                  // Load template, it will erase current dashboard
                  this.loadDashboard(template.content).then(
                    () => (this.loading = false)
                  );
                } else {
                  // Will use current template
                  this.loading = false;
                  return;
                }
              } else {
                this.loading = false;
              }
            });
          } else {
            // Don't use template, and directly load the dashboard from router's params
            this.loadDashboard(id).then(() => (this.loading = false));
          }
        }
      });
  }

  /**
   * Init the dashboard
   *
   * @param id Dashboard id
   * @returns Promise
   */
  private async loadDashboard(id: string) {
    // don't init the dashboard if the id is the same
    if (this.dashboard?.id === id) {
      return;
    }

    const rootElement = this.elementRef.nativeElement;
    // Doing this to be able to use custom styles on specific dashboards
    this.renderer.setAttribute(rootElement, 'data-dashboard-id', id);
    this.loading = true;
    this.id = id;
    return firstValueFrom(
      this.apollo.query<DashboardQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id: this.id,
        },
      })
    )
      .then(({ data }) => {
        if (data.dashboard) {
          this.dashboard = data.dashboard;
          this.dashboardService.openDashboard(this.dashboard);
          this.initContext();
          this.widgets = cloneDeep(
            data.dashboard.structure
              ?.filter((x: any) => x !== null)
              .map((widget: any) => {
                const contextData = this.dashboard?.contextData;
                this.contextService.context = contextData || null;

                if (!contextData) {
                  return widget;
                }
                const { settings, originalSettings } =
                  this.contextService.updateSettingsContextContent(
                    widget.settings
                  );
                widget = {
                  ...widget,
                  originalSettings,
                  settings,
                };
                return widget;
              }) || []
          );
          this.buttonActions = this.dashboard.buttons || [];
          this.showFilter = this.dashboard.filter?.show ?? false;
          this.contextService.isFilterEnabled.next(this.showFilter);
          this.variant = this.dashboard.filter?.variant || 'default';
          this.closable = this.dashboard.filter?.closable ?? false;
        } else {
          this.contextService.isFilterEnabled.next(false);
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

  /** Initializes the dashboard context */
  private initContext() {
    const callback = (contextItem: {
      element?: string;
      record?: string;
      recordData?: Record;
    }) => {
      this.contextService.onContextChange(
        'element' in contextItem ? contextItem.element : contextItem.record,
        this.contextType,
        this.route
      );
    };
    this.contextService.initContext(callback);
  }
}
