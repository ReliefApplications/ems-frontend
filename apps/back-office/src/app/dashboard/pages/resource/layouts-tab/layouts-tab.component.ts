import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Layout,
  SafeGridLayoutService,
  SafeConfirmService,
  Resource,
  SafeUnsubscribeComponent,
  ResourceQueryResponse,
} from '@oort-front/safe';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../../utils/update-queries';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { UIPageChangeEvent, handleTablePageEvent } from '@oort-front/ui';
import { GET_RESOURCE_LAYOUTS } from './graphql/queries';

/**
 * Layouts tab of resource page
 */
@Component({
  selector: 'app-layouts-tab',
  templateUrl: './layouts-tab.component.html',
  styleUrls: ['./layouts-tab.component.scss'],
})
export class LayoutsTabComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public resource!: Resource;
  public layouts: Layout[] = [];
  public loading = true;

  public displayedColumnsLayouts: string[] = ['name', 'createdAt', '_actions'];

  // ==== PAGINATION ====
  private layoutsQuery!: QueryRef<ResourceQueryResponse>;
  private cachedLayouts: Layout[] = [];
  public pageInfo = {
    pageIndex: 0,
    pageSize: 10,
    length: 0,
    endCursor: '',
  };

  /** @returns True if the layouts tab is empty */
  get empty(): boolean {
    return !this.loading && this.layouts.length === 0;
  }

  /**
   * Layouts tab of resource page
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param gridLayoutService Grid layout service
   * @param confirmService Confirm service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private gridLayoutService: SafeGridLayoutService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    const state = history.state;
    this.resource = get(state, 'resource', null);

    this.layoutsQuery = this.apollo.watchQuery<ResourceQueryResponse>({
      query: GET_RESOURCE_LAYOUTS,
      variables: {
        id: this.resource?.id,
        first: this.pageInfo.pageSize,
        afterCursor: this.pageInfo.endCursor,
      },
    });

    this.layoutsQuery.valueChanges.subscribe(({ data, loading }) => {
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
      this.cachedLayouts
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.layouts = cachedData;
    } else {
      this.fetchLayouts();
    }
  }

  /**
   * Fetches layouts from resource.
   *
   */
  private fetchLayouts(): void {
    this.loading = true;
    const variables = {
      id: this.resource.id,
      first: this.pageInfo.pageSize,
      afterCursor: this.pageInfo.endCursor,
    };
    const cachedValues: ResourceQueryResponse = getCachedValues(
      this.apollo.client,
      GET_RESOURCE_LAYOUTS,
      variables
    );
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      this.layoutsQuery
        .fetchMore({
          variables,
        })
        .then((results) => this.updateValues(results.data, results.loading));
    }
  }

  /**
   * Adds a new layout for the resource.
   */
  async onAddLayout(): Promise<void> {
    const { SafeEditLayoutModalComponent } = await import('@oort-front/safe');
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        queryName: this.resource.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.gridLayoutService
          .addLayout(value, this.resource.id)
          .subscribe(({ data }: any) => {
            if (data.addLayout) {
              this.layouts = [...this.layouts, data?.addLayout];
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
  async onEditLayout(layout: Layout): Promise<void> {
    const { SafeEditLayoutModalComponent } = await import('@oort-front/safe');
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout,
        queryName: this.resource.queryName,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.gridLayoutService
          .editLayout(layout, value, this.resource.id)
          .subscribe(({ data }: any) => {
            if (data.editLayout) {
              this.layouts = this.layouts.map((x: any) => {
                if (x.id === layout.id) {
                  return data.editLayout;
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
    const dialogRef = this.confirmService.openConfirmModal({
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
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.gridLayoutService
          .deleteLayout(layout, this.resource.id)
          .subscribe(({ data }: any) => {
            if (data.deleteLayout) {
              this.layouts = this.layouts.filter(
                (x: any) => x.id !== layout.id
              );
            }
          });
      }
    });
  }

  /**
   * Update layout data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: ResourceQueryResponse, loading: boolean) {
    if (data.resource) {
      const mappedValues =
        data.resource.layouts?.edges.map((x) => x.node) ?? [];
      this.cachedLayouts = updateQueryUniqueValues(
        this.cachedLayouts,
        mappedValues
      );
      this.pageInfo.length = data.resource.layouts?.totalCount || 0;
      this.pageInfo.endCursor = data.resource.layouts?.pageInfo.endCursor || '';
      this.layouts = this.cachedLayouts.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.loading = loading;
  }
}
