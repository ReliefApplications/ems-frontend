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
import { MatDialog } from '@angular/material/dialog';
import {
  EXPORT_SETTINGS,
  GRADIENT_SETTINGS,
  MULTISELECT_TYPES,
  PAGER_SETTINGS,
  SELECTABLE_SETTINGS,
  ICON_EXTENSIONS,
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
import { SafeGridService } from '../../../../services/grid/grid.service';
import { SafeDownloadService } from '../../../../services/download/download.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SafeExportComponent } from '../export/export.component';
import { GridLayout } from '../models/grid-layout.model';
import { SafeErrorsModalComponent } from '../errors-modal/errors-modal.component';
import { get } from 'lodash';
import { SafeTileDataComponent } from '../../../widget-grid/floating-options/menu/tile-data/tile-data.component';
import { SafeDashboardService } from '../../../../services/dashboard/dashboard.service';

/**
 * Factory for creating scroll strategy
 *
 * @param overlay The overlay
 * @returns A function that returns a block scroll strategy
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

/**
 * Test if an element match a css selector
 *
 * @param el A dom element
 * @param selector A selector
 * @returns A boolean, indicating if the element matches the selector
 */
const matches = (el: any, selector: any) =>
  (el.matches || el.msMatchesSelector).call(el, selector);

/** Component for grid widgets */
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
  @Input() widget: any;
  @Input() canUpdate = false;

  // === EXPORT ===
  public exportSettings = EXPORT_SETTINGS;
  @Output() export = new EventEmitter();

  // === EDITION ===
  @Input() editable = false;
  @Input() hasChanges = false;
  @Output() edit: EventEmitter<any> = new EventEmitter();
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
    export: false,
    showDetails: false,
  };
  @Input() hasDetails = true;
  @Output() action = new EventEmitter();

  /** @returns A boolean indicating if actions are enabled */
  get hasEnabledActions(): boolean {
    return Object.values(this.actions).includes(true);
  }

  // === DISPLAY ===
  @Input() resizable = true;
  @Input() reorderable = true;

  /** @returns The column menu */
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
  public selectedItems: any[] = [];

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

  /**
   * Constructor of the grid component
   *
   * @param dialog The material dialog service
   * @param gridService The grid service
   * @param renderer The renderer library
   * @param downloadService The download service
   * @param dashboardService Dashboard service
   */
  constructor(
    private dialog: MatDialog,
    private gridService: SafeGridService,
    private renderer: Renderer2,
    private downloadService: SafeDownloadService,
    private dashboardService: SafeDashboardService
  ) {}

  ngOnInit(): void {
    this.setSelectedItems();
    this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    // this way we can wait for 2s before sending an update
    this.search.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
  }

  ngAfterViewInit(): void {
    this.setSelectedItems();
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
    const meta = this.fields.find((x) => x.name === path)?.meta;
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

  /**
   * Returns property value in object from path. Specific for multiselect reference data.
   *
   * @param item Item to get property of.
   * @param path Path of the property.
   * @param attribute Path of the final attribute.
   * @returns Value of the property.
   */
  public getReferenceDataPropertyValue(
    item: any,
    path: string,
    attribute: string
  ): any {
    const values = get(item, path);
    if (Array.isArray(values)) {
      return values.map((x) => x[attribute]).join(', ');
    }
  }

  /**
   * Returns field style from path.
   *
   * @param item Item to get style of.
   * @param path Path of the property.
   * @returns Style fo the property.
   */
  public getStyle(item: any, path: string): any {
    const fieldStyle = get(item, `_meta.style.${path}`);
    const rowStyle = get(item, '_meta.style._row');
    return fieldStyle ? fieldStyle : rowStyle;
  }

  /**
   * Returns full URL value.
   * TODO: avoid template call
   *
   * @param url Initial URL.
   * @returns full valid URL.
   */
  public getUrl(url: string): URL | null {
    if (url && !(url.startsWith('https://') || url.startsWith('http://'))) {
      url = 'https://' + url;
    }
    try {
      return new URL(url);
    } catch {
      return null;
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
      this.onFilterChange({
        logic: 'and',
        filters: this.showFilter ? [] : this.filter.filters,
      });
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
    this.setSelectedItems();
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

  /**
   * Set array of selected items from selected rows.
   */
  private setSelectedItems(): void {
    this.selectedItems = this.data.data.filter((x) =>
      this.selectedRows.includes(x.id)
    );
  }

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

  /** @returns Visible columns of the grid. */
  get visibleFields(): any {
    const extractFieldFromColumn = (column: any): any => ({
      [column.field]: {
        field: column.field,
        title: column.title,
        width: column.width,
        hidden: column.hidden,
        order: column.orderIndex,
        subFields:
          this.fields.find((x) => x.name === column.field)?.subFields || [],
      },
    });
    return this.grid?.columns
      .toArray()
      .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
      .filter((x: any) => x.field || x.hasChildren)
      .reduce(
        (obj, c: any) => ({
          ...obj,
          ...(c.field && extractFieldFromColumn(c)),
          ...(c.hasChildren &&
            c.childrenArray.reduce(
              (objChildren: any, y: any) => ({
                ...objChildren,
                ...(y.field && extractFieldFromColumn(y)),
              }),
              {}
            )),
        }),
        {}
      );
  }

  /** @returns Current grid layout. */
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
   * @param param0.isEdited a boolean indicating if the cell is edited
   * @param param0.dataItem the data item of the cell
   * @param param0.rowIndex the row index of the cell
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
   * @param field field name.
   */
  public onExpandText(item: any, field: any): void {
    const dialogRef = this.dialog.open(SafeExpandedCommentComponent, {
      data: {
        title: field.title,
        comment: get(item, field),
        readonly:
          !this.actions.update ||
          !item.canUpdate ||
          this.fields.find((val) => val.name === field).meta.readOnly,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res && res !== get(item, field)) {
        const value = { field: res };
        this.action.emit({ action: 'edit', item, value });
      }
    });
  }

  /**
   * Open a modal to show the errors
   *
   * @param item The item of the grid
   */
  public showErrors(item: any): void {
    const dialogRef = this.dialog.open(SafeErrorsModalComponent, {
      data: {
        incrementalId: item.incrementalId,
        errors: item.validationErrors,
      },
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.action.emit({ action: 'update', item });
      }
    });
  }

  /**
   * Emit an event to open settings window
   */
  public openSettings(): void {
    const dialogRef = this.dialog.open(SafeTileDataComponent, {
      disableClose: true,
      data: {
        tile: this.widget,
        template: this.dashboardService.findSettingsTemplate(this.widget),
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.edit.emit({ type: 'data', id: this.widget.id, options: res });
      }
    });
  }

  /**
   * Gets the kendo class icon for the file extension
   *
   * @param name Name of the file with the extension
   * @returns String with the name of the icon class
   */
  public getFileIcon(name: string): string {
    const fileExt = name.split('.').pop();
    return fileExt && ICON_EXTENSIONS[fileExt]
      ? ICON_EXTENSIONS[fileExt]
      : 'k-i-file';
  }

  /**
   * Removes file estension from the file name
   *
   * @param name Name of the file with the extension
   * @returns String with the name of the file without the extension
   */
  public removeFileExtension(name: string): string {
    const fileExt = name.split('.').pop();
    return fileExt && ICON_EXTENSIONS[fileExt]
      ? name.slice(0, name.lastIndexOf(fileExt) - 1)
      : name;
  }
}
