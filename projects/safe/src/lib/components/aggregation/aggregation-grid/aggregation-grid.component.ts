import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Aggregation } from '../../../models/aggregation.model';
import { AggregationBuilderService } from '../../../services/aggregation-builder/aggregation-builder.service';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { PAGER_SETTINGS } from './aggregation-grid.constants';
import { GetResourceByIdQueryResponse, GET_RESOURCE } from './graphql/queries';

/**
 * Shared aggregation grid component.
 */
@Component({
  selector: 'safe-aggregation-grid',
  templateUrl: './aggregation-grid.component.html',
  styleUrls: ['./aggregation-grid.component.scss'],
})
export class SafeAggregationGridComponent implements OnInit, OnChanges {
  public gridData: any[] = [];
  public fields: any[] = [];
  public loading = false;
  public pageSize = 10;
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

  /**
   * Get aggregation data from aggregation id and resource id
   */
  private getAggregationData(): void {
    this.loading = true;
    this.gridData = [];
    this.aggregationService
      .aggregationDataQuery(this.resourceId, this.aggregation.id as string)
      .subscribe((res) => {
        this.gridData = res.data.recordsAggregation;
        this.loading = false;
      });
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
  public onToggleFilter(): void {
    if (!this.loading) {
      this.showFilter = !this.showFilter;
      // this.onFilterChange({
      //   logic: 'and',
      //   filters: this.showFilter ? [] : this.filter.filters,
      // });
    }
  }
}
