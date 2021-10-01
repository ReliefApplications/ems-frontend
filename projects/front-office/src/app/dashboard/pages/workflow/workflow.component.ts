import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentType, Step, SafeSnackBarService, Workflow, NOTIFICATIONS, SafeWorkflowService } from '@safe/builder';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit, OnDestroy {

  // === DATA ===
  public id = '';
  public loading = true;
  public steps: Step[] = [];

  public workflow?: Workflow;
  private workflowSubscription?: Subscription;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  // === SELECTED STEP ===
  public selectedStep?: Step;
  public selectedStepIndex = 0;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private workflowService: SafeWorkflowService,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.workflowService.loadWorkflow(this.id);
    });

    this.workflowSubscription = this.workflowService.workflow$.subscribe((workflow: Workflow | null) => {
      if (workflow) {
        const previousId = this.workflow?.id || '';
        this.workflow = workflow;
        this.steps = workflow.steps || [];
        this.loading = false;
        if (this.workflow.id !== previousId) {
          if (this.steps.length > 0) {
            this.stepChange({selectedIndex: 0});
          } else {
            this.steps = [];
            this.router.navigate([`./`], { relativeTo: this.route });
          }
        }
      } else {
        this.steps = [];
      }
    });
  }

  /* Display selected step
  */
  stepChange(e: any): void {
    this.selectedStep = this.steps[e.selectedIndex];
    this.selectedStepIndex = e.selectedIndex;
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
          if (this.selectedStepIndex + 1 < this.steps.length) {
            stepper.next();
          } else if (this.selectedStepIndex + 1 === this.steps.length) {
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
    if (this.workflowSubscription) {
      this.workflowSubscription.unsubscribe();
    }
  }
}
