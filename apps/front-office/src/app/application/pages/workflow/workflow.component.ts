import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  ContentType,
  Step,
  UnsubscribeComponent,
  Workflow,
  WorkflowQueryResponse,
} from '@oort-front/shared';
import { SnackbarService } from '@oort-front/ui';
import { Apollo } from 'apollo-angular';
import { isNil } from 'lodash';
import { Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { GET_WORKFLOW_BY_ID } from './graphql/queries';

/**
 * Workflow page.
 */
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent extends UnsubscribeComponent implements OnInit {
  /** Reference to router outlet */
  @ViewChild(RouterOutlet) routerOutlet?: RouterOutlet;
  /** Loading state of the page */
  public loading = true;
  /** Current workflow id */
  public id = '';
  /** Current workflow */
  public workflow?: Workflow;
  /** Current workflow steps */
  public steps: Step[] = [];
  /** Current step */
  public activeStep = 0;
  /** Subscription to change step events */
  private changeStepSubscription!: Subscription;

  /**
   * Workflow page.
   *
   * @param apollo Apollo client
   * @param route Angular current route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SnackbarService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Subscribes to the route to load the workflow accordingly.
   */
  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e) => {
        let validActiveStepIndex = -1;
        if (!isNil(this.workflow)) {
          const routeStepContent = /[^/]*$/gi.exec(
            (e as NavigationEnd).urlAfterRedirects
          )?.[0];
          const afterRedirectionActiveStepIndex = this.steps?.findIndex(
            (step) => step.content === routeStepContent
          );
          if (
            afterRedirectionActiveStepIndex !== -1 &&
            this.activeStep !== afterRedirectionActiveStepIndex
          ) {
            validActiveStepIndex = afterRedirectionActiveStepIndex;
          }
        }
        // If going back or clicking on route in sidenav, go to first step
        // If there is a redirection done in the workflow from outside the component, e.g. action buttons, go to that redirected step
        if (
          e instanceof NavigationEnd &&
          (e.urlAfterRedirects.endsWith(this.id) || validActiveStepIndex !== -1)
        ) {
          this.onOpenStep(
            validActiveStepIndex !== -1 ? validActiveStepIndex : 0
          );
        }
      });
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.loading = true;
      this.id = params.id;
      this.apollo
        .watchQuery<WorkflowQueryResponse>({
          query: GET_WORKFLOW_BY_ID,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ({ data, loading }) => {
            if (data.workflow) {
              this.workflow = data.workflow;
              this.steps = data.workflow.steps || [];
              this.loading = loading;
              if (this.steps.length > 0) {
                const currentStepId = this.router.url.split('/').pop();
                // If redirect to the workflow beginning, just go to the firstStep
                const firstStep = this.steps[0];
                const firstStepIsForm = firstStep.type === ContentType.form;
                let currentActiveStep = 0;
                if (
                  !(firstStepIsForm
                    ? firstStep.id === currentStepId
                    : firstStep.content === currentStepId)
                ) {
                  // If not, URL contains the step id so redirect to the selected step (used for when refresh page or shared dashboard step link)
                  data.workflow?.steps?.forEach((step: Step, index: number) => {
                    const stepIsForm = step.type === ContentType.form;
                    if (
                      (stepIsForm && step.id === currentStepId) ||
                      step.content === currentStepId
                    ) {
                      currentActiveStep = index;
                      return;
                    }
                  });
                }
                this.onOpenStep(currentActiveStep);
              }
            } else {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translate
                      .instant('common.workflow.one')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
            }
          },
          error: (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          },
        });
    });
  }

  /**
   * Gets data from within selected step
   *
   * @param elementRef Ref to the stepper
   */
  onActivate(elementRef: any): void {
    if (elementRef.changeStep) {
      this.changeStepSubscription = elementRef.changeStep.subscribe(
        (event: any) => {
          if (event > 0) {
            this.goToNextStep();
          } else {
            this.goToPreviousStep();
          }
        }
      );
    }
  }

  /**
   * Clear subscriptions set from the router-outlet
   */
  clearSubscriptions() {
    this.changeStepSubscription?.unsubscribe();
  }

  /**
   * Navigates to the clicked step.
   *
   * @param index index of step to navigate to
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
}
