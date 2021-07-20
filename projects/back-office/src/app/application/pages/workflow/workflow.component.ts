import {Apollo} from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';

import { Workflow, Step, SafeSnackBarService, SafeConfirmModalComponent, ContentType,
  SafeApplicationService, SafeWorkflowService, NOTIFICATIONS } from '@safe/builder';
import { Subscription } from 'rxjs';
import {
  EditPageMutationResponse, EDIT_PAGE,
  DeleteStepMutationResponse, DELETE_STEP,
  EditWorkflowMutationResponse, EDIT_WORKFLOW
} from '../../../graphql/mutations';

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

  // === WORKFLOW ===
  public workflow?: Workflow;
  private workflowSubscription?: Subscription;

  // === WORKFLOW NAME EDITION ===
  public formActive = false;
  public workflowNameForm: FormGroup = new FormGroup({});

  // === SELECTED STEP ===
  public dragging = false;
  public selectedStep: Step | null = null;
  public selectedStepIndex = 0;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  // === NEXT BUTTON ===
  private nextData: any[] = [];
  public showSettings = false;
  public settingsForm: FormGroup = new FormGroup({});
  public fields: any[] = [];

  constructor(
    private apollo: Apollo,
    private workflowService: SafeWorkflowService,
    private applicationService: SafeApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService
  ) { }

  ngOnInit(): void {
    this.formActive = false;
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.workflowService.loadWorkflow(this.id);
    });
    this.workflowSubscription = this.workflowService.workflow.subscribe((workflow: Workflow | null) => {
      if (workflow) {
        this.steps = workflow.steps || [];
        this.workflowNameForm = new FormGroup({
          workflowName: new FormControl(workflow.name, Validators.required)
        });
        this.loading = false;
        if (!this.workflow || workflow.id !== this.workflow.id) {
          const [firstStep, ..._] = workflow.steps || [];
          if (this.router.url.endsWith(this.id) || !firstStep) {
            if (firstStep) {
              if (firstStep.type === ContentType.form) {
                this.router.navigate(['./' + firstStep.type + '/' + firstStep.id], { relativeTo: this.route });
              } else {
                this.router.navigate(['./' + firstStep.type + '/' + firstStep.content], { relativeTo: this.route });
              }
              this.selectedStep = firstStep;
              this.selectedStepIndex = 0;
            } else {
              this.router.navigate([`./`], { relativeTo: this.route });
            }
          }
        }
        this.workflow = workflow;
      } else {
        this.steps = [];
      }
    });
  }

  toggleFormActive(): void {
    if (this.workflow?.page?.canUpdate) { this.formActive = !this.formActive; }
  }

  /*  Update the name of the workflow and his linked page.
  */
  saveName(): void {
    const { workflowName } = this.workflowNameForm.value;
    this.toggleFormActive();
    this.apollo.mutate<EditPageMutationResponse>({
      mutation: EDIT_PAGE,
      variables: {
        id: this.workflow?.page?.id,
        name: workflowName
      }
    }).subscribe(res => {
      if (res.data) {
        this.workflow = { ...this.workflow, name: res.data.editPage.name };
        this.applicationService.updatePageName(res.data.editPage);
      }
    });
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    this.apollo.mutate<EditPageMutationResponse>({
      mutation: EDIT_PAGE,
      variables: {
        id: this.workflow?.page?.id,
        permissions: e
      }
    }).subscribe(res => {
      this.workflow = { ...this.workflow, permissions: res.data?.editPage.permissions };
    });
  }

  /*  Delete a step if authorized.
  */
  deleteStep(step: Step, e: any): void {
    e.stopPropagation();
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: 'Delete step',
        content: `Do you confirm the deletion of the step ${step.name} ?`,
        confirmText: 'Delete',
        confirmColor: 'warn'
      }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<DeleteStepMutationResponse>({
          mutation: DELETE_STEP,
          variables: {
            id: step.id
          }
        }).subscribe(res => {
          if (res.data) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Step'), { duration: 1000 });
            this.steps = this.steps.filter(x => {
              return x.id !== res.data?.deleteStep.id;
            });
            this.selectedStep = null;
            this.selectedStepIndex = 0;
            this.router.navigate(['./'], { relativeTo: this.route });
            this.workflowService.loadWorkflow(this.id);
          }
        });
      }
    });
  }

  /*  Navigate to the add-step component
  */
  addStep(): void {
    this.router.navigate(['./add-step'], { relativeTo: this.route });
  }

  /* Drop a step dragged into the list
  */
  dropStep(event: CdkDragDrop<string[]>): void {
    this.dragging = false;
    const newSteps = this.steps.slice();
    moveItemInArray(newSteps, event.previousIndex, event.currentIndex);
    this.steps = newSteps;
    if (event.previousIndex !== event.currentIndex) {
      this.apollo.mutate<EditWorkflowMutationResponse>({
        mutation: EDIT_WORKFLOW,
        variables: {
          id: this.id,
          steps: this.steps.map(step => step.id)
        }
      }).subscribe(() => {
        this.snackBar.openSnackBar(NOTIFICATIONS.objectReordered('Step'));
      });
    }
  }

  onDragStart(): void {
    this.dragging = true;
  }


  /* Display selected step on click*/
  onStepClick(step: Step): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    if (this.selectedStep !== step) {
      this.selectedStep = step;
      this.selectedStepIndex = this.steps.map(x => x.id).indexOf(this.selectedStep.id);
      this.navigateToSelectedStep();
    }
  }

  /* Get data from within selected step
  */
  onActivate(elementRef: any): void {
    if (elementRef.goToRelativeStep) {
      elementRef.goToRelativeStep.subscribe((event: any) => {
        if (event) {
          this.goToRelativeStep(event);
        }
      });
    }
  }

  /* Navigate to the next step if possible and change selected step / index consequently
  */
  private goToRelativeStep(event: any): void {
    const value = parseInt(event, 10);
    const relativeStepIndex = this.selectedStepIndex + value;
    if (relativeStepIndex < this.steps.length && relativeStepIndex >= 0) {
      this.selectedStepIndex += value;
      this.selectedStep = this.steps[this.selectedStepIndex];
      this.navigateToSelectedStep();
    } else if (relativeStepIndex === this.steps.length) {
      this.selectedStepIndex = 0;
      this.selectedStep = this.steps[this.selectedStepIndex];
      this.navigateToSelectedStep();
    } else if (relativeStepIndex < 0) {
      this.selectedStepIndex = this.steps.length - 1;
      this.selectedStep = this.steps[this.selectedStepIndex];
      this.navigateToSelectedStep();
    } else {
      this.snackBar.openSnackBar(NOTIFICATIONS.cannotGoToNextStep, { error: true });
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
