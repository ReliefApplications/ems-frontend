import { Component } from '@angular/core';
import { LIST_ACTIVITIES } from './graphql/queries';
import { OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ActivityLog,
  ActivityLogsActivityLogNodesQueryResponse,
} from '../../models/activity-log.model';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { handleTablePageEvent, UIPageChangeEvent } from '@oort-front/ui';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../utils/public-api';
import { ApolloQueryResult } from '@apollo/client/core/types';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Shared activity log component.
 */
@Component({
  selector: 'shared-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss'],
})
export class ActivityLogComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /**
   * List of activities to display.
   */
  activitiesLogs: ActivityLog[] = [];

  /**
   * Columns to display in the table.
   */
  displayedColumns: string[] = ['userId', 'eventType', 'url'];

  /**
   * URL to download activities.
   */
  downloadUrl = 'http://localhost:3000/activity/download-activities';
  public loading = false;
  /** Filter form group */
  public filterForm = this.fb.group({
    startDate: [null],
    endDate: [null],
  });

  /** Filter */
  public filter: any = {
    filters: [],
    logic: 'and',
  };

  /** Page info */
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /** Cached activity logs */
  public cachedActivities: ActivityLog[] = [];

  /** Activity logs query */
  private activityLogsQuery!: QueryRef<ActivityLogsActivityLogNodesQueryResponse>;

  /**
   * Constructor that injects the Apollo service.
   *
   * @param apollo The Apollo service for interacting with GraphQL API.
   * @param http The HttpClient service for making HTTP requests.
   */
  constructor(
    private apollo: Apollo,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    super();
  }

  /**
   * OnInit lifecycle hook to fetch activities when the component initializes.
   */
  ngOnInit(): void {
    // Use Apollo service to watch the LIST_ACTIVITIES query
    this.activityLogsQuery =
      this.apollo.watchQuery<ActivityLogsActivityLogNodesQueryResponse>({
        query: LIST_ACTIVITIES,
        variables: {
          first: DEFAULT_PAGE_SIZE,
          afterCursor: null,
          filter: this.filter,
        },
      });
    this.activityLogsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (
          results: ApolloQueryResult<ActivityLogsActivityLogNodesQueryResponse>
        ) => {
          this.updateValues(
            results.errors?.length ? { activityLogs: [] as any } : results.data,
            results.loading
          );
        }
      );
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        const filters = [];
        if (value.startDate) {
          filters.push({
            field: 'createdAt',
            operator: 'gte',
            value: value.startDate,
          });
        }
        if (value.endDate) {
          filters.push({
            field: 'createdAt',
            operator: 'lte',
            value: value.endDate,
          });
        }
        this.onFilter({
          logic: 'and',
          filters,
        });
      },
    });
  }

  /**
   * Filters applications and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filter = filter;
    this.fetchActivities(true);
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
      this.cachedActivities
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.activitiesLogs = cachedData;
    } else {
      this.fetchActivities();
    }
  }

  /**
   * Update applications query.
   *
   * @param refetch erase previous query results
   */
  private fetchActivities(refetch?: boolean): void {
    // this.updating = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: this.filter,
    };
    const cachedValues: ActivityLogsActivityLogNodesQueryResponse =
      getCachedValues(this.apollo.client, LIST_ACTIVITIES, variables);
    if (refetch) {
      this.cachedActivities = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (refetch) {
        // Rebuild the query
        this.activityLogsQuery.refetch(variables);
      } else {
        // Fetch more records
        this.activityLogsQuery
          .fetchMore({
            variables,
          })
          .then(
            (
              results: ApolloQueryResult<ActivityLogsActivityLogNodesQueryResponse>
            ) => {
              this.updateValues(results.data, results.loading);
            }
          );
      }
    }
  }

  /**
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(
    data: ActivityLogsActivityLogNodesQueryResponse,
    loading: boolean
  ): void {
    const mappedValues = data.activityLogs.edges.map((x) => x.node);
    this.cachedActivities = updateQueryUniqueValues(
      this.cachedActivities,
      mappedValues
    );
    this.pageInfo.length = data.activityLogs.totalCount;
    this.pageInfo.endCursor = data.activityLogs.pageInfo.endCursor;
    this.loading = loading;
    this.activitiesLogs = this.cachedActivities.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.loading = false;
  }

  /**
   * Method to download activities when the link is clicked.
   */
  downloadActivities(): void {
    this.http
      .get(this.downloadUrl, { responseType: 'blob' })
      .subscribe((blob: any) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = 'activities.xlsx';
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
      });
  }

  /**
   * Clears form.
   */
  clear(): void {
    this.filterForm.reset();
  }
}
