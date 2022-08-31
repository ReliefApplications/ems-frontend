import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, QueryRef } from 'apollo-angular';
import { get, has } from 'lodash';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Resource } from '../../../models/resource.model';
import { Role } from '../../../models/user.model';
import { Form } from '../../../models/form.model';
import { SafeSnackBarService } from '../../../services/snackbar.service';
import {
  GetResourcesQueryResponse,
  GET_RESOURCES_EXTENDED,
} from '../graphql/queries';
import {
  EditResourceAccessMutationResponse,
  EDIT_RESOURCE_ACCESS,
} from '../graphql/mutations';

/** Default page size  */
const DEFAULT_PAGE_SIZE = 10;

/** Permission type for Form */
enum Permission {
  SEE = 'canSeeRecords',
  CREATE = 'canCreateRecords',
  UPDATE = 'canUpdateRecords',
  DELETE = 'canDeleteRecords',
}

/**
 * Resource tab of Role Summary component.
 */
@Component({
  selector: 'safe-role-resources',
  templateUrl: './role-resources.component.html',
  styleUrls: ['./role-resources.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class RoleResourcesComponent implements OnInit {
  // === RESOURCES ===
  @Input() role!: Role;
  public loading = true;
  public updating = false;
  public resources = new MatTableDataSource<Resource>([]);
  public cachedResources: Resource[] = [];
  public openedResourceId = '';
  public displayedColumns: string[] = ['name', 'actions'];
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  // === FORMS ===
  public permissionTypes = [
    Permission.SEE,
    Permission.CREATE,
    Permission.UPDATE,
    Permission.DELETE,
  ];

  // === FILTERING ===
  public filter: any;
  public filterLoading = false;

  // === PAGINATION ===
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /**
   * Resource tab of Role Summary component.
   *
   * @param apollo Apollo client service
   * @param snackBar shared snackbar service
   */
  constructor(private apollo: Apollo, private snackBar: SafeSnackBarService) {}

  /** Load the resources. */
  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED,
      variables: {
        first: DEFAULT_PAGE_SIZE,
        sortField: 'name',
        sortOrder: 'asc',
        role: this.role.id,
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
      this.pageInfo.pageSize = first;
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
   * Toggles the accordion for the clicked resource and fetches its forms
   *
   * @param resource The resource element for the resource to be toggled
   */
  toggleResource(resource: Resource): void {
    // this.forms = [];
    // if (resource.id === this.openedResourceId) {
    //   this.openedResourceId = '';
    // } else {
    //   this.loadingForms = true;
    //   this.openedResourceId = resource.id as string;
    //   this.apollo
    //     .query<GetResourceFormsQueryResponse>({
    //       query: GET_RESOURCE_FORMS,
    //       variables: {
    //         resource: resource.id,
    //       },
    //     })
    //     .subscribe(
    //       (res) => {
    //         if (res.data) {
    //           this.forms = get(res.data.resource, 'forms', []);
    //           for (const permission of this.permissionTypes) {
    //             this.formsPermissions[permission] = this.forms
    //               .filter((x) =>
    //                 get(x, `permissions.${permission}`, [])
    //                   .map((y: any) => y.role || y.id)
    //                   .includes(this.role.id)
    //               )
    //               .map((x) => x.id as string);
    //           }
    //         }
    //         this.loadingForms = false;
    //       },
    //       (err) => {
    //         this.snackBar.openSnackBar(err.message, { error: true });
    //       }
    //     );
    // }
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
   * Edits the specified resource permissions array
   *
   * @param permission the permission to be edited
   * @param resource the resource object to be updated
   */
  onEditAccess(permission: Permission, resource: Resource): void {
    if (!this.role.id) return;

    this.updating = true;
    const updatedPermissions: {
      add?: string[] | { role: string }[];
      remove?: string[] | { role: string }[];
    } = {};

    const hasCurrPermission = has(resource, `rolePermission.${permission}`);
    Object.assign(updatedPermissions, {
      [hasCurrPermission ? 'remove' : 'add']: [{ role: this.role.id }],
    });

    this.apollo
      .mutate<EditResourceAccessMutationResponse>({
        mutation: EDIT_RESOURCE_ACCESS,
        variables: {
          id: resource.id,
          permissions: {
            [permission]: updatedPermissions,
          },
          role: this.role.id,
        },
      })
      .subscribe(
        (res) => {
          if (res.data?.editResource) {
            const index = this.resources.data.findIndex(
              (x) => x.id === resource.id
            );
            const resources = [...this.resources.data];
            resources[index] = res.data?.editResource;
            this.resources.data = resources;
          }
          this.updating = false;
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.updating = false;
        }
      );
  }

  /**
   * Gets the correspondent icon for a given permission
   *
   * @param permission The permission name
   * @param resource A resource
   * @returns the name of the icon to be displayed
   */
  getIcon(permission: Permission, resource: Resource) {
    const hasPermission = has(resource, `rolePermissions.${permission}`);
    switch (permission) {
      case Permission.SEE:
        return hasPermission ? 'visibility' : 'visibility_off';
      case Permission.CREATE:
        return 'add';
      case Permission.UPDATE:
        return hasPermission ? 'edit' : 'edit_off';
      case Permission.DELETE:
        return 'delete';
    }
  }

  /**
   * Gets the correspondent variant for a given permission
   *
   * @param permission The permission name
   * @param resource A resource
   * @returns the name of the icon to be displayed
   */
  getVariant(permission: Permission, resource: Resource) {
    const hasPermission = has(resource, `rolePermissions.${permission}`);
    return hasPermission ? 'primary' : 'grey';
  }
  /**
   * Gets the correspondent tooltip for a given permission
   *
   * @param permission The permission name
   * @param resource A resource
   * @returns the name of the icon to be displayed
   */
  getTooltip(permission: Permission, resource: Resource) {
    const hasPermission = has(resource, `rolePermissions.${permission}`);
    switch (permission) {
      case Permission.SEE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordAccessibility'
          : 'components.role.tooltip.allowRecordAccessibility';
      case Permission.CREATE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordCreation'
          : 'components.role.tooltip.allowRecordCreation';
      case Permission.UPDATE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordUpdate'
          : 'components.role.tooltip.allowRecordUpdate';
      case Permission.DELETE:
        return hasPermission
          ? 'components.role.tooltip.disallowRecordDeletion'
          : 'components.role.tooltip.allowRecordDeletion';
    }
  }
}
