import { Injectable } from '@angular/core';
import { Workflow, WhoSnackBarService } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../graphql/queries';
import { AddStepMutationResponse, ADD_STEP } from '../graphql/mutations';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  // tslint:disable-next-line: variable-name
  private _workflow = new BehaviorSubject<Workflow>(null);

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
        const content = res.data.addStep.content;
        this.router.navigate(['../' + value.type + '/' + content], { relativeTo: route.parent });
      });
    } else {
      this.snackBar.openSnackBar('No opened workflow.', { error: true });
      this.router.navigate(['../'], { relativeTo: route });
    }
  }
}
