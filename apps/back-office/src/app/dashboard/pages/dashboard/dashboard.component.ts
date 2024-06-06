import { Apollo, QueryRef } from 'apollo-angular';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  Dashboard,
  ApplicationService,
  WorkflowService,
  DashboardService,
  Application,
  ConfirmService,
  ReferenceDataService,
  Record,
  ButtonActionT,
  ResourceRecordsNodesQueryResponse,
  DashboardQueryResponse,
  EditDashboardMutationResponse,
  DashboardComponent as SharedDashboardComponent,
  DashboardAutomationService,
  DashboardQueryType,
  AddDashboardTemplateMutationResponse,
  DeleteDashboardTemplatesMutationResponse,
} from '@oort-front/shared';
import {
  ADD_DASHBOARD_TEMPLATE,
  DELETE_DASHBOARD_TEMPLATES,
  EDIT_DASHBOARD,
} from './graphql/mutations';
import { GET_DASHBOARD_BY_ID, GET_RESOURCE_RECORDS } from './graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import {
  map,
  takeUntil,
  filter,
  startWith,
  debounceTime,
} from 'rxjs/operators';
import { Observable, firstValueFrom } from 'rxjs';
import { FormControl } from '@angular/forms';
import { cloneDeep, isEqual, omit } from 'lodash';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import localForage from 'localforage';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ContextService, CustomWidgetStyleComponent } from '@oort-front/shared';
import { DOCUMENT } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { GridsterConfig } from 'angular-gridster2';
import { DashboardTemplate } from './components/manage-dashboard-templates/dashboard-template-type';

/** Default number of records fetched per page */
const ITEMS_PER_PAGE = 10;

/**
 * Back-office Dashboard page.
 * Edition of the dashboard ( if user has permission ).
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
  implements OnInit, OnDestroy
{
  /** Change step event ( in workflow ) */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();
  /** Is dashboard in fullscreen mode */
  public isFullScreen = false;
  /** Dashboard id */
  public id = '';
  /** Application id */
  public applicationId?: string;
  /** Is dashboard loading */
  public loading = true;
  /** Current dashboard */
  public dashboard?: Dashboard;
  /** Show dashboard filter */
  public showFilter!: boolean;
  /** User can update dashboard */
  public canUpdate = false;
  /** Dashboard name edition is active */
  public formActive = false;
  /** Show application menu */
  public showAppMenu = false;
  /** List of available applications */
  public applications: Application[] = [];
  /** Contextual reference data elements  */
  public refDataElements: any[] = [];
  /** Contextual records query */
  public recordsQuery!: QueryRef<ResourceRecordsNodesQueryResponse>;
  /** Contextual template id */
  public contextId = new FormControl<string | number | null>(null);
  /** Field of contextual reference data */
  public refDataValueField = '';
  /** Contextual record */
  public contextRecord: Record | null = null;
  /** Configured dashboard quick actions */
  public buttonActions: ButtonActionT[] = [];
  /** Timeout to scroll to newly added widget */
  private addTimeoutListener!: NodeJS.Timeout;
  /** Timeout to load grid options */
  private gridOptionsTimeoutListener!: NodeJS.Timeout;
  /** Is edition active */
  @HostBinding('class.edit-mode-dashboard')
  public editionActive = true;
  /** If we are visualising a new template */
  public templateMode = false;
  /** Additional grid configuration */
  public gridOptions: GridsterConfig = {};

  /** @returns type of context element */
  get contextType() {
    if (this.dashboard?.page?.context) {
      return 'resource' in this.dashboard.page.context ? 'record' : 'element';
    } else {
      return;
    }
  }

  /** @returns is dashboard a step or a page */
  get isStep(): boolean {
    return this.router.url.includes('/workflow/');
  }

  /** @returns main dashboard id */
  get dashboardId(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }

  /** @returns query id to load template */
  get contextEl(): string | null {
    return this.route.snapshot.queryParamMap.get('id');
  }

  /** @returns existing templates */
  get dashboardTemplates(): DashboardTemplate[] | undefined {
    return this.dashboard?.page?.contentWithContext;
  }

  /**
   * Back-office Dashboard page.
   * Edition of the dashboard ( if user has permission ).
   *
   * @param applicationService Shared application service
   * @param workflowService Shared workflow service
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param dashboardService Shared dashboard service
   * @param translate Angular translate service
   * @param confirmService Shared confirm service
   * @param contextService Dashboard context service
   * @param refDataService Shared reference data service
   * @param renderer Angular renderer
   * @param elementRef Angular element ref
   * @param layoutService Shared layout service
   * @param document Document
   * @param clipboard Angular clipboard service
   * @param dashboardAutomationService Dashboard automation service
   */
  constructor(
    private applicationService: ApplicationService,
    private workflowService: WorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private confirmService: ConfirmService,
    private contextService: ContextService,
    private refDataService: ReferenceDataService,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private layoutService: UILayoutService,
    @Inject(DOCUMENT) private document: Document,
    private clipboard: Clipboard,
    private dashboardAutomationService: DashboardAutomationService
  ) {
    super();
    this.dashboardAutomationService.dashboard = this;
  }

  ngOnInit(): void {
    this.contextId.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        // Load template, or go back to default one
        this.contextService.onContextChange(value, this.route, this.dashboard);
      });
    /** Listen to router events navigation end, to get last version of params & queryParams. */
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.router), // initialize
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.loading = true;
        // Reset context
        this.contextRecord = null;
        this.contextId.setValue(null, {
          emitEvent: false,
          emitModelToViewChange: false,
          emitViewToModelChange: false,
        });
        this.contextId.markAsPristine();
        this.contextId.markAsUntouched();
        // Reset scroll when changing page
        const pageContainer = this.document.getElementById('appPageContainer');
        if (pageContainer) {
          pageContainer.scrollTop = 0;
        }
        if (this.dashboardId) {
          this.loadDashboard(
            {
              query: GET_DASHBOARD_BY_ID,
              variables: {
                id: this.dashboardId,
                contextEl: this.contextEl,
              },
            },
            this.dashboardId,
            this.contextEl?.trim()
          );
        }
      });
  }

  /**
   * Sets up the widgets from the dashboard structure
   *
   * @param dashboard Dashboard
   * @param contextID context ID
   */
  private setWidgets(dashboard: Dashboard, contextID?: string | number) {
    this.widgets = cloneDeep(
      dashboard.structure
        ?.filter((x: any) => x !== null)
        .map((widget: any) => {
          const contextData = this.dashboard?.contextData;
          this.contextService.context =
            { id: contextID, ...contextData } || null;
          if (!contextData) {
            return widget;
          }
          const { settings, originalSettings } =
            this.contextService.updateSettingsContextContent(
              widget.settings,
              this.dashboard
            );
          widget.originalSettings = originalSettings;
          widget.settings = settings;
          return widget;
        }) || []
    );
  }

  /**
   * Init the dashboard
   *
   * @param query query to fetch the dashboard
   * @param id Dashboard id
   * @param contextID ID of the param record or element
   * @returns Promise
   */
  private async loadDashboard(
    query: DashboardQueryType,
    id?: string,
    contextID?: string | number
  ) {
    if (!id) {
      return;
    }

    const rootElement = this.elementRef.nativeElement;
    this.renderer.setAttribute(rootElement, 'data-dashboard-id', id);
    this.formActive = false;
    this.loading = true;
    return firstValueFrom(
      this.apollo.query<
        DashboardQueryResponse | AddDashboardTemplateMutationResponse
      >(query)
    )
      .then(({ data }) => {
        const dashboard =
          'dashboard' in data
            ? data.dashboard
            : 'addDashboardTemplate' in data
            ? data.addDashboardTemplate
            : null;
        if (dashboard) {
          this.id = dashboard.id || id;
          this.dashboard = dashboard;
          this.gridOptions = {
            ...omit(this.gridOptions, ['gridType', 'minimumHeight']), // Prevent issue when gridType or minimumHeight was not set
            ...this.dashboard?.gridOptions,
            scrollToNewItems: false,
          };
          this.canUpdate =
            (this.dashboard?.page
              ? this.dashboard?.page?.canUpdate
              : this.dashboard?.step?.canUpdate) || false;
          this.templateMode = !!dashboard.newTemplate;
          this.editionActive = this.canUpdate && !this.templateMode;
          this.initContext();
          this.updateContextOptions();
          this.setWidgets(dashboard, contextID);
          this.dashboardService.widgets.next(this.widgets);
          this.applicationId = this.dashboard.page
            ? this.dashboard.page.application?.id
            : this.dashboard.step
            ? this.dashboard.step.workflow?.page?.application?.id
            : '';
          this.buttonActions = this.dashboard.buttons || [];
          this.showFilter = this.dashboard.filter?.show ?? false;
          this.contextService.isFilterEnabled.next(this.showFilter);
          this.contextService.filterPosition.next({
            position: this.dashboard.filter?.position as any,
            dashboardId: this.dashboard.id ?? '',
          });
          if (this.gridOptionsTimeoutListener) {
            clearTimeout(this.gridOptionsTimeoutListener);
          }
          this.gridOptionsTimeoutListener = setTimeout(() => {
            this.gridOptions = {
              ...this.gridOptions,
              scrollToNewItems: true,
            };
          }, 1000);
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
        this.loading = false;
      })
      .catch((err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/applications']);
      });
  }

  /** Creates the template for the corresponding page */
  public createTemplate() {
    if (this.dashboardId && this.contextEl) {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'models.dashboard.context.notifications.templateCreated'
        )
      );
      this.loadDashboard(
        {
          query: ADD_DASHBOARD_TEMPLATE,
          variables: {
            id: this.dashboardId,
            contextEl: this.contextEl,
          },
        },
        this.dashboardId,
        this.contextEl.trim()
      );
    }
  }

  /**
   * Leave dashboard
   */
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.addTimeoutListener) {
      clearTimeout(this.addTimeoutListener);
    }
    if (this.gridOptionsTimeoutListener) {
      clearTimeout(this.gridOptionsTimeoutListener);
    }
    localForage.removeItem(this.applicationId + 'position'); //remove temporary contextual filter data
    localForage.removeItem(this.applicationId + 'filterStructure');
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
    const widget = cloneDeep(e);
    this.widgets.push(widget);
    if (this.addTimeoutListener) {
      clearTimeout(this.addTimeoutListener);
    }
    // scroll to the element once it is created
    this.addTimeoutListener = setTimeout(() => {
      const widgetComponents =
        this.widgetGridComponent.widgetComponents.toArray();
      const target = widgetComponents[widgetComponents.length - 1];
      const el = this.document.getElementById(target.id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  }

  /**
   * Edits the settings or display of a widget.
   *
   * @param e widget to save.
   */
  onEditTile(e: any): void {
    switch (e.type) {
      case 'display': {
        this.autoSaveChanges();
        break;
      }
      case 'data': {
        // Find the widget to be edited
        const widgetComponents =
          this.widgetGridComponent.widgetComponents.toArray();
        const index = widgetComponents.findIndex((v: any) => v.id === e.id);
        if (index > -1) {
          const { settings, originalSettings } =
            this.contextService.updateSettingsContextContent(
              this.widgets[index]?.settings?.defaultLayout
                ? {
                    ...e.options,
                    defaultLayout: this.widgets[index].settings.defaultLayout,
                  }
                : e.options,
              this.dashboard
            );
          if (settings) {
            // Save configuration
            this.widgets[index] = {
              ...this.widgets[index],
              settings: settings,
              ...(originalSettings && { originalSettings }),
            };
            this.autoSaveChanges();
          }
        }

        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Remove a widget from the dashboard.
   *
   * @param e delete event
   */
  onDeleteTile(e: any): void {
    const widgetComponents =
      this.widgetGridComponent.widgetComponents.toArray();
    const targetIndex = widgetComponents.findIndex((x) => x.id === e.id);
    if (targetIndex > -1) {
      this.widgets.splice(targetIndex, 1);
      this.autoSaveChanges();
    }
  }

  /**
   * Style a widget from the dashboard.
   *
   * @param e style event
   */
  onStyleTile(e: any): void {
    this.layoutService.setRightSidenav({
      component: CustomWidgetStyleComponent,
      inputs: {
        widgetComp: e,
        save: (tile: any) => this.onEditTile(tile),
      },
    });
    this.layoutService.closeRightSidenav = true;
  }

  /** Save the dashboard changes in the database. */
  private autoSaveChanges(): void {
    let widgets = this.widgets;
    // If context data exists we have to clean up widget setting original settings
    // Which do not have the {{context}} replaced, and delete duplicated original settings property as it's not needed in the DB
    if (this.dashboard?.contextData) {
      widgets = [];
      this.widgets.forEach((widget) => {
        const contextContentCleanWidget = {
          ...widget,
          settings: widget.originalSettings
            ? widget.originalSettings
            : widget.settings,
        };
        delete contextContentCleanWidget.originalSettings;
        widgets.push(contextContentCleanWidget);
      });
    }
    this.apollo
      .mutate<EditDashboardMutationResponse>({
        mutation: EDIT_DASHBOARD,
        variables: {
          id: this.id,
          structure: widgets,
        },
      })
      .subscribe({
        next: ({ errors }) => {
          this.applicationService.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.dashboard.one')
          );
          if (!errors) {
            this.dashboardService.widgets.next(this.widgets);
          }
        },
        complete: () => (this.loading = false),
      });
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
      if (this.contextId.value) {
        // Seeing a template
        this.dashboardService.editName(
          this.dashboard?.id,
          dashboardName,
          callback
        );
      } else {
        // Not part of contextual page
        if (this.isStep) {
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
  }

  /** Display the ShareUrl modal with the route to access the dashboard. */
  public async onShare(): Promise<void> {
    const url = `${window.origin}/share/${this.dashboard?.id}`;
    this.clipboard.copy(url);
    this.snackBar.openSnackBar(
      this.translate.instant('common.notifications.copiedToClipboard')
    );
  }

  /** Opens modal to modify button actions */
  public async onEditButtonActions() {
    const { EditButtonActionsModalComponent } = await import(
      './components/edit-button-actions-modal/edit-button-actions-modal.component'
    );
    const dialogRef = this.dialog.open<ButtonActionT[] | undefined>(
      EditButtonActionsModalComponent,
      {
        data: { buttonActions: this.buttonActions },
        disableClose: true,
      }
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (buttons) => {
        if (!buttons) return;

        this.dashboardService
          .saveDashboardButtons(this.dashboard?.id, buttons)
          ?.pipe(takeUntil(this.destroy$))
          .subscribe(({ errors }) => {
            this.buttonActions = buttons;
            this.applicationService.handleEditionMutationResponse(
              errors,
              this.translate.instant('common.dashboard.one')
            );
          });
      });
  }

  /** Opens modal to delete existing templates */
  public async onManageTemplates() {
    const { ManageDashboardTemplatesComponent } = await import(
      './components/manage-dashboard-templates/manage-dashboard-templates.component'
    );
    const dialogRef = this.dialog.open<DashboardTemplate[] | undefined>(
      ManageDashboardTemplatesComponent,
      {
        data: { dashboardTemplates: this.dashboardTemplates },
        disableClose: true,
      }
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (templates) => {
        if (!templates) return;
        const templatesToDelete = this.dashboardTemplates
          ?.map((template) => template.content)
          ?.filter(
            (dashboard) =>
              !templates.map((template) => template.content).includes(dashboard)
          );
        firstValueFrom(
          this.apollo.mutate<DeleteDashboardTemplatesMutationResponse>({
            mutation: DELETE_DASHBOARD_TEMPLATES,
            variables: {
              dashboardId: this.dashboardId,
              templateIds: templatesToDelete,
            },
          })
        ).then((data) => {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'models.dashboard.context.notifications.templatesDeleted',
              { number: data.data?.deleteDashboardTemplates }
            )
          );
          if (this.dashboardId) {
            // Reload your dashboard here
            this.loadDashboard(
              {
                query: GET_DASHBOARD_BY_ID,
                variables: {
                  id: this.dashboardId,
                  contextEl: this.contextEl,
                },
              },
              this.dashboardId,
              this.contextEl?.trim()
            );
          }
        });
      });
  }

  /** Opens modal for context dataset selection */
  public async selectContextDatasource() {
    const currContext = this.dashboard?.page?.context ?? null;

    const { ContextDatasourceComponent } = await import(
      './components/context-datasource/context-datasource.component'
    );
    const dialogRef = this.dialog.open(ContextDatasourceComponent, {
      data: currContext,
    });

    const parentDashboardId = this.route.snapshot.paramMap.get('id');

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (context: any) => {
        if (context) {
          if (isEqual(context, currContext)) return;

          this.dashboardService
            .updateContext(this.dashboard?.page?.id, context)
            ?.then(({ data }) => {
              if (data) {
                this.dashboard = {
                  ...this.dashboard,
                  page: {
                    ...this.dashboard?.page,
                    context,
                    contentWithContext: data.editPageContext.contentWithContext,
                  },
                };
              }
            });

          const urlArr = this.router.url.split('/');

          // load the linked data
          this.updateContextOptions();
          // go the the parent dashboard
          urlArr[urlArr.length - 1] = `${parentDashboardId}`;
          this.router.navigateByUrl(urlArr.join('/'));
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
        this.refDataService.fetchItems(refData).then(({ items }) => {
          this.refDataElements = items;
        });
      });
    }
  }

  /** Initializes the dashboard context */
  private initContext(): void {
    const callback = (contextItem: {
      element?: string;
      record?: string;
      recordData?: Record;
    }) => {
      if ('element' in contextItem) {
        this.contextId.setValue(contextItem.element as string, {
          emitEvent: false,
        });
      } else {
        this.contextRecord = contextItem.recordData as Record;
        this.contextId.setValue(contextItem.record as string, {
          emitEvent: false,
        });
      }
    };
    this.contextService.initContext(
      this.dashboard as Dashboard,
      callback,
      this.contextEl
    );
  }

  /**
   * Reorders button actions.
   *
   * @param event Drop event
   */
  public onButtonActionDrop(event: CdkDragDrop<typeof this.buttonActions>) {
    if (event.previousIndex === event.currentIndex) return;

    moveItemInArray(
      this.buttonActions,
      event.previousIndex,
      event.currentIndex
    );

    this.dashboardService
      .saveDashboardButtons(this.dashboard?.id, this.buttonActions)
      ?.subscribe(() => {
        this.dashboard = {
          ...this.dashboard,
          buttons: this.buttonActions,
        };
      });
  }

  /**
   * Open settings modal.
   */
  public async onOpenSettings(): Promise<void> {
    const { ViewSettingsModalComponent } = await import(
      '../../../components/view-settings-modal/view-settings-modal.component'
    );
    const dialogRef = this.dialog.open(ViewSettingsModalComponent, {
      data: {
        type: this.isStep ? 'step' : 'page',
        applicationId: this.applicationId,
        page: this.isStep ? undefined : this.dashboard?.page,
        step: this.isStep ? this.dashboard?.step : undefined,
        visible: this.dashboard?.page?.visible,
        icon: this.isStep
          ? this.dashboard?.step?.icon
          : this.dashboard?.page?.icon,
        accessData: {
          access: this.dashboard?.permissions,
          application: this.applicationId,
          objectTypeName: this.translate.instant(
            'common.' + this.isStep ? 'step' : 'page' + '.one'
          ),
        },
        canUpdate: this.dashboard?.page
          ? this.dashboard?.page.canUpdate
          : this.dashboard?.step
          ? this.dashboard?.step.canUpdate
          : false,
        dashboard: this.dashboard,
      },
    });
    // Subscribes to settings updates
    const subscription = dialogRef.componentInstance?.onUpdate
      .pipe(takeUntil(this.destroy$))
      .subscribe((updates: any) => {
        if (updates) {
          if (this.isStep) {
            this.dashboard = {
              ...this.dashboard,
              ...(updates.permissions && updates),
              ...(updates.gridOptions && updates),
              ...(updates.filter && updates),
              step: {
                ...this.dashboard?.step,
                ...(!updates.permissions && !updates.filter && updates),
              },
            };
          } else {
            this.dashboard = {
              ...this.dashboard,
              ...(updates.permissions && updates),
              ...(updates.gridOptions && updates),
              ...(updates.filter && updates),
              page: {
                ...this.dashboard?.page,
                ...(!updates.permissions && !updates.filter && updates),
              },
            };
          }
          this.gridOptions = {
            ...this.gridOptions,
            ...this.dashboard?.gridOptions,
          };

          if (updates.filter) {
            this.showFilter = updates.filter.show;
            this.contextService.isFilterEnabled.next(this.showFilter);
          }
        }
      });
    // Unsubscribe to dialog onUpdate event
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe(() => {
      subscription?.unsubscribe();
    });
  }

  /**
   * Update query based on text search.
   *
   * @param search Search text from the graphql select
   */
  public onSearchChange(search: string): void {
    const context = this.dashboard?.page?.context;
    if (!context) return;
    if ('resource' in context) {
      this.recordsQuery.refetch({
        variables: {
          first: ITEMS_PER_PAGE,
          id: context.resource,
        },
        filter: {
          logic: 'and',
          filters: [
            {
              field: context.displayField,
              operator: 'contains',
              value: search,
            },
          ],
        },
      });
    }
  }
}
