import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { GET_WORKFLOW_BY_ID } from './graphql/queries';
import { ADD_STEP, EDIT_STEP } from './graphql/mutations';
import { Workflow, WorkflowQueryResponse } from '../../models/workflow.model';
import { ContentType } from '../../models/page.model';
import {
  AddStepMutationResponse,
  EditStepMutationResponse,
  Step,
} from '../../models/step.model';
import { ApplicationService } from '../application/application.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';

/**
 * Workflow service. Handles modification of workflow ( step addition / step name update ) and some workflow actions.
 */
@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  /** Current workflow */
  private workflow = new BehaviorSubject<Workflow | null>(null);

  /** @returns Current workflow as observable */
  get workflow$(): Observable<Workflow | null> {
    return this.workflow.asObservable();
  }

  /**
   * Workflow service. Handles modification of workflow ( step addition / step name update ) and some workflow actions.
   *
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param applicationService Shared application service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SnackbarService,
    private router: Router,
    private applicationService: ApplicationService,
    private translate: TranslateService
  ) {}

  /**
   * Gets the workflow from the database, using GraphQL.
   *
   * @param id workflow id.
   */
  loadWorkflow(id: any): void {
    this.workflow.next(null);
    this.apollo
      .query<WorkflowQueryResponse>({
        query: GET_WORKFLOW_BY_ID,
        variables: {
          id,
        },
      })
      .subscribe(({ data }) => {
        this.workflow.next(data.workflow);
      });
  }

  /**
   * Adds a step to the opened workflow and navigate to it.
   *
   * @param step step to add.
   * @param route current route.
   */
  addStep(step: any, route: ActivatedRoute): void {
    const workflow = this.workflow.getValue();
    if (workflow) {
      this.apollo
        .mutate<AddStepMutationResponse>({
          mutation: ADD_STEP,
          variables: {
            type: step.type,
            content: step.content,
            workflow: workflow.id,
          },
        })
        .subscribe(({ errors, data }) => {
          if (data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectCreated', {
                type: this.translate.instant('common.step.one').toLowerCase(),
                value: data.addStep.name,
              })
            );
            this.loadWorkflow(workflow.id);
            if (step.type === ContentType.form) {
              this.router.navigate(
                ['../' + step.type + '/' + data.addStep.id],
                { relativeTo: route.parent }
              );
            } else {
              this.router.navigate(
                ['../' + step.type + '/' + data.addStep.content],
                { relativeTo: route.parent }
              );
            }
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.workflow.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          }
        });
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.objectNotFound', {
          name: this.translate.instant('common.workflow.one').toLowerCase(),
        }),
        { error: true }
      );
      this.router.navigate(['../'], { relativeTo: route });
    }
  }

  /**
   * Updates a specific step name in the opened workflow.
   *
   * @param step step to edit.
   * @param callback additional callback
   */
  updateStepName(step: Step, callback?: any): void {
    const workflow = this.workflow.getValue();
    if (workflow) {
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: step.id,
            name: step.name,
          },
        })
        .subscribe(({ errors, data }) => {
          this.applicationService.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.step.one'),
            step.name
          );
          if (!errors && data) {
            const newWorkflow: Workflow = {
              ...workflow,
              steps: workflow.steps?.map((x) => {
                if (x.id === step.id) {
                  x = { ...x, name: step.name };
                }
                return x;
              }),
            };
            this.workflow.next(newWorkflow);
            if (callback) callback();
          }
        });
    }
  }

  /**
   * Update step icon, sending a mutation to the back-end.
   *
   * @param step Edited step
   * @param icon new icon
   * @param callback callback method, allow the component calling the service to do some logic.
   */
  updateStepIcon(step: Step, icon: string, callback?: any): void {
    const workflow = this.workflow.getValue();
    if (workflow) {
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: step.id,
            icon,
          },
        })
        .subscribe(({ errors, data }) => {
          this.applicationService.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.step.one'),
            step.name
          );
          if (!errors && data) {
            const newWorkflow: Workflow = {
              ...workflow,
              steps: workflow.steps?.map((x) => {
                if (x.id === step.id) {
                  x = { ...x, icon: data.editStep.icon };
                }
                return x;
              }),
            };
            this.workflow.next(newWorkflow);
            if (callback) callback();
          }
        });
    }
  }

  /**
   * Update step permissions, sending a mutation to the back-end.
   *
   * @param step Edited step
   * @param permissions new permissions
   * @param callback callback method, allow the component calling the service to do some logic.
   */
  updateStepPermissions(step: Step, permissions: any, callback?: any): void {
    const workflow = this.workflow.getValue();
    if (workflow) {
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: step.id,
            permissions,
          },
        })
        .subscribe(({ errors, data }) => {
          this.applicationService.handleEditionMutationResponse(
            errors,
            this.translate.instant('common.step.one')
          );
          if (!errors && data) {
            const newWorkflow: Workflow = {
              ...workflow,
              permissions: data.editStep.permissions,
            };
            this.workflow.next(newWorkflow);
            if (callback) callback(data.editStep.permissions);
          }
        });
    }
  }

  /**
   * Goes to first page of application.
   */
  closeWorkflow(): void {
    this.applicationService.goToFirstPage();
  }
}
