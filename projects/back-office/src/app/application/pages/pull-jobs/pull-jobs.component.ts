import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Application, Channel, PullJob, SafeApplicationService, status, SafeConfirmModalComponent, SafeSnackBarService, NOTIFICATIONS } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { AddPullJobMutationResponse, ADD_PULL_JOB,
  DeletePullJobMutationResponse, DELETE_PULL_JOB,
  EditPullJobMutationResponse, EDIT_PULL_JOB } from '../../../graphql/mutations';
import { PullJobModalComponent } from './components/pull-job-modal/pull-job-modal.component';

@Component({
  selector: 'app-pull-jobs',
  templateUrl: './pull-jobs.component.html',
  styleUrls: ['./pull-jobs.component.scss']
})
export class PullJobsComponent implements OnInit, OnDestroy {

  // === DATA ===
  public applicationId = '';
  public pullJobs: PullJob[] = [];
  public loading = true;
  public displayedColumns: string[] = ['name', 'status', 'apiConfiguration', 'convertTo', 'actions'];

  // === SUBSCRIPTIONS ===
  private applicationSubscription?: Subscription;
  private channels: Channel[] = [];

  constructor(
    private applicationService: SafeApplicationService,
    public dialog: MatDialog,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService
  ) { }

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription = this.applicationService.application.subscribe((application: Application | null) => {
      if (application) {
        this.applicationId = application.id || '';
        this.pullJobs = application.pullJobs ? [...application.pullJobs] : [];
        this.channels = application.channels || [];
      } else {
        this.pullJobs = [];
      }
    });
  }

  /* Display the AddSubscription modal.
    Create a new subscription linked to this application on close.
  */
  onAdd(): void {
    const dialogRef = this.dialog.open(PullJobModalComponent, {
      width: '600px',
      data: {
        channels: this.channels
      }
    });
    dialogRef.afterClosed().subscribe((value: {
      name: string,
      status: status,
      apiConfiguration: string;
      schedule?: string;
      convertTo?: string;
      mapping?: any;
      channel?: string;
    }) => {
      if (value) {
        const variables = {
          application: this.applicationId,
          name: value.name,
          status: value.status,
          apiConfiguration: value.apiConfiguration
        };
        Object.assign(variables,
          value.schedule && { schedule: value.schedule },
          value.convertTo && { convertTo: value.convertTo },
          value.mapping && { mapping: value.mapping },
          value.channel && { channel: value.channel },
        );
        this.apollo.mutate<AddPullJobMutationResponse>({
          mutation: ADD_PULL_JOB,
          variables
        }).subscribe(res => {
          if (res.data?.addPullJob) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated('pull job', value.name));
            this.pullJobs = this.pullJobs.concat([res.data?.addPullJob]);
            this.applicationService.updatePullJobs(this.pullJobs);
          }
        });
      }
    });
  }

  onDelete(element: any): void {
    if (element) {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: 'Delete pull job',
          content: `Do you confirm the deletion of the pull job ${element.name} ?`,
          confirmText: 'Delete',
          confirmColor: 'warn'
        }
      });
      dialogRef.afterClosed().subscribe(value => {
        if (value) {
          this.apollo.mutate<DeletePullJobMutationResponse>({
            mutation: DELETE_PULL_JOB,
            variables: {
              application: this.applicationId,
              id: element.id
            }
          }).subscribe(res => {
            if (res.data?.deletePullJob) {
              this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Pull job'));
              this.pullJobs = this.pullJobs.filter(x => x.id !== res.data?.deletePullJob.id);
              this.applicationService.updatePullJobs(this.pullJobs);
            }
          });
        }
      });
    }
  }

  onEdit(element: any): void {
    const dialogRef = this.dialog.open(PullJobModalComponent, {
      width: '600px',
      data: {
        channels: this.channels,
        pullJob: element,
      }
    });
    dialogRef.afterClosed().subscribe((value: {
      name: string,
      status: status,
      apiConfiguration: string;
      schedule?: string;
      convertTo?: string;
      mapping?: any;
      channel?: string;
    }) => {
      if (value) {
        const variables = {
          application: this.applicationId,
          id: element.id,
        };
        Object.assign(variables,
          value.name && { name: value.name },
          value.status && { status: value.status },
          value.apiConfiguration && { apiConfiguration: value.apiConfiguration },
          value.schedule && { schedule: value.schedule },
          value.convertTo && { convertTo: value.convertTo },
          value.mapping && { mapping: value.mapping },
          value.channel && { channel: value.channel },
        );
        this.apollo.mutate<EditPullJobMutationResponse>({
          mutation: EDIT_PULL_JOB,
          variables
        }).subscribe(res => {
          if (res.data?.editPullJob) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('pull job', value.name));
            this.pullJobs = this.pullJobs.map((pullJob: PullJob) => {
              if (pullJob.id === res.data?.editPullJob.id) {
                pullJob = res.data?.editPullJob || pullJob;
              }
              return pullJob;
            });
            this.applicationService.updatePullJobs(this.pullJobs);
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
