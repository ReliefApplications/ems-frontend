import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
  SelectMenuModule,
  TableModule,
  TooltipModule,
} from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { SurveyQuery } from '../survey-queries.model';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { takeUntil } from 'rxjs';
import { gql } from '@apollo/client';
import { UnsubscribeComponent } from '../../../../components/utils/unsubscribe/unsubscribe.component';
import { EmptyModule } from '../../../../components/ui/empty/empty.module';
/**
 * Creates a form group for the query
 *
 * @param query Initial query definition, if any
 * @returns The form group for the query
 */
const createQueryForm = (query?: SurveyQuery) => {
  return new FormGroup({
    name: new FormControl({ value: query?.name, disabled: true }, [
      Validators.required,
    ]),
    url: new FormControl(query?.url, [Validators.required]),
    query: new FormControl(query?.query, [Validators.required]),
    variables: new FormArray(
      Object.entries(query?.variables || {})
        // Filter out surveyJS text artifacts
        .filter(([, value]) => typeof value === 'object' && value?.question)
        .map(
          ([param, value]) =>
            new FormGroup({
              variable: new FormControl(param),
              question: new FormControl(
                value.question,
                value.required ? [Validators.required] : []
              ),
              required: new FormControl(value.required),
            })
        )
    ),
  });
};

/** Component for editing or adding a survey graphQL query */
@Component({
  selector: 'shared-edit-survey-query-modal',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    MonacoEditorModule,
    ButtonModule,
    FormWrapperModule,
    EmptyModule,
    TableModule,
    SelectMenuModule,
    IconModule,
    TooltipModule,
    AlertModule,
  ],
  templateUrl: './edit-survey-query-modal.component.html',
})
export class EditSurveyQueryModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Form group for the query */
  public queryForm = createQueryForm(this.data.query);
  /** Query is valid */
  public queryIsValid =
    this.parseQuery(this.queryForm.get('query')?.value || '') !== null;
  /** Columns displayed in the variable mapping table */
  public columns = ['variable', 'question'];
  /** Available questions to map to variables */
  public availableQuestions = this.data.availableQuestions;
  /** Cached mapping of variables to questions */
  private cachedMapping: Record<string, string> = {};
  /** Data for the variable mapping table */
  public variableMappingData: {
    variable: string;
    question: string;
    required: boolean;
  }[] = [];

  /**
   * Gets the variables form array
   *
   * @returns The the variables form array
   */
  public get variablesFormArray() {
    return this.queryForm.get('variables') as FormArray | null;
  }

  /** Monaco editor configuration, for raw edition */
  public editorOptions = {
    theme: 'vs-dark',
    language: 'graphql',
    fixedOverflowWidgets: true,
    minimap: {
      enabled: false,
    },
  };

  /**
   * Component for editing or adding a survey graphQL query
   *
   * @param data Data passed to the dialog (query definition, if any)
   * @param data.query Query definition, if any
   * @param data.availableQuestions List of available questions to map to variables
   * @param dialogRef Reference to the dialog
   */
  constructor(
    @Inject(DIALOG_DATA)
    public data: { query?: SurveyQuery; availableQuestions: string[] },
    public dialogRef: DialogRef<SurveyQuery>
  ) {
    super();
  }

  ngOnInit(): void {
    const updateVariableMappingData = () => {
      this.variableMappingData = (
        this.queryForm.get('variables') as FormArray
      ).value.map((variable: (typeof this.variableMappingData)[number]) => ({
        variable: variable.variable,
        question: variable.question,
        required: variable.required,
      }));
    };

    // Subscribe to the query in order to update name and variables
    this.queryForm
      .get('query')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((query) => {
        const res = this.parseQuery(query || '');

        if (!res) {
          // Query is invalid
          this.queryIsValid = false;
          return;
        }

        this.queryIsValid = true;

        const { name, variables } = res;

        // We add to the cache the current mapping of variables to questions
        this.variableMappingData.forEach((mapping) => {
          this.cachedMapping[mapping.variable] = mapping.question;
        });

        // Update name
        this.queryForm.get('name')?.setValue(name);

        const variablesFormArray = this.queryForm.get('variables') as FormArray;

        // Remove current variables
        variablesFormArray.clear();

        // Add new variables
        variables?.forEach((variable) => {
          variablesFormArray.push(
            new FormGroup({
              variable: new FormControl(variable.name),
              question: new FormControl(
                this.cachedMapping[variable.name],
                variable.required ? [Validators.required] : []
              ),
              required: new FormControl(variable.required),
            })
          );
        });

        // Update the mapping data
        updateVariableMappingData();
      });

    updateVariableMappingData();
  }

  /**
   * Parses the query to extract the name and variables
   *
   * @param queryStr Query to parse
   * @returns The name and variables, or null if the query is invalid
   */
  private parseQuery(queryStr: string) {
    try {
      const query = gql(queryStr);
      const definition = query.definitions[0];

      if (!definition || definition.kind !== 'OperationDefinition') {
        return null;
      }

      const name = definition.name?.value;
      const variables = definition.variableDefinitions?.map((variable) => ({
        name: variable.variable.name.value,
        required: variable.type.kind === 'NonNullType',
      }));

      return { name, variables };
    } catch {
      return null;
    }
  }

  /**
   * Handles the selection of a question on the variable mapping table
   *
   * @param question Selected question
   * @param index Index of the variable to map
   */
  onQuestionSelected(question: string, index: number) {
    const variablesFormArray = this.queryForm.get('variables') as FormArray;
    const variableForm = variablesFormArray.at(index) as FormGroup;
    variableForm.get('question')?.setValue(question);
  }

  /** Closes the modal and returns the value */
  public onSubmit() {
    if (!this.queryForm.valid || !this.queryIsValid) {
      return;
    }

    // Transform the form value back into SurveyQuery
    const res: SurveyQuery = {
      name: this.queryForm.get('name')?.value || '',
      url: this.queryForm.get('url')?.value || '',
      query: this.queryForm.get('query')?.value || '',
      variables: {},
    };

    (this.queryForm.get('variables') as FormArray).value.forEach(
      (variable: (typeof this.variableMappingData)[number]) => {
        res.variables[variable.variable] = {
          question: variable.question,
          required: variable.required,
        };
      }
    );

    // Close the dialog and return the value
    this.dialogRef.close(res);
  }
}
