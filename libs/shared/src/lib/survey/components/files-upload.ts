import { ComponentRef, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SvgRegistry,
  SurveyModel,
} from 'survey-core';
import { FilesUploadQuestionComponent } from '../../components/files-upload-question/files-upload-question.component';
import { DomService } from '../../services/dom/dom.service';
import { registerCustomPropertyHelp } from '../localization';
import {
  ALLOWED_LANGUAGES_PROPERTY,
  FILES_UPLOAD_QUESTION_TYPE,
  getFileQuestionChoices,
  getLanguageChoices,
  observeFileQuestionsValues,
  WidgetChoice,
} from './utils/files-widgets.util';
import {
  addGridTeardown,
  destroyGrid,
  registerGridForCleanup,
} from './utils/grid-cleanup';

export { FILES_UPLOAD_QUESTION_TYPE };

/**
 * Properties shown in the form builder for a Files upload question. The
 * question never stores a value of its own ( the files it uploads end up in
 * the target file question instead ), so validation / data related options
 * are hidden, like for the Field history question.
 */
export const FILES_UPLOAD_ALLOWED_PROPERTIES = [
  'name',
  'title',
  'description',
  'targetField',
  ALLOWED_LANGUAGES_PROPERTY,
  'defaultLanguage',
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

/** Files upload custom question properties used during rendering. */
export interface FilesUploadQuestion extends SurveyQuestion {
  /** Name of the file question selected by default */
  targetField?: string;
  /** Languages the user can tag files with, empty for every language of the form */
  allowedLanguages?: string[];
  /** Language selected by default */
  defaultLanguage?: string;
  /** Rendered Angular component */
  filesUploadComponentRef?: ComponentRef<FilesUploadQuestionComponent>;
}

/**
 * Registers the Files upload SurveyJS question: a front-end only question
 * letting the user pick one of the survey's file questions and add files to
 * it, tagged with a language, without navigating to that question, while
 * listing every file of the survey waiting to be uploaded. Its `targetField`
 * / `allowedLanguages` / `defaultLanguage` properties are part of the form
 * structure ( so each form of a resource configures its own ) and only drive
 * the dropdowns: the files end up in the target file question's value and
 * are uploaded when the record is saved, like any other file.
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
    FILES_UPLOAD_QUESTION_TYPE,
    '<svg viewBox="0 -960 960 960"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>'
  );

  const component = {
    name: FILES_UPLOAD_QUESTION_TYPE,
    title: 'Files upload',
    iconName: `icon-${FILES_UPLOAD_QUESTION_TYPE}`,
    category: 'Custom Questions',
    questionJSON: {
      name: FILES_UPLOAD_QUESTION_TYPE,
      type: 'html',
    },
    onInit: (): void => {
      Serializer.addProperty(FILES_UPLOAD_QUESTION_TYPE, {
        name: 'targetField',
        category: 'general',
        displayName: 'Document type',
        visibleIndex: 3,
        choices: (
          question: FilesUploadQuestion,
          choicesCallback: (choices: WidgetChoice[]) => void
        ) => {
          choicesCallback(
            getFileQuestionChoices(question.survey as SurveyModel | undefined)
          );
        },
      });
      registerCustomPropertyHelp(
        'targetField',
        'Document type ( file question ) selected by default. Added files are placed in it and follow its restrictions ( accepted types, maximum size, number of files ). Users can pick another document type of the form when filling it.'
      );
      Serializer.addProperty(FILES_UPLOAD_QUESTION_TYPE, {
        name: `${ALLOWED_LANGUAGES_PROPERTY}:multiplevalues`,
        category: 'general',
        displayName: 'Allowed languages',
        visibleIndex: 4,
        choices: (
          question: FilesUploadQuestion,
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
        ALLOWED_LANGUAGES_PROPERTY,
        'Languages the user can tag files with, among the languages of the form: the system language and the languages of the form translations that the system supports. Leave empty to offer all of them. With a single allowed language, every file gets that language and the language cannot be changed.'
      );
      Serializer.addProperty(FILES_UPLOAD_QUESTION_TYPE, {
        name: 'defaultLanguage',
        category: 'general',
        displayName: 'Default language',
        visibleIndex: 5,
        dependsOn: [ALLOWED_LANGUAGES_PROPERTY],
        choices: (
          question: FilesUploadQuestion,
          choicesCallback: (choices: WidgetChoice[]) => void
        ) => {
          choicesCallback(
            getLanguageChoices(
              question.survey as SurveyModel | undefined,
              availableLanguages,
              translate,
              question.getPropertyValue(ALLOWED_LANGUAGES_PROPERTY) as
                | string[]
                | undefined
            )
          );
        },
      });
      registerCustomPropertyHelp(
        'defaultLanguage',
        'Language selected by default when the form opens, among the allowed languages.'
      );
    },
    onLoaded: (question: FilesUploadQuestion): void => {
      question.isRequired = false;
      question.hideNumber = true;
    },
    onAfterRender: (
      question: FilesUploadQuestion,
      element: HTMLElement
    ): void => {
      const content =
        element.querySelector<HTMLElement>('.sd-question__content') ?? element;
      const survey = question.survey as SurveyModel | undefined;
      destroyGrid(survey, question.filesUploadComponentRef, domService);
      const componentRef: ComponentRef<FilesUploadQuestionComponent> =
        domService.appendComponentToBody(FilesUploadQuestionComponent, content);
      question.filesUploadComponentRef = componentRef;
      componentRef.instance.survey = survey;
      componentRef.instance.question = question;
      componentRef.instance.refresh();
      componentRef.changeDetectorRef.detectChanges();

      // Keep the list of files to upload in sync with the files of the survey,
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

      addGridTeardown(componentRef, () => {
        stopObserving();
        question.filesUploadComponentRef = undefined;
      });
      registerGridForCleanup(survey, componentRef, domService);
    },
  };
  componentCollection.add(component);
};
