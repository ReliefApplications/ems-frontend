import { Dialog } from '@angular/cdk/dialog';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { difference, get, uniqBy } from 'lodash';
import { takeUntil } from 'rxjs';
import {
  Action,
  PageModel,
  QuestionFileModel,
  SurveyModel,
  surveyLocalization,
} from 'survey-core';
import { SurveyCreatorModel } from 'survey-creator-core';
import { Form } from '../../models/form.model';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { updateModalChoicesAndValue } from '../../survey/global-properties/reference-data';
import { removePosArtifacts } from '../../survey/components/utils/remove-pos-artifacts';
import { renderGlobalProperties } from '../../survey/render-global-properties';
import {
  SURVEY_PROP_CONFIRM_RECORD_UPDATE,
  SURVEY_PROP_CONFIRM_RECORD_UPDATE_IF,
} from '../../utils/survey-confirm-record-update.util';
import { Question } from '../../survey/types';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SurveyCustomJSONEditorPlugin } from './custom-json-editor/custom-json-editor.component';
import { FunctionReferenceModalComponent } from './function-reference-modal/function-reference-modal.component';

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
  styleUrls: ['../../style/survey.scss', './form-builder.component.scss'],
})
export class FormBuilderComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges, OnDestroy
{
  /**
   * Form object
   */
  @Input() form!: Form;
  /**
   * Event emitted when the form is saved
   */
  @Output() save: EventEmitter<any> = new EventEmitter();
  /**
   * Event emitted when the form is changed
   */
  @Output() formChange: EventEmitter<any> = new EventEmitter();

  // === CREATOR ===
  /**
   * SurveyJS creator model
   */
  surveyCreator!: SurveyCreatorModel;
  /**
   * JSON object of the form
   */
  public json: any;

  /**
   * List of related names
   */
  private relatedNames!: string[];
  /** Timeout to survey creator */
  private timeoutListener!: NodeJS.Timeout;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param dialog Angular Dialog service used to display dialog modals
   * @param snackBar Service that will be used to display the snackbar.
   * @param translate Angular translate service
   * @param formHelpersService Shared form helper service.
   * @param document document
   * @param injector Angular injector
   */
  constructor(
    public dialog: Dialog,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private formHelpersService: FormHelpersService,
    @Inject(DOCUMENT) private document: Document,
    private injector: Injector
  ) {
    super();
    // translate the editor in the same language as the interface
    surveyLocalization.currentLocale = this.translate.currentLang;
    this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      surveyLocalization.currentLocale = this.translate.currentLang;
      this.setFormBuilder(this.surveyCreator.text);
    });
  }

  ngOnInit(): void {
    this.setFormBuilder(get(this.form, 'structure', ''));
  }

  ngOnChanges(): void {
    if (this.surveyCreator) {
      this.surveyCreator.text = this.cleanStructure(this.form.structure || '');
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

      // add the rendering of custom properties
      this.surveyCreator.survey.onAfterRenderQuestion.add(
        renderGlobalProperties(this.injector)
      );
      this.surveyCreator.survey.onAfterRenderQuestion.add(
        this.formHelpersService.addQuestionTooltips
      );
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.timeoutListener) {
      clearTimeout(this.timeoutListener);
    }
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
      showJSONEditorTab: false,
      generateValidJSON: true,
      showTranslationTab: true,
      questionTypes: QUESTION_TYPES,
      allowChangeThemeInPreview: false,
    };

    this.surveyCreator = new SurveyCreatorModel(creatorOptions);

    // While a confirmation expression drives the behavior, the matching toggle
    // in the general settings is forced on and made read-only.
    this.surveyCreator.onPropertyGridSurveyCreated.add(
      (_: any, options: any) => {
        const grid: SurveyModel = options.survey;
        const toggle = grid.getQuestionByName(
          SURVEY_PROP_CONFIRM_RECORD_UPDATE
        );
        if (!toggle) {
          return;
        }
        const syncToggleState = () => {
          const hasExpression = !!grid.getValue(
            SURVEY_PROP_CONFIRM_RECORD_UPDATE_IF
          );
          toggle.readOnly = hasExpression;
          if (hasExpression) {
            toggle.value = true;
          }
        };
        syncToggleState();
        grid.onValueChanged.add((__: any, opt: any) => {
          if (opt.name === SURVEY_PROP_CONFIRM_RECORD_UPDATE_IF) {
            syncToggleState();
          }
        });
      }
    );

    this.surveyCreator.onPreviewSurveyCreated.add((_: any, options: any) => {
      const survey: SurveyModel = options.survey;
      survey.applyTheme({
        isPanelless: true,
      });
      survey.onAfterRenderQuestion.add(
        this.formHelpersService.addQuestionTooltips
      );
      this.formHelpersService.addUserVariables(survey);
      /** Apply all placeholder with limitation info to all file questions */
      survey
        .getAllQuestions()
        .filter((question) => question instanceof QuestionFileModel)
        .forEach((question) => {
          const text = surveyLocalization.getString(
            'oort:fileLimitations',
            (survey as SurveyModel).locale
          )(question);
          question.dragAreaPlaceholder = text;
        });
    });
    this.surveyCreator.haveCommercialLicense = true;
    // Strip any `pos` artifacts already stored in the form so the loaded model
    // ( and the JSON editor ) never carries them, regardless of save state.
    this.surveyCreator.text = this.cleanStructure(structure);
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.showToolbox = true;
    this.surveyCreator.toolboxLocation = 'right';
    this.surveyCreator.showSidebar = true;
    this.surveyCreator.sidebarLocation = 'right';

    if (!this.form.structure) {
      this.surveyCreator.survey.showQuestionNumbers = 'off';
    }
    new SurveyCustomJSONEditorPlugin(this.surveyCreator);

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

    this.addFunctionReferenceAction();

    // Notify parent that form structure has changed
    this.surveyCreator.onModified.add((survey: any) => {
      this.formChange.emit(this.cleanStructure(survey.text));
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
      if (this.timeoutListener) {
        clearTimeout(this.timeoutListener);
      }
      this.timeoutListener = setTimeout(() => {
        const el = this.document.querySelector('[data-name="' + name + '"]');
        el?.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // add the rendering of custom properties
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.injector)
    );
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      this.formHelpersService.addQuestionTooltips
    );

    this.surveyCreator.onPreviewSurveyCreated.add((sender: any, options: any) =>
      options.survey.onAfterRenderQuestion.add(
        renderGlobalProperties(this.injector)
      )
    );

    this.surveyCreator.onPropertyGridShowModal.add(updateModalChoicesAndValue);

    this.surveyCreator.survey.locale = surveyLocalization.currentLocale; // -> set the defaultLanguage property also

    // add move up/down buttons
    this.addAdorners();
  }

  /**
   * Add a toolbar button that opens the function reference modal.
   */
  private addFunctionReferenceAction(): void {
    const action = new Action({
      id: 'open-function-reference',
      iconName: 'icon-description',
      css: 'sv-action-bar-item--secondary',
      title: this.translate.instant('pages.formBuilder.functionReference.open'),
      showTitle: true,
      action: () => {
        this.dialog.open(FunctionReferenceModalComponent, {
          width: '720px',
          autoFocus: false,
        });
      },
    });
    this.surveyCreator.toolbar.actions.push(action);
  }

  /**
   * Add custom actions to the question action items bar
   */
  private addAdorners() {
    this.surveyCreator.onDefineElementMenuItems.add((_, options) => {
      const element = options.obj;
      // Only display for questions & panels
      if (element.isPage) {
        return;
      }

      // Add 'up' & 'down' adorners to panels & questions
      const parent = element.parent;
      if (!parent || !parent.elements) {
        return;
      }
      const index = parent.elements.indexOf(element);
      if (index > 0) {
        const moveUpAdorner = moveUpButton(element);
        options.items.push(moveUpAdorner);
      }
      if (index < parent.elements.length - 1) {
        const moveDownAdorner = moveDownButton(element);
        options.items.push(moveDownAdorner);
      }
    });

    const moveUpButton = (element: any) => {
      return new Action({
        id: 'moveUpButton',
        iconName: 'icon-arrow-up',
        css: 'sv-action-bar-item--secondary sv-action-bar-item__icon',
        title: this.translate.instant('pages.formBuilder.move.up'),
        action: () => {
          const parent = element.parent;
          const index = parent.elements.indexOf(element);
          if (index > 0) {
            // Remove from array
            parent.elements.splice(index, 1)[0];
            // Move into array
            parent.elements.splice(index - 1, 0, element);
          }
        },
      });
    };

    const moveDownButton = (element: any) => {
      return new Action({
        id: 'moveDownButton',
        iconName: 'icon-arrow-down',
        css: 'sv-action-bar-item--secondary sv-action-bar-item__icon',
        title: this.translate.instant('pages.formBuilder.move.down'),
        action: () => {
          const parent = element.parent;
          const index = parent.elements.indexOf(element);
          if (index < parent.elements.length - 1) {
            // Remove from array
            parent.elements.splice(index, 1)[0];
            // Move into array
            parent.elements.splice(index + 1, 0, element);
          }
        },
      });
    };
  }

  /**
   * Add new class to questions considered as core fields
   *
   * @param coreFields list of core fields
   */
  private addCustomClassToCoreFields(coreFields: string[]): void {
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      (survey: SurveyModel, options: any) => {
        if (coreFields.includes(options.question.valueName)) {
          options.htmlElement.children[0].className += ` ${CORE_FIELD_CLASS}`;
        }
      }
    );
  }

  /**
   * Strips SurveyJS `pos` parser artifacts from a serialized survey structure.
   * These artifacts ( objects with `start` / `end` offsets ) are attached to
   * free-form object properties such as `gridFieldsSettings` and nest deeper on
   * every save cycle, bloating the form definition. Cleaning the serialized
   * string ( plain, acyclic JSON ) keeps every persisted structure free of them.
   *
   * @param text Serialized survey structure ( JSON string )
   * @returns The structure with all `pos` artifacts removed
   */
  private cleanStructure(text: string): string {
    if (!text) {
      return text;
    }
    try {
      return JSON.stringify(removePosArtifacts(JSON.parse(text)));
    } catch {
      // If the structure is not valid JSON, leave it untouched.
      return text;
    }
  }

  /**
   * Custom SurveyJS method, save the form when edited.
   */
  saveMySurvey = () => {
    this.validateValueNames()
      .then((canCreate: boolean) => {
        if (canCreate) {
          this.save.emit(this.cleanStructure(this.surveyCreator.text));
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
      question.columns.forEach((x: any) => {
        x.text = x.text || x.value || x;
        x.value = this.formHelpersService.toSnakeCase(x.value || x.text || x);
      });
      question.rows.forEach((x: any) => {
        x.text = x.text || x.value || x;
        x.value = this.formHelpersService.toSnakeCase(x.value || x.text || x);
      });
    }
    if (question.getType() === 'matrixdropdown') {
      question.columns.forEach((x: any) => {
        x.title = x.title || x.name || x;
        x.name = this.formHelpersService.toSnakeCase(x.name || x.title || x);
      });
      question.rows.forEach((x: any) => {
        x.text = x.text || x.value || x;
        x.value = this.formHelpersService.toSnakeCase(x.value || x.text || x);
      });
    }
    if (['resource', 'resources'].includes(question.getType())) {
      // Check that relatedName is set and not duplicated
      if (!question.displayOnly) {
        // Skip check if display only
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
      }

      // Error if the user selected Add Record without adding a template.
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
}
