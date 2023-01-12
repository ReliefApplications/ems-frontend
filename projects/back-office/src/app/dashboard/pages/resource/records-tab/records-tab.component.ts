import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import {
  Record,
  Form,
  SafeConfirmService,
  SafeSnackBarService,
  Resource,
  SafeDownloadService,
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import {
  DeleteRecordMutationResponse,
  DELETE_RECORD,
  RestoreRecordMutationResponse,
  RESTORE_RECORD,
} from '../graphql/mutations';
import {
  GetResourceRecordsQueryResponse,
  GET_RESOURCE_RECORDS,
} from './graphql/queries';

/** Quantity of resource that will be loaded at once. */
const ITEMS_PER_PAGE = 10;

/**
 * Default fields for the records.
 */
const RECORDS_DEFAULT_COLUMNS = ['_incrementalId', '_actions'];

/**
 * Records tab of resource page.
 */
@Component({
  selector: 'app-records-tab',
  templateUrl: './records-tab.component.html',
  styleUrls: ['./records-tab.component.scss'],
})
export class RecordsTabComponent implements OnInit {
  private recordsQuery!: QueryRef<GetResourceRecordsQueryResponse>;
  public dataSource = new MatTableDataSource<Record>([]);
  private cachedRecords: Record[] = [];
  public resource!: Resource;
  recordsDefaultColumns: string[] = RECORDS_DEFAULT_COLUMNS;
  displayedColumnsRecords: string[] = [];

  showDeletedRecords = false;
  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };
  public loading = true;
  public showUpload = false;

  /** @returns True if the records tab is empty */
  get empty(): boolean {
    return !this.loading && this.dataSource.filteredData.length === 0;
  }

  /**
   * Records tab of resource page
   *
   * @param apollo Apollo service
   * @param translate Angular translate service
   * @param snackBar Shared snackbar service
   * @param confirmService Shared confirm service
   * @param downloadService Service used to download.
   */
  constructor(
    private apollo: Apollo,
    private translate: TranslateService,
    private snackBar: SafeSnackBarService,
    private confirmService: SafeConfirmService,
    private downloadService: SafeDownloadService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);
    this.setDisplayedColumns(false);
    this.recordsQuery = this.apollo.watchQuery<GetResourceRecordsQueryResponse>(
      {
        query: GET_RESOURCE_RECORDS,
        variables: {
          first: ITEMS_PER_PAGE,
          id: this.resource.id,
          display: false,
          showDeletedRecords: this.showDeletedRecords,
        },
      }
    );
    this.recordsQuery.valueChanges.subscribe((res) => {
      this.cachedRecords = res.data.resource.records.edges.map((x) => x.node);
      this.dataSource.data = this.cachedRecords.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = res.data.resource.records.totalCount;
      this.pageInfo.endCursor = res.data.resource.records.pageInfo.endCursor;
      this.loading = res.loading;
    });
  }

  /**
   * Deletes a record if authorized, open a confirmation modal if it's a hard delete.
   *
   * @param element Element to delete.
   * @param e click event.
   */
  public onDeleteRecord(element: any, e: any): void {
    e.stopPropagation();
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
      });
      dialogRef.afterClosed().subscribe((value) => {
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
      .subscribe(() => {
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectDeleted', {
            value: this.translate.instant('common.record.one'),
          })
        );
        this.fetchRecords(true);
      });
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
      .subscribe(() => {
        this.fetchRecords(true);
      });
  }

  /**
   * Get list of forms filtering by record form.
   *
   * @param record Record to filter templates with.
   * @returns list of different forms than the one used to create the record.
   */
  public filterTemplates(record: Record): Form[] {
    return get(this.resource, 'forms', []).filter(
      (x: Form) => x.id !== record.form?.id
    );
  }

  /**
   * Changes the list of displayed columns.
   *
   * @param core Is the form core.
   */
  private setDisplayedColumns(core: boolean): void {
    let columns = [];
    if (core) {
      for (const field of this.resource.fields.filter(
        (x: any) => x.isRequired === true
      )) {
        columns.push(field.name);
      }
    } else {
      for (const field of this.resource.fields) {
        columns.push(field.name);
      }
    }
    const metadata = get(this.resource, 'metadata', []);
    columns = columns
      .filter((x) => {
        const fieldMeta = metadata.find((y) => y.name === x);
        return get(fieldMeta, 'canSee', false);
      })
      .concat(RECORDS_DEFAULT_COLUMNS);
    this.displayedColumnsRecords = columns;
  }
  /**
   * Downloads the list of records of the resource.
   *
   * @param type Type of the document to download ( excel or csv ).
   */
  onDownload(type: string): void {
    const path = `download/resource/records/${this.resource.id}`;
    const fileName = `${this.resource.name}.${type}`;
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
    const path = `download/resource/records/${this.resource.id}`;
    const queryString = new URLSearchParams({
      type: 'xlsx',
      template: 'true',
    }).toString();
    this.downloadService.getFile(
      `${path}?${queryString}`,
      `text/xlsx;charset=utf-8;`,
      `${this.resource.name}_template.xlsx`
    );
  }

  /**
   * Detects changes on the file.
   *
   * @param event new file event.
   */
  onFileChange(event: any): void {
    const file = event.files[0].rawFile;
    this.uploadFileData(file);
  }

  /**
   * Calls rest endpoint to upload new records for the resource.
   *
   * @param file File to upload.
   */
  uploadFileData(file: any): void {
    const path = `upload/resource/records/${this.resource.id}`;
    this.downloadService.uploadFile(path, file).subscribe(
      (res) => {
        if (res.status === 'OK') {
          this.fetchRecords(true);
          this.showUpload = false;
        }
      },
      (error: any) => {
        this.snackBar.openSnackBar(error.error, { error: true });
        this.showUpload = false;
      }
    );
  }

  /**
   * Toggle archive / active view.
   *
   * @param e click event.
   */
  onSwitchView(e: any): void {
    e.stopPropagation();
    this.showDeletedRecords = !this.showDeletedRecords;
    this.fetchRecords(true);
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    // Checks if with new page/size more data needs to be fetched
    if (
      (e.pageIndex > e.previousPageIndex ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.length > this.cachedRecords.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.pageInfo.pageSize = first;
      this.fetchRecords();
    } else {
      this.dataSource.data = this.cachedRecords.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Fetch records, using GraphQL
   *
   * @param refetch rebuild query
   */
  private fetchRecords(refetch?: boolean): void {
    this.loading = true;
    if (refetch) {
      this.cachedRecords = [];
      this.pageInfo.pageIndex = 0;
      this.pageInfo.endCursor = '';
      this.recordsQuery
        .refetch({
          first: this.pageInfo.pageSize,
          afterCursor: null,
          display: false,
          showDeletedRecords: this.showDeletedRecords,
        })
        .then(() => {
          this.loading = false;
        });
    } else {
      this.recordsQuery.fetchMore({
        variables: {
          first: this.pageInfo.pageSize,
          afterCursor: this.pageInfo.endCursor,
          display: false,
          showDeletedRecords: this.showDeletedRecords,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            resource: {
              records: {
                edges: [
                  ...prev.resource.records.edges,
                  ...fetchMoreResult.resource.records.edges,
                ],
                pageInfo: fetchMoreResult.resource.records.pageInfo,
                totalCount: fetchMoreResult.resource.records.totalCount,
              },
            },
          });
        },
      });
    }
  }
}
