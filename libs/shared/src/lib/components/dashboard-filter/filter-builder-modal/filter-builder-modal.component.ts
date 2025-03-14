import {
  AfterViewInit,
  Component,
  Inject,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PageModel, SurveyModel } from 'survey-core';
import { SurveyCreatorModel } from 'survey-creator-core';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormService } from '../../../services/form/form.service';
import { CommonModule } from '@angular/common';
import { FormBuilderModule } from '../../form-builder/form-builder.module';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, SnackbarService, TooltipModule } from '@oort-front/ui';
import { DialogModule, AlertModule } from '@oort-front/ui';
import { renderGlobalProperties } from '../../../survey/render-global-properties';
import { FormHelpersService } from '../../../services/form-helper/form-helper.service';
import { Question } from '../../../survey/types';
import 'survey-core/survey.i18n.min.js';
import { SurveyCustomJSONEditorPlugin } from '../../form-builder/custom-json-editor/custom-json-editor.component';
import { updateModalChoicesAndValue } from '../../../survey/global-properties/reference-data';
//import 'survey-creator-core/survey-creator-core.i18n.min.js';

/**
 * Data passed to initialize the filter builder
 */
interface DialogData {
  surveyStructure: any;
}

/** Default filter structure */
const DEFAULT_STRUCTURE = {
  showQuestionNumbers: 'off',
};

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
  // 'image',
  'html',
  // 'signaturepad',
  // 'expression',
  // 'matrix',
  // 'matrixdropdown',
  // 'matrixdynamic',
  // 'multipletext',
  'panel',
  'paneldynamic',
];

/**
 * Allowed properties for a core question in a child form.
 */
const CORE_QUESTION_ALLOWED_PROPERTIES = [
  'name',
  'title',
  'size',
  'min',
  'max',
  'minValueExpression',
  'maxValueExpression',
  'minErrorText',
  'maxErrorText',
  'step',
  'maxLength',
  'placeholder',
  'dateMin',
  'dateMax',
  'description',
  'hideNumber',
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
  'choicesFromQuestion',
  'choices',
  'choicesFromQuestionMode',
  'choicesOrder',
  'choicesByUrl',
  'hideIfChoicesEmpty',
  'choicesVisibleIf',
  'choicesEnableIf',
  'readOnly',
  'isRequired',
  'placeHolder',
  'useSummaryTagMode',
  'enableIf',
  'visibleIf',
  'tooltip',
  'popupWidth',
  'referenceData',
  'referenceDataDisplayField',
  'isPrimitiveValue',
  'referenceDataVariableMapping',
  '_referenceData',
  '_graphQLVariables',
  'showSelectAllItem',
  'showNoneItem',
  'showClearButton',
  'bindings',
  'choicesMin',
  'choicesMax',
  'allowClear',
  'autoGrow',
  'labelTrue',
  'labelFalse',
  'valueTrue',
  'valueFalse',
  'valueName',
  'inputType',
  'html',
  'calendarType',
  'gqlUrl',
  'gqlQuery',
  'gqlPath',
  'gqlValueName',
  'gqlTitleName',
  'gqlVariableMapping',
];

/**
 * Filter builder component
 */
@Component({
  standalone: true,
  selector: 'shared-filter-builder-modal',
  templateUrl: './filter-builder-modal.component.html',
  styleUrls: [
    '../../../style/survey.scss',
    './filter-builder-modal.component.scss',
  ],
  imports: [
    CommonModule,
    FormBuilderModule,
    TranslateModule,
    TooltipModule,
    DialogModule,
    AlertModule,
    SurveyCreatorModule,
    ButtonModule,
  ],
})
export class FilterBuilderModalComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  /** Survey creator instance */
  surveyCreator!: SurveyCreatorModel;

  /**
   * Dialog component to build the filter
   *
   * @param formService Shared form service
   * @param dialogRef reference to the dialog component
   * @param data data passed to initialize the filter builder
   * @param formHelpersService Shared form helper service.
   * @param snackBar Service that will be used to display the snackbar.
   * @param injector Angular injector
   */
  constructor(
    private formService: FormService,
    private dialogRef: DialogRef<FilterBuilderModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private formHelpersService: FormHelpersService,
    private snackBar: SnackbarService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    // Initialize survey creator instance without custom questions
    this.formService.initialize({ customQuestions: false });
  }

  ngAfterViewInit(): void {
    this.setFormBuilder();
  }

  ngOnChanges(): void {
    if (this.surveyCreator) {
      this.surveyCreator.survey.onAfterRenderQuestion.add(
        this.formHelpersService.addQuestionTooltips
      );
    }
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
    this.surveyCreator = new SurveyCreatorModel(creatorOptions);

    this.surveyCreator.onPreviewSurveyCreated.add((_: any, options: any) => {
      const survey: SurveyModel = options.survey;
      survey.onAfterRenderQuestion.add(
        this.formHelpersService.addQuestionTooltips
      );
    });

    new SurveyCustomJSONEditorPlugin(this.surveyCreator);

    // this.surveyCreator.text = '';
    this.surveyCreator.showToolbox = true;
    this.surveyCreator.toolboxLocation = 'right';
    this.surveyCreator.showSidebar = true;
    this.surveyCreator.sidebarLocation = 'right';
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;
    this.surveyCreator.allowChangeThemeInPreview = false;

    // Block core fields edition
    this.surveyCreator.onShowingProperty.add((sender: any, opt: any) => {
      // opt: { obj: any, property: Survey.JsonObjectProperty, canShow: boolean and more...}
      const obj = opt.obj;
      if (!obj || !obj.page) {
        return;
      }

      // If it is a core field
      if (!CORE_QUESTION_ALLOWED_PROPERTIES.includes(opt.property.name)) {
        opt.canShow = false;
      }
    });

    // Set content
    const survey = new SurveyModel(
      this.data?.surveyStructure || DEFAULT_STRUCTURE
    );
    this.formHelpersService.addUserVariables(survey);
    this.surveyCreator.JSON = survey.toJSON();

    // add the rendering of custom properties
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.injector)
    );
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      this.formHelpersService.addQuestionTooltips
    );
    this.surveyCreator.onPreviewSurveyCreated.add((sender: any, opt: any) => {
      this.formHelpersService.addUserVariables(opt.survey);
      opt.survey.onAfterRenderQuestion.add(
        renderGlobalProperties(this.injector)
      );
    });

    this.surveyCreator.onPropertyGridShowModal.add(updateModalChoicesAndValue);
  }

  /**
   * Custom SurveyJS method, save the survey when edited.
   */
  saveMySurvey = () => {
    this.validateValueNames()
      .then((canCreate: boolean) => {
        if (canCreate) {
          this.dialogRef.close(this.surveyCreator.text as any);
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
    const survey = new SurveyModel(this.surveyCreator.JSON);
    const canCreate: boolean = survey.pages.every((page: PageModel) =>
      page.questions.every(
        // Created the valueName for every question. If valueName exists but with wrong format,
        // raise an error and don't create survey
        (question: Question) =>
          this.formHelpersService.setValueName(question, page)
      )
    );
    this.surveyCreator.JSON = survey.toJSON();
    return canCreate;
  }

  ngOnDestroy(): void {
    //Once we destroy the dashboard filter survey, set the survey creator with the custom questions config
    this.formService.initialize();
  }
}
