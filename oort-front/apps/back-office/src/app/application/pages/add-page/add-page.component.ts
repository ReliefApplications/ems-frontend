import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import {
  ContentType,
  CONTENT_TYPES,
  Form,
  SafeApplicationService,
  SafeSnackBarService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { AddFormModalComponent } from '../../../components/add-form-modal/add-form-modal.component';
import { AddFormMutationResponse, ADD_FORM } from './graphql/mutations';
import { GET_FORMS, GetFormsQueryResponse } from './graphql/queries';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import { TranslateService } from '@ngx-translate/core';
import { ApolloQueryResult } from '@apollo/client';
import {
  getCachedValues,
  updateQueryUniqueValues,
} from '../../../utils/update-queries';

/**
 * Number of items per page.
 */
const ITEMS_PER_PAGE = 10;

/**
 * Add page component.
 */
@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public contentTypes = CONTENT_TYPES;
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

  @ViewChild('formSelect') formSelect?: MatSelect;

  // === REACTIVE FORM ===
  public pageForm: UntypedFormGroup = new UntypedFormGroup({});
  public step = 1;

  /**
   * Add page component
   *
   * @param formBuilder Angular form builder
   * @param apollo Apollo service
   * @param applicationService Shared application service
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.pageForm = this.formBuilder.group({
      type: ['', Validators.required],
      content: [''],
      newForm: [false],
    });
    this.pageForm.get('type')?.valueChanges.subscribe((type) => {
      const contentControl = this.pageForm.controls.content;
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
   * Check if step is valid or not
   *
   * @param step step index
   * @returns is step valid
   */
  isStepValid(step: number): boolean {
    switch (step) {
      case 1: {
        return this.pageForm.controls.type.valid;
      }
      case 2: {
        return this.pageForm.controls.content.valid;
      }
      default: {
        return true;
      }
    }
  }

  /**
   * Submit form to application service for creation
   */
  onSubmit(): void {
    this.applicationService.addPage(this.pageForm.value);
  }

  /**
   * Go to previous step.
   */
  onBack(): void {
    this.step -= 1;
  }

  /**
   * Go to next step.
   */
  onNext(): void {
    switch (this.step) {
      case 1: {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.pageForm.controls.type.value === ContentType.form
          ? (this.step += 1)
          : this.onSubmit();
        break;
      }
      case 2: {
        this.onSubmit();
        break;
      }
      default: {
        this.step += 1;
        break;
      }
    }
  }

  /**
   * Add a new form.
   */
  onAdd(): void {
    const dialogRef = this.dialog.open(AddFormModalComponent);
    dialogRef.afterClosed().subscribe((value) => {
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
            next: ({ errors, data }) => {
              if (errors) {
                this.snackBar.openSnackBar(
                  this.translate.instant(
                    'common.notifications.objectNotCreated',
                    {
                      type: this.translate
                        .instant('common.form.one')
                        .toLowerCase(),
                      error: errors ? errors[0].message : '',
                    }
                  ),
                  { error: true }
                );
              } else {
                const id = data?.addForm.id || '';
                this.pageForm.controls.content.setValue(id);
                this.snackBar.openSnackBar(
                  this.translate.instant('common.notifications.objectCreated', {
                    type: this.translate.instant('common.page.one'),
                    value: value.name,
                  })
                );

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
      data.forms.edges.map((x) => x.node),
      'id'
    );
    this.forms.next(this.cachedForms);
    this.pageInfo = data.forms.pageInfo;
    this.loadingMore = loading;
  }
}
