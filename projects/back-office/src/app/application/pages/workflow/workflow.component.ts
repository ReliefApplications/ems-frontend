import { Apollo } from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Workflow,
  Step,
  SafeSnackBarService,
  SafeConfirmModalComponent,
  ContentType,
  SafeApplicationService,
  SafeWorkflowService,
  NOTIFICATIONS,
} from '@safe/builder';
import { Subscription } from 'rxjs';
import {
  EditPageMutationResponse,
  EDIT_PAGE,
  DeleteStepMutationResponse,
  DELETE_STEP,
  EditWorkflowMutationResponse,
  EDIT_WORKFLOW,
} from '../../../graphql/mutations';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;

  // === WORKFLOW ===
  public id = '';
  public workflow?: Workflow;
  private workflowSubscription?: Subscription;
  public steps: Step[] = [];

  // === WORKFLOW EDITION ===
  public formActive = false;
  public workflowNameForm: FormGroup = new FormGroup({});
  public canUpdate = false;

  // === ACTIVE STEP ===
  public activeStep = 0;

  // === ROUTE ===
  private routeSubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    private workflowService: SafeWorkflowService,
    private applicationService: SafeApplicationService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.formActive = false;
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.workflowService.loadWorkflow(this.id);
    });

    this.workflowSubscription = this.workflowService.workflow$.subscribe(
      (workflow: Workflow | null) => {
        if (workflow) {
          this.steps = workflow.steps || [];
          this.workflowNameForm = new FormGroup({
            workflowName: new FormControl(workflow.name, Validators.required),
          });
          this.loading = false;
          if (!this.workflow || workflow.id !== this.workflow.id) {
            const [firstStep, ..._] = workflow.steps || [];
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
              workflow.steps.length > (this.workflow.steps?.length || [])
            ) {
              this.activeStep = workflow.steps.length - 1;
            }
          }
          this.workflow = workflow;
          this.canUpdate = this.workflow.canUpdate || false;
        } else {
          this.loading = true;
          this.steps = [];
        }
      }
    );
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
   */
  saveName(): void {
    const { workflowName } = this.workflowNameForm.value;
    this.toggleFormActive();
    this.apollo
      .mutate<EditPageMutationResponse>({
        mutation: EDIT_PAGE,
        variables: {
          id: this.workflow?.page?.id,
          name: workflowName,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.workflow = { ...this.workflow, name: res.data.editPage.name };
          this.applicationService.updatePageName(res.data.editPage);
        }
      });
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
      .subscribe((res) => {
        this.workflow = {
          ...this.workflow,
          permissions: res.data?.editPage.permissions,
        };
      });
  }

  /**
   * Deletes a step if authorized.
   *
   * @param step step to delete
   */
  onDeleteStep(index: number): void {
    if (index >= 0 && index < this.steps.length) {
      const step = this.steps[index];
      const currentStep =
        this.activeStep >= 0 ? this.steps[this.activeStep] : null;
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: this.translate.instant('common.deleteObject', {
            name: this.translate.instant('common.step.one'),
          }),
          content: this.translate.instant(
            'pages.workflow.deleteStep.confirmationMessage',
            { step: step.name }
          ),
          confirmText: this.translate.instant('components.confirmModal.delete'),
          confirmColor: 'warn',
        },
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
            .subscribe((res) => {
              if (res.data) {
                this.snackBar.openSnackBar(NOTIFICATIONS.objectDeleted('Step'));
                this.steps = this.steps.filter(
                  (x) => x.id !== res.data?.deleteStep.id
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

  /* Get data from within selected step
   */
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
      .subscribe((res) => {
        if (res.data) {
          this.snackBar.openSnackBar(NOTIFICATIONS.objectReordered('Step'));
          if (currentStep) {
            const index = steps.findIndex((x) => x.id === currentStep.id);
            this.activeStep = index;
          }
          this.steps = steps;
        } else {
          this.snackBar.openSnackBar(
            NOTIFICATIONS.objectNotEdited(
              'Workflow',
              res.errors ? res.errors[0].message : ''
            )
          );
        }
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
      this.snackBar.openSnackBar(NOTIFICATIONS.goToStep(this.steps[0].name));
    } else {
      this.snackBar.openSnackBar(NOTIFICATIONS.cannotGoToNextStep, {
        error: true,
      });
    }
  }

  /**
   * On Open Step.
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

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.workflowSubscription) {
      this.workflowSubscription.unsubscribe();
    }
  }
}
