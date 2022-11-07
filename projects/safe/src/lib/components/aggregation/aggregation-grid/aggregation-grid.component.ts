import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Apollo } from 'apollo-angular';
import { Aggregation } from '../../../models/aggregation.model';
import { Resource } from '../../../models/resource.model';
import { AggregationBuilderService } from '../../../services/aggregation-builder/aggregation-builder.service';
import { SafeAggregationService } from '../../../services/aggregation/aggregation.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { GetResourceByIdQueryResponse, GET_RESOURCE } from './graphql/queries';

/**
 * Shared aggregation grid component.
 */
@Component({
  selector: 'safe-aggregation-grid',
  templateUrl: './aggregation-grid.component.html',
  styleUrls: ['./aggregation-grid.component.scss'],
})
export class SafeAggregationGridComponent implements OnInit {
  public gridData: GridDataResult = { data: [], total: 0 };
  public fields: any[] = [];
  public loading = false;

  @Input() resourceId!: string;
  @Input() aggregation!: Aggregation;

  /**
   * Shared aggregation grid component
   *
   * @param aggregationService Shared aggregation service
   * @param aggregationBuilderService Shared aggregation builder service
   * @param queryBuilder Shared query builder service
   */
  constructor(
    private aggregationService: SafeAggregationService,
    private aggregationBuilderService: AggregationBuilderService,
    private queryBuilder: QueryBuilderService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.getAggregationData();
    // this.getAggregationFields();
  }

  private getAggregationData(): void {
    this.loading = true;
    this.gridData = { data: [], total: 0 };
    this.aggregationService
      .aggregationDataQuery(this.resourceId, this.aggregation.id as string)
      .subscribe((res) => {
        this.gridData = {
          data: res.data.recordsAggregation,
          total: res.data.recordsAggregation.length,
        };
        this.loading = false;
      });
  }

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
          this.aggregation.sourceFields,
          this.aggregation.pipeline
        );
      });
  }
}
