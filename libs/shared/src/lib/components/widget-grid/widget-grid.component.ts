import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { WIDGET_TYPES } from '../../models/dashboard.model';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { WidgetComponent } from '../widget/widget.component';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import {
  CompactType,
  DisplayGrid,
  GridType,
  GridsterComponent,
  GridsterConfig,
  GridsterItem,
} from 'angular-gridster2';

/** Maximum height of the widget in row units */
const MAX_ROW_SPAN = 4;

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
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  public availableWidgets: any[] = WIDGET_TYPES;

  @Input() loading = false;
  /** Skeletons for loading */
  public skeletons: GridsterItem[] = [];

  /** Widgets array in the layout */
  @Input() widgets: any[] = [];

  /** canUpdate property to trigger changes in the widgets grid layout */
  @Input() canUpdate: boolean | undefined = false;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;
  options!: GridsterConfig;
  gridWidthTimeoutListener!: NodeJS.Timeout;
  gridOptionsTimeoutListener!: NodeJS.Timeout;

  // === EVENT EMITTER ===
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() style: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  @ViewChildren(WidgetComponent)
  widgetComponents!: QueryList<WidgetComponent>;

  @ViewChild(GridsterComponent, { read: ElementRef })
  gridsterComponent!: ElementRef;

  /**
   * Indicate if the widget grid can be deactivated or not.
   *
   * @returns indicate if one of the widget children cannot be deactivated.
   */
  get canDeactivate() {
    return !this.widgetComponents.some((x) => !x.canDeactivate);
  }

  public isBackOffice = false;

  /**
   * Changes display when windows size changes.
   *
   * @param event window resize event
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any): void {
    this.colsNumber = this.setColsNumber(event.target.innerWidth);
    this.skeletons = this.getSkeletons();
    this.setGridOptions();
  }

  /**
   * Constructor of the grid widget component
   *
   * @param environment This is the environment in which we are running the application
   * @param dialog The Dialog service
   * @param dashboardService Shared dashboard service
   * @param el widget grid component ElementRef
   * @param renderer Angular renderer2 service for dom changes
   */
  constructor(
    @Inject('environment') environment: any,
    public dialog: Dialog,
    private dashboardService: DashboardService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    super();
    if (environment.module === 'backoffice') {
      this.isBackOffice = true;
    }
  }

  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);
    this.skeletons = this.getSkeletons();
    this.availableWidgets = this.dashboardService.availableWidgets;
    this.setGridOptions();
  }

  ngAfterViewInit(): void {
    // We need to add the parent width manually on first load with a timeout in order to set correct width after the sidenav container calculations
    if (this.gridsterComponent) {
      this.gridWidthTimeoutListener = setTimeout(() => {
        this.renderer.setStyle(
          this.gridsterComponent.nativeElement,
          'width',
          `${this.el.nativeElement.offsetWidth}px`
        );
      }, 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever the canUpdate changes and is set to true, then we should update grid options to listen to item changes
    if (this.gridOptionsTimeoutListener) {
      clearTimeout(this.gridOptionsTimeoutListener);
    }

    if (
      changes['canUpdate'] &&
      Boolean(changes['canUpdate'].previousValue) !==
        Boolean(changes['canUpdate'].currentValue) &&
      Boolean(changes['canUpdate'].currentValue)
    ) {
      this.gridOptionsTimeoutListener = setTimeout(() => {
        this.setGridOptions(true);
      }, 0);
    }

    if (changes['widgets']) {
      // First load
      if (
        !changes['widgets'].previousValue ||
        !changes['widgets'].previousValue?.length
      ) {
        // If there is something to display, set layout
        if (changes['widgets'].currentValue.length) {
          this.setLayout();
        }
      } else {
        // if a new widget is added, we have to update on the front the drag and resize feature ability,
        // which are not save in db because they are just grid config related
        if (
          changes['widgets'].currentValue.length >
          changes['widgets'].previousValue.length
        ) {
          // Widget can be only added one by one
          const widgetIndex = this.widgets.findIndex(
            (widget) => !('resizeEnabled' in widget)
          );
          if (widgetIndex !== -1) {
            this.widgets.splice(widgetIndex, 1, {
              ...this.widgets[widgetIndex],
              resizeEnabled: this.canUpdate,
              dragEnabled: this.canUpdate,
            });
          }
        }
      }
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
   * Set grid options and update any permissions for current grid items
   *
   * @param isDashboardSet Property to add item change callback handler once the dashboard is ready and editable
   */
  setGridOptions(isDashboardSet = false) {
    this.options = {
      ...this.options,
      ...(isDashboardSet && {
        itemChangeCallback: (item: GridsterItem) => this.onEditTile(item),
      }),
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      displayGrid: DisplayGrid.OnDragAndResize,
      margin: 10,
      maxCols: this.colsNumber,
      minCols: this.colsNumber,
      maxItemRows: MAX_ROW_SPAN,
      minItemRows: 2,
      draggable: {
        enabled: this.canUpdate,
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
    const widgetComp = this.widgetComponents.find(
      (v) => v.widget.id == e.widget.id
    );
    this.style.emit({
      domId: widgetComp?.id,
      widget: e.widget,
    });
  }

  /**
   * Expands widget in a full size screen popup.
   *
   * @param e widget to open.
   */
  async onExpandWidget(e: any): Promise<void> {
    const widget = this.widgets.find((x) => x.id === e.id);
    const { ExpandedWidgetComponent } = await import(
      './expanded-widget/expanded-widget.component'
    );
    const dialogRef = this.dialog.open(ExpandedWidgetComponent, {
      data: {
        widget,
      },
      autoFocus: false,
    });
    dialogRef.componentInstance?.changeStep
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.changeStep.emit(event);
        dialogRef.close();
      });
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
        const { TileDataComponent } = await import(
          './floating-options/menu/tile-data/tile-data.component'
        );
        const dialogRef = this.dialog.open(TileDataComponent, {
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
              const { x, y } = this.widgets[this.widgets.length - 1] ?? {
                x: 0,
                y: 0,
              };
              this.add.emit({
                ...tile,
                settings: value,
                ...{
                  cols: tile.defaultCols,
                  rows: tile.defaultRows,
                  y,
                  x,
                },
              });
            }
          });
      }
    }
  }

  /**
   * Emits an action when a tile is edited (Size and position)
   *
   * @param {GridsterItem} item Current grid item
   */
  onEditTile(item: GridsterItem): void {
    if (item) {
      this.edit.emit({
        type: 'display',
        id: item.id,
        options: {
          id: item.id,
          cols: item.cols,
          rows: item.rows,
          // We need to add these two properties por item positioning
          x: item.x,
          y: item.y,
        },
      });
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
        defaultCols: colSpan,
        defaultRows: Math.floor(Math.random() * MAX_ROW_SPAN) + 1,
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
        cols: skeleton.defaultCols,
        rows: skeleton.defaultRows,
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
  setXYAxisValues(
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
  private setLayout() {
    const yAxis = 0;
    const xAxis = 0;
    this.widgets.map((widget, index) => {
      const { x, y } =
        index === 0
          ? { x: 0, y: 0 }
          : this.setXYAxisValues(yAxis, xAxis, widget);
      const gridItem = {
        ...widget,
        cols: widget.cols ?? widget.defaultCols,
        rows: widget.rows ?? widget.defaultRows,
        y: widget.y ?? y,
        x: widget.x ?? x,
        resizeEnabled: this.canUpdate,
        dragEnabled: this.canUpdate,
      };
      // If first item, we know it's x:0 and y:0 but we set the init next pointer
      if (index === 0) {
        this.setXYAxisValues(yAxis, xAxis, widget);
      }
      return gridItem;
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.gridWidthTimeoutListener) {
      clearTimeout(this.gridWidthTimeoutListener);
    }
    if (this.gridOptionsTimeoutListener) {
      clearTimeout(this.gridOptionsTimeoutListener);
    }
  }
}
