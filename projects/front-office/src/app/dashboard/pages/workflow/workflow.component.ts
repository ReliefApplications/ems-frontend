import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentType, Step, SafeSnackBarService, Workflow, NOTIFICATIONS, SafeWorkflowService } from '@safe/builder';
import { environment } from 'projects/front-office/src/environments/environment';
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
  public assetsPath = '';
  
  public workflow?: Workflow;
  private workflowSubscription?: Subscription;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  // === SELECTED STEP ===
  public selectedStep?: Step;
  public selectedStepIndex = 0;

  constructor(
    private workflowService: SafeWorkflowService,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router
  ) {
    this.assetsPath = `${environment.frontOfficeUri}assets`;

  }

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
            this.stepChange(this.steps[0]);
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
  stepChange(step: Step): void {
    if (this.selectedStep !== step) {
      this.selectedStep = step;
      this.selectedStepIndex = this.steps.map(x => x.id).indexOf(this.selectedStep.id);
      this.navigateToSelectedStep();
    }
  }

  /* Trigger step changes from grid widgets
  */
  onActivate(elementRef: any): void {
    if (elementRef.goToNextStep) {
      elementRef.goToNextStep.subscribe((event: any) => {
        if (event) {
          if (this.selectedStepIndex + 1 < this.steps.length) {
            this.selectedStepIndex += 1;
            this.selectedStep = this.steps[this.selectedStepIndex];
            this.navigateToSelectedStep();
          } else if (this.selectedStepIndex + 1 === this.steps.length) {
            this.selectedStepIndex = 0;
            this.selectedStep = this.steps[this.selectedStepIndex];
            this.navigateToSelectedStep();
            this.snackBar.openSnackBar(NOTIFICATIONS.goToStep(this.steps[0].name));
          } else {
            this.snackBar.openSnackBar(NOTIFICATIONS.cannotGoToNextStep, { error: true });
          }
        }
      });
    }
  }

  /* Navigate to selected step
  */
  private navigateToSelectedStep(): void {
    if (this.selectedStep) {
      if (this.selectedStep.type === ContentType.form) {
        this.router.navigate(['./' + this.selectedStep.type + '/' + this.selectedStep.id], { relativeTo: this.route });
      } else {
        this.router.navigate(['./' + this.selectedStep.type + '/' + this.selectedStep.content], { relativeTo: this.route });
      }
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
