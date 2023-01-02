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
import { TranslateService } from '@ngx-translate/core';
import {
  QueryBuilderService,
  REFERENCE_DATA_END,
} from '../../../services/query-builder/query-builder.service';
import { SafeGridService } from '../../../services/grid/grid.service';
import { createDefaultField } from '../../query-builder/query-builder-forms';

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
  public loadingSettings = false;
  public status: {
    message?: string;
    error: boolean;
  } = {
    error: false,
  };
  public pageSize = 10;
  public skip = 0;
  private dataQuery!: QueryRef<GetAggregationDataQueryResponse>;
  private dataSubscription?: Subscription;
  public pagerSettings = PAGER_SETTINGS;
  public showFilter = false;

  @Input() resourceId!: string;
  @Input() aggregation!: Aggregation;
  @Input() widget!: any;

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
   * @param queryBuilder Shared query builder service
   * @param gridService Shared grid service
   * @param apollo Apollo service
   * @param translate Angular translate service
   */
  constructor(
    private aggregationService: SafeAggregationService,
    private aggregationBuilderService: AggregationBuilderService,
    private queryBuilder: QueryBuilderService,
    private gridService: SafeGridService,
    private apollo: Apollo,
    private translate: TranslateService
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
    this.dataSubscription = this.dataQuery.valueChanges.subscribe(
      (res) => {
        this.gridData = {
          data: res.data.recordsAggregation.items,
          total: res.data.recordsAggregation.totalCount,
        };
        this.loading = false;
      },
      (err: any) => {
        this.status = {
          error: true,
          message: this.translate.instant(
            'components.widget.grid.errors.queryFetchFailed',
            {
              error:
                err.networkError?.error?.errors
                  ?.map((x: any) => x.message)
                  .join(', ') || err,
            }
          ),
        };
        this.loading = false;
      }
    );
  }

  /**
   * Get list of aggregation fields
   */
  private getAggregationFields(): void {
    this.loadingSettings = true;
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: this.resourceId,
        },
      })
      .subscribe(
        (res) => {
          const resource = res.data.resource;
          const allGqlFields = this.queryBuilder.getFields(
            resource.queryName || ''
          );
          const aggFields = this.aggregationBuilderService.fieldsAfter(
            allGqlFields
              ?.filter((x) => this.aggregation.sourceFields.includes(x.name))
              .map((field: any) => {
                if (field.type.kind !== 'SCALAR') {
                  field.fields = this.queryBuilder
                    .getFieldsFromType(
                      field.type.kind === 'OBJECT'
                        ? field.type.name
                        : field.type.ofType.name
                    )
                    .filter(
                      (y) => y.type.name !== 'ID' && y.type.kind === 'SCALAR'
                    );
                }
                return field;
              }) || [],
            this.aggregation.pipeline
          );
          const fieldNames = aggFields.map((x) => x.name);
          const queryFields = this.aggregationBuilderService.formatFields(
            aggFields.filter((field) =>
              allGqlFields.some((x) => x.name === field.name)
            )
          );
          const metaQuery = this.queryBuilder.buildMetaQuery({
            name: resource.queryName || '',
            fields: queryFields,
          });
          if (metaQuery) {
            metaQuery.subscribe(
              async (res2: any) => {
                this.status = {
                  error: false,
                };
                for (const key in res2.data) {
                  if (Object.prototype.hasOwnProperty.call(res2.data, key)) {
                    const metaFields = Object.assign({}, res2.data[key]);
                    try {
                      await this.gridService.populateMetaFields(metaFields);
                      // Remove ref data meta fields
                      for (const field of queryFields) {
                        if (field.type.endsWith(REFERENCE_DATA_END)) {
                          delete metaFields[field.name];
                        }
                      }
                    } catch (err) {
                      console.error(err);
                    }
                    this.loadingSettings = false;
                    const fields = queryFields.concat(
                      fieldNames.reduce((arr, fieldName) => {
                        if (
                          !queryFields.some((field) => field.name === fieldName)
                        ) {
                          arr.push(createDefaultField(fieldName));
                        }
                        return arr;
                      }, [])
                    );
                    this.fields = this.gridService.getFields(
                      fields,
                      metaFields,
                      {}
                    );
                  }
                }
              },
              (err: any) => {
                this.loadingSettings = false;
                this.status = {
                  error: true,
                  message: this.translate.instant(
                    'components.widget.grid.errors.metaQueryFetchFailed',
                    {
                      error:
                        err.networkError?.error?.errors
                          ?.map((x: any) => x.message)
                          .join(', ') || err,
                    }
                  ),
                };
              }
            );
          } else {
            this.loadingSettings = false;
            this.status = {
              error: !this.loadingSettings,
              message: this.translate.instant(
                'components.widget.grid.errors.metaQueryBuildFailed'
              ),
            };
          }
        },
        (err: any) => {
          this.loadingSettings = false;
          this.status = {
            error: true,
            message: this.translate.instant(
              'components.widget.grid.errors.metaQueryFetchFailed',
              {
                error:
                  err.networkError?.error?.errors
                    ?.map((x: any) => x.message)
                    .join(', ') || err,
              }
            ),
          };
        }
      );
  }

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
