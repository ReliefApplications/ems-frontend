import { Dialog } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService, TooltipDirective } from '@oort-front/ui';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import {
  ColumnComponent,
  GridDataResult,
  GridComponent as KendoGridComponent,
  PageChangeEvent,
  RowArgs,
  SelectionEvent,
} from '@progress/kendo-angular-grid';
import { PopupRef, PopupService } from '@progress/kendo-angular-popup';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { get, groupBy, has, intersection, isEqual, isNil, map } from 'lodash';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { DownloadService } from '../../../../services/download/download.service';
import { GridDataFormatterService } from '../../../../services/grid-data-formatter/grid-data-formatter.service';
import { GridService } from '../../../../services/grid/grid.service';
import { ResizeObservable } from '../../../../utils/rxjs/resize-observable.util';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { WidgetComponent } from '../../../widget/widget.component';
import { GridLayout } from '../models/grid-layout.model';
import { GridActions } from '../models/grid-settings.model';
import {
  EXPORT_SETTINGS,
  GRADIENT_SETTINGS,
  MULTISELECT_TYPES,
  PAGER_SETTINGS,
  SELECTABLE_SETTINGS,
} from './grid.constants';
import { DocumentManagementService } from '../../../../services/document-management/document-management.service';
import { ActionButton } from '../../../widgets/grid/action-button.type';

/** Minimum column width */
const MIN_COLUMN_WIDTH = 100;
/** Maximum column width */
const MAX_COLUMN_WIDTH = 400;

/**
 * Test if an element match a css selector
 *
 * @param el A dom element
 * @param selector A selector
 * @returns A boolean, indicating if the element matches the selector
 */
const matches = (el: any, selector: any) =>
  (el.matches || el.msMatchesSelector).call(el, selector);

/** Core grid element */
@Component({
  selector: 'shared-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [PopupService, ResizeBatchService],
})
export class GridComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  /** Input decorator for widget. */
  @Input() widget: any;
  /** If inlineEdition is allowed */
  @Input() editable = false;
  /** If the grid has changes */
  @Input() hasChanges = false;
  /** Input decorator for fields. */
  @Input() fields: any[] = [];
  /** Input decorator for data. */
  @Input() data: GridDataResult = { data: [], total: 0 };
  /** Input decorator for loadingRecords. */
  @Input() loadingRecords = false;
  /** Input decorator for loadingSettings. */
  @Input() loadingSettings = true;
  /** Input decorator for status. */
  @Input() status: {
    error: boolean;
    message?: string;
  } = {
    error: false,
  };
  /** Input decorator for blank. */
  @Input() blank = false;
  /** Input decorator for canUpdate. */
  @Input() canUpdate = false;
  /** Input decorator for actions */
  @Input() actions: GridActions = {
    add: false,
    update: false,
    delete: false,
    history: false,
    convert: false,
    export: false,
    showDetails: false,
    navigateToPage: false,
    navigateSettings: {
      field: '',
      pageUrl: '',
      title: '',
    },
    remove: false,
  };
  /** Input decorator */
  @Input() hasDetails = true;
  /** Resizable status */
  @Input() resizable = true;
  /** Resizable status */
  @Input() reorderable = true;
  /** Add permission */
  @Input() canAdd = false;
  /** Download permission */
  @Input() canDownload = false;
  /** Selectable status */
  @Input() selectable = true;
  /** Multi-select status */
  @Input() multiSelect = true;
  /** Selected rows */
  @Input() selectedRows: string[] = [];
  /** Filterable status */
  @Input() filterable = true;
  /** Filter visibility */
  @Input() showFilter = false;
  /** Filter descriptor */
  @Input() filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  /** Searchable status */
  @Input() searchable = true;
  /** Sortable status */
  @Input() sortable = true;
  /** Grid don't uses layout (uses aggregation or reference data) */
  @Input() noLayout = false;
  /** Sort descriptor */
  @Input() sort: SortDescriptor[] = [];
  /** Page size */
  @Input() pageSize = 10;
  /** Skip value */
  @Input() skip = 0;
  /** Output decorator for action */
  @Output() action = new EventEmitter();
  /** Output decorator for export */
  @Output() export = new EventEmitter();
  /** Output decorator for edit */
  @Output() edit: EventEmitter<any> = new EventEmitter();
  /** Filter change event emitter */
  @Output() filterChange = new EventEmitter();
  /** Show filter change event emitter */
  @Output() showFilterChange = new EventEmitter();
  /** Search change event emitter */
  @Output() searchChange = new EventEmitter();
  /** Selection change event emitter */
  @Output() selectionChange = new EventEmitter();
  /** Page change event emitter */
  @Output() pageChange = new EventEmitter();
  /** Sort change event emitter */
  @Output() sortChange = new EventEmitter();
  /** Column change event emitter */
  @Output() columnChange = new EventEmitter();
  /** Reload event emitter */
  @Output() reload = new EventEmitter();
  /** KendoGridComponent view child */
  @ViewChild(KendoGridComponent)
  public grid?: KendoGridComponent;
  /** Reference to kendo grid as element ref */
  @ViewChild(KendoGridComponent, { read: ElementRef }) gridRef!: ElementRef;
  /** Reference to kendo columns */
  @ViewChildren(ColumnComponent) columns!: QueryList<ColumnComponent>;
  /** Reference to tooltips */
  @ViewChildren(TooltipDirective) tooltips!: QueryList<TooltipDirective>;
  /** Array of multi-select types. */
  public multiSelectTypes: string[] = MULTISELECT_TYPES;
  /** Environment of the grid. */
  public environment: 'frontoffice' | 'backoffice';
  /** Status message of the grid. */
  public statusMessage = '';
  /** Form group for the component */
  public formGroup: UntypedFormGroup = new UntypedFormGroup({});
  /** Current edited row */
  private currentEditedRow = 0;
  /** Current edited item */
  private currentEditedItem: any;
  /** Gradient settings for the component */
  public gradientSettings = GRADIENT_SETTINGS;
  /** Selectable settings */
  public selectableSettings = SELECTABLE_SETTINGS;
  /** Pager settings */
  public pagerSettings = PAGER_SETTINGS;
  /** Input decorator for exportSettings. */
  public exportSettings = EXPORT_SETTINGS;
  /** Indicates if the component is in editing mode */
  public editing = false;
  /** Selected items */
  public selectedItems: any[] = [];
  /** Column chooser visibility */
  public showColumnChooser = false;
  /** Search control */
  public search = new UntypedFormControl('');
  /** Row actions for the component */
  private readonly rowActions = ['update', 'delete', 'history', 'convert'];
  /** Snackbar reference */
  private snackBarRef!: any;
  /** Column change timeout */
  private columnChangeTimeoutListener!: NodeJS.Timeout;
  /** Display fullscreen button timeout */
  private displayFullScreenButtonTimeoutListener!: NodeJS.Timeout;
  /** Listen to click events to determine if editor should be closed */
  private closeEditorListener!: any;
  /** A boolean indicating if actions are enabled */
  public hasEnabledActions = false;
  /** Reference to the column chooser element */
  private columnChooserRef: PopupRef | null = null;
  /** Prevent next column reset */
  private preventColumnResize = false;
  /** Custom row action button groups */
  public customRowActionGroups: {
    label: string;
    actions: ActionButton[];
    width: number;
  }[] = [];

  /** @returns show border of grid */
  get showBorder(): boolean {
    return get(this.widget, 'settings.widgetDisplay.showBorder', true);
  }

  /** @returns The column menu */
  get columnMenu(): { columnChooser: boolean; filter: boolean } {
    return {
      columnChooser: false,
      filter: !this.showFilter,
    };
  }

  /** @returns Visible columns of the grid. */
  get visibleFields(): any {
    const extractFieldFromColumn = (column: any): any => {
      // Get field from list of fields
      const field = this.fields.find((x) => x.name === column.field);
      return {
        [column.field]: {
          // Add basic info for formatting: field name, title, width, visibility, order
          field: column.field,
          title: column.title,
          width: column.width,
          hidden: column.hidden,
          order: column.orderIndex,
          // Add list of subfields
          subFields: field?.subFields || [],
          ...(field && {
            // For related resources questions, add display info if any
            ...(field.displayField && {
              displayField: field.displayField,
              separator: field.separator,
            }),
          }),
        },
      };
    };
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

  /**
   * Core grid element
   *
   * @param widgetComponent parent widget component ( optional )
   * @param environment Current environment
   * @param dialog The Dialog service
   * @param gridService The grid service
   * @param renderer The renderer library
   * @param downloadService The download service
   * @param translate The translate service
   * @param snackBar The snackbar service
   * @param el Ref to html element
   * @param document document
   * @param popupService Kendo popup service
   * @param documentManagementService Shared document management service
   * @param gridDataFormatterService GridDataFormatterService
   */
  constructor(
    @Optional() public widgetComponent: WidgetComponent,
    @Inject('environment') environment: any,
    private dialog: Dialog,
    private gridService: GridService,
    private renderer: Renderer2,
    private downloadService: DownloadService,
    private translate: TranslateService,
    private snackBar: SnackbarService,
    private el: ElementRef,
    @Inject(DOCUMENT) private document: Document,
    private popupService: PopupService,
    private documentManagementService: DocumentManagementService,
    private gridDataFormatterService: GridDataFormatterService
  ) {
    super();
    this.environment = environment.module || 'frontoffice';
  }

  ngOnInit(): void {
    this.setSelectedItems();
    if (this.closeEditorListener) {
      this.closeEditorListener();
    }
    this.closeEditorListener = this.renderer.listen(
      'document',
      'click',
      this.onDocumentClick.bind(this)
    );
    // this way we can wait for 2s before sending an update
    this.search.valueChanges
      .pipe(
        debounceTime(2000),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => {
        this.searchChange.emit(value);
      });
    this.selectableSettings = {
      ...this.selectableSettings,
      mode: this.multiSelect ? 'multiple' : 'single',
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.statusMessage = this.getStatusMessage();
    if (
      changes['status'] &&
      this.status.error &&
      this.status.message &&
      this.environment === 'backoffice'
    ) {
      const message = this.status.message;
      setTimeout(() => {
        if (this.snackBarRef) {
          this.snackBarRef.instance.dismiss();
        }
        this.snackBarRef = this.snackBar.openSnackBar(message, {
          error: true,
        });
      });
    }
    if (
      !isEqual(
        changes['actions']?.previousValue,
        changes['actions']?.currentValue
      )
    ) {
      this.hasEnabledActions =
        intersection(
          Object.keys(this.actions).filter((key: string) =>
            get(this.actions, key, false)
          ),
          this.rowActions
        ).length > 0;
    }
    // Must resolve before the grid's first render: Kendo's sticky position
    // cache snapshots the column list once and never re-includes columns
    // added later, which makes multiple action groups overlap.
    if (changes['widget']) {
      const customRowActions: ActionButton[] = get(
        this.widget,
        'settings.customRowActions',
        []
      );
      this.customRowActionGroups = map(
        groupBy(customRowActions, 'columnLabel'),
        (actions, label) => ({
          label,
          actions,
          width: 0,
        })
      );
    }
    if (
      (changes['data']?.currentValue?.data.length || this.data.data.length) &&
      (changes['fields']?.currentValue?.length || this.fields.length)
    ) {
      this.data.data.forEach((gridRow) => {
        this.gridDataFormatterService.formatGridRowData(gridRow, this.fields);
      });
    }
    if (changes['widget'] || changes['data']) {
      this.updateCustomActionColumnWidths();
    }
    // First load of records, or on page change
    if (
      changes['loadingRecords']?.previousValue &&
      !changes['loadingRecords']?.currentValue &&
      !this.loadingSettings
    ) {
      if (this.displayFullScreenButtonTimeoutListener) {
        clearTimeout(this.displayFullScreenButtonTimeoutListener);
      }
      this.displayFullScreenButtonTimeoutListener = setTimeout(() => {
        this.grid?.columns.forEach((column) => {
          this.updateColumnShowFullScreenButton((column as any).field);
        });
      }, 0);
      this.updateCustomActionColumnWidths();
      this.preventColumnResize
        ? (this.preventColumnResize = false)
        : this.setColumnsWidth();
    }
  }

  ngAfterViewInit(): void {
    this.setSelectedItems();
    // Wait for columns to be reordered before updating the layout
    this.grid?.columnReorder.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.columnChangeTimeoutListener) {
        clearTimeout(this.columnChangeTimeoutListener);
      }
      this.columnChangeTimeoutListener = setTimeout(
        () => this.columnChange.emit(),
        500
      );
    });
    new ResizeObservable(this.gridRef.nativeElement)
      .pipe(debounceTime(100), takeUntil(this.destroy$))
      .subscribe(() => this.setColumnsWidth());
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.columnChangeTimeoutListener) {
      clearTimeout(this.columnChangeTimeoutListener);
    }
    if (this.displayFullScreenButtonTimeoutListener) {
      clearTimeout(this.displayFullScreenButtonTimeoutListener);
    }
    if (this.closeEditorListener) {
      this.closeEditorListener();
    }
  }

  /**
   * Get the custom row actions to display in a given group column for a given row.
   * Filters the full set of actions in the group using the per-row actions
   * populated by the backend on `dataItem.actions` (grouped by columnLabel).
   *
   * @param dataItem The current row data item.
   * @param group The action group column definition.
   * @param group.label Label of the action group column.
   * @param group.actions Full set of actions configured for the group.
   * @returns The action buttons to render for this row / group.
   */
  public getRowActions(
    dataItem: any,
    group: { label: string; actions: ActionButton[] }
  ): ActionButton[] {
    const rowGroups: { label: string; actions: ActionButton[] }[] =
      dataItem?.actions ?? [];
    if (!rowGroups.length) {
      // return group.actions;
      return [];
    }
    const rowGroup = rowGroups.find((g) => g.label === group.label);
    if (!rowGroup) {
      return [];
    }
    // Intersect by text + columnLabel to preserve widget config order.
    const visibleKeys = new Set(
      rowGroup.actions.map((a) => `${a.columnLabel}::${a.text}`)
    );
    return group.actions.filter((a) =>
      visibleKeys.has(`${a.columnLabel}::${a.text}`)
    );
  }

  /**
   * Compute the width of a custom row action column based on the rendered
   * width of each button's text and the length of the group label.
   *
   * @param group The action group column definition.
   * @param group.label Label of the action group column.
   * @param group.actions Actions configured for the group.
   * @returns The column width in pixels.
   */
  public getCustomActionColumnWidth(group: {
    label: string;
    actions: ActionButton[];
  }): number {
    /** Gap between buttons */
    const gap = 8;
    /** Left / right cell padding */
    /** Left / right cell padding */
    const cellPadding = 10;
    /** Approx pixel width per character */
    const charWidth = 8;
    /** Padding + border on a single button (left + right) */
    const buttonPadding = 20;
    /** Minimum width of a button so icon-only / very short labels stay clickable */
    const minButtonWidth = 34;
    /** Additional space reserved for the kendo column header icons */
    const headerExtras = 32;

    let maxContentWidth = 0;

    if (this.data && this.data.data && this.data.data.length > 0) {
      this.data.data.forEach((dataItem) => {
        const visibleActions = this.getRowActions(dataItem, group);
        if (visibleActions && visibleActions.length > 0) {
          const rowButtonsWidth = visibleActions.reduce(
            (sum, action) =>
              sum +
              Math.max(
                (action.text?.length ?? 0) * charWidth + buttonPadding,
                minButtonWidth
              ),
            0
          );
          const rowContentWidth =
            rowButtonsWidth + (visibleActions.length - 1) * gap + cellPadding;
          if (rowContentWidth > maxContentWidth) {
            maxContentWidth = rowContentWidth;
          }
        }
      });
    } else {
      const actions = group.actions ?? [];
      const buttonsWidth = actions.reduce(
        (sum, action) =>
          sum +
          Math.max(
            (action.text?.length ?? 0) * charWidth + buttonPadding,
            minButtonWidth
          ),
        0
      );
      const count = Math.max(actions.length, 1);
      maxContentWidth = buttonsWidth + (count - 1) * gap + cellPadding;
    }

    const titleWidth =
      (group.label?.length ?? 0) * charWidth + headerExtras + cellPadding;
    return Math.max(maxContentWidth, titleWidth, 108);
  }

  /**
   * Recalculates the width of all custom row action columns.
   */
  public updateCustomActionColumnWidths(): void {
    if (this.customRowActionGroups) {
      this.customRowActionGroups.forEach((group) => {
        group.width = this.getCustomActionColumnWidth(group);
      });
    }
  }

  /**
   * Handles filter change event.
   *
   * @param filter Filter event.
   */
  public onFilterChange(filter: CompositeFilterDescriptor): void {
    if (!this.loadingRecords) {
      this.filter = filter;
      this.filterChange.emit(filter);
    }
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
      this.preventColumnResize = true;
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
   * @param anchor button reference to attach the popup to
   * @param template Template to use for the popup
   * @param showColumnChooser optional parameter to decide of the state of the popup
   */
  public toggleColumnChooser(
    anchor: ElementRef | HTMLElement,
    template: TemplateRef<{ [Key: string]: unknown }>,
    showColumnChooser?: boolean
  ) {
    // Emit column change event
    if (this.showColumnChooser) {
      this.onColumnVisibilityChange();
    }
    if (showColumnChooser) {
      this.showColumnChooser = showColumnChooser;
    } else {
      this.showColumnChooser = !this.showColumnChooser;
    }
    switch (this.showColumnChooser) {
      case false:
        this.columnChooserRef?.close();
        this.columnChooserRef = null;
        break;
      case true:
        this.columnChooserRef = this.popupService.open({
          anchor: anchor,
          content: template,
          collision: { horizontal: 'fit', vertical: 'fit' },
        });
        break;
    }
  }

  /**
   * Set and emit new grid configuration after column reorder event.
   */
  onColumnReorder(): void {
    this.columnChange.emit();
  }

  /**
   * Sets and emits new grid configuration after column resize event.
   *
   * @param event Resize event containing the resize origin column
   */
  onColumnResize(event: any): void {
    const columnField = event[0].column.field;
    // Update the button display for all the cells of this column on resize
    this.updateColumnShowFullScreenButton(columnField);
    this.columnChange.emit();
  }

  /**
   * Sets and emits new grid configuration after column visibility event.
   */
  onColumnVisibilityChange(): void {
    this.columnChange.emit();
    this.setColumnsWidth();
  }

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
   * Open reference data editor, in a modal
   *
   * @param field reference data field
   */
  public async openReferenceDataSelector(field: any): Promise<void> {
    this.editing = true;
    if (this.formGroup) {
      this.gridService
        .getFieldDefinition(this.widget.settings.resource, field.name)
        .pipe(takeUntil(this.destroy$))
        .subscribe(async (fieldDefinition) => {
          // Prevent edition to be cancelled
          this.editing = true;
          const { PopupEditorComponent } = await import(
            '../popup-editor/popup-editor.component'
          );
          const dialogRef = this.dialog.open(PopupEditorComponent, {
            data: {
              field: fieldDefinition,
              value: this.formGroup.get(field.name)?.value,
            },
            autoFocus: false,
            disableClose: true,
          });
          dialogRef.closed
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: any) => {
              if (has(data, 'value')) {
                this.formGroup.get(field.name)?.setValue(data.value);
                this.formGroup.markAsDirty();
              }
              this.editing = false;
            });
        });
    }
  }

  /**
   * Updates the show full screen button of the given columns cells if cell content is truncated
   *
   * @param columnField Related column field from where to check all cells
   */
  private updateColumnShowFullScreenButton(columnField: string) {
    const updatableTooltips = this.tooltips.filter(
      (tooltip) => tooltip.enableBy !== 'default'
    );
    this.data.data.forEach((element) => {
      const relatedTooltipElement = updatableTooltips.find(
        (tooltip) => tooltip.uiTooltip === element.text[columnField]
      );
      if (relatedTooltipElement) {
        element.showFullScreenButton[columnField] =
          relatedTooltipElement.elementRef.nativeElement.offsetWidth <
          relatedTooltipElement.elementRef.nativeElement.scrollWidth;
      }
    });
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
        this.expandActionsColumn();
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
    this.collapseActionsColumn();
    this.action.emit({ action: 'save' });
  }

  /**
   * Cancels edition.
   */
  public onCancel(): void {
    this.closeEditor();
    this.collapseActionsColumn();
    this.action.emit({ action: 'cancel' });
  }

  /**
   * Downloads file of record.
   *
   * @param file File to download.
   */
  public onDownload(file: any): void {
    if (typeof file.content === 'string') {
      if (file.content.startsWith('data')) {
        const downloadLink = this.document.createElement('a');
        downloadLink.href = file.content;
        downloadLink.download = file.name;
        downloadLink.click();
      } else {
        const path = `download/file/${file.content}`;
        this.downloadService.getFile(path, file.type, file.name);
      }
    } else {
      // Using document management
      this.documentManagementService.getFile(file);
    }
  }

  /**
   * Opens export modal.
   */
  public async onExport(): Promise<void> {
    const { ExportComponent } = await import('../export/export.component');
    const dialogRef = this.dialog.open(ExportComponent, {
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

  /**
   * Expands text in a full window modal.
   *
   * @param item Item to display data of.
   * @param fieldName field name.
   * @param fieldTitle title of the field
   */
  public async onExpandText(
    item: any,
    fieldName: string,
    fieldTitle: string
  ): Promise<void> {
    // Lazy load expended comment component
    const { ExpandedCommentComponent } = await import(
      '../expanded-comment/expanded-comment.component'
    );
    const dialogRef = this.dialog.open(ExpandedCommentComponent, {
      data: {
        title: fieldTitle,
        value: get(item, fieldName),
        // Disable edition if cannot update / cannot do inline edition / cannot update item / field is readonly
        readonly:
          !this.actions.update ||
          !this.editable ||
          !item.canUpdate ||
          this.fields.find((val) => val.name === fieldName).meta.readOnly,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      // Only update if value is not null or undefined, and different from previous value
      if (!isNil(value) && value !== get(item, fieldName)) {
        // Create update
        const update = { [fieldName]: value };
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
    const { ErrorsModalComponent } = await import(
      '../errors-modal/errors-modal.component'
    );
    const dialogRef = this.dialog.open(ErrorsModalComponent, {
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
    if (this.widgetComponent) {
      const { EditWidgetModalComponent } = await import(
        '../../../widget-grid/edit-widget-modal/edit-widget-modal.component'
      );
      const dialogRef = this.dialog.open(EditWidgetModalComponent, {
        disableClose: true,
        data: {
          widget: this.widget,
        },
      });
      dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        if (res) {
          this.edit.emit({
            type: 'data',
            id: this.widgetComponent.id,
            options: res,
          });
        }
      });
    }
  }

  /**
   * Gets the corresponding status message for the status of the grid
   *
   * @returns string with the status message
   */
  public getStatusMessage(): string {
    if (this.status.error) {
      return this.translate.instant(
        `components.widget.grid.errors.invalid.${this.environment}`
      );
    }
    if (this.loadingSettings) {
      return this.translate.instant('components.widget.grid.loading.settings');
    }
    if (this.blank && this.environment === 'backoffice') {
      return this.translate.instant(
        'components.widget.grid.errors.missingDataset'
      );
    }
    if (this.blank && this.environment === 'frontoffice') {
      return this.translate.instant(
        'components.widget.grid.errors.invalid.frontoffice'
      );
    }
    if (this.loadingRecords) {
      return this.translate.instant('components.widget.grid.loading.records');
    }
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

  /**
   * Open editor around clicked item
   *
   * @param dataItem Clicked item
   * @param field html field
   */
  public onOpenEditorModal(dataItem: any, field: any) {
    this.action.emit({
      action: 'editor',
      item: dataItem,
      field,
    });
  }

  /**
   * Expand the action column so the edit icon fits
   */
  expandActionsColumn() {
    // Find the action column
    const actionColumn = this.columns.find(
      (column) => !column.hidden && !column.title
    );
    if (actionColumn) {
      // default column width 54 + 34 (edit icon)
      actionColumn.width = 84;
      this.setColumnsWidth();
    }
  }

  /**
   * Restore the original action column size
   */
  collapseActionsColumn() {
    // Find the action column
    const actionColumn = this.columns.find(
      (column) => !column.hidden && !column.title
    );
    if (actionColumn) {
      // default column width 54
      actionColumn.width = 54;
      this.setColumnsWidth();
    }
  }

  /**
   * Automatically set the width of each column
   */
  private setColumnsWidth() {
    const gridElement = this.gridRef.nativeElement;
    // Stores the columns width character length
    const activeColumns: { [key: string]: number } = {};

    // Get all the columns with a title or that are not hidden from the grid
    const availableColumns = this.columns.filter(
      (column) => !column.hidden && !!column.title && !column.sticky
    );

    // Verify what kind of field is and deal with this logic
    const typesFields: {
      field: string;
      type: string;
      title: string;
    }[] = [];
    this.fields
      .reduce((acc, field) => acc.concat(field, field.subFields || []), []) // Unnesting reference data to correctly get them
      .forEach((field: any) => {
        const availableFields = availableColumns.filter((column: any) => {
          return column.field === field.name;
        });
        // should only add items to typesFields if they are available in availableColumns
        if (availableFields.length > 0) {
          typesFields.push({
            field: field.name,
            type: field.meta.type,
            title: field.title,
          });
        }
      });

    // Most of font sizes follow a 3:5 aspect ratio
    const pixelWidthPerCharacter =
      parseInt(window.getComputedStyle(document.body).fontSize) * 0.6 || 9.6;

    // Get each column content with the max length
    // or the column title if no content is added in the current data
    typesFields.forEach((type: any) => {
      const titleSize = type.title ? type.title.length : 0;
      let maxContentSize = titleSize;

      this.data.data.forEach((data: any) => {
        const val = get(data, type.field);
        if (val !== undefined && val !== null) {
          let contentSize = 0;
          switch (type.type) {
            case 'time':
            case 'datetime-local':
            case 'datetime':
            case 'date': {
              contentSize = (
                this.gridDataFormatterService.datePipe.transform(val) || ''
              ).length;
              break;
            }
            case 'file': {
              contentSize = val[0]?.name ? val[0].name.length : 0;
              break;
            }
            case 'numeric': {
              contentSize = val.toString().length;
              break;
            }
            case 'checkbox':
            case 'tagbox': {
              let checkboxLength = 0;
              (val || []).forEach((obj: any) => {
                checkboxLength += (obj || '').toString().length;
              });
              contentSize = checkboxLength;
              break;
            }
            case 'boolean':
            case 'color': {
              contentSize = 0;
              break;
            }
            default: {
              contentSize = val.toString().length;
            }
          }
          if (contentSize > maxContentSize) {
            maxContentSize = contentSize;
          }
        }
      });

      activeColumns[type.field] = maxContentSize;
    });

    // Resize the columns directly based on character length
    availableColumns.forEach((column) => {
      // Respect fixedWidth fields
      const fieldDef = this.fields.find((f) => f.name === column.field);
      if (fieldDef?.fixedWidth) {
        column.width = fieldDef.fixedWidth;
        return;
      }

      const columnFieldType = typesFields.find(
        (type: any) =>
          (column.field ? column.field === type.field : column.title === type.title) &&
          activeColumns[type.field] !== undefined
      );
      if (columnFieldType) {
        const colChars = activeColumns[columnFieldType.field];
        // Add 36px padding for cell padding, border, sort icon
        const padding = 36;
        column.width = Math.min(
          Math.max(colChars * pixelWidthPerCharacter + padding, MIN_COLUMN_WIDTH),
          MAX_COLUMN_WIDTH
        );
      } else {
        if (column.title) {
          const padding = 36;
          column.width = Math.min(
            Math.max(column.title.length * pixelWidthPerCharacter + padding, MIN_COLUMN_WIDTH),
            MAX_COLUMN_WIDTH
          );
        }
      }
      // Make sure that every column has a width set
      if (column.width <= 0) {
        column.width = MIN_COLUMN_WIDTH;
      }
    });
  }

  /** Restore all columns visibility and size when reset the layout of the grid */
  restoreColumns() {
    this.columns.forEach((column: any) => {
      column.hidden = false;
    });
    // If aggregation, set the width of the columns here (cannot use layout parameters)
    if (this.noLayout) {
      this.columns.forEach((column) =>
        this.grid?.reorderColumn(
          column,
          this.fields.findIndex((field: any) => field.name === column.field)
        )
      );
      this.setColumnsWidth();
    }
  }
}
