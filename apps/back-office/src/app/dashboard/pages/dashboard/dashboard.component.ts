import { Apollo, QueryRef } from 'apollo-angular';
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
import { ActivatedRoute, Router } from '@angular/router';
import {
  Dashboard,
  SafeApplicationService,
  SafeWorkflowService,
  SafeDashboardService,
  SafeAuthService,
  Application,
  SafeUnsubscribeComponent,
  SafeWidgetGridComponent,
  SafeConfirmService,
  SafeReferenceDataService,
  Record,
  ResourceRecordsNodesQueryResponse,
  DashboardQueryResponse,
  EditDashboardMutationResponse,
  EditStepMutationResponse,
  EditPageMutationResponse,
  RecordQueryResponse,
} from '@oort-front/safe';
import { EDIT_DASHBOARD, EDIT_PAGE, EDIT_STEP } from './graphql/mutations';
import {
  GET_DASHBOARD_BY_ID,
  GET_RECORD_BY_ID,
  GET_RESOURCE_RECORDS,
} from './graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { FormControl } from '@angular/forms';
import { isEqual } from 'lodash';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';
import localForage from 'localforage';

/** Default number of records fetched per page */
const ITEMS_PER_PAGE = 10;

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
  // === DATA ===
  public id = '';
  public applicationId?: string;
  public loading = true;
  public tiles: any[] = [];
  public dashboard?: Dashboard;
  public showFilter?: boolean;

  // === GRID ===
  private generatedTiles = 0;

  // === DASHBOARD NAME EDITION ===
  public canEditName = false;
  public formActive = false;

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

  // === DUP APP SELECTION ===
  public showAppMenu = false;
  public applications: Application[] = [];

  @ViewChild(SafeWidgetGridComponent)
  widgetGridComponent!: SafeWidgetGridComponent;

  // === CONTEXT ===
  public refDataElements: any[] = [];
  public recordsQuery!: QueryRef<ResourceRecordsNodesQueryResponse>;
  public contextId = new FormControl<string | number | null>(null);
  public refDataValueField = '';
  public contextRecord: Record | null = null;

  /**
   * Dashboard page
   *
   * @param applicationService Shared application service
   * @param workflowService Shared workflow service
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param dashboardService Shared dashboard service
   * @param translateService Angular translate service
   * @param authService Shared authentication service
   * @param confirmService Shared confirm service
   * @param refDataService Shared reference data service
   * @param renderer Angular renderer
   * @param elementRef Angular element ref
   */
  constructor(
    private applicationService: SafeApplicationService,
    private workflowService: SafeWorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private dashboardService: SafeDashboardService,
    private translateService: TranslateService,
    private authService: SafeAuthService,
    private confirmService: SafeConfirmService,
    private refDataService: SafeReferenceDataService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    const rootElement = this.elementRef.nativeElement;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      // Doing this to be able to use custom styles on specific dashboards
      this.renderer.setAttribute(rootElement, 'data-dashboard-id', params.id);
      this.formActive = false;
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
              this.initContext();
              this.updateContextOptions();
              this.canEditName =
                (this.dashboard?.page
                  ? this.dashboard?.page?.canUpdate
                  : this.dashboard?.step?.canUpdate) || false;
              this.dashboardService.openDashboard(this.dashboard);
              this.tiles = data.dashboard.structure
                ? [...data.dashboard.structure]
                : [];
              this.generatedTiles =
                this.tiles.length === 0
                  ? 0
                  : Math.max(...this.tiles.map((x) => x.id)) + 1;
              this.applicationId = this.dashboard.page
                ? this.dashboard.page.application?.id
                : this.dashboard.step
                ? this.dashboard.step.workflow?.page?.application?.id
                : '';
              this.loading = loading;
              this.showFilter = this.dashboard.showFilter;
            } else {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translateService
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

    this.contextId.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.handleContextChange(value);
        }
      });
  }

  /**
   * Leave dashboard
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    localForage.removeItem(this.applicationId + 'contextualFilterPosition'); //remove temporary contextual filter data
    localForage.removeItem(this.applicationId + 'contextualFilter');
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
        title: this.translateService.instant('pages.dashboard.update.exit'),
        content: this.translateService.instant(
          'pages.dashboard.update.exitMessage'
        ),
        confirmText: this.translateService.instant(
          'components.confirmModal.confirm'
        ),
        confirmVariant: 'primary',
      });
      return dialogRef.closed.pipe(takeUntil(this.destroy$)).pipe(
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
   * Add a new widget to the dashboard.
   *
   * @param e add event
   */
  onAdd(e: any): void {
    const tile = JSON.parse(JSON.stringify(e));
    tile.id = this.generatedTiles;
    this.generatedTiles += 1;
    this.tiles = [...this.tiles, tile];
    this.autoSaveChanges();
    // scroll to the element once it is created
    setTimeout(() => {
      const el = document.getElementById(`widget-${tile.id}`);
      el?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /**
   * Edits the settings or display of a widget.
   *
   * @param e widget to save.
   */
  onEditTile(e: any): void {
    // make sure that we save the default layout.
    const index = this.tiles.findIndex((v: any) => v.id === e.id);
    const options = this.tiles[index]?.settings?.defaultLayout
      ? {
          ...e.options,
          defaultLayout: this.tiles[index].settings.defaultLayout,
        }
      : e.options;
    if (options) {
      switch (e.type) {
        case 'display': {
          this.tiles = this.tiles.map((x) => {
            if (x.id === e.id) {
              x = {
                ...x,
                defaultCols: options.cols,
                defaultRows: options.rows,
              };
            }
            return x;
          });
          this.autoSaveChanges();
          break;
        }
        case 'data': {
          this.tiles = this.tiles.map((x) => {
            if (x.id === e.id) {
              x = { ...x, settings: options };
            }
            return x;
          });
          this.autoSaveChanges();
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  /**
   * Remove a widget from the dashboard.
   *
   * @param e delete event
   */
  onDeleteTile(e: any): void {
    this.tiles = this.tiles.filter((x) => x.id !== e.id);
    this.autoSaveChanges();
  }

  /**
   * Drags and drops a widget to move it.
   *
   * @param e move event.
   */
  onMove(e: any): void {
    // Duplicates array, some times the arrays is write protected
    this.tiles = this.tiles.slice();
    [this.tiles[e.oldIndex], this.tiles[e.newIndex]] = [
      this.tiles[e.newIndex],
      this.tiles[e.oldIndex],
    ];
    this.autoSaveChanges();
  }

  /** Save the dashboard changes in the database. */
  private autoSaveChanges(): void {
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: this.id,
          structure: this.tiles,
        },
      })
      .subscribe({
        next: ({ errors }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translateService.instant(
                'common.notifications.objectNotUpdated',
                {
                  type: this.translateService.instant('common.dashboard.one'),
                  error: errors ? errors[0].message : '',
                }
              ),
              { error: true }
            );
          } else {
            this.snackBar.openSnackBar(
              this.translateService.instant(
                'common.notifications.objectUpdated',
                {
                  type: this.translateService.instant('common.dashboard.one'),
                  value: '',
                }
              )
            );
            this.dashboardService.openDashboard({
              ...this.dashboard,
              structure: this.tiles,
            });
          }
        },
        complete: () => (this.loading = false),
      });
  }

  /**
   * Edit the permissions layer.
   *
   * @param e edit event
   */
  saveAccess(e: any): void {
    if (this.router.url.includes('/workflow/')) {
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: this.dashboard?.step?.id,
            permissions: e,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.objectNotUpdated',
                  {
                    type: this.translateService.instant('common.step.one'),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.objectUpdated',
                  {
                    type: this.translateService.instant('common.step.one'),
                    value: '',
                  }
                )
              );
              this.dashboard = {
                ...this.dashboard,
                permissions: data?.editStep.permissions,
              };
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    } else {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: this.dashboard?.page?.id,
            permissions: e,
          },
        })
        .subscribe({
          next: ({ errors, data }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.objectNotUpdated',
                  {
                    type: this.translateService.instant('common.step.one'),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.objectUpdated',
                  {
                    type: this.translateService.instant('common.step.one'),
                    value: '',
                  }
                )
              );
              this.dashboard = {
                ...this.dashboard,
                permissions: data?.editPage.permissions,
              };
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    }
  }

  /**
   * Toggle visibility of form.
   */
  toggleFormActive(): void {
    if (
      this.dashboard?.page
        ? this.dashboard.page.canUpdate
        : this.dashboard?.step?.canUpdate
    ) {
      this.formActive = !this.formActive;
    }
  }
  /**
   * Update the name of the dashboard and the step or page linked to it.
   *
   * @param {string} dashboardName new dashboard name
   */
  saveName(dashboardName: string): void {
    if (dashboardName && dashboardName !== this.dashboard?.name) {
      const callback = () => {
        this.dashboard = { ...this.dashboard, name: dashboardName };
      };
      if (this.router.url.includes('/workflow/')) {
        this.workflowService.updateStepName(
          {
            id: this.dashboard?.step?.id,
            name: dashboardName,
          },
          callback
        );
      } else {
        this.applicationService.updatePageName(
          {
            id: this.dashboard?.page?.id,
            name: dashboardName,
          },
          callback
        );
      }
    }
  }

  /**
   * Toggles the filter for the current dashboard.
   */
  toggleFiltering(): void {
    if (this.dashboard) {
      this.showFilter = !this.showFilter;
      this.apollo
        .mutate<EditDashboardMutationResponse>({
          mutation: EDIT_DASHBOARD,
          variables: {
            id: this.id,
            showFilter: this.showFilter,
          },
        })
        .subscribe({
          next: ({ data, errors }) => {
            if (errors) {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.objectNotUpdated',
                  {
                    type: this.translateService.instant('common.dashboard.one'),
                    error: errors ? errors[0].message : '',
                  }
                ),
                { error: true }
              );
            } else {
              this.snackBar.openSnackBar(
                this.translateService.instant(
                  'common.notifications.objectUpdated',
                  {
                    type: this.translateService.instant('common.dashboard.one'),
                    value: '',
                  }
                )
              );
              this.dashboardService.openDashboard({
                ...this.dashboard,
                showFilter: data?.editDashboard.showFilter,
              });
            }
          },
          complete: () => (this.loading = false),
        });
    }
  }

  /** Display the ShareUrl modal with the route to access the dashboard. */
  public async onShare(): Promise<void> {
    const url = `${window.origin}/share/${this.dashboard?.id}`;
    const { ShareUrlComponent } = await import(
      './components/share-url/share-url.component'
    );
    const dialogRef = this.dialog.open(ShareUrlComponent, {
      data: {
        url,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe();
  }

  /**
   * Duplicate page, in a new ( or same ) application
   *
   * @param event duplication event
   */
  public onDuplicate(event: any): void {
    this.applicationService.duplicatePage(event.id, {
      pageId: this.dashboard?.page?.id,
      stepId: this.dashboard?.step?.id,
    });
  }

  /**
   * Toggle visibility of application menu
   * Get applications
   */
  public onAppSelection(): void {
    this.showAppMenu = !this.showAppMenu;
    const authSubscription = this.authService.user$.subscribe(
      (user: any | null) => {
        if (user) {
          this.applications = user.applications;
        }
      }
    );
    authSubscription.unsubscribe();
  }

  /** Opens modal for context dataset selection */
  public async selectContextDatasource() {
    const currContext =
      (await firstValueFrom(this.dashboardService.dashboard$))?.page?.context ??
      null;

    const { ContextDatasourceComponent } = await import(
      './components/context-datasource/context-datasource.component'
    );
    const dialogRef = this.dialog.open(ContextDatasourceComponent, {
      data: currContext,
    });

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (context: any) => {
        if (context) {
          if (isEqual(context, currContext)) return;

          await this.dashboardService.updateContext(context);
          this.dashboard = {
            ...this.dashboard,
            page: {
              ...this.dashboard?.page,
              context,
            },
          };

          const newSource =
            (currContext as any)?.resource !== (context as any).resource ||
            (currContext as any)?.refData !== (context as any).refData;

          const urlArr = this.router.url.split('/');

          if (
            newSource &&
            this.dashboard?.page?.content &&
            urlArr[urlArr.length - 1] !== this.dashboard.page.content
          ) {
            urlArr[urlArr.length - 1] = this.dashboard.page.content;
            this.router.navigateByUrl(urlArr.join('/'));
          } else this.updateContextOptions();
        }
      });
  }

  /**
   * Update the context options.
   * Loads elements from reference data or records from resource.
   */
  private updateContextOptions() {
    const context = this.dashboard?.page?.context;
    if (!context) return;

    if ('resource' in context) {
      this.recordsQuery =
        this.apollo.watchQuery<ResourceRecordsNodesQueryResponse>({
          query: GET_RESOURCE_RECORDS,
          variables: {
            first: ITEMS_PER_PAGE,
            id: context.resource,
          },
        });
    }

    if ('refData' in context) {
      this.refDataService.loadReferenceData(context.refData).then((refData) => {
        this.refDataValueField = refData.valueField || '';
        this.refDataService.fetchItems(refData).then((items) => {
          this.refDataElements = items;
        });
      });
    }
  }

  /**
   * Handle dashboard context change.
   *
   * @param value id of the element or record
   */
  private async handleContextChange(value: string | number) {
    if (!this.dashboard?.page?.id || !this.dashboard.page.context) return;

    // Check if there is a dashboard with the same context
    const dashboardsWithContext = this.dashboard?.page?.contentWithContext;
    let type: 'record' | 'element';
    if ('resource' in this.dashboard.page.context) {
      // Resource
      type = 'record';
    } else {
      // Ref Data
      type = 'element';
    }
    const dashboardWithContext = dashboardsWithContext?.find((d) => {
      if (type === 'element') return 'element' in d && d.element === value;
      else if (type === 'record') return 'record' in d && d.record === value;
      return false;
    });

    const urlArr = this.router.url.split('/');
    if (dashboardWithContext) {
      urlArr[urlArr.length - 1] = dashboardWithContext.content;
      this.router.navigateByUrl(urlArr.join('/'));
    } else {
      const { data } = await this.dashboardService.createDashboardWithContext(
        this.dashboard?.page?.id,
        type,
        value
      );
      if (!data?.addDashboardWithContext?.id) return;
      urlArr[urlArr.length - 1] = data.addDashboardWithContext.id;
      this.router.navigateByUrl(urlArr.join('/'));
    }
  }

  /** Initializes the dashboard context;  */
  private initContext() {
    if (!this.dashboard?.page?.context || !this.dashboard?.id) return;
    // Checks if the dashboard has context attached to it
    const contentWithContext = this.dashboard?.page?.contentWithContext || [];
    const id = this.dashboard.id;
    const dContext = contentWithContext.find((c) => c.content === id);

    if (!dContext) return;

    // If it has updated the form
    if ('element' in dContext) {
      this.contextId.setValue(dContext.element);
    } else if ('record' in dContext) {
      this.contextId.setValue(dContext.record);

      // Get record by id
      firstValueFrom(
        this.apollo.query<RecordQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: dContext.record,
          },
        })
      ).then(({ data }) => {
        this.contextRecord = data.record;
      });
    }
  }
}
