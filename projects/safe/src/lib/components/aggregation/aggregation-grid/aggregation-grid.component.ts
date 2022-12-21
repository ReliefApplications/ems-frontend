import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Apollo, QueryRef } from 'apollo-angular';
import { GetAggregationDataQueryResponse } from '../../../services/aggregation/graphql/queries';
import { Aggregation } from '../../../models/aggregation.model';
import { AggregationBuilderService } from '../../../services/aggregation-builder/aggregation-builder.service';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';
import { PAGER_SETTINGS } from './aggregation-grid.constants';
import { GetResourceByIdQueryResponse, GET_RESOURCE } from './graphql/queries';
import { Subscription } from 'rxjs';

/**
 * Shared aggregation grid component.
 */
@Component({
  selector: 'safe-aggregation-grid',
  templateUrl: './aggregation-grid.component.html',
  styleUrls: ['./aggregation-grid.component.scss'],
})
export class SafeAggregationGridComponent
  implements OnInit, OnChanges, OnDestroy
{
  public gridData: GridDataResult = { data: [], total: 0 };
  public fields: any[] = [];
  public loading = false;
  public pageSize = 10;
  public skip = 0;
  private dataQuery!: QueryRef<GetAggregationDataQueryResponse>;
  private dataSubscription?: Subscription;
  public pagerSettings = PAGER_SETTINGS;
  public showFilter = false;

  @Input() resourceId!: string;
  @Input() aggregation!: Aggregation;

  /** @returns The column menu */
  get columnMenu(): { columnChooser: boolean; filter: boolean } {
    return {
      columnChooser: false,
      filter: !this.showFilter,
    };
  }

  /**
   * Shared aggregation grid component
   *
   * @param aggregationService Shared aggregation service
   * @param aggregationBuilderService Shared aggregation builder service
   * @param apollo Apollo service
   */
  constructor(
    private aggregationService: SafeAggregationService,
    private aggregationBuilderService: AggregationBuilderService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.getAggregationData();
    this.getAggregationFields();
  }

  ngOnChanges(): void {
    this.getAggregationData();
    this.getAggregationFields();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  /**
   * Get aggregation data from aggregation id and resource id
   */
  private getAggregationData(): void {
    this.loading = true;
    this.dataQuery = this.aggregationService.aggregationDataWatchQuery(
      this.resourceId,
      this.aggregation.id as string,
      this.pageSize,
      this.skip
    );
    this.dataSubscription = this.dataQuery.valueChanges.subscribe((res) => {
      this.gridData = {
        data: res.data.recordsAggregation.items,
        total: res.data.recordsAggregation.totalCount,
      };
      this.loading = false;
    });
    // .subscribe((res) => {
    //   this.gridData = {
    //     data: res.data.recordsAggregation,
    //     total: res.data.recordsAggregation.length,
    //   };
    //   this.loading = false;
    // });
  }

  /**
   * Get list of aggregation fields
   */
  private getAggregationFields(): void {
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: this.resourceId,
        },
      })
      .subscribe((res) => {
        const resource = res.data.resource;
        this.fields = this.aggregationBuilderService.fieldsAfter(
          resource.metadata?.filter((x) =>
            this.aggregation.sourceFields.includes(x.name)
          ) || [],
          this.aggregation.pipeline
        );
      });
  }

  /**
   * Toggles quick filter visibility
   */
  // public onToggleFilter(): void {
  //   if (!this.loading) {
  //     this.showFilter = !this.showFilter;
  //     // this.onFilterChange({
  //     //   logic: 'and',
  //     //   filters: this.showFilter ? [] : this.filter.filters,
  //     // });
  //   }
  // }

  // === PAGINATION ===
  /**
   * Detects pagination events and update the items loaded.
   *
   * @param event Page change event.
   */
  public onPageChange(event: PageChangeEvent): void {
    this.loading = true;
    this.skip = event.skip;
    this.pageSize = event.take;
    this.dataQuery.fetchMore({
      variables: {
        resource: this.resourceId,
        aggregation: this.aggregation.id,
        first: this.pageSize,
        skip: this.skip,
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) {
          return prev;
        }
        this.loading = false;
        console.log('fetchMoreResult', fetchMoreResult);
        return Object.assign({}, prev, {
          recordsAggregation: {
            items: fetchMoreResult.recordsAggregation.items,
            totalCount: fetchMoreResult.recordsAggregation.totalCount,
          },
        });
      },
    });
  }
}
