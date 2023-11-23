import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionAngular } from 'survey-angular-ui';
import {
  QuestionSurveyQueriesModel,
  SurveyQuery,
} from './survey-queries.model';
import { Dialog } from '@angular/cdk/dialog';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SurveyModel } from 'survey-core';
import { Subject, takeUntil } from 'rxjs';

/**
 * Resource available fields component for survey creator
 */
@Component({
  selector: 'shared-survey-queries',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule, TooltipModule],
  templateUrl: './survey-queries.component.html',
})
export class SurveyQueriesComponent
  extends QuestionAngular<QuestionSurveyQueriesModel>
  implements OnDestroy
{
  private destroy$: Subject<void> = new Subject<void>();
  public queries: SurveyQuery[] = [];

  /**
   * Returns the survey model casted to SurveyModel
   *
   * @returns Survey model
   */
  get survey() {
    return this.model.survey as SurveyModel;
  }

  /**
   * Gets the available questions in the survey
   *
   * @returns Array of question names
   */
  get availableQuestions() {
    return (this.model.obj as SurveyModel)
      .getAllQuestions(false, true)
      .map((q) => q.name);
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param changeDetectorRef - Angular - This is angular change detector ref of the component instance needed for the survey AngularQuestion class
   * @param viewContainerRef - Angular - This is angular view container ref of the component instance needed for the survey AngularQuestion class
   * @param dialog - Angular CDK - This is the Dialog service that is used to handle cdk dialogs
   */
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    viewContainerRef: ViewContainerRef,
    private dialog: Dialog
  ) {
    super(changeDetectorRef, viewContainerRef);

    // Once ready, set the queries from the model
    this.onModelChanged = () => {
      this.queries = this.model.obj.graphQLQueries || [];
    };
  }

  /**
   * Opens the query editor dialog
   *
   * @param {number} index - Index of the query to edit
   */
  async onEdit(index: number) {
    const { EditSurveyQueryModalComponent } = await import(
      './edit-survey-query-modal/edit-survey-query-modal.component'
    );

    // Open the dialog
    const dialogRef = this.dialog.open(EditSurveyQueryModalComponent, {
      data: {
        query: this.queries[index],
        availableQuestions: this.availableQuestions,
      },
    });

    // Listen to the dialog close event
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((result) => {
      // If the result is nullish, the dialog was closed without saving
      if (!result) {
        return;
      }

      const newQuery = result as SurveyQuery;

      // Update the query
      this.queries[index] = newQuery;

      // Update the property value
      this.survey.setPropertyValue('graphQLQueries', this.queries);

      // Update the model value
      this.model.obj.graphQLQueries = this.queries;

      this.triggerChangeDetection();
    });
  }

  /**
   * Deletes the query at the given index
   *
   * @param index Index of the query to delete
   */
  onDelete(index: number) {
    // Remove the query from the list
    this.queries.splice(index, 1);

    // Update the property value
    this.survey.setPropertyValue('graphQLQueries', this.queries);

    // Update the model value
    this.model.obj.graphQLQueries = this.queries;

    this.triggerChangeDetection();
  }

  /** Opens the query editor dialog */
  onAdd() {
    // Open the dialog
    this.onEdit(this.queries.length);
  }

  /** Triggers change detection on survey creator and angular component */
  private triggerChangeDetection() {
    // There must be a better way to do this, but I couldn't figure it out
    this.model.obj.addNewPage('__TEMP__');
    this.model.obj.removePage(this.model.obj.getPageByName('__TEMP__'));

    // Manually trigger angular change detection
    this.changeDetectorRef.detectChanges();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
