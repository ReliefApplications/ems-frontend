import { CdkDragEnter, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output,
   QueryList, Renderer2, ViewChildren, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import { MatSelectChange } from '@angular/material/select';
import { fromEvent, merge, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import {
  KtdDragEnd, KtdDragStart, KtdGridComponent, KtdGridLayout, KtdGridLayoutItem, KtdResizeEnd, KtdResizeStart, ktdTrackById
} from '@katoid/angular-grid-layout';

import { SafeChartSettingsComponent } from '../../components/widgets/chart-settings/chart-settings.component';

@Component({
  selector: 'safe-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss']
})
export class SafeWidgetGridComponent implements OnInit, OnDestroy {

  @Input() widgets: any[] = [];
  @Input() canUpdate = false;

  @Output() goToNextStep: EventEmitter<any> = new EventEmitter();
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  @ViewChild(KtdGridComponent, { static: true })
  grid!: KtdGridComponent;
  trackById = ktdTrackById;
  widget = {
    name: 'BAR CHART',
    icon: 'bar_chart',
    settings: {
      title: 'Bar chart',
      chart: {
        type: 'bar'
      }
    },
    defaultCols: 3,
    defaultRows: 3,
    component: 'chart',
    settingsTemplate: SafeChartSettingsComponent
  };
  cols = 12;
  copyWidgets = [] as any;
  rowHeight = 50;
  compactType: 'vertical' | 'horizontal' | null = 'vertical';
  layout: KtdGridLayout = [];
  transitions: { name: string, value: string }[] = [
    { name: 'ease', value: 'transform 500ms ease, width 500ms ease, height 500ms ease' },
    { name: 'ease-out', value: 'transform 500ms ease-out, width 500ms ease-out, height 500ms ease-out' },
    { name: 'linear', value: 'transform 500ms linear, width 500ms linear, height 500ms linear' },
    {
      name: 'overflowing',
      value: 'transform 500ms cubic-bezier(.28,.49,.79,1.35), width 500ms cubic-bezier(.28,.49,.79,1.35), height 500ms cubic-bezier(.28,.49,.79,1.35)'
    },
    { name: 'fast', value: 'transform 200ms ease, width 200ms linear, height 200ms linear' },
    { name: 'slow-motion', value: 'transform 1000ms linear, width 1000ms linear, height 1000ms linear' },
    { name: 'transform-only', value: 'transform 500ms ease' },
  ];
  currentTransition: string = this.transitions[0].value;

  dragStartThreshold = 0;
  disableDrag = true;
  disableResize = false;
  disableRemove = false;
  autoResize = true;
  isDragging = false;
  isResizing = false;
  resizeSubscription: Subscription = new Subscription();

  constructor(private ngZone: NgZone, public dialog: MatDialog) {
    // this.ngZone.onUnstable.subscribe(() => console.log('UnStable'));
  }

  ngOnInit(): void {
    console.log(this.widgets);
    this.copyWidgets = this.initSelect(this.widgets);
    this.layout = this.copyWidgets;
    console.log(this.layout);
    this.resizeSubscription = merge(
      fromEvent(window, 'resize'),
      fromEvent(window, 'orientationchange')
    ).pipe(
      debounceTime(50),
      filter(() => this.autoResize)
    ).subscribe(() => {
      this.grid.resize();
    });
  }

  initSelect(data: any): any[] {
    return data.map( (item: any) => ({
      ...item,
      x: 0,
      y: 0,
      w: item.defaultCols,
      h: item.defaultRows,
      id: String(item.id)
      // w: item.defaultCols,
      // h: item.defaultRows
    }));
  }

  getNewLayout(newArray: any): any[] {
    const newCopy: any[] = [];
    let i = 0;
    newArray.forEach( (element: any) => {
      newCopy.push({
        ...this.layout[i],
        ...element
      });
      i += 1;
    });
    return newCopy;
  }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }

  onDragStarted(event: KtdDragStart): void {
    this.isDragging = true;
  }

  onResizeStarted(event: KtdResizeStart): void {
    this.isResizing = true;
  }

  onDragEnded(event: KtdDragEnd): void {
    this.isDragging = false;
  }

  onResizeEnded(event: KtdResizeEnd): void {
    this.isResizing = false;
  }

  onLayoutUpdated(layout: KtdGridLayout): void {
    console.log('on layout updated', layout);
    this.layout = this.getNewLayout(layout);
    console.log(this.layout);
  }

  onEditWidget(e: any): void {
    this.edit.emit(e);
  }

  onDeleteWidget(e: any): void {
    this.delete.emit(e);
    console.log(e);
    this.removeItem(e);
    console.log(this.layout);
  }

  onExpandWidget(e: any): void {
    const widget = this.widgets.find(x => x.id === e.id);
    const dialogRef = this.dialog.open(SafeExpandedWidgetComponent, {
      data: {
        widget
      },
      autoFocus: false,
      position: {
        bottom: '0',
        right: '0'
      },
      panelClass: 'expanded-widget-dialog'
    });
    dialogRef.componentInstance.goToNextStep.subscribe((event: any) => {
      this.goToNextStep.emit(event);
      dialogRef.close();
    });
  }

  onCompactTypeChange(change: MatSelectChange): void {
    console.log('onCompactTypeChange', change);
    this.compactType = change.value;
  }

  onTransitionChange(change: MatSelectChange): void {
    console.log('onTransitionChange', change);
    this.currentTransition = change.value;
  }

  onDisableDragChange(checked: boolean): void {
    this.disableDrag = checked;
  }

  onDisableResizeChange(checked: boolean): void {
    this.disableResize = checked;
  }

  onDisableRemoveChange(checked: boolean): void {
    this.disableRemove = checked;
    console.log(this.disableRemove);
  }

  onAutoResizeChange(checked: boolean): void {
    this.autoResize = checked;
  }

  onColsChange(event: Event): void {
    this.cols = parseInt((event.target as HTMLInputElement).value, 10);
  }

  onRowHeightChange(event: Event): void {
    this.rowHeight = parseInt((event.target as HTMLInputElement).value, 10);
  }

  onDragStartThresholdChange(event: Event): void {
    this.dragStartThreshold = parseInt((event.target as HTMLInputElement).value, 10);
  }

  generateLayout(): void {
    const layout: KtdGridLayout = [];
    for (let i = 0; i < this.cols; i++) {
      const y = Math.ceil(Math.random() * 4) + 1;
      layout.push({
        x: Math.round(Math.random() * (Math.floor((this.cols / 2) - 1))) * 2,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        id: i.toString()
        // static: Math.random() < 0.05
      });
    }
    console.log('layout', layout);
    this.layout = layout;
  }

  /** Adds a grid item to the layout */
  addItemToLayout(): void {
    const maxId = this.layout.reduce( (acc: any, cur: any) => Math.max(acc, parseInt(cur.id, 10)), -1);
    const nextId = maxId + 1;

    const newLayoutItem: KtdGridLayoutItem = {
      id: nextId.toString(),
      x: 0,
      y: 0,
      w: 2,
      h: 2
    };

    // Important: Don't mutate the array, create new instance. This way notifies the Grid component that the layout has changed.
    this.layout = [
      newLayoutItem,
      ...this.layout
    ];
  }

  /**
   * Fired when a mousedown happens on the remove grid item button.
   * Stops the event from propagating an causing the drag to start.
   * We don't want to drag when mousedown is fired on remove icon button.
   */
  stopEventPropagation(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  /** Removes the item from the layout */
  removeItem(id: string): void {
    // Important: Don't mutate the array. Let Angular know that the layout has changed creating a new reference.
    console.log(this.layout);
    this.layout = this.ktdArrayRemoveItem(this.layout, (item: any) => item.id === id);
    console.log(this.layout);
  }

  ktdArrayRemoveItem<T>(array: T[], condition: (item: T) => boolean): any[] {
    const arrayCopy = [...array];
    const index = array.findIndex((item) => condition(item));
    if (index > -1) {
        arrayCopy.splice(index, 1);
    }
    return arrayCopy;
}
}
