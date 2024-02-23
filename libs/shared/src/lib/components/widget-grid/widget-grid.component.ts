import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { WIDGET_TYPES } from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { WidgetComponent } from '../widget/widget.component';
import { Subject, Subscription, debounceTime, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import {
  CompactType,
  DisplayGrid,
  GridType,
  GridsterComponentInterface,
  GridsterConfig,
  GridsterItem,
} from 'angular-gridster2';
import { cloneDeep } from 'lodash';
import { ResizeObservable } from '../../utils/rxjs/resize-observable.util';
import { ContextService } from '../../services/context/context.service';

/** Maximum height of the widget in row units when loading grid */
const MAX_ROW_SPAN_LOADING = 4;

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/**
 * Component definition for grid widgets
 */
@Component({
  selector: 'shared-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss'],
})
export class WidgetGridComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges, OnDestroy
{
  /** Available widgets */
  public availableWidgets: any[] = WIDGET_TYPES;
  /** Loading status */
  @Input() loading = false;
  /** Widgets */
  @Input() widgets: any[] = [];
  /** Update permission */
  @Input() canUpdate = false;
  /** If can hide widgets with no data that allows this */
  @Input() canHide = false;
  /** Additional grid configuration */
  @Input() options?: GridsterConfig;
  /** Delete event emitter */
  @Output() delete: EventEmitter<any> = new EventEmitter();
  /** Edit event emitter */
  @Output() edit: EventEmitter<any> = new EventEmitter();
  /** Add event emitter */
  @Output() add: EventEmitter<any> = new EventEmitter();
  /** Style event emitter */
  @Output() style: EventEmitter<any> = new EventEmitter();
  /** Change step event emitter */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();
  /** Widget components view children */
  @ViewChildren(WidgetComponent)
  widgetComponents!: QueryList<WidgetComponent>;
  /** Expanded widget dialog ref, to be closed when navigating */
  public expandWidgetDialogRef!: DialogRef<
    unknown,
    ExpandedWidgetComponent
  > | null;
  /** Number of columns */
  public colsNumber = MAX_COL_SPAN;
  /** Skeletons for loading */
  public skeletons: GridsterItem[] = [];
  /** Gridster options */
  public gridOptions!: GridsterConfig;
  /** Detect structure changes */
  public structureChanges = new Subject<boolean>();
  /** Visible widgets */
  public visibleWidgets: any[] = [];
  /** Set grid options timeout, to enable events that can save dashboard */
  private gridOptionsTimeoutListener!: NodeJS.Timeout;
  /** Subscribe to structure changes */
  private changesSubscription?: Subscription;
  /** Determines whether we need to use a minimum height */
  public isMinHeightEnabled?: boolean;
  /** Timeout listener */
  private setFullscreenTimeoutListener!: NodeJS.Timeout;

  /**
   * Indicate if the widget grid can be deactivated or not.
   *
   * @returns indicate if one of the widget children cannot be deactivated.
   */
  get canDeactivate() {
    return !this.widgetComponents.some((x) => !x.canDeactivate);
  }

  /** @returns maximum number of columns of widgets in the grid */
  get maxCols(): number {
    const cols = this.visibleWidgets.map((x) => x.cols);
    return Math.max(...cols);
  }

  /**
   * Constructor of the grid widget component
   *
   * @param dialog The Dialog service
   * @param dashboardService Shared dashboard service
   * @param _host host element ref
   * @param contextService Shared context service
   */
  constructor(
    public dialog: Dialog,
    private dashboardService: DashboardService,
    private _host: ElementRef,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sortWidgets();
    this.availableWidgets = this.dashboardService.availableWidgets;
    this.skeletons = this.getSkeletons();
    this.setLayout();
    new ResizeObservable(this._host.nativeElement)
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        this.colsNumber = this.setColsNumber(
          this._host.nativeElement.innerWidth
        );
        this.setGridOptions();
      });
    this.setGridOptions();

    // Initialize and listen grid size changes to determine whether the minimum height should be used
    this.gridOptions.gridSizeChangedCallback = (grid) =>
      this.enableMinHeight(grid);
    this.enableMinHeight();

    this.dashboardService.widgetContentRefreshed$
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => {
        // sending 'false' to prevent triggering this function infinitely due to cloning
        this.setVisibleWidgets(false);
      });
    // Listen to dashboard filters changes if it is necessary
    // So when hiding empty widgets, we can re-display them on filter change
    this.contextService.filter$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(({ previous, current }) => {
        if (this.canHide) {
          const hideWidgetWithFilters = this.widgets.filter(
            (widget: any) =>
              widget.settings.widgetDisplay.hideEmpty &&
              widget.settings.widgetDisplay.isEmpty &&
              (this.contextService.filterRegex.test(
                widget.settings.contextFilters
              ) ||
                this.contextService.filterRegex.test(
                  widget.settings.referenceDataVariableMapping
                ))
          );
          let refreshVisibleWidgets = false;
          hideWidgetWithFilters.forEach((widget: any) => {
            if (
              this.contextService.shouldRefresh(
                widget.settings,
                previous,
                current
              )
            ) {
              widget.settings.widgetDisplay.isEmpty = false;
              refreshVisibleWidgets = true;
            }
          });
          if (refreshVisibleWidgets) {
            this.setVisibleWidgets();
          }
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever the canUpdate changes and is set to true, then we should update grid options to listen to item changes
    if (changes['widgets']) {
      this.setLayout();
    }
    if (changes['options']) {
      this.setGridOptions();
    }
    if (
      changes['canUpdate'] &&
      Boolean(changes['canUpdate'].previousValue) !==
        Boolean(changes['canUpdate'].currentValue)
    ) {
      this.setLayout();
      if (this.gridOptionsTimeoutListener) {
        clearTimeout(this.gridOptionsTimeoutListener);
      }
      this.gridOptionsTimeoutListener = setTimeout(() => {
        this.setGridOptions(true);
      }, 0);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.gridOptionsTimeoutListener) {
      clearTimeout(this.gridOptionsTimeoutListener);
    }
    if (this.setFullscreenTimeoutListener) {
      clearTimeout(this.setFullscreenTimeoutListener);
    }
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
  }

  /**
   * Changes the number of displayed columns.
   *
   * @param width width of the screen.
   * @returns new number of cols.
   */
  private setColsNumber(width: number): number {
    if (width <= 480) {
      return 1;
    }
    if (width <= 600) {
      return 2;
    }
    if (width <= 800) {
      return 4;
    }
    if (width <= 1024) {
      return 6;
    }
    return MAX_COL_SPAN;
  }

  /**
   * Enables the min height parameter
   *
   * @param grid gridster component
   */
  private enableMinHeight(grid: GridsterComponentInterface | null = null) {
    this.isMinHeightEnabled =
      this.gridOptions.gridType === GridType.Fit && !grid?.mobile;
  }

  /**
   * Set Gridster options.
   *
   *  @param isDashboardSet Property to add item change callback handler once the dashboard is ready and editable
   */
  setGridOptions(isDashboardSet = false) {
    this.gridOptions = {
      ...this.gridOptions,
      ...(isDashboardSet && {
        itemChangeCallback: () => this.structureChanges.next(true),
      }),
      scrollToNewItems: false,
      gridType: GridType.VerticalFixed,
      compactType: CompactType.CompactLeftAndUp,
      displayGrid: DisplayGrid.OnDragAndResize,
      margin: 10,
      outerMargin: false,
      minItemCols: 1, // min item number of columns
      minItemRows: 1, // min item number of rows
      minCols: this.colsNumber,
      fixedRowHeight: 200,
      minimumHeight: 0,
      draggable: {
        enabled: this.canUpdate,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: true,
        dragHandleClass: 'drag-handler',
      },
      resizable: {
        enabled: this.canUpdate,
      },
      pushItems: true,
      swap: true,
      swapWhileDragging: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      disableScrollHorizontal: true,
      setGridSize: true,
      mobileBreakpoint: 640,
      disableWindowResize: true,
      keepFixedHeightInMobile: true,
      ...this.options,
    };

    // Set maxCols at the end, based on widgets & existing max
    this.gridOptions.maxCols = Math.max(
      this.maxCols,
      (this.gridOptions.maxCols || this.gridOptions.minCols) as number
    );
  }

  /**
   * Emits edition event.
   *
   * @param e widget to edit.
   */
  onEditWidget(e: any): void {
    this.edit.emit(e);
  }

  /**
   * Emits delete event.
   *
   * @param e widget to delete.
   */
  onDeleteWidget(e: any): void {
    this.delete.emit(e);
  }

  /**
   * Emits style event.
   *
   * @param e widget to style.
   */
  onStyleWidget(e: any): void {
    this.style.emit({
      id: e.id,
      widget: e.widget,
    });
  }

  /**
   * Expands widget in a full size screen popup.
   *
   * @param e widget to open.
   */
  async onExpandWidget(e: any): Promise<void> {
    const target = this.widgetComponents.find((x) => x.id === e.id);
    if (target) {
      target.fullscreen = true;
      const { ExpandedWidgetComponent } = await import(
        './expanded-widget/expanded-widget.component'
      );
      this.expandWidgetDialogRef = this.dialog.open(ExpandedWidgetComponent, {
        data: {
          element: target?.elementRef,
        },
        autoFocus: false,
      });
      // Destroy dialog ref after closed to show the widget header actions again
      this.expandWidgetDialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // sync with the dashboard content
          if (this.setFullscreenTimeoutListener) {
            clearTimeout(this.setFullscreenTimeoutListener);
          }
          this.setFullscreenTimeoutListener = setTimeout(() => {
            target.fullscreen = false;
            this.expandWidgetDialogRef = null;
          });
        });
    }
  }

  /**
   * Emits current change step and close the expand widget dialog if triggered from there
   *
   * @param event Step emitted by child grid widget component
   */
  triggerChangeStepAction(event: number) {
    this.changeStep.emit(event);
    if (this.expandWidgetDialogRef) {
      this.expandWidgetDialogRef?.close();
    }
  }

  /**
   * Open settings component for widget edition.
   * Emits addition event if edition should be saved.
   *
   * @param e new widget.
   */
  async onAdd(e: any): Promise<void> {
    if (e) {
      const widget = cloneDeep(e);
      if (widget) {
        /** Open settings dialog component from the widget.  */
        const { EditWidgetModalComponent } = await import(
          './edit-widget-modal/edit-widget-modal.component'
        );
        const dialogRef = this.dialog.open(EditWidgetModalComponent, {
          disableClose: true,
          data: {
            widget,
            template: this.dashboardService.findSettingsTemplate(widget),
          },
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => {
            // Should save the value, and so, add the widget to the grid
            if (value) {
              this.add.emit({
                ...widget,
                settings: value,
                ...{
                  resizeEnabled: this.canUpdate,
                  dragEnabled: this.canUpdate,
                },
              });
            }
          });
      }
    }
  }

  /**
   * Generates a list of skeletons, for loading.
   *
   * @returns List of skeletons.
   */
  private getSkeletons(): GridsterItem[] {
    const skeletons = [];
    let remainingColsNumber = this.colsNumber;
    for (let i = 0; i < 10; i++) {
      const colSpan = Math.floor(Math.random() * remainingColsNumber) + 1;
      remainingColsNumber -= colSpan;
      if (remainingColsNumber === 0) {
        remainingColsNumber = this.colsNumber;
      }
      skeletons.push({
        cols: colSpan,
        rows: Math.floor(Math.random() * MAX_ROW_SPAN_LOADING) + 1,
      });
    }
    const yAxis = 0;
    const xAxis = 0;
    return skeletons.map((skeleton, index) => {
      const { x, y } =
        index === 0
          ? { x: 0, y: 0 }
          : this.setXYAxisValues(yAxis, xAxis, skeleton);
      return {
        cols: skeleton.cols,
        rows: skeleton.rows,
        resizeEnabled: false,
        dragEnabled: false,
        x,
        y,
      };
    });
  }

  /**
   * Set the given widget in the grid using given source coordinates
   *
   * @param {number} yAxis y axis point from where start
   * @param {number} xAxis x axis point from where start
   * @param widget widget to set in the grid
   * @returns new coordinates from where to set the given widget in the grid
   */
  private setXYAxisValues(
    yAxis: number,
    xAxis: number,
    widget: any
  ): { x: number; y: number } {
    // Update with the last values of the grid item pointer
    xAxis += widget.cols ?? widget.defaultCols;
    if (xAxis > 8) {
      yAxis += widget.rows ?? widget.defaultRows;
    }

    if (xAxis + (widget.cols ?? widget.defaultCols) > 8) {
      xAxis = 0;
      yAxis += widget.rows ?? widget.defaultRows;
    }
    return { x: xAxis, y: yAxis };
  }

  /**
   * Updates layout based on the passed widget array.
   */
  private setLayout(): void {
    if (this.changesSubscription) {
      this.changesSubscription.unsubscribe();
    }
    this.visibleWidgets.forEach((widget: GridsterItem) => {
      widget.cols = widget.cols ?? widget.defaultCols;
      widget.rows = widget.rows ?? widget.defaultRows;
      widget.minItemRows = widget.minItemRows ?? widget.minRow;
      delete widget.defaultCols;
      delete widget.defaultRows;
      delete widget.minItemRows;
    });
    // Prevent changes to be saved too often
    this.changesSubscription = this.structureChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.canUpdate) {
          this.onEditWidget({ type: 'display' });
          this.sortWidgets();
        }
      });
    this.setVisibleWidgets();
  }

  /**
   * Sort widgets by their position in the grid
   */
  private sortWidgets() {
    this.visibleWidgets.sort((a, b) => a.y - b.y || a.x - b.x);
  }

  /**
   * Filter widgets list to display only visible widgets.
   *
   * @param needCloning should clone widgets
   */
  private setVisibleWidgets(needCloning = true): void {
    if (this.canHide) {
      let nextWidgets = [];
      if (needCloning) {
        // cloning to reset coordinates and prevent Gridster from changing the order
        nextWidgets = cloneDeep(this.widgets);
        // adding the index to find the widget again (since there is no id)
        nextWidgets.map((widget: any, index: number) => (widget.index = index));
      } else {
        // goes here when a widget triggers the event
        nextWidgets = this.visibleWidgets;
        // manual synchronization as the global widgets have been cloned
        // used to limit the number of refreshes when context filters change
        nextWidgets.map(
          (widget: any, index: number) =>
            (this.widgets[index].settings.widgetDisplay.isEmpty =
              widget.settings.widgetDisplay.isEmpty)
        );
      }

      this.visibleWidgets = nextWidgets.filter(
        (widget: any) =>
          !(
            widget.settings.widgetDisplay.hideEmpty &&
            widget.settings.widgetDisplay.isEmpty
          )
      );
    } else {
      this.visibleWidgets = this.widgets;
    }
  }
}
