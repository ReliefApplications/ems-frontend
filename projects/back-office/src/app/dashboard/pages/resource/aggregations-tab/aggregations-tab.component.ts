import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
          id: this.resource.id,
        },
      });

    this.aggregationsQuery.valueChanges.subscribe((res) => {
      this.loading = false;
      if (res.data.resource) {
        this.cachedAggregations =
          res.data.resource.aggregations?.edges.map((e) => e.node) || [];
        this.aggregations = this.cachedAggregations.slice(
          this.pageInfo.pageSize * this.pageInfo.pageIndex,
          this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = res.data.resource.aggregations?.totalCount || 0;
        this.pageInfo.endCursor =
          res.data.resource.aggregations?.pageInfo.endCursor || '';
      }
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
      (e.pageIndex > e.previousPageIndex ||
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
    this.aggregationsQuery.fetchMore({
      variables: {
        id: this.resource.id,
        first: this.pageInfo.pageSize,
        afterCursor: this.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult?.resource.aggregations ||
          !prev.resource?.aggregations
        ) {
          return prev;
        }
        return {
          resource: {
            ...fetchMoreResult.resource,
            aggregations: {
              edges: [
                ...prev.resource.aggregations.edges,
                ...fetchMoreResult.resource.aggregations.edges,
              ],
              pageInfo: fetchMoreResult.resource.aggregations.pageInfo,
              totalCount: fetchMoreResult.resource.aggregations.totalCount,
            },
          },
          loading: fetchMoreResult.loading,
        };
      },
    });
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
          .subscribe((res: any) => {
            if (res.data.addAggregation) {
              this.aggregations = [
                ...this.aggregations,
                res.data?.addAggregation,
              ];
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
          .subscribe((res: any) => {
            if (res.data.editAggregation) {
              this.aggregations = this.aggregations.map((x: any) => {
                if (x.id === aggregation.id) {
                  return res.data.editAggregation;
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
          .subscribe((res: any) => {
            if (res.data.deleteAggregation) {
              this.aggregations = this.aggregations.filter(
                (x: any) => x.id !== aggregation.id
              );
            }
          });
      }
    });
  }
}
