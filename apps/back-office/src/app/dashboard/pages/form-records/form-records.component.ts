import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GET_FORM_RECORDS } from './graphql/queries';
import {
  EDIT_RECORD,
  DELETE_RECORD,
  RESTORE_RECORD,
} from './graphql/mutations';
import {
  UnsubscribeComponent,
  Record,
  FormRecordsQueryResponse,
  DeleteRecordMutationResponse,
  EditRecordMutationResponse,
  RestoreRecordMutationResponse,
  BreadcrumbService,
  ConfirmService,
  DownloadService,
  getCachedValues,
  updateQueryUniqueValues,
} from '@oort-front/shared';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import get from 'lodash/get';
import { takeUntil } from 'rxjs/operators';
import { Metadata } from '@oort-front/shared';
import {
  SnackbarService,
  UIPageChangeEvent,
  UILayoutService,
  handleTablePageEvent,
} from '@oort-front/ui';
import { GraphQLError } from 'graphql';
import { ApolloQueryResult } from '@apollo/client';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/** Static columns ( appear whatever the form ) */
const DEFAULT_COLUMNS = ['_incrementalId', '_actions'];

/**
 * Forms records page component.
 */
@Component({
  selector: 'app-form-records',
  templateUrl: './form-records.component.html',
  styleUrls: ['./form-records.component.scss'],
})
export class FormRecordsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Loading more state */
  public loadingMore = false;
  /** Records query */
  private recordsQuery!: QueryRef<FormRecordsQueryResponse>;
  /** Form id */
  public id = '';
  /** Form */
  public form: any;
  /** Columns to display */
  displayedColumns: string[] = [];
  /** Data source array */
  dataSource: any[] = [];
  /** Show sidenav */
  public showSidenav = true;
  /** History id */
  private historyId = '';
  /** Cached records */
  public cachedRecords: Record[] = [];
  /** Default columns */
  public defaultColumns = DEFAULT_COLUMNS;
  /** Updating status */
  public updating = false;

  // === DELETED RECORDS VIEW ===
  /** Show deleted records */
  public showDeletedRecords = false;

  /** Page info */
  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  /** @returns True if the layouts tab is empty */
  get empty(): boolean {
    return !this.loading && this.dataSource.length === 0;
  }

  /**
   * File input
   */
  @ViewChild('xlsxFile') xlsxFile: any;
  /** Show upload option */
  public showUpload = false;

  /**
   * Forms records page component
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param downloadService Shared download service
   * @param layoutService UI layout service
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param breadcrumbService Shared breadcrumb service
   * @param confirmService Shared confirm service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private downloadService: DownloadService,
    private layoutService: UILayoutService,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private breadcrumbService: BreadcrumbService,
    private confirmService: ConfirmService
  ) {
    super();
  }

  /** Load the records, using the form id passed as a parameter. */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.getFormData();
    }
  }

  /**
   * Get form.
   */
  private getFormData(): void {
    this.loading = true;

    // get the records linked to the form
    this.recordsQuery = this.apollo.watchQuery<FormRecordsQueryResponse>({
      query: GET_FORM_RECORDS,
      variables: {
        id: this.id,
        first: ITEMS_PER_PAGE,
        afterCursor: this.pageInfo.endCursor,
        display: false,
        showDeletedRecords: this.showDeletedRecords,
      },
    });

    this.recordsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ errors, data, loading }) => {
        this.updateValues(data, loading, true);

        if (errors) {
          // TO-DO: Check why it's not working as intended.
          this.snackBar.openSnackBar(
            this.translate.instant('common.notifications.accessNotProvided', {
              type: this.translate.instant('common.record.one').toLowerCase(),
              error: errors ? errors[0].message : '',
            }),
            { error: true }
          );
        }
      });
  }

  /**
   * Update Records datas query.
   *
   * @param refetch erase previous query results
   */
  private fetchRecordsData(refetch?: boolean): void {
    this.loading = true;
    this.updating = true;
    const variables = {
      id: this.id,
      first: ITEMS_PER_PAGE,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      display: false,
      showDeletedRecords: this.showDeletedRecords,
    };
    // get the records linked to the form
    const cachedValues: FormRecordsQueryResponse = getCachedValues(
      this.apollo.client,
      GET_FORM_RECORDS,
      variables
    );
    if (refetch) {
      this.cachedRecords = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false, refetch);
    } else {
      if (refetch) {
        this.recordsQuery.refetch(variables);
      } else {
        this.recordsQuery
          .fetchMore({ variables })
          .then((results: ApolloQueryResult<FormRecordsQueryResponse>) => {
            this.updateValues(results.data, results.loading);
          });
      }
    }
  }

  /**
   * Update records data value
   *
   * @param data query response data
   * @param loading loading status
   * @param setForm control if form should be set
   */
  private updateValues(
    data: FormRecordsQueryResponse,
    loading: boolean,
    setForm?: boolean
  ) {
    const mappedValues = data.form.records.edges.map((x) => x.node);
    this.cachedRecords = updateQueryUniqueValues(
      this.cachedRecords,
      mappedValues
    );
    this.pageInfo.length = data.form.records.totalCount;
    this.pageInfo.endCursor = data.form.records.pageInfo.endCursor;
    this.dataSource = this.cachedRecords.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.loading = loading;
    this.updating = false;
    if (setForm) {
      this.form = data.form;
      this.breadcrumbService.setBreadcrumb('@form', this.form.name as string);
      this.setDisplayedColumns();
    }
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(
      e,
      this.pageInfo,
      this.cachedRecords
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.dataSource = cachedData;
    } else {
      this.fetchRecordsData();
    }
  }

  /**
   * Modifies the list of columns.
   */
  private setDisplayedColumns(): void {
    let columns: any[] = [];
    for (const field of this.form.fields) {
      columns.push(field.name);
    }
    const metadata: Metadata[] = get(this.form, 'metadata', []);
    columns = columns
      .filter((x) => {
        const fieldMeta = metadata.find((y: any) => y.name === x);
        return get(fieldMeta, 'canSee', false);
      })
      .concat(DEFAULT_COLUMNS);
    this.displayedColumns = columns;
  }

  /**
   * Deletes a record if authorized, open a confirmation modal if it's a hard delete.
   *
   * @param element element to delete
   * @param e click event.
   */
  public onDeleteRecord(element: any, e: any): void {
    e.stopPropagation(); // avoid unwanted actions to occur
    if (this.showDeletedRecords) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.record.one'),
        }),
        content: this.translate.instant(
          'components.record.delete.confirmationMessage',
          {
            name: element.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmVariant: 'danger',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.deleteRecord(element.id);
          }
        });
    } else {
      this.deleteRecord(element.id);
    }
  }

  /**
   * Sends mutation to delete record.
   *
   * @param id Id of record to delete.
   */
  private deleteRecord(id: string): void {
    this.apollo
      .mutate<DeleteRecordMutationResponse>({
        mutation: DELETE_RECORD,
        variables: {
          id,
          hardDelete: this.showDeletedRecords,
        },
      })
      .subscribe({
        next: ({ errors }) => {
          this.handleRecordMutationResponse(
            errors,
            {
              success: 'common.notifications.objectDeleted',
              error: 'common.notifications.objectNotDeleted',
            },
            id
          );
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Open confirm modal to ask user for reversion of data
   *
   * @param record record to update
   * @param version version to apply
   */
  private confirmRevertDialog(record: any, version: any): void {
    // eslint-disable-next-line radix
    const date = new Date(parseInt(version.createdAt, 0));
    const formatDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
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

  /**
   * Opens the history of the record on the right side of the screen.
   *
   * @param item item to get history of
   */
  public onViewHistory(item: any): void {
    import('@oort-front/shared').then(({ RecordHistoryComponent }) => {
      this.historyId = item.id;
      this.layoutService.setRightSidenav({
        component: RecordHistoryComponent,
        inputs: {
          id: item.id,
          revert: (version: any) => this.confirmRevertDialog(item, version),
        },
      });
    });
  }

  /**
   * Download records
   *
   * @param type type of file
   */
  onDownload(type: string): void {
    const path = `download/form/records/${this.id}`;
    const fileName = `${this.form.name}.${type}`;
    const queryString = new URLSearchParams({ type }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/${type};charset=utf-8;`,
      fileName
    );
  }

  /**
   * Get the records template, for upload.
   */
  onDownloadTemplate(): void {
    const path = `download/form/records/${this.id}`;
    const queryString = new URLSearchParams({
      type: 'xlsx',
      template: 'true',
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/xlsx;charset=utf-8;`,
      `${this.form.name}_template.xlsx`
    );
  }

  /**
   * Upload file and indicate status of request.
   *
   * @param file file to upload.
   */
  uploadFileData(file: any): void {
    const path = `upload/form/records/${this.id}`;
    this.downloadService.uploadFile(path, file).subscribe({
      next: (res) => {
        if (res.status === 'OK') {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'models.record.notifications.uploadSuccessful'
            )
          );
          this.fetchRecordsData(true);
          this.showUpload = false;
        }
      },
      error: () => {
        // The error message has already been handled in DownloadService
        this.showUpload = false;
      },
    });
  }

  /**
   * Toggle archive / active view.
   *
   * @param e click event.
   */
  onSwitchView(e: any): void {
    e.stopPropagation();
    this.showDeletedRecords = !this.showDeletedRecords;
    this.fetchRecordsData(true);
  }

  /**
   * Restores an archived record.
   *
   * @param id Id of record to restore.
   * @param e click event.
   */
  public onRestoreRecord(id: string, e: any): void {
    e.stopPropagation();
    this.apollo
      .mutate<RestoreRecordMutationResponse>({
        mutation: RESTORE_RECORD,
        variables: {
          id,
        },
      })
      .subscribe({
        next: ({ errors }) => {
          this.handleRecordMutationResponse(
            errors,
            {
              success: 'common.notifications.objectRestored',
              error: 'common.notifications.objectNotRestored',
            },
            id
          );
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Handle response from record mutation
   *
   * @param {GraphQLError[]} errors mutation errors if any
   * @param messageKeys containing keys for success and error response messages
   * @param {string} messageKeys.success success key response messages
   * @param {string} messageKeys.error error key response messages
   * @param {string} recordId mutated record id
   */
  private handleRecordMutationResponse(
    errors: readonly GraphQLError[] | undefined,
    messageKeys: { success: string; error: string },
    recordId: string
  ) {
    if (errors) {
      this.snackBar.openSnackBar(
        this.translate.instant(messageKeys.error, {
          value: this.translate.instant('common.record.one'),
          error: errors ? errors[0].message : '',
        }),
        { error: true }
      );
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant(messageKeys.success, {
          value: this.translate.instant('common.record.one'),
        })
      );
      this.dataSource = this.dataSource.filter((x) => x.id !== recordId);
      if (recordId === this.historyId) {
        this.layoutService.setRightSidenav(null);
      }
    }
  }
}
