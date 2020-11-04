import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import * as SurveyCreator from 'survey-creator';
import * as SurveyKo from 'survey-knockout';
import { EditFormMutationResponse, EDIT_FORM_STRUCTURE } from '../../graphql/mutations';
import { Form } from '../../models/form.model';
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
export class WhoFormBuilderComponent implements OnInit {

  @Input() form: Form;

  // === CREATOR ===
  surveyCreator: SurveyCreator.SurveyCreator;
  public json: any;

  constructor(
    private apollo: Apollo,
    private snackBar: WhoSnackBarService
  ) { }

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
    this.surveyCreator.text = this.form.structure;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.showToolbox = 'right';
    this.surveyCreator.showPropertyGrid = 'right';
    this.surveyCreator.rightContainerActiveItem('toolbox');
  }

  /*  Custom SurveyJS method, save the form when edited.
  */
 saveMySurvey = () => {
  if (!this.form.id) {
    alert('not valid');
  } else {
    this.apollo.mutate<EditFormMutationResponse>({
      mutation: EDIT_FORM_STRUCTURE,
      variables: {
        id: this.form.id,
        structure: this.surveyCreator.text
      }
    }).subscribe(res => {
      this.snackBar.openSnackBar('Form updated');
      this.form = res.data.editForm;
    }, (err) => {
      this.snackBar.openSnackBar(err.message, { error: true });
    });
  }
}

}
