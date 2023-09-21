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
  SafeUnsubscribeComponent,
  SafeWorkflowService,
  FormsQueryResponse,
  AddFormMutationResponse,
} from '@oort-front/safe';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ADD_FORM } from '../../graphql/mutations';
import { GET_FORMS } from '../../graphql/queries';
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
  public formsQuery!: QueryRef<FormsQueryResponse>;

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
   * @param apollo Apollo service
   * @param workflowService Shared workflow service
   */
  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private apollo: Apollo,
    private workflowService: SafeWorkflowService
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
        this.formsQuery = this.apollo.watchQuery<FormsQueryResponse>({
          query: GET_FORMS,
          variables: {
            first: ITEMS_PER_PAGE,
            sortField: 'name',
          },
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
    this.workflowService.addStep(this.stepForm.value, this.route);
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
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onSearchChange(search: string): void {
    const variables = this.formsQuery.variables;
    this.formsQuery.refetch({
      ...variables,
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: search,
          },
        ],
      },
    });
  }
}
