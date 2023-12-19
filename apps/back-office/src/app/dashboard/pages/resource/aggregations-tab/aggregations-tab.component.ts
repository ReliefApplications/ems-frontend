import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  Aggregation,
  AggregationService,
  ConfirmService,
  Resource,
  UnsubscribeComponent,
  ResourceQueryResponse,
  getCachedValues,
  updateQueryUniqueValues,
} from '@oort-front/shared';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import { GET_RESOURCE_AGGREGATIONS } from './graphql/queries';
import { takeUntil } from 'rxjs';
import { UIPageChangeEvent, handleTablePageEvent } from '@oort-front/ui';

/**
 * Aggregations tab of resource page
 */
@Component({
  selector: 'app-aggregations-tab',
  templateUrl: './aggregations-tab.component.html',
  styleUrls: ['./aggregations-tab.component.scss'],
})
export class AggregationsTabComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /**
   * Resource
   */
  public resource!: Resource;
  /**
   * Aggregations
   */
  public aggregations: Aggregation[] = [];
  /**
   * Loading state
   */
  public loading = true;

  /**
   * Columns to display
   */
  public displayedColumnsAggregations: string[] = [
    'name',
    'createdAt',
    '_actions',
  ];

  // ==== PAGINATION ====
  /**
   * Aggregations query
   */
  private aggregationsQuery!: QueryRef<ResourceQueryResponse>;
  /**
   * Cached aggregations
   */
  private cachedAggregations: Aggregation[] = [];
  /**
   * Page info
   */
  public pageInfo = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
    endCursor: '',
  };

  /**
   * Aggregations tab of resource page
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param aggregationService Grid aggregation service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private aggregationService: AggregationService,
    private confirmService: ConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.aggregationsQuery = this.apollo.watchQuery<ResourceQueryResponse>({
      query: GET_RESOURCE_AGGREGATIONS,
      variables: {
        first: this.pageInfo.pageSize,
        id: this.resource?.id,
        afterCursor: this.pageInfo.endCursor,
      },
    });

    this.aggregationsQuery.valueChanges.subscribe(({ data, loading }) => {
      this.updateValues(data, loading);
    });
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
      this.cachedAggregations
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.aggregations = cachedData;
    } else {
      this.fetchAggregations();
    }
  }

  /**
   * Fetches aggregations from resource.
   *
   */
  private fetchAggregations(): void {
    this.loading = true;
    const variables = {
      id: this.resource.id,
      first: this.pageInfo.pageSize,
      afterCursor: this.pageInfo.endCursor,
    };
    const cachedValues: ResourceQueryResponse = getCachedValues(
      this.apollo.client,
      GET_RESOURCE_AGGREGATIONS,
      variables
    );
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      this.aggregationsQuery
        .fetchMore({
          variables,
        })
        .then((results) => this.updateValues(results.data, results.loading));
    }
  }

  /**
   * Handle action from the data list presentation component
   *
   * @param action action containing action type and aggregation item if exists
   * @param action.type type of action, add, edit, delete
   * @param action.item aggregation item for the given action type
   */
  handleAction(action: {
    type: 'add' | 'edit' | 'delete';
    item?: Aggregation | null;
  }) {
    if (action.type === 'add') {
      this.onAddAggregation();
    } else if (action.type === 'edit') {
      this.onEditAggregation(action.item as Aggregation);
    } else if (action.type === 'delete') {
      this.onDeleteAggregation(action.item as Aggregation);
    }
  }

  /**
   * Adds a new aggregation for the resource.
   */
  async onAddAggregation(): Promise<void> {
    const { EditAggregationModalComponent } = await import(
      '@oort-front/shared'
    );
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.aggregationService
          .addAggregation(value, { resource: this.resource.id })
          .subscribe(({ data }: any) => {
            if (data.addAggregation) {
              this.aggregations = [...this.aggregations, data?.addAggregation];
              this.pageInfo.length += 1;
            }
          });
      }
    });
  }

  /**
   * Edits a aggregation. Opens a popup for edition.
   *
   * @param aggregation Aggregation to edit
   */
  async onEditAggregation(aggregation: Aggregation): Promise<void> {
    const { EditAggregationModalComponent } = await import(
      '@oort-front/shared'
    );
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        aggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.aggregationService
          .editAggregation(aggregation, value, { resource: this.resource.id })
          .subscribe(({ data }: any) => {
            if (data.editAggregation) {
              this.aggregations = this.aggregations.map((x: any) => {
                if (x.id === aggregation.id) {
                  return data.editAggregation;
                } else {
                  return x;
                }
              });
            }
          });
      }
    });
  }

  /**
   * Deletes a aggregation.
   *
   * @param aggregation Aggregation to delete
   */
  onDeleteAggregation(aggregation: Aggregation): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.aggregation.one'),
      }),
      content: this.translate.instant(
        'components.form.aggregation.delete.confirmationMessage',
        {
          name: aggregation.name,
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.aggregationService
          .deleteAggregation(aggregation, { resource: this.resource.id })
          .subscribe(({ data }: any) => {
            if (data.deleteAggregation) {
              this.aggregations = this.aggregations.filter(
                (x: any) => x.id !== aggregation.id
              );
              this.pageInfo.length -= 1;
            }
          });
      }
    });
  }

  /**
   * Update aggregation data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: ResourceQueryResponse, loading: boolean) {
    if (data.resource) {
      const mappedValues =
        data.resource.aggregations?.edges.map((x) => x.node) ?? [];
      this.cachedAggregations = updateQueryUniqueValues(
        this.cachedAggregations,
        mappedValues
      );
      this.pageInfo.length = data.resource.aggregations?.totalCount || 0;
      this.pageInfo.endCursor =
        data.resource.aggregations?.pageInfo.endCursor || '';
      this.aggregations = this.cachedAggregations.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.loading = loading;
  }
}
