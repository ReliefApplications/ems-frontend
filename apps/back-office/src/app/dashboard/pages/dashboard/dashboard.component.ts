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
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  Dashboard,
  ApplicationService,
  WorkflowService,
  DashboardService,
  Application,
  UnsubscribeComponent,
  WidgetGridComponent,
  ConfirmService,
  ReferenceDataService,
  Record,
  ButtonActionT,
  ResourceRecordsNodesQueryResponse,
  DashboardQueryResponse,
  EditDashboardMutationResponse,
} from '@oort-front/shared';
import { EDIT_DASHBOARD } from './graphql/mutations';
import { GET_DASHBOARD_BY_ID, GET_RESOURCE_RECORDS } from './graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import {
  map,
  takeUntil,
  filter,
  startWith,
  debounceTime,
} from 'rxjs/operators';
import { Observable, Subscription, firstValueFrom, first } from 'rxjs';
import { FormControl } from '@angular/forms';
import { cloneDeep, isEqual, upperCase, omit } from 'lodash';
import { Dialog } from '@angular/cdk/dialog';
import { DashboardExportActionComponent } from './components/dashboard-export-action/dashboard-export-action.component';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import localForage from 'localforage';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ContextService,
  MapStatusService,
  CustomWidgetStyleComponent,
} from '@oort-front/shared';
import { DOCUMENT } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';
import { GridsterConfig } from 'angular-gridster2';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { drawDOM, exportPDF, exportImage } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

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
  /** PDF Export Component View Child */
  @ViewChild(PDFExportComponent) pdfExport!: PDFExportComponent;
  /** PDF Export Div View Child */
  @ViewChild('pdfExport') exporter!: ElementRef;
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
  /** Additional grid configuration */
  public gridOptions: GridsterConfig = {};
  /** Map Loaded subscription */
  private mapReadyForExportSubscription?: Subscription;
  /** Map Exists State */
  private mapExists = false;
  /** Map Status Subscription */
  private mapStatusSubscription?: Subscription;

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
   * @param mapStatusService Service for managing map ready and export status
   * @param layoutService Shared layout service
   * @param document Document
   * @param clipboard Angular clipboard service
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
    private mapStatusService: MapStatusService,
    private layoutService: UILayoutService,
    @Inject(DOCUMENT) private document: Document,
    private clipboard: Clipboard
  ) {
    super();
  }

  ngOnInit(): void {
    this.mapExists = false;
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

        /** Extract main dashboard id */
        const id = this.route.snapshot.paramMap.get('id');
        /** Extract query id to load template */
        const queryId = this.route.snapshot.queryParamMap.get('id');
        if (id) {
          this.loadDashboard(id, queryId?.trim()).then(
            () => (this.loading = false)
          );
        }
      });
  }

  /**
   * Init the dashboard
   *
   * @param id Dashboard id
   * @param contextID ID of the param record or element
   * @returns Promise
   */
  private async loadDashboard(id: string, contextID?: string | number) {
    // don't init the dashboard if the id is the same
    if (this.dashboard?.id === id && this.contextId.value === contextID) {
      return;
    }

    // Ensures cleanup of the count of map widgets present on the dashboard to 0.
    this.mapStatusService.resetMapCount();
    this.mapExists = false; // MapExists state reset

    const rootElement = this.elementRef.nativeElement;
    this.renderer.setAttribute(rootElement, 'data-dashboard-id', id);
    this.formActive = false;
    this.loading = true;

    // Returns true if a map exists in the dashboard
    this.mapStatusSubscription = this.mapStatusService.mapStatus$
      .pipe(takeUntil(this.destroy$))
      .subscribe((status: any) => {
        if (status) {
          console.log(status);
          this.mapExists = status;
        }
      });

    return firstValueFrom(
      this.apollo.query<DashboardQueryResponse>({
        query: GET_DASHBOARD_BY_ID,
        variables: {
          id,
          contextEl: contextID ?? null,
        },
      })
    )
      .then(({ data }) => {
        if (data.dashboard) {
          this.id = data.dashboard.id || id;
          this.dashboard = data.dashboard;
          this.gridOptions = {
            ...omit(this.gridOptions, ['gridType', 'minimumHeight']), // Prevent issue when gridType or minimumHeight was not set
            ...this.dashboard?.gridOptions,
            scrollToNewItems: false,
          };
          this.canUpdate =
            (this.dashboard?.page
              ? this.dashboard?.page?.canUpdate
              : this.dashboard?.step?.canUpdate) || false;
          this.editionActive = this.canUpdate;
          this.initContext();
          this.updateContextOptions();
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
                    widget.settings,
                    this.dashboard
                  );
                widget.originalSettings = originalSettings;
                widget.settings = settings;
                return widget;
              }) || []
          );
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
      })
      .catch((err) => {
        this.snackBar.openSnackBar(err.message, { error: true });
        this.router.navigate(['/applications']);
      });
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

    // Unsubscribe from map export subscription
    if (this.mapReadyForExportSubscription) {
      this.mapReadyForExportSubscription.unsubscribe();
    }
    // Unsubscribe from map exist status subscription
    this.mapStatusSubscription?.unsubscribe();
    this.mapExists = false;
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

  /** Open modal to add new button action */
  public async onAddButtonAction() {
    const { EditButtonActionComponent } = await import(
      './components/edit-button-action/edit-button-action.component'
    );
    const dialogRef = this.dialog.open<ButtonActionT | undefined>(
      EditButtonActionComponent
    );

    dialogRef.closed
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (button) => {
        if (!button) return;
        const currButtons = this.dashboard?.buttons || [];

        this.dashboardService
          .saveDashboardButtons(this.dashboard?.id, [...currButtons, button])
          ?.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.buttonActions.push(button);
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
    this.contextService.initContext(this.dashboard as Dashboard, callback);
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
   * This method generates a PDF with the user input provided parameters.
   *
   * @param includeHeaderFooter Whether to include headers and footers in the PDF.
   * @param pdfSize The size of the PDF to be generated.
   * @returns {Promise<string>} A promise that resolves to a string representing the PDF data.
   */
  public async pdfDrawer(
    includeHeaderFooter: boolean,
    pdfSize: string
  ): Promise<string> {
    if (includeHeaderFooter) {
      this.addHeaderAndFooter();
    }

    const drawing = await drawDOM(this.exporter.nativeElement, {
      paperSize: pdfSize,
    });
    const pdfData = await exportPDF(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter();
    }
    this.mapStatusService.updateExportingStatus(false);
    return pdfData;
  }

  /**
   * Saves the dashboard as a PDF file.
   */
  public async pdfExporter(): Promise<void> {
    const data = {
      exportType: 'pdf',
    };

    if (this.mapReadyForExportSubscription) {
      this.mapReadyForExportSubscription.unsubscribe();
    }

    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data: { data },
    });

    // Handle the dialog result
    dialogRef.closed.subscribe(async (result) => {
      if (result !== true && result !== undefined) {
        const resultValue = result as {
          includeHeaderFooter: boolean;
          paperSize: string;
        };
        // Sends export = true to map component when kendo export starts
        this.mapStatusService.updateExportingStatus(true);
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.export.loading', {
            type: 'PDF',
          })
        );

        if (this.mapExists) {
          this.mapStatusService.mapReadyForExport$
            .pipe(
              filter((ready) => ready === true), // Waits until map is ready
              first()
            )
            .subscribe(async () => {
              // Sets 0.5 second timeout to ensure the map layer is fully loaded
              setTimeout(async () => {
                const pdfData = await this.pdfDrawer(
                  resultValue.includeHeaderFooter,
                  resultValue.paperSize
                );
                saveAs(pdfData, `${this.dashboard?.name}.pdf`);
                this.mapStatusService.clearLoadedMaps();
              }, 500);
            });
        } else {
          // If no map exists, proceed as normal
          const pdfData = await this.pdfDrawer(
            resultValue.includeHeaderFooter,
            resultValue.paperSize
          );
          saveAs(pdfData, `${this.dashboard?.name}.pdf`);
          this.mapStatusService.clearLoadedMaps();
        }
        setTimeout(async () => {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.export.pdf')
          );
        }, 500);
      }
    });
  }

  /**
   * Adds header and footer to the top and bottom of a
   * PDF and Image export.
   */
  private addHeaderAndFooter(): void {
    // Create header and footer elements
    const header = this.document.createElement('div');
    const footer = this.document.createElement('div');

    // Add date and time to header
    const dateTime = new Date();
    const dateTimeText =
      dateTime.toLocaleDateString() + ' ' + dateTime.toLocaleTimeString();
    const pageTitle = this.dashboard?.name;
    header.innerHTML = `<span class="float-left">${dateTimeText}</span><span class="block text-center">${pageTitle}</span>`;

    // Add URL to footer
    const url = window.location.href;
    footer.innerHTML = `<span class="text-center">${url}</span>`;

    // Append header and footer to the dashboard
    this.exporter.nativeElement.prepend(header);
    this.exporter.nativeElement.append(footer);
  }

  /**
   * Removes header and footer from pdf and image export.
   */
  private removeHeaderAndFooter(): void {
    const header = this.exporter.nativeElement.firstChild;
    const footer = this.exporter.nativeElement.lastChild;
    this.exporter.nativeElement.removeChild(header);
    this.exporter.nativeElement.removeChild(footer);
  }

  /**
   * This function draws a PNG image from the current state of the dashboard.
   *
   * @param includeHeaderFooter Whether to include a header and footer in the image.
   * @returns {Promise<string>} A promise that resolves to a string representing the PNG data.
   */
  public async pngDrawer(includeHeaderFooter: boolean): Promise<string> {
    if (includeHeaderFooter) {
      this.addHeaderAndFooter();
    }
    const background = this.exporter.nativeElement.style.color;
    this.exporter.nativeElement.style.background = '#fff';
    const drawing = await drawDOM(this.exporter.nativeElement, {
      margin: { top: 10, left: 10, right: 10, bottom: 10 },
    });
    this.exporter.nativeElement.style.background = background;
    const pngData = await exportImage(drawing);
    if (includeHeaderFooter) {
      this.removeHeaderAndFooter();
    }
    this.mapStatusService.updateExportingStatus(false);
    return pngData;
  }

  /**
   * Exports the dashboard to PNG
   *
   */
  public async pngExporter(): Promise<void> {
    let format: 'png' | 'jpeg';
    let includeHeaderFooter: boolean;
    const data = {
      exportType: 'png',
    };

    this.mapReadyForExportSubscription?.unsubscribe();

    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data: { data },
    });

    // Sets the user input values from dialog box
    dialogRef.closed.subscribe(async (result) => {
      if (result !== true && result !== undefined) {
        const resultValue = result as {
          format: 'png' | 'jpeg';
          includeHeaderFooter: boolean;
        };

        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.export.loading', {
            type: upperCase(resultValue.format),
          })
        );

        // Sets exporting status to true
        this.mapStatusService.updateExportingStatus(true);

        if (this.mapExists) {
          this.mapStatusService.mapReadyForExport$
            .pipe(
              filter((ready) => ready === true), // Waits until map is ready
              first()
            )
            .subscribe(async () => {
              // Sets 0.5 second timeout to ensure the map layer is fully loaded
              setTimeout(async () => {
                format = resultValue.format;
                includeHeaderFooter = resultValue.includeHeaderFooter;

                // Draws the Dashboard in its current state
                const pngData = await this.pngDrawer(includeHeaderFooter);
                saveAs(pngData, `${this.dashboard?.name}.${format}`);
                this.mapStatusService.clearLoadedMaps();
              }, 500);
            });
        } else {
          format = resultValue.format;
          includeHeaderFooter = resultValue.includeHeaderFooter;
          const pngData = await this.pngDrawer(includeHeaderFooter);
          saveAs(pngData, `${this.dashboard?.name}.${format}`);
          this.mapStatusService.clearLoadedMaps();
        }
        setTimeout(async () => {
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.export.image', {
              image: upperCase(resultValue.format),
            })
          );
        }, 1000);
      }
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
