import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Channel,
  PullJob,
  status,
  SafeConfirmModalComponent,
  SafeSnackBarService,
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
import { PullJobModalComponent } from './components/pull-job-modal/pull-job-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

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
export class PullJobsComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  private pullJobsQuery!: QueryRef<GetPullJobsQueryResponse>;
  public pullJobs = new MatTableDataSource<PullJob>([]);
  public cachedPullJobs: PullJob[] = [];

  public displayedColumns: string[] = [
    'name',
    'status',
    'apiConfiguration',
    'convertTo',
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
   * @param translate Service used to get the translations.
   */
  constructor(
    public dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.pullJobsQuery = this.apollo.watchQuery<GetPullJobsQueryResponse>({
      query: GET_PULL_JOBS,
      variables: {
        first: ITEMS_PER_PAGE,
      },
    });

    this.pullJobsQuery.valueChanges.subscribe((res) => {
      this.cachedPullJobs = res.data.pullJobs.edges.map((x) => x.node);
      this.pullJobs.data = this.cachedPullJobs.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
      );
      this.pageInfo.length = res.data.pullJobs.totalCount;
      this.pageInfo.endCursor = res.data.pullJobs.pageInfo.endCursor;
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
    if (
      e.pageIndex > e.previousPageIndex &&
      e.length > this.cachedPullJobs.length
    ) {
      this.loading = true;
      this.pullJobsQuery.fetchMore({
        variables: {
          first: ITEMS_PER_PAGE,
          afterCursor: this.pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return Object.assign({}, prev, {
            pullJobs: {
              edges: [
                ...prev.pullJobs.edges,
                ...fetchMoreResult.pullJobs.edges,
              ],
              pageInfo: fetchMoreResult.pullJobs.pageInfo,
              totalCount: fetchMoreResult.pullJobs.totalCount,
            },
          });
        },
      });
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
    const dialogRef = this.dialog.open(PullJobModalComponent, {
      width: '600px',
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
              .subscribe((res) => {
                if (res.data?.addPullJob) {
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
                      res.data?.addPullJob,
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
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: this.translate.instant('components.pullJob.delete.title'),
          content: this.translate.instant(
            'components.pullJob.delete.confirmationMessage',
            {
              name: element.name,
            }
          ),
          confirmText: this.translate.instant('components.confirmModal.delete'),
          cancelText: this.translate.instant('components.confirmModal.cancel'),
          confirmColor: 'warn',
        },
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.apollo
            .mutate<DeletePullJobMutationResponse>({
              mutation: DELETE_PULL_JOB,
              variables: {
                id: element.id,
              },
            })
            .subscribe((res) => {
              if (res.data?.deletePullJob) {
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectDeleted', {
                    value: this.translate.instant('common.pullJob.one'),
                  })
                );
                this.cachedPullJobs = this.cachedPullJobs.filter(
                  (x) => x.id !== res.data?.deletePullJob.id
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
    const dialogRef = this.dialog.open(PullJobModalComponent, {
      width: '600px',
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
              .subscribe((res) => {
                if (res.data?.editPullJob) {
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
                      if (pullJob.id === res.data?.editPullJob.id) {
                        pullJob = res.data?.editPullJob || pullJob;
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

  ngOnDestroy(): void {}
}
