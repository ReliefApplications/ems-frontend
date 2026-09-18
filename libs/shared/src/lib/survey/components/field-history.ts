import { ComponentRef, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import {
  ComponentCollection,
  Question as SurveyQuestion,
  Serializer,
  SvgRegistry,
  SurveyModel,
} from 'survey-core';
import { FieldHistoryQuestionComponent } from '../../components/field-history-question/field-history-question.component';
import { Record } from '../../models/record.model';
import { DomService } from '../../services/dom/dom.service';
import {
  addGridTeardown,
  destroyGrid,
  registerGridForCleanup,
} from './utils/grid-cleanup';

/** SurveyJS type used by the field history question. */
export const FIELD_HISTORY_QUESTION_TYPE = 'field-history';

/** Survey property containing the shared history refresh stream. */
export const FIELD_HISTORY_REFRESH_PROPERTY = 'fieldHistoryRefresh';

/** Prefix distinguishing stable question references from legacy data fields. */
const FIELD_HISTORY_QUESTION_PREFIX = 'question:';

/** Question types which do not persist a value and cannot have field history. */
const NON_DATA_QUESTION_TYPES = new Set([
  FIELD_HISTORY_QUESTION_TYPE,
  'expression',
  'html',
  'image',
]);

/**
 * Properties shown in the form builder for a Field history question. The
 * question only displays the history of another field and never stores a value,
 * so data, validation, required, read-only & default value options are hidden.
 */
export const FIELD_HISTORY_ALLOWED_PROPERTIES = [
  'name',
  'title',
  'description',
  'field',
  'visible',
  'visibleIf',
  'tooltip',
  'page',
  'state',
  'startWithNewLine',
  'descriptionLocation',
  'indent',
  'width',
  'minWidth',
  'maxWidth',
];

/** Field history custom question properties used during rendering. */
interface FieldHistoryQuestion extends SurveyQuestion {
  field?: string;
  fieldHistoryComponentRef?: ComponentRef<FieldHistoryQuestionComponent>;
}

/** Choice displayed in the Field property editor. */
interface FieldChoice {
  value: string;
  text: string;
}

/** Native SurveyJS panel classes applied to the rendered question elements. */
const FIELD_HISTORY_PANEL_CLASSES = {
  root: [
    'sd-element--with-frame',
    'sd-element--complex',
    'sd-panel',
    'sd-row__panel',
  ],
  header: ['sd-panel__header'],
  content: ['sd-panel__content'],
  title: ['sd-panel__title'],
};

/**
 * Applies native panel classes to the currently rendered question DOM.
 *
 * @param element Field history question root
 */
export const applyFieldHistoryPanelDom = (element: HTMLElement): void => {
  // Custom questions use question markup, so apply SurveyJS's panel classes to
  // the equivalent elements instead of maintaining a parallel panel theme.
  element.classList.add(...FIELD_HISTORY_PANEL_CLASSES.root);
  element
    .querySelector<HTMLElement>('.sd-question__header')
    ?.classList.add(...FIELD_HISTORY_PANEL_CLASSES.header);
  element
    .querySelector<HTMLElement>('.sd-question__content')
    ?.classList.add(...FIELD_HISTORY_PANEL_CLASSES.content);
  element
    .querySelector<HTMLElement>('.sd-question__title')
    ?.classList.add(...FIELD_HISTORY_PANEL_CLASSES.title);
};

/**
 * Returns value-bearing questions available to a Field history question.
 *
 * @param question Field history question being configured
 * @returns Selectable field choices in current form order
 */
export const getFieldHistoryChoices = (
  question: FieldHistoryQuestion
): FieldChoice[] => {
  const survey = question.survey as SurveyModel | undefined;
  const selectedQuestion = getFieldHistoryTargetQuestion(question);
  return (survey?.getAllQuestions() ?? [])
    .filter(
      (candidate) =>
        candidate !== question &&
        !NON_DATA_QUESTION_TYPES.has(candidate.getType()) &&
        !(
          candidate.getType() === 'resources' &&
          candidate.getPropertyValue('displayOnly')
        )
    )
    .map((candidate) => ({
      value:
        candidate === selectedQuestion && question.field
          ? question.field
          : `${FIELD_HISTORY_QUESTION_PREFIX}${candidate.name}`,
      text: candidate.title || candidate.valueName || candidate.name,
    }))
    .filter((choice) => !!choice.value);
};

/**
 * Resolves the configured reference, preferring an exact data-field match.
 *
 * @param question Field history question being rendered
 * @returns Referenced SurveyJS question, or undefined when it was removed
 */
const getFieldHistoryTargetQuestion = (
  question: FieldHistoryQuestion
): SurveyQuestion | undefined => {
  const questions =
    (question.survey as SurveyModel | undefined)?.getAllQuestions() ?? [];
  if (question.field?.startsWith(FIELD_HISTORY_QUESTION_PREFIX)) {
    const questionName = question.field.slice(
      FIELD_HISTORY_QUESTION_PREFIX.length
    );
    return questions.find(
      (candidate) => candidate !== question && candidate.name === questionName
    );
  }
  return (
    questions.find(
      (candidate) =>
        candidate !== question && candidate.valueName === question.field
    ) ??
    questions.find(
      (candidate) => candidate !== question && candidate.name === question.field
    )
  );
};

/**
 * Resolves the selected question to its current data field.
 *
 * @param question Field history question being rendered
 * @returns Current data field, or undefined when the question was removed
 */
export const resolveFieldHistoryField = (
  question: FieldHistoryQuestion
): string | undefined => {
  const targetQuestion = getFieldHistoryTargetQuestion(question);
  return targetQuestion?.valueName || targetQuestion?.name;
};

/**
 * Configures the question to use its native SurveyJS title as a collapsible
 * panel header.
 *
 * @param question Field history question being loaded
 */
export const configureFieldHistoryQuestion = (
  question: FieldHistoryQuestion
): void => {
  // A read-only question gets a disabled title in editable surveys, unlike
  // panels in the same state
  question.readOnly = false;
  question.isRequired = false;
  question.hideNumber = true;
  question.titleLocation = 'top';
  if (question.state === 'default') {
    question.state = 'collapsed';
  }
};

/**
 * Checks whether history is unavailable for the current survey context.
 * Display mode is valid because existing records open read-only by default.
 *
 * @param survey Survey containing the Field history question
 * @param record Record displayed or edited by the survey
 * @returns True in the builder or before a record has been created
 */
export const isFieldHistoryNeutral = (
  survey: SurveyModel | undefined,
  record: Record | undefined
): boolean => !!survey?.isDesignMode || !record;

/**
 * Registers the field history SurveyJS question.
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
    FIELD_HISTORY_QUESTION_TYPE,
    '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18"><path d="M13 3a9 9 0 1 0 8.49 6h-2.12A7 7 0 1 1 13 5a6.96 6.96 0 0 1 4.95 2.05L15 10h7V3l-2.63 2.63A8.96 8.96 0 0 0 13 3Zm-1 4v6l5 3 .75-1.23-4.25-2.52V7H12Z"/></svg>'
  );

  const component = {
    name: FIELD_HISTORY_QUESTION_TYPE,
    title: 'Field history',
    iconName: `icon-${FIELD_HISTORY_QUESTION_TYPE}`,
    category: 'Custom Questions',
    questionJSON: {
      name: FIELD_HISTORY_QUESTION_TYPE,
      type: 'html',
      state: 'collapsed',
    },
    onInit: (): void => {
      Serializer.addProperty(FIELD_HISTORY_QUESTION_TYPE, {
        name: 'field',
        category: 'general',
        displayName: 'Field',
        required: true,
        visibleIndex: 0,
        choices: (
          question: FieldHistoryQuestion,
          choicesCallback: (choices: FieldChoice[]) => void
        ) => {
          choicesCallback(getFieldHistoryChoices(question));
        },
      });
    },
    onLoaded: (question: FieldHistoryQuestion): void => {
      configureFieldHistoryQuestion(question);
    },
    onAfterRender: (
      question: FieldHistoryQuestion,
      element: HTMLElement
    ): void => {
      applyFieldHistoryPanelDom(element);

      const content = element.querySelector<HTMLElement>(
        '.sd-question__content'
      );
      if (!content) {
        return;
      }

      const survey = question.survey as SurveyModel | undefined;
      destroyGrid(survey, question.fieldHistoryComponentRef, domService);
      const record = survey?.getPropertyValue('record') as Record | undefined;
      const componentRef: ComponentRef<FieldHistoryQuestionComponent> =
        domService.appendComponentToBody(
          FieldHistoryQuestionComponent,
          content
        );
      question.fieldHistoryComponentRef = componentRef;

      componentRef.instance.recordId = record?.id;
      componentRef.instance.neutral = isFieldHistoryNeutral(survey, record);
      componentRef.instance.refresh$ = survey?.getPropertyValue(
        FIELD_HISTORY_REFRESH_PROPERTY
      ) as Subject<string | undefined> | undefined;

      const updateField = () => {
        componentRef.instance.setField(resolveFieldHistoryField(question));
      };
      const updateExpandedState = () => {
        if (question.isExpanded) {
          componentRef.instance.onExpanded();
        } else {
          componentRef.instance.onCollapsed();
        }
      };
      const callbackKey = `${question.name}-field-history-field`;
      const stateCallbackKey = `${question.name}-field-history-state`;
      question.registerFunctionOnPropertyValueChanged(
        'field',
        updateField,
        callbackKey
      );
      question.registerFunctionOnPropertyValueChanged(
        'state',
        updateExpandedState,
        stateCallbackKey
      );
      updateField();
      updateExpandedState();
      addGridTeardown(componentRef, () => {
        question.unRegisterFunctionOnPropertyValueChanged('field', callbackKey);
        question.unRegisterFunctionOnPropertyValueChanged(
          'state',
          stateCallbackKey
        );
        question.fieldHistoryComponentRef = undefined;
      });
      registerGridForCleanup(survey, componentRef, domService);
    },
  };
  componentCollection.add(component);
};
