import { Apollo, QueryRef } from 'apollo-angular';
import {
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetFormByIdQueryResponse,
  GetFormRecordsQueryResponse,
  GetRecordDetailsQueryResponse,
  GET_FORM_BY_ID,
  GET_FORM_RECORDS,
  GET_RECORD_DETAILS,
} from '../../../graphql/queries';
import {
  EditRecordMutationResponse,
  EDIT_RECORD,
  DeleteRecordMutationResponse,
  DELETE_RECORD,
  RestoreRecordMutationResponse,
  RESTORE_RECORD,
} from '../../../graphql/mutations';
import { extractColumns } from '../../../utils/extractColumns';
import {
  SafeRecordHistoryComponent,
  SafeLayoutService,
  SafeConfirmModalComponent,
  NOTIFICATIONS,
  SafeSnackBarService,
} from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { SafeDownloadService, Record } from '@safe/builder';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const ITEMS_PER_PAGE = 10;
const DEFAULT_COLUMNS = ['_incrementalId', '_actions'];

@Component({
  selector: 'app-form-records',
  templateUrl: './form-records.component.html',
  styleUrls: ['./form-records.component.scss'],
})
export class FormRecordsComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  private recordsQuery!: QueryRef<GetFormRecordsQueryResponse>;
  public id = '';
  public form: any;
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  public showSidenav = true;
  private historyId = '';
  private formSubscription?: Subscription;
  private recordsSubscription?: Subscription;
  public cachedRecords: Record[] = [];
  public defaultColumns = DEFAULT_COLUMNS;

  // === HISTORY COMPONENT TO BE INJECTED IN LAYOUT SERVICE ===
  public factory?: ComponentFactory<any>;

  // === DELETED RECORDS VIEW ===
  public showDeletedRecords = false;

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  @ViewChild('xlsxFile') xlsxFile: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private downloadService: SafeDownloadService,
    private resolver: ComponentFactoryResolver,
    private layoutService: SafeLayoutService,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  /*  Load the records, using the form id passed as a parameter.
   */
  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(
      SafeRecordHistoryComponent
    );
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.getFormData();
    }
  }

  private getFormData(): void {
    this.loading = true;
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
    }

    // get the records linked to the form
    this.recordsQuery = this.apollo.watchQuery<GetFormRecordsQueryResponse>({
      query: GET_FORM_RECORDS,
      variables: {
        id: this.id,
        first: ITEMS_PER_PAGE,
        display: false,
        showDeletedRecords: this.showDeletedRecords,
      },
    });

    this.recordsSubscription = this.recordsQuery.valueChanges.subscribe(
      (res) => {
        this.cachedRecords = res.data.form.records.edges.map(
          (x: any) => x.node
        );
        this.dataSource = this.cachedRecords.slice(
          ITEMS_PER_PAGE * this.pageInfo.pageIndex,
          ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = res.data.form.records.totalCount;
        this.pageInfo.endCursor = res.data.form.records.pageInfo.endCursor;
      }
    );

    // get the form detail
    this.formSubscription = this.apollo
      .watchQuery<GetFormByIdQueryResponse>({
        query: GET_FORM_BY_ID,
        variables: {
          id: this.id,
          display: true,
          showDeletedRecords: this.showDeletedRecords,
        },
      })
      .valueChanges.subscribe((res) => {
        if (res.data.form) {
          this.form = res.data.form;
          this.setDisplayedColumns();
          this.loading = res.loading;
        }
        if (res.errors) {
          // TO-DO: Check why it's not working as intended.
          this.snackBar.openSnackBar(
            NOTIFICATIONS.accessNotProvided('records', res.errors[0].message),
            { error: true }
          );
        }
      });
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (
      e.pageIndex > e.previousPageIndex &&
      e.length > this.cachedRecords.length
    ) {
      this.recordsQuery.fetchMore({
        variables: {
          id: this.id,
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            form: {
              records: {
                edges: [
                  ...prev.form.records.edges,
                  ...fetchMoreResult.form.records.edges,
                ],
                pageInfo: fetchMoreResult.form.records.pageInfo,
                totalCount: fetchMoreResult.form.records.totalCount,
              },
            },
          });
        },
      });
    } else {
      this.dataSource = this.cachedRecords.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
      );
    }
  }

  /**
   * Modifies the list of columns.
   */
  private setDisplayedColumns(): void {
    let columns: any[] = [];
    const structure = JSON.parse(this.form.structure);
    if (structure && structure.pages) {
      for (const page of JSON.parse(this.form.structure).pages) {
        extractColumns(page, columns);
      }
    }
    columns = columns.concat(DEFAULT_COLUMNS);
    this.displayedColumns = columns;
  }

  /**
   * Deletes a record if authorized, open a confirmation modal if it's a hard delete.
   *
   * @param id Id of record to delete.
   * @param e click envent.
   */
  public onDeleteRecord(element: any, e: any): void {
    e.stopPropagation();
    if (this.showDeletedRecords) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: this.translate.instant('record.delete'),
          content: this.translate.instant('record.deleteDesc', {
            name: element.name,
          }),
          confirmText: this.translate.instant('action.delete'),
          cancelText: this.translate.instant('action.cancel'),
          confirmColor: 'warn',
        },
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
      .subscribe((res) => {
        this.dataSource = this.dataSource.filter((x) => x.id !== id);
        if (id === this.historyId) {
          this.layoutService.setRightSidenav(null);
        }
      });
  }

  private confirmRevertDialog(record: any, version: any): void {
    // eslint-disable-next-line radix
    const date = new Date(parseInt(version.created, 0));
    const formatDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: `Recovery data`,
        content: `Do you confirm recovery the data from ${formatDate} to the current register?`,
        confirmText: 'Confirm',
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
            this.layoutService.setRightSidenav(null);
            this.snackBar.openSnackBar(NOTIFICATIONS.dataRecovered);
          });
      }
    });
  }

  /* Opens the history of the record on the right side of the screen.
   */
  public onViewHistory(id: string): void {
    this.apollo
      .query<GetRecordDetailsQueryResponse>({
        query: GET_RECORD_DETAILS,
        variables: {
          id,
        },
      })
      .subscribe((res) => {
        this.historyId = id;
        this.layoutService.setRightSidenav({
          factory: this.factory,
          inputs: {
            record: res.data.record,
            revert: (item: any, dialog: any) => {
              this.confirmRevertDialog(res.data.record, item);
            },
          },
        });
      });
  }

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

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.uploadFileData(file);
  }

  uploadFileData(file: any): void {
    const path = `upload/form/records/${this.id}`;
    this.downloadService.uploadFile(path, file).subscribe(
      (res) => {
        this.xlsxFile.nativeElement.value = '';
        if (res.status === 'OK') {
          this.snackBar.openSnackBar(NOTIFICATIONS.recordUploadSuccess);
          this.getFormData();
        }
      },
      (error: any) => {
        this.snackBar.openSnackBar(error.error, { error: true });
        this.xlsxFile.nativeElement.value = '';
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
    this.getFormData();
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
      .subscribe((res) => {
        this.dataSource = this.dataSource.filter((x) => x.id !== id);
        if (id === this.historyId) {
          this.layoutService.setRightSidenav(null);
        }
      });
  }

  /**
   * Unsubscribe to subscriptions before destroying component.
   */
  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }
}
