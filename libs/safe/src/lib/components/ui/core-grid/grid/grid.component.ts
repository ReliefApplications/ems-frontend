import {
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  GridComponent,
  GridDataResult,
  PageChangeEvent,
  RowArgs,
  SelectionEvent,
} from '@progress/kendo-angular-grid';
import { Dialog } from '@angular/cdk/dialog';
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
import { ResizeBatchService } from '@progress/kendo-angular-common';
// import {
//   CalendarDOMService,
//   MonthViewService,
//   WeekNamesService,
// } from '@progress/kendo-angular-dateinputs';
import { PopupService } from '@progress/kendo-angular-popup';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { SafeGridService } from '../../../../services/grid/grid.service';
import { SafeDownloadService } from '../../../../services/download/download.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { GridLayout } from '../models/grid-layout.model';
import { get, intersection, isNil } from 'lodash';
import { applyLayoutFormat } from '../../../../utils/parser/utils';
import { SafeDashboardService } from '../../../../services/dashboard/dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

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
    // CalendarDOMService,
    // MonthViewService,
    // WeekNamesService,
  ],
})
export class SafeGridComponent
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit, OnChanges
{
  public multiSelectTypes: string[] = MULTISELECT_TYPES;

  public environment: 'frontoffice' | 'backoffice';
  public statusMessage = '';

  // === DATA ===
  @Input() fields: any[] = [];
  @Input() data: GridDataResult = { data: [], total: 0 };
  @Input() loadingRecords = false;
  @Input() loadingSettings = true;
  @Input() status: {
    error: boolean;
    message?: string;
  } = {
    error: false,
  };
  @Input() blank = false;
  @Input() widget: any;
  @Input() canUpdate = false;

  // === EXPORT ===
  public exportSettings = EXPORT_SETTINGS;
  @Output() export = new EventEmitter();

  // === EDITION ===
  /** If inlineEdition is allowed */
  @Input() editable = false;
  @Input() hasChanges = false;
  @Output() edit: EventEmitter<any> = new EventEmitter();
  public formGroup: UntypedFormGroup = new UntypedFormGroup({});
  private currentEditedRow = 0;
  private currentEditedItem: any;
  public gradientSettings = GRADIENT_SETTINGS;
  public editing = false;

  private readonly rowActions = ['update', 'delete', 'history', 'convert'];

  // === ACTIONS ===
  @Input() actions = {
    add: false,
    update: false,
    delete: false,
    history: false,
    convert: false,
    export: false,
    showDetails: false,
    remove: false,
  };
  @Input() hasDetails = true;
  @Output() action = new EventEmitter();

  /** @returns A boolean indicating if actions are enabled */
  get hasEnabledActions(): boolean {
    return (
      intersection(
        Object.keys(this.actions).filter((key: string) =>
          get(this.actions, key, false)
        ),
        this.rowActions
      ).length > 0
    );
  }

  /** @returns show border of grid */
  get showBorder(): boolean {
    return get(this.widget, 'settings.widgetDisplay.showBorder', true);
  }

  // === DISPLAY ===
  @Input() resizable = true;
  @Input() reorderable = true;
  @Input() canAdd = false;

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
  public showColumnChooser = false;

  // === FILTER ===
  @Input() filterable = true;
  @Input() showFilter = false;
  @Input() filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  @Output() filterChange = new EventEmitter();
  @Output() showFilterChange = new EventEmitter();
  @Input() searchable = true;
  public search = new UntypedFormControl('');
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
  public grid?: GridComponent;

  // === ADMIN ===
  @Input() admin = false;
  private columnsOrder: any[] = [];
  @Output() columnChange = new EventEmitter();

  // === SNACKBAR ===
  private snackBarRef!: any;

  /**
   * Constructor of the grid component
   *
   * @param environment Current environment
   * @param dialog The Dialog service
   * @param gridService The grid service
   * @param renderer The renderer library
   * @param downloadService The download service
   * @param dashboardService Dashboard service
   * @param translate The translate service
   * @param snackBar The snackbar service
   */
  constructor(
    @Inject('environment') environment: any,
    private dialog: Dialog,
    private gridService: SafeGridService,
    private renderer: Renderer2,
    private downloadService: SafeDownloadService,
    private dashboardService: SafeDashboardService,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {
    super();
    this.environment = environment.module || 'frontoffice';
  }

  ngOnInit(): void {
    this.setSelectedItems();
    this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
    // this way we can wait for 2s before sending an update
    this.search.valueChanges
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
    this.selectableSettings = {
      ...this.selectableSettings,
      mode: this.multiSelect ? 'multiple' : 'single',
    };
  }

  ngOnChanges(): void {
    this.statusMessage = this.getStatusMessage();
  }

  ngAfterViewInit(): void {
    this.setSelectedItems();
    // Wait for columns to be reordered before updating the layout
    this.grid?.columnReorder.subscribe(() =>
      setTimeout(() => this.columnChange.emit(), 500)
    );
  }

  // === DATA ===
  /**
   * Returns property value in object from path.
   *
   * @param item Item to get property of.
   * @param field parent field
   * @param subField subfield ( optional, used by reference data)
   * @returns Value of the property.
   */
  public getPropertyValue(item: any, field: any, subField?: any): any {
    let value = get(item, field.name);
    const meta = subField ? subField.meta : field.meta;
    if (meta.choices) {
      if (Array.isArray(value)) {
        if (subField) {
          if (meta.graphQLFieldName) {
            value = value.map((x) => get(x, meta.graphQLFieldName));
          }
        }
        const text = meta.choices.reduce(
          (acc: string[], x: any) =>
            value.includes(x.value) ? acc.concat([x.text]) : acc,
          []
        );
        if (text.length < value.length) {
          return value;
        } else {
          return text;
        }
      } else {
        return meta.choices.find((x: any) => x.value === value)?.text || value;
      }
    } else {
      if (meta.type === 'geospatial') {
        return [
          get(value, 'properties.address'),
          get(value, 'properties.countryName'),
        ]
          .filter((x) => x)
          .join(', ');
      }
      return value;
    }
  }

  // find field with the path name
  // const field = this.fields.find((x) => x.name === path);
  // const fieldMeta = field?.meta ?? {};
  // if (!fieldMeta) return '';

  // const graphQLName = Object.keys(fieldMeta).find(
  //   (x) => fieldMeta[x].name === attribute
  // );
  // if (!graphQLName) return '';

  // const values = get(item, path);
  // if (Array.isArray(values)) {
  //   return values.map((x) => x[graphQLName]).join(', ');
  // }

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
    // format filter before sending
    this.formatFilter(filter);

    if (!this.loadingRecords) {
      this.filter = filter;
      this.filterChange.emit(filter);
    }
  }

  /**
   * Format filter before sending.
   * Adjust date filters to remove timezone.
   *
   * @param filter Filter value.
   */
  private formatFilter(filter: any) {
    filter.filters.forEach((filter: any) => {
      // if there are sub filters
      if (filter.filters) {
        this.formatFilter(filter);
      } else if (filter.value instanceof Date) {
        const currentDate = filter.value;
        const hoursToAdjustTimezone = Math.floor(
          (currentDate as Date).getTimezoneOffset() / 60
        );
        const minutesToAdjustTimezone =
          (currentDate as Date).getTimezoneOffset() % 60;

        const dateObj = new Date(currentDate);
        dateObj.setHours(dateObj.getHours() - hoursToAdjustTimezone);
        dateObj.setMinutes(dateObj.getMinutes() - minutesToAdjustTimezone);
        // Convert the modified date back to the original format
        const modifiedDateString = dateObj
          .toISOString()
          .replace('T00:00:00.000Z', '');
        const modifiedDate = new Date(modifiedDateString);

        filter.value = modifiedDate;
      }
    });
  }

  /**
   * Toggles quick filter visibility
   */
  public onToggleFilter(): void {
    if (!this.loadingRecords) {
      this.showFilter = !this.showFilter;
      this.showFilterChange.emit(this.showFilter);
      this.onFilterChange({
        logic: 'and',
        filters: this.showFilter ? [] : this.filter.filters,
      });
    }
  }

  /**
   * Searches through all text columns.
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
    if (!this.loadingRecords) {
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
    if (!this.loadingRecords) {
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

  /**
   * Toggles the menu for choosing columns
   *
   * @param showColumnChooser optional parameter to decide of the state of the popup
   */
  public toggleColumnChooser(showColumnChooser?: boolean) {
    // Emit column change event
    if (this.showColumnChooser) {
      this.onColumnVisibilityChange();
    }
    if (showColumnChooser) {
      this.showColumnChooser = showColumnChooser;
    } else {
      this.showColumnChooser = !this.showColumnChooser;
    }
  }

  // === LAYOUT ===
  /**
   * Set and emit new grid configuration after column reorder event.
   */
  onColumnReorder(): void {
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
    this.closeEditor();
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
      this.closeEditor();
    }
  }

  /**
   * Closes the inline edition.
   */
  public closeEditor(): void {
    if (this.currentEditedItem) {
      if (this.formGroup.dirty) {
        this.action.emit({
          action: 'edit',
          item: this.currentEditedItem,
          value: this.formGroup.value,
        });
      }
    }
    this.grid?.closeRow(this.currentEditedRow);
    this.grid?.cancelCell();
    this.currentEditedRow = 0;
    this.currentEditedItem = null;
    this.editing = false;
    this.formGroup = new UntypedFormGroup({});
  }

  /**
   * Saves edition.
   */
  public onSave(): void {
    // Closes the editor, and saves the value locally
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
    if (file.content.startsWith('data')) {
      const downloadLink = document.createElement('a');
      downloadLink.href = file.content;
      downloadLink.download = file.name;
      downloadLink.click();
    } else {
      const path = `download/file/${file.content}`;
      this.downloadService.getFile(path, file.type, file.name);
    }
  }

  /**
   * Opens export modal.
   */
  public async onExport(): Promise<void> {
    const { SafeExportComponent } = await import('../export/export.component');
    const dialogRef = this.dialog.open(SafeExportComponent, {
      data: {
        export: this.exportSettings,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
  public async onExpandText(item: any, field: string): Promise<void> {
    // Lazy load expended comment component
    const { SafeExpandedCommentComponent } = await import(
      '../expanded-comment/expanded-comment.component'
    );
    const dialogRef = this.dialog.open(SafeExpandedCommentComponent, {
      data: {
        title: field,
        value: get(item, field),
        // Disable edition if cannot update / cannot do inline edition / cannot update item / field is readonly
        readonly:
          !this.actions.update ||
          !this.editable ||
          !item.canUpdate ||
          this.fields.find((val) => val.name === field).meta.readOnly,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      // Only update if value is not null or undefined, and different from previous value
      if (!isNil(value) && value !== get(item, field)) {
        // Create update
        const update = { [field]: value };
        // Emit update so the grid can handle the event and update its content
        this.action.emit({ action: 'edit', item, value: update });
      }
    });
  }

  /**
   * Open a modal to show the errors
   *
   * @param item The item of the grid
   */
  public async showErrors(item: any): Promise<void> {
    const { SafeErrorsModalComponent } = await import(
      '../errors-modal/errors-modal.component'
    );
    const dialogRef = this.dialog.open(SafeErrorsModalComponent, {
      data: {
        incrementalId: item.incrementalId,
        errors: item.validationErrors,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      if (res) {
        this.action.emit({ action: 'update', item });
      }
    });
  }

  /**
   * Emit an event to open settings window
   */
  public async openSettings(): Promise<void> {
    const { SafeTileDataComponent } = await import(
      '../../../widget-grid/floating-options/menu/tile-data/tile-data.component'
    );
    const dialogRef = this.dialog.open(SafeTileDataComponent, {
      disableClose: true,
      data: {
        tile: this.widget,
        template: this.dashboardService.findSettingsTemplate(this.widget),
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
   * Removes file extension from the file name
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

  /**
   * Calls layout format from utils.ts to get the formated fields
   *
   * @param name Content of the field as a string
   * @param field Field data
   * @returns Formatted field content as a string
   */
  public applyFieldFormat(name: string | null, field: any): string | null {
    return applyLayoutFormat(name, field);
  }

  /**
   * Gets the corresponding status message for the status of the grid
   *
   * @returns string with the status message
   */
  public getStatusMessage(): string {
    if (this.status.error) {
      if (this.status.message && this.environment === 'backoffice') {
        if (this.snackBarRef) {
          this.snackBarRef.instance.dismiss();
        }
        this.snackBarRef = this.snackBar.openSnackBar(this.status.message, {
          error: true,
        });
      }
      return this.translate.instant(
        `components.widget.grid.errors.invalid.${this.environment}`
      );
    }
    if (this.loadingSettings)
      return this.translate.instant('components.widget.grid.loading.settings');
    if (this.blank && this.environment === 'backoffice')
      return this.translate.instant(
        'components.widget.grid.errors.missingDataset'
      );
    if (this.blank && this.environment === 'frontoffice')
      return this.translate.instant(
        'components.widget.grid.errors.invalid.frontoffice'
      );
    if (this.loadingRecords)
      return this.translate.instant('components.widget.grid.loading.records');
    return this.translate.instant('kendo.grid.noRecords');
  }

  /**
   * Open map around clicked item
   *
   * @param dataItem Clicked item
   * @param field geometry field
   */
  public onOpenMapModal(dataItem: any, field: any) {
    this.action.emit({
      action: 'map',
      item: dataItem,
      field,
    });
  }
}
