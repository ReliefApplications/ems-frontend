import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  ColumnReorderEvent,
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  RowArgs,
  SelectionEvent,
} from '@progress/kendo-angular-grid';
import { SafeExpandedCommentComponent } from '../expanded-comment/expanded-comment.component';
import get from 'lodash/get';
import { MatDialog } from '@angular/material/dialog';
import {
  EXPORT_SETTINGS,
  GRADIENT_SETTINGS,
  MULTISELECT_TYPES,
  PAGER_SETTINGS,
  SELECTABLE_SETTINGS,
} from './grid.constants';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import {
  CalendarDOMService,
  MonthViewService,
  WeekNamesService,
} from '@progress/kendo-angular-dateinputs';
import { PopupService } from '@progress/kendo-angular-popup';
import { FormControl, FormGroup } from '@angular/forms';
import { SafeGridService } from '../../../../services/grid.service';
import { SafeDownloadService } from '../../../../services/download.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SafeExportComponent } from '../export/export.component';
import { GridLayout } from '../models/grid-layout.model';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

const matches = (el: any, selector: any) =>
  (el.matches || el.msMatchesSelector).call(el, selector);

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
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_TOOLTIP_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_MENU_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeGridComponent implements OnInit, AfterViewInit {
  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  // === DATA ===
  @Input() fields: any[] = [];
  @Input() data: GridDataResult = { data: [], total: 0 };
  @Input() loading = false;
  @Input() error = false;
  @Input() blank = false;

  // === EXPORT ===
  @Input() exportable = true;
  public exportSettings = EXPORT_SETTINGS;
  @Output() export = new EventEmitter();

  // === EDITION ===
  @Input() editable = false;
  @Input() hasChanges = false;
  public formGroup: FormGroup = new FormGroup({});
  private currentEditedRow = 0;
  private currentEditedItem: any;
  public gradientSettings = GRADIENT_SETTINGS;
  public editing = false;

  // === ACTIONS ===
  @Input() actions = {
    add: false,
    update: false,
    delete: false,
    history: false,
    convert: false,
  };
  @Input() hasDetails = true;
  @Output() action = new EventEmitter();
  get hasEnabledActions(): boolean {
    return Object.values(this.actions).includes(true);
  }

  // === DISPLAY ===
  @Input() resizable = true;
  @Input() reorderable = true;
  get columnMenu(): { columnChooser: boolean; filter: boolean } {
    return {
      columnChooser: false,
      filter: !this.showFilter,
    };
  }

  // === SELECT ===
  @Input() selectable = true;
  @Input() multiSelect = true;
  public selectableSettings = SELECTABLE_SETTINGS;
  @Input() selectedRows: string[] = [];
  @Output() selectionChange = new EventEmitter();

  // === FILTER ===
  @Input() filterable = true;
  @Input() showFilter = false;
  @Input() filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  @Output() filterChange = new EventEmitter();
  @Output() showFilterChange = new EventEmitter();
  @Input() searchable = true;
  public search = new FormControl('');
  @Output() searchChange = new EventEmitter();

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

  // === ADMIN ===
  @Input() admin = false;
  private columnsOrder: any[] = [];
  @Output() columnChange = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private gridService: SafeGridService,
    private renderer: Renderer2,
    private downloadService: SafeDownloadService
  ) {}

  ngOnInit(): void {
    this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    // this way we can wait for 2s before sending an update
    this.search.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
  }

  ngAfterViewInit(): void {
    // Wait for columns to be reordered before updating the layout
    this.grid?.columnReorder.subscribe((res) =>
      setTimeout(() => this.columnChange.emit(), 500)
    );
  }

  // === DATA ===
  /**
   * Returns property value in object from path.
   *
   * @param item Item to get property of.
   * @param path Path of the property.
   * @returns Value of the property.
   */
  public getPropertyValue(item: any, path: string): any {
    const meta = this.fields.find((x) => x.name === path).meta;
    const value = get(item, path);
    if (meta.choices) {
      if (Array.isArray(value)) {
        return meta.choices.reduce(
          (acc: string[], x: any) =>
            value.includes(x.value) ? acc.concat([x.text]) : acc,
          []
        );
      } else {
        return meta.choices.find((x: any) => x.value === value)?.text || '';
      }
    } else {
      return value;
    }
  }

  // === FILTER ===
  /**
   * Handles filter change event.
   *
   * @param filter Filter event.
   */
  public onFilterChange(filter: CompositeFilterDescriptor): void {
    if (!this.loading) {
      this.filter = filter;
      this.filterChange.emit(filter);
    }
  }

  /**
   * Toggles quick filter visibility
   */
  public onToggleFilter(): void {
    if (!this.loading) {
      this.showFilter = !this.showFilter;
      this.showFilterChange.emit(this.showFilter);
      this.onFilterChange({ logic: 'and', filters: [] });
    }
  }

  /**
   * Searchs through all text columns.
   *
   * @param search text input value.
   */
  public onSearch(search: any): void {
    this.searchChange.emit(search);
  }

  // === SORT ===
  /**
   * Handles sort change event.
   *
   * @param sort Sort event.
   */
  public onSortChange(sort: SortDescriptor[]): void {
    if (!this.loading) {
      this.sort = sort;
      this.sortChange.emit(sort);
    }
  }

  // === PAGINATION ===
  /**
   * Handles page change event.
   *
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
   *
   * @param selection Selection event.
   */
  public onSelectionChange(selection: SelectionEvent): void {
    const deselectedRows = selection.deselectedRows || [];
    const selectedRows = selection.selectedRows || [];
    if (deselectedRows.length > 0) {
      this.selectedRows = [
        ...this.selectedRows.filter(
          (x) => !deselectedRows.some((y) => x === y.dataItem.id)
        ),
      ];
    }
    if (selectedRows.length > 0) {
      this.selectedRows = this.selectedRows.concat(
        selectedRows.map((x) => x.dataItem.id)
      );
    }
    this.selectionChange.emit(selection);
  }

  /**
   * Returns selected status of a row.
   *
   * @param row Row to test.
   * @returns selected status of the row.
   */
  public isRowSelected = (row: RowArgs) =>
    this.selectedRows.includes(row.dataItem.id);

  // === LAYOUT ===
  /**
   * Set and emit new grid configuration after column reorder event.
   *
   * @param e ColumnReorderEvent
   */
  onColumnReorder(e: ColumnReorderEvent): void {
    this.columnChange.emit();
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

  /**
   * Returns the visible columns of the grid.
   */
  get visibleFields(): any {
    return this.grid?.columns
      .toArray()
      .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
      .filter((x: any) => x.field)
      .reduce(
        (obj, c: any) => ({
          ...obj,
          [c.field]: {
            field: c.field,
            title: c.title,
            width: c.width,
            hidden: c.hidden,
            order: c.orderIndex,
          },
        }),
        {}
      );
  }

  /**
   * Returns the current grid layout.
   */
  get layout(): GridLayout {
    return {
      fields: this.visibleFields,
      sort: this.sort,
      filter: this.filter,
      showFilter: this.showFilter,
    };
  }

  // === INLINE EDITION ===

  /**
   * Detects cell click event and opens row form if user is authorized.
   *
   * @param param0 click event.
   */
  public cellClickHandler({ isEdited, dataItem, rowIndex }: any): void {
    // Parameters that prevent the inline edition.
    if (
      !this.data.data[rowIndex - this.skip].canUpdate ||
      !this.editable ||
      isEdited ||
      (this.formGroup && !this.formGroup.valid)
    ) {
      return;
    }
    // Closes current inline edition.
    if (this.currentEditedItem) {
      if (this.formGroup.dirty) {
        this.action.emit({
          action: 'edit',
          item: this.currentEditedItem,
          value: this.formGroup.value,
        });
      }
      this.closeEditor();
    }
    // creates the form group.
    this.formGroup = this.gridService.createFormGroup(dataItem, this.fields);
    this.currentEditedItem = dataItem;
    this.currentEditedRow = rowIndex;
    this.grid?.editRow(rowIndex, this.formGroup);
  }

  /**
   * Detects document click to save record if outside the inline edition form.
   *
   * @param e click event.
   */
  private onDocumentClick(e: any): void {
    if (
      !this.editing &&
      this.formGroup &&
      this.formGroup.valid &&
      !matches(
        e.target,
        '#recordsGrid tbody *, #recordsGrid .k-grid-toolbar .k-button .k-animation-container'
      )
    ) {
      if (this.formGroup.dirty) {
        this.action.emit({
          action: 'edit',
          item: this.currentEditedItem,
          value: this.formGroup.value,
        });
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
    this.currentEditedItem = null;
    this.editing = false;
    this.formGroup = new FormGroup({});
  }

  /**
   * Saves edition.
   */
  public onSave(): void {
    // Closes the editor, and saves the value locally
    if (this.formGroup.dirty) {
      this.action.emit({
        action: 'edit',
        item: this.currentEditedItem,
        value: this.formGroup.value,
      });
    }
    this.closeEditor();
    this.action.emit({ action: 'save' });
  }

  /**
   * Cancels edition.
   */
  public onCancel(): void {
    this.closeEditor();
    this.action.emit({ action: 'cancel' });
  }

  // === EXPORT ===
  /**
   * Downloads file of record.
   *
   * @param file File to download.
   */
  public onDownload(file: any): void {
    const path = `download/file/${file.content}`;
    this.downloadService.getFile(path, file.type, file.name);
  }

  /**
   * Opens export modal.
   */
  public onExport(): void {
    const dialogRef = this.dialog.open(SafeExportComponent, {
      data: {
        export: this.exportSettings,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.exportSettings = res;
        this.export.emit(this.exportSettings);
      }
    });
  }

  // === UTILITIES ===
  /**
   * Checks if element overflows
   *
   * @param e Component resizing event.
   * @returns True if overflows.
   */
  isEllipsisActive(e: any): boolean {
    return e.offsetWidth < e.scrollWidth;
  }

  /**
   * Expands text in a full window modal.
   *
   * @param item Item to display data of.
   * @param rowTitle field name.
   */
  public onExpandText(item: any, field: any): void {
    const dialogRef = this.dialog.open(SafeExpandedCommentComponent, {
      data: {
        title: field.title,
        comment: get(item, field),
        readonly: !this.actions.update,
      },
      autoFocus: false,
      position: {
        bottom: '0',
        right: '0',
      },
      panelClass: 'expanded-widget-dialog',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res !== get(item, field)) {
        const value = { field: res };
        this.action.emit({ action: 'edit', item, value });
      }
    });
  }
}
