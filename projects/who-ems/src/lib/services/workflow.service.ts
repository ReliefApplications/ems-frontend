import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../graphql/queries';
import { AddStepMutationResponse, ADD_STEP } from '../graphql/mutations';
import { Workflow } from '../models/workflow.model';
import { WhoSnackBarService } from './snackbar.service';
import { ContentType } from '../models/page.model';
import { Step } from '../models/step.model';
import { Record } from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class WhoWorkflowService {

  // tslint:disable-next-line: variable-name
  private _workflow = new BehaviorSubject<Workflow>(null);
  // tslint:disable-next-line: variable-name
  private _records = new BehaviorSubject<Record[]>(null);

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService,
    private router: Router
  ) { }

  /*  Get the workflow from the database, using GraphQL.
  */
  loadWorkflow(id: string): void {
    this.apollo.watchQuery<GetWorkflowByIdQueryResponse>({
    query: GET_WORKFLOW_BY_ID,
    variables: {
      id
    }
    }).valueChanges.subscribe(res => {
    this._workflow.next(res.data.workflow);
    });
  }

  /*  Return the workflow as an Observable.
  */
  get workflow(): Observable<Workflow> {
    return this._workflow.asObservable();
  }

  /* Add a step to the opened workflow and navigate to it.
  */
  addStep(value: any, route: ActivatedRoute): void {
    const workflow = this._workflow.getValue();
    if (workflow) {
      this.apollo.mutate<AddStepMutationResponse>({
        mutation: ADD_STEP,
        variables: {
          name: value.name,
          type: value.type,
          content: value.content,
          workflow: workflow.id
        }
      }).subscribe(res => {
        this.snackBar.openSnackBar(`${value.name} step created`);
        this.loadWorkflow(workflow.id);
        if (value.type === ContentType.form) {
          this.router.navigate(['../' + value.type + '/' + res.data.addStep.id], { relativeTo: route.parent });
        } else {
          this.router.navigate(['../' + value.type + '/' + res.data.addStep.content], { relativeTo: route.parent });
        }
      });
    } else {
      this.snackBar.openSnackBar('No opened workflow.', { error: true });
      this.router.navigate(['../'], { relativeTo: route });
    }
  }

  /* Update a specific step name in the opened workflow.
  */
  updateStepName(step: Step): void {
    const workflow = this._workflow.getValue();
    workflow.steps = workflow.steps.map(x => {
      if (x.id === step.id) { x.name = step.name; }
      return x;
    });
    this._workflow.next(workflow);
  }

  /*  Store records used to prefill next step form
  */
  storeRecords(records: Record[]): void {
    this._records.next(records);
  }

  /*  Return records as an Observable.
  */
  get records(): Observable<Record[]> {
    return this._records.asObservable();
  }
}
