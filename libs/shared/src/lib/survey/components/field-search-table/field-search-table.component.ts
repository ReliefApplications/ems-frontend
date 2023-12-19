import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionTextModel, SurveyModel } from 'survey-core';
import { Record } from '../../../models/record.model';
import { UnsubscribeComponent } from '../../../components/utils/unsubscribe/unsubscribe.component';
import { Apollo, QueryRef } from 'apollo-angular';
import { ResourceRecordsConnectionsQueryResponse } from '../../../models/resource.model';
import { GET_RESOURCE_RECORDS } from './graphql/queries';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import { ApolloQueryResult } from '@apollo/client';
import { takeUntil } from 'rxjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { TranslateModule } from '@ngx-translate/core';
import {
  PaginatorModule,
  TooltipModule,
  UIPageChangeEvent,
  handleTablePageEvent,
} from '@oort-front/ui';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { Dialog } from '@angular/cdk/dialog';

/** Default size of the grid page */
const ITEMS_PER_PAGE = 5;

/** Component that displays a table with similar records based on the currently input value for the question */
@Component({
  selector: 'shared-field-search-table',
  standalone: true,
  imports: [
    CommonModule,
    GridModule,
    ButtonsModule,
    TranslateModule,
    TooltipModule,
    PaginatorModule,
  ],
  templateUrl: './field-search-table.component.html',
  styleUrls: ['./field-search-table.component.scss'],
})
export class FieldSearchTableComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Question to search records by its value */
  @Input() question!: QuestionTextModel;
  /** Resource to search records of */
  public resource!: string;
  /** Name of the field we're searching by */
  public valueName!: string;
  /** If the record exists, checks if the value is different than the current one */
  public isTouched = false;
  /** Records similar to the current input, currently displayed in the grid */
  public dataSource: { record: Record; matchedText: string }[] = [];
  /** Cached records */
  public cachedRecords: Record[] = [];
  /** Reference to the records query */
  private recordsQuery?: QueryRef<ResourceRecordsConnectionsQueryResponse>;
  /** If the query is loading */
  public loading = false;
  /** If the query is updating */
  public updating = false;
  /** Page info */
  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    endCursor: '',
    length: 0,
  };

  /** @returns the filter for the query */
  private get filter() {
    // Filter by the field value
    const baseFilter = [
      {
        field: this.question.valueName,
        operator: 'contains',
        value: this.question.value,
      },
    ];
    const isUpdating = !!(this.question.survey as SurveyModel)?.record?.id;
    return !isUpdating
      ? baseFilter
      : baseFilter.concat({
          // Remove the current record from the results
          field: '__ID__',
          operator: 'neq',
          value: (this.question.survey as SurveyModel)?.record?.id,
        });
  }

  /**
   * Component that displays a table with similar records based on the currently input value for the question
   *
   * @param apollo Apollo service to query the records
   * @param dialog Dialog service to open the record detail page
   */
  constructor(private apollo: Apollo, private dialog: Dialog) {
    super();
  }

  ngOnInit(): void {
    this.resource = (this.question.survey as SurveyModel).resource?.id;
    this.valueName = this.question.valueName;
    if (!this.resource) {
      return;
    }

    // Init the records query
    this.recordsQuery =
      this.apollo.watchQuery<ResourceRecordsConnectionsQueryResponse>({
        query: GET_RESOURCE_RECORDS,
        variables: {
          first: ITEMS_PER_PAGE,
          id: this.resource,
          filter: this.question.value && this.filter,
        },
      });

    // Subscribe to changes on the records query
    this.recordsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ errors, data, loading }) => {
        if (errors) {
          this.cachedRecords = [];
          this.dataSource = [];
        } else {
          this.updateValues(data, loading);
        }
      });

    // Listen to changes on the question value
    this.question.valueChangedCallback = () => {
      this.isTouched =
        this.question.value !==
        (this.question.survey as SurveyModel)?.record?.data?.[
          this.question.valueName
        ];
      if (!this.question.value) {
        this.cachedRecords = [];
        this.dataSource = [];
        return;
      } else {
        this.fetchRecordsData(true);
      }
    };
  }

  /**
   * Map record to be used in the grid.
   *
   * @param record Record to be mapped
   * @returns The record mapped to be used in the grid
   */
  private mapRecordToDataSource(record: Record) {
    return {
      record: record,
      matchedText: record.data?.[this.question.valueName]?.replace(
        new RegExp(this.question.value, 'gi'),
        (match: string) => `<b>${match}</b>`
      ),
    };
  }

  /**
   * Update the records to show on the grid.
   *
   * @param refetch erase previous query results
   */
  private fetchRecordsData(refetch?: boolean): void {
    if (!this.recordsQuery || !this.question.value) {
      return;
    }

    this.loading = true;
    this.updating = true;
    const variables = {
      id: this.resource,
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: this.filter,
    };

    const cachedValues: ResourceRecordsConnectionsQueryResponse =
      getCachedValues(this.apollo.client, GET_RESOURCE_RECORDS, variables);
    if (refetch) {
      this.cachedRecords = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (refetch) {
        this.recordsQuery.refetch(variables);
      } else {
        this.recordsQuery
          .fetchMore({ variables })
          .then(
            (
              results: ApolloQueryResult<ResourceRecordsConnectionsQueryResponse>
            ) => {
              this.updateValues(results.data, results.loading);
            }
          );
      }
    }
  }

  /**
   * Update records data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(
    data: ResourceRecordsConnectionsQueryResponse,
    loading: boolean
  ) {
    const mappedValues = data.resource.records.edges.map((x) => x.node);
    this.cachedRecords = updateQueryUniqueValues(
      this.cachedRecords,
      mappedValues
    );
    this.pageInfo.endCursor = data.resource.records.pageInfo.endCursor || '';
    this.pageInfo.length = data.resource.records.totalCount;
    this.dataSource = this.cachedRecords
      .slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      )
      .map(this.mapRecordToDataSource.bind(this));
    this.loading = loading;
    this.updating = false;
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
      this.dataSource = cachedData.map(this.mapRecordToDataSource.bind(this));
    } else {
      this.fetchRecordsData();
    }
  }

  /**
   * Opens the records detail page.
   *
   * @param record Record to be opened
   */
  public async openRecord(record: Record) {
    if (!record.id || !record.form?.id) {
      return;
    }

    const { RecordModalComponent } = await import(
      '../../../components/record-modal/record-modal.component'
    );

    this.dialog.open(RecordModalComponent, {
      data: {
        recordId: record.id,
        template: record.form.id,
      },
      autoFocus: false,
    });
  }
}
