import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import {
  DeleteResourceMutationResponse,
  DELETE_RESOURCE,
  AddFormMutationResponse,
  ADD_FORM,
} from './graphql/mutations';
import {
  GetResourcesQueryResponse,
  GET_RESOURCES_EXTENDED,
} from './graphql/queries';
import {
  Resource,
  SafeConfirmService,
  SafeSnackBarService,
} from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { AddResourceModalComponent } from '../../../components/add-resource-modal/add-resource-modal.component';

/**
 * Default number of resources that will be shown at once.
 */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Component which will show all the resources in the app.
 */
@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
})
export class ResourcesComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public filterLoading = false;
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount', 'actions'];
  public cachedResources: Resource[] = [];
  public resources = new MatTableDataSource<Resource>([]);

  // === SORTING ===
  public updating = false;
  private sort: Sort = { active: '', direction: '' };

  // === FILTERING ===
  public filter: any;

  // === PAGINATION ===
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /**
   * ResourcesComponent constructor.
   *
   * @param dialog Used for opening a dialog.
   * @param apollo Used for loading the resources.
   * @param snackBar Service used to show the snackbar,
   * @param confirmService Service used to show the confirmation window
   * @param translate Service used to get translations
   * @param router Used to change the app route.
   */
  constructor(
    private dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private router: Router
  ) {}

  /** Load the resources. */
  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED,
      variables: {
        first: DEFAULT_PAGE_SIZE,
        sortField: 'name',
        sortOrder: 'asc',
      },
    });

    this.resourcesQuery.valueChanges.subscribe((res) => {
      this.cachedResources = res.data.resources.edges.map((x) => x.node);
      this.resources.data = this.cachedResources.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = res.data.resources.totalCount;
      this.pageInfo.endCursor = res.data.resources.pageInfo.endCursor;
      this.loading = res.loading;
      this.updating = res.loading;
      this.filterLoading = false;
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
      e.length > this.cachedResources.length
    ) {
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.loading = true;
      this.resourcesQuery.fetchMore({
        variables: {
          first: this.pageInfo.pageSize,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            resources: {
              edges: [
                ...prev.resources.edges,
                ...fetchMoreResult.resources.edges,
              ],
              pageInfo: fetchMoreResult.resources.pageInfo,
              totalCount: fetchMoreResult.resources.totalCount,
            },
          });
        },
      });
    } else {
      this.resources.data = this.cachedResources.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Filters applications and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filterLoading = true;
    this.filter = filter;
    this.cachedResources = [];
    this.pageInfo.pageIndex = 0;
    this.resourcesQuery.fetchMore({
      variables: {
        first: this.pageInfo.pageSize,
        filter: this.filter,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          resources: {
            edges: fetchMoreResult.resources.edges,
            pageInfo: fetchMoreResult.resources.pageInfo,
            totalCount: fetchMoreResult.resources.totalCount,
          },
        });
      },
    });
  }

  /**
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: Sort): void {
    this.sort = event;
    this.fetchResources(true);
  }

  /**
   * Update resources query.
   *
   * @param refetch erase previous query results
   */
  private fetchResources(refetch?: boolean): void {
    this.updating = true;
    if (refetch) {
      this.cachedResources = [];
      this.pageInfo.pageIndex = 0;
      this.resourcesQuery
        .refetch({
          first: this.pageInfo.pageSize,
          afterCursor: null,
          filter: this.filter,
          sortField: this.sort?.direction && this.sort.active,
          sortOrder: this.sort?.direction,
        })
        .then(() => {
          this.loading = false;
          this.updating = false;
        });
    } else {
      this.loading = true;
      this.resourcesQuery.fetchMore({
        variables: {
          first: this.pageInfo.pageSize,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter,
          sortField: this.sort?.direction && this.sort.active,
          sortOrder: this.sort?.direction,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            resources: {
              edges: [
                ...prev.resources.edges,
                ...fetchMoreResult.resources.edges,
              ],
              pageInfo: fetchMoreResult.resources.pageInfo,
              totalCount: fetchMoreResult.resources.totalCount,
            },
          });
        },
      });
    }
  }

  /**
   * Removes a resource.
   *
   * @param resource Resource to delete.
   */
  onDelete(resource: Resource): void {
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.resource.one'),
      }),
      content: this.translate.instant(
        'components.resource.delete.confirmationMessage',
        {
          name: resource.name,
        }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmColor: 'warn',
    });

    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.apollo
          .mutate<DeleteResourceMutationResponse>({
            mutation: DELETE_RESOURCE,
            variables: {
              id: resource.id,
            },
          })
          .subscribe((res) => {
            if (!res.errors) {
              this.resources.data = this.resources.data.filter(
                (x) => x.id !== resource.id
              );
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: this.translate
                    .instant('common.resource.one')
                    .toLowerCase(),
                })
              );
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: this.translate
                      .instant('common.resource.one')
                      .toLowerCase(),
                    error: res.errors[0].message,
                  }
                ),
                { error: true }
              );
            }
          });
      }
    });
  }

  /**
   * Displays the AddForm modal.
   * Creates a new form on closed if result.
   */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddResourceModalComponent);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const data = { name: value.name };
        this.apollo
          .mutate<AddFormMutationResponse>({
            mutation: ADD_FORM,
            variables: data,
          })
          .subscribe(
            (res) => {
              if (res.errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate
                        .instant('common.form.one')
                        .toLowerCase(),
                      error: res.errors[0].message,
                    }
                  ),
                  { error: true }
                );
              } else {
                if (res.data) {
                  const { id } = res.data.addForm;
                  this.router.navigate(['/forms/builder', id]);
                }
              }
            },
            (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            }
          );
      }
    });
  }
}
