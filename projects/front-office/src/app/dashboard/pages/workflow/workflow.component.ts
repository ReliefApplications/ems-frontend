import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Step, WhoSnackBarService, Workflow } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../../../graphql/queries';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {

  // === DATA ===
  public id: string;
  public loading = true;
  public workflow: Workflow;
  public steps: Step[];

  // === ROUTE ===
  private routeSubscription: Subscription;

  // === SELECTED STEP ===
  public selectedStep: Step;
  public selectedIndex: number;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: WhoSnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.apollo.watchQuery<GetWorkflowByIdQueryResponse>({
        query: GET_WORKFLOW_BY_ID,
        variables: {
          id: this.id
        }
      }).valueChanges.subscribe((res) => {
        if (res.data.workflow) {
          this.workflow = res.data.workflow;
          this.steps = res.data.workflow.steps;
          this.loading = res.loading;
          if (this.steps.length > 0) { 
            this.stepChange({selectedIndex: 0});
          }
        } else {
          this.snackBar.openSnackBar('No access provided to this workflow.', { error: true });
        }
      },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
    });
  }

  /* Display selected step
  */
  stepChange(e): void {
    this.selectedStep = this.steps[e.selectedIndex];
    this.selectedIndex = e.selectedIndex;
    this.router.navigate(['./' + this.selectedStep.type + '/' + this.selectedStep.content ], { relativeTo: this.route });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
