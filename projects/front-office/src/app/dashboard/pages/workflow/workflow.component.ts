import {Apollo} from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentType, Step, SafeSnackBarService, Workflow, NOTIFICATIONS } from '@safe/builder';

import { Subscription } from 'rxjs';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../../../graphql/queries';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {

  // === DATA ===
  public id = '';
  public loading = true;
  public workflow?: Workflow;
  public steps: Step[] = [];

  // === ROUTE ===
  private routeSubscription?: Subscription;

  // === SELECTED STEP ===
  public selectedStep?: Step;
  public selectedIndex = 0;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
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
          this.steps = res.data.workflow.steps || [];
          this.loading = res.loading;
          if (this.steps.length > 0) {
            this.stepChange({selectedIndex: 0});
          }
        } else {
          this.snackBar.openSnackBar(NOTIFICATIONS.accessNotProvided('workflow'), { error: true });
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
  stepChange(e: any): void {
    this.selectedStep = this.steps[e.selectedIndex];
    this.selectedIndex = e.selectedIndex;
    if (this.selectedStep.type === ContentType.form) {
      this.router.navigate(['./' + this.selectedStep.type + '/' + this.selectedStep.id], { relativeTo: this.route });
    } else {
      this.router.navigate(['./' + this.selectedStep.type + '/' + this.selectedStep.content], { relativeTo: this.route });
    }
  }

  /* Trigger step changes from grid widgets
  */
  onActivate(elementRef: any, stepper: MatHorizontalStepper): void {
    if (elementRef.goToNextStep) {
      elementRef.goToNextStep.subscribe((event: any) => {
        if (event) {
          if (this.selectedIndex + 1 < this.steps.length) {
            stepper.next();
          } else if (this.selectedIndex + 1 === this.steps.length) {
            stepper.selectedIndex = 0;
            this.snackBar.openSnackBar(NOTIFICATIONS.goToStep(this.steps[0].name));
          } else {
            this.snackBar.openSnackBar(NOTIFICATIONS.cannotGoToNextStep, { error: true });
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

}
