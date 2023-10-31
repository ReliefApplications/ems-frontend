import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { WIDGET_TYPES } from '../../models/dashboard.model';
import {
  TileLayoutReorderEvent,
  TileLayoutResizeEvent,
} from '@progress/kendo-angular-layout';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { WidgetComponent } from '../widget/widget.component';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { ExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import { cloneDeep } from 'lodash';

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
  implements OnInit
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
  /** Move event emitter */
  @Output() move: EventEmitter<any> = new EventEmitter();
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

  /**
   * Indicate if the widget grid can be deactivated or not.
   *
   * @returns indicate if one of the widget children cannot be deactivated.
   */
  get canDeactivate() {
    return !this.widgetComponents.some((x) => !x.canDeactivate);
  }

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
   * @param dialog The Dialog service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    public dialog: Dialog,
    private dashboardService: DashboardService
  ) {
    super();
  }

  /** OnInit lifecycle hook. */
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
    // Prevent widgets to be smaller than minimum width ( definition per widget )
    if (e.newRowSpan < widgetDefinition.minRow) {
      e.newRowSpan = widgetDefinition.minRow;
    }
    // Prevent widgets to be greater than maximum width ( fixed limit in the widget grid )
    if (e.newColSpan > MAX_COL_SPAN) {
      e.newColSpan = MAX_COL_SPAN;
    }
    const target = this.widgets[e.item.order];
    target.defaultCols = e.newColSpan;
    target.defaultRows = e.newRowSpan;
    this.edit.emit({
      type: 'display',
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
        rowSpan: Math.floor(Math.random() * MAX_ROW_SPAN_LOADING) + 1,
      });
    }
    return skeletons;
  }
}
