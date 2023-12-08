import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { Router } from '@angular/router';
import {
  AddApplicationMutationResponse,
  Application,
  ConfirmService,
  UnsubscribeComponent,
  ApplicationsApplicationNodesQueryResponse,
  DeleteApplicationMutationResponse,
  EditApplicationMutationResponse,
} from '@oort-front/shared';
import {
  DELETE_APPLICATION,
  ADD_APPLICATION,
  EDIT_APPLICATION,
} from './graphql/mutations';
import { PreviewService } from '../../../services/preview.service';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { ApolloQueryResult } from '@apollo/client';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import {
  TableSort,
  UIPageChangeEvent,
  handleTablePageEvent,
} from '@oort-front/ui';
import { SnackbarService } from '@oort-front/ui';
import { GET_APPLICATIONS } from './graphql/queries';

/** Default number of items per request for pagination */
const DEFAULT_PAGE_SIZE = 10;

/** Applications page component. */
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public updating = false;
  private applicationsQuery!: QueryRef<ApplicationsApplicationNodesQueryResponse>;
  public applications = new Array<Application>();
  public cachedApplications: Application[] = [];
  public displayedColumns = [
    'name',
    'createdAt',
    'status',
    'usersCount',
    'actions',
  ];
  public newApplications: Application[] = [];
  public filter: any = {
    filters: [],
    logic: 'and',
  };
  private sort: TableSort = { active: '', sortDirection: '' };

  public pageInfo = {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
    length: 0,
    endCursor: '',
  };

  /**
   * Applications page component
   *
   * @param apollo Apollo service
   * @param dialog Dialog service
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param previewService Shared preview service
   * @param confirmService Share confirm service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    public dialog: Dialog,
    private router: Router,
    private snackBar: SnackbarService,
    private previewService: PreviewService,
    private confirmService: ConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Creates the application query and subscribes to the query changes.
   */
  ngOnInit(): void {
    this.applicationsQuery =
      this.apollo.watchQuery<ApplicationsApplicationNodesQueryResponse>({
        query: GET_APPLICATIONS,
        variables: {
          first: DEFAULT_PAGE_SIZE,
          afterCursor: null,
          filter: this.filter,
          sortField: this.sort?.sortDirection && this.sort.active,
          sortOrder: this.sort?.sortDirection,
        },
      });
    this.apollo
      .query<ApplicationsApplicationNodesQueryResponse>({
        query: GET_APPLICATIONS,
        fetchPolicy: 'no-cache',
        variables: {
          first: 5,
          sortField: 'modifiedAt',
          sortOrder: 'desc',
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.newApplications = data.applications.edges.map((x) => x.node);
      });
    this.applicationsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (
          results: ApolloQueryResult<ApplicationsApplicationNodesQueryResponse>
        ) => {
          this.updateValues(results.data, results.loading);
        }
      );
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
      this.cachedApplications
    );
    if (cachedData && cachedData.length === this.pageInfo.pageSize) {
      this.applications = cachedData;
    } else {
      this.fetchApplications();
    }
  }

  /**
   * Filters applications and updates table.
   *
   * @param filter filter event.
   */
  onFilter(filter: any): void {
    this.filter = filter;
    this.fetchApplications(true);
  }

  /**
   * Handle sort change.
   *
   * @param event sort event
   */
  onSort(event: TableSort): void {
    this.sort = event;
    this.fetchApplications(true);
  }

  /**
   * Update applications query.
   *
   * @param refetch erase previous query results
   */
  private fetchApplications(refetch?: boolean): void {
    this.updating = true;
    const variables = {
      first: this.pageInfo.pageSize,
      afterCursor: refetch ? null : this.pageInfo.endCursor,
      filter: this.filter,
      sortField: this.sort?.sortDirection && this.sort.active,
      sortOrder: this.sort?.sortDirection,
    };
    const cachedValues: ApplicationsApplicationNodesQueryResponse =
      getCachedValues(this.apollo.client, GET_APPLICATIONS, variables);
    if (refetch) {
      this.cachedApplications = [];
      this.pageInfo.pageIndex = 0;
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (refetch) {
        // Rebuild the query
        this.applicationsQuery.refetch(variables);
      } else {
        // Fetch more records
        this.applicationsQuery
          .fetchMore({
            variables,
          })
          .then(
            (
              results: ApolloQueryResult<ApplicationsApplicationNodesQueryResponse>
            ) => {
              this.updateValues(results.data, results.loading);
            }
          );
      }
    }
  }

  /**
   * Deletes an application if authorized.
   *
   * @param element application.
   * @param e click event.
   */
  onDelete(element: any, e?: any): void {
    if (e) {
      e.stopPropagation();
    }
    const dialogRef = this.confirmService.openConfirmModal({
      title: this.translate.instant('common.deleteObject', {
        name: this.translate.instant('common.application.one'),
      }),
      content: this.translate.instant(
        'components.application.delete.confirmationMessage',
        { name: element.name }
      ),
      confirmText: this.translate.instant('components.confirmModal.delete'),
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const id = element.id;
        this.apollo
          .mutate<DeleteApplicationMutationResponse>({
            mutation: DELETE_APPLICATION,
            variables: {
              id,
            },
          })
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotDeleted',
                    {
                      value: this.translate.instant('common.application.one'),
                      error: errors ? errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
              } else {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: this.translate.instant('common.application.one'),
                  })
                );
                this.applications = this.applications.filter(
                  (x) => x.id !== data?.deleteApplication.id
                );
                this.newApplications = this.newApplications.filter(
                  (x) => x.id !== data?.deleteApplication.id
                );
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  /**
   * Displays the AddApplication component.
   * Adds a new application once closed, if result exists.
   */
  onAdd(): void {
    this.apollo
      .mutate<AddApplicationMutationResponse>({
        mutation: ADD_APPLICATION,
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (errors?.length) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotCreated', {
                type: this.translate
                  .instant('common.application.one')
                  .toLowerCase(),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            if (data) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectCreated', {
                  type: this.translate.instant('common.application.one'),
                  value: data.addApplication.name,
                })
              );
              const id = data.addApplication.id;
              this.router.navigate(['/applications', id]);
            }
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Edits the permissions layer.
   *
   * @param e permissions.
   * @param element application.
   */
  saveAccess(e: any, element: Application): void {
    this.apollo
      .mutate<EditApplicationMutationResponse>({
        mutation: EDIT_APPLICATION,
        variables: {
          id: element.id,
          permissions: e,
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.access'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            if (data) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.access'),
                  value: element.name,
                })
              );
              const index = this.applications.findIndex(
                (x) => x.id === element.id
              );
              this.applications[index] = data.editApplication;
              // eslint-disable-next-line no-self-assign
              this.applications = this.applications;
            }
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Opens a dialog to choose roles to fit in the preview.
   *
   * @param element application to preview.
   */
  async onPreview(element: Application): Promise<void> {
    const { ChoseRoleComponent } = await import(
      './components/chose-role/chose-role.component'
    );
    const dialogRef = this.dialog.open(ChoseRoleComponent, {
      data: {
        application: element.id,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.previewService.setRole(value.role);
        this.router.navigate(['./app-preview', element.id]);
      }
    });
  }

  /**
   * Opens a dialog to give a name for the duplicated application.
   *
   * @param application application to duplicate.
   */
  async onClone(application: Application): Promise<void> {
    const { DuplicateApplicationModalComponent } = await import(
      '../../../components/duplicate-application-modal/duplicate-application-modal.component'
    );
    const dialogRef = this.dialog.open(DuplicateApplicationModalComponent, {
      data: {
        id: application.id,
        name: application.name,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.onOpenApplication(value.id);
      }
    });
  }

  /**
   * Navigates to application.
   *
   * @param id application id.
   */
  onOpenApplication(id: string): void {
    this.router.navigate(['/applications', id]);
  }

  /**
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(
    data: ApplicationsApplicationNodesQueryResponse,
    loading: boolean
  ): void {
    const mappedValues = data.applications.edges.map((x) => x.node);
    this.cachedApplications = updateQueryUniqueValues(
      this.cachedApplications,
      mappedValues
    );
    this.pageInfo.length = data.applications.totalCount;
    this.pageInfo.endCursor = data.applications.pageInfo.endCursor;
    this.loading = loading;
    this.applications = this.cachedApplications.slice(
      this.pageInfo.pageSize * this.pageInfo.pageIndex,
      this.pageInfo.pageSize * (this.pageInfo.pageIndex + 1)
    );
    this.updating = false;
  }
}
