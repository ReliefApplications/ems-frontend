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
  GET_SHORT_FORM_BY_ID,
  GET_PAGE_BY_ID,
  GET_STEP_BY_ID,
} from './graphql/queries';
import { takeUntil } from 'rxjs/operators';

/**
 * Application preview form page component.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent extends UnsubscribeComponent implements OnInit {
  @ViewChild(SharedFormComponent)
  private formComponent?: SharedFormComponent;

  // === DATA ===
  public loading = true;
  public id = '';
  public form?: Form;
  public completed = false;
  public hideNewRecord = false;

  // === ROUTER ===
  public page?: Page;
  public step?: Step;

  // === ROUTE ===
  public isStep = false;

  /**
   * Application preview form page component.
   *
   * @param apollo Apollo service
   * @param route Angular current route
   * @param router Angular router
   * @param workflowService Shared workflow service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private workflowService: WorkflowService
  ) {
    super();
  }

  /**
   * Gets the form from the page parameters.
   */
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.loading = true;
      this.id = params.id;
      this.isStep = this.router.url.includes('/workflow/');
      if (this.isStep) {
        this.apollo
          .query<StepQueryResponse>({
            query: GET_STEP_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .subscribe((res) => {
            this.step = res.data.step;
            this.apollo
              .query<FormQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.step.content,
                },
              })
              .subscribe(({ data, loading }) => {
                this.form = data.form;
                this.loading = loading;
              });
          });
      } else {
        this.apollo
          .query<PageQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .subscribe((res) => {
            this.page = res.data.page;
            this.apollo
              .query<FormQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.page.content,
                },
              })
              .subscribe(({ data, loading }) => {
                if (data) {
                  this.form = data.form;
                }
                this.loading = loading;
              });
          });
      }
    });
  }

  /**
   * Handles complete event.
   *
   * @param e complete event
   * @param e.completed is event completed
   * @param e.hideNewRecord do we need to hide new record
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
   * Resets the form component.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
