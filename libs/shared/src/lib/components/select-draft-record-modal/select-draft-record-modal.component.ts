import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { GET_DRAFT_RECORDS } from './graphql/queries';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DateModule } from '../../pipes/date/date.module';
import { Component, OnInit, Inject } from '@angular/core';
import { DELETE_DRAFT_RECORD } from './graphql/mutations';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import {
  DraftRecordsQueryResponse,
  DraftRecord,
} from '../../models/draftRecord.model';
import {
  TableModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
} from '@oort-front/ui';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DateModule,
    DialogModule,
    ButtonModule,
    SkeletonTableModule,
    TooltipModule,
  ],
  selector: 'shared-select-draft-record-modal',
  templateUrl: './select-draft-record-modal.component.html',
  styleUrls: ['./select-draft-record-modal.component.scss'],
})
export class SelectDraftRecordModalComponent implements OnInit {
  public draftRecords: Array<DraftRecord> = new Array<DraftRecord>();
  public displayedColumns = ['createdAt', 'actions'];
  public displayedColumnsForSkeleton = ['createdAt'];
  public loading = true;

  /**
   * Modal for selection of a draft record
   *
   * @param confirmService Service that handles confirming modals
   * @param translate Translating service
   * @param apollo Apollo service
   * @param dialogRef Dialog reference of the component
   * @param data Data passed to the dialog, here the formId of the current form
   */
  constructor(
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private apollo: Apollo,
    public dialogRef: DialogRef<SelectDraftRecordModalComponent>,
    @Inject(DIALOG_DATA)
    public data: any
  ) {}

  ngOnInit(): void {
    this.fetchDraftRecords();
  }

  fetchDraftRecords() {
    const formId = this.data;
    this.apollo
      .query<DraftRecordsQueryResponse>({
        query: GET_DRAFT_RECORDS,
        variables: {
          formId,
        },
      })
      .pipe()
      .subscribe(({ data }) => {
        this.draftRecords = data.draftRecords;
        this.loading = false;
      });
  }

  onDeleteDraft(element: any) {
    const dialogRef = this.confirmService.openConfirmModal({
      title: 'Delete this draft',
      content: 'Do you really want to delete this draft record ?',
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe().subscribe((value) => {
      if (value) {
        this.loading = true;
        this.apollo
          .mutate<any>({
            mutation: DELETE_DRAFT_RECORD,
            variables: {
              id: element.id,
            },
          })
          .subscribe(() => {
            this.fetchDraftRecords();
          });
      }
    });
  }

  /**
   * Closes the modal
   *
   * @param element Draft record to be returned to form component
   */
  closeModal(element: any): void {
    const confirmDialogRef = this.confirmService.openConfirmModal({
      title: 'Load this draft',
      content: 'Do you really want to load this draft record ?',
      confirmText: this.translate.instant('components.confirmModal.confirm'),
      confirmVariant: 'primary',
    });
    confirmDialogRef.closed.pipe().subscribe((value) => {
      if (value) {
        this.dialogRef.close(element as any);
      }
    });
  }
}
