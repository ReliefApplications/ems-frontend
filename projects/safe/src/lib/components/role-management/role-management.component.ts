import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Channel } from '../../models/channel.model';
import {
  GetChannelsQueryResponse,
  GetPermissionsQueryResponse,
  GetResourcesQueryResponse,
  GetRolesQueryResponse,
  GetUsersGlobalQueryResponse,
  GET_CHANNELS,
  GET_PERMISSIONS,
  GET_RESOURCES,
  GET_ROLES,
  GET_USERS_GLOBAL,
} from '../../graphql/queries';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SafeApplicationService } from '../../services/application.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Permission, Permissions, Role } from '../../models/user.model';
import { Page } from '../../models/page.model';
import _ from 'lodash';
import { SafeSnackBarService } from '../../services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';
import { EditRoleMutationResponse, EDIT_ROLE } from '../../graphql/mutations';

const LOAD_ITEMS = 10;
const SEARCH_DEBOUNCE_TIME = 500;

@Component({
  selector: 'safe-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class SafeRoleManagementComponent implements OnInit, OnDestroy {
  // Page status
  @Input() public inApp = false;

  // Role
  public currentRole?: Role;

  // List of users with the current role assigned
  public roleUsers: string[] = [];

  // Final form to be updated
  public roleForm?: FormGroup;

  // Features tab
  private features: Page[] = [];
  public formattedFeatures: any[] = [];
  public featuresSearch = '';

  // Channels tab
  private channels: Channel[] = [];
  public formattedChannels: any[] = [];
  public channelsSearch = '';

  // Resources tab
  public resources: any[] = [];

  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resourcesQueryInfo: {
    endCursor?: string;
    hasNextPage?: boolean;
    loading?: boolean;
  } = {};

  // Resources and forms search functionality
  public resourcesSearch = new FormControl('');
  private resourcesQueryFilter: any = {};

  private applicationSubscription?: Subscription;

  private permissionsSubscription?: Subscription;
  private canSeeUsersPermission?: Permission;
  private canSeeRolesPermission?: Permission;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.permissionsSubscription = this.apollo
      .watchQuery<GetPermissionsQueryResponse>({
        query: GET_PERMISSIONS,
        variables: { application: this.inApp },
      })
      .valueChanges.subscribe((res) => {
        this.canSeeUsersPermission = res.data.permissions.find(
          (p) => p.type === Permissions.canSeeUsers
        );
        this.canSeeRolesPermission = res.data.permissions.find(
          (p) => p.type === Permissions.canSeeRoles
        );
      });

    this.applicationSubscription =
      this.applicationService.application$.subscribe((application) => {
        this.route.paramMap.subscribe((params) => {
          const roleId = params.get('id');

          // If we manage to fetch the application from service, get all the information from there
          if (this.inApp && application && roleId) {
            // Deep cloning so that some fields are not read-only
            this.currentRole = _.cloneDeep(
              application.roles?.find((role) => role.id === roleId)
            );

            this.roleUsers =
              application.users
                ?.filter(
                  (user) =>
                    user.roles && user.roles.find((role) => role.id === roleId)
                )
                .map(
                  (user) => user.name || user.username || 'no name nor username'
                ) || [];
            this.buildForm();

            this.channels = (application.channels || []).map((channel) => ({
              ...channel,
              application: { name: application.name },
            }));
            this.formatChannels();

            // Deep-copying to avoir read-only "canSee" fields
            this.features = _.cloneDeep(application.pages || []);
            this.formatFeatures();
          } else {
            this.apollo
              .watchQuery<GetRolesQueryResponse>({
                query: GET_ROLES,
              })
              .valueChanges.subscribe((roles) => {
                // Deep cloning so that some fields are not read-only
                this.currentRole = _.cloneDeep(
                  roles.data.roles.find((role) => role.id === roleId)
                );
                this.buildForm();
              });

            this.apollo
              .watchQuery<GetUsersGlobalQueryResponse>({
                query: GET_USERS_GLOBAL,
              })
              .valueChanges.subscribe((users) => {
                this.roleUsers = users.data.users
                  .filter(
                    (user) =>
                      user.roles &&
                      user.roles.find((role) => role.id === roleId)
                  )
                  .map(
                    (user) =>
                      user.name ||
                      user.username ||
                      'no name nor username available'
                  );
              });

            this.apollo
              .watchQuery<GetChannelsQueryResponse>({
                query: GET_CHANNELS,
              })
              .valueChanges.subscribe((res) => {
                this.channels = res.data.channels;
                this.formatChannels();
              });
          }
        });
      });

    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: { first: LOAD_ITEMS },
    });
    this.resourcesQuery.valueChanges.subscribe((res) => {
      this.resourcesQueryInfo = {
        ...res.data.resources.pageInfo,
        loading: res.loading,
      };
      this.resources = res.data.resources.edges.map((x) => x.node);
    });

    this.resourcesSearch.valueChanges
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((value) => {
        this.resourcesQueryFilter = {
          logic: 'and',
          filters: [{ field: 'name', operator: 'contains', value }],
        };
        this.loadResources({ search: true });
      });
  }

  /**
   * Builds the role form
   */
  private buildForm(): void {
    this.roleForm = this.formBuilder.group({
      title: [this.currentRole?.title, Validators.required],
      channels: [this.currentRole?.channels],
      description: [this.currentRole?.description, Validators.required],
      canSeeUsers: new FormControl(
        !!this.currentRole?.permissions?.find(
          (p) => p.id === this.canSeeUsersPermission?.id
        )?.id
      ),
      canSeeRoles: new FormControl(
        !!this.currentRole?.permissions?.find(
          (p) => p.id === this.canSeeRolesPermission?.id
        )
      ),
    });
  }

  /**
   * Builds a features object that can be easily displayed on the template
   */
  private formatFeatures(): void {
    const newFormattedFeatures: any[] = [];

    for (const feature of this.features) {
      if (
        feature.name &&
        feature.name.toLowerCase().includes(this.featuresSearch.toLowerCase())
      ) {
        if (
          feature.type &&
          !newFormattedFeatures.find((group) => group.type === feature.type)
        ) {
          newFormattedFeatures.push({
            type: feature.type,
            icon: this.getFeatureIcon(feature.type),
            expanded:
              this.formattedFeatures.find(
                (group) => group.type === feature.type
              )?.expanded || false,
            features: [],
          });
        }
        newFormattedFeatures
          .find((group) => group.type === feature.type)
          .features.push(feature);
      }
    }
    this.formattedFeatures = newFormattedFeatures;
  }

  /**
   * Save the expansion state of the panel so that it's not reset on search or selection
   *
   * @param groupType type of the features group
   */
  public saveFeaturesPanelExpansion(groupType: string): void {
    const targetGroup = this.formattedFeatures.find(
      (group) => groupType === group.type
    );
    targetGroup.expanded = !targetGroup.expanded;
  }

  /**
   * Changes the visibility of a feature
   */
  public changeFeatureVisibility(targetFeature: any): void {
    for (const feature of this.features) {
      if (feature.id === targetFeature.id) {
        feature.canSee = !feature.canSee;
      }
    }
    this.formatFeatures();
  }

  /**
   * Returns the mat-icon identifier corresponding to the features group's type
   *
   * @param type type of the features group
   * @returns the matching mat-icon identifier
   */
  public getFeatureIcon(type: string): string {
    switch (type) {
      case 'dashboard':
        return 'dashboard';
      case 'workflow':
        return 'linear_scale';
      case 'form':
        return 'description';
      default:
        return '';
    }
  }

  /**
   * Updates the features list depending on the searchterm
   */
  public onFeaturesSearch(): void {
    this.formatFeatures();
  }

  /**
   * Builds a channels object that can be easily displayed on the template
   */
  private formatChannels(): void {
    const newFormattedChannels = this.channels.reduce((prev: any, curr) => {
      const appName = curr.application?.name || 'Global';
      if (
        curr?.title?.toLowerCase().includes(this.channelsSearch.toLowerCase())
      ) {
        if (!prev.find((group: any) => group.name === appName)) {
          prev.push({
            name: appName,
            expanded:
              this.formattedChannels.find((group) => group.name === appName)
                ?.expanded || false,
            channels: [],
          });
        }
        prev.find((group: any) => group.name === appName).channels.push(curr);
      }
      return prev;
    }, []);

    this.formattedChannels = newFormattedChannels;
  }

  /**
   * Save the expansion state of the panel so that it's not reset on search or selection
   *
   * @param groupName name of the channels group
   */
  public saveChannelsPanelExpansion(groupName: string): void {
    const targetGroup = this.formattedChannels.find(
      (group) => groupName === group.name
    );
    targetGroup.expanded = !targetGroup.expanded;
  }

  // TODO There is a weird synchronization bug with this, the first click doesn't update the "checked" value. I cannot figure out what it is sorry...
  /**
   * Checks if the channel is already selected
   *
   * @param channel channel to check
   * @returns a boolean indicating the selection state
   */
  public isChannelSubscribed(channel: Channel): boolean {
    // TODO try to improve this since it is called a lot of time
    return !!this.currentRole?.channels?.find((c) => c.id === channel.id);
  }

  /**
   * Adds or remove a channel from the selection
   *
   * @param channel channel to check
   * @returns a boolean indicating the selection state
   */
  public toggleChannelSubscription(channel: Channel): void {
    if (!!this.currentRole?.channels?.find((c) => c.id === channel.id)) {
      this.currentRole.channels = this.currentRole.channels.filter(
        (c) => c.id !== channel.id
      );
    } else {
      this.currentRole?.channels?.push(channel);
    }
    console.log('this.currentRole?.channels');
    console.log(this.currentRole?.channels);
    this.isChannelSubscribed(channel);
  }

  /**
   * Updates the channels list depending on the searchterm
   */
  public onChannelsSearch(): void {
    this.formatChannels();
  }

  /**
   * Adds selected features and channels, then it updates the role
   */
  public onSubmit(): void {
    /******************************* UPDATING THE ROLE *******************************/
    if (!this.currentRole) {
      this.snackBar.openSnackBar(
        this.translateService.instant('components.role.update.error')
      );
      return;
    }

    const updateRole = {
      ...this.currentRole,
      channels: this.currentRole.channels?.map((c) => c.id),
      permissions: this.currentRole.permissions?.map((p) => p.id),
      ...(this.roleForm?.value.title && { title: this.roleForm?.value.title }),
      ...(this.roleForm?.value.description && {
        description: this.roleForm?.value.description,
      }),
    };

    if (this.inApp) {
      this.applicationService.editRole(this.currentRole, updateRole);
    } else {
      this.apollo
        .mutate<EditRoleMutationResponse>({
          mutation: EDIT_ROLE,
          variables: {
            id: updateRole.id,
            permissions: updateRole.permissions,
            channels: updateRole.channels,
            title: updateRole.title,
            description: updateRole.description,
          },
        })
        .subscribe((res) => {
          const message = res.errors
            ? 'common.notifications.objectNotUpdated'
            : 'common.notifications.objectUpdated';
          this.snackBar.openSnackBar(
            this.translateService.instant(message, {
              type: this.translateService
                .instant('common.role.one')
                .toLowerCase(),
              value: this.currentRole?.title,
            })
          );

          this.currentRole = _.cloneDeep(res.data?.editRole);
        });
    }
    /***************************** END UPDATING THE ROLE *****************************/

    /******************************* UPDATING THE FEATURES *******************************/

    /***************************** END UPDATING THE FEATURES *****************************/

    /******************************* UPDATING THE RESOURCES *******************************/

    /***************************** END UPDATING THE RESOURCES *****************************/

    /******************************* UPDATING THE CHANNELS *******************************/

    /***************************** END UPDATING THE CHANNELS *****************************/
  }

  /**
   * Load the list of resources
   *
   * @param options object containing optional arguments
   * "search" is used if the query is a new search which means the previous results will not be used
   */
  public loadResources(options?: { search: boolean }): void {
    this.resourcesQueryInfo.loading = true;
    this.resourcesQuery.fetchMore({
      variables: {
        first: LOAD_ITEMS,
        filter: this.resourcesQueryFilter,
        ...(!options?.search && {
          afterCursor: this.resourcesQueryInfo.endCursor,
        }), // If the query is from a search, don't take into account the cursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          resources: {
            edges: [
              ...(options?.search ? [] : prev.resources.edges), // If the query is from a search, don't take into account the previous results
              ...fetchMoreResult.resources.edges,
            ],
            pageInfo: fetchMoreResult.resources.pageInfo,
            totalCount: fetchMoreResult.resources.totalCount,
          },
        });
      },
    });
  }

  /**
   * Manage canSeeRoles and canSeeUsers permission toggling
   */
  public onTogglePermission(permission: string): void {
    const targetPermission =
      this.canSeeUsersPermission?.type === permission
        ? this.canSeeUsersPermission
        : this.canSeeRolesPermission;
    if (
      targetPermission &&
      this.currentRole?.permissions?.find((p) => p.id === targetPermission.id)
    ) {
      this.currentRole.permissions = this.currentRole.permissions.filter(
        (p) => p.id !== targetPermission.id
      );
    } else if (targetPermission) {
      this.currentRole?.permissions?.push(targetPermission);
    } else {
      this.snackBar.openSnackBar(
        this.translateService.instant('components.role.update.error'),
        { error: true }
      );
    }
  }

  /**
   * Edits permissions of the selected form or resource
   */
  public onEditResourcePermissions(): void {
    // TODO implement this
    console.log('Work in progress');
  }

  /**
   * Destroys all the subscriptions of the page.
   */
  ngOnDestroy(): void {
    this.applicationSubscription?.unsubscribe();
    this.permissionsSubscription?.unsubscribe();
  }
}
