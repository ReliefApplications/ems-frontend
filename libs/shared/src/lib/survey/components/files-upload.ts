import { ComponentRef, Injector } from '@angular/core';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SvgRegistry,
  SurveyModel,
  ValueChangedEvent,
} from 'survey-core';
import { FilesUploadQuestionComponent } from '../../components/files-upload-question/files-upload-question.component';
import { DomService } from '../../services/dom/dom.service';
import { registerCustomPropertyHelp } from '../localization';
import {
  FILE_QUESTION_TYPE,
  FILES_UPLOAD_QUESTION_TYPE,
  getFileQuestionChoices,
  getLanguageChoices,
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
 * / `defaultLanguage` properties are part of the form structure and only
 * preselect the dropdowns: the files end up in the target file question's
 * value and are uploaded when the record is saved, like any other file.
 *
 * @param injector Parent Angular injector
 * @param componentCollection SurveyJS custom component collection
 */
export const init = (
  injector: Injector,
  componentCollection: ComponentCollection
): void => {
  const domService = injector.get(DomService);

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
        name: 'defaultLanguage',
        category: 'general',
        displayName: 'Default language',
        visibleIndex: 4,
        choices: (
          question: FilesUploadQuestion,
          choicesCallback: (choices: WidgetChoice[]) => void
        ) => {
          choicesCallback(
            getLanguageChoices(question.survey as SurveyModel | undefined)
          );
        },
      });
      registerCustomPropertyHelp(
        'defaultLanguage',
        'Language selected by default when the form opens. Available languages are the ones of the form: its translations and the target languages of its auto-translated questions. A form without translations offers every supported language.'
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

      // Keep the list of files to upload in sync with the files of the survey
      const valueChangedHandler = (
        _: SurveyModel,
        options: ValueChangedEvent
      ): void => {
        if (options.question?.getType() === FILE_QUESTION_TYPE) {
          componentRef.instance.refresh();
          componentRef.changeDetectorRef.detectChanges();
        }
      };
      survey?.onValueChanged.add(valueChangedHandler);

      addGridTeardown(componentRef, () => {
        survey?.onValueChanged.remove(valueChangedHandler);
        question.filesUploadComponentRef = undefined;
      });
      registerGridForCleanup(survey, componentRef, domService);
    },
  };
  componentCollection.add(component);
};
