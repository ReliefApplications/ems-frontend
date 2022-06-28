import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Form, Page, Step, SafeFormComponent } from '@safe/builder';
import {
  GetFormByIdQueryResponse,
  GetPageByIdQueryResponse,
  GetStepByIdQueryResponse,
  GET_SHORT_FORM_BY_ID,
  GET_PAGE_BY_ID,
  GET_STEP_BY_ID,
} from '../../../graphql/queries';
import { Subscription } from 'rxjs';

/**
 * Application preview form page component.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  @ViewChild(SafeFormComponent)
  private formComponent?: SafeFormComponent;

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
  private routeSubscription?: Subscription;
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
  ) {}

  /**
   * Gets the form from the page parameters.
   */
  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.loading = true;
      this.id = params.id;
      this.isStep = this.router.url.includes('/workflow/');
      if (this.isStep) {
        this.apollo
          .watchQuery<GetStepByIdQueryResponse>({
            query: GET_STEP_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .valueChanges.subscribe((res) => {
            this.step = res.data.step;
            this.apollo
              .watchQuery<GetFormByIdQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.step.content,
                },
              })
              .valueChanges.subscribe((res2) => {
                this.form = res2.data.form;
                this.loading = res2.data.loading;
              });
          });
      } else {
        this.apollo
          .watchQuery<GetPageByIdQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .valueChanges.subscribe((res) => {
            this.page = res.data.page;
            this.apollo
              .query<GetFormByIdQueryResponse>({
                query: GET_SHORT_FORM_BY_ID,
                variables: {
                  id: this.page.content,
                },
              })
              .subscribe((res2) => {
                if (res2.data) {
                  this.form = res2.data.form;
                }
                this.loading = res2.data.loading;
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
  }

  /**
   * Resets the form component.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
