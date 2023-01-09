import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ContentType,
  CONTENT_TYPES,
  Form,
  Permissions,
  SafeAuthService,
  SafeSnackBarService,
  SafeUnsubscribeComponent,
  SafeWorkflowService,
} from '@safe/builder';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AddFormMutationResponse, ADD_FORM } from '../../graphql/mutations';
import { GET_FORMS, GetFormsQueryResponse } from '../../graphql/queries';
import { AddFormModalComponent } from '../../../../../components/add-form-modal/add-form-modal.component';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';

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
  private formsQuery!: QueryRef<GetFormsQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;
  public loadingMore = false;

  @ViewChild('formSelect') formSelect?: MatSelect;

  // === REACTIVE FORM ===
  public stepForm: FormGroup = new FormGroup({});
  public stage = 1;

  // === PERMISSIONS ===
  canCreateForm = false;

  /**
   * Add step page component
   *
   * @param route Angular activated route
   * @param formBuilder Angular form builder
   * @param dialog Material dialog service
   * @param snackBar Shared snackbar service
   * @param authService Shared authentication service
   * @param apollo Apollo service
   * @param workflowServive Shared workflow service
   */
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
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
          },
        });

        this.forms$ = this.forms.asObservable();
        this.formsQuery.valueChanges.subscribe((res) => {
          this.forms.next(res.data.forms.edges.map((x) => x.node));
          this.pageInfo = res.data.forms.pageInfo;
          this.loadingMore = res.loading;
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
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.canCreateForm = this.authService.userHasClaim(
        Permissions.canManageForms
      );
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
  onAdd(): void {
    const dialogRef = this.dialog.open(AddFormModalComponent);
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        const data = { name: value.name };
        Object.assign(
          data,
          value.resource && { resource: value.resource },
          value.template && { template: value.template }
        );
        this.apollo
          .mutate<AddFormMutationResponse>({
            mutation: ADD_FORM,
            variables: data,
          })
          .subscribe(
            (res) => {
              if (res.data) {
                const { id } = res.data.addForm;
                this.stepForm.controls.content.setValue(id);
                this.onSubmit();
              }
            },
            (err) => {
              this.snackBar.openSnackBar(err.message, { error: true });
            }
          );
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
    };
    variables.filter = {
      logic: 'and',
      filters: [
        {
          field: 'name',
          operator: 'contains',
          value: filter,
        },
      ],
    };
    if (nextPage) {
      variables.afterCursor = this.pageInfo.endCursor;
    }
    this.formsQuery.fetchMore({
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return Object.assign({}, prev, {
          forms: {
            edges: prev.forms.edges.concat(
              fetchMoreResult.forms.edges.filter(
                (x) => !prev.forms.edges.some((y) => y.node.id === x.node.id)
              )
            ),
            pageInfo: fetchMoreResult.forms.pageInfo,
            totalCount: fetchMoreResult.forms.totalCount,
          },
        });
      },
    });
  }
}
