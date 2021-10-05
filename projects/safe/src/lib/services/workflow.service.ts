import {Apollo} from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../graphql/queries';
import { AddStepMutationResponse, ADD_STEP } from '../graphql/mutations';
import { Workflow } from '../models/workflow.model';
import { SafeSnackBarService } from './snackbar.service';
import { ContentType } from '../models/page.model';
import { Step } from '../models/step.model';
import { Record } from '../models/record.model';
import { NOTIFICATIONS } from '../const/notifications';

@Injectable({
  providedIn: 'root'
})
export class SafeWorkflowService {

  private workflow = new BehaviorSubject<Workflow | null>(null);
  private records = new BehaviorSubject<Record[]>([]);

  /*  Return the workflow as an Observable.
  */
  get workflow$(): Observable<Workflow | null> {
    return this.workflow.asObservable();
  }

  /*  Return records as an Observable.
  */
  get records$(): Observable<Record[]> {
    return this.records.asObservable();
  }

  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) { }

  /*  Get the workflow from the database, using GraphQL.
  */
  loadWorkflow(id: any): void {
    this.apollo.query<GetWorkflowByIdQueryResponse>({
      query: GET_WORKFLOW_BY_ID,
      variables: {
        id
      }
    }).subscribe(res => {
      this.workflow.next(res.data.workflow);
    });
  }

  /* Add a step to the opened workflow and navigate to it.
  */
  addStep(value: any, route: ActivatedRoute): void {
    const workflow = this.workflow.getValue();
    if (workflow) {
      this.apollo.mutate<AddStepMutationResponse>({
        mutation: ADD_STEP,
        variables: {
          type: value.type,
          content: value.content,
          workflow: workflow.id
        }
      }).subscribe(res => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectCreated('step', res.data.addStep.name));
          this.loadWorkflow(workflow.id);
          if (value.type === ContentType.form) {
            this.router.navigate(['../' + value.type + '/' + res.data.addStep.id], { relativeTo: route.parent });
          } else {
            this.router.navigate(['../' + value.type + '/' + res.data.addStep.content], { relativeTo: route.parent });
          }
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectNotEdited('Workflow', res.errors ? res.errors[0].message : ''), { error: true });
        }
      });
    } else {
      this.snackBar.openSnackBar(NOTIFICATIONS.noObjectOpened('workflow'), { error: true });
      this.router.navigate(['../'], { relativeTo: route });
    }
  }

  /* Update a specific step name in the opened workflow.
  */
  updateStepName(step: Step): void {
    const workflow = this.workflow.getValue();
    if (workflow) {
      const newWorkflow: Workflow = { ...workflow, steps: workflow.steps?.map(x => {
        if (x.id === step.id) {
          x = { ...x, name: step.name };
        }
        return x;
      }) };
      this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('step', step.name));
      this.workflow.next(newWorkflow);
    }
  }

  /*  Store records used to prefill next step form
  */
  storeRecords(records: Record[]): void {
    this.records.next(records);
  }
}
