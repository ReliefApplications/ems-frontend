import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { WIDGET_TYPES } from '../../models/dashboard.model';
import { SafeDashboardService } from '../../services/dashboard/dashboard.service';
import { SafeWidgetComponent } from '../widget/widget.component';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ktdTrackById } from '@katoid/angular-grid-layout';

/** Maximum height of the widget in row units */
const MAX_ROW_SPAN = 4;

/** Maximum width of the widget in column units */
const MAX_COL_SPAN = 8;

/**
 * Component definition for grid widgets
 */
@Component({
  selector: 'safe-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss'],
})
export class SafeWidgetGridComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public availableWidgets: any[] = WIDGET_TYPES;

  @Input() loading = false;
  /** Skeletons for loading */
  public skeletons: { colSpan: number; rowSpan: number }[] = [];

  /** Formatted layout array for angular-grid-layout */
  public layout: any[] = [];

  /** Widgets array, custom setter so we can update the layout */
  private _widgets: any[] = [];
  @Input()
  set widgets(widgets: any[]) {
    this._widgets = widgets;
    this.updateLayout(widgets);
  }
  get widgets() {
    return this._widgets;
  }
  @Input() canUpdate = false;

  dragIconSelected = false;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;
  trackById = ktdTrackById;

  // === EVENT EMITTER ===
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() changeStep: EventEmitter<number> = new EventEmitter();

  @ViewChildren(SafeWidgetComponent)
  widgetComponents!: QueryList<SafeWidgetComponent>;

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
    this.updateLayout(this.widgets);
  }

  /**
   * Constructor of the grid widget component
   *
   * @param environment This is the environment in which we are running the application
   * @param dialog The Dialog service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    @Inject('environment') environment: any,
    public dialog: Dialog,
    private dashboardService: SafeDashboardService
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
   * Expands widget in a full size screen popup.
   *
   * @param e widget to open.
   */
  async onExpandWidget(e: any): Promise<void> {
    const widget = this.widgets.find((x) => x.id === e.id);
    const { SafeExpandedWidgetComponent } = await import(
      './expanded-widget/expanded-widget.component'
    );
    const dialogRef = this.dialog.open(SafeExpandedWidgetComponent, {
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
   * @param e Updated layout.
   */
  onEditTile(e: any): void {
    const id = parseInt(e.layoutItem.id, 10);
    this.edit.emit({
      type: 'display',
      id,
      options: {
        id,
        cols: e.layoutItem.w,
        rows: e.layoutItem.h,
        // We need to add these two properties
        // x: e.layoutItem.x,
        // y: e.layoutItem.y,
      },
    });
  }

  /**
   * Generates a list of skeletongs, for loading.
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
        rowSpan: Math.floor(Math.random() * MAX_ROW_SPAN) + 1,
      });
    }
    return skeletons;
  }

  /**
   * Fills the matrix with the passed item
   *
   * @param item Object with the size of the element and position
   * @param item.w Width
   * @param item.h Heigh
   * @param item.x X position
   * @param item.y Y position
   * @param matrix Array of boolean arrays, it will be dynamically expanded as needed
   */
  private fillMatrix(
    item: { w: number; h: number; x: number; y: number },
    matrix: boolean[][]
  ) {
    for (let h = 0; h < item.h; h++) {
      for (let w = 0; w < item.w; w++) {
        matrix[item.y + h][item.x + w] = true;
      }
    }
  }

  /**
   * Returns the first available position on the matrix
   *
   * @param size Object with the size of the element
   * @param size.w Width
   * @param size.h Heigh
   * @param matrix Array of boolean arrays, it will be dynamically expanded as needed
   * @returns Object with x & y properties;
   */
  private getFreeSpotOnMatrix(
    size: { w: number; h: number },
    matrix: boolean[][]
  ): { x: number; y: number } {
    let w = size.w; // Needed columns
    let h = size.h; // Needed rows
    let row = 0; // Tracks current row loop
    let col = 0; // Tracks current column loop
    for (; h > 0; row++) {
      if (!matrix[row]) {
        // No row available, adds a new row and considers it avilable
        matrix.push(new Array(this.colsNumber).fill(false));
        h--;
        col = 0;
      } else {
        // Row already exists, check if it has free space as the item width
        for (col = 0; w > 0 && col < this.colsNumber; col++) {
          matrix[row][col] ? (w = size.w) : w--;
        }
        // If it has it considers the row available
        // If not it resets the available rows
        w === 0 ? h-- : (h = size.h);
        w = size.w;
      }
    }

    return {
      x: col > 0 ? col - size.w : 0,
      y: row - size.h,
    };
  }

  /**
   * Updates layout based on the passed widget array.
   *
   * @param widgets Array with the list of present widgets on the dashboard
   */
  private updateLayout(widgets: any[]) {
    // Will simulate the grid so we can get x & y position from the array position;
    const matrix: boolean[][] = [];

    this.layout = widgets.map((widget) => {
      // Calculate w & h of the widget;
      const w =
        widget.defaultCols > this.colsNumber ||
        (!this.canUpdate && widgets.length === 1)
          ? this.colsNumber
          : widget.defaultCols;
      const h =
        !this.canUpdate && widgets.length === 1 ? 4 : widget.defaultRows;

      // Ideally we would remove all this code and just migrate all the dashboard widget setting to use x & y.
      // The logic below takes into account that you could be fed widgets without x & y positions.
      // The possibility to have widgets with and without x & y in a same dashboard is not considered.

      let pos: { x: number; y: number };

      if (widget.x && widget.y) {
        // If x & y properties are available saves them to pos
        pos = { x: widget.x, y: widget.y };
      } else {
        // Else it gets the free spot on the matrix
        pos = this.getFreeSpotOnMatrix({ w, h }, matrix);
        this.fillMatrix({ ...pos, w, h }, matrix);
      }

      return {
        ...pos,
        id: widget.id.toString(),
        w,
        h,
      };
    });
  }
}
