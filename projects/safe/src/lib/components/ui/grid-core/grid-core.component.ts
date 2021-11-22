import {
  Component, ComponentFactory, ComponentFactoryResolver, EventEmitter,
  Inject, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  GridComponent as KendoGridComponent,
  GridDataResult,
  PageChangeEvent,
  SelectableSettings,
  SelectionEvent,
  PagerSettings,
  ColumnReorderEvent,
  RowArgs
} from '@progress/kendo-angular-grid';
import { GradientSettings } from '@progress/kendo-angular-inputs';
import { CompositeFilterDescriptor, filterBy, orderBy, SortDescriptor } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { SafeAuthService } from '../../../services/auth.service';
import { SafeApiProxyService } from '../../../services/api-proxy.service';
import { SafeDownloadService } from '../../../services/download.service';
import { SafeLayoutService } from '../../../services/layout.service';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { SafeRecordHistoryComponent } from '../../record-history/record-history.component';
import { prettifyLabel } from '../../../utils/prettify';
import { ConvertRecordMutationResponse, CONVERT_RECORD, DELETE_RECORDS, EditRecordMutationResponse, EDIT_RECORD } from '../../../graphql/mutations';
import { GetRecordDetailsQueryResponse, GET_RECORD_DETAILS } from '../../../graphql/queries';
import { SafeFormModalComponent } from '../../form-modal/form-modal.component';
import { SafeRecordModalComponent } from '../../record-modal/record-modal.component';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { SafeConvertModalComponent } from '../../convert-modal/convert-modal.component';
import { Form } from '../../../models/form.model';
import { NOTIFICATIONS } from '../../../const/notifications';
import { SafeExpandedCommentComponent } from './expanded-comment/expanded-comment.component';
import { GridLayout } from './models/grid-layout.model';
import { GridSettings, FilterType } from './models/grid-settings.model';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { PopupService } from '@progress/kendo-angular-popup';
import { ResizeBatchService } from '@progress/kendo-angular-common';
import { CalendarDOMService, MonthViewService, WeekNamesService } from '@progress/kendo-angular-dateinputs';

const matches = (el: any, selector: any) => (el.matches || el.msMatchesSelector).call(el, selector);

const DEFAULT_FILE_NAME = 'grid.xlsx';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

const flatDeep = (arr: any[]): any[] => {
  return arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val) : val), []);
};

const DISABLED_FIELDS = ['id', 'createdAt', 'modifiedAt'];

const SELECTABLE_SETTINGS: SelectableSettings = {
  checkboxOnly: true,
  mode: 'multiple',
  drag: false
};

const PAGER_SETTINGS: PagerSettings = {
  buttonCount: 5,
  type: 'numeric',
  info: true,
  pageSizes: true,
  previousNext: true
};

const GRADIENT_SETTINGS: GradientSettings = {
  opacity: false
};

const MULTISELECT_TYPES: string[] = ['checkbox', 'tagbox', 'owner'];

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

@Component({
  selector: 'safe-grid-core',
  templateUrl: './grid-core.component.html',
  styleUrls: ['./grid-core.component.scss'],
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
export class SafeGridCoreComponent implements OnInit, OnChanges, OnDestroy {

  // === INPUTS ===
  @Input() settings: GridSettings | any = {};
  @Input() layout: GridLayout = {}; // Cached layout
  @Input() parent: any; // Parent data for children grid

  // === SELECTION INPUTS ===
  @Input() multiSelect = true;
  @Input() selectedRows: string[] = [];

  // === FEATURES INPUTS ===
  @Input() readOnly = false;
  @Input() showDetails = true;
  @Input() showExport = false;
  @Input() showSaveLayout = false;
  @Input() filterType: FilterType = 'classic';

  // === OUTPUTS ===
  @Output() childChanged: EventEmitter<any> = new EventEmitter();
  @Output() layoutChanged: EventEmitter<any> = new EventEmitter();
  @Output() defaultLayoutChanged: EventEmitter<any> = new EventEmitter();

  // === SELECTION OUTPUTS ===
  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();

  // === TEMPLATE REFERENCE TO KENDO GRID ===
  @ViewChild(KendoGridComponent)
  private grid?: KendoGridComponent;

  // === HISTORY COMPONENT TO BE INJECTED IN LAYOUT SERVICE ===
  public factory?: ComponentFactory<any>;

  // === DATA ===
  public gridData: GridDataResult = { data: [], total: 0 };
  private totalCount = 0;
  private items: any[] = [];
  public fields: any[] = [];
  private metaFields: any;
  public multiSelectTypes: string[] = MULTISELECT_TYPES;
  public detailsField?: any;
  private dataQuery: any;
  private metaQuery: any;
  private dataSubscription?: Subscription;
  private columnsOrder: any[] = [];

  // === PAGINATION ===
  public pageSize = 10;
  public skip = 0;

  // === INLINE EDITION ===
  private originalItems: any[] = this.gridData.data;
  public updatedItems: any[] = [];
  private editedRowIndex = 0;
  private editedRecordId = '';
  public formGroup: FormGroup = new FormGroup({});
  private isNew = false;
  public loading = true;
  public queryError = false;

  // === SORTING ===
  public sort: SortDescriptor[] = [];

  // === FILTERING ===
  public filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public showFilter = false;

  // === LAYOUT CHANGES ===
  public hasLayoutChanges = false;

  // === AUTHORIZATION ===
  public isAdmin: boolean;

  // === ACTIONS ON SELECTION ===
  public selectedRowsIndex: number[] = [];
  public hasEnabledActions = false;
  public canUpdateSelectedRows = false;
  public canDeleteSelectedRows = false;
  public selectableSettings = SELECTABLE_SETTINGS;
  public pagerSettings = PAGER_SETTINGS;
  public gradientSettings = GRADIENT_SETTINGS;
  public editionActive = false;

  // === DOWNLOAD ===
  public excelFileName = '';
  private apiUrl = '';
  public exportData: Array<any> = [
    {
      text: '.csv',
      click: () => this.onExportRecord(this.selectedRowsIndex, 'csv')
    },
    {
      text: '.xlsx',
      click: () => this.onExportRecord(this.selectedRowsIndex, 'xlsx')
    }
  ];

  get hasChanges(): boolean {
    return this.updatedItems.length > 0;
  }

  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private queryBuilder: QueryBuilderService,
    private layoutService: SafeLayoutService,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private safeAuthService: SafeAuthService,
    private apiProxyService: SafeApiProxyService
  ) {
    this.apiUrl = environment.API_URL;
    this.isAdmin = this.safeAuthService.userIsAdmin && environment.module === 'backoffice';
  }

  // === COMPONENT LIFECYCLE ===

  /**
   * Inits the component factory for history.
   */
  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(SafeRecordHistoryComponent);
  }

  /**
   * Detects changes of the settings to (re)load the data.
   */
  ngOnChanges(): void {
    this.selectableSettings = { ...this.selectableSettings, mode: this.multiSelect ? 'multiple' : 'single' };
    this.hasLayoutChanges = this.settings.defaultLayout ? !isEqual(this.layout, JSON.parse(this.settings.defaultLayout)) : true;
    if (this.layout?.filter) {
      // const filter = this.lintFilter(this.layout.filter);
      this.filter = this.layout.filter;
    }
    if (this.layout?.sort) {
      this.sort = this.layout.sort;
    }
    this.showFilter = !!this.layout?.showFilter;
    this.loadItems();
    this.hasEnabledActions = !this.settings.actions ||
      Object.entries(this.settings.actions).filter((action) => action.includes(true)).length > 0;
    this.excelFileName = this.settings.title ? `${this.settings.title}.xlsx` : DEFAULT_FILE_NAME;
    // Builds custom query.
    if (!this.parent) {
      const builtQuery = this.queryBuilder.buildQuery(this.settings);
      const filters = [this.filter];
      if (this.settings?.query?.filter) {
        filters.push(this.settings?.query?.filter);
      }
      const sortField = (this.sort.length > 0 && this.sort[0].dir) ? this.sort[0].field :
        (this.settings?.query?.sort && this.settings.query.sort.field ? this.settings.query.sort.field : null);
      const sortOrder = (this.sort.length > 0 && this.sort[0].dir) ? this.sort[0].dir : (this.settings?.query?.sort?.order || '');
      this.dataQuery = this.apollo.watchQuery<any>({
        query: builtQuery,
        variables: {
          first: this.pageSize,
          filter: { logic: 'and', filters },
          sortField,
          sortOrder
        }
      });
    }
    this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings, this.parent);
    if (this.metaQuery) {
      this.metaQuery.subscribe(async (res: any) => {
        this.queryError = false;
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            this.metaFields = Object.assign({}, res.data[field]);
            await this.populateMetaFields();
          }
        }
        this.getRecords();
      }, () => {
        this.loading = false;
        this.queryError = true;
      });
    } else {
      this.loading = false;
      this.queryError = true;
    }
    this.renderer.listen('document', 'click', this.onDocumentClick.bind(this));
  }

  /**
   * Removes subscriptions when component is destroyed, to avoid duplication.
   */
   ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  // === GRID FIELDS ===

  /**
   * Generates list of fields for the grid, based on grid parameters.
   * @param fields list of fields saved in settings.
   * @param prefix prefix of the field.
   * @param disabled disabled status of the field, can overwrite the meta one.
   * @returns List of fields for the grid.
   */
  private getFields(fields: any[], prefix?: string, disabled?: boolean): any[] {
    const cachedFields = this.layout?.fields || {};
    return flatDeep(fields.filter(x => x.kind !== 'LIST').map(f => {
      const fullName: string = prefix ? `${prefix}.${f.name}` : f.name;
      switch (f.kind) {
        case 'OBJECT': {
          return this.getFields(f.fields, fullName, true);
        }
        default: {
          const metaData = get(this.metaFields, fullName);
          const cachedField = get(cachedFields, fullName);
          const title = f.label ? f.label : prettifyLabel(f.name);
          return {
            name: fullName,
            title,
            type: f.type,
            format: this.getFormat(f.type),
            editor: this.getEditor(f.type),
            filter: (this.parent || prefix) ? '' : this.getFilter(f.type),
            meta: metaData,
            disabled: disabled || DISABLED_FIELDS.includes(f.name) || metaData?.readOnly,
            hidden: cachedField?.hidden || false,
            width: cachedField?.width || title.length * 7 + 50,
            order: cachedField?.order,
          };
        }
      }
    })).sort((a, b) => a.order - b.order);
  }

  /**
   * Gets editor of a field from its type.
   * @param type Field type.
   * @returns name of the editor.
   */
  private getEditor(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Float': {
        return 'float';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'datetime';
      }
      case 'Time': {
        return 'time';
      }
      case 'JSON': {
        return '';
      }
      default: {
        return 'text';
      }
    }
  }

  /**
   * Gets format of a field from its type ( only for date fields ).
   * @param type Type of the field.
   * @returns Format of the field.
   */
  private getFormat(type: any): string {
    switch (type) {
      case 'Date':
        return 'dd/MM/yy';
      case 'DateTime':
        return 'dd/MM/yy HH:mm';
      case 'Time':
        return 'HH:mm';
      default:
        return '';
    }
  }

  /**
   * Gets filter type of a field from its type.
   * @param type Type of the field.
   * @returns Name of the field filter.
   */
  private getFilter(type: any): string {
    switch (type) {
      case 'Int': {
        return 'numeric';
      }
      case 'Boolean': {
        return 'boolean';
      }
      case 'Date': {
        return 'date';
      }
      case 'DateTime': {
        return 'date';
      }
      case 'Time': {
        return 'date';
      }
      case 'JSON': {
        return '';
      }
      default: {
        return 'text';
      }
    }
  }

  /**
   * Fetches choices from URL for fields with url parameter.
   */
  private async populateMetaFields(): Promise<void> {
    for (const fieldName of Object.keys(this.metaFields)) {
      const meta = this.metaFields[fieldName];
      if (meta.choicesByUrl) {
        const url: string = meta.choicesByUrl.url;
        const localRes = localStorage.getItem(url);
        if (localRes) {
          this.metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(JSON.parse(localRes), meta.choicesByUrl)
          };
        } else {
          const res: any = await this.apiProxyService.promisedRequestWithHeaders(url);
          localStorage.setItem(url, JSON.stringify(res));
          this.metaFields[fieldName] = {
            ...meta,
            choices: this.extractChoices(res, meta.choicesByUrl)
          };
        }
      }
    }
  }

  /**
   * Extracts choices using choicesByUrl properties
   * @param res Result of http request.
   * @param choicesByUrl Choices By Url property.
   * @returns list of choices.
   */
  private extractChoices(res: any, choicesByUrl: { path?: string, value?: string, text?: string }): { value: string, text: string }[] {
    const choices = choicesByUrl.path ? [...res[choicesByUrl.path]] : [...res];
    return choices ? choices.map((x: any) => ({
      value: (choicesByUrl.value ? x[choicesByUrl.value] : x).toString(),
      text: choicesByUrl.text ? x[choicesByUrl.text] : choicesByUrl.value ? x[choicesByUrl.value] : x
    })) : [];
  }

  /**
   * Converts fields with date type into javascript dates.
   * @param items list of items to update.
   */
  private convertDateFields(items: any[]): void {
    const dateFields = this.fields.filter(x => ['Date', 'DateTime', 'Time'].includes(x.type)).map(x => x.name);
    items.map(x => {
      for (const [key, value] of Object.entries(x)) {
        if (dateFields.includes(key)) {
          x[key] = x[key] && new Date(x[key]);
        }
      }
    });
  }

  // === INLINE EDITION ===

  /**
   * Detects cell click event and opens row form if user is authorized.
   * @param param0 click event.
   */
  public cellClickHandler({ isEdited, dataItem, rowIndex }: any): void {
    // Parameters that prevent the inline edition.
    if (!this.gridData.data[rowIndex - this.skip].canUpdate || !this.settings.actions || !this.settings.actions.inlineEdition ||
      isEdited || (this.formGroup && !this.formGroup.valid)) {
      return;
    }
    // Newly added item
    if (this.isNew) {
      rowIndex += 1;
    }
    // Closes current inline edition.
    if (this.editedRecordId) {
      this.updateCurrent();
    }
    // creates the form group.
    this.formGroup = this.createFormGroup(dataItem);
    this.editedRecordId = dataItem.id;
    this.editedRowIndex = rowIndex;
    this.grid?.editRow(rowIndex, this.formGroup);
  }

  /**
   * Cancels inline edition.
   */
  public cancelHandler(): void {
    this.closeEditor();
  }

  /**
   * Updates a record when inline edition completed.
   */
  public updateCurrent(): void {
    if (this.isNew) {
    } else {
      if (this.formGroup.dirty) {
        this.update(this.editedRecordId, this.formGroup.value);
      }
    }
    this.closeEditor();
  }

  /**
   * Finds item in data items and updates it with new values, from inline edition.
   * @param id Item id.
   * @param value Updated value of the item.
   */
  private update(id: string, value: any): void {
    const item = this.updatedItems.find(x => x.id === id);
    if (item) {
      Object.assign(item, { ...value, id });
    } else {
      this.updatedItems.push({ ...value, id });
    }
    Object.assign(this.items.find(x => x.id === id), value);
  }

  /**
   * Closes the inline edition.
   */
  private closeEditor(): void {
    this.grid?.closeRow(this.editedRowIndex);
    this.grid?.cancelCell();
    this.isNew = false;
    this.editedRowIndex = 0;
    this.editedRecordId = '';
    this.formGroup = new FormGroup({});
  }

  /**
   * Saves all inline changes and then reload data.
   */
  public onSaveChanges(): void {
    this.closeEditor();
    if (this.hasChanges) {
      Promise.all(this.promisedChanges()).then(() => this.reloadData());
    }
  }

  /**
   * Cancels inline edition without saving.
   */
  public onCancelChanges(): void {
    this.closeEditor();
    this.updatedItems = [];
    this.items = this.originalItems;
    this.originalItems = cloneData(this.originalItems);
    this.loadItems();
  }

  /**
   * Creates a list of promise to send for inline edition of records, once completed.
   * @returns List of promises to execute.
   */
  public promisedChanges(): Promise<any>[] {
    const promises: Promise<any>[] = [];
    for (const item of this.updatedItems) {
      const data = Object.assign({}, item);
      delete data.id;
      promises.push(this.apollo.mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: item.id,
          data,
          template: this.settings.query.template
        }
      }).toPromise());
    }
    return promises;
  }

  /**
   * Detects document click to save record if outside the inline edition form.
   * @param e click event.
   */
  private onDocumentClick(e: any): void {
    if (this.formGroup && !this.editionActive && this.formGroup.valid &&
      !matches(e.target, '#customGrid tbody *, #customGrid .k-grid-toolbar .k-button .k-animation-container')) {
      this.updateCurrent();
    }
  }

  /**
   * Creates form group for inline edition.
   * @param dataItem Data item to open in inline edition.
   * @returns Form group of the item.
   */
  public createFormGroup(dataItem: any): FormGroup {
    const formGroup: any = {};
    this.fields.filter(x => !x.disabled).forEach((field, index) => {
      if (field.type !== 'JSON' || this.multiSelectTypes.includes(field.meta.type)) {
        formGroup[field.name] = [dataItem[field.name]];
      } else {
        if (field.meta.type === 'multipletext') {
          const fieldGroup: any = {};
          for (const item of field.meta.items) {
            fieldGroup[item.name] = [dataItem[field.name] ? dataItem[field.name][item.name] : null];
          }
          formGroup[field.name] = this.formBuilder.group(fieldGroup);
        }
        if (field.meta.type === 'matrix') {
          const fieldGroup: any = {};
          for (const row of field.meta.rows) {
            fieldGroup[row.name] = [dataItem[field.name] ? dataItem[field.name][row.name] : null];
          }
          formGroup[field.name] = this.formBuilder.group(fieldGroup);
        }
        if (field.meta.type === 'matrixdropdown') {
          const fieldGroup: any = {};
          const fieldValue = dataItem[field.name];
          for (const row of field.meta.rows) {
            const rowValue = fieldValue ? fieldValue[row.name] : null;
            const rowGroup: any = {};
            for (const column of field.meta.columns) {
              const columnValue = rowValue ? rowValue[column.name] : null;
              rowGroup[column.name] = [columnValue];
            }
            fieldGroup[row.name] = this.formBuilder.group(rowGroup);
          }
          formGroup[field.name] = this.formBuilder.group(fieldGroup);
        }
        if (field.meta.type === 'matrixdynamic') {
          const fieldArray: any = [];
          const fieldValue = dataItem[field.name] ? dataItem[field.name] : [];
          for (const rowValue of fieldValue) {
            const rowGroup: any = {};
            for (const column of field.meta.columns) {
              const columnValue = rowValue ? rowValue[column.name] : null;
              if (this.multiSelectTypes.includes(column.cellType)) {
                rowGroup[column.name] = [columnValue];
              } else {
                rowGroup[column.name] = columnValue;
              }
            }
            fieldArray.push(this.formBuilder.group(rowGroup));
          }
          formGroup[field.name] = this.formBuilder.array(fieldArray);
        }
      }
    });
    return this.formBuilder.group(formGroup);
  }

  // === DATA ===

  /**
   * Loads the data, using grid parameters.
   */
  private getRecords(): void {
    this.loading = true;
    this.updatedItems = [];
    // Child grid
    if (!!this.parent) {
      this.items = cloneData(this.parent[this.settings?.name]);
      if (this.items.length > 0) {
        this.fields = this.getFields(this.settings?.fields || []);
        this.convertDateFields(this.items);
        this.originalItems = cloneData(this.items);
        this.detailsField = this.settings?.fields.find((x: any) => x.kind === 'LIST');
      } else {
        this.originalItems = [];
        this.fields = [];
        this.detailsField = '';
      }
      this.totalCount = this.items.length;
      this.loadItems();
      this.loading = false;
      // Parent grid
    } else {
      if (this.dataQuery) {
        this.dataSubscription = this.dataQuery.valueChanges.subscribe((res: any) => {
          this.queryError = false;
          const fields = this.settings?.query?.fields || [];
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              this.fields = this.getFields(fields);
              const nodes = res.data[field].edges.map((x: any) => x.node) || [];
              this.totalCount = res.data[field].totalCount;
              this.items = cloneData(nodes);
              this.convertDateFields(this.items);
              this.originalItems = cloneData(this.items);
              this.detailsField = fields.find((x: any) => x.kind === 'LIST');
              if (this.detailsField) {
                this.detailsField = { ...this.detailsField, actions: this.settings.actions };
                // this.detailsField = { query: {...this.detailsField}, actions: this.settings.actions };
              }
              this.loadItems();
              if (!this.readOnly) {
                this.initSelectedRows();
              }
            }
          }
          this.loading = false;
        },
          () => {
            this.queryError = true;
            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    }
  }

  /**
   * Sets the list of items to display.
   */
  private loadItems(): void {
    if (!!this.parent) {
      this.gridData = {
        data: (this.sort ? orderBy((this.filter ? filterBy(this.items, this.filter) : this.items), this.sort) :
          (this.filter ? filterBy(this.items, this.filter) : this.items)).slice(this.skip, this.skip + this.pageSize),
        total: this.totalCount
      };
    } else {
      this.gridData = {
        data: this.items,
        total: this.totalCount
      };
    }
  }

  /**
   * Reloads data and unselect all rows.
   */
  public reloadData(): void {
    if (!this.parent) {
      this.pageChange({ skip: 0, take: this.pageSize });
    } else {
      this.childChanged.emit();
    }
    this.selectedRowsIndex = [];
    this.updatedItems = [];
  }

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

  // === SELECTION ===

  /**
   * Initializes selected rows from input.
   */
  private initSelectedRows(): void {
    this.selectedRowsIndex = [];
    if (this.selectedRows.length > 0) {
      this.gridData.data.forEach((row: any, index: number) => {
        if (this.selectedRows.includes(row.id)) {
          this.selectedRowsIndex.push(index + this.skip);
        }
      });
    }
  }

  /**
   * Returns selected status of a row.
   * @param row Row to test.
   * @returns selected status of the row.
   */
  public isRowSelected = (row: RowArgs) => this.selectedRowsIndex.includes(row.index);

  /**
   * Detects selection event and display actions available on rows.
   * @param selection selection event.
   */
  public selectionChange(selection: SelectionEvent): void {
    this.rowSelected.emit(selection);
    const deselectedRows = selection.deselectedRows || [];
    const selectedRows = selection.selectedRows || [];
    if (deselectedRows.length > 0) {
      const deselectIndex = deselectedRows.map((item => item.index - this.skip));
      this.selectedRowsIndex = [...this.selectedRowsIndex.filter((item) => !deselectIndex.includes(item))];
      this.selectedRows = [...this.selectedRows.filter(x => !deselectedRows.some(y => x === y.dataItem.id))];
    }
    if (selectedRows.length > 0) {
      const selectedItems = selectedRows.map((item) => item.index - this.skip);
      this.selectedRowsIndex = this.selectedRowsIndex.concat(selectedItems);
      this.selectedRows = this.selectedRows.concat(selectedRows.map(x => x.dataItem.id));
    }
    this.canUpdateSelectedRows = !this.gridData.data.some((x, idx) => this.selectedRowsIndex.includes(idx) && !x.canUpdate);
    this.canDeleteSelectedRows = !this.gridData.data.some((x, idx) => this.selectedRowsIndex.includes(idx) && !x.canDelete);
  }

  // === GRID ACTIONS ===

  /**
   * Opens the record on a read-only modal. If edit mode is enabled, can open edition modal.
   * @param item item to get details of.
   */
  public onShowDetails(item: any): void {
    const dialogRef = this.dialog.open(SafeRecordModalComponent, {
      data: {
        recordId: item.id,
        locale: 'en',
        canUpdate: this.settings.actions && this.settings.actions.update && item.canUpdate,
        template: this.parent ? null : this.settings.query.template
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.onUpdateRow(item.id);
      }
    });
  }

  /**
   * Opens the form corresponding to selected row in order to update it
   * @param items items to update.
   */
  public onUpdateRow(items: number | number[]): void {
    const ids = (Array.isArray(items) && items.length > 1) ? items.map((i) => (this.gridData.data as any)[i].id) :
      (Array.isArray(items) ? this.gridData.data[(items as any)[0]].id : items);
    const dialogRef = this.dialog.open(SafeFormModalComponent, {
      data: {
        recordId: ids,
        locale: 'en',
        template: this.settings.query.template
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.reloadData();
      }
    });
  }

  /**
   * Opens a confirmation modal and deletes the selected records.
   * @param items items to delete.
   */
  public onDeleteRow(items: number[]): void {
    const recordIds: string[] = [];
    for (const index of items) {
      const id = this.gridData.data[index].id;
      recordIds.push(id);
    }
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: `Delete row${rowsSelected > 1 ? 's' : ''}`,
        content: `Do you confirm the deletion of ${rowsSelected > 1 ?
          'these ' + rowsSelected : 'this'} row${rowsSelected > 1 ? 's' : ''} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<EditRecordMutationResponse>({
          mutation: DELETE_RECORDS,
          variables: {
            ids: recordIds
          }
        }).subscribe(() => {
          this.reloadData();
          this.layoutService.setRightSidenav(null);
        });
      }
    });
  }

  /**
   * Opens a dialog component which provide tools to convert the selected record
   * @param items items to convert to another form.
   */
  public onConvertRecord(items: number[]): void {
    const rowsSelected = items.length;
    const record: string = this.gridData.data[items[0]].id;
    const dialogRef = this.dialog.open(SafeConvertModalComponent, {
      data: {
        title: `Convert record${rowsSelected > 1 ? 's' : ''}`,
        record
      },
    });
    dialogRef.afterClosed().subscribe((value: { targetForm: Form, copyRecord: boolean }) => {
      if (value) {
        const promises: Promise<any>[] = [];
        for (const index of items) {
          const id = this.gridData.data[index].id;
          promises.push(this.apollo.mutate<ConvertRecordMutationResponse>({
            mutation: CONVERT_RECORD,
            variables: {
              id,
              form: value.targetForm.id,
              copyRecord: value.copyRecord
            }
          }).toPromise());
        }
        Promise.all(promises).then(() => {
          this.reloadData();
        });
      }
    });
  }

  // === HISTORY ===

  /**
   * Opens the history of the record on the right side of the screen.
   * @param id id of record to get history of.
   */
  public onViewHistory(id: string): void {
    this.apollo.query<GetRecordDetailsQueryResponse>({
      query: GET_RECORD_DETAILS,
      variables: {
        id
      }
    }).subscribe(res => {
      this.layoutService.setRightSidenav({
        factory: this.factory,
        inputs: {
          record: res.data.record,
          revert: (item: any, dialog: any) => {
            this.confirmRevertDialog(res.data.record, item);
          },
          template: this.settings.query.template
        },
      });
    });
  }

  /**
   * Opens a modal to confirm reversion of a record.
   * @param record record to revert.
   * @param version id of the target version.
   */
  private confirmRevertDialog(record: any, version: any): void {
    const date = new Date(parseInt(version.created, 0));
    const formatDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: `Recovery data`,
        content: `Do you confirm recovery the data from ${formatDate} to the current register?`,
        confirmText: 'Confirm',
        confirmColor: 'primary'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id: record.id,
            version: version.id
          }
        }).subscribe((res) => {
          this.reloadData();
          this.layoutService.setRightSidenav(null);
          this.snackBar.openSnackBar(NOTIFICATIONS.dataRecovered);
        });

      }
    });
  }

  // === EXPORT ===

  /**
   * Downloads file of record.
   * @param file File to download.
   */
  public onDownload(file: any): void {
    const path = `download/file/${file.content}`;
    this.downloadService.getFile(path, file.type, file.name);
  }

  /**
   * Exports selected records to excel / csv file.
   * @param items items to download.
   * @param type type of export file.
   */
  public onExportRecord(items: number[], type: string): void {
    const ids: any[] = [];
    for (const index of items) {
      const id = this.gridData.data[index].id;
      ids.push(id);
    }
    const url = `${this.apiUrl}/download/records`;
    const fileName = `${this.settings.title}.${type}`;
    const queryString = new URLSearchParams({ type }).toString();
    this.downloadService.getFile(`${url}?${queryString}`, `text/${type};charset=utf-8;`, fileName, { params: { ids: ids.join(',') } });
  }

  // === PAGINATION ===

  /**
   * Detects pagination events and update the items loaded.
   * @param event Page change event.
   */
   public pageChange(event: PageChangeEvent): void {
    this.loading = true;
    this.skip = event.skip;
    this.pageSize = event.take;
    this.canUpdateSelectedRows = false;
    this.canDeleteSelectedRows = false;
    if (!!this.parent) {
      this.loadItems();
      this.loading = false;
    } else {
      const filters = [this.filter];
      if (this.settings.query.filter) {
        filters.push(this.settings.query.filter);
      }
      const sortField = (this.sort.length > 0 && this.sort[0].dir) ? this.sort[0].field :
        (this.settings.query.sort && this.settings.query.sort.field ? this.settings.query.sort.field : null);
      const sortOrder = (this.sort.length > 0 && this.sort[0].dir) ? this.sort[0].dir : (this.settings.query.sort?.order || '');
      this.dataQuery.fetchMore({
        variables: {
          first: this.pageSize,
          skip: this.skip,
          filter: { logic: 'and', filters },
          sortField,
          sortOrder
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
          this.loading = false;
          if (!fetchMoreResult) { return prev; }
          for (const field in fetchMoreResult) {
            if (Object.prototype.hasOwnProperty.call(fetchMoreResult, field)) {
              return Object.assign({}, prev, {
                [field]: {
                  edges: fetchMoreResult[field].edges,
                  totalCount: fetchMoreResult[field].totalCount
                }
              });
            }
          }
          return prev;
        }
      });
    }
  }

  // === FILTERING ===

  /**
   * Toggles quick filter visibility
   */
  public onToggleFilter(): void {
    this.showFilter = !this.showFilter;
    this.layout.showFilter = this.showFilter;
    this.saveLocalLayout();
    this.filter = {
      logic: 'and',
      filters: []
    };
    this.layout.filter = this.filter;
    this.saveLocalLayout();
    this.loadItems();
  }

  /**
   * Detects filtering events and update the items loaded.
   * @param filter composite filter created by Kendo.
   */
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.layout.filter = this.filter;
    this.saveLocalLayout();
    if (!!this.parent) {
      this.loadItems();
    } else {
      this.pageChange({ skip: 0, take: this.pageSize });
    }
  }

  /**
   * Filters all the columns using the input text.
   * @param value search value.
   */
  public onSearch(value: any): void {
    const filteredData: any[] = [];
    this.items.forEach((data: any) => {
      const auxData = data;
      delete auxData.canDelete;
      delete auxData.canUpdate;
      delete auxData.__typename;
      if (Object.values(auxData).filter((o: any) => !!o && o.toString().toLowerCase().includes(value.value.toLowerCase())).length > 0) {
        filteredData.push(data);
      }
    });
    this.gridData = {
      data: filteredData,
      total: this.totalCount
    };
    this.initSelectedRows();
  }

  // === SORTING ===

  /**
   * Detects sort events and update the items loaded.
   * @param sort Sort event.
   */
  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.layout.sort = sort;
    this.saveLocalLayout();
    this.skip = 0;
    if (!!this.parent) {
      this.loadItems();
    } else {
      this.pageChange({ skip: 0, take: this.pageSize });
    }
  }

  // === LAYOUT ===

  /**
   * Saves the current layout of the grid as default layout
   */
  saveDefaultLayout(): void {
    this.defaultLayoutChanged.emit(this.layout);
    this.hasLayoutChanges = false;
  }

  /**
   * Saves the current layout of the grid as local layout for this user
   */
  saveLocalLayout(): void {
    this.layoutChanged.emit(this.layout);
    if (!this.hasLayoutChanges) {
      this.hasLayoutChanges = true;
    }
  }

  /**
   * Generates the cached fields config from the grid columns.
   */
  private setColumnsConfig(): void {
    this.layout.fields = this.grid?.columns.toArray().filter((x: any) => x.field).reduce((obj, c: any) => {
      return {
        ...obj,
        [c.field]: {
          field: c.field,
          title: c.title,
          width: c.width,
          hidden: c.hidden,
          order: this.columnsOrder.findIndex((x) => x === c.field)
        }
      };
    }, {});
    this.saveLocalLayout();
  }

  /**
   * Set and emit new grid configuration after column reorder event.
   * @param e ColumnReorderEvent
   */
  columnReorder(e: ColumnReorderEvent): void {
    if ((e.oldIndex !== e.newIndex)) {
      this.columnsOrder = this.grid?.columns.toArray().sort((a: any, b: any) => a.orderIndex - b.orderIndex).map((x: any) => x.field) || [];

      const tempFields: any[] = [];
      let j = 0;
      const oldIndex = e.oldIndex;
      const newIndex = e.newIndex;

      for (let i = 0; i < this.columnsOrder.length; i++) {
        if (i === newIndex) {
          if (oldIndex < newIndex) {
            tempFields[j] = this.columnsOrder[i];
            j++;
            tempFields[j] = this.columnsOrder[oldIndex];
          }
          if (oldIndex > newIndex) {
            tempFields[j] = this.columnsOrder[oldIndex];
            j++;
            tempFields[j] = this.columnsOrder[i];
          }
          j++;
        }
        else if (i !== oldIndex) {
          tempFields[j] = this.columnsOrder[i];
          j++;
        }
      }
      this.columnsOrder = tempFields.filter(x => x !== undefined);
      this.setColumnsConfig();
    }
  }

  /**
   * Sets and emits new grid configuration after column resize event.
   */
  columnResize(): void {
    this.setColumnsConfig();
  }

  /**
   * Sets and emits new grid configuration after column visibility event.
   */
  columnVisibilityChange(): void {
    this.setColumnsConfig();
  }


  // === UTILITIES ===

  /**
   * Expands text in a full window modal.
   * @param item Item to display data of.
   * @param rowTitle field name.
   */
   public onExpandComment(item: any, rowTitle: any): void {
    const dialogRef = this.dialog.open(SafeExpandedCommentComponent, {
      data: {
        title: rowTitle,
        comment: get(item, rowTitle),
        readOnly: !this.settings.actions || !this.settings.actions.inlineEdition
      },
      autoFocus: false,
      position: {
        bottom: '0',
        right: '0'
      },
      panelClass: 'expanded-widget-dialog'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.gridData.data.find(x => x.id === item.id)[rowTitle] = res;
        this.items.find(x => x.id === item.id)[rowTitle] = res;
        if (this.updatedItems.find(x => x.id === item.id) !== undefined) {
          this.updatedItems.find(x => x.id === item.id)[rowTitle] = res;
        }
        else {
          this.updatedItems.push({ [rowTitle]: res, id: item.id });
        }
      }
    });
  }

  /**
   * Checks if element overflows
   * @param e Component resizing event.
   * @returns True if overflows.
   */
  isEllipsisActive(e: any): boolean {
    return (e.offsetWidth < e.scrollWidth);
  }
}
