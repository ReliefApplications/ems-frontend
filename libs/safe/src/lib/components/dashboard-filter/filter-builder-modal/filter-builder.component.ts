import { Component, Inject, OnInit } from '@angular/core';
import * as SurveyCreator from 'survey-creator';
import * as Survey from 'survey-angular';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';

/**
 * Data passed to initialize the filter builder
 */
interface DialogData {
  surveyJson: any;
}

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

  /**
   * Dialog component to build the filter
   *
   * @param dialogRef reference to the dialog component
   * @param data data passed to initialize the filter builder
   */
  constructor(
    private dialogRef: MatDialogRef<SafeFilterBuilderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

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
      customQuestionTypes: [],
    };
    this.setCustomTheme();
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      'surveyCreatorContainer',
      creatorOptions
    );
    this.surveyCreator.JSON = this.data?.surveyJson;
    this.surveyCreator.showToolbox = 'right';
    this.surveyCreator.showPropertyGrid = 'none';
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
  }

  /**
   * Set a theme for the form builder depending on the environment
   */
  setCustomTheme(): void {
    Survey.StylesManager.applyTheme();
    SurveyCreator.StylesManager.applyTheme('default');
  }

  /**
   * Custom SurveyJS method, save the form when edited.
   */
  saveMySurvey = () => {
    this.dialogRef.close(this.surveyCreator.JSON);
  };
}
