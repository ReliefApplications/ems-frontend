import { ComponentRef, Injector } from '@angular/core';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SvgRegistry,
  SurveyModel,
} from 'survey-core';
import { FilesUploadQuestionComponent } from '../../components/files-upload-question/files-upload-question.component';
import { DomService } from '../../services/dom/dom.service';
import {
  addGridTeardown,
  destroyGrid,
  registerGridForCleanup,
} from './utils/grid-cleanup';
import { getFileQuestionChoices } from './utils/files-widgets.util';

/** SurveyJS type used by the files upload question. */
export const FILES_UPLOAD_QUESTION_TYPE = 'filesupload';

/**
 * Properties shown in the form builder for a Files upload question. The
 * question never stores a value of its own (the files it places end up on the
 * target file question instead), so validation / data related options are
 * hidden, mirroring the Field history question.
 */
export const FILES_UPLOAD_ALLOWED_PROPERTIES = [
  'name',
  'title',
  'description',
  'targetField',
  'visible',
  'visibleIf',
  'tooltip',
  'page',
  'startWithNewLine',
  'descriptionLocation',
  'indent',
  'width',
  'minWidth',
  'maxWidth',
];

/** Files upload custom question properties used during rendering. */
export interface FilesUploadQuestion extends SurveyQuestion {
  targetField?: string;
  language?: string;
  filesUploadComponentRef?: ComponentRef<FilesUploadQuestionComponent>;
}

/**
 * Registers the files upload SurveyJS question: a front-end only widget that
 * lets the user pick one of the survey's file questions and upload files to
 * it (tagged with a language) without scrolling to that field. Its own
 * `targetField` / `language` selections are plain SurveyJS question
 * properties (part of the form structure, like Field history's `field`
 * property), never part of `survey.data` — only the files it stages end up in
 * the target file question's value, submitted through the normal pipeline.
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
    '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>'
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
        displayName: 'Target file field',
        visibleIndex: 0,
        choices: (
          question: FilesUploadQuestion,
          choicesCallback: (choices: { value: string; text: string }[]) => void
        ) => {
          choicesCallback(
            getFileQuestionChoices(question.survey as SurveyModel | undefined)
          );
        },
      });
    },
    onLoaded: (question: FilesUploadQuestion): void => {
      question.readOnly = false;
      question.isRequired = false;
      question.hideNumber = true;
      question.titleLocation = 'top';
      // The property grid's `targetField` dropdown visually highlights its
      // first choice even when the question has no value yet, so without
      // this the form can be saved without ever actually persisting a
      // target field. Assign the same default explicitly.
      if (!question.targetField) {
        const choices = getFileQuestionChoices(
          question.survey as SurveyModel | undefined
        );
        if (choices.length > 0) {
          question.targetField = choices[0].value;
        }
      }
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

      addGridTeardown(componentRef, () => {
        question.filesUploadComponentRef = undefined;
      });
      registerGridForCleanup(survey, componentRef, domService);
    },
  };
  componentCollection.add(component);
};
