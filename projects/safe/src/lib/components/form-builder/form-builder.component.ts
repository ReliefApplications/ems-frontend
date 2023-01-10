import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as SurveyCreator from 'survey-creator-core';
import * as Survey from 'survey-core';
import { TranslateService } from '@ngx-translate/core';
import { snakeCase, get, uniqBy, difference } from 'lodash';
import { SafeSnackBarService } from '../../services/snackbar/snackbar.service';
import { SafeReferenceDataService } from '../../services/reference-data/reference-data.service';
import { Form } from '../../models/form.model';
import { renderGlobalProperties } from '../../survey/render-global-properties';

/**
 * Returns a lighter version of a hexadecimal color by a specified percentage.
 *
 * @param color - The hexadecimal color to be modified.
 * @param percent - The percentage by which to lighten the color.
 * @returns A hexadecimal color that is lighter than the original color.
 */
const lightenHexColor = (color: string, percent: number) => {
  // Convert the color to RGB
  const r = parseInt(color.substring(1, 3), 16);
  const g = parseInt(color.substring(3, 5), 16);
  const b = parseInt(color.substring(5, 7), 16);

  // Lighten the color by the specified percent
  const rl = Math.round(r + (255 - r) * (percent / 100));
  const gl = Math.round(g + (255 - g) * (percent / 100));
  const bl = Math.round(b + (255 - b) * (percent / 100));

  // Convert the lightened color back to hex
  const rlHex = rl.toString(16).padStart(2, '0');
  const glHex = gl.toString(16).padStart(2, '0');
  const blHex = bl.toString(16).padStart(2, '0');

  return `#${rlHex}${glHex}${blHex}`;
};

/**
 * Array containing the different types of questions.
 * Commented types are not yet implemented.
 */
const QUESTION_TYPES = [
  'text',
  'checkbox',
  'radiogroup',
  'tagbox',
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
];

/**
 * Allowed properties for a core question in a child form.
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

/**
 * Class name to add to core field question.
 */
const CORE_FIELD_CLASS = 'core-question';

/**
 * Component used to build forms in applications
 */
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
  public surveyCreatorModel!: SurveyCreator.SurveyCreatorModel;
  public json: any;

  environment: any;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param environment This is the environment in which we are running the application, it changes the theme of the form builder (color etc.)
   * @param dialog This is the Angular Material Dialog service used to display dialog modals
   * @param snackBar This is the service that will be used to display the snackbar.
   * @param translate Angular translate service
   * @param referenceDataService Reference data service
   */
  constructor(
    @Inject('environment') environment: any,
    public dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private referenceDataService: SafeReferenceDataService
  ) {
    this.environment = environment;
    // translate the editor in the same language as the interface
    SurveyCreator.localization.currentLocale = this.translate.currentLang;
    this.translate.onLangChange.subscribe(() => {
      SurveyCreator.localization.currentLocale = this.translate.currentLang;
      this.setFormBuilder(this.surveyCreatorModel.text);
    });
  }

  ngOnInit(): void {
    this.setFormBuilder(get(this.form, 'structure', ''));
  }

  ngOnChanges(): void {
    if (this.surveyCreatorModel) {
      this.surveyCreatorModel.text = this.form.structure || '';
      if (!this.form.structure) {
        this.surveyCreatorModel.survey.showQuestionNumbers = 'off';
      }
      // skip if form is core
      if (!this.form.core) {
        const coreFields =
          this.form.fields?.filter((x) => x.isCore).map((x) => x.name) || [];
        // Highlight core fields
        this.addCustomClassToCoreFields(coreFields);
      }

      this.surveyCreatorModel.survey.onUpdateQuestionCssClasses.add(
        (survey: Survey.SurveyModel, options: any) =>
          this.onSetCustomCss(options)
      );

      // add the rendering of custom properties
      this.surveyCreatorModel.survey.onAfterRenderQuestion.add(
        renderGlobalProperties(this.referenceDataService)
      );
    }
  }

  /**
   * Creates the form builder and sets up all the options.
   *
   * @param structure Optional param used as the form struct
   */
  private setFormBuilder(structure: string) {
    const creatorOptions: SurveyCreator.ICreatorOptions = {
      showEmbeddedSurveyTab: false,
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: true,
      questionTypes: QUESTION_TYPES,
      themeForPreview: 'default',
      allowChangeThemeInPreview: false,
    };

    this.setCustomTheme();

    this.surveyCreatorModel = new SurveyCreator.SurveyCreatorModel(
      creatorOptions
    );
    this.surveyCreatorModel.haveCommercialLicense = true;
    this.surveyCreatorModel.text = structure;
    this.surveyCreatorModel.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreatorModel.toolboxLocation = 'right';
    this.surveyCreatorModel.rightContainerActiveItem('toolbox');
    if (!this.form.structure) {
      this.surveyCreatorModel.survey.showQuestionNumbers = 'off';
    }
    this.surveyCreatorModel.toolbox.changeCategories(
      QUESTION_TYPES.map((x) => ({
        name: x,
        category: this.translate.instant(
          'pages.formBuilder.questionsCategories.core'
        ),
      }))
    );

    // Notify parent that form structure has changed
    this.surveyCreatorModel.onModified.add((survey) => {
      this.formChange.emit(survey.text);
    });
    this.surveyCreatorModel.survey.onUpdateQuestionCssClasses.add(
      (survey: Survey.SurveyModel, options: any) => this.onSetCustomCss(options)
    );
    this.surveyCreatorModel.onTestSurveyCreated.add((sender, opt) => {
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
      this.surveyCreatorModel.onElementAllowOperations.add((sender, opt) => {
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
      this.surveyCreatorModel.onShowingProperty.add((sender, opt) => {
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

    // Scroll to question when added
    this.surveyCreatorModel.onQuestionAdded.add((sender, opt) => {
      const name = opt.question.name;
      setTimeout(() => {
        const el = document.querySelector('[data-name="' + name + '"]');
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
    });

    // add the rendering of custom properties
    this.surveyCreatorModel.survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService)
    );
    this.surveyCreatorModel.onTestSurveyCreated.add((_, options) =>
      options.survey.onAfterRenderQuestion.add(
        renderGlobalProperties(this.referenceDataService)
      )
    );
    // this.surveyCreator.survey.locale = this.translate.currentLang; // -> set the defaultLanguage property also
  }

  /**
   * Add new class to questions considered as core fields
   *
   * @param coreFields list of core fields
   */
  private addCustomClassToCoreFields(coreFields: string[]): void {
    this.surveyCreatorModel.survey.onAfterRenderQuestion.add(
      (survey: Survey.SurveyModel, options: any) => {
        if (coreFields.includes(options.question.valueName)) {
          options.htmlElement.children[0].className += ` ${CORE_FIELD_CLASS}`;
        }
      }
    );
  }

  /**
   * Set a theme for the form builder depending on the environment
   */
  setCustomTheme(): void {
    const primary10 = lightenHexColor(this.environment.theme.primary, 90);
    const primary20 = lightenHexColor(this.environment.theme.primary, 80);

    const defaultThemeColorsSurvey = Survey.StylesManager.ThemeColors.default;
    defaultThemeColorsSurvey.$primary = this.environment.theme.primary;
    defaultThemeColorsSurvey.$secondary = this.environment.theme.primary;
    defaultThemeColorsSurvey['$primary-light'] = primary10;
    defaultThemeColorsSurvey['$secondary-light'] = primary20;
    defaultThemeColorsSurvey['$secondary-back-light'] = primary10;

    Survey.StylesManager.applyTheme();
    SurveyCreator.StylesManager.applyTheme();
  }

  /**
   * Custom SurveyJS method, save the form when edited.
   */
  saveMySurvey = () => {
    this.validateValueNames()
      .then(() => {
        this.save.emit(this.surveyCreatorModel.text);
      })
      .catch((error) => {
        this.snackBar.openSnackBar(error.message, { error: true });
      });
  };

  /**
   * Makes sure that value names are existent and snake case, to not cause backend problems.
   */
  private async validateValueNames(): Promise<void> {
    const survey = new Survey.SurveyModel(this.surveyCreatorModel.JSON);
    survey.pages.forEach((page: Survey.PageModel) => {
      page.questions.forEach((question: Survey.Question) =>
        this.setQuestionNames(question, page)
      );
      const duplicatedFields = difference(
        page.questions,
        uniqBy(page.questions, 'valueName')
      );
      if (duplicatedFields.length > 0) {
        throw new Error(
          this.translate.instant(
            'pages.formBuilder.errors.dataFieldDuplicated',
            {
              name: duplicatedFields[0].valueName,
            }
          )
        );
      }
    });
    this.surveyCreatorModel.JSON = survey.toJSON();
  }

  /**
   * Convert a string to snake_case. Overrides the snakeCase function of lodash
   * by first checking if the text is not already in snake case
   *
   * @param text The text to convert
   * @returns The text in snake_case
   */
  private toSnakeCase(text: string): string {
    if (this.isSnakeCase(text)) {
      return text;
    }
    return snakeCase(text);
  }

  /**
   * Checks if a string is already in snake case
   *
   * @param text The text to check
   * @returns True if the text is in snake case, false otherwise
   */
  private isSnakeCase(text: string): any {
    return text.match(/^[a-z]+[a-z0-9_]+$/);
  }

  /**
   * Set the question names of the form.
   *
   * @param question The element of the form whose name we need to set
   * @param page The page of the form
   */
  private setQuestionNames(
    question: Survey.Question,
    page: Survey.PageModel
  ): void {
    // create the valueName of the element in snake case
    if (!question.valueName) {
      if (question.title) {
        question.valueName = this.toSnakeCase(question.title);
      } else if (question.name) {
        question.valueName = this.toSnakeCase(question.name);
      } else {
        throw new Error(
          this.translate.instant('pages.formBuilder.errors.missingName', {
            page: page.name,
          })
        );
      }
    } else {
      if (!this.isSnakeCase(question.valueName)) {
        throw new Error(
          this.translate.instant('pages.formBuilder.errors.snakecase', {
            name: question.valueName,
            page: page.name,
          })
        );
      }
    }
    // if choices object exists, checks for duplicate values
    if (question.choices) {
      const values = question.choices.map(
        (choice: { value: string; text: string }) => choice.value || choice
      );
      const distinctValues = [...new Set(values)];

      if (values.length > distinctValues.length) {
        throw new Error(
          this.translate.instant(
            'pages.formBuilder.errors.choices.valueDuplicated',
            {
              question: question.valueName,
            }
          )
        );
      }
    }
    if (question.getType() === 'multipletext') {
      question.items.forEach((item: any) => {
        if (!item.name && !item.title) {
          throw new Error(
            this.translate.instant(
              'pages.formBuilder.errors.multipletext.missingName',
              {
                question: question.valueName,
              }
            )
          );
        }
        item.name = this.toSnakeCase(item.name);
      });
    }
    if (question.getType() === 'matrix') {
      question.columns.forEach(
        (x: any) => (x.value = this.toSnakeCase(x.value || x.text || x))
      );
      question.rows.forEach(
        (x: any) => (x.value = this.toSnakeCase(x.value || x.text || x))
      );
    }
    if (question.getType() === 'matrixdropdown') {
      question.columns.forEach((x: any) => {
        x.name = this.toSnakeCase(x.name || x.title || x);
        x.title = x.title || x.name || x;
      });
      question.rows.forEach((x: any) => {
        x.value = this.toSnakeCase(x.value || x.text || x);
      });
    }
    if (['resource', 'resources'].includes(question.getType())) {
      if (question.relatedName) {
        question.relatedName = this.toSnakeCase(question.relatedName);
      } else {
        throw new Error(
          this.translate.instant(
            'components.formBuilder.errors.missingRelatedName',
            {
              question: question.name,
              page: page.name,
            }
          )
        );
      }

      if (question.addRecord && !question.addTemplate) {
        throw new Error(
          this.translate.instant(
            'components.formBuilder.errors.missingTemplate',
            {
              question: question.name,
              page: page.name,
            }
          )
        );
      }
    }
    // Check that at least an application is selected in the properties of users and owner question
    if (['users', 'owner'].includes(question.getType())) {
      if (!question.applications) {
        throw new Error(
          this.translate.instant('pages.formBuilder.errors.selectApplication', {
            question: question.name,
            page: page.name,
          })
        );
      }
    }
    // // if the element contains other elements, apply the same rule on them
    // if (question.elements) {
    //   question.elements.forEach((elt: AnyQuestion) =>
    //     this.setQuestionNames(elt, page)
    //   );
    // }
    // if (question.templateElements) {
    //   question.templateElements.forEach((elt: AnyQuestion) =>
    //     this.setQuestionNames(elt, page)
    //   );
    // }
  }

  /**
   * Add custom CSS classes to the survey elements.
   *
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += 'safe-qst-content';
  }
}
