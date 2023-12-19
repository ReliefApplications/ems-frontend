import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Form,
  Page,
  Step,
  FormComponent as SharedFormComponent,
  UnsubscribeComponent,
  StepQueryResponse,
  FormQueryResponse,
  PageQueryResponse,
  WorkflowService,
} from '@oort-front/shared';
import {
  GET_FORM_BY_ID,
  GET_PAGE_BY_ID,
  GET_STEP_BY_ID,
} from './graphql/queries';
import { Subscription } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';

/**
 * Form page.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent extends UnsubscribeComponent implements OnInit {
  /** View reference of Shared form component */
  @ViewChild(SharedFormComponent)
  private formComponent?: SharedFormComponent;
  /** Loading state of the page */
  public loading = true;
  /** Current form id */
  public id = '';
  /** Current form */
  public form: Form = {};
  /** Is the form answered */
  public completed = false;
  /** Ongoing query */
  public querySubscription?: Subscription;
  /** Prevents new records to be created */
  public hideNewRecord = false;
  /** Prevents new records to be created */
  public canCreateRecords = false;
  /** Current page */
  public page?: Page;
  /** Current step if nested in workflow */
  public step?: Step;
  /** Tells if the form is within a workflow */
  public isStep = false;

  /**
   * Form page.
   *
   * @param apollo Apollo client
   * @param route Angular current route
   * @param router Angular router
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   * @param workflowService Shared workflow service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private workflowService: WorkflowService
  ) {
    super();
  }

  /**
   * Subscribes to the route to load the form.
   */
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.loading = true;
      this.id = params.id;
      this.isStep = this.router.url.includes('/workflow/');
      // If a query is already loading, cancel it
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      if (this.isStep) {
        this.querySubscription = this.apollo
          .query<StepQueryResponse>({
            query: GET_STEP_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap((res) => {
              this.step = res.data.step;
              return this.getFormQuery(this.step.content ?? '');
            })
          )
          .subscribe(({ data, loading }) => {
            this.handleApplicationLoadResponse(data, loading);
          });
      } else {
        this.querySubscription = this.apollo
          .query<PageQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap((res) => {
              this.page = res.data.page;
              return this.getFormQuery(this.page.content ?? '');
            })
          )
          .subscribe(({ data, loading }) => {
            this.handleApplicationLoadResponse(data, loading);
          });
      }
    });
  }

  /**
   * Returns a form query stream for the given id
   *
   * @param {string} id form id to fetch
   * @returns a query stream
   */
  private getFormQuery(id: string) {
    return this.apollo.query<FormQueryResponse>({
      query: GET_FORM_BY_ID,
      variables: {
        id,
      },
    });
  }

  /**
   * Handles the response for the given form query response data and loading state
   *
   * @param data data retrieved from the form query
   * @param  loading loading state
   */
  private handleApplicationLoadResponse(
    data: FormQueryResponse,
    loading: boolean
  ) {
    if (data) {
      this.form = data.form;
    }
    if (
      !this.form ||
      this.form.status !== 'active' ||
      !this.form.canCreateRecords
    ) {
      this.snackBar.openSnackBar(
        this.translate.instant('common.notifications.accessNotProvided', {
          type: this.translate.instant('common.form.one').toLowerCase(),
          error: '',
        }),
        { error: true }
      );
    } else {
      this.canCreateRecords = true;
    }
    this.loading = loading;
  }

  /**
   * Updates status of the page.
   *
   * @param e completion event
   * @param e.completed is form completed
   * @param e.hideNewRecord is it needed to hide new record button
   */
  onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;

    // Checks if should go to next step if in an workflow
    if (this.step?.nextStepOnSave) {
      this.workflowService.nextStep.emit();
    }
  }

  /**
   * Resets the form.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
