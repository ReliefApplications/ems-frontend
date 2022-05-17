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
  GetFormsQueryResponse,
  GetResourcesQueryResponse,
  GetRolesQueryResponse,
  GetUsersGlobalQueryResponse,
  GET_CHANNELS,
  GET_FORMS,
  GET_RESOURCES,
  GET_ROLES,
  GET_USERS_GLOBAL,
} from '../../graphql/queries';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SafeApplicationService } from '../../services/application.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Permissions, Role } from '../../models/user.model';
import { Page } from '../../models/page.model';

const mockRole = {
  id: '',
  name: '',
  description: '',
  canSeeRoles: false,
  canSeeUsers: false,
  users: [],
  features: [],
  channels: [],
};

const LOAD_ITEMS = 10;
const SEARCH_DEBOUNCE_TIME = 500;

@Component({
  selector: 'safe-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss'],
})
export class SafeRoleManagementComponent implements OnInit, OnDestroy {
  public role: {
    id: string;
    name: string;
    description: string;
    canSeeRoles: boolean;
    canSeeUsers: boolean;
    users: { name: string }[];
    features: string[];
    channels: string[];
  } = mockRole;

  // Role properties
  public currentRole?: Role;

  // Page status
  @Input() public inApp = false;
  @Input() public applicationId = '';

  // Final form to be updated
  public roleForm?: FormGroup;

  // Summary tab
  public roleUsers: string[] = [];

  // Channels tab
  public channels: Channel[] = [];
  public applications: any[] = [];
  public channelSearch = '';

  // Features tab
  private featuresRaw: Page[] = [];
  public features: any[] = [];
  public featureSearch = '';

  // Resources tab
  public resources: any[] = [];

  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resourcesQueryInfo: {
    endCursor?: string;
    hasNextPage?: boolean;
    loading?: boolean;
  } = {};

  // Forms tab
  public forms: any[] = [];

  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  public formsQueryInfo: {
    endCursor?: string;
    hasNextPage?: boolean;
    loading?: boolean;
  } = {};

  // Resources and forms search functionality
  public formsAndResourcesSearch = new FormControl('');
  private formsAndResourcesQueryFilter: any = {};

  private applicationSubscription?: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.applicationSubscription =
      this.applicationService.application$.subscribe((application) => {
        this.route.paramMap.subscribe((params) => {
          const roleId = params.get('id');

          if (this.inApp && application && roleId) {
            this.currentRole = application.roles?.find(
              (role) => role.id === roleId
            );

            // Get all the application users who have the current role, and try to display their names, or usernames, or display a default value if not found
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
            
            this.featuresRaw = application.pages || [];
            this.updateFeatures();
          } else {
            this.apollo
              .watchQuery<GetRolesQueryResponse>({
                query: GET_ROLES,
              })
              .valueChanges.subscribe((roles) => {
                this.currentRole = roles.data.roles.find(
                  (role) => role.id === roleId
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
          }
        });
      });

    this.apollo
      .watchQuery<GetChannelsQueryResponse>({
        query: GET_CHANNELS,
      })
      .valueChanges.subscribe((res) => {
        this.channels = res.data.channels;
        this.updateApplicationsChannels();
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

    this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
      query: GET_FORMS,
      variables: { first: LOAD_ITEMS },
    });
    this.formsQuery.valueChanges.subscribe((res) => {
      this.formsQueryInfo = {
        ...res.data.forms.pageInfo,
        loading: res.loading,
      };
      this.forms = res.data.forms.edges.map((x) => x.node);
    });

    this.formsAndResourcesSearch.valueChanges
      .pipe(debounceTime(SEARCH_DEBOUNCE_TIME), distinctUntilChanged())
      .subscribe((value) => {
        this.formsAndResourcesQueryFilter = {
          logic: 'and',
          filters: [{ field: 'name', operator: 'contains', value }],
        };
        this.loadResources({ search: true });
        this.loadForms({ search: true });
      });
  }

  private buildForm() {
    this.roleForm = this.formBuilder.group({
      name: [this.currentRole?.title, Validators.required],
      channels: [this.currentRole?.channels],
      description: [this.currentRole?.description, Validators.required],
      canSeeRoles: new FormControl(
        !!this.currentRole?.permissions?.find(
          (p) => p.type === Permissions.canSeeRoles
        )
      ),
      canSeeUsers: new FormControl(
        !!this.currentRole?.permissions?.find(
          (p) => p.type === Permissions.canSeeUsers
        )
      ),
    });
  }

  /**
   * Moves features in an array under corresponding groups
   */
  private updateFeatures() {
    this.features = [];
    this.featuresRaw.map((feature: any) => {
      let i: number = this.features.findIndex(
        (element) => element.type === feature.type
      );
      if (i < 0) {
        this.features.push({
          type: feature.type,
          icon: this.getFeatureIcon(feature.type),
          contents: [],
        });
        i = this.features.length - 1;
      }
      if (
        feature.name.toLowerCase().includes(this.featureSearch.toLowerCase())
      ) {
        this.features[i].contents.push(feature);
      }
    });
  }

  /** Gets type icon */
  private getFeatureIcon(type: string): string {
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
   * Adds or removes a feature from the list of selected features
   */
  public onItemClick(itemKey: 'channels' | 'features', id: string) {
    if (this.role[itemKey].includes(id)) {
      this.role[itemKey] = this.role[itemKey].filter((item) => item !== id);
    } else {
      this.role[itemKey].push(id);
    }
  }

  /**
   * Updates the feature list depending on the searchterm
   */
  public onFeatureSearch() {
    this.updateFeatures();
  }

  /**
   * Moves channels in an array under corresponding applications
   */
  private updateApplicationsChannels() {
    this.applications = Array.from(
      new Set(this.channels.map((x: any) => x.application?.name))
    ).map((name) => ({
      name: name ? name : 'Global',
      channels: this.channels.reduce((o: Channel[], channel: Channel) => {
        if (
          channel?.application?.name === name &&
          channel?.title
            ?.toLowerCase()
            .includes(this.channelSearch.toLowerCase())
        ) {
          o.push(channel);
        }
        return o;
      }, []),
    }));
  }

  /**
   * Updates the channel list depending on the searchterm
   */
  public onChannelSearch() {
    this.updateApplicationsChannels();
  }

  /**
   * Adds selected features and channels, then it updates the role
   */
  public onSubmit(): void {
    this.roleForm?.patchValue(this.role);
    console.log(this.roleForm?.value);
  }

  /**
   * Load the list of resources
   *
   * @param options object containing optional arguments
   * "search" is used if the query is a new search which means the previous results will not be used
   */
  public loadResources(options?: { search: boolean }) {
    this.resourcesQueryInfo.loading = true;
    this.resourcesQuery.fetchMore({
      variables: {
        first: LOAD_ITEMS,
        filter: this.formsAndResourcesQueryFilter,
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
   * Load the list of forms
   *
   * @param options object containing optional arguments
   * "search" is used if the query is a new search which means the previous results will not be used
   */
  public loadForms(options?: { search: boolean }) {
    this.formsQueryInfo.loading = true;
    this.formsQuery.fetchMore({
      variables: {
        first: LOAD_ITEMS,
        filter: this.formsAndResourcesQueryFilter,
        ...(!options?.search && {
          afterCursor: this.formsQueryInfo.endCursor, // If the query is from a search, don't take into account the cursor
        }),
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          forms: {
            edges: [
              ...(options?.search ? [] : prev.forms.edges), // If the query is from a search, don't take into account the previous results
              ...fetchMoreResult.forms.edges,
            ],
            pageInfo: fetchMoreResult.forms.pageInfo,
            totalCount: fetchMoreResult.forms.totalCount,
          },
        });
      },
    });
  }

  public onEditAccess(): void {
    console.log('EDIT ACCESS');

    /*
    const dialogRef = this.dialog.open(SafeEditAccessComponent, {
      data: {
        access: this.access,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        console.log('res');
        console.log(res);
      }
    });
    */
  }

  public onSaveAccess(event: any): void {
    console.log('SAVE ACCESS');
    console.log(event);
  }

  /**
   * Destroys all the subscriptions of the page.
   */
  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
