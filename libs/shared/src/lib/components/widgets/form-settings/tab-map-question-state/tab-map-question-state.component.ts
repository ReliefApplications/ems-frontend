import { Component, Input, OnInit } from '@angular/core';
import { Form, FormQueryResponse } from '../../../../models/form.model';
import { GET_SHORT_FORM_BY_ID } from '../graphql/queries';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { Apollo } from 'apollo-angular';
import { takeUntil } from 'rxjs';
import { Model } from 'survey-core';
import { FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';

/**
 * Map question value to state tab of form settings modal.
 */
@Component({
  selector: 'shared-tab-map-question-state',
  templateUrl: './tab-map-question-state.component.html',
  styleUrls: ['./tab-map-question-state.component.scss'],
})
export class TabMapQuestionStateComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Form  */
  @Input() form: Form | null = null;
  /** Form id */
  @Input() formId?: string;
  /** Form group */
  @Input() formGroup!: FormGroup;
  /** Array of available questions in the selected form */
  public questions!: string[];
  /** Array of available states in the dashboard */
  public states!: string[];
  /** Loading indicator */
  public loading = true;

  /**
   * Getter for the mappings
   *
   * @returns The mappings in an array
   */
  get mappings(): UntypedFormArray {
    return this.formGroup.get('mapQuestionState') as UntypedFormArray;
  }

  /**
   * Map question value to state tab of form settings modal.
   *
   * @param apollo The apollo client
   * @param fb Angular form builder
   * @param dashboardService Dashboard service
   */
  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private dashboardService: DashboardService
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.form) {
      this.getQuestions();
    } else if (this.formId) {
      this.getFormById();
    } else {
      this.loading = false;
    }
    this.states = this.dashboardService.states
      .getValue()
      .map((state: any) => state.name);
  }

  /**
   * Add new filter row
   */
  public addMapping(): void {
    const filter = this.fb.group({
      question: null,
      state: null,
      direction: 'both',
    });
    this.mappings.push(filter);
  }

  /**
   * Remove mapping at index
   *
   * @param index mapping index
   */
  deleteMapping(index: number): void {
    this.mappings.removeAt(index);
  }

  /**
   * Get available questions from form structure.
   */
  private getQuestions() {
    const structure = this.form?.structure as string;
    const survey = new Model(structure);
    this.questions = survey
      .getAllQuestions()
      .map((question: any) => question.name);
    this.loading = false;
  }

  /**
   * Gets query form details
   */
  private getFormById(): void {
    this.apollo
      .query<FormQueryResponse>({
        query: GET_SHORT_FORM_BY_ID,
        variables: {
          id: this.formId,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        if (data) {
          this.form = data.data.form;
          this.getQuestions();
        }
      });
  }
}
