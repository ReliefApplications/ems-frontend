import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SafeEditAggregationModalComponent,
  Aggregation,
  SafeAggregationService,
  SafeConfirmService,
  Resource,
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../../utils/update-queries';
import {
  GetResourceByIdQueryResponse,
  GET_RESOURCE_AGGREGATIONS,
} from './graphql/queries';

/**
 * Aggregations tab of resource page
 */
@Component({
  selector: 'app-aggregations-tab',
  templateUrl: './aggregations-tab.component.html',
  styleUrls: ['./aggregations-tab.component.scss'],
})
export class AggregationsTabComponent implements OnInit {
  public resource!: Resource;
  public aggregations: Aggregation[] = [];
  public loading = true;

  public displayedColumnsAggregations: string[] = [
    'name',
    'createdAt',
    '_actions',
  ];

  // ==== PAGINATION ====
  private aggregationsQuery!: QueryRef<GetResourceByIdQueryResponse>;
  private cachedAggregations: Aggregation[] = [];
  public pageInfo = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
    endCursor: '',
  };

  /** @returns True if the aggregations tab is empty */
  get empty(): boolean {
    return !this.loading && this.aggregations.length === 0;
  }

  /**
   * Aggregations tab of resource page
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param aggregationService Grid aggregation service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private aggregationService: SafeAggregationService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.aggregationsQuery =
      this.apollo.watchQuery<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE_AGGREGATIONS,
        variables: {
          first: this.pageInfo.pageSize,
          id: this.resource.id,
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
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    // Checks if with new page/size more data needs to be fetched
    if (
      ((e.pageIndex > e.previousPageIndex &&
        e.pageIndex * this.pageInfo.pageSize >=
          this.cachedAggregations.length) ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.length > this.cachedAggregations.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.pageInfo.pageSize = first;
      this.fetchAggregations();
    } else {
      this.aggregations = this.cachedAggregations.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
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
    const cachedValues: GetResourceByIdQueryResponse = getCachedValues(
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
   * Adds a new aggregation for the resource.
   */
  onAddAggregation(): void {
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.aggregationService
          .addAggregation(value, this.resource.id)
          .subscribe(({ data }: any) => {
            if (data.addAggregation) {
              this.aggregations = [...this.aggregations, data?.addAggregation];
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
  onEditAggregation(aggregation: Aggregation): void {
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        aggregation,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.aggregationService
          .editAggregation(aggregation, value, this.resource.id)
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
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.aggregationService
          .deleteAggregation(aggregation, this.resource.id)
          .subscribe(({ data }: any) => {
            if (data.deleteAggregation) {
              this.aggregations = this.aggregations.filter(
                (x: any) => x.id !== aggregation.id
              );
            }
          });
      }
    });
  }

  /**
   *
   * @param data
   * @param loading
   */
  private updateValues(data: GetResourceByIdQueryResponse, loading: boolean) {
    if (data.resource) {
      this.cachedAggregations = updateQueryUniqueValues(
        this.cachedAggregations,
        data.resource.aggregations?.edges.map((x) => x.node) ?? []
      );
      this.aggregations = this.cachedAggregations.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = data.resource.aggregations?.totalCount || 0;
      this.pageInfo.endCursor =
        data.resource.aggregations?.pageInfo.endCursor || '';
    }
    this.loading = loading;
  }
}
