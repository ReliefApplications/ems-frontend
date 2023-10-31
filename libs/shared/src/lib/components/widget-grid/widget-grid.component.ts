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
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import {
  CompactType,
  DisplayGrid,
  GridType,
  GridsterConfig,
} from 'angular-gridster2';

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
  /** Skeletons for loading */
  public skeletons: { colSpan: number; rowSpan: number }[] = [];
  /** Widgets */
  @Input() widgets: any[] = [];
  /** Update permission */
  @Input() canUpdate = false;
  /** Number of columns */
  colsNumber = MAX_COL_SPAN;
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
  /** Gridster options */
  gridOptions!: GridsterConfig;
  /** Resize observer for the parent container */
  private resizeObserver!: ResizeObserver;
  changes = new Subject<boolean>();

  private time = false;

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
    this.resizeObserver = new ResizeObserver(() => {
      this.colsNumber = this.setColsNumber(this._host.nativeElement.innerWidth);
      this.skeletons = this.getSkeletons();
      this.setGridOptions();
    });
    this.resizeObserver.observe(this._host.nativeElement);
    this.setGridOptions();
    this.changes
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value: any) => {
        if (this.canUpdate) {
          console.log(value);
          this.onEditWidget({ type: 'display' });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (
      changes['canUpdate'] &&
      Boolean(changes['canUpdate'].previousValue) !==
        Boolean(changes['canUpdate'].currentValue) &&
      Boolean(changes['canUpdate'].currentValue)
    ) {
      this.setGridOptions();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.resizeObserver.disconnect();
  }

  // static itemChange(item: any, itemComponent: any) {
  //   console.info('itemChanged', item, itemComponent);
  // }

  // static itemResize(item: a, itemComponent: any) {
  //   console.info('itemResized', item, itemComponent);
  // }

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
   */
  setGridOptions() {
    this.gridOptions = {
      ...this.gridOptions,
      itemChangeCallback: () => this.changes.next(true),
      itemResizeCallback: () => this.changes.next(true),
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
        ignoreContentClass: 'widget-actions',
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
      scrollToNewItems: true,
      setGridSize: true,
      mobileBreakpoint: 640,
      disableWindowResize: true,
    };

    this.widgets.map((gridItem) => {
      gridItem.resizeEnabled = this.canUpdate;
      gridItem.dragEnabled = this.canUpdate;
    });
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
      const tile = JSON.parse(JSON.stringify(e));
      if (tile) {
        /** Open settings dialog component from the widget.  */
        const { EditWidgetModalComponent } = await import(
          './edit-widget-modal/edit-widget-modal.component'
        );
        const dialogRef = this.dialog.open(EditWidgetModalComponent, {
          disableClose: true,
          data: {
            tile: tile,
            template: this.dashboardService.findSettingsTemplate(tile),
          },
        });
        dialogRef.closed
          .pipe(takeUntil(this.destroy$))
          .subscribe((value: any) => {
            // Should save the value, and so, add the widget to the grid
            if (value) {
              this.add.emit({
                ...tile,
                settings: value,
              });
            }
          });
      }
    }
  }

  /**
   * Emits reorder event.
   *
   * @param e reorder event.
   */
  // public onReorder(e: TileLayoutReorderEvent): void {
  //   this.move.emit(e);
  // }

  /**
   * Handles resize widget event.
   *
   * @param e resize event.
   */
  // public onResize(e: TileLayoutResizeEvent) {
  //   const widgetDefinition = this.availableWidgets.find(
  //     (x) => x.component === this.widgets[e.item.order].component
  //   );
  //   // Prevent widgets to be smaller than minimum width ( definition per widget )
  //   if (e.newRowSpan < widgetDefinition.minRow) {
  //     e.newRowSpan = widgetDefinition.minRow;
  //   }
  //   // Prevent widgets to be greater than maximum width ( fixed limit in the widget grid )
  //   if (e.newColSpan > MAX_COL_SPAN) {
  //     e.newColSpan = MAX_COL_SPAN;
  //   }
  //   const target = this.widgets[e.item.order];
  //   target.defaultCols = e.newColSpan;
  //   target.defaultRows = e.newRowSpan;
  //   this.edit.emit({
  //     type: 'display',
  //   });
  // }

  /**
   * Generates a list of skeletons, for loading.
   *
   * @returns List of skeletons.
   */
  private getSkeletons(): { colSpan: number; rowSpan: number }[] {
    const skeletons = [];
    let remainingColsNumber = this.colsNumber;
    for (let i = 0; i < 10; i++) {
      const colSpan = Math.floor(Math.random() * remainingColsNumber) + 1;
      remainingColsNumber -= colSpan;
      if (remainingColsNumber === 0) {
        remainingColsNumber = this.colsNumber;
      }
      skeletons.push({
        colSpan,
        rowSpan: Math.floor(Math.random() * MAX_ROW_SPAN_LOADING) + 1,
      });
    }
    return skeletons;
  }
}
