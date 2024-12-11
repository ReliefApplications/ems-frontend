import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestService } from '../../../services/rest/rest.service';
import { debounceTime, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { ButtonModule, DateModule, FormWrapperModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyModule } from '../../ui/empty/empty.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  GridModule,
  PageChangeEvent,
  PagerSettings,
} from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/** Interface of group by url aggregation result */
interface GroupByUrl {
  /** Number of hits */
  count: number;
  /** Page url */
  url: string;
}

/**
 * Activity log group by page.
 */
@Component({
  selector: 'shared-activity-log-group-by-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    EmptyModule,
    DateModule,
    ButtonModule,
    ReactiveFormsModule,
    FormWrapperModule,
    GridModule,
  ],
  templateUrl: './activity-log-group-by-page.component.html',
  styleUrls: ['./activity-log-group-by-page.component.scss'],
})
export class ActivityLogGroupByPageComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** User ID to filter activities. */
  @Input() userId: string | undefined;
  /** Application ID to filter activities. */
  @Input() applicationId: string | undefined;
  /** Dataset */
  public dataset: {
    data: GroupByUrl[];
    total: number;
  } = {
    data: [],
    total: 0,
  };
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
   * Activity log group by page
   *
   * @param restService Shared REST service
   * @param fb Angular form builder
   */
  constructor(private restService: RestService, private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.fetch();
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
          this.onFilter({
            logic: 'and',
            filters,
          });
        },
      });
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
   * Clears form.
   */
  clear(): void {
    this.filterForm.reset();
  }

  /**
   * Filters applications and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filter = filter;
    this.pageInfo = {
      ...this.pageInfo,
      skip: 0,
    };
    this.fetch();
  }

  /**
   * Fetch items.
   */
  private fetch() {
    this.loading = true;
    this.restService
      .get('/activities/group-by-url', {
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
          filter: JSON.stringify(this.filter),
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
