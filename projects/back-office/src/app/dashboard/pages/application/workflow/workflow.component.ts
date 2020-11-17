import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Workflow, Step, WhoSnackBarService } from '@who-ems/builder';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../../../../graphql/queries';
import { AddTabComponent } from '../components/add-tab/add-tab.component';
import { 
  EditPageMutationResponse, EDIT_PAGE,
  AddStepMutationResponse, ADD_STEP,
  DeleteStepMutationResponse, DELETE_STEP } from '../../../../graphql/mutations';

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
  @ViewChild('stepper') stepper: MatStepper;
  public step: Step;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService
  ) { }

  ngOnInit(): void {
    this.formActive = false;
    this.id = this.route.snapshot.params.id;
    this.apollo.watchQuery<GetWorkflowByIdQueryResponse>({
      query: GET_WORKFLOW_BY_ID,
      variables: {
        id: this.id
      }
    }).valueChanges.subscribe((res) => {
      if (res.data.workflow) {
        this.workflow = res.data.workflow;
        this.steps = res.data.workflow.steps;
        this.step = this.steps[0];
        this.navigateToSelectedStep();
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

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    this.apollo.mutate<EditPageMutationResponse>({
      mutation: EDIT_PAGE,
      variables: {
        id: this.workflow.page.id,
        permissions: e
      }
    }).subscribe(res => {
      this.workflow.page.permissions = res.data.editPage.permissions;
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
      this.stepper.reset();
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
          const content = res.data.addStep.content;
          this.steps = this.steps.concat([res.data.addStep]);
          this.step = res.data.addStep;
          setTimeout(() => {
            this.stepper.selectedIndex = this.steps.length - 1;
          }, 1000);
        });
      }
    });
  }

  /* Display selected step
  */
  stepChange(e): void {
    this.step = this.steps[e.selectedIndex];
    this.navigateToSelectedStep();
  }

  navigateToSelectedStep(): void {
    console.log('navigate');
    this.router.navigate(['./' + this.step.type + '/' + this.step.content ], { relativeTo: this.route });
  }
}
