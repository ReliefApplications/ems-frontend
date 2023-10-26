import {
  DraftRecordsQueryResponse,
  DraftRecord,
} from '../../models/draftRecord.model';
import { DateModule } from '../../pipes/date/date.module';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { TableModule, DialogModule, ButtonModule } from '@oort-front/ui';
import { SkeletonTableModule } from '../skeleton/skeleton-table/skeleton-table.module';
import { GET_DRAFT_RECORDS } from '../roles/graphql/queries';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DateModule,
    DialogModule,
    ButtonModule,
    SkeletonTableModule,
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
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.fetchDraftRecords();
  }

  fetchDraftRecords() {
    this.apollo
      .query<DraftRecordsQueryResponse>({
        query: GET_DRAFT_RECORDS,
      })
      .pipe()
      .subscribe(({ data }) => {
        this.draftRecords = data.draftRecords;
        this.loading = false;
      });
  }
}
