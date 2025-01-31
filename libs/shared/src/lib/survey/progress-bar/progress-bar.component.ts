import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AngularComponentFactory } from 'survey-angular-ui';
import { SurveyModel } from 'survey-core';
import { Question } from '../types';
import { CommonModule } from '@angular/common';

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
      this.currentPageQuestions = this.getVisibleQuestions(
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
   * Gets visible questions
   *
   * @param questions current page questions
   * @returns the interesting questions
   */
  private getVisibleQuestions(questions: Question[]): Question[] {
    return questions.flatMap((question: Question) => {
      if (question.getType() === 'panel' && question.elements) {
        // If the question is a static panel, recursively get nested questions
        return this.getVisibleQuestions(question.elements);
      }
      if (question.getType() === 'paneldynamic' && question.panels) {
        // If the question is a dynamic panel, iterate through each panel's elements
        return question.panels.flatMap((panel: any) =>
          this.getVisibleQuestions(panel.elements)
        );
      }
      // Include questions that are not read-only and are visible
      return !question.readOnly && question.isVisible ? [question] : [];
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
