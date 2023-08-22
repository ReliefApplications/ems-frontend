import { Apollo } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Form,
  Page,
  Step,
  SafeFormComponent,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import {
  GetFormByIdQueryResponse,
  GetPageByIdQueryResponse,
  GetStepByIdQueryResponse,
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
export class FormComponent extends SafeUnsubscribeComponent implements OnInit {
  /** View reference of Shared form component */
  @ViewChild(SafeFormComponent)
  private formComponent?: SafeFormComponent;
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
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: SnackbarService,
    private translate: TranslateService
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
          .query<GetStepByIdQueryResponse>({
            query: GET_STEP_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap((res) => {
              this.step = res.data.step;
              return this.apollo.query<GetFormByIdQueryResponse>({
                query: GET_FORM_BY_ID,
                variables: {
                  id: this.step.content,
                },
              });
            })
          )
          .subscribe(({ data, loading }) => {
            if (data) {
              this.form = data.form;
            }
            if (
              !this.form ||
              this.form.status !== 'active' ||
              !this.form.canCreateRecords
            ) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translate
                      .instant('common.form.one')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
            } else {
              this.canCreateRecords = true;
            }
            this.loading = loading;
          });
      } else {
        this.querySubscription = this.apollo
          .query<GetPageByIdQueryResponse>({
            query: GET_PAGE_BY_ID,
            variables: {
              id: this.id,
            },
          })
          .pipe(
            switchMap((res) => {
              this.page = res.data.page;
              return this.apollo.query<GetFormByIdQueryResponse>({
                query: GET_FORM_BY_ID,
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
            if (
              !this.form ||
              this.form.status !== 'active' ||
              !this.form.canCreateRecords
            ) {
              this.snackBar.openSnackBar(
                this.translate.instant(
                  'common.notifications.accessNotProvided',
                  {
                    type: this.translate
                      .instant('common.form.one')
                      .toLowerCase(),
                    error: '',
                  }
                ),
                { error: true }
              );
            } else {
              this.canCreateRecords = true;
            }
            this.loading = loading;
          });
      }
    });
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
  }

  /**
   * Resets the form.
   */
  clearForm(): void {
    this.formComponent?.reset();
  }
}
