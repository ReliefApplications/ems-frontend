import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as SurveyCreator from 'survey-creator';
import * as SurveyKo from 'survey-knockout';
import { EditFormMutationResponse, EDIT_FORM_STRUCTURE } from '../../graphql/mutations';
import { WhoSnackBarService } from '../../services/snackbar.service';
import { initCreatorSettings } from '../../survey/creator';
import { initCustomWidgets } from '../../survey/init';

// === CUSTOM WIDGETS / COMPONENTS ===
initCustomWidgets(SurveyKo);

// === STYLE ===
SurveyCreator.StylesManager.applyTheme('darkblue');

// === CREATOR SETTINGS ===
initCreatorSettings(SurveyKo);

@Component({
  selector: 'who-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class WhoFormBuilderComponent implements OnInit, OnChanges {

  @Input() structure: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  // === CREATOR ===
  surveyCreator: SurveyCreator.SurveyCreator;
  public json: any;

  constructor() { }

  ngOnInit(): void {
    const options = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: true
    };
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      'surveyCreatorContainer',
      options
    );
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.text = this.structure;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.showToolbox = 'right';
    this.surveyCreator.showPropertyGrid = 'right';
    this.surveyCreator.rightContainerActiveItem('toolbox');
  }

  ngOnChanges(): void {
    if (this.surveyCreator) {
      this.surveyCreator.text = this.structure;
    }
  }

  /*  Custom SurveyJS method, save the form when edited.
  */
  saveMySurvey = () => {
    this.save.emit(this.surveyCreator.text);
  }

}
