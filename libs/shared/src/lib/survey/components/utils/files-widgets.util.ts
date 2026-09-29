import { TranslateService } from '@ngx-translate/core';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { Question as SurveyQuestion, SurveyModel } from 'survey-core';
import { getLanguageName, toI18nLocale } from '../../../utils/languages';

/** SurveyJS question type name of a native file upload question. */
export const FILE_QUESTION_TYPE = 'file';
/** SurveyJS type used by the files upload question. */
export const FILES_UPLOAD_QUESTION_TYPE = 'filesupload';
/** SurveyJS type used by the files management question. */
export const FILES_MANAGEMENT_QUESTION_TYPE = 'filesmanagement';
/** Property of the files management question hiding the survey's file questions. */
export const HIDE_FILE_QUESTIONS_PROPERTY = 'hideFileQuestions';
/** Class toggled on hidden file questions ( see survey.scss ). */
export const FILE_QUESTION_HIDDEN_CLASS = 'file-question--hidden';
/** Key under which the file questions visibility handler is tracked on a survey. */
const VISIBILITY_HANDLER_KEY = '__fileQuestionsVisibilityHandler';

/** Generic dropdown choice. */
export interface WidgetChoice {
  value: string;
  text: string;
}

/**
 * Returns every file-type question of the survey, in survey order.
 *
 * @param survey Survey to inspect
 * @returns File questions found in the survey ( empty array if none / no survey )
 */
export const getFileQuestions = (
  survey: SurveyModel | undefined
): SurveyQuestion[] =>
  (survey?.getAllQuestions() ?? []).filter(
    (candidate) => candidate.getType() === FILE_QUESTION_TYPE
  );

/**
 * Builds the dropdown choices used to pick a target file question.
 *
 * @param survey Survey to inspect
 * @returns Choices, one per file-type question
 */
export const getFileQuestionChoices = (
  survey: SurveyModel | undefined
): WidgetChoice[] =>
  getFileQuestions(survey).map((question) => ({
    value: question.name,
    text: question.title || question.valueName || question.name,
  }));

/**
 * Languages of a form, computed on the front-end the same way the public
 * forms application restricts its language switch: the system's default
 * language, plus the locales used by the form's translations ( Translation
 * tab of the form builder ) that are available in the system.
 *
 * @param survey Survey to inspect
 * @param availableLanguages Languages available in the system ( environment ), default one first
 * @returns Language codes ( i18n / Angular convention ), default one first
 */
export const getSurveyLanguages = (
  survey: SurveyModel | undefined,
  availableLanguages: string[]
): string[] => {
  const usedLocales = survey?.getUsedLocales?.() ?? [];
  const formLanguages = usedLocales
    .map((locale) => toI18nLocale(locale))
    .filter((language) => availableLanguages.includes(language));
  return Array.from(
    new Set([...availableLanguages.slice(0, 1), ...formLanguages])
  );
};

/**
 * Builds the language choices for the files upload question.
 *
 * @param survey Survey to inspect
 * @param availableLanguages Languages available in the system ( environment ), default one first
 * @param translate Angular translation service, to display the language names
 * @returns Language choices
 */
export const getLanguageChoices = (
  survey: SurveyModel | undefined,
  availableLanguages: string[],
  translate: TranslateService
): WidgetChoice[] =>
  getSurveyLanguages(survey, availableLanguages).map((code) => ({
    value: code,
    text: getLanguageName(code, translate),
  }));

/**
 * Splits a file question's `acceptedTypes` ( same format as the native
 * `accept` HTML attribute, e.g. `.png,.jpg,image/*` ) into normalized tokens.
 *
 * @param acceptedTypes Comma separated list of extensions / mime types / wildcards
 * @returns Lower-cased, trimmed, non-empty tokens
 */
const parseAcceptedTypes = (acceptedTypes: string | undefined): string[] =>
  (acceptedTypes || '')
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => !!token);

/**
 * Checks whether a file's mime type / extension is covered by a file
 * question's `acceptedTypes`.
 *
 * @param file File being checked
 * @param tokens Accepted types tokens ( see {@link parseAcceptedTypes} )
 * @returns True when the file matches at least one entry ( or no restriction )
 */
const matchesAcceptedTypes = (file: File, tokens: string[]): boolean => {
  if (!tokens.length) {
    return true;
  }
  const fileName = file.name.toLowerCase();
  const fileType = (file.type || '').toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) {
      return fileName.endsWith(token);
    }
    if (token.endsWith('/*')) {
      return fileType.startsWith(token.slice(0, -1));
    }
    return fileType === token;
  });
};

/**
 * Builds the Kendo file select restrictions of a file question, so invalid
 * files are flagged inline by the file list itself:
 * - `maxFileSize` from `maxSize`,
 * - `allowedExtensions` from `acceptedTypes`, only when it holds extensions
 *   only ( Kendo cannot express mime types / wildcards, which are then checked
 *   by {@link checkFileRestrictions} instead ).
 *
 * @param question Target file question
 * @returns Kendo restrictions
 */
export const getKendoFileRestrictions = (
  question: SurveyQuestion
): FileRestrictions => {
  const tokens = parseAcceptedTypes(
    question.getPropertyValue('acceptedTypes') as string | undefined
  );
  const extensions = tokens
    .filter((token) => token.startsWith('.'))
    .map((token) => token.slice(1));
  const maxSize = Number(question.getPropertyValue('maxSize') || 0);
  return {
    ...(extensions.length && extensions.length === tokens.length
      ? { allowedExtensions: extensions }
      : {}),
    ...(maxSize > 0 ? { maxFileSize: maxSize } : {}),
  };
};

/** A restriction violated when staging files for upload. */
export interface FileRestrictionError {
  /** Translation key describing the violation. */
  key: string;
  /** Translation parameters ( e.g. the offending file name, the allowed count ). */
  params?: Record<string, unknown>;
}

/**
 * Validates files about to be staged against a target file question's
 * restrictions not covered by the Kendo file select ones: the number of
 * files ( `allowMultiple` / `allowedFileNumber`, read the same way
 * `FormBuilderService.checkFileUploadValidity` does ) and the accepted types
 * when they cannot be expressed as Kendo restrictions.
 *
 * @param question Target file question
 * @param existingCount Number of files already held by the question ( stored + already staged )
 * @param incoming Files about to be added
 * @returns The first violated restriction, or null when the files are valid
 */
export const checkFileRestrictions = (
  question: SurveyQuestion,
  existingCount: number,
  incoming: File[]
): FileRestrictionError | null => {
  if (!incoming.length) {
    return null;
  }
  const allowMultiple = !!question.getPropertyValue('allowMultiple');
  const allowedFileNumber = Number(
    question.getPropertyValue('allowedFileNumber') || 0
  );
  if (!allowMultiple && existingCount + incoming.length > 1) {
    return { key: 'components.filesUpload.errors.singleFileOnly' };
  }
  if (
    allowMultiple &&
    allowedFileNumber > 0 &&
    existingCount + incoming.length > allowedFileNumber
  ) {
    return {
      key: 'components.filesUpload.errors.maximumAllowedFiles',
      params: { number: allowedFileNumber },
    };
  }
  const tokens = parseAcceptedTypes(
    question.getPropertyValue('acceptedTypes') as string | undefined
  );
  if (!getKendoFileRestrictions(question).allowedExtensions) {
    const invalid = incoming.find(
      (file) => !matchesAcceptedTypes(file, tokens)
    );
    if (invalid) {
      return {
        key: 'components.filesUpload.errors.invalidType',
        params: { name: invalid.name },
      };
    }
  }
  return null;
};

/**
 * Whether the survey's file questions must be hidden: a visible files
 * management question asks for it. Never in the form builder, where the file
 * questions must stay reachable to configure their restrictions.
 *
 * @param survey Survey to inspect
 * @returns True when file questions must be hidden
 */
export const shouldHideFileQuestions = (
  survey: SurveyModel | undefined
): boolean =>
  !!survey &&
  !survey.isDesignMode &&
  survey
    .getAllQuestions()
    .some(
      (question) =>
        question.getType() === FILES_MANAGEMENT_QUESTION_TYPE &&
        question.isVisible &&
        !!question.getPropertyValue(HIDE_FILE_QUESTIONS_PROPERTY)
    );

/**
 * Hides / shows a rendered file question according to the survey. The
 * question is hidden through the DOM only: SurveyJS visibility would clear
 * its value on completion and skip its validation, while hidden file
 * questions must keep storing the files placed by the files upload question.
 *
 * @param survey Survey owning the file question
 * @param element Rendered question element ( or any element inside it )
 */
export const applyFileQuestionVisibility = (
  survey: SurveyModel | undefined,
  element: HTMLElement
): void => {
  const hidden = shouldHideFileQuestions(survey);
  const root = element.closest<HTMLElement>('.sd-question') ?? element;
  // SurveyJS wraps each question of a row in a flex column: hide it as well so
  // the hidden question does not leave an empty column behind
  const wrapper =
    root.parentElement?.parentElement?.classList.contains('sd-row') &&
    root.parentElement
      ? root.parentElement
      : root;
  wrapper.classList.toggle(FILE_QUESTION_HIDDEN_CLASS, hidden);
};

/**
 * Applies the current file questions visibility to every rendered file
 * question of the survey.
 *
 * @param survey Survey owning the file questions
 * @param document Document the survey is rendered in
 */
export const syncFileQuestionsVisibility = (
  survey: SurveyModel | undefined,
  document: Document
): void => {
  if (!survey) {
    return;
  }
  getFileQuestions(survey).forEach((question) => {
    const element = document.getElementById(question.id);
    if (element) {
      applyFileQuestionVisibility(survey, element);
    }
  });
};

/**
 * Keeps the file questions visibility in sync when a files management
 * question is shown / hidden by logic ( once per survey ). Newly rendered
 * file questions are handled by the file widget itself.
 *
 * @param survey Survey owning the file questions
 * @param document Document the survey is rendered in
 */
export const registerFileQuestionsVisibility = (
  survey: SurveyModel | undefined,
  document: Document
): void => {
  if (!survey) {
    return;
  }
  const host = survey as SurveyModel & Record<string, any>;
  if (host[VISIBILITY_HANDLER_KEY]) {
    return;
  }
  host[VISIBILITY_HANDLER_KEY] = true;
  survey.onVisibleChanged.add((_, options) => {
    if (options.question.getType() === FILES_MANAGEMENT_QUESTION_TYPE) {
      syncFileQuestionsVisibility(survey, document);
    }
  });
};
