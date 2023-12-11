import { Apollo, QueryRef } from 'apollo-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ContentType,
  CONTENT_TYPES,
  WIDGET_TYPES,
  ApplicationService,
  UnsubscribeComponent,
  FormsQueryResponse,
  AddFormMutationResponse,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs';
import { ADD_FORM } from './graphql/mutations';
import { GET_FORMS } from './graphql/queries';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';

/** Number of items per page */
const ITEMS_PER_PAGE = 10;
/** Widget types that can be used as single widget page */
const SINGLE_WIDGET_PAGE_TYPES = ['grid', 'map', 'summaryCard', 'tabs'];

/**
 * Add page component.
 */
@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent extends UnsubscribeComponent implements OnInit {
  /** Available content types */
  public contentTypes = CONTENT_TYPES;
  /** Available widgets for addition */
  public availableWidgets: any[] = WIDGET_TYPES;
  /** Forms query */
  public formsQuery!: QueryRef<FormsQueryResponse>;
  /** New page form */
  public pageForm = this.fb.group({
    type: ['', Validators.required],
    content: [''],
    newForm: [false],
  });
  /** Current step in stepper */
  public step = 1;

  /**
   * Add page component
   *
   * @param fb Angular form builder
   * @param apollo Apollo service
   * @param applicationService Shared application service
   * @param dialog Dialog service
   * @param snackBar Shared snackbar service
   * @param translate Angular translate service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private applicationService: ApplicationService,
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.pageForm.get('type')?.valueChanges.subscribe((type) => {
      const contentControl = this.pageForm.controls.content;
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

    // Set the available widgets that can directly be added as single widget dashboard
    this.availableWidgets = this.availableWidgets.filter((widget: any) => {
      for (const wid of SINGLE_WIDGET_PAGE_TYPES) {
        if (widget.id.includes(wid)) {
          return widget;
        }
      }
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
   * Submit form to application service for creation of a new page
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
  async onAdd(): Promise<void> {
    const { AddFormModalComponent } = await import(
      '../../../components/add-form-modal/add-form-modal.component'
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
   * Add a new widget as a dashboard page.
   * Skip the onSubmit method, and use custom event handling to call application service to add the page with new content.
   *
   * @param widget new widget.
   */
  onAddWidget(widget: any): void {
    // Build the structure and set width of widget
    const structure = [
      {
        ...widget,
        cols: 8,
      },
    ];
    // Directly call application service to add page with structure
    this.applicationService.addPage(
      {
        type: 'dashboard',
      },
      structure
    );
  }

  /**
   * Update query based on text search.
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
