import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Apollo, QueryRef } from 'apollo-angular';
import { get } from 'lodash';

import {
  GetResourcesQueryResponse,
  GET_RESOURCES,
} from '../../../graphql/queries';
import {
  EditResourceAccessMutationResponse,
  EDIT_RESOURCE_ACCESS,
} from '../graphql/mutations';
import { Resource } from '../../../models/resource.model';
import { Role } from '../../../models/user.model';
import { SafeSnackBarService } from '../../../services/snackbar.service';

/** Default page size  */
const DEFAULT_PAGE_SIZE = 10;

/**
 * Resource tab of Role Summary component.
 */
@Component({
  selector: 'safe-role-resources',
  templateUrl: './role-resources.component.html',
  styleUrls: ['./role-resources.component.scss'],
})
export class RoleResourcesComponent implements OnInit {
  // === RESOURCES ===
  public loading = true;
  public resources = new MatTableDataSource<Resource>([]);
  public cachedResources: Resource[] = [];
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  displayedColumns: string[] = ['name', 'actions'];
  @Input() role!: Role;

  // === PAGINATION ===
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  // === VISIBILITY OF RESOURCES ===
  public accessibleResources: any = [];

  /**
   * Resource tab of Role Summary component.
   *
   * @param apollo Apollo client service
   * @param snackBar shared snackbar service
   */
  constructor(private apollo: Apollo, private snackBar: SafeSnackBarService) {}

  /** Load the resources. */
  ngOnInit(): void {
    console.log(this.role);

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
      this.accessibleResources = this.cachedResources
        .filter((x) =>
          get(x, 'permissions.canSee', [])
            .map((y: any) => y.id)
            .includes(this.role.id)
        )
        .map((x) => x.id as string);
      console.log(this.cachedResources);
      console.log(this.accessibleResources);
      this.pageInfo.length = res.data.resources.totalCount;
      this.pageInfo.endCursor = res.data.resources.pageInfo.endCursor;
      this.loading = res.loading;
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
      this.loading = true;
      this.resourcesQuery.fetchMore({
        variables: {
          first,
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
    } else {
      this.resources.data = this.cachedResources.slice(
        e.pageSize * this.pageInfo.pageIndex,
        e.pageSize * (this.pageInfo.pageIndex + 1)
      );
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Edits the specified resource permissions array
   *
   * @param resource the resource object to be updated
   */
  onEditAccess(resource: Resource): void {
    if (!this.role.id) return;
    const canSeePermissions: string[] = get(
      resource,
      'permissions.canSee',
      []
    ).map((x: any) => x.id as string);

    // toggles the permission
    const roleIndex = canSeePermissions.findIndex((x) => x === this.role.id);
    if (roleIndex >= 0) canSeePermissions.splice(roleIndex, 1);
    else canSeePermissions.push(this.role.id);

    this.apollo
      .mutate<EditResourceAccessMutationResponse>({
        mutation: EDIT_RESOURCE_ACCESS,
        variables: {
          id: resource.id,
          permissions: {
            canSee: canSeePermissions,
          },
        },
      })
      .subscribe(
        (res) => {
          if (res.data) {
            const index = this.cachedResources.findIndex(
              (x) => x.id === res.data?.editResource.id
            );
            const resources = [...this.cachedResources];
            resources[index] = res.data.editResource;
            this.cachedResources = resources;
            this.resources.data = this.cachedResources.slice(
              this.pageInfo.pageSize * this.pageInfo.pageIndex,
              this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
            );
          }
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
  }
}
