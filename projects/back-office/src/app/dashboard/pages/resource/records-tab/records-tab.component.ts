import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  Record,
  Form,
  SafeConfirmModalComponent,
  SafeSnackBarService,
} from '@safe/builder';
import { Apollo } from 'apollo-angular';
import {
  DeleteRecordMutationResponse,
  DELETE_RECORD,
  RestoreRecordMutationResponse,
  RESTORE_RECORD,
} from '../graphql/mutations';

/**
 * Records tab of resource page.
 */
@Component({
  selector: 'app-records-tab',
  templateUrl: './records-tab.component.html',
  styleUrls: ['./records-tab.component.scss'],
})
export class RecordsTabComponent implements OnInit {
  @Input() dataSourceRecords: any;
  @Input() resource: any;
  @Input() showDeletedRecords: any;
  @Input() displayedColumnsRecords: any;
  @Input() recordsDefaultColumns: any;

  /**
   * Records tab of resource page
   *
   * @param apollo Apollo service
   * @param translate Angular translate service
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   */
  constructor(
    private apollo: Apollo,
    private translate: TranslateService,
    private dialog: MatDialog,
    private snackBar: SafeSnackBarService
  ) {}

  ngOnInit(): void {}

  /**
   * Deletes a record if authorized, open a confirmation modal if it's a hard delete.
   *
   * @param element Element to delete.
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
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectDeleted', {
            value: this.translate.instant('common.record.one'),
          })
        );
        this.dataSourceRecords = this.dataSourceRecords.filter(
          (x: any) => x.id !== id
        );
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
      .subscribe((res) => {
        this.dataSourceRecords = this.dataSourceRecords.filter(
          (x: any) => x.id !== id
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
}
