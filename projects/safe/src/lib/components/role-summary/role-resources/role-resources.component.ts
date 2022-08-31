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
import { SafeSnackBarService } from '../../../services/snackbar.service';
import {
  GetResourceQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCE,
  GET_RESOURCES,
} from '../graphql/queries';
import {
  EditResourceAccessMutationResponse,
  EDIT_RESOURCE_FIELD_PERMISSION,
  EDIT_RESOURCE_ACCESS,
  EditResourceFieldPermissionMutationResponse,
} from '../graphql/mutations';
import { SafeRoleResourceFiltersComponent } from './resource-access-filters/resource-access-filters.component';
import { MatDialog } from '@angular/material/dialog';
import { Permission, ResourceRolePermissions } from './permissions.types';

/** Default page size  */
const DEFAULT_PAGE_SIZE = 10;

/** Interface of table elements */
interface TableResourceElement {
  resource: Resource;
  permissions: {
    name: string;
    icon: string;
    variant: string;
    tooltip: string;
  }[];
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
  @Input() role!: Role; // Opened role

  // === TABLE ELEMENTS ===
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public displayedColumns: string[] = ['name', 'actions'];
  public resources = new MatTableDataSource<TableResourceElement>([]);
  public cachedResources: Resource[] = [];

  // === SINGLE ELEMENT ===
  public updating = false; // Update of resource
  public openedResource?: Resource;

  // === FILTERING ===
  public filter: any;
  public filterLoading = false;

  // === PAGINATION ===
  public loading = true; // First load && pagination
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
      query: GET_RESOURCES,
      variables: {
        first: DEFAULT_PAGE_SIZE,
        sortField: 'name',
        sortOrder: 'asc',
        role: this.role.id,
      },
    });

    this.resourcesQuery.valueChanges.subscribe((res) => {
      this.cachedResources = res.data.resources.edges.map((x) => x.node);
      this.resources.data = this.setTableElements(
        this.cachedResources.slice(
          this.pageInfo.pageSize * this.pageInfo.pageIndex,
          this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
        )
      );
      this.pageInfo.length = res.data.resources.totalCount;
      this.pageInfo.endCursor = res.data.resources.pageInfo.endCursor;
      this.loading = res.loading;
      this.updating = res.loading;
      this.filterLoading = false;
    });
  }

  /**
   * Serialize single table element from resource
   *
   * @param resource resource to serialize
   * @returns serialized element
   */
  private setTableElement(resource: Resource): TableResourceElement {
    return {
      resource,
      permissions: [
        Permission.SEE,
        Permission.CREATE,
        Permission.UPDATE,
        Permission.DELETE,
      ].map((x) => ({
        name: x,
        icon: this.getIcon(resource, x),
        variant: this.getVariant(resource, x),
        tooltip: this.getTooltip(resource, x),
      })),
    };
  }

  /**
   * Serialize list of table elements from resource
   *
   * @param resources resources to serialize
   * @returns serialized elements
   */
  private setTableElements(resources: Resource[]): TableResourceElement[] {
    return resources.map((x: Resource) => this.setTableElement(x));
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
      this.resources.data = this.setTableElements(
        this.cachedResources.slice(
          e.pageSize * this.pageInfo.pageIndex,
          e.pageSize * (this.pageInfo.pageIndex + 1)
        )
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
    if (resource.id === this.openedResource?.id) {
      this.openedResource = undefined;
    } else {
      this.updating = true;
      this.apollo
        .query<GetResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resource.id,
            role: this.role.id,
          },
        })
        .subscribe((res) => {
          if (res.data.resource) {
            this.openedResource = res.data.resource;
          }
          this.updating = false;
        });
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
   * Edit the specified resource permissions array
   *
   * @param resource the resource object to be updated
   * @param permission the permission to be edited
   */
  onEditAccess(resource: Resource, permission: Permission): void {
    if (!this.role.id) return;

    // this.updating = true;
    // const updatedPermissions: {
    //   add?: string[] | { role: string }[];
    //   remove?: string[] | { role: string }[];
    // } = {};
    // console.log(resource);
    // console.log(has(resource, `rolePermissions.${permission}`));
    // console.log(`rolePermissions.${permission}`);
    // const hasCurrPermission = has(resource, `rolePermissions.${permission}`);
    // Object.assign(updatedPermissions, {
    //   [hasCurrPermission ? 'remove' : 'add']: [{ role: this.role.id }],
    // });

    // this.apollo
    //   .mutate<EditResourceAccessMutationResponse>({
    //     mutation: EDIT_RESOURCE_ACCESS,
    //     variables: {
    //       id: resource.id,
    //       permissions: {
    //         [permission]: updatedPermissions,
    //       },
    //       role: this.role.id,
    //     },
    //   })
    //   .subscribe(
    //     (res) => {
    //       if (res.data?.editResource) {
    //         const index = this.resources.data.findIndex(
    //           (x) => x.id === resource.id
    //         );
    //         const resources = [...this.resources.data];
    //         resources[index] = res.data?.editResource;
    //         this.resources.data = resources;
    //         this.resourcesPermissions = resources.map((f) => {
    //           const permissions: ResourceRolePermissions = {
    //             canSeeRecords: [],
    //             canCreateRecords: [],
    //             canUpdateRecords: [],
    //             canDeleteRecords: [],
    //           };
    //           for (const p of this.permissionTypes) {
    //             permissions[p] = get(f, `permissions.${p}`, [])
    //               .filter((x: any) => {
    //                 switch (p) {
    //                   case Permission.CREATE:
    //                     return x.id === this.role.id;
    //                   default:
    //                     return x.role === this.role.id;
    //                 }
    //               })
    //               .map((x: any) => {
    //                 const roleId = p === Permission.CREATE ? x.id : x.role;
    //                 return { role: roleId, access: x.access };
    //               });
    //           }
    //           return {
    //             form: f.id,
    //             permissions,
    //           };
    //         });
    //       }
    //       this.updating = false;
    //     },
    //     (err) => {
    //       this.snackBar.openSnackBar(err.message, { error: true });
    //       this.updating = false;
    //     }
    //   );
  }

  /**
   * Edits the specified field permissions array
   *
   * @param resource the resource containing the field to be updated
   * @param field the field to be edited
   * @param field.name the name of the field to be edited
   * @param field.canSee whether the field can be seen
   * @param field.canUpdate whether the field can be edited
   * @param action the permission to be edited
   */
  onEditFieldAccess(
    resource: Resource,
    field: { name: string; canSee: boolean; canUpdate: boolean },
    action: 'canSee' | 'canUpdate'
  ): void {
    if (!this.role.id) return;

    // this.updating = true;
    // const updatedPermissions: {
    //   add?: { field: string; role: string };
    //   remove?: { field: string; role: string };
    // } = {};

    // if (field[action]) {
    //   Object.assign(updatedPermissions, {
    //     remove: { field: field.name, role: this.role.id },
    //   });
    // } else
    //   Object.assign(updatedPermissions, {
    //     add: { field: field.name, role: this.role.id },
    //   });

    // this.apollo
    //   .mutate<EditResourceFieldPermissionMutationResponse>({
    //     mutation: EDIT_RESOURCE_FIELD_PERMISSION,
    //     variables: {
    //       id: resource.id,
    //       fieldsPermissions: {
    //         [action]: updatedPermissions,
    //       },
    //     },
    //   })
    //   .subscribe(
    //     (res) => {
    //       if (res.data) {
    //         const editedResource = this.resources.data.find(
    //           (r) => r.id === resource.id
    //         );
    //         this.updating = false;
    //         if (!editedResource) return;
    //         editedResource.fields = res.data.editResource.fields;
    //       }
    //     },
    //     (err) => {
    //       this.snackBar.openSnackBar(err.message, { error: true });
    //       this.updating = false;
    //     }
    //   );
  }

  /**
   * Gets the correspondent icon for a given permission
   *
   * @param resource A resource
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getIcon(resource: Resource, permission: Permission) {
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
   * @param resource A resource
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getVariant(resource: Resource, permission: Permission) {
    const hasPermission = has(resource, `rolePermissions.${permission}`);
    return hasPermission ? 'primary' : 'grey';
  }
  /**
   * Gets the correspondent tooltip for a given permission
   *
   * @param resource A resource
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getTooltip(resource: Resource, permission: Permission) {
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

  // rolePermissions(id: string | undefined) {
  //   return this.resourcesPermissions.find((x) => x.resource === id)
  //     ?.permissions;
  // }

  /**
   * Opens a modal where the user can set access filters for a given resource
   *
   * @param resource The selected resource
   */
  // openAccessFilters(resource: Resource): void {
  //   const initPerm = this.resourcesPermissions.find(
  //     (x) => x.resource === resource.id
  //   );
  //   const dialogRef = this.dialog.open(SafeRoleResourceFiltersComponent, {
  //     data: {
  //       resource,
  //       permissions: initPerm?.permissions,
  //       role: this.role.id,
  //     },
  //     panelClass: 'resource-access-dialog',
  //   });
  //   dialogRef.afterClosed().subscribe((changes) => {
  //     if (!changes) return;
  //     this.apollo
  //       .mutate<EditResourceAccessMutationResponse>({
  //         mutation: EDIT_RESOURCE_ACCESS,
  //         variables: changes,
  //       })
  //       .subscribe(
  //         (res) => {
  //           if (res.data) {
  //             const index = this.resources.data.findIndex(
  //               (x) => x.id === res.data?.editResource.id
  //             );
  //             const resources = [...this.resources.data];
  //             resources[index] = {
  //               ...resources[index],
  //               ...res.data.editResource,
  //             };
  //             this.resources.data = resources;
  //             this.resourcesPermissions = this.resources.data.map((r) => {
  //               const permissions: ResourceRolePermissions = {
  //                 canSeeRecords: [],
  //                 canCreateRecords: [],
  //                 canUpdateRecords: [],
  //                 canDeleteRecords: [],
  //               };
  //               for (const permission of this.permissionTypes) {
  //                 permissions[permission] = get(
  //                   r,
  //                   `permissions.${permission}`,
  //                   []
  //                 )
  //                   .filter((x: any) => {
  //                     switch (permission) {
  //                       case Permission.CREATE:
  //                         return x.id === this.role.id;
  //                       default:
  //                         return x.role === this.role.id;
  //                     }
  //                   })
  //                   .map((x: any) => {
  //                     const roleId =
  //                       permission === Permission.CREATE ? x.id : x.role;
  //                     return { role: roleId, access: x.access };
  //                   });
  //               }
  //               return {
  //                 resource: r.id,
  //                 permissions,
  //               };
  //             });
  //           }
  //           this.updating = false;
  //         },
  //         (err) => {
  //           this.snackBar.openSnackBar(err.message, { error: true });
  //           this.updating = false;
  //         }
  //       );
  //   });
  // }
}
