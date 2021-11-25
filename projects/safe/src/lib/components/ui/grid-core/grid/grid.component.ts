import { Component, EventEmitter, Inject, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ColumnReorderEvent, GridComponent, GridDataResult, PageChangeEvent, RowArgs, SelectionEvent } from '@progress/kendo-angular-grid';
import { SafeExpandedCommentComponent } from '../expanded-comment/expanded-comment.component';
import get from 'lodash/get';
import { MatDialog } from '@angular/material/dialog';
import { GRADIENT_SETTINGS, MULTISELECT_TYPES, PAGER_SETTINGS, SELECTABLE_SETTINGS } from './grid.constants';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import { CalendarDOMService, MonthViewService, WeekNamesService } from '@progress/kendo-angular-dateinputs';
import { PopupService } from '@progress/kendo-angular-popup';
import { GridAction } from '../models/grid-action.model';
import { FormGroup } from '@angular/forms';
import { SafeGridService } from '../../../../services/grid.service';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

const matches = (el: any, selector: any) => (el.matches || el.msMatchesSelector).call(el, selector);

@Component({
  selector: 'safe-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [
    PopupService,
    ResizeBatchService,
    CalendarDOMService,
    MonthViewService,
    WeekNamesService,
    { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    { provide: MAT_TOOLTIP_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
    { provide: MAT_MENU_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] },
  ]
})
export class SafeGridComponent implements OnInit {

  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  // === DATA ===
  @Input() fields: any[] = [];
  @Input() data: GridDataResult = { data: [], total: 0 };
  @Input() loading = false;
  @Input() error = false;
  @Output() openRecord = new EventEmitter();

  // === EXPORT ===
  @Input() exportable = true;

  // === EDITION ===
  @Input() editable = false;
  public formGroup: FormGroup = new FormGroup({});
  private currentEditedId = '';
  private currentEditedRow = 0;
  public gradientSettings = GRADIENT_SETTINGS;
  public editing = false;

  // === ACTIONS ===
  @Input() toolbarActions: GridAction[] = [];
  @Input() rowActions: GridAction[] = [];
  @Output() action = new EventEmitter();

  // === DISPLAY ===
  @Input() resizable = true;
  @Input() reorderable = true;
  get columnMenu(): { columnChooser: boolean, filter: boolean } {
    return {
      columnChooser: false,
      filter: !this.showFilter
    };
  }
  @Output() columnChange = new EventEmitter();

  // === SELECT ===
  @Input() selectable = true;
  @Input() multiSelect = true;
  public selectableSettings = SELECTABLE_SETTINGS;
  @Input() selectedRows: any[] = [];
  @Output() selectionChange = new EventEmitter();

  // === FILTER ===
  @Input() filterable = true;
  @Input() showFilter = false;
  @Input() filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  @Output() filterChange = new EventEmitter();

  // === PAGINATION ===
  @Input() pageSize = 10;
  @Input() skip = 0;
  public pagerSettings = PAGER_SETTINGS;
  @Output() pageChange = new EventEmitter();

  // === SORT ===
  @Input() sortable = true;
  @Input() sort: SortDescriptor[] = [];
  @Output() sortChange = new EventEmitter();

  // === TEMPLATE ===
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  constructor(
    @Inject('environment') environment: any,
    private dialog: MatDialog,
    private gridService: SafeGridService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
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

  // === FILTER ===

  /**
   * Handles filter change event.
   * @param filter Filter event.
   */
  public onFilterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.filterChange.emit(filter);
  }

  /**
   * Toggles quick filter visibility
   */
  public onToggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.onFilterChange({ logic: 'and', filters: [] });
  }

  // === SORT ===
  /**
   * Handles sort change event.
   * @param sort Sort event.
   */
  public onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.sortChange.emit(sort);
  }

  // === PAGINATION ===
  /**
   * Handles page change event.
   * @param page Page event.
   */
  public onPageChange(page: PageChangeEvent): void {
    if (!this.loading) {
      this.skip = page.skip;
      this.pageSize = page.take;
      this.pageChange.emit(page);
    }
  }

  // === SELECT ===
  /**
   * Handles selection change event.
   * @param selection Selection event.
   */
  public onSelectionChange(selection: SelectionEvent): void {
    this.selectedRows = selection.selectedRows?.map(x => x.dataItem.id) || [];
    this.selectionChange.emit(selection);
  }

  /**
   * Returns selected status of a row.
   * @param row Row to test.
   * @returns selected status of the row.
   */
  public isRowSelected = (row: RowArgs) => this.selectedRows.includes(row.index);

  // === LAYOUT ===
  /**
   * Set and emit new grid configuration after column reorder event.
   * @param e ColumnReorderEvent
   */
  onColumnReorder(e: ColumnReorderEvent): void {
    if ((e.oldIndex !== e.newIndex)) {
      // const columnsOrder = this.grid?.columns.toArray().sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((x: any) => x.field) || [];
      const columnsOrder: any[] = [];
      const tempFields: any[] = [];
      let j = 0;
      const oldIndex = e.oldIndex;
      const newIndex = e.newIndex;

      for (let i = 0; i < columnsOrder.length; i++) {
        if (i === newIndex) {
          if (oldIndex < newIndex) {
            tempFields[j] = columnsOrder[i];
            j++;
            tempFields[j] = columnsOrder[oldIndex];
          }
          if (oldIndex > newIndex) {
            tempFields[j] = columnsOrder[oldIndex];
            j++;
            tempFields[j] = columnsOrder[i];
          }
          j++;
        }
        else if (i !== oldIndex) {
          tempFields[j] = columnsOrder[i];
          j++;
        }
      }
      this.columnChange.emit(tempFields.filter(x => x !== undefined));
    }
  }

  /**
   * Sets and emits new grid configuration after column resize event.
   */
  onColumnResize(): void {
    this.columnChange.emit();
  }

  /**
   * Sets and emits new grid configuration after column visibility event.
   */
  onColumnVisibilityChange(): void {
    this.columnChange.emit();
  }

  // === INLINE EDITION ===

  /**
   * Detects cell click event and opens row form if user is authorized.
   * @param param0 click event.
   */
   public cellClickHandler({ isEdited, dataItem, rowIndex }: any): void {
    // Parameters that prevent the inline edition.
    if (!this.data.data[rowIndex - this.skip].canUpdate || !this.editable ||
      isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }
    // Closes current inline edition.
    if (this.currentEditedId) {
      if (this.formGroup.dirty) {
        console.log('update');
        // this.update(this.currentEditedId, this.formGroup.value);
      }
      this.closeEditor();
    }
    // creates the form group.
    this.formGroup = this.gridService.createFormGroup(dataItem, this.fields);
    this.currentEditedId = dataItem.id;
    this.currentEditedRow = rowIndex;
    this.grid?.editRow(rowIndex, this.formGroup);
  }

  /**
   * Detects document click to save record if outside the inline edition form.
   * @param e click event.
   */
   private onDocumentClick(e: any): void {
    if (this.formGroup && this.formGroup.valid &&
      !matches(e.target, '#recordsGrid tbody *, #recordsGrid .k-grid-toolbar .k-button .k-animation-container')) {
      if (this.formGroup.dirty) {
        console.log('update');
        // this.update(this.currentEditedId, this.formGroup.value);
      }
      this.closeEditor();
    }
  }

  /**
   * Closes the inline edition.
   */
   private closeEditor(): void {
    this.grid?.closeRow(this.currentEditedRow);
    this.grid?.cancelCell();
    this.currentEditedRow = 0;
    this.currentEditedId = '';
    this.editing = false;
    this.formGroup = new FormGroup({});
  }

  /**
   * Finds item in data items and updates it with new values, from inline edition.
   * @param id Item id.
   * @param value Updated value of the item.
   */
  //  private update(id: string, value: any): void {
  //   const item = this.updatedItems.find(x => x.id === id);
  //   if (item) {
  //     Object.assign(item, { ...value, id });
  //   } else {
  //     this.updatedItems.push({ ...value, id });
  //   }
  //   Object.assign(this.items.find(x => x.id === id), value);
  // }

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
    console.log('on expand');
    // const dialogRef = this.dialog.open(SafeExpandedCommentComponent, {
    //   data: {
    //     title: field.title,
    //     comment: get(item, field.name)
    //   },
    //   autoFocus: false,
    //   position: {
    //     bottom: '0',
    //     right: '0'
    //   },
    //   panelClass: 'expanded-widget-dialog'
    // });
    // dialogRef.afterClosed().subscribe(res => {
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
    // });
  }
}
