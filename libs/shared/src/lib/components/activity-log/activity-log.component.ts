import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApolloQueryResult } from '@apollo/client/core/types';
import { handleTablePageEvent, UIPageChangeEvent } from '@oort-front/ui';
import { Apollo, QueryRef } from 'apollo-angular';
import { takeUntil } from 'rxjs';
import {
  ActivityLog,
  ActivityLogsActivityLogNodesQueryResponse,
} from '../../models/activity-log.model';
import { RestService } from '../../services/rest/rest.service';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../utils/public-api';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { LIST_ACTIVITIES } from './graphql/queries';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 100;

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
  /** List of activities to display. */
  public activitiesLogs: ActivityLog[] = [];
  /** Columns to display in the table. */
  public displayedColumns: string[] = [];
  /** Attributes */
  public attributes: { text: string; value: string }[] = [];
  /** Loading flag */
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
   * Shared activity log component.
   *
   * @param apollo Apollo Client
   * @param restService Shared rest service
   * @param fb Angular form builder instance
   */
  constructor(
    private apollo: Apollo,
    private restService: RestService,
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
    this.getAttributes();
    this.setValueChangeListeners();
  }

  /**
   * Fetch attributes to build columns
   */
  private getAttributes(): void {
    this.restService
      .get('/permissions/attributes')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attributes: any) => {
          this.attributes = attributes;
          this.displayedColumns = [
            'createdAt',
            'userId',
            'username',
            ...this.attributes.map((x) => x.value),
            'url',
          ];
        },
        error: () => {
          this.displayedColumns = ['createdAt', 'userId', 'username', 'url'];
        },
      });
  }

  /**
   * Set any needed listeners for the current query or filter form
   */
  private setValueChangeListeners() {
    this.activityLogsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (
          results: ApolloQueryResult<ActivityLogsActivityLogNodesQueryResponse>
        ) => {
          this.updateValues(
            results.errors?.length ? { activityLogs: [] as any } : results.data
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
    this.loading = true;
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
      this.updateValues(cachedValues);
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
              this.updateValues(results.data);
            }
          );
      }
    }
  }

  /**
   * Updates local list with given data
   *
   * @param data New values to update forms
   */
  private updateValues(data: ActivityLogsActivityLogNodesQueryResponse): void {
    const mappedValues = data.activityLogs.edges.map((x) => x.node);
    this.cachedActivities = updateQueryUniqueValues(
      this.cachedActivities,
      mappedValues
    );
    this.pageInfo.length = data.activityLogs.totalCount;
    this.pageInfo.endCursor = data.activityLogs.pageInfo.endCursor;
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
    this.restService
      .post(
        '/activity/download-activities',
        { filter: this.filter },
        { responseType: 'blob' }
      )
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
