import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Workflow, Step, WhoSnackBarService } from '@who-ems/builder';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../../../graphql/queries';
import { Subscription } from 'rxjs';
import { AddTabComponent } from './components/add-tab/add-tab.component';
import {
  EditPageMutationResponse, EDIT_PAGE,
  AddStepMutationResponse, ADD_STEP,
  DeleteStepMutationResponse, DELETE_STEP,
  EditWorkflowMutationResponse, EDIT_WORKFLOW} from '../../../graphql/mutations';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss']
})
export class WorkflowComponent implements OnInit {

  // === DATA ===
  public id: string;
  public loading = true;
  public workflow: Workflow;
  public steps: Step[];

  // === WORKFLOW NAME EDITION ===
  public formActive: boolean;
  public workflowNameForm: FormGroup;

  // === SELECTED STEP ===
  public dragging: boolean;
  public displayStep = false;
  public selectedStep: Step;

  // === ROUTE ===
  private routeSubscription: Subscription;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.formActive = false;
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
          this.workflowNameForm = new FormGroup({
            workflowName: new FormControl(this.workflow.name, Validators.required)
          });
          this.loading = res.loading;
        } else {
          this.snackBar.openSnackBar('No access provided to this workflow.', { error: true });
          this.router.navigate(['../../'], { relativeTo: this.route });
        }
      },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
          this.router.navigate(['../../'], { relativeTo: this.route });
        }
      );
    });
  }

  toggleFormActive = () => this.formActive = !this.formActive;

  /*  Update the name of the workflow and his linked page.
  */
  saveName(): void {
    const { workflowName } = this.workflowNameForm.value;
    this.toggleFormActive();
    this.apollo.mutate<EditPageMutationResponse>({
      mutation: EDIT_PAGE,
      variables: {
        id: this.workflow.page.id,
        name: workflowName
      }
    }).subscribe(res => {
      this.workflow.name = res.data.editPage.name;
    });
  }

  /*  Delete a step if authorized.
  */
  deleteStep(id, e): void {
    e.stopPropagation();
    this.apollo.mutate<DeleteStepMutationResponse>({
      mutation: DELETE_STEP,
      variables: {
        id
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Step deleted', { duration: 1000 });
      this.steps = this.steps.filter(x => {
        return x.id !== res.data.deleteStep.id;
      });
      this.router.navigate(['./'], { relativeTo: this.route });
      this.displayStep = false;
    });
  }

    /*  Display the AddStep component if authorized.
    Add a new page once closed, if result exists.
  */
  addStep(): void {
    const dialogRef = this.dialog.open(AddTabComponent, {
      panelClass: 'add-dialog',
      data: { showWorkflow: false }
    });
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.apollo.mutate<AddStepMutationResponse>({
          mutation: ADD_STEP,
          variables: {
            name: value.name,
            type: value.type,
            content: value.content,
            workflow: this.id
          }
        }).subscribe(res => {
          this.snackBar.openSnackBar('Step created');
          this.steps = this.steps.concat([res.data.addStep]);
          this.selectedStep = res.data.addStep;
          this.navigateToSelectedStep();
          this.displayStep = true;
        });
      }
    });
  }

  navigateToSelectedStep(): void {
    this.router.navigate(['./' + this.selectedStep.type + '/' + this.selectedStep.content ], { relativeTo: this.route });
  }

  /* Drop a step dragged into the list
  */
  dropStep(event: CdkDragDrop<string[]>): void{
    this.dragging = false;
    moveItemInArray(this.steps, event.previousIndex, event.currentIndex);
    if (event.previousIndex !== event.currentIndex) {
      this.apollo.mutate<EditWorkflowMutationResponse>({
        mutation: EDIT_WORKFLOW,
        variables: {
          id: this.id,
          steps: this.steps.map(step => step.id)
        }
      }).subscribe( () => {
        this.snackBar.openSnackBar('New step order : ' + this.steps.map(step => step.name));
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
      this.navigateToSelectedStep();
      this.displayStep = true;
    }
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
