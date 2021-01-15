import { CdkDragEnter, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WhoExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';

@Component({
  selector: 'who-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss']
})
export class WhoWidgetGridComponent implements OnInit, AfterViewInit {

  @Input() widgets: any[];
  @Input() canUpdate: boolean;

  // === GRID ===
  @ViewChildren(CdkDropList) dropsQuery: QueryList<CdkDropList>;
  drops: CdkDropList[];
  colsNumber = 8;

  // === EVENT EMITTER ===
  @Output() move: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() toggleHistory: EventEmitter<any> = new EventEmitter();


  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.colsNumber = this.setColsNumber(window.innerWidth);
  }

  /*  Material grid once template ready.
  */
  ngAfterViewInit(): void {
    this.dropsQuery.changes.subscribe(() => {
      this.drops = this.dropsQuery.toArray();
    });
    Promise.resolve().then(() => {
      this.drops = this.dropsQuery.toArray();
    });
  }

  /*  Change display when windows size changes.
  */
  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.colsNumber = this.setColsNumber(event.target.innerWidth);
  }

  /*  Change the number of displayed columns.
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
    return 8;
  }

  /*  Drag and drop a widget to move it.
  */
  onMove($event: CdkDragEnter): void {
    moveItemInArray(this.widgets, $event.item.data, $event.container.data);
    this.move.emit();
  }

  onEditWidget(e: any): void {
    this.edit.emit(e);
  }

  onDeleteWidget(e: any): void {
    this.delete.emit(e);
  }

  onExpandWidget(e: any): void {
    const widget = this.widgets.find(x => x.id === e.id);
    this.dialog.open(WhoExpandedWidgetComponent, {
      data: {
        widget
      },
      autoFocus: false,
      // hasBackdrop: false,
      position: {
        bottom: '0',
        right: '0'
      },
      panelClass: 'expanded-widget-dialog'
    });
  }

  toggleHistoryEvent(event): void {
    this.toggleHistory.emit(event);
  }

}
