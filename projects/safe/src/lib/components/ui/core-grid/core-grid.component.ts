import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  GridDataResult,
  PageChangeEvent,
  SelectionEvent,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { SafeAuthService } from '../../../services/auth.service';
import { SafeDownloadService } from '../../../services/download.service';
import { SafeLayoutService } from '../../../services/layout.service';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { SafeRecordHistoryComponent } from '../../record-history/record-history.component';
import {
  ConvertRecordMutationResponse,
  CONVERT_RECORD,
  DELETE_RECORDS,
  EditRecordMutationResponse,
  EDIT_RECORD,
} from '../../../graphql/mutations';
import {
  GetFormByIdQueryResponse,
  GetRecordDetailsQueryResponse,
  GET_FORM_BY_ID,
  GET_RECORD_DETAILS,
} from '../../../graphql/queries';
import { SafeFormModalComponent } from '../../form-modal/form-modal.component';
import { SafeRecordModalComponent } from '../../record-modal/record-modal.component';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { SafeConvertModalComponent } from '../../convert-modal/convert-modal.component';
import { Form } from '../../../models/form.model';
import { GridLayout } from './models/grid-layout.model';
import { GridSettings } from './models/grid-settings.model';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { SafeGridService } from '../../../services/grid.service';
import { SafeResourceGridModalComponent } from '../../search-resource-grid-modal/search-resource-grid-modal.component';
import { SafeGridComponent } from './grid/grid.component';
import { TranslateService } from '@ngx-translate/core';
import * as Survey from 'survey-angular';

const DEFAULT_FILE_NAME = 'Records';

const cloneData = (data: any[]) => data.map((item) => Object.assign({}, item));

@Component({
  selector: 'safe-core-grid',
  templateUrl: './core-grid.component.html',
  styleUrls: ['./core-grid.component.scss'],
})
export class SafeCoreGridComponent implements OnInit, OnChanges, OnDestroy {
  // === INPUTS ===
  @Input() settings: GridSettings | any = {};
  @Input() defaultLayout: GridLayout = {}; // Cached layout
  get layout(): any {
    // Current layout
    return this.grid?.layout;
  }

  // === SELECTION INPUTS ===
  @Input() multiSelect = true;
  @Input() selectedRows: string[] = [];
  @Input() selectable = true;
  @Output() selectionChange = new EventEmitter();

  get selectedItems(): any[] {
    return this.gridData.data.filter((x) => this.selectedRows.includes(x.id));
  }

  // === FEATURES INPUTS ===
  @Input() showDetails = true;
  @Input() showExport = false;
  @Input() admin = false;

  // === OUTPUTS ===
  @Output() layoutChanged: EventEmitter<any> = new EventEmitter();
  @Output() defaultLayoutChanged: EventEmitter<any> = new EventEmitter();
  @Output() defaultLayoutReset: EventEmitter<any> = new EventEmitter();

  // === SELECTION OUTPUTS ===
  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();

  // === TEMPLATE REFERENCE TO GRID ===
  @ViewChild(SafeGridComponent)
  private grid?: SafeGridComponent;

  // === DATA ===
  public gridData: GridDataResult = { data: [], total: 0 };
  private totalCount = 0;
  private items: any[] = [];
  public fields: any[] = [];
  private metaFields: any;
  public detailsField?: any;
  private dataQuery!: QueryRef<any>;
  private metaQuery: any;
  private dataSubscription?: Subscription;
  private columnsOrder: any[] = [];

  // === PAGINATION ===
  public pageSize = 10;
  public skip = 0;
  @Output() pageSizeChanged: EventEmitter<any> = new EventEmitter<any>();

  // === INLINE EDITION ===
  private originalItems: any[] = this.gridData.data;
  public updatedItems: any[] = [];
  public formGroup: FormGroup = new FormGroup({});
  public loading = false;
  public error = false;
  private templateStructure = '';

  // === SORTING ===
  public sort: SortDescriptor[] = [];

  get sortField(): string | null {
    return this.sort.length > 0 && this.sort[0].dir
      ? this.sort[0].field
      : this.settings.query?.sort && this.settings.query.sort.field
      ? this.settings.query.sort.field
      : null;
  }

  get sortOrder(): string {
    return this.sort.length > 0 && this.sort[0].dir
      ? this.sort[0].dir
      : this.settings.query?.sort?.order || '';
  }

  get style(): any {
    return this.settings.query?.style || null;
  }

  // === FILTERING ===
  public filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  public showFilter = false;
  public search = '';

  /**
   * All active filters of the grid.
   */
  get queryFilter(): CompositeFilterDescriptor {
    const gridFilters = [this.filter];
    if (this.settings?.query?.filter) {
      gridFilters.push(this.settings?.query?.filter);
    }
    if (this.search) {
      const textFields = this.fields.filter(
        (x) => x.meta && x.meta.type === 'text'
      );
      const searchFilters = textFields.map((x) => ({
        field: x.name,
        operator: 'contains',
        value: this.search,
      }));
      return {
        logic: 'and',
        filters: [
          { logic: 'and', filters: gridFilters },
          { logic: 'or', filters: searchFilters },
        ],
      };
    } else {
      return { logic: 'and', filters: gridFilters };
    }
  }

  // === LAYOUT CHANGES ===
  public hasLayoutChanges = false;

  // === AUTHORIZATION ===
  public isAdmin: boolean;

  // === ACTIONS ON SELECTION ===
  public selectedRowsIndex: number[] = [];
  public editionActive = false;

  // === DOWNLOAD ===
  private apiUrl = '';
  /** Builds filename from the date and widget title */
  get fileName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    return `${
      this.settings.title ? this.settings.title : DEFAULT_FILE_NAME
    } ${formatDate}.png`;
  }

  get hasChanges(): boolean {
    return this.updatedItems.length > 0;
  }

  // === ACTIONS ===
  public actions = {
    add: false,
    update: false,
    delete: false,
    history: false,
    convert: false,
    export: true,
    showDetails: true,
  };

  public editable = false;

  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    public dialog: MatDialog,
    private queryBuilder: QueryBuilderService,
    private layoutService: SafeLayoutService,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private safeAuthService: SafeAuthService,
    private gridService: SafeGridService,
    private translate: TranslateService
  ) {
    this.apiUrl = environment.apiUrl;
    this.isAdmin =
      this.safeAuthService.userIsAdmin && environment.module === 'backoffice';
  }

  // === COMPONENT LIFECYCLE ===
  ngOnInit(): void {}

  /**
   * Detects changes of the settings to (re)load the data.
   */
  ngOnChanges(changes?: SimpleChanges): void {
    if (changes?.settings) {
      this.configureGrid();
    }
  }

  public configureGrid(): void {
    // define row actions
    this.actions = {
      add:
        get(this.settings, 'actions.addRecord', false) &&
        this.settings.template,
      history: get(this.settings, 'actions.history', false),
      update: get(this.settings, 'actions.update', false),
      delete: get(this.settings, 'actions.delete', false),
      convert: get(this.settings, 'actions.convert', false),
      export: get(this.settings, 'actions.export', true),
      showDetails: get(this.settings, 'actions.showDetails', true),
    };
    this.editable = this.settings.actions?.inlineEdition;
    // this.selectableSettings = { ...this.selectableSettings, mode: this.multiSelect ? 'multiple' : 'single' };
    this.hasLayoutChanges = this.settings.defaultLayout
      ? !isEqual(this.defaultLayout, JSON.parse(this.settings.defaultLayout))
      : true;
    if (this.defaultLayout?.filter) {
      this.filter = this.defaultLayout.filter;
    }
    if (this.defaultLayout?.sort) {
      this.sort = this.defaultLayout.sort;
    }
    this.showFilter = !!this.defaultLayout?.showFilter;
    if (this.settings.query.pageSize) {
      this.pageSize = this.settings.query.pageSize;
    }
    // Builds custom query.
    const builtQuery = this.queryBuilder.buildQuery(this.settings);
    this.dataQuery = this.apollo.watchQuery<any>({
      query: builtQuery,
      variables: {
        first: this.pageSize,
        filter: this.queryFilter,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        styles: this.style,
      },
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
    });
    this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings?.query);
    if (this.metaQuery) {
      this.loading = true;
      this.metaQuery.subscribe(
        async (res: any) => {
          this.error = false;
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              this.metaFields = Object.assign({}, res.data[field]);
              await this.gridService.populateMetaFields(this.metaFields);
              const fields = this.settings?.query?.fields || [];
              const defaultLayoutFields = this.defaultLayout.fields || {};
              this.fields = this.gridService.getFields(
                fields,
                this.metaFields,
                defaultLayoutFields,
                ''
              );
            }
          }
          this.getRecords();
        },
        () => {
          this.loading = false;
          this.error = true;
        }
      );
    } else {
      this.loading = false;
      this.error = true;
    }
    this.loadTemplate();
  }

  /**
   * Removes subscriptions when component is destroyed, to avoid duplication.
   */
  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  /**
   * Get template structure, for inline edition validation.
   */
  private async loadTemplate(): Promise<void> {
    if (this.settings.template)
      this.apollo
        .query<GetFormByIdQueryResponse>({
          query: GET_FORM_BY_ID,
          variables: {
            id: this.settings.template,
          },
        })
        .subscribe((res) => {
          if (res.data.form.structure) {
            this.templateStructure = res.data.form.structure;
          }
        });
  }

  // === GRID FIELDS ===

  /**
   * Converts fields with date type into javascript dates.
   *
   * @param items list of items to update.
   */
  private convertDateFields(items: any[]): void {
    const dateFields = this.fields
      .filter((x) => ['Date', 'DateTime'].includes(x.type))
      .map((x) => x.name);
    const timeFields = this.fields
      .filter((x) => ['Time'].includes(x.type))
      .map((x) => x.name);
    items.map((x) => {
      for (const [key, value] of Object.entries(x)) {
        if (dateFields.includes(key) || timeFields.includes(key)) {
          x[key] = x[key] && new Date(x[key]);
          if (timeFields.includes(key)) {
            x[key] =
              x[key] &&
              new Date(
                x[key].getTime() + x[key].getTimezoneOffset() * 60 * 1000
              );
          }
        }
      }
    });
  }

  /**
   * Finds item in data items and updates it with new values, from inline edition.
   *
   * @param id Item id.
   * @param value Updated value of the item.
   */
  private update(item: any, value: any): void {
    let updatedItem = this.updatedItems.find((x) => x.id === item.id);
    if (updatedItem) {
      updatedItem = { ...updatedItem, ...value };
      const index = this.updatedItems.findIndex((x) => x.id);
      this.updatedItems.splice(index, 1, updatedItem);
    } else {
      this.updatedItems.push({ id: item.id, ...value });
    }
    Object.assign(
      this.items.find((x) => x.id === item.id),
      value
    );
    this.loadItems();
  }

  /**
   * Saves all inline changes and then reload data.
   */
  public onSaveChanges(): void {
    if (this.hasChanges) {
      let hasError = false;
      let error = '';
      let questionWithError = '';
      let index = -1;
      const survey = new Survey.Model(this.templateStructure);
      survey.locale = this.translate.currentLang;
      for (const item of this.updatedItems) {
        survey.data = item;
        survey.completeLastPage();
        if (survey.hasErrors()) {
          hasError = true;
          const questions = survey.getAllQuestions();
          for (const question of questions) {
            if (question.hasErrors()) {
              index = this.items.findIndex((x) => x.id === item.id);
              questionWithError = question.name;
              error = question.getAllErrors()[0].getText();
              break;
            }
          }
          if (error) {
            break;
          }
        }
      }
      if (!hasError) {
        Promise.all(this.promisedChanges()).then(() => this.reloadData());
      } else {
        // Open snackbar to indicate the error
        this.snackBar.openSnackBar(
          this.translate.instant(
            'components.widget.grid.errors.validationFailed',
            {
              index,
              question: questionWithError,
              error,
            }
          ),
          {
            error: true,
            duration: 8000,
          }
        );
      }
    }
  }

  /**
   * Cancels inline edition without saving.
   */
  public onCancelChanges(): void {
    this.updatedItems = [];
    this.items = this.originalItems;
    this.originalItems = cloneData(this.originalItems);
    this.loadItems();
  }

  /**
   * Creates a list of promise to send for inline edition of records, once completed.
   *
   * @returns List of promises to execute.
   */
  public promisedChanges(): Promise<any>[] {
    const promises: Promise<any>[] = [];
    for (const item of this.updatedItems) {
      const data = Object.assign({}, item);
      delete data.id;
      for (const field of this.fields) {
        if (field.type === 'Time') {
          const time = data[field.name]
            .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            .split(/:| /);
          if (
            (time[2] === 'PM' && time[0] !== '12') ||
            (time[2] === 'AM' && time[0] === '12')
          ) {
            time[0] = (parseInt(time[0], 10) + 12).toString();
          }
          data[field.name] = time[0] + ':' + time[1];
        }
      }
      promises.push(
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: item.id,
              data,
              template: this.settings.template,
            },
          })
          .toPromise()
      );
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
      this.dataSubscription = this.dataQuery.valueChanges.subscribe(
        (res: any) => {
          this.loading = false;
          this.error = false;
          for (const field in res.data) {
            if (Object.prototype.hasOwnProperty.call(res.data, field)) {
              const nodes =
                res.data[field].edges.map((x: any) => ({
                  ...x.node,
                  _meta: {
                    style: x.meta.style,
                  },
                })) || [];
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
        }
      );
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
      total: this.totalCount,
    };
  }

  /**
   * Reloads data and unselect all rows.
   */
  public reloadData(): void {
    this.onPageChange({ skip: 0, take: this.pageSize });
    this.selectedRows = [];
    this.updatedItems = [];
  }

  // === SELECTION ===

  /**
   * Handle selection change event.
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

  // === GRID ACTIONS ===

  /**
   * Handles grid actions.
   *
   * @param event Grid Action.
   */
  public onAction(event: {
    action: string;
    item?: any;
    items?: any[];
    value?: any;
    field?: any;
  }): void {
    switch (event.action) {
      case 'add': {
        this.onAdd();
        break;
      }
      case 'edit': {
        if (event.item && event.value) {
          this.update(event.item, event.value);
        }
        break;
      }
      case 'save': {
        this.onSaveChanges();
        break;
      }
      case 'cancel': {
        this.onCancelChanges();
        break;
      }
      case 'details': {
        if (event.items) {
          this.onShowDetails(event.items, event.field);
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
      case 'resetLayout': {
        this.resetDefaultLayout();
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Displays an embedded form in a modal to add new record.
   */
  private onAdd(): void {
    if (this.settings.template) {
      const dialogRef = this.dialog.open(SafeFormModalComponent, {
        disableClose: true,
        data: {
          template: this.settings.template,
          locale: 'en',
          askForConfirm: false,
        },
        height: '98%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.reloadData();
        }
      });
    }
  }

  /**
   * Opens the record on a read-only modal. If edit mode is enabled, can open edition modal.
   *
   * @param item item to get details of.
   */
  public onShowDetails(items: any | any[], field?: any): void {
    const isArray = Array.isArray(items);
    if (isArray && items.length >= 2) {
      const idsFilter = {
        field: 'ids',
        operator: 'in',
        value: items.map((x: { id: any }) => x.id),
      };
      // for resources, open it inside the SafeResourceGrid
      this.dialog.open(SafeResourceGridModalComponent, {
        data: {
          multiselect: false,
          gridSettings: {
            fields: field.query.fields,
            sort: field.query.sort,
            filter: {
              logic: 'and',
              filters: [idsFilter, field.query.filter],
            },
            name: this.queryBuilder.getQueryNameFromResourceName(field.type),
            template: null,
          },
        },
      });
    } else {
      const dialogRef = this.dialog.open(SafeRecordModalComponent, {
        data: {
          recordId: isArray ? items[0].id : items.id,
          locale: 'en',
          canUpdate:
            this.settings.actions &&
            this.settings.actions.update &&
            items.canUpdate,
          ...(!isArray && { template: this.settings.template }),
        },
        height: '98%',
        width: '100vw',
        panelClass: 'full-screen-modal',
        autoFocus: false,
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.onUpdate(isArray ? items : [items]);
        }
      });
    }
  }

  /**
   * Opens the form corresponding to selected row in order to update it
   *
   * @param items items to update.
   */
  public onUpdate(items: any[]): void {
    const ids: string[] = items.map((x) => (x.id ? x.id : x));
    const dialogRef = this.dialog.open(SafeFormModalComponent, {
      disableClose: true,
      data: {
        recordId: ids.length > 1 ? ids : ids[0],
        locale: 'en',
        template: this.settings.template || null,
      },
      height: '98%',
      width: '100vw',
      panelClass: 'full-screen-modal',
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.reloadData();
      }
    });
  }

  /**
   * Opens a confirmation modal and deletes the selected records.
   *
   * @param items items to delete.
   */
  public onDelete(items: any[]): void {
    const ids: string[] = items.map((x) => (x.id ? x.id : x));
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name:
            rowsSelected > 1
              ? this.translate.instant('common.row.few')
              : this.translate.instant('common.row.one'),
        }),
        content: this.translate.instant(
          'components.form.deleteRow.confirmationMessage',
          {
            quantity: rowsSelected,
            rowText:
              rowsSelected > 1
                ? this.translate.instant('common.row.few')
                : this.translate.instant('common.row.one'),
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: DELETE_RECORDS,
            variables: {
              ids,
            },
          })
          .subscribe(() => {
            this.reloadData();
            this.layoutService.setRightSidenav(null);
          });
      }
    });
  }

  /**
   * Opens a dialog component which provide tools to convert the selected record
   *
   * @param items items to convert to another form.
   */
  public onConvert(items: any[]): void {
    const rowsSelected = items.length;
    const dialogRef = this.dialog.open(SafeConvertModalComponent, {
      data: {
        title: `Convert record${rowsSelected > 1 ? 's' : ''}`,
        record: items[0].id ? items[0].id : items[0],
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((value: { targetForm: Form; copyRecord: boolean }) => {
        if (value) {
          const promises: Promise<any>[] = [];
          for (const item of items) {
            promises.push(
              this.apollo
                .mutate<ConvertRecordMutationResponse>({
                  mutation: CONVERT_RECORD,
                  variables: {
                    id: item.id ? item.id : item,
                    form: value.targetForm.id,
                    copyRecord: value.copyRecord,
                  },
                })
                .toPromise()
            );
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
   *
   * @param item record to get history of.
   */
  public onViewHistory(item: any): void {
    this.layoutService.setRightSidenav({
      component: SafeRecordHistoryComponent,
      inputs: {
        id: item.id,
        revert: (version: any) => this.confirmRevertDialog(item, version),
        template: this.settings.template || null,
      },
    });
  }

  /**
   * Opens a modal to confirm reversion of a record.
   *
   * @param record record to revert.
   * @param version id of the target version.
   */
  private confirmRevertDialog(record: any, version: any): void {
    // eslint-disable-next-line radix
    const date = new Date(parseInt(version.createdAt, 0));
    const formatDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('components.record.recovery.title'),
        content: this.translate.instant(
          'components.record.recovery.confirmationMessage',
          { date: formatDate }
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmColor: 'primary',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: record.id,
              version: version.id,
            },
          })
          .subscribe((res) => {
            this.reloadData();
            this.layoutService.setRightSidenav(null);
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.dataRecovered')
            );
          });
      }
    });
  }

  // === EXPORT ===
  /**
   * Exports selected records to excel / csv file.
   *
   * @param items items to download.
   * @param type type of export file.
   */
  public onExport(e: any): void {
    let ids: any[];
    if (e.records === 'selected') {
      ids = this.selectedRows;
      if (ids.length === 0) {
        this.snackBar.openSnackBar(
          'Please select at least one record in the grid.',
          { error: true }
        );
        return;
      }
    } else {
      if (this.gridData.data.length > 0) {
        ids = [this.gridData.data[0].id];
      } else {
        this.snackBar.openSnackBar('Export failed: grid is empty.', {
          error: true,
        });
        return;
      }
    }

    // Builds the request body with all the useful data
    const currentLayout = this.layout;
    const body = {
      ids,
      filter:
        e.records === 'selected'
          ? {
              logic: 'and',
              filters: [{ operator: 'eq', field: 'ids', value: ids }],
            }
          : this.queryFilter,
      query: this.settings.query,
      sortField: this.sortField,
      sortOrder: this.sortOrder,
      format: e.format,
      // we only export visible fields ( not hidden )
      ...(e.fields === 'visible' && {
        fields: Object.values(currentLayout.fields)
          .filter((x: any) => !x.hidden)
          .sort((a: any, b: any) => a.order - b.order)
          .map((x: any) => ({
            name: x.field,
            title: x.title,
            subFields: x.subFields.map((y: any) => ({
              name: y.name,
              title: y.title,
            })),
          })),
      }),
      // we export ALL fields of the grid ( including hidden columns )
      ...(e.fields === 'all' && {
        fields: Object.values(currentLayout.fields)
          .sort((a: any, b: any) => a.order - b.order)
          .map((x: any) => ({
            name: x.field,
            title: x.title,
            subFields: x.subFields.map((y: any) => ({
              name: y.name,
              title: y.title,
            })),
          })),
      }),
    };

    // Builds and make the request
    this.downloadService.getRecordsExport(
      `${this.apiUrl}/download/records`,
      `text/${e.format};charset=utf-8;`,
      `${this.fileName}.${e.format}`,
      body
    );
  }

  // === PAGINATION ===
  /**
   * Detects pagination events and update the items loaded.
   *
   * @param event Page change event.
   */
  public onPageChange(event: PageChangeEvent): void {
    this.loading = true;
    this.skip = event.skip;
    this.pageSize = event.take;
    this.pageSizeChanged.emit(this.pageSize);
    this.dataQuery.fetchMore({
      variables: {
        first: this.pageSize,
        skip: this.skip,
        filter: this.queryFilter,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
        styles: this.style,
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        // this.loading = false;
        if (!fetchMoreResult) {
          return prev;
        }
        for (const field in fetchMoreResult) {
          if (Object.prototype.hasOwnProperty.call(fetchMoreResult, field)) {
            this.loading = false;
            return Object.assign({}, prev, {
              [field]: {
                edges: fetchMoreResult[field].edges,
                totalCount: fetchMoreResult[field].totalCount,
              },
            });
          }
        }
        return prev;
      },
    });
  }

  // === FILTERING ===
  /**
   *  Toggles quick filter visibility.
   *
   * @param showFilter Show filter event.
   */
  public onShowFilterChange(showFilter: boolean): void {
    this.showFilter = showFilter;
    this.saveLocalLayout();
  }

  /**
   * Detects filtering events and update the items loaded.
   *
   * @param filter composite filter created by Kendo.
   */
  public onFilterChange(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.saveLocalLayout();
    this.skip = 0;
    this.onPageChange({ skip: this.skip, take: this.pageSize });
  }

  /**
   * Handles search event.
   *
   * @param search Search event.
   */
  public onSearchChange(search: string): void {
    this.search = search;
    this.skip = 0;
    this.onPageChange({ skip: this.skip, take: this.pageSize });
  }

  // === SORTING ===

  /**
   * Detects sort events and update the items loaded.
   *
   * @param sort Sort event.
   */
  public onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.saveLocalLayout();
    this.skip = 0;
    this.onPageChange({ skip: this.skip, take: this.pageSize });
  }

  // === LAYOUT ===
  /**
   * Detects fields changes.
   *
   * @param fields Fields event.
   */
  onColumnChange(): void {
    this.saveLocalLayout();
  }

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
   * Reset the currently cached layout to the default one
   */
  resetDefaultLayout(): void {
    this.defaultLayoutReset.emit();
  }
}
