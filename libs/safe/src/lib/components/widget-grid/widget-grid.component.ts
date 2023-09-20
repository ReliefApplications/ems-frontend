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
import {
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { SafeDashboardService } from '../../services/dashboard/dashboard.service';
import { SafeWidgetComponent } from '../widget/widget.component';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';

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

  @Input() widgets: any[] = [];
  @Input() canUpdate = false;

  // === GRID ===
  colsNumber = MAX_COL_SPAN;

  // === EVENT EMITTER ===
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() add: EventEmitter<any> = new EventEmitter();

  // === STEP CHANGE FOR WORKFLOW ===
  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();

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
    dialogRef.componentInstance?.goToNextStep
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        this.goToNextStep.emit(event);
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
        const { SafeTileDataComponent } = await import(
          './floating-options/menu/tile-data/tile-data.component'
        );
        const dialogRef = this.dialog.open(SafeTileDataComponent, {
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
  public onReorder(e: TileLayoutReorderEvent): void {
    this.move.emit(e);
  }

  /**
   * Handles resize widget event.
   *
   * @param e resize event.
   */
  public onResize(e: TileLayoutResizeEvent) {
    const widgetDefinition = this.availableWidgets.find(
      (x) => x.component === this.widgets[e.item.order].component
    );
    if (e.newRowSpan < widgetDefinition.minRow) {
      e.newRowSpan = widgetDefinition.minRow;
    }
    if (e.newRowSpan > MAX_ROW_SPAN) {
      e.newRowSpan = MAX_ROW_SPAN;
    }
    if (e.newColSpan > MAX_COL_SPAN) {
      e.newColSpan = MAX_COL_SPAN;
    }
    this.edit.emit({
      type: 'display',
      id: this.widgets[e.item.order].id,
      options: {
        id: this.widgets[e.item.order].id,
        cols: e.newColSpan,
        rows: e.newRowSpan,
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
}
