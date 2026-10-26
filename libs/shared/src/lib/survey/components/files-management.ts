import { ComponentRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SvgRegistry,
  SurveyModel,
} from 'survey-core';
import { FilesManagementQuestionComponent } from '../../components/files-management-question/files-management-question.component';
import { DomService } from '../../services/dom/dom.service';
import { registerCustomPropertyHelp } from '../localization';
import {
  ALLOW_TRANSLATIONS_PROPERTY,
  FILES_MANAGEMENT_QUESTION_TYPE,
  getLanguageChoices,
  HIDE_FILE_QUESTIONS_PROPERTY,
  observeFileQuestionsValues,
  registerFileQuestionsVisibility,
  syncFileQuestionsVisibility,
  TRANSLATION_LANGUAGES_PROPERTY,
  WidgetChoice,
} from './utils/files-widgets.util';
import {
  addGridTeardown,
  destroyGrid,
  registerGridForCleanup,
} from './utils/grid-cleanup';

export { FILES_MANAGEMENT_QUESTION_TYPE };

/**
 * Properties shown in the form builder for a Files management question. Same
 * rationale as the Files upload question: it never stores a value of its own.
 */
export const FILES_MANAGEMENT_ALLOWED_PROPERTIES = [
  'name',
  'title',
  'description',
  HIDE_FILE_QUESTIONS_PROPERTY,
  ALLOW_TRANSLATIONS_PROPERTY,
  TRANSLATION_LANGUAGES_PROPERTY,
  'visible',
  'visibleIf',
  'tooltip',
  'page',
  'titleLocation',
  'descriptionLocation',
  'startWithNewLine',
  'indent',
  'width',
  'minWidth',
  'maxWidth',
];

/** Files management custom question properties used during rendering. */
export interface FilesManagementQuestion extends SurveyQuestion {
  /** Hide the survey's file questions, files being managed here */
  hideFileQuestions?: boolean;
  /** Let users upload translations of the listed files */
  allowTranslations?: boolean;
  /** Languages the files can be translated into, empty for every language of the form */
  translationLanguages?: string[];
  /** Rendered Angular component */
  filesManagementComponentRef?: ComponentRef<FilesManagementQuestionComponent>;
}

/**
 * Registers the Files management SurveyJS question: a front-end only question
 * listing every file held by the survey's file questions, with the same
 * download / outdated / remove actions as the file questions. It can also
 * hide the survey's file questions, which then keep storing files and
 * defining their restrictions while the Files upload and Files management
 * questions handle the user interactions. It can also let users upload
 * translations of the listed files, into the languages it is configured
 * with: the translations are stored in the same file question as the file
 * they translate ( same restrictions ), linked to it by a shared key.
 *
 * @param injector Parent Angular injector
 * @param componentCollection SurveyJS custom component collection
 */
export const init = (
  injector: Injector,
  componentCollection: ComponentCollection
): void => {
  const domService = injector.get(DomService);
  const translate = injector.get(TranslateService);
  const availableLanguages: string[] =
    injector.get('environment')?.availableLanguages ?? [];

  SvgRegistry.registerIconFromSvg(
    FILES_MANAGEMENT_QUESTION_TYPE,
    '<svg viewBox="0 -960 960 960"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>'
  );

  const component = {
    name: FILES_MANAGEMENT_QUESTION_TYPE,
    title: 'Files management',
    iconName: `icon-${FILES_MANAGEMENT_QUESTION_TYPE}`,
    category: 'Custom Questions',
    questionJSON: {
      name: FILES_MANAGEMENT_QUESTION_TYPE,
      type: 'html',
    },
    onInit: (): void => {
      Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
        name: `${HIDE_FILE_QUESTIONS_PROPERTY}:boolean`,
        category: 'general',
        displayName: 'Hide file questions',
        default: false,
        visibleIndex: 3,
      });
      registerCustomPropertyHelp(
        HIDE_FILE_QUESTIONS_PROPERTY,
        'Hide the file questions of the form when filling it, so files are only uploaded through Files upload questions and managed through this table. File questions keep storing the files and defining their restrictions ( accepted types, maximum size, number of files ), and stay visible in the form builder.'
      );
      Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
        name: `${ALLOW_TRANSLATIONS_PROPERTY}:boolean`,
        category: 'general',
        displayName: 'Allow translations',
        default: false,
        visibleIndex: 4,
      });
      registerCustomPropertyHelp(
        ALLOW_TRANSLATIONS_PROPERTY,
        'Let users upload a translation of the listed files, into the translation languages missing for each file. A translation is stored in the same file question as the file it translates and follows its restrictions ( accepted types, maximum size, number of files ). The table then shows which files are translated and which translations they are linked to. The option belongs to this form only: other forms of the resource keep listing every file as usual.'
      );
      Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
        name: `${TRANSLATION_LANGUAGES_PROPERTY}:multiplevalues`,
        category: 'general',
        displayName: 'Translation languages',
        visibleIndex: 5,
        dependsOn: [ALLOW_TRANSLATIONS_PROPERTY],
        visibleIf: (question: FilesManagementQuestion): boolean =>
          !!question.getPropertyValue(ALLOW_TRANSLATIONS_PROPERTY),
        choices: (
          question: FilesManagementQuestion,
          choicesCallback: (choices: WidgetChoice[]) => void
        ) => {
          choicesCallback(
            getLanguageChoices(
              question.survey as SurveyModel | undefined,
              availableLanguages,
              translate
            )
          );
        },
      });
      registerCustomPropertyHelp(
        TRANSLATION_LANGUAGES_PROPERTY,
        'Languages the files can be translated into, among the languages of the form: the system language and the languages of the form translations that the system supports. Leave empty to offer all of them.'
      );
    },
    onLoaded: (question: FilesManagementQuestion): void => {
      question.isRequired = false;
      question.hideNumber = true;
    },
    onAfterRender: (
      question: FilesManagementQuestion,
      element: HTMLElement
    ): void => {
      const content =
        element.querySelector<HTMLElement>('.sd-question__content') ?? element;
      const survey = question.survey as SurveyModel | undefined;
      destroyGrid(survey, question.filesManagementComponentRef, domService);
      const componentRef: ComponentRef<FilesManagementQuestionComponent> =
        domService.appendComponentToBody(
          FilesManagementQuestionComponent,
          content
        );
      question.filesManagementComponentRef = componentRef;
      componentRef.instance.survey = survey;
      componentRef.instance.question = question;
      componentRef.instance.refresh();
      componentRef.changeDetectorRef.detectChanges();

      // Keep the table in sync with the files of the survey,
      // however they change ( user edits, draft record loaded once the form
      // is rendered )
      const stopObserving = observeFileQuestionsValues(
        survey,
        question.id,
        () => {
          componentRef.instance.refresh();
          componentRef.changeDetectorRef.detectChanges();
        }
      );

      // Hide the file questions when the question is configured so
      registerFileQuestionsVisibility(survey, element.ownerDocument);
      syncFileQuestionsVisibility(survey, element.ownerDocument);

      addGridTeardown(componentRef, () => {
        stopObserving();
        question.filesManagementComponentRef = undefined;
      });
      registerGridForCleanup(survey, componentRef, domService);
    },
  };
  componentCollection.add(component);
};
