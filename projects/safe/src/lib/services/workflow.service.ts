import { Apollo } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GetWorkflowByIdQueryResponse,
  GET_WORKFLOW_BY_ID,
} from '../graphql/queries';
import { AddStepMutationResponse, ADD_STEP } from '../graphql/mutations';
import { Workflow } from '../models/workflow.model';
import { SafeSnackBarService } from './snackbar.service';
import { ContentType } from '../models/page.model';
import { Step } from '../models/step.model';
import { NOTIFICATIONS } from '../const/notifications';
import { SafeApplicationService } from './application.service';

/**
 * Workflow service. Handles modification of workflow ( step addition / step name update ) and some workflow actions.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeWorkflowService {
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
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private applicationService: SafeApplicationService
  ) {}

  /**
   * Gets the workflow from the database, using GraphQL.
   *
   * @param id workflow id.
   */
  loadWorkflow(id: any): void {
    this.workflow.next(null);
    this.apollo
      .query<GetWorkflowByIdQueryResponse>({
        query: GET_WORKFLOW_BY_ID,
        variables: {
          id,
        },
      })
      .subscribe((res) => {
        this.workflow.next(res.data.workflow);
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
        .subscribe((res) => {
          if (res.data) {
            this.snackBar.openSnackBar(
              NOTIFICATIONS.objectCreated('step', res.data.addStep.name)
            );
            this.loadWorkflow(workflow.id);
            if (step.type === ContentType.form) {
              this.router.navigate(
                ['../' + step.type + '/' + res.data.addStep.id],
                { relativeTo: route.parent }
              );
            } else {
              this.router.navigate(
                ['../' + step.type + '/' + res.data.addStep.content],
                { relativeTo: route.parent }
              );
            }
          } else {
            this.snackBar.openSnackBar(
              NOTIFICATIONS.objectNotEdited(
                'Workflow',
                res.errors ? res.errors[0].message : ''
              ),
              { error: true }
            );
          }
        });
    } else {
      this.snackBar.openSnackBar(NOTIFICATIONS.noObjectOpened('workflow'), {
        error: true,
      });
      this.router.navigate(['../'], { relativeTo: route });
    }
  }

  /**
   * Updates a specific step name in the opened workflow.
   *
   * @param step step to edit.
   */
  updateStepName(step: Step): void {
    const workflow = this.workflow.getValue();
    if (workflow) {
      const newWorkflow: Workflow = {
        ...workflow,
        steps: workflow.steps?.map((x) => {
          if (x.id === step.id) {
            x = { ...x, name: step.name };
          }
          return x;
        }),
      };
      this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('step', step.name));
      this.workflow.next(newWorkflow);
    }
  }

  /**
   * Goes to first page of application.
   */
  closeWorkflow(): void {
    this.applicationService.goToFirstPage();
  }
}
