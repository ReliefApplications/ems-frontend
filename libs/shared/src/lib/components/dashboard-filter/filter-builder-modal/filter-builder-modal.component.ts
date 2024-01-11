import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { PageModel, PanelModel, SurveyModel } from 'survey-core';
import { SurveyCreatorModel } from 'survey-creator-core';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { FormService } from '../../../services/form/form.service';
import { CommonModule } from '@angular/common';
import { FormBuilderModule } from '../../form-builder/form-builder.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule, SnackbarService, TooltipModule } from '@oort-front/ui';
import { DialogModule, AlertModule } from '@oort-front/ui';
import { renderGlobalProperties } from '../../../survey/render-global-properties';
import { ReferenceDataService } from '../../../services/reference-data/reference-data.service';
import { FormHelpersService } from '../../../services/form-helper/form-helper.service';
import { Question } from '../../../survey/types';
import 'survey-core/survey.i18n.min.js';
import {
  CustomJSONEditorComponent,
  SurveyCustomJSONEditorPlugin,
} from '../../form-builder/custom-json-editor/custom-json-editor.component';
import { takeUntil } from 'rxjs';
import { ConfirmService } from '../../../services/confirm/confirm.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
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
  'html',
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
    CustomJSONEditorComponent,
  ],
})
export class FilterBuilderModalComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  /** Survey creator instance */
  surveyCreator!: SurveyCreatorModel;
  /** Current expanded choices panel */
  private expandedChoicesPanel: PanelModel | null = null;

  /**
   * Dialog component to build the filter
   *
   * @param formService Shared form service
   * @param dialogRef reference to the dialog component
   * @param data data passed to initialize the filter builder
   * @param referenceDataService reference data service
   * @param formHelpersService Shared form helper service.
   * @param snackBar Service that will be used to display the snackbar.
   * @param confirmService Shared confirm service.
   * @param translate Service used to get the translations.
   */
  constructor(
    private formService: FormService,
    private dialogRef: DialogRef<FilterBuilderModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private referenceDataService: ReferenceDataService,
    private formHelpersService: FormHelpersService,
    private snackBar: SnackbarService,
    private translate: TranslateService,
    private confirmService: ConfirmService
  ) {
    super();
  }

  ngOnInit(): void {
    // Initialize survey creator instance without custom questions
    this.formService.initialize({ customQuestions: false });
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
    this.surveyCreator = new SurveyCreatorModel(creatorOptions);

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
    this.surveyCreator.JSON = survey.toJSON();

    // add the rendering of custom properties
    this.surveyCreator.survey.onAfterRenderQuestion.add(
      renderGlobalProperties(this.referenceDataService) as any
    );
    (this.surveyCreator.onTestSurveyCreated as any).add(
      (sender: any, opt: any) =>
        opt.survey.onAfterRenderQuestion.add(
          renderGlobalProperties(this.referenceDataService)
        )
    );

    // open the correct choices panel (tab) and set eventListeners
    this.initChoicesPanels();
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
   * Manage the logic for expanding and collapsing choices panels
   */
  private initChoicesPanels() {
    // expand a panel, collapse and clear the others
    const handleChoicesPanelExpansion = (
      panelToExpand: any,
      panels: PanelModel[],
      question: Question
    ) => {
      this.expandedChoicesPanel = panelToExpand;
      panels.forEach((panel: any) => {
        if (panel === panelToExpand) {
          panel.expand();
        } else {
          panel.collapse();
          // clear unused data
          if (panel.name == 'Choices from Reference data') {
            question.referenceData = undefined;
          } else if (panel.name == 'choicesByUrl') {
            question.choicesByUrl.processedUrl = '';
          }
        }
      });
      question.choices = undefined;
    };

    let choicesPanels: PanelModel[] = [];

    // when a form element is selected
    this.surveyCreator.onSelectedElementChanged.add((sender, options) => {
      const question = options.newSelectedElement;
      // get only choices panels
      choicesPanels = sender.propertyGrid
        .getAllPanels()
        .filter((panel) =>
          panel.name.toLowerCase().includes('choices')
        ) as PanelModel[];

      // only if more than one panel is loaded
      if (choicesPanels.length > 1) {
        // find current panel based on question data
        // the current code looks for the reference data first, then the API, and finally the static data
        // the panel name follows the same logic
        const currentPanelName = question.referenceData
          ? 'Choices from Reference data'
          : question.choicesByUrl.processedUrl
          ? 'choicesByUrl'
          : 'choices';
        const panelToExpand = choicesPanels.find(
          (panel) => panel.name === currentPanelName
        );
        // expand the corresponding panel
        handleChoicesPanelExpansion(panelToExpand, choicesPanels, question);

        // add an eventListener for each choices panel
        choicesPanels.forEach((panel: PanelModel) => {
          // listen onPropertyChanged because onExpanded does not exist
          // this makes the logic a lot more complex
          panel.onPropertyChanged.add((sender: any, options: any) => {
            // if you click on a closed panel
            if (
              options.newValue === 'expanded' &&
              this.expandedChoicesPanel != panel
            ) {
              // prevent clicked panel from being expanded without confirmation
              panel.collapse();

              // alert that panel switches will clear current choices
              const confirmDialogRef = this.confirmService.openConfirmModal({
                title: this.translate.instant(
                  'components.formBuilder.choicesTabAlert.expandTab'
                ),
                content: this.translate.instant(
                  'components.formBuilder.choicesTabAlert.confirmationMessage'
                ),
                confirmText: this.translate.instant(
                  'components.confirmModal.confirm'
                ),
                confirmVariant: 'danger',
              });
              confirmDialogRef.closed
                .pipe(takeUntil(this.destroy$))
                .subscribe((confirm: any) => {
                  if (confirm) {
                    // if true the new panel is expanded, others are collapsed
                    handleChoicesPanelExpansion(panel, choicesPanels, question);
                  }
                });
            } else if (
              options.newValue === 'collapsed' &&
              this.expandedChoicesPanel == panel
            ) {
              // prevent the current panel to be collapsed
              panel.expand();
            }
          });
        });
      }
    });

    // remove onPropertyChanged listeners
    this.surveyCreator.onSelectedElementChanging.add(() => {
      choicesPanels.forEach((panel: any) => {
        panel.onPropertyChanged.clear();
      });
    });
  }

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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    //Once we destroy the dashboard filter survey, set the survey creator with the custom questions config
    this.formService.initialize();
  }
}
