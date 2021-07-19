import {Apollo} from 'apollo-angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { Form, Page, Step, SafeFormComponent, SafeApplicationService, SafeSnackBarService, SafeWorkflowService, NOTIFICATIONS } from '@safe/builder';
import {
  GetFormByIdQueryResponse, GET_SHORT_FORM_BY_ID,
  GetPageByIdQueryResponse, GET_PAGE_BY_ID,
  GetStepByIdQueryResponse, GET_STEP_BY_ID
} from '../../../graphql/queries';
import {
  EditStepMutationResponse, EDIT_STEP,
  EditPageMutationResponse, EDIT_PAGE
} from '../../../graphql/mutations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  @ViewChild(SafeFormComponent)
  private formComponent?: SafeFormComponent;

  // === DATA ===
  public loading = true;
  public id = '';
  public applicationId = '';
  public form?: Form;
  public completed = false;
  public hideNewRecord = false;

  // === TAB NAME EDITION ===
  public formActive = false;
  public tabNameForm: FormGroup = new FormGroup({});
  public page?: Page;
  public step?: Step;

  // === ROUTE ===
  private routeSubscription?: Subscription;
  public isStep = false;

  constructor(
    private applicationService: SafeApplicationService,
    private workflowService: SafeWorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SafeSnackBarService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.formActive = false;
      this.loading = true;
      this.id = params.id;
      this.isStep = this.router.url.includes('/workflow/');
      if (this.isStep) {
        this.apollo.watchQuery<GetStepByIdQueryResponse>({
          query: GET_STEP_BY_ID,
          variables: {
            id: this.id
          }
        }).valueChanges.subscribe((res) => {
          this.step = res.data.step;
          this.apollo.watchQuery<GetFormByIdQueryResponse>({
            query: GET_SHORT_FORM_BY_ID,
            variables: {
              id: this.step.content
            }
          }).valueChanges.subscribe((res2) => {
            this.form = res2.data.form;
            this.tabNameForm = new FormGroup({
              tabName: new FormControl(this.step?.name, Validators.required)
            });
            this.applicationId = this.step?.workflow?.page?.application?.id || '';
            this.loading = res2.data.loading;
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
            query: GET_SHORT_FORM_BY_ID,
            variables: {
              id: this.page.content
            }
          }).valueChanges.subscribe((res2) => {
            this.form = res2.data.form;
            this.tabNameForm = new FormGroup({
              tabName: new FormControl(this.page?.name, Validators.required)
            });
            this.applicationId = this.page?.application?.id || '';
            this.loading = res2.data.loading;
          });
        });
      }
    });
  }

  toggleFormActive(): void {
    if (this.form?.canUpdate) { this.formActive = !this.formActive; }
  }

  /*  Update the name of the tab.
  */
  saveName(): void {
    const { tabName } = this.tabNameForm.value;
    this.toggleFormActive();
    if (this.isStep) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.id,
          name: tabName
        }
      }).subscribe(res => {
        if (res.errors) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectNotUpdated('step', res.errors[0].message));
        } else {
          if (res.data) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('step', tabName));
            this.step = { ...this.step, name: res.data.editStep.name };
            this.workflowService.updateStepName(res.data.editStep);
          }
        }
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.id,
          name: tabName
        }
      }).subscribe(res => {
        if (res.errors) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectNotUpdated('page', res.errors[0].message));
        } else {
          if (res.data) {
            this.snackBar.openSnackBar(NOTIFICATIONS.objectEdited('page', tabName));
            const newPage = { ...this.page, name: res.data.editPage.name };
            this.page = newPage;
            this.applicationService.updatePageName(res.data.editPage);
          }
        }
      });
    }
  }

  /*  Edit the permissions layer.
  */
  saveAccess(e: any): void {
    if (this.isStep) {
      this.apollo.mutate<EditStepMutationResponse>({
        mutation: EDIT_STEP,
        variables: {
          id: this.id,
          permissions: e
        }
      }).subscribe(res => {
        this.form = { ...this.form, permissions: res.data?.editStep.permissions };
      });
    } else {
      this.apollo.mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.id,
          permissions: e
        }
      }).subscribe(res => {
        this.form = { ...this.form, permissions: res.data?.editPage.permissions };
      });
    }
  }

  onComplete(e: {completed: boolean, hideNewRecord?: boolean}): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;
  }

  clearForm(): void {
    this.formComponent?.reset();
  }

  editForm(): void {
    if (this.isStep && this.step) {
      this.router.navigate([`./builder/${this.step.content}`], { relativeTo: this.route });
    } else {
      if (this.page) {
        this.router.navigate([`./builder/${this.page.content}`], { relativeTo: this.route });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
     this.routeSubscription.unsubscribe();
    }
  }
}
