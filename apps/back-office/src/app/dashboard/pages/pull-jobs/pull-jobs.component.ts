import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import {
  Channel,
  PullJob,
  SafeConfirmService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
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
import { TranslateService } from '@ngx-translate/core';
import { ApolloQueryResult } from '@apollo/client';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';
import { takeUntil } from 'rxjs';
import { SnackbarService, UIPageChangeEvent } from '@oort-front/ui';

/**
 * Limit of pull jobs shown at once.
 */
const ITEMS_PER_PAGE = 10;

/**
 * Shows all pull-jobs available.
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
  public pullJobs = new Array<PullJob>();
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
   * @param snackBar Service used to show a snackbar.
   * @param confirmService Shared confirm service
   * @param translate Service used to get the translations.
   */
  constructor(
    public dialog: Dialog,
    private apollo: Apollo,
    private snackBar: SnackbarService,
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
  onPage(e: UIPageChangeEvent): void {
    this.pageInfo.pageIndex = e.pageIndex;
    if (
      ((e.pageIndex > e.previousPageIndex &&
        e.pageIndex * this.pageInfo.pageSize >= this.cachedPullJobs.length) ||
        e.pageSize > this.pageInfo.pageSize) &&
      e.totalItems > this.cachedPullJobs.length
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
      this.pullJobs = this.cachedPullJobs.slice(
        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
      );
    }
  }

  /**
   * Displays the AddSubscription modal.
   * Creates the pull job on close.
   */
  async onAdd(): Promise<void> {
    const { EditPullJobModalComponent } = await import(
      './components/edit-pull-job-modal/edit-pull-job-modal.component'
    );
    const dialogRef = this.dialog.open(EditPullJobModalComponent, {
      autoFocus: false,
      data: {
        channels: this.channels,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate
                        .instant('common.pullJob.one')
                        .toLowerCase(),
                      error: errors ? errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
              } else {
                if (data?.addPullJob) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectCreated',
                      {
                        type: this.translate.instant('common.pullJob.one'),
                        value: value.name,
                      }
                    )
                  );
                  if (this.cachedPullJobs.length === this.pageInfo.length) {
                    this.cachedPullJobs = this.cachedPullJobs.concat([
                      data?.addPullJob,
                    ]);
                    this.pullJobs = this.cachedPullJobs.slice(
                      ITEMS_PER_PAGE * this.pageInfo.pageIndex,
                      ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
                    );
                  }
                  this.pageInfo.length += 1;
                }
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
        confirmVariant: 'danger',
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.apollo
              .mutate<DeletePullJobMutationResponse>({
                mutation: DELETE_PULL_JOB,
                variables: {
                  id: element.id,
                },
              })
              .subscribe({
                next: ({ errors, data }) => {
                  if (errors) {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'common.notifications.objectNotDeleted',
                        {
                          value: this.translate.instant('common.pullJob.one'),
                          error: errors ? errors[0].message : '',
                        }
                      ),
                      { error: true }
                    );
                  } else {
                    if (data?.deletePullJob) {
                      this.snackBar.openSnackBar(
                        this.translate.instant(
                          'common.notifications.objectDeleted',
                          {
                            value: this.translate.instant('common.pullJob.one'),
                          }
                        )
                      );
                      this.cachedPullJobs = this.cachedPullJobs.filter(
                        (x) => x.id !== data?.deletePullJob.id
                      );
                      this.pageInfo.length -= 1;
                      this.pullJobs = this.cachedPullJobs.slice(
                        ITEMS_PER_PAGE * this.pageInfo.pageIndex,
                        ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
                      );
                    }
                  }
                },
                error: (err) => {
                  this.snackBar.openSnackBar(err.message, { error: true });
                },
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
  async onEdit(element: any): Promise<void> {
    const { EditPullJobModalComponent } = await import(
      './components/edit-pull-job-modal/edit-pull-job-modal.component'
    );
    const dialogRef = this.dialog.open(EditPullJobModalComponent, {
      data: {
        channels: this.channels,
        pullJob: element,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
          .subscribe({
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotUpdated',
                    {
                      value: this.translate.instant('common.pullJob.one'),
                      error: errors ? errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
              } else {
                if (data?.editPullJob) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectUpdated',
                      {
                        type: this.translate
                          .instant('common.pullJob.one')
                          .toLowerCase(),
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
                  this.pullJobs = this.cachedPullJobs.slice(
                    ITEMS_PER_PAGE * this.pageInfo.pageIndex,
                    ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
                  );
                }
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
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(data: GetPullJobsQueryResponse, loading: boolean): void {
    const mappedValues = data.pullJobs.edges.map((x) => x.node);
    this.cachedPullJobs = updateQueryUniqueValues(
      this.cachedPullJobs,
      mappedValues
    );
    this.pageInfo.length = data.pullJobs.totalCount;
    this.pageInfo.endCursor = data.pullJobs.pageInfo.endCursor;
    this.pullJobs = this.cachedPullJobs.slice(
      ITEMS_PER_PAGE * this.pageInfo.pageIndex,
      ITEMS_PER_PAGE * (this.pageInfo.pageIndex + 1)
    );
    this.loading = loading;
  }
}
