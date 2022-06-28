import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Workflow, Step } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import {
  GetWorkflowByIdQueryResponse,
  GET_WORKFLOW_BY_ID,
} from './graphql/queries';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements OnInit, OnChanges {
  @Input() id = '618a34bfd1fcfad6a278f1bd';

  // === DATA ===
  public loading = true;
  public workflow?: Workflow;
  public steps: Step[] = [];

  // === ACTIVE STEP ===
  public activeStep = 0;
  public step: Step | null = null;
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .query<GetWorkflowByIdQueryResponse>({
        query: GET_WORKFLOW_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .subscribe((res) => {
        if (res.data.workflow) {
          this.workflow = res.data.workflow;
          this.steps = res.data.workflow.steps || [];
          this.loading = res.loading;
          if (this.steps.length > 0) {
            this.onOpenStep(0);
          }
        }
      });
  }

  ngOnChanges(): void {
    this.apollo
      .query<GetWorkflowByIdQueryResponse>({
        query: GET_WORKFLOW_BY_ID,
        variables: {
          id: this.id,
        },
      })
      .subscribe((res) => {
        if (res.data.workflow) {
          this.workflow = res.data.workflow;
          this.steps = res.data.workflow.steps || [];
          this.loading = res.loading;
          if (this.steps.length > 0) {
            this.onOpenStep(0);
          }
        }
      });
  }

  /**
   * On Open Step.
   */
  public onOpenStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      this.activeStep = index;
      this.step = this.steps[index];
    }
  }

  /** Get data from within selected step */
  onActivate(elementRef: any): void {
    if (elementRef.goToNextStep) {
      elementRef.goToNextStep.subscribe((event: any) => {
        if (event) {
          this.goToNextStep();
        }
      });
    }
  }

  /**
   * Navigates to the next step if possible and change selected step / index consequently
   */
  private goToNextStep(): void {
    if (this.activeStep + 1 < this.steps.length) {
      this.onOpenStep(this.activeStep + 1);
    } else if (this.activeStep + 1 === this.steps.length) {
      this.onOpenStep(0);
    }
  }
}
