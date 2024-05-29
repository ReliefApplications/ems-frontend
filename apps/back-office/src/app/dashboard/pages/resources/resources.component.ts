import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { DELETE_RESOURCE, ADD_FORM } from './graphql/mutations';
import { GET_RESOURCES_EXTENDED } from './graphql/queries';
import {
  AddFormMutationResponse,
  DeleteResourceMutationResponse,
  Resource,
  ConfirmService,
  UnsubscribeComponent,
  ResourcesQueryResponse,
  getCachedValues,
  updateQueryUniqueValues,
} from '@oort-front/shared';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  TableSort,
  UIPageChangeEvent,
  handleTablePageEvent,
} from '@oort-front/ui';
import { SnackbarService } from '@oort-front/ui';
import { takeUntil } from 'rxjs';

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
export class ResourcesComponent extends UnsubscribeComponent implements OnInit {
  // === DATA ===
  /**
   * Loading state
   */
  public loading = true;
  /**
   * Filter loading state
   */
  public filterLoading = false;
  /**
   * Resources query
   */
  private resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  /**
   * Columns to display
   */
  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount', 'actions'];
  /**
   * Cached resources
   */
  public cachedResources: Resource[] = [];
  /**
   * Resources list
   */
  public resources = new Array<Resource>();

  // === SORTING ===
  /**
   * Sorting state
   */
  public updating = false;
  /**
   * Sort state
   */
  private sort: TableSort = { active: '', sortDirection: '' };

  // === FILTERING ===
  /**
   * Filter state
   */
  public filter: any = {
    filters: [],
    logic: 'and',
  };

  // === PAGINATION ===
  /**
   * Page info
   */
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
    private dialog: Dialog,
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private router: Router
  ) {
    super();
  }

  /** Load the resources. */
  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
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
  onPage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(
      e,
      this.pageInfo,
      this.cachedResources
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.resources = cachedData;
    } else {
      this.fetchResources();
    }
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
  onSort(event: TableSort): void {
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
        (this.sort?.sortDirection && this.sort.active) !== ''
          ? this.sort?.sortDirection && this.sort.active
          : 'name',
      sortOrder:
        this.sort?.sortDirection !== '' ? this.sort?.sortDirection : 'asc',
    };
    const cachedValues: ResourcesQueryResponse = getCachedValues(
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
      confirmVariant: 'danger',
    });

    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
              this.resources = this.resources.filter(
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
  async onAdd(): Promise<void> {
    const { AddResourceModalComponent } = await import(
      '../../../components/add-resource-modal/add-resource-modal.component'
    );
    const dialogRef = this.dialog.open(AddResourceModalComponent);
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
  updateValues(data: ResourcesQueryResponse, loading: boolean) {
    const mappedValues = data.resources?.edges?.map((x) => x.node);
    this.cachedResources = updateQueryUniqueValues(
      this.cachedResources,
      mappedValues
    );
    this.pageInfo.length = data.resources.totalCount;
    this.pageInfo.endCursor = data.resources.pageInfo.endCursor;
    this.loading = loading;
    this.updating = loading;
    this.resources = this.cachedResources.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.filterLoading = false;
  }
}
