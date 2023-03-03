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
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Sort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { AddResourceModalComponent } from '../../../components/add-resource-modal/add-resource-modal.component';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';

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
  public filter: any = {
    filters: [],
    logic: 'and',
  };

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
        afterCursor: null,
        filter: this.filter,
      },
    });

    this.resourcesQuery.valueChanges.subscribe(({ data, loading }) => {
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
        e.pageIndex * this.pageInfo.pageSize >= this.cachedResources.length) ||
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
      this.pageInfo.pageSize = first;
      this.loading = true;
      this.fetchResources();
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
    this.fetchResources(true, filter);
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
   * @param filter filter value
   */
  private fetchResources(refetch?: boolean, filter?: any): void {
    this.updating = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: filter ?? this.filter,
      sortField:
        (this.sort?.direction && this.sort.active) !== ''
          ? this.sort?.direction && this.sort.active
          : 'name',
      sortOrder: this.sort?.direction !== '' ? this.sort?.direction : 'asc',
    };
    const cachedValues: GetResourcesQueryResponse = getCachedValues(
      this.apollo.client,
      GET_RESOURCES_EXTENDED,
      variables
    );
    if (refetch) {
      this.cachedResources = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (refetch) {
        this.resourcesQuery.refetch(variables);
      } else {
        this.loading = true;
        this.resourcesQuery
          .fetchMore({
            variables,
          })
          .then((results) => this.updateValues(results.data, results.loading));
      }
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
          .subscribe(({ errors }) => {
            if (!errors) {
              this.resources.data = this.resources.data.filter(
                (x) => x.id !== resource.id
              );
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectDeleted', {
                  value: this.translate.instant('common.resource.one'),
                })
              );
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.objectNotDeleted',
                  {
                    value: this.translate.instant('common.resource.one'),
                    error: errors[0].message,
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
        const variablesData = { name: value.name };
        this.apollo
          .mutate<AddFormMutationResponse>({
            mutation: ADD_FORM,
            variables: variablesData,
          })
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate
                        .instant('common.form.one')
                        .toLowerCase(),
                      error: errors[0].message,
                    }
                  ),
                  { error: true }
                );
              } else {
                if (data) {
                  const { id } = data.addForm;
                  this.router.navigate(['/forms/builder', id]);
                }
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  /**
   * Update resource data value
   *
   * @param data query response data
   * @param loading loading status
   */
  updateValues(data: GetResourcesQueryResponse, loading: boolean) {
    this.cachedResources = updateQueryUniqueValues(
      this.cachedResources,
      data.resources.edges.map((x) => x.node)
    );
    this.resources.data = this.cachedResources.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.pageInfo.length = data.resources.totalCount;
    this.pageInfo.endCursor = data.resources.pageInfo.endCursor;
    this.loading = loading;
    this.updating = loading;
    this.filterLoading = false;
  }
}
