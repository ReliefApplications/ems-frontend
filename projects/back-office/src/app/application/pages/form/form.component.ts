import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Subscription, Observable } from 'rxjs';
import { Form, Page, Step, WhoFormComponent } from '@who-ems/builder';
import {
  GetFormByIdQueryResponse, GET_FORM_BY_ID,
  GetPageByIdQueryResponse, GET_PAGE_BY_ID,
  GetStepByIdQueryResponse, GET_STEP_BY_ID } from '../../../graphql/queries';
import {
  EditStepMutationResponse, EDIT_STEP,
  EditPageMutationResponse, EDIT_PAGE } from '../../../graphql/mutations';
import { WorkflowService } from '../../../services/workflow.service';
import { ApplicationService } from '../../../services/application.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  @ViewChild(WhoFormComponent)
  private formComponent: WhoFormComponent;

  // === DATA ===
  public loading = true;
  public id: string;
  public form: Form;
  public completed = false;

  // === TAB NAME EDITION ===
  public formActive: boolean;
  public tabNameForm: FormGroup;
  public page: Page;
  public step: Step;

  // === ROUTE ===
  private routeSubscription: Subscription;

  constructor(
    private applicationService: ApplicationService,
    private workflowService: WorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.formActive = false;
      this.loading = true;
      this.id = params.id;
      if (this.router.url.includes('/workflow/')) {
        this.apollo.watchQuery<GetStepByIdQueryResponse>({
          query: GET_STEP_BY_ID,
          variables: {
            id: this.id
          }
        }).valueChanges.subscribe((res) => {
          this.step = res.data.step;
          this.apollo.watchQuery<GetFormByIdQueryResponse>({
            query: GET_FORM_BY_ID,
            variables: {
              id: this.step.content
            }
          }).valueChanges.subscribe((res) => {
            this.form = res.data.form;
            this.tabNameForm = new FormGroup({
              tabName: new FormControl(this.step.name, Validators.required)
            });
            this.loading = res.data.loading;
          });
        });
      } else {
        this.apollo.watchQuery<GetPageByIdQueryResponse>({
          query: GET_PAGE_BY_ID,
          variables: {
            id: this.id
          }
        }).valueChanges.subscribe((res) => {
          this.page = res.data.page;
          this.apollo.watchQuery<GetFormByIdQueryResponse>({
            query: GET_FORM_BY_ID,
            variables: {
              id: this.page.content
            }
          }).valueChanges.subscribe((res) => {
            this.form = res.data.form;
            this.tabNameForm = new FormGroup({
              tabName: new FormControl(this.page.name, Validators.required)
            });
            this.loading = res.data.loading;
          });
        });
      }
    });
  }

  toggleFormActive(): void {
    if (this.form.canUpdate) { this.formActive = !this.formActive; }
  }

  /*  Update the name of the tab.
  */
  saveName(): void {
    const { tabName } = this.tabNameForm.value;
    this.toggleFormActive();
    if (this.router.url.includes('/workflow/')) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.id,
          name: tabName
        }
      }).subscribe(res => {
        this.step.name = res.data.editStep.name;
        this.workflowService.updateStepName(res.data.editStep);
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.id,
          name: tabName
        }
      }).subscribe(res => {
        this.page.name = res.data.editPage.name;
        this.applicationService.updatePageName(res.data.editPage);
      });
    }
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    if (this.router.url.includes('/workflow/')) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.id,
          permissions: e
        }
      }).subscribe(res => {
        this.form.permissions = res.data.editStep.permissions;
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.id,
          permissions: e
        }
      }).subscribe(res => {
        this.form.permissions = res.data.editPage.permissions;
      });
    }
  }

  onComplete(e: any): void {
    this.completed = e;
  }

  clearForm(): void {
    this.formComponent.reset();
  }

  editForm(): void {
    this.router.navigate(['./forms/builder/', this.id]);
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

}
