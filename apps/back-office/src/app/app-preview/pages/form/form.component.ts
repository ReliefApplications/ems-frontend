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
} from '@oort-front/shared';
import {
  GET_SHORT_FORM_BY_ID,
  GET_PAGE_BY_ID,
  GET_STEP_BY_ID,
} from './graphql/queries';
import { switchMap, takeUntil } from 'rxjs/operators';

/**
 * Application preview form page component.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent extends UnsubscribeComponent implements OnInit {
  /** Form component */
  @ViewChild(SharedFormComponent)
  private formComponent?: SharedFormComponent;

  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Current form id */
  public id = '';
  /** Form */
  public form?: Form;
  /** Is form completed */
  public completed = false;
  /** Should possibility to add new records be hidden */
  public hideNewRecord = false;

  // === ROUTER ===
  /** Current page */
  public page?: Page;
  /** Current step */
  public step?: Step;

  // === ROUTE ===
  /** Is this form part of step */
  public isStep = false;

  /**
   * Application preview form page component.
   *
   * @param apollo Apollo service
   * @param route Angular current route
   * @param router Angular router
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
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
          .pipe(
            switchMap((res) => {
              this.step = res.data.step;
              return this.apollo.query<FormQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.step.content,
                },
              });
            })
          )
          .subscribe(({ data, loading }) => {
            this.form = data.form;
            this.loading = loading;
          });
      } else {
        this.apollo
          .query<PageQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap((res) => {
              this.page = res.data.page;
              return this.apollo.query<FormQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.page.content,
                },
              });
            })
          )
          .subscribe(({ data, loading }) => {
            if (data) {
              this.form = data.form;
            }
            this.loading = loading;
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
  }

  /**
   * Resets the form component.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
