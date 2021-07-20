import { Component, Input, OnInit } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Workflow, Step } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../../graphql/queries';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  @Input() id = '';

  // === DATA ===
  public loading = true;
  public workflow?: Workflow;
  public steps: Step[] = [];

  // === SELECTED STEP ===
  public selectedStep?: Step;
  public selectedIndex = 0;

  constructor(
    private apollo: Apollo
  ) { }

  ngOnInit(): void {
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
          this.stepChange({ selectedIndex: 0 });
        }
      }
    });
  }

  /* Display selected step
  */
  stepChange(e: any): void {
    this.selectedStep = this.steps[e.selectedIndex];
    this.selectedIndex = e.selectedIndex;
  }

  /* Trigger step changes from grid widgets
  */
  onActivate(elementRef: any, stepper: MatHorizontalStepper): void {
    if (elementRef.goToRelativeStep) {
      elementRef.goToRelativeStep.subscribe((event: number) => {
        if (event) {
          const relativeStepIndex = this.selectedIndex + event;
          if (relativeStepIndex < this.steps.length && relativeStepIndex >= 0) {
            this.selectedIndex += event;
            this.selectedStep = this.steps[this.selectedIndex];
            stepper.selectedIndex = this.selectedIndex;
          } else if (relativeStepIndex === this.steps.length) {
            this.selectedIndex = 0;
            this.selectedStep = this.steps[this.selectedIndex];
            stepper.selectedIndex = this.selectedIndex;
          } else if (relativeStepIndex < 0) {
            this.selectedIndex = this.steps.length - 1;
            this.selectedStep = this.steps[this.selectedIndex];
            stepper.selectedIndex = this.selectedIndex;
          }
        }
      });
    }
  }
}
