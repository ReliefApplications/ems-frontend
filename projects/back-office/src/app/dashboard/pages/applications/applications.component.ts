import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Application, PermissionsManagement, PermissionType,
  SafeAuthService, SafeConfirmModalComponent, SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';
import { GetApplicationsQueryResponse, GET_APPLICATIONS } from '../../../graphql/queries';
import { DeleteApplicationMutationResponse, DELETE_APPLICATION, AddApplicationMutationResponse,
  ADD_APPLICATION, EditApplicationMutationResponse, EDIT_APPLICATION } from '../../../graphql/mutations';
import { ChoseRoleComponent } from './components/chose-role/chose-role.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PreviewService } from '../../../services/preview.service';
import { DuplicateApplicationComponent } from '../../../components/duplicate-application/duplicate-application.component';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {

  // === DATA ===
  public loading = true;
  private applicationsQuery!: QueryRef<GetApplicationsQueryResponse>;
  public applications = new MatTableDataSource<Application>([]);
  public cachedApplications: Application[] = [];
  public displayedColumns = ['name', 'createdAt', 'status', 'usersCount', 'actions'];

  // === SORTING ===
  @ViewChild(MatSort) sort?: MatSort;

  // === FILTERS ===
  public filtersDate = {startDate: '', endDate: ''};
  public searchText = '';
  public statusFilter = '';
  public showFilters = false;
  // public filters: {
  //   logic: 'or' | 'and',
  //   filters: [
  //     { field: string, operator: string, value: string }
  //   ]
  // } = [{logic: 'or', filters: null}];

  // public filters: {
  //   logic: 'or' | 'and',
  //   filters: { field: string, operator: string, value: string }[]
  // } = {logic: 'or', filters: []};

  // public filters: {
  //   logic: 'or' | 'and',
  //   filters: { field: string, operator: string, value: string }[]
  // };
  public filters: {
    field: string,
    operator: string,
    value: any
  }[];
  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: ''
  };

  @ViewChild('startDate', { read: MatStartDate}) startDate!: MatStartDate<string>;
  @ViewChild('endDate', { read: MatEndDate}) endDate!: MatEndDate<string>;

  // === PERMISSIONS ===
  canAdd = false;
  private authSubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private previewService: PreviewService
  ) {
    this.filters = [
        {field: 'name', operator: 'contains', value: ''},
        {field: 'createdAt', operator: 'between', value: null},
        {field: 'status', operator: 'is', value: ''}
    ];
  }

  ngOnInit(): void {
    this.applicationsQuery = this.apollo.watchQuery<GetApplicationsQueryResponse>({
      query: GET_APPLICATIONS,
      variables: {
        first: ITEMS_PER_PAGE,
        filters: { logic: 'and', filters: this.filters }
      }
    });

    this.applicationsQuery.valueChanges.subscribe(res => {
      this.cachedApplications = res.data.applications.edges.map(x => x.node);
      this.applications.data = this.cachedApplications.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
      this.pageInfo.length = res.data.applications.totalCount;
      this.pageInfo.endCursor = res.data.applications.pageInfo.endCursor;
      this.loading = res.loading;
      this.filterPredicate();
    });
    this.authSubscription = this.authService.user.subscribe(() => {
      this.canAdd = this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.create))
        || this.authService.userHasClaim(PermissionsManagement.getRightFromPath(this.router.url, PermissionType.manage));
    });
  }

  /**
   * Handles page event.
   * @param e page event.
   */
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (e.pageIndex > e.previousPageIndex && e.length > this.cachedApplications.length) {
      this.applicationsQuery.fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) { return prev; }
          return Object.assign({}, prev, {
            applications: {
              edges: [...prev.applications.edges, ...fetchMoreResult.applications.edges],
              pageInfo: fetchMoreResult.applications.pageInfo,
              totalCount: fetchMoreResult.applications.totalCount
            }
          });
        }
      });
    } else {
      this.applications.data = this.cachedApplications.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex, ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1));
    }
  }

  private filterPredicate(): void {
    this.applications.filterPredicate = (data: any) => {
      const endDate = new Date(this.filtersDate.endDate).getTime();
      const startDate = new Date(this.filtersDate.startDate).getTime();
      return (((this.searchText.trim().length === 0 ||
          (this.searchText.trim().length > 0 && data.name.toLowerCase().includes(this.searchText.trim()))) &&
        (this.statusFilter.trim().length === 0 ||
          (this.statusFilter.trim().length > 0 && data.status.toLowerCase().includes(this.statusFilter.trim()))) &&
        (!startDate || !endDate || data.createdAt >= startDate && data.createdAt <= endDate)));
    };
  }

  ngAfterViewInit(): void {
    this.applications.sort = this.sort || null;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  /*  Delete an application if authorized.
  */
  onDelete(element: any, e: any): void {
    e.stopPropagation();
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete application',
        content: `Do you confirm the deletion of the application ${element.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        const id = element.id;
        this.apollo.mutate<DeleteApplicationMutationResponse>({
          mutation: DELETE_APPLICATION,
          variables: {
            id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Application'));
          this.applications.data = this.applications.data.filter(x => {
            return x.id !== res.data?.deleteApplication.id;
          });
        });
      }
    });
  }

  /*  Display the AddApplication component.
    Add a new application once closed, if result exists.
  */
  onAdd(): void {
    this.apollo.mutate<AddApplicationMutationResponse>({
      mutation: ADD_APPLICATION
    }).subscribe(res => {
      if (res.errors?.length) {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectNotCreated('App', res.errors[0].message), { error: true });
      } else {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated(res.data.addApplication.name, 'application'));
          const id = res.data.addApplication.id;
          this.router.navigate(['/applications', id]);
        }
      }
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any, element: Application): void {
    this.apollo.mutate<EditApplicationMutationResponse>({
      mutation: EDIT_APPLICATION,
      variables: {
        id: element.id,
        permissions: e
      }
    }).subscribe((res) => {
      if (res.data) {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('access', element.name));
        const index = this.applications.data.findIndex(x => x.id === element.id);
        this.applications.data[index] = res.data.editApplication;
        this.applications.data = this.applications.data;
      }
    });
  }

  /*  Open a dialog to choose roles to fit in the preview.
  */
  onPreview(element: Application): void {
    const dialogRef = this.dialog.open(ChoseRoleComponent, {
      data: {
        application: element.id
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.previewService.setRole(value.role);
        this.router.navigate(['./app-preview', element.id]);
      }
    });
  }

  /*  Open a dialog to give a name for the duplicated application
  */
  onDuplicate(application: Application): void {
    const dialogRef = this.dialog.open(DuplicateApplicationComponent, {
      data: {
        id: application.id,
        name: application.name
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.applications.data.push(value);
        this.applications.data = this.applications.data;
      }
    });
  }

  applyFilter(column: string, event: any): void {
    if (column === 'status') {
      this.statusFilter = !!event.value ? event.value.trim().toLowerCase() : '';
      const statusIndex = this.filters.findIndex((filter) => filter.field === 'status');
      this.filters[statusIndex].value = this.statusFilter;
    } else if (column === 'createdAt'){
      const nameIndex = this.filters.findIndex((filter) => filter.field === 'createdAt');
      if (this.startDate.value && this.endDate.value) {
        // need to shift date by 1 day (because for ex if we choose: 20/09 => we will have 20/09-00:00 but we want 20/09-11:59
        // so we add 1 to the date (so 21/09), and in the backend we make a < against a <=
        const sd = new Date(Date.parse(this.startDate.value));
        const ed = new Date(Date.parse(this.endDate.value));
        // sd.setDate(sd.getDate() + 1);
        ed.setDate(ed.getDate() + 1);
        console.log(sd);
        console.log(ed);
        this.filters[nameIndex].value = {startDate: sd, endDate: ed};
      }
      else {
        this.filters[nameIndex].value = null;
      }
    } else {
      this.searchText = !!event ? event.target.value.trim().toLowerCase() : this.searchText;
      const nameIndex = this.filters.findIndex((filter) => filter.field === 'name');
      this.filters[nameIndex].value = this.searchText;
    }
    console.log('===> this.filters');
    console.log(this.filters);
    this.applicationsQuery.fetchMore({
      variables: {
        first: ITEMS_PER_PAGE,
        afterCursor: this.pageInfo.endCursor,
        filters: { logic: 'and', filters: this.filters },
      },
    });
  }

  clearDateFilter(): void {
    this.filtersDate.startDate = '';
    this.filtersDate.endDate = '';
    // ignore that error
    this.startDate.value = '';
    this.endDate.value = '';
    this.applyFilter('createdAt', '');
  }

  clearAllFilters(): void {
    this.searchText = '';
    // update the filter
    let statusIndex = this.filters.findIndex((filter) => filter.field === 'name');
    this.filters[statusIndex].value = this.searchText;
    this.statusFilter = '';
    // update the filter
    statusIndex = this.filters.findIndex((filter) => filter.field === 'status');
    this.filters[statusIndex].value = this.statusFilter;
    this.clearDateFilter();
  }
}
