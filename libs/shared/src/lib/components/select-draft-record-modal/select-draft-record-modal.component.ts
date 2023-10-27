import {
  DraftRecordsQueryResponse,
  DraftRecord,
} from '../../models/draftRecord.model';
import { DateModule } from '../../pipes/date/date.module';
import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import {
  TableModule,
  DialogModule,
  ButtonModule,
  TooltipModule,
} from '@oort-front/ui';
import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { GET_DRAFT_RECORDS } from '../roles/graphql/queries';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { DELETE_DRAFT_RECORD } from './graphql/mutations';
import { ConfirmService } from '../../services/confirm/confirm.service';
import { TranslateService } from '@ngx-translate/core';

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
   * @param apollo Apollo service
   * @param data Data passed to the dialog, here the formId of the current form
   */
  constructor(
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private apollo: Apollo,
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
      confirmVariant: 'primary',
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
}
