import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  Form,
  Page,
  Step,
  SafeFormComponent,
  SafeApplicationService,
  SafeSnackBarService,
  SafeWorkflowService,
  SafeUnsubscribeComponent,
} from '@safe/builder';
import {
  GetFormByIdQueryResponse,
  GET_SHORT_FORM_BY_ID,
  GetPageByIdQueryResponse,
  GET_PAGE_BY_ID,
  GetStepByIdQueryResponse,
  GET_STEP_BY_ID,
} from './graphql/queries';
import {
  EditStepMutationResponse,
  EDIT_STEP,
  EditPageMutationResponse,
  EDIT_PAGE,
} from './graphql/mutations';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Form page in application.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent extends SafeUnsubscribeComponent implements OnInit {
  @ViewChild(SafeFormComponent)
  private formComponent?: SafeFormComponent;

  // === DATA ===
  public loading = true;
  public id = '';
  public applicationId = '';
  public form?: Form;
  public completed = false;
  public hideNewRecord = false;
  public querySubscription?: Subscription;

  // === TAB NAME EDITION ===
  public formActive = false;
  public tabNameForm: UntypedFormGroup = new UntypedFormGroup({});
  public page?: Page;
  public step?: Step;
  public isStep = false;

  /**
   * Form page in application
   *
   * @param applicationService Shared application service
   * @param workflowService Shared workflow service
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   */
  constructor(
    private applicationService: SafeApplicationService,
    private workflowService: SafeWorkflowService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.formActive = false;
      this.loading = true;
      this.id = params.id;
      this.isStep = this.router.url.includes('/workflow/');
      // If a query is already loading, cancel it
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      if (this.isStep) {
        this.querySubscription = this.apollo
          .query<GetStepByIdQueryResponse>({
            query: GET_STEP_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap(({ data }) => {
              this.step = data.step;
              return this.apollo.query<GetFormByIdQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.step.content,
                },
              });
            })
          )
          .subscribe(({ data, loading }) => {
            this.form = data.form;
            this.tabNameForm = new UntypedFormGroup({
              tabName: new UntypedFormControl(
                this.step?.name,
                Validators.required
              ),
            });
            this.applicationId =
              this.step?.workflow?.page?.application?.id || '';
            this.loading = loading;
          });
      } else {
        this.querySubscription = this.apollo
          .query<GetPageByIdQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap(({ data }) => {
              this.page = data.page;
              return this.apollo.query<GetFormByIdQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.page.content,
                },
              });
            })
          )
          .subscribe(({ data, loading }) => {
            this.form = data.form;
            this.tabNameForm = new UntypedFormGroup({
              tabName: new UntypedFormControl(
                this.page?.name,
                Validators.required
              ),
            });
            this.applicationId = this.page?.application?.id || '';
            this.loading = loading;
          });
      }
    });
  }

  /**
   * Toggle activation of form.
   */
  toggleFormActive(): void {
    if (this.step?.canUpdate || this.page?.canUpdate) {
      this.formActive = !this.formActive;
    }
  }

  /** Update the name of the tab. */
  saveName(): void {
    const { tabName } = this.tabNameForm.value;
    this.toggleFormActive();
    if (this.isStep) {
      // If form is workflow step
      const callback = () => {
        this.step = { ...this.step, name: tabName };
      };
      this.workflowService.updateStepName(
        {
          id: this.id,
          name: tabName,
        },
        callback
      );
    } else {
      // If form is page
      const callback = () => {
        this.page = { ...this.page, name: tabName };
      };
      this.applicationService.updatePageName(
        {
          id: this.id,
          name: tabName,
        },
        callback
      );
    }
  }

  /**
   * Edit the permissions layer.
   *
   * @param e permissions
   */
  saveAccess(e: any): void {
    if (this.isStep) {
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: this.id,
            permissions: e,
          },
        })
        .subscribe(({ data }) => {
          this.form = {
            ...this.form,
            permissions: data?.editStep.permissions,
          };
          this.step = {
            ...this.step,
            permissions: data?.editStep.permissions,
          };
        });
    } else {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: this.id,
            permissions: e,
          },
        })
        .subscribe(({ data }) => {
          this.form = {
            ...this.form,
            permissions: data?.editPage.permissions,
          };
          this.page = {
            ...this.page,
            permissions: data?.editPage.permissions,
          };
        });
    }
  }

  /**
   * Complete form
   *
   * @param e completion event
   * @param e.completed is completed
   * @param e.hideNewRecord do we show new record button
   */
  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;
  }

  /**
   * Clear status of the form.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }

  /**
   * Edit form. Open form builder.
   */
  editForm(): void {
    if (this.isStep && this.step) {
      this.router.navigate([`./builder/${this.step.content}`], {
        relativeTo: this.route,
      });
    } else {
      if (this.page) {
        this.router.navigate([`./builder/${this.page.content}`], {
          relativeTo: this.route,
        });
      }
    }
  }
}
