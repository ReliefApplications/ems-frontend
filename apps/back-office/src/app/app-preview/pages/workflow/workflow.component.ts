import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
import { filter, startWith, takeUntil } from 'rxjs/operators';
import { PreviewService } from '../../../services/preview.service';
import { GET_WORKFLOW_BY_ID } from './graphql/queries';

/**
 * Workflow page component for application preview.
 */
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent extends UnsubscribeComponent implements OnInit {
  /** Loading indicator */
  public loading = true;
  /** Current workflow id */
  public id = '';
  /** Current workflow */
  public workflow?: Workflow;
  /** Workflow steps */
  public steps: Step[] = [];
  /** Current step index */
  public activeStep = 0;
  /** Role used for preview */
  public role = '';
  /** Subscription to change step events */
  private changeStepSubscription!: Subscription;

  /**
   * Workflow page component for application preview
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param snackBar Shared snackbar service
   * @param router Angular router
   * @param previewService Shared preview service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SnackbarService,
    private router: Router,
    private previewService: PreviewService,
    private translate: TranslateService
  ) {
    super();
  }

  /**
   * Gets the workflow from the route.
   */
  ngOnInit(): void {
    this.previewService.roleId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((role) => {
        this.role = role;
      });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.router), // initialize
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
            asRole: this.role,
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
                this.onOpenStep(0);
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
   * Activates the clicked element.
   *
   * @param elementRef Element ref.
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
   * Navigates to the new step.
   *
   * @param index Index of the step in the workflow.
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
