import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import * as SurveyCreator from 'survey-creator';
import * as Survey from 'survey-angular';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { SafeFormService } from '../../../services/form/form.service';
import { CommonModule } from '@angular/common';
import { SafeFormBuilderModule } from '../../form-builder/form-builder.module';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from '@oort-front/ui';
import { DialogModule, AlertModule } from '@oort-front/ui';
import { renderGlobalProperties } from '../../../survey/render-global-properties';
import { SafeReferenceDataService } from '../../../services/reference-data/reference-data.service';
/**
 * Data passed to initialize the filter builder
 */
interface DialogData {
  surveyStructure: any;
}

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
  // 'html',
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
  'enableIf',
  'visibleIf',
  'tooltip',
  'referenceData',
  'referenceDataDisplayField',
  'isPrimitiveValue',
  'referenceDataFilterFilterFromQuestion',
  'referenceDataFilterForeignField',
  'referenceDataFilterFilterCondition',
  'referenceDataFilterLocalField',
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
];

/**
 * Filter builder component
 */
@Component({
  standalone: true,
  selector: 'safe-filter-builder-modal',
  templateUrl: './filter-builder-modal.component.html',
  styleUrls: ['./filter-builder-modal.component.scss'],
  imports: [
    CommonModule,
    SafeFormBuilderModule,
    TranslateModule,
    TooltipModule,
    DialogModule,
    AlertModule,
  ],
})
export class FilterBuilderModalComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  surveyCreator!: SurveyCreator.SurveyCreator;

  /**
   * Dialog component to build the filter
   *
   * @param formService Shared form service
   * @param dialogRef reference to the dialog component
   * @param data data passed to initialize the filter builder
   * @param referenceDataService reference data service
   */
  constructor(
    private formService: SafeFormService,
    private dialogRef: DialogRef<FilterBuilderModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private referenceDataService: SafeReferenceDataService
  ) {}

  ngOnInit(): void {
    // Initialize survey creator instance without custom questions
    this.formService.setSurveyCreatorInstance({ customQuestions: false });
  }

  ngAfterViewInit(): void {
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
    };
    this.setCustomTheme();
    this.surveyCreator = new SurveyCreator.SurveyCreator(
      'dashboardSurveyCreatorContainer',
      creatorOptions
    );
    // this.surveyCreator.text = '';
    this.surveyCreator.showToolbox = 'right';
    this.surveyCreator.showPropertyGrid = 'right';
    this.surveyCreator.haveCommercialLicense = true;
    this.surveyCreator.survey.showQuestionNumbers = 'off';
    this.surveyCreator.saveSurveyFunc = this.saveMySurvey;

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

    // add the rendering of custom properties
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService)
    );
    (this.surveyCreator.onTestSurveyCreated as any).add(
      (sender: any, opt: any) =>
        opt.survey.onAfterRenderQuestion.add(
          renderGlobalProperties(this.referenceDataService)
        )
    );

    // Set content
    const survey = new Survey.SurveyModel(this.data?.surveyStructure || {});
    this.surveyCreator.JSON = survey.toJSON();
  }

  /**
   * Set a theme for the form builder depending on the environment
   */
  setCustomTheme(): void {
    Survey.StylesManager.applyTheme();
    SurveyCreator.StylesManager.applyTheme('default');
  }

  /**
   * Custom SurveyJS method, save the survey when edited.
   */
  saveMySurvey = () => {
    this.dialogRef.close(this.surveyCreator.text as any);
  };

  ngOnDestroy(): void {
    //Once we destroy the dashboard filter survey, set the survey creator with the custom questions config
    this.formService.setSurveyCreatorInstance();
  }
}
