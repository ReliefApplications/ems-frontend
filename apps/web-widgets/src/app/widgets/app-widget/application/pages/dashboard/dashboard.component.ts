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
import { ActivatedRoute, Router } from '@angular/router';
import { GET_DASHBOARD_BY_ID } from './graphql/queries';
import {
  Dashboard,
  WidgetGridComponent,
  ConfirmService,
  ButtonActionT,
  ContextService,
  DashboardQueryResponse,
  Record,
  DashboardComponent as SharedDashboardComponent,
} from '@oort-front/shared';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
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
      useExisting: DashboardComponent,
    },
  ],
})
export class DashboardComponent
  extends SharedDashboardComponent
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
  /** Context id */
  public contextId?: string;
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
  /** Show name ( contextual pages ) */
  public showName = false;
  /** button actions */
  public buttonActions: ButtonActionT[] = [];

  /**
   * Dashboard page.
   *
   * @param apollo Apollo client
   * @param route Angular current page
   * @param router Angular router service
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
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
        // Using template
        this.showName = true;
      } else {
        this.showName = false;
      }
      this.loadDashboard(id, queryId?.trim()).then(
        () => (this.loading = false)
      );
    }
  }

  /** Sets up the widgets from the dashboard structure */
  private setWidgets() {
    this.widgets = cloneDeep(
      this.dashboard?.structure
        ?.filter((x: any) => x !== null)
        .map((widget: any) => {
          if (!this.contextService.context) {
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
    // don't init the dashboard if the id is the same
    if (this.dashboard?.id === id && this.contextId === contextId) {
      return;
    }

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
          this.contextService.context = this.dashboard?.contextData || null;
          this.initContext();
          this.setWidgets();
          this.buttonActions = this.dashboard.buttons || [];
          this.showFilter = this.dashboard.filter?.show ?? false;
          this.contextService.isFilterEnabled.next(this.showFilter);
          this.contextService.setFilter(this.dashboard);
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
          this.router.navigate(['/applications']);
        }
      })
      .catch((err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/applications']);
      });
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

  /**
   * Attaching component ( reuse strategy )
   */
  public onAttach() {
    console.log('Dashboard will attach');
    this.active = true;
  }

  /**
   * Detaching component ( reuse strategy )
   */
  public onDetach() {
    console.log('Dashboard will detach');
    this.active = false;
  }
}
