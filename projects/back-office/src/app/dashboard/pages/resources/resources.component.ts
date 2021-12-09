import {Apollo, QueryRef} from 'apollo-angular';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { DeleteResourceMutationResponse, DELETE_RESOURCE } from '../../../graphql/mutations';
import { GetResourcesQueryResponse, GET_RESOURCES_EXTENDED } from '../../../graphql/queries';
import { Resource, SafeConfirmModalComponent, SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})
export class ResourcesComponent implements OnInit, AfterViewInit {

  // === DATA ===
  public loading = true;
  private resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  displayedColumns: string[] = ['name', 'createdAt', 'recordsCount', 'actions'];
  public cachedResources: Resource[] = [];
  public resources =  new MatTableDataSource<Resource>([]);

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERING ===
  public filter: any;

  // === PAGINATION ===
  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: ''
  };

  constructor(
    private dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
  ) { }

  /*  Load the resources.
  */
  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES_EXTENDED,
      variables: {
        first: DEFAULT_PAGE_SIZE
      }
    });

    this.resourcesQuery.valueChanges.subscribe(res => {
      this.cachedResources = res.data.resources.edges.map(x => x.node);
      this.resources.data = this.cachedResources.slice(
        this.pageInfo.pageSize * this.pageInfo.pageIndex, this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.resources.totalCount;
      this.pageInfo.endCursor = res.data.resources.pageInfo.endCursor;
      this.loading = res.loading;
    });
  }

  /**
   * Handles page event.
   * @param e page event.
   */
   onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    // Checks if with new page/size more data needs to be fetched
    if ((e.pageIndex > e.previousPageIndex || e.pageSize > this.pageInfo.pageSize )
      && e.length > this.cachedResources.length){
      // Sets the new fetch quantity of data needed as the page size
      // If the fetch is for a new page the page size is used
      let first = e.pageSize;
      // If the fetch is for a new page size, the old page size is substracted from the new one
      if (e.pageSize > this.pageInfo.pageSize) {
        first -= this.pageInfo.pageSize;
      }
      this.resourcesQuery.fetchMore({
        variables: {
          first,
          afterCursor: this.pageInfo.endCursor,
          filter: this.filter
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          return Object.assign({}, prev, {
            resources: {
              edges: [...prev.resources.edges, ...fetchMoreResult.resources.edges],
              pageInfo: fetchMoreResult.resources.pageInfo,
              totalCount: fetchMoreResult.resources.totalCount
            }
          });
        }
      });
    } else {
      this.resources.data = this.cachedResources.slice(
        e.pageSize * this.pageInfo.pageIndex, e.pageSize * (this.pageInfo.pageIndex + 1));
    }
    this.pageInfo.pageSize = e.pageSize;
  }

  /**
   * Filters applications and updates table.
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filter = filter;
    this.cachedResources = [];
    this.pageInfo.pageIndex = 0;
    this.resourcesQuery.fetchMore({
      variables: {
        first: this.pageInfo.pageSize,
        filter: this.filter
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) { return prev; }
        return Object.assign({}, prev, {
          resources: {
            edges: fetchMoreResult.resources.edges,
            pageInfo: fetchMoreResult.resources.pageInfo,
            totalCount: fetchMoreResult.resources.totalCount
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    this.resources.sort = this.sort || null;
  }

  /**
   * Removes a resource.
   * @param resource Resource to delete.
   */
  onDelete(resource: Resource): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete Resource',
        content: `Are you sure you want to delete this resource?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<DeleteResourceMutationResponse>({
          mutation: DELETE_RESOURCE,
          variables: {
            id: resource.id
          }
        }).subscribe(res => {
          if (!res.errors) {
            this.resources.data = this.resources.data.filter(x => x.id !== resource.id);
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('resource'));
          } else {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectNotDeleted('resource', res.errors[0].message), { error: true });
          }
        });
      }
    });
  }
}
