import { DownloadService } from './../../services/download/download.service';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApolloQueryResult } from '@apollo/client/core/types';
import {
  handleTablePageEvent,
  TableSort,
  UIPageChangeEvent,
} from '@oort-front/ui';
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
  /** User ID to filter activities. */
  @Input() userId: string | undefined;
  /** Application ID to filter activities. */
  @Input() applicationId: string | undefined;
  /** List of activities to display. */
  public activitiesLogs: ActivityLog[] = [];
  /** Columns to display in the table. */
  public displayedColumns: string[] = [];
  /** Attributes */
  public attributes: { text: string; value: string }[] = [];
  /** Loading flag */
  public loading = false;
  /** Updating state */
  public updating = false;
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
  /** Sort */
  private sort: TableSort = { active: '', sortDirection: '' };
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
   * @param downloadService Shared download service
   */
  constructor(
    private apollo: Apollo,
    private restService: RestService,
    private fb: FormBuilder,
    private downloadService: DownloadService
  ) {
    super();
  }

  /**
   * OnInit lifecycle hook to fetch activities when the component initializes.
   */
  ngOnInit(): void {
    this.activityLogsQuery =
      this.apollo.watchQuery<ActivityLogsActivityLogNodesQueryResponse>({
        query: LIST_ACTIVITIES,
        variables: {
          first: DEFAULT_PAGE_SIZE,
          afterCursor: null,
          filter: this.filter,
          userId: this.userId,
          applicationId: this.applicationId,
          sortField: this.sort?.sortDirection && this.sort.active,
          sortOrder: this.sort?.sortDirection,
        },
      });

    this.getAttributes();
    this.setValueChangeListeners();
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
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: TableSort): void {
    this.sort = event;
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
   * Method to download activities when the link is clicked.
   */
  downloadActivities(): void {
    const path = '/activity/download-activities';
    this.downloadService.getActivitiesExport(path, {
      filter: this.filter,
      userId: this.userId,
      applicationId: this.applicationId,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }

  /**
   * Clears form.
   */
  clear(): void {
    this.filterForm.reset();
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
   * Update applications query.
   *
   * @param refetch erase previous query results
   */
  private fetchActivities(refetch?: boolean): void {
    this.updating = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: this.filter,
      userId: this.userId,
      applicationId: this.applicationId,
      sortField: this.sort?.sortDirection && this.sort.active,
      sortOrder: this.sort?.sortDirection,
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
        this.activityLogsQuery.refetch(variables);
      } else {
        this.activityLogsQuery
          .refetch(variables)
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
    this.updating = false;
  }
}
