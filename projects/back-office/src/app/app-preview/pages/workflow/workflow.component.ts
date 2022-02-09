import { Apollo } from 'apollo-angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ContentType,
  Step,
  SafeSnackBarService,
  Workflow,
  NOTIFICATIONS,
} from '@safe/builder';
import { Subscription } from 'rxjs';
import {
  GetWorkflowByIdQueryResponse,
  GET_WORKFLOW_BY_ID,
} from '../../../graphql/queries';
import { PreviewService } from '../../../services/preview.service';

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
  public steps: Step[] = [];

  // === ROUTE ===
  private routeSubscription?: Subscription;

  // === ACTIVE STEP ===
  public activeStep = 0;

  // === PREVIEWED ROLE ===
  public role = '';

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private snackBar: SafeSnackBarService,
    private router: Router,
    private previewService: PreviewService
  ) {}

  /**
   * Gets the workflow from the route.
   */
  ngOnInit(): void {
    this.previewService.roleId$.subscribe((role) => {
      this.role = role;
    });
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.id = params.id;
      this.apollo
        .watchQuery<GetWorkflowByIdQueryResponse>({
          query: GET_WORKFLOW_BY_ID,
          variables: {
            id: this.id,
            asRole: this.role,
          },
        })
        .valueChanges.subscribe(
          (res) => {
            if (res.data.workflow) {
              this.workflow = res.data.workflow;
              this.steps = res.data.workflow.steps || [];
              this.loading = res.loading;
              if (this.steps.length > 0) {
                this.onOpenStep(0);
              }
            } else {
              this.snackBar.openSnackBar(
                NOTIFICATIONS.accessNotProvided('workflow'),
                { error: true }
              );
            }
          },
          (err) => {
            this.snackBar.openSnackBar(err.message, { error: true });
          }
        );
    });
  }

  /**
   * Activates the clicked element.
   *
   * @param elementRef Element ref.
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

  /**
   * Deletes all subscriptions of the page.
   */
  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
