import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Form, FormQueryResponse } from '../../../models/form.model';
import { Record, RecordQueryResponse } from '../../../models/record.model';
import { debounceTime, firstValueFrom, takeUntil } from 'rxjs';
import { GET_RECORD_BY_ID, GET_SHORT_FORM_BY_ID } from './graphql/queries';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';
import { FormComponent } from '../../form/form.component';
import { ContextService } from '../../../services/context/context.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { isNil } from 'lodash';

/**
 * Form widget component.
 */
@Component({
  selector: 'shared-form-widget',
  templateUrl: './form-widget.component.html',
  styleUrls: ['./form-widget.component.scss'],
})
export class FormWidgetComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Widget settings */
  @Input() settings: any = null;
  /** Should show padding */
  @Input() usePadding = true;
  /** Widget header template reference */
  @ViewChild('headerTemplate') headerTemplate!: TemplateRef<any>;
  /** Loaded form */
  public form!: Form;
  /** Loaded record, if any */
  public record?: Record;
  /** Loading state */
  public loading = true;
  /** Is form completed */
  public completed = false;
  /** Should possibility to add new records be hidden */
  public hideNewRecord = false;
  /** Active context fields */
  private contextFilters: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };

  /** Form component */
  @ViewChild(FormComponent)
  private formComponent?: FormComponent;

  /**
   * Form widget component.
   *
   * @param apollo This is the Apollo client that we'll use to make GraphQL requests.
   * @param snackBar This is the service that allows you to display a snackbar.
   * @param translate This is the service that allows us to translate the text in our application.
   * @param contextService Shared context service
   * @param dashboardService Shared dashboard service
   */
  constructor(
    private apollo: Apollo,
    protected snackBar: SnackbarService,
    protected translate: TranslateService,
    private contextService: ContextService,
    private dashboardService: DashboardService
  ) {
    super();
  }

  async ngOnInit(): Promise<void> {
    const promises: Promise<FormQueryResponse | RecordQueryResponse | void>[] =
      [];

    if (this.settings.form) {
      promises.push(
        firstValueFrom(
          this.apollo.query<FormQueryResponse>({
            query: GET_SHORT_FORM_BY_ID,
            variables: {
              id: this.settings.form,
            },
          })
        ).then(({ data, loading }) => {
          this.form = data.form;
          this.loading = loading;
        })
      );

      await Promise.all(promises);
    }

    // Load record from updateRecord state
    if (this.settings.updateRecord?.enabled) {
      const stateID = this.settings.updateRecord.state;
      this.dashboardService.states$
        .pipe(takeUntil(this.destroy$))
        .subscribe((states) => {
          const state = states.find((s) => s.id === stateID);
          const value = state?.value;
          if (!isNil(value) && value !== this.record?.id) {
            this.loading = true;
            this.apollo
              .query<RecordQueryResponse>({
                query: GET_RECORD_BY_ID,
                variables: {
                  id: value,
                },
              })
              .subscribe(({ data }) => {
                this.loading = false;
                if (data) {
                  this.record = data.record;
                }
              });
          }
        });
    }

    this.contextFilters = this.settings.contextFilters
      ? JSON.parse(this.settings.contextFilters)
      : this.contextFilters;

    // Listen to dashboard filters changes if it is necessary
    this.contextService.filter$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(({ previous, current }) => {
        if (
          this.contextService.filterRegex.test(this.settings.contextFilters)
        ) {
          if (
            this.contextService.shouldRefresh(this.settings, previous, current)
          ) {
            const contextFilters = this.contextService.injectContext(
              this.contextFilters
            );
            this.getRecordFromFilters(contextFilters);
          }
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
  public onComplete(e: { completed: boolean; hideNewRecord?: boolean }): void {
    this.completed = e.completed;
    this.hideNewRecord = e.hideNewRecord || false;

    if (this.settings.autoPopulateOnSubmit && e.completed === true) {
      // Reset the form
      setTimeout(() => {
        const data = structuredClone(
          this.formComponent?.survey.getParsedData?.() || {}
        );
        this.settings.autoPopulateOmitQuestions.forEach((question: string) => {
          delete data[question];
        });
        this.clearForm();
        if (this.formComponent) {
          this.formComponent.survey.data = data;
          this.formComponent.survey.runExpressions();
        }
      }, 1000);
    }
  }

  /**
   * Resets the form component.
   */
  public clearForm(): void {
    this.formComponent?.reset();
  }

  /**
   * Get record id from filters
   *
   * @param filter filter to update
   */
  private getRecordFromFilters(
    filter: CompositeFilterDescriptor | FilterDescriptor
  ) {
    if ('filters' in filter && filter.filters) {
      filter.filters.forEach((f) => {
        this.getRecordFromFilters(f);
      });
    } else if ('field' in filter && filter.field) {
      if (filter.field === 'record') {
        const recordId = filter.value;
        this.apollo
          .query<RecordQueryResponse>({
            query: GET_RECORD_BY_ID,
            variables: {
              id: recordId,
            },
          })
          .subscribe(({ data }) => {
            if (data) {
              this.record = data.record;
            }
          });
      }
    }
  }
}
