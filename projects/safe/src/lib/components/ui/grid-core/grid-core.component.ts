import {
  Component, ComponentFactory, ComponentFactoryResolver, EventEmitter,
  Inject, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  GridComponent as KendoGridComponent,
  GridDataResult,
  PageChangeEvent,
  SelectionEvent
} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor } from '@progress/kendo-data-query';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { SafeAuthService } from '../../../services/auth.service';
import { SafeDownloadService } from '../../../services/download.service';
import { SafeLayoutService } from '../../../services/layout.service';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { SafeRecordHistoryComponent } from '../../record-history/record-history.component';
import { ConvertRecordMutationResponse, CONVERT_RECORD, DELETE_RECORDS, EditRecordMutationResponse, EDIT_RECORD } from '../../../graphql/mutations';
import { GetRecordDetailsQueryResponse, GET_RECORD_DETAILS } from '../../../graphql/queries';
import { SafeFormModalComponent } from '../../form-modal/form-modal.component';
import { SafeRecordModalComponent } from '../../record-modal/record-modal.component';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { SafeConvertModalComponent } from '../../convert-modal/convert-modal.component';
import { Form } from '../../../models/form.model';
import { NOTIFICATIONS } from '../../../const/notifications';
import { GridLayout } from './models/grid-layout.model';
import { GridSettings, FilterType } from './models/grid-settings.model';
import isEqual from 'lodash/isEqual';
import { SafeGridService } from '../../../services/grid.service';

const DEFAULT_FILE_NAME = 'grid.xlsx';

const cloneData = (data: any[]) => data.map(item => Object.assign({}, item));

@Component({
  selector: 'safe-grid-core',
  templateUrl: './grid-core.component.html',
  styleUrls: ['./grid-core.component.scss']
})
export class SafeGridCoreComponent implements OnInit, OnChanges, OnDestroy {

  // === INPUTS ===
  @Input() settings: GridSettings | any = {};
  @Input() layout: GridLayout = {}; // Cached layout

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
  public error = false;

  // === SORTING ===
  public sort: SortDescriptor[] = [];

  get sortField(): string | null {
    return (this.sort.length > 0 && this.sort[0].dir) ? this.sort[0].field :
    (this.settings.query.sort && this.settings.query.sort.field ? this.settings.query.sort.field : null);
  }

  get sortOrder(): string {
    return (this.sort.length > 0 && this.sort[0].dir) ? this.sort[0].dir : (this.settings.query.sort?.order || '');
  }

  // === FILTERING ===
  public filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public showFilter = false;

  get queryFilter(): CompositeFilterDescriptor {
    const filters = [this.filter];
    if (this.settings?.query?.filter) {
      filters.push(this.settings?.query?.filter);
    }
    return { logic: 'and', filters };
  }

  // === LAYOUT CHANGES ===
  public hasLayoutChanges = false;

  // === AUTHORIZATION ===
  public isAdmin: boolean;

  // === ACTIONS ON SELECTION ===
  public selectedRowsIndex: number[] = [];
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

  // === ACTIONS ===
  public actions = {
    add: false,
    update: false,
    delete: false,
    history: false,
    convert: false
  };

  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    public dialog: MatDialog,
    private resolver: ComponentFactoryResolver,
    private queryBuilder: QueryBuilderService,
    private layoutService: SafeLayoutService,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private safeAuthService: SafeAuthService,
    private gridService: SafeGridService
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
    // define row actions
    this.actions = {
      add: this.settings.actions?.addRecord && this.settings.query?.template,
      history: this.settings.actions?.history,
      update: this.settings.actions?.update,
      delete: this.settings.actions?.delete,
      convert: this.settings.actions?.convert
    };
    // this.selectableSettings = { ...this.selectableSettings, mode: this.multiSelect ? 'multiple' : 'single' };
    this.hasLayoutChanges = this.settings.defaultLayout ? !isEqual(this.layout, JSON.parse(this.settings.defaultLayout)) : true;
    if (this.layout?.filter) {
      this.filter = this.layout.filter;
    }
    if (this.layout?.sort) {
      this.sort = this.layout.sort;
    }
    this.showFilter = !!this.layout?.showFilter;
    // this.loadItems();
    this.excelFileName = this.settings.title ? `${this.settings.title}.xlsx` : DEFAULT_FILE_NAME;
    // Builds custom query.
    const builtQuery = this.queryBuilder.buildQuery(this.settings);
    this.dataQuery = this.apollo.watchQuery<any>({
      query: builtQuery,
      variables: {
        first: this.pageSize,
        filter: this.queryFilter,
        sortField: this.sortField,
        sortOrder: this.sortOrder
      }
    });
    this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings, false);
    if (this.metaQuery) {
      this.metaQuery.subscribe(async (res: any) => {
        this.error = false;
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            this.metaFields = Object.assign({}, res.data[field]);
            await this.gridService.populateMetaFields(this.metaFields);
            const fields = this.settings?.query?.fields || [];
            this.fields = this.gridService.getFields(fields, this.metaFields, {}, '', { filter: true });
          }
        }
        this.getRecords();
      }, () => {
        this.loading = false;
        this.error = true;
      });
    } else {
      this.loading = false;
      this.error = true;
    }
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
   * Cancels inline edition.
   */
  // public cancelHandler(): void {
  //   this.closeEditor();
  // }

  /**
   * Updates a record when inline edition completed.
   */
  // public updateCurrent(): void {
  //   if (this.isNew) {
  //   } else {
  //     if (this.formGroup.dirty) {
  //       this.update(this.editedRecordId, this.formGroup.value);
  //     }
  //   }
  //   this.closeEditor();
  // }

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
   * Saves all inline changes and then reload data.
   */
  // public onSaveChanges(): void {
  //   this.closeEditor();
  //   if (this.hasChanges) {
  //     Promise.all(this.promisedChanges()).then(() => this.reloadData());
  //   }
  // }

  /**
   * Cancels inline edition without saving.
   */
  // public onCancelChanges(): void {
  //   this.closeEditor();
  //   this.updatedItems = [];
  //   this.items = this.originalItems;
  //   this.originalItems = cloneData(this.originalItems);
  //   this.loadItems();
  // }

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

  // === DATA ===

  /**
   * Loads the data, using grid parameters.
   */
  private getRecords(): void {
    this.loading = true;
    this.updatedItems = [];
    if (this.dataQuery) {
      this.dataSubscription = this.dataQuery.valueChanges.subscribe((res: any) => {
        this.loading = false;
        this.error = false;
        for (const field in res.data) {
          if (Object.prototype.hasOwnProperty.call(res.data, field)) {
            const nodes = res.data[field].edges.map((x: any) => x.node) || [];
            this.totalCount = res.data[field].totalCount;
            this.items = cloneData(nodes);
            this.convertDateFields(this.items);
            this.originalItems = cloneData(this.items);
            this.loadItems();
            // if (!this.readOnly) {
            //   this.initSelectedRows();
            // }
          }
        }
      },
        () => {
          this.error = true;
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  /**
   * Sets the list of items to display.
   */
  private loadItems(): void {
    this.gridData = {
      data: this.items,
      total: this.totalCount
    };
  }

  /**
   * Reloads data and unselect all rows.
   */
  public reloadData(): void {
    this.onPageChange({ skip: 0, take: this.pageSize });
    this.selectedRowsIndex = [];
    this.updatedItems = [];
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

  // === GRID ACTIONS ===
  /**
   * Handles grid actions.
   * @param event Grid Action.
   */
  public onAction(event: {action: string, item?: any, items?: any[]}): void {
    switch (event.action) {
      case 'add': {
        console.log('add');
        break;
      }
      case 'details': {
        if (event.item) {
          this.onShowDetails(event.item);
        }
        break;
      }
      case 'update': {
        if (event.item) {
          this.onUpdate([event.item]);
        }
        if (event.items && event.items.length > 0) {
          this.onUpdate(event.items);
        }
        break;
      }
      case 'history': {
        if (event.item) {
          this.onViewHistory(event.item);
        }
        break;
      }
      case 'convert': {
        if (event.item) {
          this.onConvert([event.item]);
        }
        if (event.items && event.items.length > 0) {
          this.onConvert(event.items);
        }
        break;
      }
      case 'delete': {
        if (event.item) {
          this.onDelete([event.item]);
        }
        if (event.items && event.items.length > 0) {
          this.onDelete(event.items);
        }
        break;
      }
      default: {
        break;
      }
    }
  }

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
        template: this.settings.query.template
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.onUpdate([item]);
      }
    });
  }

  /**
   * Opens the form corresponding to selected row in order to update it
   * @param items items to update.
   */
  public onUpdate(items: any[]): void {
    const ids: string[] = items.map(x => x.id);
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
  public onDelete(items: any[]): void {
    const ids: string[] = items.map(x => x.id);
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
            ids
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
  public onConvert(items: any[]): void {
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(SafeConvertModalComponent, {
      data: {
        title: `Convert record${rowsSelected > 1 ? 's' : ''}`,
        record: items[0].id
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
  public onViewHistory(item: any): void {
    this.apollo.query<GetRecordDetailsQueryResponse>({
      query: GET_RECORD_DETAILS,
      variables: {
        id: item.id
      }
    }).subscribe(res => {
      this.layoutService.setRightSidenav({
        factory: this.factory,
        inputs: {
          record: res.data.record,
          revert: (record: any, dialog: any) => {
            this.confirmRevertDialog(res.data.record, record);
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
   * Exports selected records to excel / csv file.
   * @param items items to download.
   * @param type type of export file.
   */
  public onExportRecord(items: number[], type: string): void {
    // this.gridService.export()
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
  public onPageChange(event: PageChangeEvent): void {
    this.loading = true;
    this.skip = event.skip;
    this.pageSize = event.take;
    this.dataQuery.fetchMore({
      variables: {
        first: this.pageSize,
        skip: this.skip,
        filter: this.queryFilter,
        sortField: this.sortField,
        sortOrder: this.sortOrder
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        // this.loading = false;
        if (!fetchMoreResult) { return prev; }
        for (const field in fetchMoreResult) {
          if (Object.prototype.hasOwnProperty.call(fetchMoreResult, field)) {
            this.loading = false;
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

  // === FILTERING ===
  /**
   *  Toggles quick filter visibility.
   * @param showFilter Show filter event.
   */
  public onShowFilterChange(showFilter: boolean): void {
    this.showFilter = showFilter;
    this.layout.showFilter = this.showFilter;
    this.saveLocalLayout();
  }

  /**
   * Detects filtering events and update the items loaded.
   * @param filter composite filter created by Kendo.
   */
  public onFilterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.layout.filter = this.filter;
    this.saveLocalLayout();
    this.skip = 0;
    this.onPageChange({ skip: this.skip, take: this.pageSize });
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
  public onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.layout.sort = sort;
    this.saveLocalLayout();
    this.skip = 0;
    this.onPageChange({ skip: this.skip, take: this.pageSize });
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
}
