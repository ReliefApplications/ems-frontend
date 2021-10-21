import { Apollo } from 'apollo-angular';
import { Component, ComponentFactory, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GetFormByIdQueryResponse,
  GetRecordDetailsQueryResponse, GET_FORM_BY_ID, GET_RECORD_DETAILS
} from '../../../graphql/queries';
import {
  EditRecordMutationResponse,
  EDIT_RECORD,
  DeleteRecordMutationResponse,
  DELETE_RECORD,
  RestoreRecordMutationResponse,
  RESTORE_RECORD
} from '../../../graphql/mutations';
import { extractColumns } from '../../../utils/extractColumns';
import {
  SafeRecordHistoryComponent, SafeLayoutService, SafeConfirmModalComponent,
  NOTIFICATIONS, SafeSnackBarService
} from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { SafeDownloadService } from '@safe/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-form-records',
  templateUrl: './form-records.component.html',
  styleUrls: ['./form-records.component.scss']
})
export class FormRecordsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public loading = true;
  public id = '';
  public form: any;
  displayedColumns: string[] = [];
  dataSource: any[] = [];
  public showSidenav = true;
  private historyId = '';
  private formSubscription?: Subscription;

  // === HISTORY COMPONENT TO BE INJECTED IN LAYOUT SERVICE ===
  public factory?: ComponentFactory<any>;

  // === DELETED RECORDS VIEW ===
  public showDeletedRecords = false;

  @ViewChild('xlsxFile') xlsxFile: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private downloadService: SafeDownloadService,
    private resolver: ComponentFactoryResolver,
    private layoutService: SafeLayoutService,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
  ) {
  }

  /*  Load the records, using the form id passed as a parameter.
  */
  ngOnInit(): void {
    this.factory = this.resolver.resolveComponentFactory(SafeRecordHistoryComponent);
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
    this.formSubscription = this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_FORM_BY_ID,
      variables: {
        id: this.id,
        display: false,
        showDeletedRecords: this.showDeletedRecords
      }
    }).valueChanges.subscribe(res => {
      if (res.data.form) {
        this.form = res.data.form;
        this.dataSource = this.form.records;
        this.setDisplayedColumns();
        this.loading = res.loading;
      }
      if (res.errors) {
        // TO-DO: Check why it's not working as intended.
        this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('records', res.errors[0].message), { error: true });
      }
    });
  }

  /*  Modify the list of columns.
    */
  private setDisplayedColumns(): void {
    const columns: any[] = [];
    const structure = JSON.parse(this.form.structure);
    if (structure && structure.pages) {
      for (const page of JSON.parse(this.form.structure).pages) {
        extractColumns(page, columns);
      }
    }
    columns.push('_actions');
    this.displayedColumns = columns;
  }

  /**
   * Deletes a record if authorized, open a confirmation modal if it's a hard delete.
   * @param id Id of record to delete.
   * @param e click envent.
   */
  public onDeleteRecord(id: string, e: any): void {
    e.stopPropagation();
    if (this.showDeletedRecords) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: 'Delete record permanently',
          content: `Do you confirm the hard deletion of this record ?`,
          confirmText: 'Delete',
          confirmColor: 'warn'
        }
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.deleteRecord(id);
        }
      });
    } else {
      this.deleteRecord(id);
    }
  }

  /**
   * Sends mutation to delete record.
   * @param id Id of record to delete.
   */
  private deleteRecord(id: string): void {
    this.apollo.mutate<DeleteRecordMutationResponse>({
      mutation: DELETE_RECORD,
      variables: {
        id,
        hardDelete: this.showDeletedRecords
      }
    }).subscribe(res => {
      this.dataSource = this.dataSource.filter(x => {
        return x.id !== id;
      });
      if (id === this.historyId) {
        this.layoutService.setRightSidenav(null);
      }
    });
  }

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
          this.layoutService.setRightSidenav(null);
          this.snackBar.openSnackBar(NOTIFICATIONS.dataRecovered);
        });

      }
    });
  }

  /* Opens the history of the record on the right side of the screen.
 */
  public onViewHistory(id: string): void {
    this.apollo.query<GetRecordDetailsQueryResponse>({
      query: GET_RECORD_DETAILS,
      variables: {
        id
      }
    }).subscribe(res => {
      this.historyId = id;
      this.layoutService.setRightSidenav({
        factory: this.factory,
        inputs: {
          record: res.data.record,
          revert: (item: any, dialog: any) => {
            this.confirmRevertDialog(res.data.record, item);
          }
        },
      });
    });
  }

  onDownload(type: string): void {
    const path = `download/form/records/${this.id}`;
    console.log('path');
    console.log(path);
    const fileName = `${this.form.name}.${type}`;
    console.log('fileName');
    console.log(fileName);
    const queryString = new URLSearchParams({type}).toString();
    console.log('queryString');
    console.log(queryString);
    this.downloadService.getFile(`${path}?${queryString}`, `text/${type};charset=utf-8;`, fileName);
  }

  /**
   * Get the records template, for upload.
   */
  onDownloadTemplate(): void {
    const path = `download/form/records/${this.id}`;
    const queryString = new URLSearchParams({type: 'xlsx', template: 'true'}).toString();
    this.downloadService.getFile(`${path}?${queryString}`, `text/xlsx;charset=utf-8;`, `${this.form.name}_template.xlsx`);
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    this.uploadFileData(file);
  }

  uploadFileData(file: any): void {
    const path = `upload/form/records/${this.id}`;
    this.downloadService.uploadFile(path, file).subscribe(res => {
      this.xlsxFile.nativeElement.value = '';
      if (res.status === 'OK') {
        this.snackBar.openSnackBar(NOTIFICATIONS.recordUploadSuccess);
        this.getFormData();
      }
    }, (error: any) => {
      this.snackBar.openSnackBar(error.error, {error: true});
      this.xlsxFile.nativeElement.value = '';
    });
  }

  /**
   * Toggle archive / active view.
   * @param e click event.
   */
  onSwitchView(e: any): void {
    e.stopPropagation();
    this.showDeletedRecords = !this.showDeletedRecords;
    this.getFormData();
  }

  /**
   * Restores an archived record.
   * @param id Id of record to restore.
   * @param e click event.
   */
  public onRestoreRecord(id: string, e: any): void {
    e.stopPropagation();
    this.apollo.mutate<RestoreRecordMutationResponse>({
      mutation: RESTORE_RECORD,
      variables: {
        id,
      }
    }).subscribe(res => {
      this.dataSource = this.dataSource.filter(x => {
        return x.id !== id;
      });
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
