import { Apollo } from 'apollo-angular';
import { EventEmitter, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  GetWorkflowByIdQueryResponse,
  GET_WORKFLOW_BY_ID,
} from './graphql/queries';
import {
  AddStepMutationResponse,
  ADD_STEP,
  EditStepMutationResponse,
  EDIT_STEP,
} from './graphql/mutations';
import { Workflow } from '../../models/workflow.model';
import { ContentType } from '../../models/page.model';
import { Step } from '../../models/step.model';
import { SafeApplicationService } from '../application/application.service';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';

/**
 * Defines the type for workflow context.
 * Contains the ids of selected rows for each grid when the 'Next step' button is clicked.
 */
type WorkflowContext = {
  // each key is a dashboard id
  [key: string]: {
    // each key is a widget id
    [key: string]: string[];
  };
};

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

  public nextStep = new EventEmitter<void>();

  /** Current workflow context */
  private workflowContext = new BehaviorSubject<WorkflowContext>({});
  /** @returns Current workflow context as observable */
  get workflowContext$(): Observable<WorkflowContext> {
    return this.workflowContext.asObservable();
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
    private applicationService: SafeApplicationService,
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
      .query<GetWorkflowByIdQueryResponse>({
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
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.step.one'),
                error: errors[0].message,
              }),
              { error: true }
            );
          } else {
            if (data) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.step.one').toLowerCase(),
                  value: step.name,
                })
              );
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

  /**
   * Adds a context to the workflow context.
   *
   * @param dashboardId dashboard id
   * @param widgetId widget id
   * @param rows selected rows
   */
  public addToContext(
    dashboardId: string,
    widgetId: string,
    rows: string[]
  ): void {
    const context = this.workflowContext.getValue();
    if (!context[dashboardId]) {
      context[dashboardId] = {};
    }
    context[dashboardId][widgetId] = rows;
    this.workflowContext.next(context);
  }
}
