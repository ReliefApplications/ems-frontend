import { Component, OnInit } from '@angular/core';
import * as SurveyCreator from 'survey-creator';
import * as Survey from 'survey-angular';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

/**
 * Array containing the different types of questions.
 * Commented types are not yet implemented.
 */
const QUESTION_TYPES = [
  'checkbox',
  'radiogroup',
  'dropdown',
  'tagbox',
  'boolean',
];
/**
 * Filter builder component
 */
@Component({
  selector: 'safe-filter-builder',
  templateUrl: './filter-builder.component.html',
  styleUrls: ['./filter-builder.component.scss'],
})
export class SafeFilterBuilderComponent implements OnInit {
  surveyCreator!: SurveyCreator.SurveyCreator;
  questions: Survey.Question[] = [];

  /**
   * Dialog component to build the filter
   *
   * @param dialogRef reference to the dialog component
   */
  constructor(private dialogRef: MatDialogRef<SafeFilterBuilderComponent>) {}

  ngOnInit(): void {
    this.setFormBuilder();
  }

  /**
   * Creates the form builder and sets up all the options.
   */
  private setFormBuilder() {
    const creatorOptions = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: false,
      questionTypes: QUESTION_TYPES,
    };
    this.setCustomTheme();
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      'surveyCreatorContainer',
      creatorOptions
    );
    console.log(Survey.CustomWidgetCollection.length);
    this.surveyCreator.showToolbox = 'right';
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
  }

  /**
   * Set a theme for the form builder depending on the environment
   */
  setCustomTheme(): void {
    Survey.StylesManager.applyTheme();
    SurveyCreator.StylesManager.applyTheme();
  }

  /**
   * Custom SurveyJS method, save the form when edited.
   */
  saveMySurvey = () => {
    this.questions = [];
    this.surveyCreator.JSON.pages.forEach((page: any) => {
      page.elements.forEach((question: any) => {
        this.questions.push(question);
      });
    });
    this.dialogRef.close(this.questions);
  };
}
