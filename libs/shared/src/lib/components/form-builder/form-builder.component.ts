import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Inject,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import { get, uniqBy, difference } from 'lodash';
import { ReferenceDataService } from '../../services/reference-data/reference-data.service';
import { Form } from '../../models/form.model';
import { renderGlobalProperties } from '../../survey/render-global-properties';
import { SnackbarService } from '@oort-front/ui';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import {
  Action,
  PageModel,
  SurveyModel,
  UpdateQuestionCssClassesEvent,
  surveyLocalization,
} from 'survey-core';
import { SurveyCreatorModel } from 'survey-creator-core';
import { Question } from '../../survey/types';
import { DOCUMENT } from '@angular/common';

/**
 * Array containing the different types of questions.
 * Commented types are not yet implemented.
 */
const QUESTION_TYPES = [
  'text',
  'checkbox',
  'radiogroup',
  'dropdown',
  'tagbox',
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
  selector: 'shared-form-builder',
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
})
export class FormBuilderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form!: Form;
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() formChange: EventEmitter<any> = new EventEmitter();

  // === CREATOR ===
  surveyCreator!: SurveyCreatorModel;
  public json: any;

  private relatedNames!: string[];

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialog Angular Dialog service used to display dialog modals
   * @param snackBar Service that will be used to display the snackbar.
   * @param translate Angular translate service
   * @param referenceDataService Reference data service
   * @param formHelpersService Shared form helper service.
   * @param document document
   */
  constructor(
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private referenceDataService: ReferenceDataService,
    private formHelpersService: FormHelpersService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // translate the editor in the same language as the interface
    surveyLocalization.currentLocale = this.translate.currentLang;
    this.translate.onLangChange.subscribe(() => {
      surveyLocalization.currentLocale = this.translate.currentLang;
      this.setFormBuilder(this.surveyCreator.text);
    });
  }

  ngOnInit(): void {
    this.setFormBuilder(get(this.form, 'structure', ''));
  }

  ngOnChanges(): void {
    if (this.surveyCreator) {
      this.surveyCreator.text = this.form.structure || '';
      if (!this.form.structure) {
        this.surveyCreator.survey.showQuestionNumbers = 'off';
      }
      // skip if form is core
      if (!this.form.core) {
        // Typing for survey fields
        // {
        //   type: string;
        //   resource?: string;
        //   referenceData?: {
        //     id: string;
        //     displayField: string;
        //   };
        //   name?: string;
        //   isCore?: boolean;
        // }
        const coreFields =
          this.form.fields?.filter((x) => x.isCore).map((x) => x.name) || [];
        // Highlight core fields
        this.addCustomClassToCoreFields(coreFields);
      }

      this.surveyCreator.survey.onUpdateQuestionCssClasses.add(((
        sender: SurveyModel,
        options: UpdateQuestionCssClassesEvent
      ) => {
        this.onSetCustomCss(options);
      }) as any);

      // add the rendering of custom properties
      this.surveyCreator.survey.onAfterRenderQuestion.add(
        renderGlobalProperties(this.referenceDataService) as any
      );
    }
  }

  ngOnDestroy(): void {
    this.surveyCreator.survey?.dispose();
  }

  /**
   * Creates the form builder and sets up all the options.
   *
   * @param structure Optional param used as the form struc
   */
  private setFormBuilder(structure: string) {
    const creatorOptions = {
      showEmbededSurveyTab: false,
      showJSONEditorTab: true,
      generateValidJSON: true,
      showTranslationTab: true,
      questionTypes: QUESTION_TYPES,
      allowChangeThemeInPreview: false,
    };

    this.surveyCreator = new SurveyCreatorModel(creatorOptions);

    (this.surveyCreator.onTestSurveyCreated as any).add(
      (_: any, options: any) => {
        const survey: SurveyModel = options.survey;
        survey.applyTheme({
          isPanelless: true,
          cssVariables: {
            '--sjs-base-unit': '.66em',
          },
        });
        survey.onAfterRenderQuestion.add(
          this.formHelpersService.addQuestionTooltips
        );
        this.formHelpersService.addUserVariables(survey);
      }
    );
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.text = structure;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.showToolbox = true;
    this.surveyCreator.toolboxLocation = 'right';
    this.surveyCreator.showSidebar = true;
    this.surveyCreator.sidebarLocation = 'right';

    if (!this.form.structure) {
      this.surveyCreator.survey.showQuestionNumbers = 'off';
    }

    this.surveyCreator.toolbox.forceCompact = false;
    this.surveyCreator.toolbox.allowExpandMultipleCategories = true;
    this.surveyCreator.toolbox.changeCategories(
      QUESTION_TYPES.map((x) => ({
        name: x,
        category: this.translate.instant(
          'pages.formBuilder.questionsCategories.core'
        ),
      }))
    );

    // Notify parent that form structure has changed
    this.surveyCreator.onModified.add((survey: any) => {
      this.formChange.emit(survey.text);
    });

    this.surveyCreator.survey.onUpdateQuestionCssClasses.add(((
      survey: SurveyModel,
      options: UpdateQuestionCssClassesEvent
    ) => {
      this.onSetCustomCss(options);
    }) as any);
    this.surveyCreator.onTestSurveyCreated.add((sender: any, opt: any) => {
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
      this.surveyCreator.onElementAllowOperations.add(
        (sender: any, options: any) => {
          const obj = options.obj;
          if (!obj || !obj.page) {
            return;
          }
          // If it is a core field
          if (coreFields.includes(obj.valueName)) {
            // Disable deleting, editing, changing type and changing if required or not
            options.allowDelete = false;
            options.allowChangeType = false;
            options.allowChangeRequired = false;
            options.allowAddToToolbox = false;
            options.allowCopy = false;
            options.allowShowEditor = false;
            options.allowShowHideTitle = false;
            options.allowDragging = true;
          }
        }
      );
      // Block core fields edition
      this.surveyCreator.onShowingProperty.add((sender: any, options: any) => {
        const obj = options.obj;
        if (!obj || !obj.page) {
          return;
        }
        // If it is a core field
        if (
          coreFields.includes(obj.valueName) &&
          !CORE_QUESTION_ALLOWED_PROPERTIES.includes(options.property.name)
        ) {
          options.canShow = false;
        }
      });
      // Highlight core fields
      this.addCustomClassToCoreFields(coreFields);
    }

    // Scroll to question when added
    this.surveyCreator.onQuestionAdded.add((sender: any, options: any) => {
      const name = options.question.name;
      setTimeout(() => {
        const el = this.document.querySelector('[data-name="' + name + '"]');
        el?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // add the rendering of custom properties
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService) as any
    );
    (this.surveyCreator.onTestSurveyCreated as any).add(
      (sender: any, options: any) =>
        options.survey.onAfterRenderQuestion.add(
          renderGlobalProperties(this.referenceDataService)
        )
    );
    // this.surveyCreator.survey.locale = this.translate.currentLang; // -> set the defaultLanguage property also

    // add move up/down buttons
    // ¿No need? As the new surveyjs creator has a built in drag and drop feature to move questions between pages and within a page between questions
    // this.addCustomActionsToQuestionItemBar();
  }

  /**
   * Add custom actions to the question action items bar
   */
  private addCustomActionsToQuestionItemBar() {
    // add move up/down buttons
    this.surveyCreator.onDefineElementMenuItems.add(
      (sender: SurveyCreatorModel, options: any) => {
        const moveUpButton = new Action({
          iconName: 'icon-arrow-up',
          css: 'sv-action-bar-item--secondary sv-action-bar-item__icon',
          title: this.translate.instant('pages.formBuilder.move.up'),
          action: (obj: any) => {
            // get the page index of current question
            const pageIndex = sender.survey.pages.findIndex(
              (page: any) => page.questions.indexOf(obj) !== -1
            );

            // get the index of the current question in the page
            const questionIndex =
              sender.survey.pages[pageIndex].questions.indexOf(obj);

            // remove the element from the current page
            sender.survey.pages[pageIndex].removeElement(obj);

            // add it back to the page at the previous index
            sender.survey.pages[pageIndex].addElement(obj, questionIndex - 1);
          },
        });

        const moveDownButton = new Action({
          iconName: 'icon-arrow-down',
          css: 'sv-action-bar-item--secondary sv-action-bar-item__icon',
          title: this.translate.instant('pages.formBuilder.move.down'),
          action: (obj: any) => {
            // get the page index of current question
            const pageIndex = sender.survey.pages.findIndex(
              (page: any) => page.questions.indexOf(obj) !== -1
            );

            // get the index of the current question in the page
            const questionIndex =
              sender.survey.pages[pageIndex].questions.indexOf(obj);

            if (
              questionIndex ===
              sender.survey.pages[pageIndex].questions.length - 1
            )
              return;

            // remove the element from the current page
            sender.survey.pages[pageIndex].removeElement(obj);

            // add it back to the page at the previous index
            sender.survey.pages[pageIndex].addElement(obj, questionIndex + 1);
          },
        });

        // Find the `delete` action's position.
        let index = -1;
        for (let i = 0; i < options.items.length; i++) {
          if (options.items[i].name === 'delete') {
            index = i;
            break;
          }
        }
        // Insert the new action before `delete` or as the last action if `delete` is not found
        if (index > -1) {
          options.items.splice(index, 0, moveDownButton);
          options.items.splice(index, 0, moveUpButton);
        } else {
          options.items.push(moveUpButton);
          options.items.push(moveDownButton);
        }
      }
    );
  }

  /**
   * Add new class to questions considered as core fields
   *
   * @param coreFields list of core fields
   */
  private addCustomClassToCoreFields(coreFields: string[]): void {
    this.surveyCreator.survey.onAfterRenderQuestion.add(((
      survey: SurveyModel,
      options: any
    ) => {
      if (coreFields.includes(options.question.valueName)) {
        options.htmlElement.children[0].className += ` ${CORE_FIELD_CLASS}`;
      }
    }) as any);
  }

  /**
   * Custom SurveyJS method, save the form when edited.
   */
  saveMySurvey = () => {
    this.validateValueNames()
      .then((canCreate: boolean) => {
        if (canCreate) {
          this.save.emit(this.surveyCreator.text);
        }
      })
      .catch((error) => {
        this.snackBar.openSnackBar(error.message, {
          error: true,
          duration: 15000,
        });
      });
  };

  /**
   * Makes sure that value names are existent and snake case, to not cause backend problems.
   *
   * @returns if the validation is approved and can create the survey
   */
  private async validateValueNames(): Promise<boolean> {
    this.relatedNames = [];
    const survey = new SurveyModel(this.surveyCreator.JSON);
    const canCreate = survey.pages.every((page: PageModel) => {
      const verifiedQuestions = page.questions.every((question: Question) =>
        this.setQuestionNames(question, page)
      );
      if (verifiedQuestions) {
        // If questions verified, search for duplicated value names
        const duplicatedFields = difference(
          page.questions,
          uniqBy(page.questions, 'valueName')
        );
        if (duplicatedFields.length > 0) {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'pages.formBuilder.errors.dataFieldDuplicated',
              {
                name: duplicatedFields[0].valueName,
              }
            ),
            {
              error: true,
              duration: 15000,
            }
          );
          return false;
        }
      } else {
        return false;
      }
      return true;
    });
    this.surveyCreator.JSON = survey.toJSON();
    return canCreate;
  }

  /**
   * Recursively set the question names of the form and depending on
   * the question type, check additional required fields.
   *
   * @param question The question of the form whose name we need to set
   * @param page The page of the form
   * @returns if question name and additional required fields are valid
   */
  private setQuestionNames(question: Question, page: PageModel): boolean {
    // Create the valueName of the element in snake case.
    const valueNameChecked = this.formHelpersService.setValueName(
      question,
      page
    );
    if (!valueNameChecked) {
      // If valueName missing or exists but with wrong format, return false: question invalid.
      return false;
    }
    // if choices object exists, checks for duplicate values
    if (question.choices) {
      // If choices do not come from a reference data, we would make the duplication check as we want to save the choices in the form
      if (!question.referenceData) {
        const values = question.choices.map(
          (choice: { value: string; text: string }) => choice.value || choice
        );
        const distinctValues = [...new Set(values)];

        if (values.length > distinctValues.length) {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'pages.formBuilder.errors.choices.valueDuplicated',
              {
                question: question.valueName,
              }
            ),
            {
              error: true,
              duration: 15000,
            }
          );
          return false;
        }
      } else {
        // As we already have the reference data value to get the choices, we dont want to save them again with the form structure
        question.choices = [];
      }
    }
    if (question.getType() === 'multipletext') {
      let validQuestion = true;
      // Check if every item of the questions is valid, otherwise stop loop and function
      question.items.every((item: any) => {
        if (!item.name && !item.title) {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'pages.formBuilder.errors.multipletext.missingName',
              {
                question: question.valueName,
              }
            ),
            {
              error: true,
              duration: 15000,
            }
          );
          validQuestion = false;
          return false;
        }
        item.name = this.formHelpersService.toSnakeCase(item.name);
        return true;
      });
      if (!validQuestion) {
        return false;
      }
    }
    if (question.getType() === 'matrix') {
      question.columns.forEach(
        (x: any) =>
          (x.value = this.formHelpersService.toSnakeCase(
            x.value || x.text || x
          ))
      );
      question.rows.forEach(
        (x: any) =>
          (x.value = this.formHelpersService.toSnakeCase(
            x.value || x.text || x
          ))
      );
    }
    if (question.getType() === 'matrixdropdown') {
      question.columns.forEach((x: any) => {
        x.name = this.formHelpersService.toSnakeCase(x.name || x.title || x);
        x.title = x.title || x.name || x;
      });
      question.rows.forEach((x: any) => {
        x.value = this.formHelpersService.toSnakeCase(x.value || x.text || x);
      });
    }
    if (['resource', 'resources'].includes(question.getType())) {
      if (question.relatedName) {
        question.relatedName = this.formHelpersService.toSnakeCase(
          question.relatedName
        );
        if (this.relatedNames.includes(question.relatedName)) {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.formBuilder.errors.duplicatedRelatedName',
              {
                question: question.name,
                page: page.name,
              }
            ),
            {
              error: true,
              duration: 15000,
            }
          );
          return false;
        } else {
          this.relatedNames.push(question.relatedName);
        }
      } else {
        this.snackBar.openSnackBar(
          this.translate.instant(
            'components.formBuilder.errors.missingRelatedName',
            {
              question: question.name,
              page: page.name,
            }
          ),
          {
            error: true,
            duration: 15000,
          }
        );
        return false;
      }
      if (question.addRecord && !question.addTemplate) {
        this.snackBar.openSnackBar(
          this.translate.instant(
            'components.formBuilder.errors.missingTemplate',
            {
              question: question.name,
              page: page.name,
            }
          ),
          {
            error: true,
            duration: 15000,
          }
        );
        return false;
      }

      // Error if the user selected Display As Grid without adding an available field.
      if (question.displayAsGrid && !question.gridFieldsSettings) {
        this.snackBar.openSnackBar(
          this.translate.instant(
            'components.formBuilder.errors.missingGridField',
            {
              question: question.name,
              page: page.name,
            }
          ),
          {
            error: true,
            duration: 15000,
          }
        );
        return false;
      }
    }
    // Check that at least an application is selected in the properties of users and owner question
    if (['users', 'owner'].includes(question.getType())) {
      if (!question.applications) {
        this.snackBar.openSnackBar(
          this.translate.instant('pages.formBuilder.errors.selectApplication', {
            question: question.name,
            page: page.name,
          }),
          {
            error: true,
            duration: 15000,
          }
        );
        return false;
      }
    }
    return true;
  }

  /**
   * Add custom CSS classes to the survey elements.
   *
   * @param options survey options.
   */
  private onSetCustomCss(options: any): void {
    const classes = options.cssClasses;
    classes.content += ' shared-qst-content';
  }
}
