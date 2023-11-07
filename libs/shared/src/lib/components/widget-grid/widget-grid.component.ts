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
  GridsterConfig,
  GridsterItem,
} from 'angular-gridster2';
import { cloneDeep, isNil } from 'lodash';

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
  /** Resize observer for the parent container */
  private resizeObserver!: ResizeObserver;
  /** Set grid options timeout, to enable events that can save dashboard */
  private gridOptionsTimeoutListener!: NodeJS.Timeout;
  private changesSubscription?: Subscription;

  /**
   * Indicate if the widget grid can be deactivated or not.
   *
   * @returns indicate if one of the widget children cannot be deactivated.
   */
  get canDeactivate() {
    return !this.widgetComponents.some((x) => !x.canDeactivate);
  }

  /**
   * Constructor of the grid widget component
   *
   * @param dialog The Dialog service
   * @param dashboardService Shared dashboard service
   * @param _host host element ref
   */
  constructor(
    public dialog: Dialog,
    private dashboardService: DashboardService,
    private _host: ElementRef
  ) {
    super();
  }

  /** OnInit lifecycle hook. */
  ngOnInit(): void {
    this.availableWidgets = this.dashboardService.availableWidgets;
    this.skeletons = this.getSkeletons();
    this.setLayout();
    this.resizeObserver = new ResizeObserver(() => {
      this.colsNumber = this.setColsNumber(this._host.nativeElement.innerWidth);
      this.setGridOptions();
    });
    this.resizeObserver.observe(this._host.nativeElement);
    this.setGridOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever the canUpdate changes and is set to true, then we should update grid options to listen to item changes
    if (this.gridOptionsTimeoutListener) {
      clearTimeout(this.gridOptionsTimeoutListener);
    }
    if (changes['widgets']) {
      this.setLayout();
    }
    if (
      changes['canUpdate'] &&
      Boolean(changes['canUpdate'].previousValue) !==
        Boolean(changes['canUpdate'].currentValue)
    ) {
      this.setLayout();
      this.gridOptionsTimeoutListener = setTimeout(() => {
        this.setGridOptions(true);
      }, 0);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resizeObserver.disconnect();
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
   * Set Gridster options.
   *
   *  @param isDashboardSet Property to add item change callback handler once the dashboard is ready and editable
   */
  setGridOptions(isDashboardSet = false) {
    this.gridOptions = {
      ...this.gridOptions,
      ...(isDashboardSet && {
        itemChangeCallback: () => this.structureChanges.next(true),
        scrollToNewItems: true,
      }),
      ...(!isDashboardSet && {
        // Prevent dashboard to scroll to bottom widget by default
        scrollToNewItems: false,
      }),
      gridType: GridType.VerticalFixed,
      compactType: CompactType.CompactLeftAndUp,
      displayGrid: DisplayGrid.OnDragAndResize,
      margin: 10,
      outerMargin: false,
      minItemCols: 1, // min item number of columns
      minItemRows: 1, // min item number of rows
      maxCols: this.colsNumber,
      minCols: this.colsNumber,
      fixedRowHeight: 200,
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
      swapWhileDragging: false,
      disablePushOnDrag: true,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      disableScrollHorizontal: true,
      setGridSize: true,
      mobileBreakpoint: 640,
      disableWindowResize: true,
      keepFixedHeightInMobile: true,
      ...this.options,
    };
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
          target.fullscreen = false;
          this.expandWidgetDialogRef = null;
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
    this.widgets.forEach((widget) => {
      if (isNil(widget.cols) || isNil(widget.rows)) {
        widget.cols = widget.cols ?? widget.defaultCols;
        widget.rows = widget.rows ?? widget.defaultRows;
        widget.minItemRows = widget.minItemRows ?? widget.minRow;
        widget.resizeEnabled = this.canUpdate;
        widget.dragEnabled = this.canUpdate;
        delete widget.defaultCols;
        delete widget.defaultRows;
        delete widget.minItemRows;
      }
    });
    // Prevent changes to be saved too often
    this.changesSubscription = this.structureChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.canUpdate) {
          this.onEditWidget({ type: 'display' });
        }
      });
  }
}
