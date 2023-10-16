import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
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
import { AuthService } from '../../../services/auth/auth.service';
import { DownloadService } from '../../../services/download/download.service';
import {
  QueryBuilderService,
  QueryResponse,
} from '../../../services/query-builder/query-builder.service';
import {
  CONVERT_RECORD,
  DELETE_RECORDS,
  EDIT_RECORD,
} from './graphql/mutations';
import { GET_RESOURCE_QUERY_NAME } from './graphql/queries';
import {
  ConvertRecordMutationResponse,
  EditRecordMutationResponse,
  Record,
} from '../../../models/record.model';
import { GridLayout } from './models/grid-layout.model';
import { GridSettings } from './models/grid-settings.model';
import { get, isEqual } from 'lodash';
import { GridService } from '../../../services/grid/grid.service';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '../../../pipes/date/date.pipe';
import { GridComponent } from './grid/grid.component';
import { DateTranslateService } from '../../../services/date-translate/date-translate.service';
import { ApplicationService } from '../../../services/application/application.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { firstValueFrom, Subject } from 'rxjs';
import { searchFilters } from '../../../utils/filter/search-filters';
import { SnackbarService, UILayoutService } from '@oort-front/ui';
import { ConfirmService } from '../../../services/confirm/confirm.service';
import { ContextService } from '../../../services/context/context.service';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { Router } from '@angular/router';

/**
 * Default file name when exporting grid data.
 */
const DEFAULT_FILE_NAME = 'Records';

/**
 * Clone the data. Used in order to prevent edition of the grid items directly, and to be able to revert the changes.
 *
 * @param data grid data
 * @returns cloned grid data
 */
const cloneData = (data: any[]) => data.map((item) => Object.assign({}, item));

/**
 * Main Grid data component to display Records.
 * Used by grid widget, and in several other places, like record selection.
 */
@Component({
  selector: 'shared-core-grid',
  templateUrl: './core-grid.component.html',
  styleUrls: ['./core-grid.component.scss'],
})
export class CoreGridComponent
  extends UnsubscribeComponent
  implements OnChanges
{
  // === INPUTS ===
  @Input() settings: GridSettings | any = {};
  /** Default grid layout */
  @Input() defaultLayout: GridLayout = {};

  /** @returns current grid layout */
  get layout(): any {
    return this.grid?.layout;
  }

  /**
   * Gets whether the grid settings are loading.
   *
   * @returns true if the grid settings are loading, false otherwise
   */
  get loadingSettings(): boolean {
    return this.settings.resource && !this.settings.query;
  }

  // === SELECTION INPUTS ===
  @Input() multiSelect = true;
  @Input() selectedRows: string[] = [];
  @Input() selectable = true;
  @Output() selectionChange = new EventEmitter();
  @Output() removeRowIds = new EventEmitter<string[]>();

  /** @returns list of selected items in the grid */
  get selectedItems(): any[] {
    return this.gridData.data.filter((x) => this.selectedRows.includes(x.id));
  }

  // === FEATURES INPUTS ===
  @Input() showDetails = true;
  @Input() showExport = true;
  @Input() admin = false;
  @Input() canCreateRecords = false;

  // === OUTPUTS ===
  @Output() layoutChanged: EventEmitter<any> = new EventEmitter();
  @Output() defaultLayoutChanged: EventEmitter<any> = new EventEmitter();
  @Output() defaultLayoutReset: EventEmitter<any> = new EventEmitter();
  @Output() edit: EventEmitter<any> = new EventEmitter();

  // === SELECTION OUTPUTS ===
  @Output() rowSelected: EventEmitter<any> = new EventEmitter<any>();

  // === TEMPLATE REFERENCE TO GRID ===
  @ViewChild(GridComponent)
  private grid?: GridComponent;

  // === DATA ===
  @Input() widget: any;
  @Input() canUpdate = false;
  public gridData: GridDataResult = { data: [], total: 0 };
  private totalCount = 0;
  private items: any[] = [];
  public fields: any[] = [];
  private metaFields: any;
  public detailsField?: any;
  private dataQuery!: QueryRef<QueryResponse>;
  private metaQuery: any;

  // === PAGINATION ===
  public pageSize = 10;
  public skip = 0;
  @Output() pageSizeChanged: EventEmitter<any> = new EventEmitter<any>();

  // === INLINE EDITION ===
  private originalItems: any[] = this.gridData.data;
  public updatedItems: any[] = [];
  public formGroup: UntypedFormGroup = new UntypedFormGroup({});
  public loading = false;
  @Input() status: {
    message?: string;
    error: boolean;
  } = {
    error: false,
  };
  // Refresh content of the history
  private refresh$: Subject<boolean> = new Subject<boolean>();

  // === SORTING ===
  public sort: SortDescriptor[] = [];

  /** @returns current field used for sorting */
  get sortField(): string | null {
    return this.sort.length > 0 && this.sort[0].dir
      ? this.sort[0].field
      : this.settings.query?.sort && this.settings.query.sort.field
      ? this.settings.query.sort.field
      : null;
  }

  /** @returns current sorting order */
  get sortOrder(): string {
    return this.sort.length > 0 && this.sort[0].dir
      ? this.sort[0].dir
      : this.settings.query?.sort?.order || '';
  }

  /** @returns grid styling rules */
  get style(): any {
    return this.settings.query?.style || null;
  }

  // === FILTERING ===
  public filter: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  private contextFilters: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };
  public showFilter = false;
  public search = '';

  /** @returns current grid filter, from grid settings and grid layout */
  get queryFilter(): CompositeFilterDescriptor {
    const gridFilters = [this.filter];
    if (this.settings?.query?.filter) {
      gridFilters.push(this.settings?.query?.filter);
    }
    let filter: CompositeFilterDescriptor | undefined;
    if (this.search) {
      const skippedFields = ['id', 'incrementalId'];
      filter = {
        logic: 'and',
        filters: [
          { logic: 'and', filters: gridFilters },
          {
            logic: 'or',
            filters: searchFilters(
              this.search,
              this.fields.map((field) => field.meta),
              skippedFields
            ),
          },
        ],
      };
    } else {
      filter = {
        logic: 'and',
        filters: gridFilters,
      };
    }
    return {
      logic: 'and',
      filters: [
        filter,
        this.contextService.injectDashboardFilterValues(this.contextFilters),
      ],
    };
  }

  // === LAYOUT CHANGES ===
  public hasLayoutChanges = false;

  // === AUTHORIZATION ===
  public isAdmin: boolean;

  // === ACTIONS ON SELECTION ===
  public selectedRowsIndex: number[] = [];
  public editionActive = false;

  // === DOWNLOAD ===
  /** @returns filename, from grid title, or default filename, and current date */
  get fileName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    return `${
      this.settings.title ? this.settings.title : DEFAULT_FILE_NAME
    } ${formatDate}`;
  }

  /** @returns true if any updated item in the list */
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
    export: this.showExport,
    showDetails: true,
    navigateToPage: false,
    navigateSettings: {
      useRecordId: false,
      pageUrl: '',
      title: '',
    },
    remove: false,
  };

  public editable = false;

  /** Current environment */
  private environment: any;

  /**
   * Main Grid data component to display Records.
   * Used by grid widget, and in several other places, like record selection.
   *
   * @param environment platform environment
   * @param apollo Apollo service
   * @param dialog Dialog
   * @param queryBuilder Shared query builder
   * @param layoutService UI layout service
   * @param snackBar Shared snackbar service
   * @param downloadService Shared download service
   * @param authService Shared authentication service
   * @param gridService Shared grid service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   * @param dateTranslate Shared date translate service
   * @param applicationService Shared application service
   * @param contextService Shared context service
   * @param router Angular Router
   */
  constructor(
    @Inject('environment') environment: any,
    private apollo: Apollo,
    public dialog: Dialog,
    private queryBuilder: QueryBuilderService,
    private layoutService: UILayoutService,
    private snackBar: SnackbarService,
    private downloadService: DownloadService,
    private authService: AuthService,
    private gridService: GridService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private dateTranslate: DateTranslateService,
    private applicationService: ApplicationService,
    private contextService: ContextService,
    private router: Router
  ) {
    super();
    this.environment = environment;
    this.isAdmin =
      this.authService.userIsAdmin && environment.module === 'backoffice';

    contextService.filter$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.dataQuery) this.reloadData();
      });
  }

  /**
   * Detects changes of the settings to (re)load the data.
   *
   * @param changes The changes on the component
   */
  ngOnChanges(changes?: SimpleChanges): void {
    if (!this.status.error) {
      if (changes?.settings) {
        this.configureGrid();
      }
    }
  }

  /**
   * Configure the grid
   */
  public configureGrid(): void {
    // set context filter
    this.contextFilters = this.settings.contextFilters
      ? JSON.parse(this.settings.contextFilters)
      : this.contextFilters;

    // define row actions
    this.actions = {
      add:
        get(this.settings, 'actions.addRecord', false) &&
        this.settings.template,
      history: get(this.settings, 'actions.history', false),
      update: get(this.settings, 'actions.update', false),
      delete: get(this.settings, 'actions.delete', false),
      convert: get(this.settings, 'actions.convert', false),
      export: get(this.settings, 'actions.export', false),
      showDetails: get(this.settings, 'actions.showDetails', true),
      navigateToPage: get(this.settings, 'actions.navigateToPage', false),
      navigateSettings: {
        useRecordId: get(
          this.settings,
          'actions.navigateSettings.useRecordId',
          false
        ),
        pageUrl: get(this.settings, 'actions.navigateSettings.pageUrl', ''),
        title: get(this.settings, 'actions.navigateSettings.title', ''),
      },
      remove: get(this.settings, 'actions.remove', false),
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
    if (this.settings.query?.pageSize) {
      this.pageSize = this.settings.query.pageSize;
    }
    if (get(this.settings, 'query')) {
      // Builds custom query.
      const builtQuery = this.queryBuilder.buildQuery(this.settings);
      if (!builtQuery) {
        this.status = {
          error: !this.loadingSettings,
          message: this.translate.instant(
            'components.widget.grid.errors.queryBuildFailed'
          ),
        };
      } else {
        this.dataQuery = this.apollo.watchQuery({
          query: builtQuery,
          variables: {
            first: this.pageSize,
            filter: this.queryFilter,
            sortField: this.sortField || undefined,
            sortOrder: this.sortOrder,
            styles: this.style,
            at: this.settings.at
              ? this.contextService.atArgumentValue(this.settings.at)
              : undefined,
          },
          fetchPolicy: 'no-cache',
          nextFetchPolicy: 'cache-first',
        });
      }

      // Build meta query
      this.metaQuery = this.queryBuilder.buildMetaQuery(this.settings?.query);
      if (this.metaQuery) {
        this.loading = true;
        this.metaQuery.pipe(takeUntil(this.destroy$)).subscribe({
          next: async ({ data }: any) => {
            this.status = {
              error: false,
            };
            for (const field in data) {
              if (Object.prototype.hasOwnProperty.call(data, field)) {
                this.metaFields = Object.assign({}, data[field]);
                try {
                  await this.gridService.populateMetaFields(this.metaFields);
                } catch (err) {
                  console.error(err);
                }
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
          error: (err: any) => {
            this.loading = false;
            this.status = {
              error: true,
              message: this.translate.instant(
                'components.widget.grid.errors.metaQueryFetchFailed',
                {
                  error:
                    err.networkError?.error?.errors
                      ?.map((x: any) => x.message)
                      .join(', ') || err,
                }
              ),
            };
          },
        });
      } else {
        this.loading = false;
        this.status = {
          error: !this.loadingSettings,
          message: this.translate.instant(
            'components.widget.grid.errors.metaQueryBuildFailed'
          ),
        };
      }
    }
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
      for (const [key] of Object.entries(x)) {
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
   * @param item item to update
   * @param value Updated value of the item.
   */
  private update(item: any, value: any): void {
    let updatedItem = this.updatedItems.find((x) => x.id === item.id);
    if (updatedItem) {
      updatedItem = { ...updatedItem, ...value };
      const index = this.updatedItems.findIndex((x) => x.id === item.id);
      this.updatedItems.splice(index, 1, updatedItem);
    } else {
      this.updatedItems.push({ id: item.id, ...value });
    }

    // Use the draft option to apply triggers, and then update the data
    this.apollo
      .mutate<EditRecordMutationResponse>({
        mutation: EDIT_RECORD,
        variables: {
          id: item.id,
          data: value,
          draft: true,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        if (data?.editRecord.data) {
          const editedData = data.editRecord.data;
          this.apollo
            .query<ResourceQueryResponse>({
              query: GET_RESOURCE_QUERY_NAME,
              variables: {
                id: this.settings.resource,
              },
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(({ data }) => {
              const queryName = data.resource.singleQueryName;
              if (queryName) {
                const query = this.queryBuilder.buildQuery(
                  {
                    query: {
                      ...this.settings.query,
                      name: queryName,
                    },
                  },
                  true
                );
                if (query) {
                  this.apollo
                    .query<any>({
                      query,
                      variables: {
                        id: item.id,
                        data: editedData,
                      },
                    })
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(({ data }) => {
                      const dataItem = this.gridData.data.find(
                        (x) => x.id === item.id
                      );
                      // Update data item element
                      Object.assign(dataItem, get(data, queryName));
                      // Update data item raw value ( used by inline edition )
                      dataItem._meta.raw = editedData;
                      item.saved = false;
                      const index = this.updatedItems.findIndex(
                        (x) => x.id === item.id
                      );
                      this.updatedItems.splice(index, 1, {
                        id: item.id,
                        ...editedData,
                      });
                      this.loadItems();
                    });
                }
              }
            });
        }
      });
  }

  /**
   * Saves all inline changes and then reload data.
   *
   * @returns result of save as promise. Boolean to indicate if error.
   */
  public onSaveChanges() {
    this.grid?.closeEditor();
    if (this.hasChanges) {
      for (const item of this.items) {
        delete item.saved;
        delete item.validationErrors;
      }
      return Promise.all(this.promisedChanges()).then((allRes) => {
        for (const res of allRes) {
          const resRecord: Record = res.data.editRecord;
          const updatedIndex = this.updatedItems.findIndex(
            (x) => x.id === resRecord.id
          );
          const item = this.items.find((x) => x.id === resRecord.id);
          if (resRecord?.validationErrors?.length) {
            // if the item has an error, save the error with the item object
            this.updatedItems[updatedIndex].incrementalId =
              resRecord.incrementalId;
            this.updatedItems[updatedIndex].validationErrors =
              resRecord.validationErrors;
            item.incrementalId = resRecord.incrementalId;
            item.validationErrors = resRecord.validationErrors;
          } else {
            // if no errors, the item has been saved in the database
            // remove the item from updatedItems list
            this.updatedItems.splice(updatedIndex, 1);
            // save the new value of the item in the originalItems list
            const originalIndex = this.originalItems.findIndex(
              (x) => x.id === resRecord.id
            );
            this.originalItems[originalIndex] = item;
            // add a property to indicate the item is saved
            item.saved = true;
          }
        }
        // the items still in the updatedItems list are the ones with errors
        if (this.updatedItems.length) {
          // show an error message
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.widget.grid.errors.validationFailed',
              {
                errors: this.updatedItems
                  .map((item) => `- ${item.incrementalId}`)
                  .join('\n'),
              }
            ),
            {
              error: true,
              duration: 8000,
            }
          );
          return true;
        } else {
          return false;
        }
      });
    } else {
      return Promise.resolve(false);
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
          data[field.name] = data[field.name].toLocaleTimeString('en', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h24',
          });
        }
      }
      promises.push(
        firstValueFrom(
          this.apollo.mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: item.id,
              data,
              template: this.settings.template,
              lang: this.translate.currentLang,
            },
          })
        )
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
      this.dataQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
        next: ({ data }) => {
          this.loading = false;
          this.status = {
            error: false,
          };
          for (const field in data) {
            try {
              if (Object.prototype.hasOwnProperty.call(data, field)) {
                const nodes =
                  data[field]?.edges.map((x: any) => ({
                    ...x.node,
                    _meta: {
                      style: x.meta.style,
                      raw: x.meta.raw,
                    },
                  })) || [];
                this.totalCount = data[field] ? data[field].totalCount : 0;
                this.items = cloneData(nodes);
                this.convertDateFields(this.items);
                this.originalItems = cloneData(this.items);
                this.loadItems();
                for (const updatedItem of this.updatedItems) {
                  const item: any = this.items.find(
                    (x) => x.id === updatedItem.id
                  );
                  if (item) {
                    Object.assign(item, updatedItem);
                    item.saved = false;
                  }
                }
                // if (!this.readOnly) {
                //   this.initSelectedRows();
                // }
              }
            } catch (error) {
              console.error(error);
            }
          }
          if (this.settings.query.temporaryRecords?.length) {
            //Handles temporary records for resources creation in forms
            this.getTemporaryRecords();
          }
        },
        error: (err: any) => {
          this.status = {
            error: true,
            message: this.translate.instant(
              'components.widget.grid.errors.queryFetchFailed',
              {
                error:
                  err.networkError?.error?.errors
                    ?.map((x: any) => x.message)
                    .join(', ') || err,
              }
            ),
          };
          this.loading = false;
        },
      });
    } else {
      this.loading = false;
    }
  }

  /**
   * Loads temporary records for resources questions
   */
  public getTemporaryRecords() {
    const ids = this.items.map((item) => item.id);
    this.settings.query.temporaryRecords.forEach((record: any) => {
      if (!ids.includes(record.id)) this.items.unshift(record);
    });
    this.totalCount =
      this.totalCount + this.settings.query.temporaryRecords.length;
    this.loadItems();
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
    // TODO = check what to do there
    this.onPageChange({ skip: 0, take: this.pageSize });
    // this.selectedRows = [];
    // this.updatedItems = [];
    this.refresh$.next(true);
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
   * @param event.action action to perform, short string code
   * @param event.item item to perform the action on
   * @param event.items list of items to perform the action on
   * @param event.value value to apply to item, if any
   * @param event.field field to use in action, optional
   * @param event.pageUrl url of page
   * @param event.useRecordId boolean to use record id
   */
  public onAction(event: {
    action: string;
    item?: any;
    items?: any[];
    value?: any;
    field?: any;
    pageUrl?: string;
    useRecordId?: boolean;
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
        this.onSaveChanges().then((hasError) => {
          if (hasError) {
            // update the displayed items
            this.loadItems();
          } else {
            // if no error, reload the grid
            this.reloadData();
          }
        });
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
      case 'goTo': {
        if (event.item) {
          let fullUrl = this.getPageUrl(event.pageUrl as string);
          if (event.useRecordId) {
            const recordId = event.item.id;
            fullUrl = `${fullUrl}?id=${recordId}`;
          }
          this.router.navigateByUrl(fullUrl);
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
      case 'remove': {
        if (event.item) {
          this.onRemoveRow([event.item]);
        }
        if (event.items && event.items.length > 0) {
          this.onRemoveRow(event.items);
        }
        break;
      }
      case 'resetLayout': {
        this.resetDefaultLayout();
        break;
      }
      case 'map': {
        import('./map-modal/map-modal.component').then(
          ({ MapModalComponent }) => {
            this.dialog.open(MapModalComponent, {
              data: {
                item: event.item,
                datasource: {
                  type: 'Point',
                  resource: this.settings.resource,
                  // todo(change)
                  layout: this.settings.id,
                  geoField: event.field.name,
                },
              },
            });
          }
        );

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
  private async onAdd(): Promise<void> {
    if (this.settings.template) {
      const { FormModalComponent } = await import(
        '../../form-modal/form-modal.component'
      );
      const dialogRef = this.dialog.open(FormModalComponent, {
        disableClose: true,
        data: {
          template: this.settings.template,
          askForConfirm: false,
        },
        autoFocus: false,
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.reloadData();
          }
        });
    }
  }

  /**
   * Opens the record on a read-only modal. If edit mode is enabled, can open edition modal.
   *
   * @param items single item or list of items to show details of
   * @param field field to show detail of ( related resource(s) )
   */
  public async onShowDetails(items: any | any[], field?: any): Promise<void> {
    const isArray = Array.isArray(items);
    if (isArray && items.length >= 2) {
      const idsFilter = {
        field: 'ids',
        operator: 'in',
        value: items.map((x: { id: any }) => x.id),
      };
      // for resources, open it inside the ResourceGrid
      const { ResourceGridModalComponent } = await import(
        '../../search-resource-grid-modal/search-resource-grid-modal.component'
      );
      this.dialog.open(ResourceGridModalComponent, {
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
    } else if (
      (!isArray && items.isTemporary) ||
      (isArray && items[0].isTemporary)
    ) {
      const { RecordModalComponent } = await import(
        '../../record-modal/record-modal.component'
      );
      //case for temporary records
      this.dialog.open(RecordModalComponent, {
        data: {
          isTemporary: true,
          template: isArray ? items[0].template : items.template,
          canUpdate: false,
          compareTo: false,
          temporaryRecordData: isArray ? items[0] : items,
        },
      });
    } else {
      const { RecordModalComponent } = await import(
        '../../record-modal/record-modal.component'
      );
      const dialogRef = this.dialog.open(RecordModalComponent, {
        data: {
          recordId: isArray ? items[0].id : items.id,
          canUpdate:
            this.settings.actions &&
            this.settings.actions.update &&
            items.canUpdate,
          ...(!isArray && { template: this.settings.template }),
        },
        autoFocus: false,
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
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
  public async onUpdate(items: any[]): Promise<void> {
    const ids: string[] = items.map((x) => (x.id ? x.id : x));
    const { FormModalComponent } = await import(
      '../../form-modal/form-modal.component'
    );
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        recordId: ids.length > 1 ? ids : ids[0],
        template: this.settings.template || null,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.validateRecords(ids);
        this.reloadData();
      }
    });
  }

  /**
   * Remove elements from the list of updated items
   *
   * @param ids list of item ids
   */
  private validateRecords(ids: string[]): void {
    this.updatedItems = this.updatedItems.filter((x) => !ids.includes(x.id));
  }

  /**
   * Opens a confirmation modal and deletes the selected records.
   *
   * @param items items to delete.
   */
  public onDelete(items: any[]): void {
    const ids: string[] = items.map((x) => (x.id ? x.id : x));
    const rowsSelected = items.length;
    const dialogRef = this.confirmService.openConfirmModal({
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
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: DELETE_RECORDS,
            variables: {
              ids,
            },
          })
          .pipe(takeUntil(this.destroy$))
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
  public async onConvert(items: any[]): Promise<void> {
    const rowsSelected = items.length;
    const { ConvertModalComponent } = await import(
      '../../convert-modal/convert-modal.component'
    );
    const dialogRef = this.dialog.open(ConvertModalComponent, {
      data: {
        title: `Convert record${rowsSelected > 1 ? 's' : ''}`,
        record: items[0].id ? items[0].id : items[0],
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const promises: Promise<any>[] = [];
        for (const item of items) {
          promises.push(
            firstValueFrom(
              this.apollo.mutate<ConvertRecordMutationResponse>({
                mutation: CONVERT_RECORD,
                variables: {
                  id: item.id ? item.id : item,
                  form: value.targetForm.id,
                  copyRecord: value.copyRecord,
                },
              })
            )
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
   * @param item item to get history of
   */
  public onViewHistory(item: any): void {
    import('../../record-history/record-history.component').then(
      ({ RecordHistoryComponent }) => {
        this.layoutService.setRightSidenav({
          component: RecordHistoryComponent,
          inputs: {
            id: item.id,
            revert: (version: any) => this.confirmRevertDialog(item, version),
            template: this.settings.template || null,
            refresh$: this.refresh$,
          },
        });
      }
    );
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
    const formatDate = new DatePipe(this.dateTranslate).transform(
      date,
      'shortDate'
    );
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('components.record.recovery.title'),
      content: this.translate.instant(
        'components.record.recovery.confirmationMessage',
        { date: formatDate }
      ),
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'primary',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.apollo
          .mutate<EditRecordMutationResponse>({
            mutation: EDIT_RECORD,
            variables: {
              id: record.id,
              version: version.id,
            },
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: ({ errors }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.dataNotRecovered'
                  ),
                  { error: true }
                );
              } else {
                this.reloadData();
                this.layoutService.setRightSidenav(null);
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.dataRecovered')
                );
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  // === EXPORT ===
  /**
   * Exports selected records to excel / csv file.
   *
   * @param e export event
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
      application: this.applicationService.name,
      fileName: this.fileName,
      email: e.email,
      // we only export visible fields ( not hidden )
      ...(e.fields === 'visible' && {
        fields: Object.values(currentLayout.fields)
          .filter((x: any) => !x.hidden)
          .sort((a: any, b: any) => a.order - b.order)
          .map((x: any) => ({
            name: x.field,
            title: x.title,
            subFields: x.subFields
              .filter((y: any) => !y.hidden)
              .map((y: any) => ({
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
      '/download/records',
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
    this.dataQuery
      ?.refetch({
        first: this.pageSize,
        skip: this.skip,
        filter: this.queryFilter,
        sortField: this.sortField || undefined,
        sortOrder: this.sortOrder,
        styles: this.style,
        ...(this.settings.at && {
          at: this.contextService.atArgumentValue(this.settings.at),
        }),
      })
      .then(() => (this.loading = false));
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
   */
  onColumnChange(): void {
    this.saveLocalLayout();
  }

  /**
   * Saves the current layout of the grid as default layout
   */
  saveDefaultLayout(): void {
    // this.defaultLayoutChanged.emit(this.layout);
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

  /**
   * Remove (not deleting) the selected records from the grid
   *
   * @param items  items to remove
   */
  private onRemoveRow(items: any[]): void {
    const selected: string[] = items.map((x) => x.id);
    this.gridData.data = this.gridData.data.filter(
      (x) => !selected.includes(x.id)
    );
    this.items = [...this.gridData.data];
    this.removeRowIds.emit(selected);
  }

  /**
   * Get page url full link taking into account the environment.
   *
   * @param pageUrlParams page url params
   * @returns url of the page
   */
  private getPageUrl(pageUrlParams: string): string {
    return this.environment.module === 'backoffice'
      ? `applications/${pageUrlParams}`
      : `${pageUrlParams}`;
  }
}
