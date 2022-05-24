import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SafeDownloadService,
  SafeSnackBarService,
  NOTIFICATIONS,
  SafeConfirmModalComponent,
  Record,
  Form,
  SafeLayoutModalComponent,
  Layout,
  SafeGridLayoutService,
} from '@safe/builder';
import {
  DeleteFormMutationResponse,
  DeleteRecordMutationResponse,
  DELETE_FORM,
  DELETE_RECORD,
  EditResourceMutationResponse,
  EDIT_RESOURCE,
  RestoreRecordMutationResponse,
  RESTORE_RECORD,
} from '../../../graphql/mutations';
import {
  GetResourceByIdQueryResponse,
  GetResourceRecordsQueryResponse,
  GET_RESOURCE_BY_ID,
  GET_RESOURCE_RECORDS,
} from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FlexibleConnectedPositionStrategy } from '@angular/cdk/overlay';

const ITEMS_PER_PAGE = 10;
const RECORDS_DEFAULT_COLUMNS = ['_incrementalId', '_actions'];

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss'],
})
export class ResourceComponent implements OnInit, OnDestroy {
  // === DATA ===
  private resourceSubscription?: Subscription;
  private recordsSubscription?: Subscription;
  private recordsQuery!: QueryRef<GetResourceRecordsQueryResponse>;
  public loading = true;
  public id = '';
  public resource: any;
  public cachedRecords: Record[] = [];

  // === RECORDS ASSOCIATED ===
  recordsDefaultColumns: string[] = RECORDS_DEFAULT_COLUMNS;
  displayedColumnsRecords: string[] = [];
  dataSourceRecords: any[] = [];

  // === FORMS ASSOCIATED ===
  displayedColumnsForms: string[] = [
    'name',
    'createdAt',
    'status',
    'recordsCount',
    'core',
    '_actions',
  ];
  dataSourceForms: any[] = [];

  // === LAYOUTS ===
  displayedColumnsLayouts: string[] = ['name', 'createdAt', '_actions'];
  dataSourceLayouts: any[] = [];

  // === SHOW DELETED RECORDS ===
  showDeletedRecords = false;

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  @ViewChild('xlsxFile') xlsxFile: any;

  public showUpload = false;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private downloadService: SafeDownloadService,
    private dialog: MatDialog,
    private translate: TranslateService,
    private gridLayoutService: SafeGridLayoutService
  ) {}

  /*  Load data from the id of the resource passed as a parameter.
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (this.id !== null) {
      this.getResourceData();
    } else {
      this.router.navigate(['/resources']);
    }
  }

  /**
   * Loads resource data.
   */
  private getResourceData(): void {
    this.loading = true;
    if (this.resourceSubscription) {
      this.resourceSubscription.unsubscribe();
    }
    if (this.recordsSubscription) {
      this.recordsSubscription.unsubscribe();
    }

    // get the records according to the open resource
    this.recordsQuery = this.apollo.watchQuery<GetResourceRecordsQueryResponse>(
      {
        query: GET_RESOURCE_RECORDS,
        variables: {
          first: ITEMS_PER_PAGE,
          id: this.id,
          display: false,
          showDeletedRecords: this.showDeletedRecords,
        },
      }
    );
    this.recordsSubscription = this.recordsQuery.valueChanges.subscribe(
      (res) => {
        this.cachedRecords = res.data.resource.records.edges.map((x) => x.node);
        this.dataSourceRecords = this.cachedRecords.slice(
          ITEMS_PER_PAGE * this.pageInfo.pageIndex,
          ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = res.data.resource.records.totalCount;
        this.pageInfo.endCursor = res.data.resource.records.pageInfo.endCursor;
      }
    );

    // get the resource and the form linked
    this.resourceSubscription = this.apollo
      .watchQuery<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .valueChanges.subscribe(
        (res) => {
          if (res.data.resource) {
            this.resource = res.data.resource;
            this.dataSourceForms = this.resource.forms;
            this.dataSourceLayouts = this.resource.layouts;
            this.setDisplayedColumns(false);
            this.loading = res.loading;
          } else {
            this.snackBar.openSnackBar(
              NOTIFICATIONS.accessNotProvided('resource'),
              { error: true }
            );
            this.router.navigate(['/resources']);
          }
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['/resources']);
        }
      );
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
    } else {
      this.dataSourceRecords = this.cachedRecords.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
      );
    }
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
    columns = columns.concat(RECORDS_DEFAULT_COLUMNS);
    this.displayedColumnsRecords = columns;
  }

  public filterCore(event: any): void {
    this.setDisplayedColumns(event.value);
  }

  /**
   * Deletes a record if authorized, open a confirmation modal if it's a hard delete.
   *
   * @param id Id of record to delete.
   * @param e click event.
   */
  public onDeleteRecord(element: any, e: any): void {
    e.stopPropagation();
    if (this.showDeletedRecords) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
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
          cancelText: this.translate.instant('components.confirmModal.cancel'),
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
        this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Record'));
        this.dataSourceRecords = this.dataSourceRecords.filter(
          (x) => x.id !== id
        );
      });
  }

  /*  Delete a form if authorized.
   */
  deleteForm(id: any, e: any): void {
    e.stopPropagation();
    this.apollo
      .mutate<DeleteFormMutationResponse>({
        mutation: DELETE_FORM,
        variables: {
          id,
        },
      })
      .subscribe((res) => {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Form'));
        this.dataSourceForms = this.dataSourceForms.filter((x) => x.id !== id);
      });
  }

  /**
   * Edits the permissions layer.
   *
   * @param e New permissions.
   */
  saveAccess(e: any): void {
    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE,
        variables: {
          id: this.id,
          permissions: e,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.resource = res.data.editResource;
        }
      });
  }

  /**
   * Downloads the list of records of the resource.
   *
   * @param type Type of the document to download ( excel or csv ).
   */
  onDownload(type: string): void {
    const path = `download/resource/records/${this.id}`;
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
    const path = `upload/resource/records/${this.id}`;
    this.downloadService.uploadFile(path, file).subscribe(
      (res) => {
        this.xlsxFile.clearFiles();
        if (res.status === 'OK') {
          this.snackBar.openSnackBar(NOTIFICATIONS.recordUploadSuccess);
          this.getResourceData();
          this.showUpload = false;
        }
      },
      (error: any) => {
        this.snackBar.openSnackBar(error.error, { error: true });
        // this.xlsxFile.clearFiles();
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
    this.getResourceData();
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
        this.dataSourceRecords = this.dataSourceRecords.filter(
          (x) => x.id !== id
        );
      });
  }

  /**
   * Get list of forms filtering by record form.
   *
   * @param record Record to filter templates with.
   * @returns list of different forms than the one used to create the record.
   */
  public filterTemplates(record: Record): Form[] {
    return this.resource.forms.filter((x: Form) => x.id !== record.form?.id);
  }

  onAddLayout(): void {
    const dialogRef = this.dialog.open(SafeLayoutModalComponent, {
      disableClose: true,
      data: {
        queryName: this.resource.queryName,
      },
      position: {
        bottom: '0',
        right: '0',
      },
      panelClass: 'tile-settings-dialog',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .addLayout(value, this.id)
          .subscribe((res: any) => {
            if (res.data.addLayout) {
              this.dataSourceLayouts = [
                ...this.resource.layouts,
                res.data?.addLayout,
              ];
            }
          });
      }
    });
  }

  /**
   * Edits a layout. Opens a popup for edition.
   *
   * @param layout Layout to edit
   */
  onEditLayout(layout: Layout): void {
    const dialogRef = this.dialog.open(SafeLayoutModalComponent, {
      disableClose: true,
      data: {
        layout,
      },
      position: {
        bottom: '0',
        right: '0',
      },
      panelClass: 'tile-settings-dialog',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .editLayout(layout, value, this.resource.id)
          .subscribe((res: any) => {
            if (res.data.editLayout) {
              this.dataSourceLayouts = this.dataSourceLayouts.map((x) => {
                if (x.id === layout.id) {
                  return res.data.editLayout;
                } else {
                  return x;
                }
              });
            }
          });
      }
    });
  }

  /**
   * Deletes a layout.
   *
   * @param layout Layout to delete
   */
  onDeleteLayout(layout: Layout): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.layout.one'),
        }),
        content: this.translate.instant(
          'components.form.layout.delete.confirmationMessage',
          {
            name: layout.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .deleteLayout(layout, this.id)
          .subscribe((res: any) => {
            if (res.data.deleteLayout) {
              this.dataSourceLayouts = this.dataSourceLayouts.filter(
                (x) => x.id !== layout.id
              );
            }
          });
      }
    });
  }

  /**
   * Unsubscribe to subscriptions before destroying component.
   */
  ngOnDestroy(): void {
    if (this.resourceSubscription) {
      this.resourceSubscription.unsubscribe();
    }
  }
}
