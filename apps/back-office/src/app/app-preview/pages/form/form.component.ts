import { Apollo } from 'apollo-angular';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Form,
  Page,
  Step,
  FormComponent as SharedFormComponent,
  StepQueryResponse,
  FormQueryResponse,
  PageQueryResponse,
  ActionButton,
  ContextService,
  Record,
} from '@oort-front/shared';
import {
  GET_SHORT_FORM_BY_ID,
  GET_PAGE_BY_ID,
  GET_STEP_BY_ID,
} from './graphql/queries';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Application preview form page component.
 */
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
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
  /** Form button actions */
  public actionButtons: ActionButton[] = [];

  // === ROUTER ===
  /** Current page */
  public page?: Page;
  /** Current step */
  public step?: Step;

  // === ROUTE ===
  /** Is this form part of step */
  public isStep = false;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

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
  ) {}

  /**
   * Gets the form from the page parameters.
   */
  ngOnInit(): void {
    this.route.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
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
            .subscribe(({ data }) => {
              this.step = data.step;
              this.actionButtons = data.step.buttons as ActionButton[];
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
            .subscribe(({ data }) => {
              this.page = data.page;
              this.actionButtons = data.page.buttons as ActionButton[];
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
