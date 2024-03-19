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
  ConfirmService,
  ButtonActionT,
  ContextService,
  DashboardQueryResponse,
  Record,
  MapStatusService,
  DashboardExportActionComponent,
  DashboardComponent as SharedDashboardComponent,
  DashboardAutomationService,
} from '@oort-front/shared';
import { TranslateService } from '@ngx-translate/core';
import { filter, first, map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, Subscription, firstValueFrom } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';
import { DOCUMENT } from '@angular/common';
import { cloneDeep, upperCase } from 'lodash';
import { PDFExportComponent } from '@progress/kendo-angular-pdf-export';
import { drawDOM, exportPDF, exportImage } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

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
  implements OnInit, OnDestroy
{
  /** Change step event ( in workflow ) */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();
  /** PDF Export Component View Child */
  @ViewChild(PDFExportComponent) pdfExport!: PDFExportComponent;
  /** PDF Export Div View Child */
  @ViewChild('pdfExport') exporter!: ElementRef;
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
  /** Current dashboard */
  public dashboard?: Dashboard;
  /** Show dashboard filter */
  public showFilter!: boolean;
  /** Current style variant */
  public variant!: string;
  /** hide / show the close icon on the right */
  public closable = true;
  /** Dashboard button actions */
  public buttonActions: ButtonActionT[] = [];
  /** Map Loaded subscription */
  private mapReadyForExportSubscription?: Subscription;
  /** Map Exists State */
  private mapExists = false;
  /** Map Status Subscription */
  private mapStatusSubscription?: Subscription;

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
   * @param mapStatusService Service for managing map ready and export status
   * @param dashboardAutomationService Dashboard automation service
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
    private contextService: ContextService,
    private mapStatusService: MapStatusService,
    private dashboardAutomationService: DashboardAutomationService
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
          this.loadDashboard(id, queryId?.trim()).then(
            () => (this.loading = false)
          );
        }
      });
  }

  /** Sets up the widgets from the dashboard structure */
  private setWidgets() {
    this.widgets = cloneDeep(
      this.dashboard?.structure
        ?.filter((x: any) => x !== null)
        .map((widget: any) => {
          const contextData = this.dashboard?.contextData;
          this.contextService.context =
            { id: this.contextId, ...contextData } || null;
          if (!contextData) {
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

    // Ensures cleanup of the count of map widgets present on the dashboard to 0.
    this.mapStatusService.resetMapCount();
    this.mapExists = false; // MapExists state reset

    const rootElement = this.elementRef.nativeElement;
    // Doing this to be able to use custom styles on specific dashboards
    this.renderer.setAttribute(rootElement, 'data-dashboard-id', id);
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
          contextEl: contextId || null,
        },
      })
    )
      .then(({ data }) => {
        if (data.dashboard) {
          this.id = data.dashboard.id || id;
          this.contextId = contextId ?? undefined;
          this.dashboard = data.dashboard;
          this.initContext();
          this.setWidgets();
          this.buttonActions = this.dashboard.buttons || [];
          this.showFilter = this.dashboard.filter?.show ?? false;
          this.contextService.isFilterEnabled.next(this.showFilter);
          this.contextService.filterPosition.next({
            position: this.dashboard.filter?.position as any,
            dashboardId: this.dashboard.id ?? '',
          });
          this.contextService.setFilter(this.dashboard);
          this.variant = this.dashboard.filter?.variant || 'default';
          this.closable = this.dashboard.filter?.closable ?? false;
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
      data,
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
      exportType: 'image',
    };

    this.mapReadyForExportSubscription?.unsubscribe();

    // Open the DashboardExportActionComponent dialog
    const dialogRef = this.dialog.open(DashboardExportActionComponent, {
      data,
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    // Unsubscribe from map export subscription
    if (this.mapReadyForExportSubscription) {
      this.mapReadyForExportSubscription.unsubscribe();
    }
    // Unsubscribe from map exist status subscription
    this.mapStatusSubscription?.unsubscribe();
    this.mapExists = false;
  }
}
