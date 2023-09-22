import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
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
import { differenceWith, isEqual } from 'lodash';

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
  implements OnInit, AfterViewInit, OnChanges
{
  public availableWidgets: any[] = WIDGET_TYPES;

  @Input() loading = false;
  /** Skeletons for loading */
  public skeletons: GridsterItem[] = [];

  /** Widgets array, custom setter so we can update the layout */
  private _widgets: any[] = [];
  /** Set widgets array and updates layout with it */
  @Input()
  set widgets(widgets: any[]) {
    if (
      (!this.widgets || this.widgets.length === 0) &&
      widgets instanceof Array
    ) {
      this.setLayout(widgets);
    } else {
      if (this.widgets.length !== widgets.length) {
        this.updateLayout(widgets);
      }
    }
  }
  /** @returns widgets array */
  get widgets() {
    return this._widgets;
  }

  /** Set canUpdate property and also updates permission to change grid tile*/
  @Input() canUpdate: boolean | undefined = false;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;
  options!: GridsterConfig;
  dashboard!: Array<GridsterItem>;

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
    setTimeout(() => {
      this.renderer.setStyle(
        this.gridsterComponent.nativeElement,
        'width',
        `${this.el.nativeElement.offsetWidth}px`
      );
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever the canUpdate changes and is set to true, then we should update grid options to listen to item changes
    if (
      changes['canUpdate'] &&
      Boolean(changes['canUpdate'].previousValue) !==
        Boolean(changes['canUpdate'].currentValue) &&
      Boolean(changes['canUpdate'].currentValue)
    ) {
      setTimeout(() => {
        this.setGridOptions(true);
      }, 0);
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
      ...(isDashboardSet && {
        itemChangeCallback: (item: GridsterItem) => this.onEditTile(item),
      }),
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      displayGrid: DisplayGrid.OnDragAndResize,
      margin: 10,
      maxCols: this.colsNumber,
      maxItemRows: MAX_ROW_SPAN,
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

    this.dashboard?.map((gridItem) => {
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
   * Emits addition event.
   *
   * @param e new widget.
   */
  onAdd(e: any): void {
    this.add.emit(e);
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
    yAxis += widget.defaultCols;
    if (yAxis > this.colsNumber) {
      xAxis += widget.defaultRows;
    }

    if (yAxis + widget.defaultCols > this.colsNumber) {
      yAxis = 0;
      xAxis += widget.defaultRows;
    }
    return { x: xAxis, y: yAxis };
  }

  /**
   * Updates layout based on the passed widget array.
   *
   * @param widgets Array with the list of present widgets on the dashboard
   */
  private setLayout(widgets: any[]) {
    this._widgets = widgets;
    const yAxis = 0;
    const xAxis = 0;
    this.dashboard = widgets.map((widget, index) => {
      const { x, y } =
        index === 0
          ? { x: 0, y: 0 }
          : this.setXYAxisValues(yAxis, xAxis, widget);
      const gridItem = {
        id: widget.id,
        cols: widget.defaultCols,
        rows: widget.defaultRows,
        minItemRows: widget.minRow,
        y: widget.y ?? y,
        x: widget.x ?? x,
        resizeEnabled: this.canUpdate,
        dragEnabled: this.canUpdate,
      };
      return gridItem;
    });
  }

  /**
   * Updates current grid layout
   * If we set a new value to the dashboard property(assign new object) the child items we'll re render again executing all lifecycle hook methods
   * that's why we use push and slice methods, to keep same reference to the dashboard property and avoid not necessary request and function triggers
   *
   * @param widgets current widgets array
   */
  updateLayout(widgets: any[]) {
    const widgetDiff = differenceWith(this.widgets, widgets, isEqual);
    // If there is no difference between previous and current widgets
    // it means that we added a new one
    if (widgetDiff.length === 0) {
      this.dashboard.push({
        id: widgets[widgets.length - 1].id,
        cols: widgets[widgets.length - 1].defaultCols,
        rows: widgets[widgets.length - 1].defaultRows,
        minItemRows: widgets[widgets.length - 1].minRow,
        y: this.dashboard[this.dashboard.length - 1].y,
        x: this.dashboard[this.dashboard.length - 1].x,
        resizeEnabled: this.canUpdate,
        dragEnabled: this.canUpdate,
      });
      // Else we delete the one that the diff has returned
    } else {
      const deletedItemIndex = this.dashboard.findIndex(
        (gridItem) => gridItem.id === widgetDiff[0].id
      );
      if (deletedItemIndex !== -1) {
        this.dashboard.splice(deletedItemIndex, 1);
      }
    }
    this._widgets = widgets;
  }
}
