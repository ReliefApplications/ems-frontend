import { cloneDeep, isEqual } from 'lodash';
import {
  Base,
  JsonObjectProperty,
  Serializer,
  SurveyModel,
  SurveyTriggerSetValue,
} from 'survey-core';
import {
  editorLocalization,
  PropertyGridEditorCollection,
} from 'survey-creator-core';

/** Type name registered with the SurveyJS Serializer. */
export const SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE =
  'setvalueonfieldchangetrigger';

/** Survey property used to store the original data snapshot. */
const ORIGINAL_DATA_PROPERTY = 'setValueOnFieldChangeOriginalData';
/** Trigger property containing the source questions to monitor. */
const SOURCE_QUESTIONS_PROPERTY = 'sourceQuestions';

/** Survey data snapshot. */
type SurveyDataSnapshot = Record<string, unknown>;

/** Choice item used by the Survey Creator property grid. */
interface QuestionChoice {
  value: string;
  text: string;
}

/** Object shape exposed by SurveyJS question file values. */
interface SurveyFileValue {
  name?: unknown;
  type?: unknown;
  content?: unknown;
  file?: unknown;
}

/** Browser File shape used for stable comparison. */
interface BrowserFileValue {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

/** Object that can expose its parent survey. */
interface SurveyAccessor {
  survey?: unknown;
  getSurvey?: (live?: boolean) => unknown;
  owner?: unknown;
  errorOwner?: unknown;
  locOwner?: unknown;
  originalObj?: unknown;
}

/** Object that exposes SurveyModel question lookup. */
interface SurveyModelLike {
  getAllQuestions: SurveyModel['getAllQuestions'];
}

/**
 * Checks whether a value can be used as a SurveyModel.
 *
 * @param value Value to check
 * @returns true when the value exposes SurveyModel methods used here
 */
const isSurveyModelLike = (value: unknown): value is SurveyModelLike =>
  !!value &&
  typeof (value as { getAllQuestions?: unknown }).getAllQuestions ===
    'function';

/**
 * Returns the survey attached to a property-grid object.
 *
 * @param obj SurveyJS object edited by the property grid
 * @param visited Objects already checked while following Creator ownership links
 * @returns Parent survey, when available
 */
const getSurveyFromObject = (
  obj: unknown,
  visited: Set<unknown> = new Set()
): SurveyModel | undefined => {
  if (!obj || visited.has(obj)) {
    return undefined;
  }
  visited.add(obj);
  if (isSurveyModelLike(obj)) {
    return obj as SurveyModel;
  }
  const accessor = obj as SurveyAccessor;
  const directSurvey = accessor.survey ?? accessor.getSurvey?.(true);
  if (isSurveyModelLike(directSurvey)) {
    return directSurvey as SurveyModel;
  }
  return [
    accessor.owner,
    accessor.errorOwner,
    accessor.locOwner,
    accessor.originalObj,
  ].reduce<SurveyModel | undefined>(
    (survey, candidate) => survey ?? getSurveyFromObject(candidate, visited),
    undefined
  );
};

/**
 * Builds choices for all questions in the survey.
 *
 * @param survey Current survey
 * @returns Question choices for the source field selector
 */
const getQuestionChoices = (survey?: SurveyModel): QuestionChoice[] =>
  (survey?.getAllQuestions() ?? [])
    .filter((question) => !!question.name)
    .map((question) => ({ value: question.name, text: question.name }));

/** Custom Survey Creator editor for selecting multiple source questions. */
const sourceQuestionsEditor = {
  fit: (prop: JsonObjectProperty): boolean =>
    prop.name === SOURCE_QUESTIONS_PROPERTY &&
    prop.classInfo?.name === SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE,
  getJSON: (obj: Base): Record<string, unknown> => ({
    type: 'checkbox',
    colCount: 1,
    choices: getQuestionChoices(getSurveyFromObject(obj)),
  }),
};

/** Register the custom property grid editor once. */
const registerSourceQuestionsEditor = (): void => {
  if (PropertyGridEditorCollection.editors.includes(sourceQuestionsEditor)) {
    return;
  }
  PropertyGridEditorCollection.register(sourceQuestionsEditor);
};

/**
 * Checks whether a value is one of the empty representations used by SurveyJS.
 *
 * @param value Survey value
 * @returns true when the value is empty
 */
const isEmptyValue = (value: unknown): boolean =>
  value === undefined || value === null || value === '';

/**
 * Checks whether a value is a plain object.
 *
 * @param value Value to check
 * @returns true when the value is a plain object
 */
const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Object.prototype.toString.call(value) === '[object Object]';

/**
 * Checks whether a value has the SurveyJS file-value shape.
 *
 * @param value Value to check
 * @returns true when the value is a SurveyJS file value
 */
const isSurveyFileValue = (value: unknown): value is SurveyFileValue =>
  isPlainObject(value) &&
  typeof value['name'] === 'string' &&
  Object.prototype.hasOwnProperty.call(value, 'content');

/**
 * Checks whether a value is a browser File instance when File is available.
 *
 * @param value Value to check
 * @returns true when the value is a File
 */
const isBrowserFile = (value: unknown): value is BrowserFileValue => {
  const FileConstructor = (
    globalThis as { File?: new (...args: never[]) => BrowserFileValue }
  ).File;
  return !!FileConstructor && value instanceof FileConstructor;
};

/**
 * Normalizes SurveyJS values before comparison.
 *
 * @param value Value to normalize
 * @returns Comparable value
 */
const normalizeSurveyValue = (value: unknown): unknown => {
  if (isEmptyValue(value)) {
    return null;
  }
  if (isBrowserFile(value)) {
    return {
      name: value.name,
      type: value.type,
      size: value.size,
      lastModified: value.lastModified,
    };
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSurveyValue(item));
  }
  if (!isPlainObject(value)) {
    return value;
  }

  return Object.keys(value)
    .filter((key) => !(isSurveyFileValue(value) && key === 'file'))
    .sort()
    .reduce<Record<string, unknown>>((normalized, key) => {
      const normalizedValue = normalizeSurveyValue(value[key]);
      if (normalizedValue !== null) {
        normalized[key] = normalizedValue;
      }
      return normalized;
    }, {});
};

/**
 * Checks whether a source field differs between two snapshots.
 *
 * @param originalData Initial survey data
 * @param currentData Current survey data
 * @param fieldName Field to compare
 * @returns true when the field changed
 */
const hasFieldChanged = (
  originalData: SurveyDataSnapshot,
  currentData: SurveyDataSnapshot,
  fieldName: string
): boolean =>
  !isEqual(
    normalizeSurveyValue(originalData[fieldName]),
    normalizeSurveyValue(currentData[fieldName])
  );

/**
 * Trigger that sets a target value when one or more source fields changed.
 *
 * This trigger is not condition-driven. It is evaluated manually by the host
 * form components during save, after initial data loading and before the record
 * mutation is sent.
 */
export class SurveyTriggerSetValueOnFieldChange extends SurveyTriggerSetValue {
  /**
   * Identifier used by the SurveyJS Serializer to (de)serialize this trigger.
   *
   * @returns The serializer type name of this trigger
   */
  override getType(): string {
    return SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE;
  }

  /**
   * Source questions monitored by the trigger.
   *
   * @returns Source question names
   */
  get sourceNames(): string[] {
    const directValue = (this as unknown as Record<string, unknown>)[
      SOURCE_QUESTIONS_PROPERTY
    ];
    const value =
      directValue ?? this.getPropertyValue(SOURCE_QUESTIONS_PROPERTY);
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
    return typeof value === 'string' && value ? [value] : [];
  }

  /**
   * Disable the survey's normal condition-driven evaluation for this trigger.
   *
   * @returns Always false
   */
  protected override canBeExecuted(): boolean {
    return false;
  }

  /**
   * Sets the target value when any configured source field changed.
   *
   * @param survey Survey to update
   * @param originalData Original survey data snapshot
   */
  public fire(survey: SurveyModel, originalData: SurveyDataSnapshot): void {
    if (!this.setToName || !this.sourceNames.length) {
      return;
    }
    const currentData = (survey.data ?? {}) as SurveyDataSnapshot;
    const shouldSetValue = this.sourceNames.some((sourceName) =>
      hasFieldChanged(originalData, currentData, sourceName)
    );
    if (shouldSetValue) {
      survey.setValue(this.setToName, this.setValue);
    }
  }
}

/**
 * Register the custom trigger class with the SurveyJS Serializer.
 */
export const registerSetValueOnFieldChangeTrigger = (): void => {
  registerSourceQuestionsEditor();
  if (Serializer.findClass(SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE)) return;

  Serializer.addClass(
    SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE,
    [
      { name: 'expression', visible: false },
      {
        name: `${SOURCE_QUESTIONS_PROPERTY}:text`,
        displayName: 'Fields to monitor',
      },
      { name: 'setToName:questionvalue', displayName: 'Target question' },
      { name: 'setValue:triggervalue', displayName: 'Value to set' },
    ],
    () => new SurveyTriggerSetValueOnFieldChange(),
    'surveytrigger'
  );

  const editorEn = editorLocalization.getLocale('en');
  editorEn.triggers = editorEn.triggers || {};
  editorEn.triggers[SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE] =
    'Set value on field change';
  const editorFr = editorLocalization.getLocale('fr');
  if (editorFr !== editorEn) {
    editorFr.triggers = editorFr.triggers || {};
    editorFr.triggers[SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE] =
      "Définir une valeur à la modification d'un champ";
  }
};

/**
 * Stores the original survey data used by Set value on field change triggers.
 *
 * @param survey Survey instance
 */
export const captureFieldChangeInitialData = (survey: SurveyModel): void => {
  survey.setPropertyValue(
    ORIGINAL_DATA_PROPERTY,
    cloneDeep((survey.data ?? {}) as SurveyDataSnapshot)
  );
};

/**
 * Fire all `setvalueonfieldchangetrigger` instances on the survey.
 *
 * @param survey Survey instance
 */
export const fireFieldChangeTriggers = (survey: SurveyModel): void => {
  const originalData = (survey.getPropertyValue(ORIGINAL_DATA_PROPERTY) ??
    {}) as SurveyDataSnapshot;
  survey.triggers
    .filter(
      (trigger) => trigger.getType() === SET_VALUE_ON_FIELD_CHANGE_TRIGGER_TYPE
    )
    .forEach((trigger) =>
      (trigger as SurveyTriggerSetValueOnFieldChange).fire(survey, originalData)
    );
};

/**
 * Fire Set value on field change triggers only for existing-record updates.
 *
 * @param survey Survey instance
 * @param isRecordUpdate Whether the current save updates an existing record
 */
export const fireFieldChangeTriggersForRecordUpdate = (
  survey: SurveyModel,
  isRecordUpdate: boolean
): void => {
  if (!isRecordUpdate) {
    return;
  }
  fireFieldChangeTriggers(survey);
};
