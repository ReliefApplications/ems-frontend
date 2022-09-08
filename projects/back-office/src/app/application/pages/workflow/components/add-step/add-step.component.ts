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
  GET_FORM_NAMES,
  GetFormsQueryResponse,
} from '../../../../../graphql/queries';
import { AddFormComponent } from '../../../../../components/add-form/add-form.component';
import { MatSelect } from '@angular/material/select';

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

  @ViewChild('formSelect') formSelect?: MatSelect;

  // === REACTIVE FORM ===
  public stepForm: FormGroup = new FormGroup({});
  public stage = 1;

  // === PERMISSIONS ===
  canCreateForm = false;
  private authSubscription?: Subscription;

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
          query: GET_FORM_NAMES,
          variables: {
            first: ITEMS_PER_PAGE,
          },
        });

        this.forms$ = this.forms.asObservable();
        this.formsQuery.valueChanges.subscribe((res) => {
          this.forms.next(res.data.forms.edges.map((x) => x.node));
          this.pageInfo = res.data.forms.pageInfo;
          this.loading = res.loading;
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
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.formSelect) {
      const panel = this.formSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more forms on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.formsQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            return Object.assign({}, prev, {
              forms: {
                edges: [...prev.forms.edges, ...fetchMoreResult.forms.edges],
                pageInfo: fetchMoreResult.forms.pageInfo,
                totalCount: fetchMoreResult.forms.totalCount,
              },
            });
          },
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
