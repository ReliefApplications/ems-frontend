import { Component, Input, OnInit } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { get, isEqual } from 'lodash';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  EditResourceMutationResponse,
  Resource,
  ResourceQueryResponse,
  ResourcesQueryResponse,
} from '../../../models/resource.model';
import { Role } from '../../../models/user.model';
import { GET_RESOURCE, GET_RESOURCES } from '../graphql/queries';
import {
  EDIT_RESOURCE_FIELD_PERMISSION,
  EDIT_RESOURCE_ACCESS,
} from '../graphql/mutations';
import { Permission } from './permissions.types';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { updateQueryUniqueValues } from '../../../utils/update-queries';
import {
  SnackbarService,
  UIPageChangeEvent,
  handleTablePageEvent,
} from '@oort-front/ui';
import { errorMessageFormatter } from '../../../utils/graphql/error-handler';

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
  selector: 'shared-role-resources',
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
export class RoleResourcesComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Role to display */
  @Input() role!: Role; // Opened role

  // === TABLE ELEMENTS ===
  /** Resources query */
  private resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  /** Displayed columns */
  public displayedColumns: string[] = ['name', 'actions'];
  /** Resources */
  public resources = new Array<TableResourceElement>();
  /** Cached resources */
  public cachedResources: Resource[] = [];

  // === SINGLE ELEMENT ===
  /** Updating status */
  public updating = false; // Update of resource
  /** Opened resource */
  public openedResource?: Resource;

  // === FILTERING ===
  /** Filter */
  public filter: any;
  /** Filter loading */
  public filterLoading = false;

  // === PAGINATION ===
  /** Loading status */
  public loading = true; // First load && pagination
  /** Page info */
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
  constructor(private apollo: Apollo, private snackBar: SnackbarService) {
    super();
  }

  /** Load the resources. */
  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: DEFAULT_PAGE_SIZE,
        sortField: 'name',
        sortOrder: 'asc',
        role: this.role.id,
      },
    });

    this.resourcesQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.updateValues(data, loading);
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
        isOutlined: this.getIconOutlined(resource, x),
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
  onPage(e: UIPageChangeEvent): void {
    const cachedData = handleTablePageEvent(
      e,
      this.pageInfo,
      this.cachedResources
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.resources = this.resources = this.setTableElements(cachedData);
    } else {
      this.fetchResources();
    }
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
      this.resourcesQuery.refetch({
        first: this.pageInfo.pageSize,
        filter: this.filter,
        afterCursor: null,
      });
    } else {
      this.loading = true;
      this.resourcesQuery
        .fetchMore({
          variables: {
            first: this.pageInfo.pageSize,
            filter: this.filter,
            afterCursor: this.pageInfo.endCursor,
          },
        })
        .then((results) => this.updateValues(results.data, results.loading));
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
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resource.id,
            role: this.role.id,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          if (data.resource) {
            this.openedResource = data.resource;
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
    this.fetchResources(true);
  }

  /**
   * Edit the specified resource permissions array
   *
   * @param resource the resource object to be updated
   * @param permission the permission to be edited
   */
  editResourceAccess(resource: Resource, permission: Permission): void {
    this.updating = true;
    const updatedPermissions: {
      add?: string[] | { role: string }[];
      remove?: string[] | { role: string }[];
    } = {};
    const permissionLevel = this.permissionLevel(resource, permission);
    switch (permissionLevel) {
      case 'full': {
        Object.assign(updatedPermissions, {
          remove: [{ role: this.role.id }],
        });
        break;
      }
      case 'limited': {
        Object.assign(updatedPermissions, {
          add: [{ role: this.role.id }],
        });
        break;
      }
      case false: {
        Object.assign(updatedPermissions, {
          add: [{ role: this.role.id }],
        });
        break;
      }
      default: {
        return;
      }
    }

    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE_ACCESS,
        variables: {
          id: resource.id,
          permissions: {
            [permission]: updatedPermissions,
          },
          role: this.role.id as string,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.handleResourceMutationResponse(
            resource,
            { data, errors: [] },
            true
          );
          this.updating = false;
        },
        error: (errors) => {
          this.handleResourceMutationResponse(
            resource,
            { data: null, errors },
            true
          );
          this.updating = false;
        },
      });
  }

  /**
   * Edit resource access filter
   *
   * @param resource resource to update
   * @param update update to perform
   */
  editResourceAccessFilter(resource: Resource, update: any): void {
    this.updating = true;
    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE_ACCESS,
        variables: {
          id: resource.id,
          permissions: update,
          role: this.role.id as string,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.handleResourceMutationResponse(resource, { data, errors: [] });
          this.updating = false;
        },
        error: (errors) => {
          this.handleResourceMutationResponse(resource, { data: null, errors });
          this.updating = false;
        },
      });
  }

  /**
   * Handle snackbar and resource table element update for any given graphql mutation in resource
   *
   * @param resource given resource
   * @param response mutation response
   * @param response.data data from mutation response
   * @param response.errors errors from mutation response
   * @param updateCachedResources boolean to trigger if cached resources array should be updated or not, default value false
   */
  private handleResourceMutationResponse(
    resource: any,
    response: { data: any; errors: any },
    updateCachedResources = false
  ) {
    const { data, errors } = response;
    if (data?.editResource) {
      const index = this.resources.findIndex(
        (x) => x.resource.id === resource.id
      );
      const tableElements = [...this.resources];
      tableElements[index] = this.setTableElement(
        isEqual(resource.id, this.openedResource?.id)
          ? { ...this.openedResource, ...data?.editResource }
          : data?.editResource
      );
      this.resources = tableElements;
      if (updateCachedResources) {
        const cachedIndex = this.cachedResources.findIndex(
          (x) => x.id === resource.id
        );
        this.cachedResources[cachedIndex] = tableElements[index].resource;
      }
      if (isEqual(resource.id, this.openedResource?.id)) {
        this.openedResource = tableElements[index].resource;
      }
    }
    if (errors?.length) {
      this.snackBar.openSnackBar(errorMessageFormatter(errors), {
        error: true,
      });
    }
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

    this.updating = true;
    const updatedPermissions: {
      add?: { field: string; role: string };
      remove?: { field: string; role: string };
    } = {};

    if (field[action]) {
      Object.assign(updatedPermissions, {
        remove: { field: field.name, role: this.role.id },
      });
    } else
      Object.assign(updatedPermissions, {
        add: { field: field.name, role: this.role.id },
      });

    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE_FIELD_PERMISSION,
        variables: {
          id: resource.id,
          role: this.role.id,
          fieldsPermissions: {
            [action]: updatedPermissions,
          },
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ data }) => {
          this.handleResourceMutationResponse(resource, { data, errors: [] });
          this.updating = false;
        },
        error: (errors) => {
          this.handleResourceMutationResponse(resource, { data: null, errors });
          this.updating = false;
        },
      });
  }

  /**
   * Custom TrackByFunction to compute the identity of items in an iterable, so when
   * updating fields the scroll don't get back to the beginning of the table.
   *
   * @param index index of the item in the table
   * @param item item table
   * @returns unique value for all unique inputs
   */
  public getUniqueIdentifier(index: number, item: any): any {
    return item.resource.id;
  }

  /**
   * Gets the correspondent icon for a given permission
   *
   * @param resource A resource
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getIcon(resource: Resource, permission: Permission) {
    const permissionLevel = this.permissionLevel(resource, permission);
    switch (permission) {
      case Permission.SEE: {
        switch (permissionLevel) {
          case 'limited': {
            return 'visibility_outline';
          }
          case 'full': {
            return 'visibility';
          }
          default: {
            return 'visibility_off';
          }
        }
      }
      case Permission.CREATE:
        switch (permissionLevel) {
          case 'limited': {
            return 'add_circle_outline';
          }
          default:
          case 'full': {
            return 'add_circle';
          }
        }
      case Permission.UPDATE:
        switch (permissionLevel) {
          case 'limited': {
            return 'edit_outline';
          }
          case 'full': {
            return 'edit';
          }
          default: {
            return 'edit_off';
          }
        }
      case Permission.DELETE:
        switch (permissionLevel) {
          case 'limited': {
            return 'delete_outline';
          }
          default:
          case 'full': {
            return 'delete';
          }
        }
    }
  }

  /**
   * Gets if icon should be outlined
   *
   * @param resource A resource
   * @param permission The permission name
   * @returns is icon outlined
   */
  private getIconOutlined(resource: Resource, permission: Permission) {
    const permissionLevel = this.permissionLevel(resource, permission);
    switch (permissionLevel) {
      case 'limited': {
        return true;
      }
      case 'full':
      default: {
        return false;
      }
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
    const permissionLevel = this.permissionLevel(resource, permission);
    switch (permissionLevel) {
      case 'limited':
      case 'full': {
        return 'primary';
      }
      default: {
        return 'grey';
      }
    }
  }

  /**
   * Gets the correspondent tooltip for a given permission
   *
   * @param resource A resource
   * @param permission The permission name
   * @returns the name of the icon to be displayed
   */
  private getTooltip(resource: Resource, permission: Permission) {
    const permissionLevel = this.permissionLevel(resource, permission);
    switch (permission) {
      case Permission.SEE: {
        switch (permissionLevel) {
          case 'limited': {
            return 'components.role.tooltip.limitedReadRecordsPermission';
          }
          case 'full': {
            return 'components.role.tooltip.grantReadRecordsPermission';
          }
          default: {
            return 'components.role.tooltip.notGrantReadRecordsPermission';
          }
        }
      }
      case Permission.CREATE:
        switch (permissionLevel) {
          case 'full': {
            return 'components.role.tooltip.grantAddRecordsPermission';
          }
          default: {
            return 'components.role.tooltip.notGrantAddRecordsPermission';
          }
        }
      case Permission.UPDATE:
        switch (permissionLevel) {
          case 'limited': {
            return 'components.role.tooltip.limitedUpdateRecordsPermission';
          }
          case 'full': {
            return 'components.role.tooltip.grantUpdateRecordsPermission';
          }
          default: {
            return 'components.role.tooltip.notGrantUpdateRecordsPermission';
          }
        }
      case Permission.DELETE:
        switch (permissionLevel) {
          case 'limited': {
            return 'components.role.tooltip.limitedDeleteRecordsPermission';
          }
          case 'full': {
            return 'components.role.tooltip.grantDeleteRecordsPermission';
          }
          default: {
            return 'components.role.tooltip.notGrantDeleteRecordsPermission';
          }
        }
    }
  }

  /**
   * Get the level of permission of the role on a resource.
   *
   * @param resource resource to get permission of
   * @param permission permission to check
   * @returns level of permission ( false, 'limited', 'full' )
   */
  private permissionLevel(resource: Resource, permission: Permission) {
    const rolePermission = get(resource, `rolePermissions.${permission}`, null);
    if (rolePermission) {
      const full = get(rolePermission, 'full', false);
      if (full) {
        return 'full';
      } else {
        return 'limited';
      }
    } else {
      return false;
    }
  }

  /**
   *  Update resource data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: ResourcesQueryResponse, loading: boolean) {
    const mappedValues = data.resources?.edges?.map((x) => x.node);
    this.cachedResources = updateQueryUniqueValues(
      this.cachedResources,
      mappedValues
    );
    this.resources = this.setTableElements(
      this.cachedResources.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex,
        this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
      )
    );
    this.pageInfo.length = data.resources.totalCount;
    this.pageInfo.endCursor = data.resources.pageInfo.endCursor;
    this.loading = loading;
    this.updating = loading;
    this.filterLoading = false;
  }
}
