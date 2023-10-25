import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  Aggregation,
  AggregationDataQueryResponse,
} from '../../../models/aggregation.model';
import { AggregationBuilderService } from '../../../services/aggregation-builder/aggregation-builder.service';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { PAGER_SETTINGS } from './aggregation-grid.constants';
import { GET_RESOURCE } from './graphql/queries';
import { debounceTime, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  QueryBuilderService,
  REFERENCE_DATA_END,
} from '../../../services/query-builder/query-builder.service';
import { GridService } from '../../../services/grid/grid.service';
import { createDefaultField } from '../../query-builder/query-builder-forms';
import { ContextService } from '../../../services/context/context.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { ResourceQueryResponse } from '../../../models/resource.model';
import { SortDescriptor } from '@progress/kendo-data-query';

/**
 * Shared aggregation grid component.
 */
@Component({
  selector: 'shared-aggregation-grid',
  templateUrl: './aggregation-grid.component.html',
  styleUrls: ['./aggregation-grid.component.scss'],
})
export class AggregationGridComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
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
  public sort: SortDescriptor[] = [];
  public pageSize = 10;
  public skip = 0;
  private dataQuery!: QueryRef<AggregationDataQueryResponse>;
  public pagerSettings = PAGER_SETTINGS;
  public showFilter = false;

  @Input() resourceId!: string;
  @Input() aggregation!: Aggregation;
  /** Context filters to be used with dashboard filters */
  @Input() contextFilters: string | undefined;
  /** Version at to be used with dashboard filters */
  @Input() at: string | undefined;

  /** @returns The column menu */
  get columnMenu(): { columnChooser: boolean; filter: boolean } {
    return {
      columnChooser: false,
      filter: !this.showFilter,
    };
  }

  /** @returns current field used for sorting */
  get sortField(): string | null {
    return this.sort.length > 0 && this.sort[0].dir ? this.sort[0].field : null;
  }

  /** @returns current sorting order */
  get sortOrder(): string {
    return this.sort.length > 0 && this.sort[0].dir ? this.sort[0].dir : '';
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
   * @param contextService Shared context service
   */
  constructor(
    private aggregationService: AggregationService,
    private aggregationBuilderService: AggregationBuilderService,
    private queryBuilder: QueryBuilderService,
    private gridService: GridService,
    private apollo: Apollo,
    private translate: TranslateService,
    private contextService: ContextService
  ) {
    super();
  }

  ngOnInit(): void {
    this.contextService.filter$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => {
        this.getAggregationData();
      });
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
    this.dataQuery = this.aggregationService.aggregationDataWatchQuery(
      this.resourceId,
      this.aggregation.id as string,
      this.pageSize,
      this.skip,
      this.contextFilters
        ? this.contextService.injectDashboardFilterValues(
            JSON.parse(this.contextFilters)
          )
        : undefined,
      this.at ? this.contextService.atArgumentValue(this.at) : undefined
    );
    this.dataQuery.valueChanges.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ data, loading }) => {
        this.updateValues(data, loading);
      },
      error: (err: any) => {
        this.loading = false;
        this.setErrorStatus(
          err,
          'components.widget.grid.errors.queryFetchFailed'
        );
      },
    });
  }

  /**
   * Set error status given error and translation key for the error message
   *
   * @param err error type
   * @param translationKey translation key used to build the error message
   */
  private setErrorStatus(err: any, translationKey: string) {
    this.status = {
      error: true,
      message: this.translate.instant(translationKey, {
        error:
          err.networkError?.error?.errors
            ?.map((x: any) => x.message)
            .join(', ') || err,
      }),
    };
  }

  /**
   * Get list of aggregation fields
   */
  private getAggregationFields(): void {
    this.loadingSettings = true;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id: this.resourceId,
        },
      })
      .subscribe({
        next: (res) => {
          const resource = res.data.resource;
          const allGqlFields = this.queryBuilder.getFields(
            resource.queryName || ''
          );
          // Fetch fields at the end of the pipeline
          const aggFields = this.aggregationBuilderService.fieldsAfter(
            allGqlFields
              ?.filter((x) => this.aggregation.sourceFields.includes(x.name))
              .map((field: any) => {
                if (field.type?.kind !== 'SCALAR') {
                  field.fields = this.queryBuilder
                    .getFieldsFromType(
                      field.type?.kind === 'OBJECT'
                        ? field.type.name
                        : field.type.ofType.name
                    )
                    .filter(
                      (y) => y.type.name !== 'ID' && y.type?.kind === 'SCALAR'
                    );
                }
                return field;
              }) || [],
            this.aggregation.pipeline
          );
          const fieldNames = aggFields.map((x) => x.name);
          // Convert them to query fields
          const queryFields = this.aggregationBuilderService.formatFields(
            aggFields.filter((field) =>
              allGqlFields.some((x) => x.name === field.name)
            )
          );
          // Create meta query from query fields
          const metaQuery = this.queryBuilder.buildMetaQuery({
            name: resource.queryName || '',
            fields: queryFields,
          });
          if (metaQuery) {
            metaQuery.subscribe({
              next: async ({ data }) => {
                this.status = {
                  error: false,
                };
                for (const key in data) {
                  if (Object.prototype.hasOwnProperty.call(data, key)) {
                    const metaFields = Object.assign({}, data[key]);
                    try {
                      await this.gridService.populateMetaFields(metaFields);
                      // Remove ref data meta fields because it messes up with the display
                      for (const field of queryFields) {
                        if (field.type.endsWith(REFERENCE_DATA_END)) {
                          delete metaFields[field.name];
                        }
                      }
                    } catch (err) {
                      console.error(err);
                    }
                    this.loadingSettings = false;
                    // Concat query fields with dummy one for newly added fields
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
                    // Generate grid fields
                    this.fields = this.gridService.getFields(
                      fields,
                      metaFields,
                      {}
                    );
                  }
                }
              },
              error: (err: any) => {
                this.loadingSettings = false;
                this.setErrorStatus(
                  err,
                  'components.widget.grid.errors.metaQueryFetchFailed'
                );
              },
            });
          } else {
            this.loadingSettings = false;
            // todo(infinite): check
            // this.status = {
            //   error: !this.loadingSettings,
            //   message: this.translate.instant(
            //     'components.widget.grid.errors.metaQueryBuildFailed'
            //   ),
            // };
            this.status = {
              error: false,
            };
          }
        },
        error: (err: any) => {
          this.loadingSettings = false;
          this.setErrorStatus(
            err,
            'components.widget.grid.errors.metaQueryFetchFailed'
          );
        },
      });
  }

  /**
   * Detects sort events and update the items loaded.
   *
   * @param sort Sort event.
   */
  public onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.skip = 0;
    this.onPageChange({ skip: this.skip, take: this.pageSize });
  }

  /**
   * Detects pagination events and update the items loaded.
   *
   * @param event Page change event.
   */
  public onPageChange(event: PageChangeEvent): void {
    this.loading = true;
    this.skip = event.skip;
    this.pageSize = event.take;

    this.dataQuery
      .fetchMore({
        variables: {
          first: this.pageSize,
          skip: this.skip,
          sortField: this.sortField || undefined,
          sortOrder: this.sortOrder,
        },
      })
      .then((results) => this.updateValues(results.data, results.loading));
  }

  /**
   * Update aggregation data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: AggregationDataQueryResponse, loading: boolean) {
    this.gridData = {
      data: data.recordsAggregation.items,
      total: data.recordsAggregation.totalCount,
    };
    this.loading = loading;
  }
}
