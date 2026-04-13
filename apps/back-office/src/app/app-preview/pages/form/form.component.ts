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
  ActionButton,
  ContextService,
  Record,
  RecordQueryResponse,
} from '@oort-front/shared';
import {
  GET_SHORT_FORM_BY_ID,
  GET_PAGE_BY_ID,
  GET_STEP_BY_ID,
  GET_RECORD_BY_ID,
} from './graphql/queries';
import { switchMap, takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
  /** Loading state */
  public loading = true;
  /** Current form id */
  public id = '';
  /** Form */
  public form?: Form;
  /** Is form completed */
  public completed = false;
  /** Ongoing query */
  public querySubscription?: Subscription;
  /** Should possibility to add new records be hidden */
  public hideNewRecord = false;
  /** Form button actions */
  public actionButtons: ActionButton[] = [];
  /** Current page */
  public page?: Page;
  /** Current step */
  public step?: Step;
  /** Is this form part of step */
  public isStep = false;
  /** Current record, optional */
  public record?: Record;

  /**
   * Application preview form page component.
   *
   * @param apollo Apollo service
   * @param route Angular current route
   * @param router Angular router
   * @param contextService Shared context service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private contextService: ContextService
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
            switchMap(({ data }) => {
              this.step = data.step;
              this.actionButtons = data.step.buttons as ActionButton[];
              const recordId = this.route.snapshot.queryParams.id;
              if (recordId) {
                return this.getRecordQuery(recordId).pipe(
                  switchMap((recordResponse) => {
                    this.record = recordResponse.data.record;
                    // Then, proceed to fetch the form
                    return this.getFormQuery(this.step?.content ?? '');
                  })
                );
              }
              this.record = undefined;
              return this.getFormQuery(this.step.content ?? '');
            }),
            takeUntil(this.destroy$)
          )
          .subscribe(({ data, loading }) => {
            this.form = data.form;
            this.loading = loading;
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
            switchMap(({ data }) => {
              this.page = data.page;
              this.actionButtons = data.page.buttons as ActionButton[];
              const recordId = this.route.snapshot.queryParams.id;
              if (recordId) {
                return this.getRecordQuery(recordId).pipe(
                  switchMap((recordResponse) => {
                    this.record = recordResponse.data.record;
                    // Then, proceed to fetch the form
                    return this.getFormQuery(this.page?.content ?? '');
                  })
                );
              }
              this.record = undefined;
              return this.getFormQuery(this.page.content ?? '');
            }),
            takeUntil(this.destroy$)
          )
          .subscribe(({ data, loading }) => {
            this.form = data.form;
            this.loading = loading;
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
      query: GET_SHORT_FORM_BY_ID,
      variables: {
        id,
      },
    });
  }

  /**
   * Returns query for the given record id
   *
   * @param id record id
   * @returns record query for the given id
   */
  private getRecordQuery(id: string) {
    return this.apollo.query<RecordQueryResponse>({
      query: GET_RECORD_BY_ID,
      variables: {
        id,
      },
    });
  }

  /**
   * Handles complete event.
   *
   * @param e complete event
   * @param e.completed is event completed
   * @param e.hideNewRecord do we need to hide new record
   * @param e.record Saved record
   */
  onComplete(e: {
    completed: boolean;
    hideNewRecord?: boolean;
    record?: Record;
  }): void {
    if (e.record) {
      this.contextService.context = {
        ...e.record.data,
        id: e.record.id,
      };
    }
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
