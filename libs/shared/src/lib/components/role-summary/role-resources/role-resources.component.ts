import {
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
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
  EDIT_RESOURCE_FIELDS_AUTO_GRANT,
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
import { TranslateService } from '@ngx-translate/core';

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
  implements OnInit, OnDestroy
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
  /** Update of resource */
  private _updating = false;
  /** Saving overlay template, rendered over the page container while updating */
  @ViewChild('savingOverlay', { static: true })
  savingOverlayTemplate!: TemplateRef<any>;
  /** Reference to the saving overlay, once created */
  private savingOverlayRef?: OverlayRef;

  /** @returns whether a resource is being updated */
  get updating(): boolean {
    return this._updating;
  }

  /**
   * Set the updating flag, showing or hiding the saving overlay accordingly.
   *
   * @param value new updating value
   */
  set updating(value: boolean) {
    this._updating = value;
    if (value && !this.loading) {
      this.showSavingOverlay();
    } else {
      this.hideSavingOverlay();
    }
  }

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
   * @param translate Angular translate service
   * @param document Document
   * @param overlay CDK overlay service
   * @param viewContainerRef View container reference
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  /** Keep the saving overlay aligned with the page container on resize. */
  @HostListener('window:resize')
  onResize(): void {
    if (this.savingOverlayRef?.hasAttached()) {
      this.positionSavingOverlay();
    }
  }

  /**
   * Show the saving overlay over the page container ( the content area next to
   * the sidenav ). It is rendered through the CDK overlay container, at body
   * level: the tabs panel above this component is transformed, which would make
   * a fixed element position itself relatively to the panel instead of the viewport.
   */
  private showSavingOverlay(): void {
    if (!this.savingOverlayRef) {
      this.savingOverlayRef = this.overlay.create({
        positionStrategy: this.overlay.position().global(),
        scrollStrategy: this.overlay.scrollStrategies.noop(),
      });
    }
    this.positionSavingOverlay();
    if (!this.savingOverlayRef.hasAttached()) {
      this.savingOverlayRef.attach(
        new TemplatePortal(this.savingOverlayTemplate, this.viewContainerRef)
      );
    }
  }

  /** Hide the saving overlay, if shown. */
  private hideSavingOverlay(): void {
    if (this.savingOverlayRef?.hasAttached()) {
      this.savingOverlayRef.detach();
    }
  }

  /**
   * Size and position the saving overlay on the page container rectangle,
   * falling back to the whole viewport when there is no layout.
   */
  private positionSavingOverlay(): void {
    if (!this.savingOverlayRef) return;
    const rect = this.document
      .getElementById('appPageContainer')
      ?.getBoundingClientRect();
    const position = this.overlay.position().global();
    if (rect) {
      position.top(`${rect.top}px`).left(`${rect.left}px`);
      this.savingOverlayRef.updateSize({
        width: rect.width,
        height: rect.height,
      });
    } else {
      position.top('0').left('0');
      this.savingOverlayRef.updateSize({ width: '100%', height: '100%' });
    }
    this.savingOverlayRef.updatePositionStrategy(position);
  }

  override ngOnDestroy(): void {
    this.savingOverlayRef?.dispose();
    super.ngOnDestroy();
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
        Permission.DOWNLOAD,
        Permission.UPLOAD,
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
        next: ({ errors, data }) => {
          this.handleResourceMutationResponse(resource, { data, errors }, true);
          this.updating = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
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
        next: ({ errors, data }) => {
          this.handleResourceMutationResponse(resource, { data, errors });
          this.updating = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
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
    if (errors) {
      this.snackBar.openSnackBar(errors[0].message, { error: true });
    } else if (data?.editResource) {
      this.snackBar.openSnackBar(
        this.translate.instant('components.role.summary.permissionsUpdated', {
          resource: resource.name ?? '',
        })
      );
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
        next: ({ errors, data }) => {
          this.handleResourceMutationResponse(resource, { data, errors });
          this.updating = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.updating = false;
        },
      });
  }

  /**
   * Bulk edits the given permission for a set of fields at once
   *
   * @param resource the resource containing the fields to be updated
   * @param fields the fields to be edited
   * @param permission the permission to be edited
   * @param grant whether to grant (true) or revoke (false) the permission for all given fields
   */
  onBulkEditFieldAccess(
    resource: Resource,
    fields: { name: string; canSee?: boolean; canUpdate?: boolean }[],
    permission: 'canSee' | 'canUpdate',
    grant: boolean
  ): void {
    if (!this.role.id || !fields.length) return;

    this.updating = true;
    const role = this.role.id as string;
    const entry = (field: { name: string }) => ({ field: field.name, role });
    const fieldsPermissions: Record<string, any> = {
      [permission]: grant
        ? { add: fields.map(entry) }
        : { remove: fields.map(entry) },
    };

    if (grant && permission === 'canUpdate') {
      // The backend rejects a canUpdate grant on a field the role cannot see, and
      // it validates the whole batch before writing anything, so a selection
      // mixing visible and hidden fields would update none of them. It processes
      // canSee first and accepts a canUpdate grant backed by a canSee grant of
      // the same request, so the missing ones are sent along.
      const missingCanSee = fields.filter((field) => !field.canSee);
      if (missingCanSee.length) {
        fieldsPermissions.canSee = { add: missingCanSee.map(entry) };
      }
    }

    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE_FIELD_PERMISSION,
        variables: {
          id: resource.id,
          role: this.role.id,
          fieldsPermissions,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ errors, data }) => {
          this.handleResourceMutationResponse(resource, { data, errors });
          this.updating = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.updating = false;
        },
      });
  }

  /**
   * Toggles the fields auto-grant setting for the given permission.
   *
   * @param resource the resource to update
   * @param permission the fields auto-grant permission to toggle
   */
  onEditFieldsAutoGrant(
    resource: Resource,
    permission: 'canSee' | 'canUpdate'
  ): void {
    if (!this.role.id) return;

    this.updating = true;
    const checked = get(
      resource,
      `rolePermissions.autoGrantFields${
        permission === 'canSee' ? 'CanSee' : 'CanUpdate'
      }`,
      false
    );
    const updatedPermissions: { add?: string[]; remove?: string[] } = checked
      ? { remove: [this.role.id] }
      : { add: [this.role.id] };

    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE_FIELDS_AUTO_GRANT,
        variables: {
          id: resource.id,
          role: this.role.id,
          fieldsAutoGrant: {
            [permission]: updatedPermissions,
          },
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ errors, data }) => {
          this.handleResourceMutationResponse(resource, { data, errors });
          this.updating = false;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
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
      case Permission.DOWNLOAD:
        switch (permissionLevel) {
          case 'limited': {
            return 'file_download_outline';
          }
          case 'full': {
            return 'file_download';
          }
          default: {
            return 'file_download_off';
          }
        }
      case Permission.UPLOAD:
        switch (permissionLevel) {
          case 'limited': {
            return 'file_upload_outline';
          }
          case 'full': {
            return 'file_upload';
          }
          default: {
            return 'file_upload_off';
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
      case Permission.DOWNLOAD:
        switch (permissionLevel) {
          case 'full': {
            return 'components.role.tooltip.grantDownloadRecordsPermission';
          }
          default: {
            return 'components.role.tooltip.notGrantDownloadRecordsPermission';
          }
        }
      case Permission.UPLOAD:
        switch (permissionLevel) {
          case 'full': {
            return 'components.role.tooltip.grantUploadRecordsPermission';
          }
          default: {
            return 'components.role.tooltip.notGrantUploadRecordsPermission';
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
