import { ComponentRef, Injector } from '@angular/core';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SvgRegistry,
  SurveyModel,
} from 'survey-core';
import { FilesManagementQuestionComponent } from '../../components/files-management-question/files-management-question.component';
import { DomService } from '../../services/dom/dom.service';
import {
  addGridTeardown,
  destroyGrid,
  registerGridForCleanup,
} from './utils/grid-cleanup';
import { getLanguageChoices } from './utils/files-widgets.util';

/** SurveyJS type used by the files management question. */
export const FILES_MANAGEMENT_QUESTION_TYPE = 'filesmanagement';

/**
 * Properties shown in the form builder for a Files management question. Same
 * rationale as the Files upload question: it never stores a value of its own.
 */
export const FILES_MANAGEMENT_ALLOWED_PROPERTIES = [
  'name',
  'title',
  'description',
  'languageA',
  'languageB',
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

/** Files management custom question properties used during rendering. */
export interface FilesManagementQuestion extends SurveyQuestion {
  languageA?: string;
  languageB?: string;
  filesManagementComponentRef?: ComponentRef<FilesManagementQuestionComponent>;
}

/**
 * Registers the files management SurveyJS question: a front-end only widget
 * listing every file uploaded across all of the survey's file questions,
 * filtered to two languages picked for comparison. Like Files upload, its own
 * `languageA` / `languageB` selections are plain question properties (part of
 * the form structure), never part of `survey.data`.
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
    FILES_MANAGEMENT_QUESTION_TYPE,
    '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18"><path d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>'
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
      const languageChoicesFn = (
        question: FilesManagementQuestion,
        choicesCallback: (choices: { value: string; text: string }[]) => void
      ) => {
        choicesCallback(
          getLanguageChoices(question.survey as SurveyModel | undefined)
        );
      };
      Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
        name: 'languageA',
        category: 'general',
        displayName: 'Language A',
        visibleIndex: 0,
        choices: languageChoicesFn,
      });
      Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
        name: 'languageB',
        category: 'general',
        displayName: 'Language B',
        visibleIndex: 1,
        choices: languageChoicesFn,
      });
    },
    onLoaded: (question: FilesManagementQuestion): void => {
      question.readOnly = false;
      question.isRequired = false;
      question.hideNumber = true;
      question.titleLocation = 'top';
      // Same issue as Files upload's `targetField`: the property grid's
      // dropdown visually highlights its first choice without actually
      // assigning it, so the form can be saved without ever persisting
      // `languageA`/`languageB`. Assign the same defaults explicitly.
      const choices = getLanguageChoices(
        question.survey as SurveyModel | undefined
      );
      if (!question.languageA && choices.length > 0) {
        question.languageA = choices[0].value;
      }
      if (!question.languageB && choices.length > 0) {
        question.languageB = choices[1]?.value ?? choices[0].value;
      }
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

      addGridTeardown(componentRef, () => {
        question.filesManagementComponentRef = undefined;
      });
      registerGridForCleanup(survey, componentRef, domService);
    },
  };
  componentCollection.add(component);
};
