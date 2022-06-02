import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as SurveyCreator from 'survey-creator';
import { SafeSnackBarService } from '../../services/snackbar.service';
import * as Survey from 'survey-angular';
import { Form } from '../../models/form.model';

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
  // 'imagepicker',
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
  'tagbox',
];

/* Allowed properties for a core question in a child form.
 */
const CORE_QUESTION_ALLOWED_PROPERTIES = [
  'width',
  'maxWidth',
  'minWidth',
  'startWithNewLine',
  'indent',
  'page',
  'titleLocation',
  'descriptionLocation',
  'state',
  'defaultValue',
  'defaultValueExpression',
  'relatedName',
  'addRecord',
  'addTemplate',
  'Search resource table',
  'visible',
  'readOnly',
  'isRequired',
  'placeHolder',
  'enableIf',
  'visibleIf',
  'tooltip',
];

const CORE_FIELD_CLASS = 'core-question';

@Component({
  selector: 'safe-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class SafeFormBuilderComponent implements OnInit, OnChanges {
  @Input() form!: Form;
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() formChange: EventEmitter<any> = new EventEmitter();

  // === CREATOR ===
  surveyCreator!: SurveyCreator.SurveyCreator;
  public json: any;

  // === SURVEY COLORS
  primaryColor = '#008DC9';

  constructor(
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService
  ) {}

  ngOnInit(): void {
    const options = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: true,
      questionTypes: QUESTION_TYPES,
    };

    this.setCustomTheme();

    this.surveyCreator = new SurveyCreator.SurveyCreator(
      'surveyCreatorContainer',
      options
    );
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.text = this.form.structure || '';
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.showToolbox = 'right';
    this.surveyCreator.showPropertyGrid = 'right';
    this.surveyCreator.rightContainerActiveItem('toolbox');
    if (!this.form.structure) {
      this.surveyCreator.survey.showQuestionNumbers = 'off';
      this.surveyCreator.survey.completedHtml =
        '<h3>The form has successfully been submitted.</h3>';
    }
    this.surveyCreator.toolbox.changeCategories(
      QUESTION_TYPES.map((x) => {
        return {
          name: x,
          category: 'Question Library',
        };
      })
    );

    // Notify parent that form structure has changed
    this.surveyCreator.onModified.add((survey, option) => {
      this.formChange.emit(survey.text);
    });
    this.surveyCreator.survey.onUpdateQuestionCssClasses.add((_, opt) =>
      this.onSetCustomCss(opt)
    );
    this.surveyCreator.onTestSurveyCreated.add((sender, opt) => {
      opt.survey.onUpdateQuestionCssClasses.add((_: any, opt2: any) =>
        this.onSetCustomCss(opt2)
      );
    });

    // === CORE QUESTIONS FOR CHILD FORM ===
    // Skip if form is core
    if (!this.form.core) {
      const coreFields =
        this.form.fields?.filter((x) => x.isCore).map((x) => x.name) || [];
      // Remove core fields adorners
      this.surveyCreator.onElementAllowOperations.add((sender, opt) => {
        const obj = opt.obj;
        if (!obj || !obj.page) {
          return;
        }
        // If it is a core field
        if (coreFields.includes(obj.valueName)) {
          // Disable deleting, editing, changing type and changing if required or not
          opt.allowDelete = false;
          opt.allowChangeType = false;
          opt.allowChangeRequired = false;
          opt.allowAddToToolbox = false;
          opt.allowCopy = false;
          opt.allowShowEditor = false;
          opt.allowShowHideTitle = false;
          opt.allowDragging = true;
        }
      });
      // Block core fields edition
      this.surveyCreator.onShowingProperty.add((sender, opt) => {
        const obj = opt.obj;
        if (!obj || !obj.page) {
          return;
        }
        // If it is a core field
        if (
          coreFields.includes(obj.valueName) &&
          !CORE_QUESTION_ALLOWED_PROPERTIES.includes(opt.property.name)
        ) {
          opt.canShow = false;
        }
      });
      // Highlight core fields
      this.addCustomClassToCoreFields(coreFields);
    }
  }

  ngOnChanges(): void {
    if (this.surveyCreator) {
      this.surveyCreator.text = this.form.structure || '';
      if (!this.form.structure) {
        this.surveyCreator.survey.showQuestionNumbers = 'off';
        this.surveyCreator.survey.completedHtml =
          '<h3>The form has successfully been submitted.</h3>';
      }
      // skip if form is core
      if (!this.form.core) {
        const coreFields =
          this.form.fields?.filter((x) => x.isCore).map((x) => x.name) || [];
        // Highlight core fields
        this.addCustomClassToCoreFields(coreFields);
      }
    }
  }

  private addCustomClassToCoreFields(coreFields: string[]): void {
    this.surveyCreator.survey.onAfterRenderQuestion.add((_, options: any) => {
      if (coreFields.includes(options.question.valueName)) {
        options.htmlElement.children[0].className += ` ${CORE_FIELD_CLASS}`;
      }
    });
  }

  setCustomTheme(): void {
    const defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors.default;
    defaultThemeColorsSurvey['$main-color'] = this.primaryColor;
    defaultThemeColorsSurvey['$main-hover-color'] = this.primaryColor;

    const defaultThemeColorsEditor =
      SurveyCreator.StylesManager.ThemeColors.default;
    defaultThemeColorsEditor['$primary-color'] = this.primaryColor;
    defaultThemeColorsEditor['$secondary-color'] = this.primaryColor;
    defaultThemeColorsEditor['$primary-hover-color'] = this.primaryColor;
    defaultThemeColorsEditor['$selection-border-color'] = this.primaryColor;

    Survey.StylesManager.applyTheme();
    SurveyCreator.StylesManager.applyTheme();
  }

  /*  Custom SurveyJS method, save the form when edited.
   */
  saveMySurvey = () => {
    this.validateValueNames()
      .then(() => {
        this.save.emit(this.surveyCreator.text);
      })
      .catch((error) => {
        this.snackBar.openSnackBar(error.message, { error: true });
      });
  }

  /*  Making sure that value names are existent and snake case, to not cause backend problems.
   */
  private async validateValueNames(): Promise<void> {
    const object = JSON.parse(this.surveyCreator.text);
    await object.pages.forEach((page: any) => {
      if (page.elements) {
        page.elements.forEach((element: any) => {
          this.setQuestionNames(element, page);
        });
      }
    });
    this.surveyCreator.text = JSON.stringify(object);
  }

  private toSnakeCase(text: string): string {
    return text
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join('_');
  }

  private isSnakeCase(text: string): any {
    return text.match(/^[a-z]+[a-z0-9_]+$/);
  }

  /*  Recursively set the question names of the form.
   */
  private setQuestionNames(element: any, page: any): void {
    if (element.type === 'panel') {
      if (element.elements) {
        for (const el of element.elements) {
          this.setQuestionNames(el, page);
        }
      }
    } else {
      if (!element.valueName) {
        if (element.title) {
          element.valueName = this.toSnakeCase(element.title);
          if (!this.isSnakeCase(element.valueName)) {
            throw new Error(
              'The value name ' +
                element.valueName +
                ' on page ' +
                page.name +
                ' is invalid. Please conform to snake_case.'
            );
          }
        } else {
          throw new Error(
            'Missing value name for an element on page ' +
              page.name +
              '. Please provide a valid data value name (snake_case) to save the form.'
          );
        }
      } else {
        if (!this.isSnakeCase(element.valueName)) {
          throw new Error(
            'The value name ' +
              element.valueName +
              ' on page ' +
              page.name +
              ' is invalid. Please conform to snake_case.'
          );
        }
      }
      // if choices object exists, checks for duplicate values
      if (element.choices) {
        const values = element.choices.map(
          (choice: { value: string; text: string }) => choice.value
        );
        const distinctValues = [...new Set(values)];

        if (values.length > distinctValues.length){
          throw new Error(
            `Please provide unique values for each of the choices of question: ${element.valueName}`
          );
        }
      }
      if (element.type === 'multipletext') {
        element.items = element.items.map((e: any) => {
          if (!e.name && !e.title) {
            throw new Error(
              `Please provide name or title for each text of question: ${element.valueName}`
            );
          }
          return {
            name: this.isSnakeCase(e.name) ? e.name : this.toSnakeCase(e.name),
            title: e.title ? e.title : null,
          };
        });
      }
      if (element.type === 'matrix') {
        element.columns = element.columns.map((x: any) => {
          return {
            value: x.value
              ? this.toSnakeCase(x.value)
              : this.toSnakeCase(x.text ? x.text : x),
            text: x.text ? x.text : x,
          };
        });
        element.rows = element.rows.map((x: any) => {
          return {
            value: x.value
              ? this.toSnakeCase(x.value)
              : this.toSnakeCase(x.text ? x.text : x),
            text: x.text ? x.text : x,
          };
        });
      }
      if (element.type === 'matrixdropdown') {
        element.columns = element.columns.map((x: any) => {
          return {
            name: x.name
              ? this.toSnakeCase(x.name)
              : this.toSnakeCase(x.title ? x.title : x),
            title: x.title ? x.title : x.name ? x.name : x,
            ...(x.cellType && { cellType: x.cellType }),
            ...(x.isRequired && { isRequired: true }),
          };
        });
        element.rows = element.rows.map((x: any) => {
          return {
            value: x.value
              ? this.toSnakeCase(x.value)
              : this.toSnakeCase(x.text ? x.text : x),
            text: x.text ? x.text : x,
          };
        });
      }
      if (['resource', 'resources'].includes(element.type)) {
        if (element.relatedName) {
          element.relatedName = this.toSnakeCase(element.relatedName);
          if (!this.isSnakeCase(element.relatedName)) {
            throw new Error(
              'The related name ' +
                element.relatedName +
                ' on page ' +
                page.name +
                ' is invalid. Please conform to snake_case.'
            );
          }
        } else {
          throw new Error(
            'Missing related name for question ' +
              element.title +
              ' on page ' +
              page.name +
              '. Please provide a valid data value name (snake_case) to save the form.'
          );
        }
      }
    }
  }

  /**
   * Add custom CSS classes to the survey elements.
   * @param survey current survey.
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += 'safe-qst-content';
  }
}
