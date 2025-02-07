import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AngularComponentFactory } from 'survey-angular-ui';
import { SurveyModel } from 'survey-core';
import { Question } from '../types';
import { CommonModule } from '@angular/common';
import { getVisibleQuestions } from '../../services/form-builder/form-builder.service';

/** Percentage bar for the forms*/
@Component({
  selector: 'sv-ng-progress-buttons',
  templateUrl: './progress-bar.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  /** Current survey model */
  @Input() model!: SurveyModel;
  /** Current page questions */
  public currentPageQuestions: Question[] = [];
  /** Progress bar percentage value */
  public value = 0;

  /**
   * Percentage progress bar for the forms
   *
   * @param cdr Angular change detector ref
   */
  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const updateCurrentPageQuestions = () => {
      this.currentPageQuestions = getVisibleQuestions(
        this.model.currentPage.questions
      );
      this.updateValue();
    };
    updateCurrentPageQuestions();
    this.model.onCurrentPageChanged.add(updateCurrentPageQuestions);
    this.model.onDynamicPanelAdded.add(updateCurrentPageQuestions);
    this.model.onDynamicPanelRemoved.add(updateCurrentPageQuestions);

    this.model.onValueChanged.add(() => {
      this.updateValue();
    });
  }

  /**
   * Updates percentage value
   */
  private updateValue() {
    this.value =
      (this.currentPageQuestions.filter(
        (question: Question) => !question.isEmpty()
      ).length *
        100) /
      this.currentPageQuestions.length;

    this.cdr.detectChanges();
  }
}

AngularComponentFactory.Instance.registerComponent(
  'sv-progressbar-percentage',
  ProgressBarComponent
);
