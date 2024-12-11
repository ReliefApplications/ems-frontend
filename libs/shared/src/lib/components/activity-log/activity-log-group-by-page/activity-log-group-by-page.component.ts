import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestService } from '../../../services/rest/rest.service';
import { debounceTime, takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import {
  ButtonModule,
  DateModule,
  FormWrapperModule,
  PaginatorModule,
  TableModule,
  UIPageChangeEvent,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { EmptyModule } from '../../ui/empty/empty.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/** Interface of group by url aggregation result */
interface GroupByUrl {
  /** Number of hits */
  count: number;
  /** Page url */
  url: string;
}

@Component({
  selector: 'shared-activity-log-group-by-page',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TranslateModule,
    SkeletonTableModule,
    PaginatorModule,
    EmptyModule,
    DateModule,
    ButtonModule,
    ReactiveFormsModule,
    FormWrapperModule,
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
  /** Group by url items */
  public dataset: GroupByUrl[] = [];
  /** Columns to display in the table. */
  public displayedColumns = ['count', 'url'];
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
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
  };

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
  onPage(e: UIPageChangeEvent): void {
    this.loading = true;
    this.pageInfo = {
      ...this.pageInfo,
      pageIndex: e.pageIndex,
      pageSize: e.pageSize,
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
      pageIndex: 0,
    };
    this.fetch();
  }

  private fetch() {
    this.restService
      .post(
        '/activity/group-by-url',
        {
          filter: this.filter,
        },
        {
          params: {
            page: this.pageInfo.pageIndex,
            per_page: this.pageInfo.pageSize,
            ...(this.userId && {
              user_id: this.userId,
            }),
            ...(this.applicationId && {
              application_id: this.applicationId,
            }),
          },
        }
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (value) => {
          this.loading = false;
          this.dataset = value.items;
          this.pageInfo.length = value.totalCount;
          this.pageInfo.pageIndex = value.currentPage;
          this.pageInfo.pageSize = value.perPage;
        },
      });
  }
}
