import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, QueryRef } from 'apollo-angular';
import { get } from 'lodash';
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
  GetResourceFormsQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCES,
  GET_RESOURCE_FORMS,
} from '../graphql/queries';

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
  public loadingForms = false;
  public forms: Form[] = [];
  public formsPermissions: {
    [key in Permission]: string[];
  } = {
    canSeeRecords: [],
    canCreateRecords: [],
    canUpdateRecords: [],
    canDeleteRecords: [],
  };
  public permissionTypes = [
    Permission.SEE,
    Permission.CREATE,
    Permission.UPDATE,
    Permission.DELETE,
  ];

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
      query: GET_RESOURCES,
      variables: {
        first: DEFAULT_PAGE_SIZE,
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

  /** Queries the resources */
  private fetchResources(): void {
    this.updating = true;

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

  /**
   * Toggles the accordion for the clicked resource and fetches its forms
   *
   * @param resource The resource element for the resource to be toggled
   */
  toggleResource(resource: Resource): void {
    this.forms = [];
    if (resource.id === this.openedResourceId) {
      this.openedResourceId = '';
    } else {
      this.loadingForms = true;
      this.openedResourceId = resource.id as string;
      this.apollo
        .query<GetResourceFormsQueryResponse>({
          query: GET_RESOURCE_FORMS,
          variables: {
            resource: resource.id,
          },
        })
        .subscribe(
          (res) => {
            if (res.data) {
              this.forms = get(res.data.resource, 'forms', []);
              for (const permission of this.permissionTypes) {
                this.formsPermissions[permission] = this.forms
                  .filter((x) =>
                    get(x, `permissions.${permission}`, [])
                      .map((y: any) => y.role || y.id)
                      .includes(this.role.id)
                  )
                  .map((x) => x.id as string);
              }
            }
            this.loadingForms = false;
          },
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          }
        );
    }
  }
}
