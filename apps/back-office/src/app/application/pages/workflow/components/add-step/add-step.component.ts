import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ContentType,
  CONTENT_TYPES,
  Form,
  SafeAuthService,
  SafeUnsubscribeComponent,
  SafeWorkflowService,
} from '@oort-front/safe';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { AddFormMutationResponse, ADD_FORM } from '../../graphql/mutations';
import { GET_FORMS, GetFormsQueryResponse } from '../../graphql/queries';
import { ApolloQueryResult } from '@apollo/client';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../../../utils/update-queries';
import { Dialog } from '@angular/cdk/dialog';
import { SnackbarService } from '@oort-front/ui';

/** Default items per query for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Add step page component.
 */
@Component({
  selector: 'app-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.scss'],
})
export class AddStepComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public contentTypes = CONTENT_TYPES.filter((x) => x.value !== 'workflow');
  private forms = new BehaviorSubject<Form[]>([]);
  public forms$!: Observable<Form[]>;
  private cachedForms: Form[] = [];
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;
  public loadingMore = false;

  // === REACTIVE FORM ===
  public stepForm: UntypedFormGroup = new UntypedFormGroup({});
  public stage = 1;

  /**
   * Add step page component
   *
   * @param route Angular activated route
   * @param formBuilder Angular form builder
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param apollo Apollo service
   * @param workflowServive Shared workflow service
   */
  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private authService: SafeAuthService,
    private apollo: Apollo,
    private workflowServive: SafeWorkflowService
  ) {
    super();
  }

  ngOnInit(): void {
    this.stepForm = this.formBuilder.group({
      type: ['', Validators.required],
      content: [''],
    });
    this.stepForm.get('type')?.valueChanges.subscribe((type) => {
      const contentControl = this.stepForm.controls.content;
      if (type === ContentType.form) {
        this.formsQuery = this.apollo.watchQuery<GetFormsQueryResponse>({
          query: GET_FORMS,
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: null,
            filter: {
              logic: 'and',
              filters: [
                {
                  field: 'name',
                  operator: 'contains',
                  value: '',
                },
              ],
            },
          },
        });

        this.forms$ = this.forms.asObservable();
        this.formsQuery.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((results) => {
            this.updateValues(results.data, results.loading);
          });
        contentControl.setValidators([Validators.required]);
        contentControl.updateValueAndValidity();
      } else {
        contentControl.setValidators(null);
        contentControl.setValue(null);
        contentControl.updateValueAndValidity();
      }
      this.onNext();
    });
  }

  /**
   * Check if form stage is valid
   *
   * @param stage index of stage
   * @returns is stage valid
   */
  isStageValid(stage: number): boolean {
    switch (stage) {
      case 1: {
        return this.stepForm.controls.type.valid;
      }
      case 2: {
        return this.stepForm.controls.content.valid;
      }
      default: {
        return true;
      }
    }
  }

  /**
   * Submit form to workflow service
   */
  onSubmit(): void {
    this.workflowServive.addStep(this.stepForm.value, this.route);
  }

  /**
   * Go to previous stage
   */
  onBack(): void {
    this.stage -= 1;
  }

  /**
   * Go to next stage
   */
  onNext(): void {
    switch (this.stage) {
      case 1: {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.stepForm.controls.type.value === ContentType.form
          ? (this.stage += 1)
          : this.onSubmit();
        break;
      }
      case 2: {
        this.onSubmit();
        break;
      }
      default: {
        this.stage += 1;
        break;
      }
    }
  }

  /**
   * Open add form component
   */
  async onAdd(): Promise<void> {
    const { AddFormModalComponent } = await import(
      '../../../../../components/add-form-modal/add-form-modal.component'
    );
    const dialogRef = this.dialog.open(AddFormModalComponent);
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        const variablesData = { name: value.name };
        Object.assign(
          variablesData,
          value.resource && { resource: value.resource },
          value.template && { template: value.template }
        );
        this.apollo
          .mutate<AddFormMutationResponse>({
            mutation: ADD_FORM,
            variables: variablesData,
          })
          .subscribe({
            next: ({ data }) => {
              if (data) {
                const { id } = data.addForm;
                this.stepForm.controls.content.setValue(id);
                this.onSubmit();
              }
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            },
          });
      }
    });
  }

  /**
   * Fetches next page of forms to add to list.
   *
   * @param value boolean that decides wether a next page of forms should be fetched
   */
  public onScrollDataSource(value: boolean): void {
    if (!this.loadingMore && this.pageInfo.hasNextPage) {
      this.loadingMore = true;
      this.fetchMoreForms(value);
    }
  }

  /**
   * Filters forms by name
   *
   * @param filter string used to filter.
   */
  public onFilterDataSource(filter: string): void {
    if (!this.loadingMore) {
      this.loadingMore = true;
      this.fetchMoreForms(false, filter);
    }
  }

  /**
   * Fetches more forms using filtering and pagination.
   *
   * @param nextPage boolean to indicate if we must fetch the next page.
   * @param filter the forms fetched must respect this filter
   */
  public fetchMoreForms(nextPage: boolean = false, filter: string = '') {
    const variables: any = {
      first: ITEMS_PER_PAGE,
      afterCursor: nextPage ? this.pageInfo.endCursor : null,
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: filter,
          },
        ],
      },
    };
    const cachedValues: GetFormsQueryResponse = getCachedValues(
      this.apollo.client,
      GET_FORMS,
      variables
    );
    if (filter || !nextPage) {
      this.cachedForms = [];
    }
    if (cachedValues) {
      this.updateValues(cachedValues, false);
    } else {
      if (filter) {
        this.formsQuery.refetch(variables);
      } else {
        this.formsQuery
          .fetchMore({
            variables,
          })
          .then((results: ApolloQueryResult<GetFormsQueryResponse>) => {
            this.updateValues(results.data, results.loading);
          });
      }
    }
  }

  /**
   * Updates local list with given data
   *
   * @param data New values to update forms
   * @param loading Loading state
   */
  private updateValues(data: GetFormsQueryResponse, loading: boolean) {
    this.cachedForms = updateQueryUniqueValues(
      this.cachedForms,
      data.forms?.edges?.map((x) => x.node)
    );
    this.forms.next(this.cachedForms);
    this.pageInfo = data.forms.pageInfo;
    this.loadingMore = loading;
  }
}
