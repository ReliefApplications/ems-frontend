import { ComponentRef, Injector } from '@angular/core';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SvgRegistry,
  SurveyModel,
  ValueChangedEvent,
} from 'survey-core';
import { FilesManagementQuestionComponent } from '../../components/files-management-question/files-management-question.component';
import { DomService } from '../../services/dom/dom.service';
import { registerCustomPropertyHelp } from '../localization';
import {
  FILE_QUESTION_TYPE,
  FILES_MANAGEMENT_QUESTION_TYPE,
  HIDE_FILE_QUESTIONS_PROPERTY,
  getLanguageChoices,
  registerFileQuestionsVisibility,
  syncFileQuestionsVisibility,
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
  'languageA',
  'languageB',
  HIDE_FILE_QUESTIONS_PROPERTY,
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
  /** First language compared by default */
  languageA?: string;
  /** Second language compared by default */
  languageB?: string;
  /** Hide the survey's file questions, files being managed here */
  hideFileQuestions?: boolean;
  /** Rendered Angular component */
  filesManagementComponentRef?: ComponentRef<FilesManagementQuestionComponent>;
}

/**
 * Registers the Files management SurveyJS question: a front-end only question
 * listing every file held by the survey's file questions, filtered to two
 * languages picked for comparison, with download / outdated / remove actions.
 * Its `languageA` / `languageB` properties are part of the form structure and
 * only preselect the dropdowns. It can also hide the survey's file questions,
 * which then keep storing files and defining their restrictions while the
 * Files upload and Files management questions handle the user interactions.
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

  const languageChoices = (
    question: FilesManagementQuestion,
    choicesCallback: (choices: WidgetChoice[]) => void
  ) => {
    choicesCallback(
      getLanguageChoices(question.survey as SurveyModel | undefined)
    );
  };

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
        name: 'languageA',
        category: 'general',
        displayName: 'Language A',
        visibleIndex: 3,
        choices: languageChoices,
      });
      Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
        name: 'languageB',
        category: 'general',
        displayName: 'Language B',
        visibleIndex: 4,
        choices: languageChoices,
      });
      registerCustomPropertyHelp(
        'languageA',
        'First language compared by default. Available languages are the ones of the form: its translations and the target languages of its auto-translated questions. A form without translations offers every supported language.'
      );
      registerCustomPropertyHelp(
        'languageB',
        'Second language compared by default. Files tagged with one of the two languages, or with no language, are listed.'
      );
      Serializer.addProperty(FILES_MANAGEMENT_QUESTION_TYPE, {
        name: `${HIDE_FILE_QUESTIONS_PROPERTY}:boolean`,
        category: 'general',
        displayName: 'Hide file questions',
        default: false,
        visibleIndex: 5,
      });
      registerCustomPropertyHelp(
        HIDE_FILE_QUESTIONS_PROPERTY,
        'Hide the file questions of the form when filling it, so files are only uploaded through Files upload questions and managed through this table. File questions keep storing the files and defining their restrictions ( accepted types, maximum size, number of files ), and stay visible in the form builder.'
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

      // Keep the table in sync with the files of the survey
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

      // Hide the file questions when the question is configured so
      registerFileQuestionsVisibility(survey, element.ownerDocument);
      syncFileQuestionsVisibility(survey, element.ownerDocument);

      addGridTeardown(componentRef, () => {
        survey?.onValueChanged.remove(valueChangedHandler);
        question.filesManagementComponentRef = undefined;
      });
      registerGridForCleanup(survey, componentRef, domService);
    },
  };
  componentCollection.add(component);
};
