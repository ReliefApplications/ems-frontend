import { Apollo } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Workflow,
  Step,
  SafeSnackBarService,
  SafeConfirmService,
  ContentType,
  SafeApplicationService,
  SafeWorkflowService,
  SafeAuthService,
  Application,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import {
  EditPageMutationResponse,
  EDIT_PAGE,
  DeleteStepMutationResponse,
  DELETE_STEP,
  EditWorkflowMutationResponse,
  EDIT_WORKFLOW,
} from './graphql/mutations';
import { TranslateService } from '@ngx-translate/core';
import get from 'lodash/get';
import { takeUntil } from 'rxjs/operators';

/**
 * Application workflow page component.
 */
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;

  // === WORKFLOW ===
  public id = '';
  public applicationId?: string;
  public workflow?: Workflow;
  public steps: Step[] = [];

  // === WORKFLOW EDITION ===
  public canEditName = false;
  public formActive = false;
  public canUpdate = false;

  // === ACTIVE STEP ===
  public activeStep = 0;

  // === DUP APP SELECTION ===
  public showAppMenu = false;
  public applications: Application[] = [];

  /**
   * Application workflow page component
   *
   * @param apollo Apollo service
   * @param workflowService Shared workflow service
   * @param applicationService Shared application service
   * @param route Angular activated route
   * @param router Angular router
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param confirmService Shared confirm service
   * @param translate Angular translate module.
   */
  constructor(
    private apollo: Apollo,
    private workflowService: SafeWorkflowService,
    private applicationService: SafeApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formActive = false;
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.loading = true;
      this.id = params.id;
      this.workflowService.loadWorkflow(this.id);
    });

    this.workflowService.workflow$
      .pipe(takeUntil(this.destroy$))
      .subscribe((workflow: Workflow | null) => {
        if (workflow) {
          this.steps = workflow.steps || [];
          this.loading = false;
          if (!this.workflow || workflow.id !== this.workflow.id) {
            const firstStep = get(workflow, 'steps', [])[0];
            if (firstStep) {
              if (firstStep.type === ContentType.form) {
                this.router.navigate(
                  ['./' + firstStep.type + '/' + firstStep.id],
                  { relativeTo: this.route }
                );
              } else {
                this.router.navigate(
                  ['./' + firstStep.type + '/' + firstStep.content],
                  { relativeTo: this.route }
                );
              }
              this.activeStep = 0;
            }
            if (!firstStep) {
              this.router.navigate([`./`], { relativeTo: this.route });
            }
          } else {
            if (
              workflow.steps &&
              workflow.steps.length > (this.workflow.steps || []).length
            ) {
              this.activeStep = workflow.steps.length - 1;
            }
          }
          this.workflow = workflow;
          this.canEditName = this.workflow?.page?.canUpdate || false;
          this.applicationId = this.workflow.page?.application?.id;
          this.canUpdate = this.workflow.canUpdate || false;
        } else {
          this.loading = true;
          this.steps = [];
        }
      });
  }

  /**
   * Toggle workflow name form.
   */
  toggleFormActive(): void {
    if (this.workflow?.page?.canUpdate) {
      this.formActive = !this.formActive;
    }
  }

  /**
   * Updates the name of the workflow and his linked page.
   *
   * @param workflowName new workflow name
   */
  saveName(workflowName: string): void {
    if (workflowName && workflowName !== this.workflow?.name) {
      const callback = () => {
        this.workflow = { ...this.workflow, name: workflowName };
      };
      this.applicationService.updatePageName(
        {
          id: this.workflow?.page?.id,
          name: workflowName,
        },
        callback
      );
    }
  }

  /**
   * Edits the permissions layer.
   *
   * @param e permission event.
   */
  saveAccess(e: any): void {
    this.apollo
      .mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.workflow?.page?.id,
          permissions: e,
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (errors) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.page.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectUpdated', {
                type: this.translate.instant('common.page.one'),
                value: '',
              })
            );
            this.workflow = {
              ...this.workflow,
              permissions: data?.editPage.permissions,
            };
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Duplicate page, in a new ( or same ) application
   *
   * @param event duplication event
   */
  public onDuplicate(event: any): void {
    if (this.workflow?.page?.id) {
      this.applicationService.duplicatePage(event.id, {
        pageId: this.workflow?.page?.id,
      });
    }
  }

  /**
   * Show or hide application selector.
   * Get applications.
   */
  public onAppSelection(): void {
    this.showAppMenu = !this.showAppMenu;
    const authSubscription = this.authService.user$.subscribe(
      (user: any | null) => {
        if (user) {
          this.applications = user.applications;
        }
      }
    );
    authSubscription.unsubscribe();
  }

  /**
   * Deletes a step if authorized.
   *
   * @param index index of step to delete
   */
  onDeleteStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      const step = this.steps[index];
      const currentStep =
        this.activeStep >= 0 ? this.steps[this.activeStep] : null;
      const dialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.step.one'),
        }),
        content: this.translate.instant(
          'pages.workflow.deleteStep.confirmationMessage',
          { step: step.name }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        confirmColor: 'warn',
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.apollo
            .mutate<DeleteStepMutationResponse>({
              mutation: DELETE_STEP,
              variables: {
                id: step.id,
              },
            })
            .subscribe({
              next: ({ errors, data }) => {
                if (errors) {
                  this.snackBar.openSnackBar(
                    this.translate.instant(
                      'common.notifications.objectNotDeleted',
                      {
                        value: this.translate.instant('common.step.one'),
                        error: errors ? errors[0].message : '',
                      }
                    ),
                    { error: true }
                  );
                } else {
                  if (data) {
                    this.snackBar.openSnackBar(
                      this.translate.instant(
                        'common.notifications.objectDeleted',
                        {
                          value: this.translate.instant('common.step.one'),
                        }
                      )
                    );
                    this.steps = this.steps.filter(
                      (x) => x.id !== data?.deleteStep.id
                    );
                    if (index === this.activeStep) {
                      this.onOpenStep(-1);
                    } else {
                      if (currentStep) {
                        this.activeStep = this.steps.findIndex(
                          (x) => x.id === currentStep.id
                        );
                      }
                    }
                  }
                }
              },
              error: (err) => {
                this.snackBar.openSnackBar(err.message, { error: true });
              },
            });
        }
      });
    }
  }

  /**
   * Navigate to the add-step component.
   */
  onAddStep(): void {
    this.router.navigate(['./add-step'], { relativeTo: this.route });
  }

  /**
   * Go to next step
   *
   * @param elementRef Element ref of workflow component
   */
  onActivate(elementRef: any): void {
    if (elementRef.changeStep) {
      elementRef.changeStep.subscribe((event: number) => {
        if (event > 0) {
          this.goToNextStep();
        } else {
          this.goToPreviousStep();
        }
      });
    }
  }

  /**
   * Saves the new ordering
   *
   * @param steps steps order.
   */
  onReorderSteps(steps: Step[]): void {
    const currentStep =
      this.activeStep >= 0 ? this.steps[this.activeStep] : null;
    this.apollo
      .mutate<EditWorkflowMutationResponse>({
        mutation: EDIT_WORKFLOW,
        variables: {
          id: this.id,
          steps: steps.map((step) => step.id),
        },
      })
      .subscribe({
        next: ({ errors, data }) => {
          if (data) {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectReordered', {
                type: this.translate.instant('common.step.one'),
              })
            );
            if (currentStep) {
              const index = steps.findIndex((x) => x.id === currentStep.id);
              this.activeStep = index;
            }
            this.steps = steps;
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant('common.notifications.objectNotUpdated', {
                type: this.translate.instant('common.workflow.one'),
                error: errors ? errors[0].message : '',
              }),
              { error: true }
            );
          }
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Navigates to the next step if possible and change selected step / index consequently
   */
  private goToNextStep(): void {
    if (this.activeStep + 1 < this.steps.length) {
      this.onOpenStep(this.activeStep + 1);
    } else if (this.activeStep + 1 === this.steps.length) {
      this.onOpenStep(0);
      this.snackBar.openSnackBar(
        this.translate.instant('models.workflow.notifications.goToStep', {
          step: this.steps[0].name,
        })
      );
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'models.workflow.notifications.cannotGoToNextStep'
        ),
        { error: true }
      );
    }
  }

  /**
   * Navigates to the previous step if possible and change selected step / index consequently
   */
  private goToPreviousStep(): void {
    if (this.activeStep > 0) {
      this.onOpenStep(this.activeStep - 1);
    } else if (this.activeStep === 0) {
      this.onOpenStep(this.steps.length - 1);
      this.snackBar.openSnackBar(
        this.translate.instant('models.workflow.notifications.goToStep', {
          step: this.steps[this.steps.length - 1].name,
        })
      );
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'models.workflow.notifications.cannotGoToPreviousStep'
        ),
        { error: true }
      );
    }
  }

  /**
   * Open selected step
   *
   * @param index index of selected step
   */
  public onOpenStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      const step = this.steps[index];
      this.activeStep = index;
      if (step.type === ContentType.form) {
        this.router.navigate(['./' + step.type + '/' + step.id], {
          relativeTo: this.route,
        });
      } else {
        this.router.navigate(['./' + step.type + '/' + step.content], {
          relativeTo: this.route,
        });
      }
    } else {
      this.router.navigate(['./'], { relativeTo: this.route });
    }
  }
}
