import { Apollo } from 'apollo-angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  Form,
  Page,
  Step,
  SafeFormComponent,
  SafeApplicationService,
  SafeSnackBarService,
  SafeWorkflowService,
} from '@safe/builder';
import {
  GetFormByIdQueryResponse,
  GET_SHORT_FORM_BY_ID,
  GetPageByIdQueryResponse,
  GET_PAGE_BY_ID,
  GetStepByIdQueryResponse,
  GET_STEP_BY_ID,
} from '../../../graphql/queries';
import {
  EditStepMutationResponse,
  EDIT_STEP,
  EditPageMutationResponse,
  EDIT_PAGE,
} from '../../../graphql/mutations';
import { switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * Form page in application.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
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
  public querySubscription?: Subscription;

  // === TAB NAME EDITION ===
  public formActive = false;
  public tabNameForm: UntypedFormGroup = new UntypedFormGroup({});
  public page?: Page;
  public step?: Step;

  // === ROUTE ===
  private routeSubscription?: Subscription;
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
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
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
            switchMap((res) => {
              this.step = res.data.step;
              return this.apollo.query<GetFormByIdQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.step.content,
                },
              });
            })
          )
          .subscribe((res) => {
            this.form = res.data.form;
            this.tabNameForm = new UntypedFormGroup({
              tabName: new UntypedFormControl(this.step?.name, Validators.required),
            });
            this.applicationId =
              this.step?.workflow?.page?.application?.id || '';
            this.loading = res.data.loading;
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
            switchMap((res) => {
              this.page = res.data.page;
              return this.apollo.query<GetFormByIdQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.page.content,
                },
              });
            })
          )
          .subscribe((res2) => {
            this.form = res2.data.form;
            this.tabNameForm = new UntypedFormGroup({
              tabName: new UntypedFormControl(this.page?.name, Validators.required),
            });
            this.applicationId = this.page?.application?.id || '';
            this.loading = res2.data.loading;
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
      this.apollo
        .mutate<EditStepMutationResponse>({
          mutation: EDIT_STEP,
          variables: {
            id: this.id,
            name: tabName,
          },
        })
        .subscribe((res) => {
          if (res.errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.step.one'),
                error: res.errors[0].message,
              }),
              { error: true }
            );
          } else {
            if (res.data) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.step.one').toLowerCase(),
                  value: tabName,
                })
              );
              this.step = { ...this.step, name: res.data.editStep.name };
              this.workflowService.updateStepName(res.data.editStep);
            }
          }
        });
    } else {
      this.apollo
        .mutate<EditPageMutationResponse>({
          mutation: EDIT_PAGE,
          variables: {
            id: this.id,
            name: tabName,
          },
        })
        .subscribe((res) => {
          if (res.errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.page.one').toLowerCase(),
                error: res.errors[0].message,
              }),
              { error: true }
            );
          } else {
            if (res.data) {
              this.snackBar.openSnackBar(
                this.translate.instant('common.notifications.objectUpdated', {
                  type: this.translate.instant('common.page.one').toLowerCase(),
                  value: tabName,
                })
              );
              const newPage = { ...this.page, name: res.data.editPage.name };
              this.page = newPage;
              this.applicationService.updatePageName(res.data.editPage);
            }
          }
        });
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
        .subscribe((res) => {
          this.form = {
            ...this.form,
            permissions: res.data?.editStep.permissions,
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
        .subscribe((res) => {
          this.form = {
            ...this.form,
            permissions: res.data?.editPage.permissions,
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

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
