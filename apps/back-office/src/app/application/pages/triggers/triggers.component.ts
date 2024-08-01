import { Component, OnInit } from '@angular/core';
import {
  Resource,
  ResourcesQueryResponse,
  UnsubscribeComponent,
  updateQueryUniqueValues,
  CustomNotification,
  ApplicationService,
  ResourceQueryResponse,
  EditResourceMutationResponse,
} from '@oort-front/shared';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  handleTablePageEvent,
  SnackbarService,
  UIPageChangeEvent,
} from '@oort-front/ui';
import { takeUntil } from 'rxjs';
import { GET_RESOURCE, GET_RESOURCES } from './graphql/queries';
import { EDIT_RESOURCE_TRIGGERS_FILTERS } from './graphql/mutations';
import { Triggers, TriggersType } from './triggers.types';
import { isEqual } from 'lodash';

/** Default page size  */
const DEFAULT_PAGE_SIZE = 10;

/** Interface of table elements */
interface TableTriggerResourceElement {
  resource: Resource;
  triggers: {
    name: TriggersType;
    icon: string;
    variant: string;
    tooltip: string;
  }[];
}

/**
 * Triggers page component for application.
 */
@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.scss'],
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
export class TriggersComponent extends UnsubscribeComponent implements OnInit {
  /** TABLE ELEMENTS */
  /** Resources query */
  private resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  /** Displayed columns */
  public displayedColumns: string[] = ['name', 'info'];
  /** Resources */
  public resources = new Array<TableTriggerResourceElement>();
  /** Cached resources */
  public cachedResources: Resource[] = [];

  /** FILTERING */
  /** Filter */
  public filter: any;
  /** Filter loading */
  public filterLoading = false;

  /** SINGLE RESOURCE */
  /** Updating status */
  public updating = false; // Update of resource
  /** Opened resource */
  public openedResource?: Resource;

  /** PAGINATION */
  /** Loading status */
  public loading = true; // First load && pagination
  /** Page info */
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /** Current application id */
  private applicationId!: string;

  /**
   * Triggers page component for application.
   *
   * @param apollo Apollo client service
   * @param snackBar shared snackbar service
   * @param applicationService Shared application service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private applicationService: ApplicationService
  ) {
    super();
    this.applicationId =
      this.applicationService.application.getValue()?.id ?? '';
  }

  /** Load the resources. */
  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: DEFAULT_PAGE_SIZE,
        sortField: 'name',
        sortOrder: 'asc',
        application: this.applicationId,
      },
    });

    this.resourcesQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.updateValues(data, loading);
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
   * Filters resources and updates table.
   *
   * @param filter filter event.
   */
  public onFilter(filter: any): void {
    this.filterLoading = true;
    this.filter = filter;
    this.fetchResources(true);
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  public onPage(e: UIPageChangeEvent): void {
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
   * Toggles the accordion for the clicked resource and fetches its forms
   *
   * @param resource The resource element for the resource to be toggled
   */
  public toggleResource(resource: Resource): void {
    if (resource.id === this.openedResource?.id) {
      this.openedResource = undefined;
    } else {
      this.updating = true;
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE,
          variables: {
            id: resource.id,
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
   * Edit resource triggers filter
   *
   * @param resource resource to update
   * @param update update to perform
   */
  public editResourceTriggersFilters(resource: Resource, update: any): void {
    this.updating = true;
    this.apollo
      .mutate<EditResourceMutationResponse>({
        mutation: EDIT_RESOURCE_TRIGGERS_FILTERS,
        variables: {
          id: resource.id,
          triggersFilters: update,
          application: this.applicationId,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ errors, data }) => {
          this.handleResourceMutationResponse(resource, { data, errors });
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
    this.updating = false;
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
    }
  }

  /**
   * Serialize single table element from resource
   *
   * @param resource resource to serialize
   * @returns serialized element
   */
  private setTableElement(resource: Resource): TableTriggerResourceElement {
    return {
      resource,
      triggers: [
        Triggers.cronBased,
        Triggers.onRecordCreation,
        Triggers.onRecordUpdate,
      ].map((trigger) => ({
        name: trigger,
        icon: this.getIcon(trigger),
        variant: this.getVariant(resource, trigger),
        tooltip: this.getTooltip(resource, trigger),
      })),
    };
  }

  /**
   * Gets the correspondent icon for a given trigger
   *
   * @param trigger The trigger name
   * @returns the name of the icon to be displayed
   */
  private getIcon(trigger: Triggers) {
    switch (trigger) {
      case Triggers.cronBased:
        return 'schedule_send';
      case Triggers.onRecordCreation:
        return 'add_circle';
      case Triggers.onRecordUpdate:
        return 'edit';
    }
  }

  /**
   * Gets the correspondent variant for a given trigger
   *
   * @param resource A resource
   * @param trigger The trigger name
   * @returns the name of the variant to be displayed
   */
  private getVariant(resource: Resource, trigger: Triggers) {
    const fieldName = trigger === Triggers.cronBased ? 'schedule' : trigger;
    const hasTrigger =
      resource.customNotifications?.some(
        (notification: CustomNotification) => notification[fieldName]
      ) ?? false;
    switch (hasTrigger) {
      case true:
        return 'primary';
      case false:
        return 'grey';
    }
  }

  /**
   * Gets the correspondent tooltip for a given trigger
   *
   * @param resource A resource
   * @param trigger The trigger name
   * @returns the tooltip to be displayed
   */
  private getTooltip(resource: Resource, trigger: Triggers) {
    const fieldName = trigger === Triggers.cronBased ? 'schedule' : trigger;
    const hasTrigger =
      resource.customNotifications?.some(
        (notification: CustomNotification) => notification[fieldName]
      ) ?? false;
    switch (hasTrigger) {
      case true: {
        switch (trigger) {
          case Triggers.cronBased:
            return 'components.triggers.tooltip.withCronBasedTrigger';
          case Triggers.onRecordCreation:
            return 'components.triggers.tooltip.withOnRecordCreationTrigger';
          case Triggers.onRecordUpdate:
            return 'components.triggers.tooltip.withOnRecordUpdateTrigger';
        }
      }
      // eslint-disable-next-line no-fallthrough
      case false: {
        switch (trigger) {
          case Triggers.cronBased:
            return 'components.triggers.tooltip.withoutCronBasedTrigger';
          case Triggers.onRecordCreation:
            return 'components.triggers.tooltip.withoutOnRecordCreationTrigger';
          case Triggers.onRecordUpdate:
            return 'components.triggers.tooltip.withoutOnRecordUpdateTrigger';
        }
      }
    }
  }

  /**
   * Serialize list of table elements from resource
   *
   * @param resources resources to serialize
   * @returns serialized elements
   */
  private setTableElements(
    resources: Resource[]
  ): TableTriggerResourceElement[] {
    return resources.map((x: Resource) => this.setTableElement(x));
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
        .then((results: any) =>
          this.updateValues(results.data, results.loading)
        );
    }
  }
}
