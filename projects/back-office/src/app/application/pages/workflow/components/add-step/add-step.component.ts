import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ContentType,
  CONTENT_TYPES,
  Form,
  Permissions,
  SafeAuthService,
  SafeSnackBarService,
  SafeWorkflowService,
} from '@safe/builder';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import {
  AddFormMutationResponse,
  ADD_FORM,
} from '../../../../../graphql/mutations';
import {
  GET_FORMS,
  GetFormsQueryResponse,
} from '../../../../../graphql/queries';
import { AddFormComponent } from '../../../../../components/add-form/add-form.component';
import { MatSelect } from '@angular/material/select';

const ITEMS_PER_PAGE = 10;

@Component({
  selector: 'app-add-step',
  templateUrl: './add-step.component.html',
  styleUrls: ['./add-step.component.scss'],
})
export class AddStepComponent implements OnInit, OnDestroy {
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
  private authSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private authService: SafeAuthService,
    private apollo: Apollo,
    private workflowServive: SafeWorkflowService
  ) {}

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
    this.authSubscription = this.authService.user$.subscribe(() => {
      this.canCreateForm = this.authService.userHasClaim(
        Permissions.canManageForms
      );
    });
  }

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

  onSubmit(): void {
    this.workflowServive.addStep(this.stepForm.value, this.route);
  }

  onBack(): void {
    this.stage -= 1;
  }

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

  onAdd(): void {
    const dialogRef = this.dialog.open(AddFormComponent, {
      panelClass: 'add-dialog',
    });
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

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
