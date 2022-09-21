import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  SafeEditLayoutModalComponent,
  Layout,
  SafeGridLayoutService,
  SafeConfirmModalComponent,
  Resource,
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import {
  GetResourceByIdQueryResponse,
  GET_RESOURCE_LAYOUTS,
} from './graphql/queries';

/**
 * Layouts tab of resource page
 */
@Component({
  selector: 'app-layouts-tab',
  templateUrl: './layouts-tab.component.html',
  styleUrls: ['./layouts-tab.component.scss'],
})
export class LayoutsTabComponent implements OnInit {
  public resource!: Resource;
  public layouts: Layout[] = [];
  public loading = true;

  public displayedColumnsLayouts: string[] = ['name', 'createdAt', '_actions'];

  // ==== PAGINATION ====
  private layoutsQuery!: QueryRef<GetResourceByIdQueryResponse>;
  private cachedLayouts: Layout[] = [];
  public pageInfo = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
    endCursor: '',
  };

  /**
   * Layouts tab of resource page
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param gridLayoutService Grid layout service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private gridLayoutService: SafeGridLayoutService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.layoutsQuery = this.apollo.watchQuery<GetResourceByIdQueryResponse>({
      query: GET_RESOURCE_LAYOUTS,
      variables: {
        id: this.resource.id,
      },
    });

    this.layoutsQuery.valueChanges.subscribe((res) => {
      this.loading = false;
      if (res.data.resource) {
        this.cachedLayouts =
          res.data.resource.layouts?.edges.map((e) => e.node) || [];
        this.layouts = this.cachedLayouts.slice(
          this.pageInfo.pageSize * this.pageInfo.pageIndex,
          this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
        );
        this.pageInfo.length = res.data.resource.layouts?.totalCount || 0;
        this.pageInfo.endCursor =
          res.data.resource.layouts?.pageInfo.endCursor || '';
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
      e.length > this.cachedLayouts.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.fetchLayouts();
    } else {
      this.layouts = this.cachedLayouts.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Fetches layouts from resource.
   *
   */
  private fetchLayouts(): void {
    this.loading = true;
    this.layoutsQuery.fetchMore({
      variables: {
        id: this.resource.id,
        first: this.pageInfo.pageSize,
        afterCursor: this.pageInfo.endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.resource.layouts || !prev.resource?.layouts) {
          return prev;
        }
        return {
          resource: {
            ...fetchMoreResult.resource,
            layouts: {
              edges: [
                ...prev.resource.layouts.edges,
                ...fetchMoreResult.resource.layouts.edges,
              ],
              pageInfo: fetchMoreResult.resource.layouts.pageInfo,
              totalCount: fetchMoreResult.resource.layouts.totalCount,
            },
          },
          loading: fetchMoreResult.loading,
        };
      },
    });
  }

  /**
   * Adds a new layout for the resource.
   */
  onAddLayout(): void {
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        queryName: this.resource.queryName,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .addLayout(value, this.resource.id)
          .subscribe((res: any) => {
            if (res.data.addLayout) {
              this.layouts = [...this.layouts, res.data?.addLayout];
            }
          });
      }
    });
  }

  /**
   * Edits a layout. Opens a popup for edition.
   *
   * @param layout Layout to edit
   */
  onEditLayout(layout: Layout): void {
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .editLayout(layout, value, this.resource.id)
          .subscribe((res: any) => {
            if (res.data.editLayout) {
              this.layouts = this.layouts.map((x: any) => {
                if (x.id === layout.id) {
                  return res.data.editLayout;
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
   * Deletes a layout.
   *
   * @param layout Layout to delete
   */
  onDeleteLayout(layout: Layout): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.layout.one'),
        }),
        content: this.translate.instant(
          'components.form.layout.delete.confirmationMessage',
          {
            name: layout.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.gridLayoutService
          .deleteLayout(layout, this.resource.id)
          .subscribe((res: any) => {
            if (res.data.deleteLayout) {
              this.layouts = this.layouts.filter(
                (x: any) => x.id !== layout.id
              );
            }
          });
      }
    });
  }
}
