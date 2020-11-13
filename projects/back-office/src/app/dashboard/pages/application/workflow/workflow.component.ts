import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Workflow, WhoSnackBarService } from '@who-ems/builder';
import { GetWorkflowByIdQueryResponse, GET_WORKFLOW_BY_ID } from '../../../../graphql/queries';
import { EditPageMutationResponse, EDIT_PAGE } from '../../../../graphql/mutations';

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

  // === WORKFLOW NAME EDITION ===
  public formActive: boolean;
  public workflowNameForm: FormGroup;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
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
}
