import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as SurveyCreator from 'survey-creator';
import { WhoFormModalComponent } from '../form-modal/form-modal.component';
import { WhoSnackBarService } from '../../services/snackbar.service';
import * as Survey from 'survey-angular';
import { FormService } from '../../services/form.service';

/* Commented types are not yet implemented.
*/
const QUESTION_TYPES = [
  'text',
  'checkbox',
  'radiogroup',
  'dropdown',
  'comment',
  // 'rating',
  // 'ranking',
  'imagepicker',
  'boolean',
  'image',
  'html',
  // 'signaturepad',
  'expression',
  'file',
  'matrix',
  'matrixdropdown',
  'matrixdynamic',
  'multipletext',
  'panel',
  'paneldynamic',
  'tagbox'
];

@Component({
  selector: 'who-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss']
})
export class WhoFormBuilderComponent implements OnInit, OnChanges {

  @Input() structure: any;
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() formChange: EventEmitter<any> = new EventEmitter();

  // === CREATOR ===
  surveyCreator: SurveyCreator.SurveyCreator;
  public json: any;

  // === SURVEY COLORS
  primaryColor = '#008DC9';

  constructor(
    public dialog: MatDialog,
    private snackBar: WhoSnackBarService,
    private formService: FormService
  ) { }

  ngOnInit(): void {
    const options = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: true,
      questionTypes: QUESTION_TYPES
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
    this.surveyCreator
      .toolbox
      .changeCategories(QUESTION_TYPES.map(x => {
        return {
          name: x,
          category: 'Question Library'
        };
      }));

    // Notify parent that form structure has changed
    this.surveyCreator.onModified.add((survey, option) => {
      this.formChange.emit(survey.text);
    });
    // Files
    this.surveyCreator.onUploadFile.add((survey, option) => {
      option.files.forEach(file => {
        console.log(file.name);
      });
    });
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
    this.validateValueNames().then(() => {
      this.save.emit(this.surveyCreator.text);
    })
    .catch((error) => {
      this.snackBar.openSnackBar(error.message, { error: true });
    });
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
  private async validateValueNames(): Promise<void> {
    const object = JSON.parse(this.surveyCreator.text);
    await object.pages.forEach(page => {
      if (page.elements) {
        page.elements.forEach(element => {
          if (!element.valueName) {
            if (element.title) {
              element.valueName = this.toSnakeCase(element.title);
              if (!this.isSnakeCase(element.valueName)) {
               throw new Error('The value name ' + element.valueName + ' on page '
                + page.name + ' is invalid. Please conform to snake_case.');
              }
            } else {
              throw new Error('Missing value name for an element on page '
                + page.name + '. Please provide a valid data value name (snake_case) to save the form.');
            }
          } else {
            if (!this.isSnakeCase(element.valueName)) {
              throw new Error('The value name ' + element.valueName + ' on page '
                + page.name + ' is invalid. Please conform to snake_case.');
            }
          }
          if (element.type === 'multipletext') {
            element.items = element.items.map(e => {
              if (!e.name && !e.title) {
                throw new Error(`Please provide name or title for each text of question: ${element.valueName}`);
              }
              return {
                name: this.isSnakeCase(e.name) ? e.name : this.toSnakeCase(e.name),
                title: e.title ? e.title : null
              };
            });
          }
          if (element.type === 'matrix') {
            element.columns = element.columns.map(x => {
              return {
                value: x.value ? this.toSnakeCase(x.value) : this.toSnakeCase(x.text ? x.text : x),
                text: x.text ? x.text : x
              };
            });
            element.rows = element.rows.map(x => {
              return {
                value: x.value ? this.toSnakeCase(x.value) : this.toSnakeCase(x.text ? x.text : x),
                text: x.text ? x.text : x
              };
            });
          }
          if (element.type === 'matrixdropdown') {
            element.columns = element.columns.map(x => {
              return {
                name: x.name ? this.toSnakeCase(x.name) : this.toSnakeCase(x.title ? x.title : x),
                title: x.title ? x.title : (x.name ? x.name : x),
                ...x.cellType && { cellType: x.cellType },
                ...x.isRequired && { isRequired: true }
              };
            });
            element.rows = element.rows.map(x => {
              return {
                value: x.value ? this.toSnakeCase(x.value) : this.toSnakeCase(x.text ? x.text : x),
                text: x.text ? x.text : x
              };
            });
          }
        });
      }
    });
    this.surveyCreator.text = JSON.stringify(object);
  }

  private toSnakeCase(text: string): string {
    return text.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
  }

  private isSnakeCase(text: string): any {
    return text.match(/^[a-z]+[a-z0-9_]+$/);
  }
}
