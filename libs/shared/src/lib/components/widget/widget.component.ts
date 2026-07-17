import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  HostBinding,
  OnInit,
  OnDestroy,
  TemplateRef,
  ElementRef,
  Optional,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChartComponent } from '../widgets/chart/chart.component';
import { EditorComponent } from '../widgets/editor/editor.component';
import { GridWidgetComponent } from '../widgets/grid/grid.component';
import { MapWidgetComponent } from '../widgets/map/map.component';
import { SummaryCardComponent } from '../widgets/summary-card/summary-card.component';
import { v4 as uuidv4 } from 'uuid';
import get from 'lodash/get';
import { GridsterComponent, GridsterItemComponent } from 'angular-gridster2';
import { WidgetService } from '../../services/widget/widget.service';
import { TabsComponent } from '../widgets/tabs/tabs.component';
import { FileExplorerWidgetComponent } from '../file-explorer/file-explorer-widget/file-explorer-widget.component';

/** Component for the widgets */
@Component({
  selector: 'shared-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent implements OnInit, OnDestroy, OnChanges {
  /** Current widget definition */
  @Input() widget: any;
  /** Is widget in fullscreen mode */
  @Input() header = true;
  /** Can user update widget */
  @Input() canUpdate = false;
  /** Template to display on the left of widget header */
  @Input() headerLeftTemplate?: TemplateRef<any>;
  /** Template to display on the right of widget header */
  @Input() headerRightTemplate?: TemplateRef<any>;
  /** Is fullscreen mode activated */
  @Input() fullscreen = false;
  /** Edit widget event emitter */
  @Output() edit: EventEmitter<any> = new EventEmitter();
  /** Change step workflow event emitter */
  @Output() changeStep: EventEmitter<number> = new EventEmitter();
  /** Id of the widget. Visible in the dom */
  @HostBinding()
  id = `widget-${uuidv4()}`;
  /** Reference to widget inner component */
  @ViewChild('widgetContent')
  widgetContentComponent!:
    | ChartComponent
    | GridWidgetComponent
    | MapWidgetComponent
    | EditorComponent
    | SummaryCardComponent
    | TabsComponent
    | FileExplorerWidgetComponent;
  /** Expanded state of the widget */
  public expanded = false;
  /** Loading state of the widget */
  public loading = true;
  /** Original row count before auto-height expansion, used to restore in edit mode */
  private autoHeightOriginalRows?: number;
  /** Html element containing widget custom style */
  private customStyle?: HTMLStyleElement;
  /** Previous position of the widget ( cols / x )  */
  private previousPosition?: { cols: number; x: number };

  /** @returns would component block navigation */
  get canDeactivate() {
    if (this.widgetContentComponent instanceof GridWidgetComponent) {
      return this.widgetContentComponent.canDeactivate;
    } else {
      return true;
    }
  }

  /** @returns should widget show header, based on widget settings */
  get showHeader() {
    return get(this.widget, 'settings.widgetDisplay.showHeader') ?? true;
  }

  /** @returns should widget show border, based on widget settings */
  get showBorder() {
    return get(this.widget, 'settings.widgetDisplay.showBorder') ?? true;
  }

  /** @returns is widget expandable */
  get expandable() {
    return get(this.widget, 'settings.widgetDisplay.expandable') ?? false;
  }

  /** @returns should show expand button, based on widget state & grid state */
  get showExpand() {
    return (
      this.expandable &&
      !this.canUpdate &&
      !this.fullscreen &&
      !this.grid.mobile &&
      (this.widget.cols < this.grid.columns || this.expanded)
    );
  }

  /** @returns should widget use padding, based on widget settings */
  get usePadding() {
    return get(this.widget, 'settings.widgetDisplay.usePadding') ?? true;
  }

  /**
   * Widget component
   *
   * @param elementRef reference to element
   * @param grid Reference to parent gridster
   * @param gridItem Reference to parent gridster item
   * @param widgetService Shared widget service
   */
  constructor(
    public elementRef: ElementRef,
    @Optional() private grid: GridsterComponent,
    @Optional() private gridItem: GridsterItemComponent,
    private widgetService: WidgetService
  ) {}

  ngOnInit(): void {
    // Initialize style
    this.widgetService
      .createCustomStyle(this.id, this.widget)
      .then((customStyle) => {
        if (customStyle) {
          this.customStyle = customStyle;
        }
      })
      .finally(() => (this.loading = false));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['canUpdate']) {
      // Reset size of the widget to default one, if admin enters edit mode
      if (changes['canUpdate'].previousValue === false && this.expanded) {
        this.onResize();
      }
      // Restore original rows if auto-height had expanded the widget
      if (
        changes['canUpdate'].currentValue === true &&
        this.autoHeightOriginalRows !== undefined
      ) {
        this.widget.rows = this.autoHeightOriginalRows;
        this.autoHeightOriginalRows = undefined;
        this.gridItem?.updateOptions();
        if (this.grid?.options?.api?.resize) {
          this.grid.options.api.resize();
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.customStyle) {
      const parentNode = this.customStyle.parentNode;
      parentNode?.removeChild(this.customStyle);
    }
  }

  /**
   * Reload the widget's data, if its inner content component supports it.
   * Called when dashboard data was edited so all widgets reflect the changes.
   */
  reload(): void {
    const content = this.widgetContentComponent as { reload?: () => void };
    if (typeof content?.reload === 'function') {
      content.reload();
    }
  }

  /** @returns True when this widget is the bottom-most item in the grid (no items below it). */
  get isBottomWidget(): boolean {
    if (!this.grid || !this.gridItem || this.grid.mobile) return false;
    const bottom = (this.widget.y ?? 0) + (this.widget.rows ?? 1);
    return this.grid.grid.every(
      (item) => item === this.gridItem || (item.item.y ?? 0) < bottom
    );
  }

  /**
   * Auto-grows or shrinks the widget's row count so its content fits without an
   * inner scrollbar. Only active in view mode (canUpdate = false).
   *
   * @param overflowPx Pixels of scroll overflow (content height − visible height).
   * Positive values grow the widget; negative values shrink it back toward its
   * original row count (e.g. after switching to a smaller tab).
   */
  onContentHeightChange(overflowPx: number): void {
    console.log('Update height...');
    if (this.canUpdate || !this.grid || !this.gridItem) return;

    // Only auto-resize the bottom-most widget to avoid overlapping items below it
    if (!this.isBottomWidget) return;

    const originalRows: number =
      this.autoHeightOriginalRows ?? this.widget.rows;
    this.autoHeightOriginalRows = originalRows;

    const fixedRowHeight = (this.grid.options.fixedRowHeight as number) ?? 200;
    const margin = (this.grid.options.margin as number) ?? 10;
    const rowUnit = fixedRowHeight + margin;

    let newRows = this.widget.rows;
    if (overflowPx > 0) {
      newRows = this.widget.rows + Math.ceil(overflowPx / rowUnit);
    } else if (overflowPx < 0) {
      // Shrink unused rows back, but never below the configured row count
      newRows = Math.max(
        originalRows,
        this.widget.rows - Math.floor(-overflowPx / rowUnit)
      );
    }

    if (newRows === this.widget.rows) return;

    this.widget.rows = newRows;
    this.gridItem.updateOptions();
    if (this.grid.options.api?.resize) {
      this.grid.options.api.resize();
    }
  }

  /** Resize widget, by button click. */
  onResize() {
    if (this.grid.options.api?.resize && this.grid.options.api.optionsChanged) {
      if (this.expanded) {
        // Revert widget size
        this.widget.layerIndex = 0;
        this.widget.cols = this.previousPosition?.cols;
        this.widget.x = this.previousPosition?.x;
        this.gridItem.updateOptions();
        this.grid.options.api.resize();
        this.expanded = false;
      } else {
        // Expand the widget
        this.previousPosition = {
          cols: this.widget.cols,
          x: this.widget.x,
        };
        this.widget.layerIndex = 1;
        this.widget.cols = this.grid.options.maxCols;
        this.widget.x = 0;
        this.gridItem.bringToFront(100);
        this.gridItem.updateOptions();
        this.grid.options.api.resize();
        this.expanded = true;
      }
    }
  }
}
