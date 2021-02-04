import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as SurveyCreator from 'survey-creator';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';
import { WhoSnackBarService } from '../../services/snackbar.service';
import * as Survey from 'survey-angular';
import { FormService } from '../../services/form.service';

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

  // === SURVEY COLORS
  primaryColor = '#008DC9';

  constructor(
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    const options = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: true
    };

    this.setCustomTheme();

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
    if (!this.structure) {
      this.surveyCreator.survey.showQuestionNumbers = 'off';
      this.surveyCreator.survey.completedHtml = '<h3>The form has successfully been submitted.</h3>';
    }


  }

  ngOnChanges(): void {
    if (this.surveyCreator) {
      this.surveyCreator.text = this.structure;
      if (!this.structure) {
        this.surveyCreator.survey.showQuestionNumbers = 'off';
        this.surveyCreator.survey.completedHtml = '<h3>The form has successfully been submitted.</h3>';
      }
    }
  }

  setCustomTheme(): void {
    const defaultThemeColorsSurvey = Survey
      .StylesManager
      .ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.primaryColor;
    defaultThemeColorsSurvey['$main-hover-color'] = this.primaryColor;

    const defaultThemeColorsEditor = SurveyCreator
      .StylesManager
      .ThemeColors.default;
    defaultThemeColorsEditor['$primary-color'] = this.primaryColor;
    defaultThemeColorsEditor['$secondary-color'] = this.primaryColor;
    defaultThemeColorsEditor['$primary-hover-color'] = this.primaryColor;
    defaultThemeColorsEditor['$selection-border-color'] = this.primaryColor;

    Survey
      .StylesManager
      .applyTheme();
    SurveyCreator
      .StylesManager
      .applyTheme();
  }

  /*  Custom SurveyJS method, save the form when edited.
  */
  saveMySurvey = () => {
    this.validateValueNames().then(res => {
      if (res === '') {
        this.save.emit(this.surveyCreator.text);
      } else {
        this.snackBar.openSnackBar(res, {error: true});
      }});
  }

  /*  Event listener to trigger embedded forms.
  */
  @HostListener('document:openForm', ['$event'])
  onOpenEmbeddedForm(event: any): void {
    const dialogRef = this.dialog.open(WhoFormModalComponent, {
      data: {
        template: event.detail.template,
        locale: event.locale
      }
    });
    dialogRef.afterClosed().subscribe(() => {
    });
  }

  /*  Making sure that value names are existent and snake case, to not cause backend problems.
  */
  private async validateValueNames(): Promise<string> {
   let message = '';
   const object = JSON.parse(this.surveyCreator.text);
   await object.pages.forEach( page => {
     page.elements.forEach(element => {
       if (!element.valueName) {
        if (element.title) {
          element.valueName = element.title.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
          if (!(element.valueName.match(/^[a-z]+[a-z0-9_]+$/))) {
            message = 'The value name ' + element.valueName + ' on page ' + page.name + ' is invalid. Please conform to snake_case.';
          }
          return element;
         } else {
          message = 'Missing value name for an element on page ' + page.name + '. Please provide a valid data value name (snake_case) to save the form.';
         }
       } else {
        if (!(element.valueName.match(/^[a-z]+[a-z0-9_]+$/))) {
          message = 'The value name ' + element.valueName + ' on page ' + page.name + ' is invalid. Please conform to snake_case.';
        }
       }
     });
   });
   this.surveyCreator.text = JSON.stringify(object);
   return message;
  }
}
