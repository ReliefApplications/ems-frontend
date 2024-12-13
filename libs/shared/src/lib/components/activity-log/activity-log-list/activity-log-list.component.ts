import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  DateModule as UIDateModule,
} from '@oort-front/ui';
import {
  GridModule,
  PageChangeEvent,
  PagerSettings,
} from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  SortDescriptor,
} from '@progress/kendo-data-query';
import { debounceTime, takeUntil } from 'rxjs';
import { ActivityLog } from '../../../models/activity-log.model';
import { DateModule } from '../../../pipes/date/date.module';
import { DownloadService } from '../../../services/download/download.service';
import { RestService } from '../../../services/rest/rest.service';
import { EmptyModule } from '../../ui/empty/empty.module';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 50;

/**
 * Shared activity log list component.
 */
@Component({
  selector: 'shared-activity-log-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    ButtonModule,
    UIDateModule,
    ReactiveFormsModule,
    FormWrapperModule,
    EmptyModule,
    DateModule,
    GridModule,
  ],
  templateUrl: './activity-log-list.component.html',
  styleUrls: ['./activity-log-list.component.scss'],
})
export class ActivityLogListComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** User ID to filter activities. */
  @Input() userId: string | undefined;
  /** Application ID to filter activities. */
  @Input() applicationId: string | undefined;
  /** Dataset */
  public dataset: {
    data: ActivityLog[];
    total: number;
  } = {
    data: [],
    total: 0,
  };
  /** Attributes */
  public attributes: { text: string; value: string }[] = [];
  /** Loading flag */
  public loading = true;
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
  /** Header filter */
  public headerFilter: any = {
    filters: [],
    logic: 'and',
  };
  /** Page info */
  public pageInfo = {
    skip: 0,
    take: DEFAULT_PAGE_SIZE,
  };
  /** Pager settings */
  public pagerSettings: PagerSettings = {
    pageSizes: [10, 50, 100],
  };
  /** Sort descriptor */
  public sort: SortDescriptor[] = [];

  /**
   * Shared activity log list component.
   *
   * @param restService Shared rest service
   * @param fb Angular form builder instance
   * @param downloadService Shared download service
   */
  constructor(
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
    this.fetch();
    this.getAttributes();
    this.filterForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe({
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
          this.headerFilter.filters = filters;
          this.pageInfo = {
            ...this.pageInfo,
            skip: 0,
          };
          this.fetch();
        },
      });
  }

  /**
   * Filters applications and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: CompositeFilterDescriptor): void {
    this.filter = filter;
    this.pageInfo = {
      ...this.pageInfo,
      skip: 0,
    };
    this.fetch();
  }

  /**
   * Handles sort event.
   *
   * @param e sort event
   */
  onSort(e: SortDescriptor[]): void {
    this.sort = e;
    this.pageInfo = {
      ...this.pageInfo,
      skip: 0,
    };
    this.fetch();
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: PageChangeEvent): void {
    this.pageInfo = {
      ...this.pageInfo,
      skip: e.skip,
      take: e.take,
    };
    this.fetch();
  }

  /**
   * Method to download activities when the link is clicked.
   */
  onDownload(): void {
    const path = '/activities/download';
    this.downloadService.getActivitiesExport(path, 'recent-hits.xlsx', {
      filter: this.filter,
      userId: this.userId,
      applicationId: this.applicationId,
      ...(this.sort[0] &&
        this.sort[0].dir && {
          sortField: this.sort[0].field,
          sortOrder: this.sort[0].dir,
        }),
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
        },
      });
  }

  /**
   * Fetch items.
   */
  private fetch() {
    this.loading = true;
    this.restService
      .get('/activities', {
        params: {
          ...(this.sort[0] &&
            this.sort[0].dir && {
              sortField: this.sort[0].field,
              sortOrder: this.sort[0].dir,
            }),
          skip: this.pageInfo.skip,
          take: this.pageInfo.take,
          ...(this.userId && {
            user_id: this.userId,
          }),
          ...(this.applicationId && {
            application_id: this.applicationId,
          }),
          filter: JSON.stringify({
            logic: 'and',
            filters: [this.filter, this.headerFilter],
          }),
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this.loading = false;
          this.dataset = {
            data: value.data,
            total: value.total,
          };
          this.pageInfo.skip = value.skip;
          this.pageInfo.take = value.take;
        },
      });
  }
}
