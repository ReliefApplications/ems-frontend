import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  Channel,
  PullJob,
  status,
  SafeConfirmService,
  SafeSnackBarService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import { Apollo, QueryRef } from 'apollo-angular';
import { GetPullJobsQueryResponse, GET_PULL_JOBS } from './graphql/queries';
import {
  AddPullJobMutationResponse,
  ADD_PULL_JOB,
  DeletePullJobMutationResponse,
  DELETE_PULL_JOB,
  EditPullJobMutationResponse,
  EDIT_PULL_JOB,
} from './graphql/mutations';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { TranslateService } from '@ngx-translate/core';
import { EditPullJobModalComponent } from './components/edit-pull-job-modal/edit-pull-job-modal.component';
import { ApolloQueryResult } from '@apollo/client';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import { takeUntil } from 'rxjs';

/**
 * Limit of pull jobs shown at once.
 */
const ITEMS_PER_PAGE = 10;

/**
 * Shows all pull-jobs avilable.
 */
@Component({
  selector: 'app-pull-jobs',
  templateUrl: './pull-jobs.component.html',
  styleUrls: ['./pull-jobs.component.scss'],
})
export class PullJobsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  private pullJobsQuery!: QueryRef<GetPullJobsQueryResponse>;
  public pullJobs = new MatTableDataSource<PullJob>([]);
  public cachedPullJobs: PullJob[] = [];

  public displayedColumns: string[] = [
    'name',
    'status',
    // 'apiConfiguration',
    // 'convertTo',
    'schedule',
    'actions',
  ];

  // === SUBSCRIPTIONS ===
  private channels: Channel[] = [];

  public pageInfo = {
    pageIndex: 0,
    pageSize: ITEMS_PER_PAGE,
    length: 0,
    endCursor: '',
  };

  /**
   * PullJobsComponent constructor.
   *
   * @param dialog Used to show popup dialog.
   * @param apollo Loads the pull jobs.
   * @param snackBar Service usde to show a snackbar.
   * @param confirmService Shared confirm service
   * @param translate Service used to get the translations.
   */
  constructor(
    public dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.pullJobsQuery = this.apollo.watchQuery<GetPullJobsQueryResponse>({
      query: GET_PULL_JOBS,
      variables: {
        first: ITEMS_PER_PAGE,
        afterCursor: this.pageInfo.endCursor,
      },
    });

    this.pullJobsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        this.updateValues(results.data, results.loading);
      });
  }

  /**
   * Handles page event.
   *
   * @param e page event.
   */
  onPage(e: any): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (
      ((e.pageIndex > e.previousPageIndex &&
        e.pageIndex * this.pageInfo.pageSize >= this.cachedPullJobs.length) ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.length > this.cachedPullJobs.length
    ) {
      this.loading = true;
      const variables = {
        first: ITEMS_PER_PAGE,
        afterCursor: this.pageInfo.endCursor,
      };
      const cachedValues: GetPullJobsQueryResponse = getCachedValues(
        this.apollo.client,
        GET_PULL_JOBS,
        variables
      );
      if (cachedValues) {
        this.updateValues(cachedValues, false);
      } else {
        this.pullJobsQuery
          .fetchMore({ variables })
          .then((results: ApolloQueryResult<GetPullJobsQueryResponse>) => {
            this.updateValues(results.data, results.loading);
          });
      }
    } else {
      this.pullJobs.data = this.cachedPullJobs.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
      );
    }
  }

  /**
   * Displays the AddSubscription modal.
   * Creates the pull job on close.
   */
  onAdd(): void {
    const dialogRef = this.dialog.open(EditPullJobModalComponent, {
      autoFocus: false,
      data: {
        channels: this.channels,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (value: {
          name: string;
          status: status;
          apiConfiguration: string;
          url?: string;
          path?: string;
          schedule?: string;
          convertTo?: string;
          channel?: string;
          mapping?: any;
          rawMapping?: any;
          uniqueIdentifiers?: any;
        }) => {
          if (value) {
            const variables = {
              name: value.name,
              status: value.status,
              apiConfiguration: value.apiConfiguration,
            };
            Object.assign(
              variables,
              value.url && { url: value.url },
              value.path && { path: value.path },
              value.schedule && { schedule: value.schedule },
              value.convertTo && { convertTo: value.convertTo },
              value.channel && { channel: value.channel },
              value.rawMapping && { mapping: JSON.parse(value.rawMapping) },
              value.uniqueIdentifiers && {
                uniqueIdentifiers: value.uniqueIdentifiers,
              }
            );
            this.apollo
              .mutate<AddPullJobMutationResponse>({
                mutation: ADD_PULL_JOB,
                variables,
              })
              .subscribe(({ data }) => {
                if (data?.addPullJob) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectCreated',
                      {
                        type: this.translate
                          .instant('common.pullJob.one')
                          .toLowerCase(),
                        value: value.name,
                      }
                    )
                  );
                  if (this.cachedPullJobs.length === this.pageInfo.length) {
                    this.cachedPullJobs = this.cachedPullJobs.concat([
                      data?.addPullJob,
                    ]);
                    this.pullJobs.data = this.cachedPullJobs.slice(
                      ITEMS_PER_PAGE * this.pageInfo.pageIndex,
                      ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
                    );
                  }
                  this.pageInfo.length += 1;
                }
              });
          }
        }
      );
  }

  /**
   * Deletes a pull job.
   *
   * @param element pull job to delete.
   */
  onDelete(element: any): void {
    if (element) {
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('components.pullJob.delete.title'),
        content: this.translate.instant(
          'components.pullJob.delete.confirmationMessage',
          {
            name: element.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmColor: 'warn',
      });
      dialogRef.afterClosed().subscribe((value: any) => {
        if (value) {
          this.apollo
            .mutate<DeletePullJobMutationResponse>({
              mutation: DELETE_PULL_JOB,
              variables: {
                id: element.id,
              },
            })
            .subscribe(({ data }) => {
              if (data?.deletePullJob) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: this.translate.instant('common.pullJob.one'),
                  })
                );
                this.cachedPullJobs = this.cachedPullJobs.filter(
                  (x) => x.id !== data?.deletePullJob.id
                );
                this.pageInfo.length -= 1;
                this.pullJobs.data = this.cachedPullJobs.slice(
                  ITEMS_PER_PAGE * this.pageInfo.pageIndex,
                  ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
                );
              }
            });
        }
      });
    }
  }

  /**
   * Edits a pull job.
   *
   * @param element pull job to edit.
   */
  onEdit(element: any): void {
    const dialogRef = this.dialog.open(EditPullJobModalComponent, {
      data: {
        channels: this.channels,
        pullJob: element,
      },
    });
    dialogRef
      .afterClosed()
      .subscribe(
        (value: {
          name: string;
          status: status;
          apiConfiguration: string;
          url?: string;
          path?: string;
          schedule?: string;
          convertTo?: string;
          channel?: string;
          mapping?: any;
          rawMapping?: any;
          uniqueIdentifiers?: any;
        }) => {
          if (value) {
            const variables = {
              id: element.id,
            };
            Object.assign(
              variables,
              value.name && { name: value.name },
              value.status && { status: value.status },
              value.apiConfiguration && {
                apiConfiguration: value.apiConfiguration,
              },
              value.url && { url: value.url },
              value.path && { path: value.path },
              value.schedule && { schedule: value.schedule },
              value.convertTo && { convertTo: value.convertTo },
              value.channel && { channel: value.channel },
              value.rawMapping && { mapping: JSON.parse(value.rawMapping) },
              value.uniqueIdentifiers && {
                uniqueIdentifiers: value.uniqueIdentifiers,
              }
            );
            this.apollo
              .mutate<EditPullJobMutationResponse>({
                mutation: EDIT_PULL_JOB,
                variables,
              })
              .subscribe(({ data }) => {
                if (data?.editPullJob) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectUpdated',
                      {
                        type: this.translate.instant('common.pullJob.one')
                          .toLowerCase,
                        value: value.name,
                      }
                    )
                  );
                  this.cachedPullJobs = this.cachedPullJobs.map(
                    (pullJob: PullJob) => {
                      if (pullJob.id === data?.editPullJob.id) {
                        pullJob = data?.editPullJob || pullJob;
                      }
                      return pullJob;
                    }
                  );
                  this.pullJobs.data = this.cachedPullJobs.slice(
                    ITEMS_PER_PAGE * this.pageInfo.pageIndex,
                    ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
                  );
                }
              });
          }
        }
      );
  }

  /**
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(data: GetPullJobsQueryResponse, loading: boolean): void {
    this.cachedPullJobs = updateQueryUniqueValues(
      this.cachedPullJobs,
      data.pullJobs.edges.map((x) => x.node)
    );
    this.pullJobs.data = this.cachedPullJobs.slice(
      ITEMS_PER_PAGE * this.pageInfo.pageIndex,
      ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
    );
    this.pageInfo.length = data.pullJobs.totalCount;
    this.pageInfo.endCursor = data.pullJobs.pageInfo.endCursor;
    this.loading = loading;
  }
}
