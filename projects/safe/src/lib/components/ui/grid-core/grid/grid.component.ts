import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SafeExpandedCommentComponent } from '../expanded-comment/expanded-comment.component';
import get from 'lodash/get';
import { MatDialog } from '@angular/material/dialog';
import { MULTISELECT_TYPES, PAGER_SETTINGS } from './grid.constants';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'safe-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class SafeGridComponent implements OnInit {

  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  // === PAGINATION ===
  @Input() pageSize = 10;
  @Input() skip = 0;
  public pagerSettings = PAGER_SETTINGS;
  @Output() pageChange = new EventEmitter();

  // === DATA ===
  @Input() fields: any[] = [];
  @Input() data: GridDataResult = { data: [], total: 0 };
  @Input() loading = false;
  @Input() error = false;

  // === DISPLAY ===
  @Input() resizable = true;
  @Input() reorderable = true;

  // === SORT ===
  @Input() sortable = true;
  @Input() sort: SortDescriptor[] = [];
  @Output() sortChange = new EventEmitter();

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  // === DATA ===
  /**
   * Displays text instead of values for questions with select.
   * @param meta meta data of the question.
   * @param value question value.
   * @returns text value of the question.
   */
  public getDisplayText(value: string | string[], meta: { choices?: { value: string, text: string }[] }): string | string[] {
    if (meta.choices) {
      if (Array.isArray(value)) {
        return meta.choices.reduce((acc: string[], x) => value.includes(x.value) ? acc.concat([x.text]) : acc, []);
      } else {
        return meta.choices.find(x => x.value === value)?.text || '';
      }
    } else {
      return value;
    }
  }

  // === EXPORT ===
  /**
   * Downloads file of record.
   * @param file File to download.
   */
  public onDownload(file: any): void {
    console.log('donwload');
  }

  // === UTILITIES ===
  /**
   * Checks if element overflows
   * @param e Component resizing event.
   * @returns True if overflows.
   */
  isEllipsisActive(e: any): boolean {
    return (e.offsetWidth < e.scrollWidth);
  }

  /**
   * Expands text in a full window modal.
   * @param item Item to display data of.
   * @param rowTitle field name.
   */
  public onExpandText(item: any, field: any): void {
    const dialogRef = this.dialog.open(SafeExpandedCommentComponent, {
      data: {
        title: field.title,
        comment: get(item, field.name)
      },
      autoFocus: false,
      position: {
        bottom: '0',
        right: '0'
      },
      panelClass: 'expanded-widget-dialog'
    });
    dialogRef.afterClosed().subscribe(res => {
      // TODO: finish that
      // if (res !== item[rowTitle]) {
      //   this.gridData.data.find(x => x.id === item.id)[rowTitle] = res;
      //   this.items.find(x => x.id === item.id)[rowTitle] = res;
      //   if (this.updatedItems.find(x => x.id === item.id) !== undefined) {
      //     this.updatedItems.find(x => x.id === item.id)[rowTitle] = res;
      //   }
      //   else {
      //     this.updatedItems.push({ [rowTitle]: res, id: item.id });
      //   }
      // }
    });
  }
}
