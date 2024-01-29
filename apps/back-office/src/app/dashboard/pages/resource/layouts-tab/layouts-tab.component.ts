import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Layout,
  GridLayoutService,
  ConfirmService,
  Resource,
  UnsubscribeComponent,
  ResourceQueryResponse,
  getCachedValues,
  updateQueryUniqueValues,
} from '@oort-front/shared';
import { Apollo, QueryRef } from 'apollo-angular';
import get from 'lodash/get';
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
  extends UnsubscribeComponent
  implements OnInit
{
  /**
   * Resource
   */
  public resource!: Resource;
  /**
   * Layouts
   */
  public layouts: Layout[] = [];
  /**
   * Loading state
   */
  public loading = true;

  /**
   * Columns to display
   */
  public displayedColumnsLayouts: string[] = ['name', 'createdAt', '_actions'];

  // ==== PAGINATION ====
  /**
   * Layouts query
   */
  private layoutsQuery!: QueryRef<ResourceQueryResponse>;
  /**
   * Cached layouts
   */
  private cachedLayouts: Layout[] = [];
  /**
   * Page info
   */
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
    private gridLayoutService: GridLayoutService,
    private confirmService: ConfirmService,
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
   * Handle action from the data list presentation component
   *
   * @param action action containing action type and layout item if exists
   * @param action.type type of action, add, edit, delete
   * @param action.item layout item for the given action type
   */
  handleAction(action: {
    type: 'add' | 'edit' | 'delete';
    item?: Layout | null;
  }) {
    if (action.type === 'add') {
      this.onAddLayout();
    } else if (action.type === 'edit') {
      this.onEditLayout(action.item as Layout);
    } else if (action.type === 'delete') {
      this.onDeleteLayout(action.item as Layout);
    }
  }

  /**
   * Adds a new layout for the resource.
   */
  async onAddLayout(): Promise<void> {
    const { EditLayoutModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
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
              this.pageInfo.length += 1;
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
    const { EditLayoutModalComponent } = await import('@oort-front/shared');
    const dialogRef = this.dialog.open(EditLayoutModalComponent, {
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
              this.pageInfo.length -= 1;
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
