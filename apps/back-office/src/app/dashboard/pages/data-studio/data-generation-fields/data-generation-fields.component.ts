import {
  FormQueryResponse,
  UnsubscribeComponent,
  FormBuilderService,
  EditRecordMutationResponse,
  GenerateRecordsMutationResponse,
} from '@oort-front/shared';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
} from '@angular/forms';
import { dataGenerationMap } from './data-generation-fields-type-mapping';
import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_FORM_STRUCTURE } from './graphql/queries';
import { GENERATE_RECORDS, EDIT_RECORD } from './graphql/mutations';
import { Model, QuestionExpressionModel } from 'survey-core';
import { takeUntil, firstValueFrom } from 'rxjs';
import { SnackbarService } from '@oort-front/ui';

/** Conversion fields component */
@Component({
  selector: 'app-data-generation-fields',
  templateUrl: './data-generation-fields.component.html',
  styleUrls: ['./data-generation-fields.component.scss'],
})
/** Data generation class component */
export class DataGenerationFieldsComponent
  extends UnsubscribeComponent
  implements OnChanges
{
  /** Form id input */
  @Input() formId!: string;

  /** Form query reference */
  private formStructureQuery!: QueryRef<FormQueryResponse>;

  /** Form object */
  private form: any = {};

  /** Data generation form */
  public dataGenerationForm!: ReturnType<typeof this.createDataGenerationForm>;

  /** Survey model, for setting default values on a question level */
  public questionSurvey: Model = new Model();

  /** Form survey */
  public formSurvey: Model = new Model();

  /** Array of fields */
  public fields: any[] = [];

  /** Loading flag */
  public loading = false;

  /** Checkbox flag */
  public isChecked = false;

  /** Expanded accordion item index */
  public accordionItemExpanded = -1;

  /** Extra options for text fields */
  public textOptions = [
    'lorem',
    'name',
    'firstName',
    'lastName',
    'jobTitle',
    'product',
    'company',
  ];

  /**
   * Data generation component constructor
   *
   * @param apollo - Apollo client service
   * @param fb - FormBuilder service
   * @param translate - Translate service
   * @param formBuilderService - FormBuilderService
   * @param snackBar - SnackbarService
   */
  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private translate: TranslateService,
    private formBuilderService: FormBuilderService,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnChanges() {
    this.loading = true;
    if (this.formId) {
      this.formStructureQuery = this.apollo.watchQuery<FormQueryResponse>({
        query: GET_FORM_STRUCTURE,
        variables: {
          id: this.formId,
        },
      });
      this.formStructureQuery.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data, loading }) => {
          this.dataGenerationForm = this.createDataGenerationForm();
          this.isChecked = false;
          // Initialize the form survey
          this.formSurvey = this.formBuilderService.createSurvey(
            data?.form?.structure || ''
          );

          // Initialized a the fields array, with each element being the JSON representation of a question
          this.fields = this.formSurvey
            .getAllQuestions()
            .map((q) => ({ ...q.toJSON(), type: q.getType() }));

          this.fields.forEach((field: any) => {
            this.fieldsForm.push(this.createFieldForm(field));
          });
          this.form = data.form;
          this.loading = loading;
        });
    } else {
      this.loading = false;
    }
  }

  /**
   * Get the display name in the conversion map
   *
   * @param field the Field
   * @returns The type display name
   */
  public getDisplayName(field: any): string {
    if (!dataGenerationMap[field.type] && !dataGenerationMap[field.inputType]) {
      return field.type;
    }
    if (dataGenerationMap[field.inputType]) {
      return dataGenerationMap[field.inputType].displayName;
    }
    return dataGenerationMap[field.type].displayName;
  }

  /**
   * Get generation method to display
   *
   * @param field the Field
   * @returns Generation source for the type
   */
  public getGenerationSource(field: any): string {
    if (!dataGenerationMap[field.type] && !dataGenerationMap[field.inputType]) {
      return '';
    }
    if (dataGenerationMap[field.inputType]) {
      return (
        this.translate.instant(dataGenerationMap[field.inputType].source) ?? ''
      );
    }
    return this.translate.instant(dataGenerationMap[field.type].source) ?? '';
  }

  /**
   * onClick event for the button
   */
  public onClick() {
    this.generateData();
  }

  /**
   * Accordion item open handler
   *
   * @param index Item index
   */
  public onAccordionItemOpen(index: number) {
    this.questionSurvey = this.formBuilderService.createSurvey(
      this.getSingleFieldSurveyStructure(this.fields[index])
    );
    // Resetting the "default" value on survey in case its closed and opened again
    if (this.fieldsForm.controls[index].get('setDefault')?.value) {
      this.questionSurvey.setValue(
        this.fields[index].name,
        this.fieldsForm.controls[index].get('default')?.value
      );
    }
    // Subscribe the fieldsForm "default" control to the survey value change
    this.questionSurvey.onValueChanged.add((sender, options) => {
      this.fieldsForm.controls[index].patchValue({
        default: options.value,
      });
    });
  }

  /**
   * Create the dataGeneration form
   *
   * @returns the dataGeneration form
   */
  private createDataGenerationForm() {
    return this.fb.group({
      fieldsForm: this.fb.array<ReturnType<typeof this.createFieldForm>>([]),
      recordsNumber: new FormControl<number | null>(null, Validators.required),
    });
  }

  /**
   * Create field form which is going to be a formArray
   *
   * @param field the question object from the form structure
   * @returns the fieldForm
   */
  private createFieldForm(field: any) {
    return this.fb.group({
      field: new FormControl(field.name, Validators.required),
      include: new FormControl(false, Validators.required),
      setDefault: new FormControl(false, Validators.required),
      default: new FormControl(),
      minDate: new FormControl(),
      maxDate: new FormControl(),
      minNumber: new FormControl(),
      maxNumber: new FormControl(),
      minTime: new FormControl(),
      maxTime: new FormControl(),
      phoneFormat: new FormControl(),
      textSource: new FormControl('name'),
    });
  }

  /**
   * Returns a new survey structure with only one field
   *
   * @param questionJSON The question to be displayed
   * @returns The new question survey structure
   */
  private getSingleFieldSurveyStructure(questionJSON: string): any {
    return {
      pages: [
        {
          name: 'page1',
          elements: [questionJSON],
        },
      ],
      showQuestionNumbers: 'off',
    };
  }

  /**
   *  Generate new record data
   */
  private async generateData(): Promise<void> {
    this.loading = true;
    const fieldsToGenerate =
      this.dataGenerationForm.value.fieldsForm?.filter((x) => x.include) ?? [];
    const res = await firstValueFrom(
      this.apollo.mutate<GenerateRecordsMutationResponse>({
        mutation: GENERATE_RECORDS,
        variables: {
          form: this.formId,
          fieldsConfig: fieldsToGenerate,
          recordsNumber: this.dataGenerationForm.value.recordsNumber,
        },
      })
    );

    for (const record of res.data?.generateRecords ?? []) {
      this.formSurvey.data = record.data;
      // Run surveyJS expressions
      console.log(this.formSurvey.getAllQuestions());
      this.formSurvey.getAllQuestions().forEach((q) => {
        console.log(q.name, q.getType());

        if (q.getType() === 'resource') {
          const qValue = q.value;
          this.formSurvey.setValue(q.name, null);
          this.formSurvey.setValue(q.name, qValue);
        }
        if (q.getType() !== 'expression') {
          return;
        }

        // check if should be generated
        if (!fieldsToGenerate.find((x) => x.field === q.name)) {
          return;
        }

        const expQuestion = q as QuestionExpressionModel;
        console.log(this.formSurvey.runExpression(expQuestion.expression));
      });

      await firstValueFrom(
        this.apollo.mutate<EditRecordMutationResponse>({
          mutation: EDIT_RECORD,
          variables: {
            id: record.id,
            data: this.formSurvey.data,
          },
        })
      );
    }
    this.loading = false;
    this.snackBar.openSnackBar(
      this.dataGenerationForm.value.recordsNumber +
        ' ' +
        this.translate.instant('common.notifications.dataGenerated')
    );
  }

  /** @returns the fieldsForm as a form array */
  get fieldsForm() {
    return this.dataGenerationForm.get('fieldsForm') as FormArray;
  }

  /**
   *  Function to handle Select all checkbox
   */
  public selectAll() {
    if (this.isChecked) {
      this.fieldsForm.controls.forEach((control) => {
        control.patchValue({ include: true });
      });
    } else {
      this.fieldsForm.controls.forEach((control) => {
        control.patchValue({ include: false });
      });
    }
  }
}
